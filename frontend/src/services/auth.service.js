import axios from 'axios'

class AuthService {
  constructor() {
    this.axios = axios.create({
      baseURL: '/api/auth',
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
            // 刷新令牌失败，需要重新登录
            this.logout()
            return Promise.reject(err)
          }
        }
        return Promise.reject(error)
      },
    )
  }

  async login(username, password) {
    const response = await this.axios.post('/login', { username, password })
    const { accessToken, refreshToken } = response.data

    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    this.axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`

    return response.data
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }

    return await this.axios.post('/refresh', null, {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    })
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      this.axios.post('/logout')
    }

    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    delete this.axios.defaults.headers.common['Authorization']
  }
}

export default new AuthService()
