import axios from 'axios'

class AuthService {
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

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const response = await this.refreshToken()
            const { accessToken } = response.data

            localStorage.setItem('token', accessToken)
            this.axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${accessToken}`
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

  async login(username, password) {
    try {
      const response = await this.axios.post('/login', {
        loginId: username,
        password: password,
      })

      const { accessToken } = response.data
      if (accessToken) {
        localStorage.setItem('token', accessToken)
        this.axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`

        // 创建一个基本的用户对象
        const user = {
          username: username,
          // 可以添加其他默认用户信息
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

  async refreshToken() {
    return await this.axios.post('/refresh')
  }

  async logout() {
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
