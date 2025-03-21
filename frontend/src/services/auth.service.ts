import request from '@/utils/axios';
import type { AxiosResponse } from 'axios';

interface User {
    username: string;
    email?: string;
    avatar?: string | null;
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
    async register(username: string, email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await request.post<AuthResponse>('/auth/register', {
                username,
                email,
                password,
            } as RegisterRequest);

            const { accessToken, user } = response.data;
            if (accessToken) {
                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                return response.data;
            }
            throw new Error('Registration failed: No access token received');
        } catch (error) {
            console.error('Registration API error:', error);
            throw error;
        }
    }

    async login(username: string, password: string): Promise<AuthResponse> {
        try {
            const response = await request.post<AuthResponse>('/auth/login', {
                loginId: username,
                password: password,
            } as LoginRequest);

            const { accessToken, user } = response.data;
            if (accessToken) {
                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(user));
                return response.data;
            }
            throw new Error('Login failed: No access token received');
        } catch (error) {
            console.error('Login API error:', error);
            throw error;
        }
    }

    async refreshToken(): Promise<AxiosResponse> {
        return await request.post('/auth/refresh');
    }

    async logout(): Promise<void> {
        try {
            await request.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}

export default new AuthService();