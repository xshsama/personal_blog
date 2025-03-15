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
      }

      return response.data
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  }

  async refreshToken() {
    return await this.axios.post('/refresh')
  }

  logout() {
    this.axios.post('/logout')
    localStorage.removeItem('token')
    delete this.axios.defaults.headers.common['Authorization']
  }
}

export default new AuthService()
