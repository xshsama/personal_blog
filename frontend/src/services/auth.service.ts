import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface User {
    username: string;
    email?: string;
    avatar: string | null;
}

interface AuthResponse {
    accessToken: string;
    user: User;
}

interface LoginRequest {
    loginId: string;
    password: string;
}

interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

class AuthService {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: 'http://localhost:9090/api/auth',
            withCredentials: true,
        })

        // 添加响应拦截器处理token过期
        this.axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true
                    try {
                        const response = await this.refreshToken()
                        const { accessToken } = response.data
                        localStorage.setItem('token', accessToken)
                        this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
                        return this.axios(originalRequest)
                    } catch (err) {
                        this.logout()
                        return Promise.reject(err)
                    }
                }
                return Promise.reject(error)
            },
        )
    }

    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await this.axios.post<{ accessToken: string }>('/register', {
                username,
                email,
                password,
            } as RegisterRequest)

            const { accessToken } = response.data
            if (accessToken) {
                localStorage.setItem('token', accessToken)
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                const user: User = {
                    username,
                    email,
                    avatar: null,
                }
                localStorage.setItem('user', JSON.stringify(user))
                return {
                    accessToken,
                    user,
                }
            }
            throw new Error('Registration failed: No access token received')
        } catch (error) {
            console.error('Registration API error:', error)
            throw error
        }
    }

    async login(username: string, password: string): Promise<AuthResponse> {
        try {
            const response = await this.axios.post<{ accessToken: string }>('/login', {
                loginId: username,
                password: password,
            } as LoginRequest)

            const { accessToken } = response.data
            if (accessToken) {
                localStorage.setItem('token', accessToken)
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                const user: User = {
                    username,
                    avatar: null,
                }
                localStorage.setItem('user', JSON.stringify(user))
                return {
                    accessToken,
                    user,
                }
            }
            throw new Error('Login failed: No access token received')
        } catch (error) {
            console.error('Login API error:', error)
            throw error
        }
    }

    async refreshToken(): Promise<AxiosResponse> {
        return await this.axios.post('/refresh')
    }

    async logout(): Promise<void> {
        try {
            await this.axios.post('/logout')
        } finally {
            // 确保即使请求失败也清理本地状态
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete this.axios.defaults.headers.common['Authorization']
        }
    }
}

export default new AuthService()