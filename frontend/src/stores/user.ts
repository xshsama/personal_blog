import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export interface UserInfo {
  id: number | null
  username: string
  nickname: string
  avatar: string
  email: string
  role: string
}

interface State {
  token: string | null
  userInfo: UserInfo
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: 'mock-token', // 模拟永久token
    userInfo: {
      id: null,
      username: '',
      nickname: '',
      avatar: '',
      email: '',
      role: ''
    }
  }),

  getters: {
    isLoggedIn(): boolean {
      return !!this.token
    },
    hasRole(): (role: string) => boolean {
      return (role: string): boolean => this.userInfo.role === role
    },
    getToken(): string | null {
      return this.token
    },
    getUserInfo(): UserInfo {
      return this.userInfo
    }
  },

  actions: {
    setToken(token: string): void {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo: Partial<UserInfo>): void {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },

    clearUserData(): void {
      this.token = null
      this.userInfo = {
        id: null,
        username: '',
        nickname: '',
        avatar: '',
        email: '',
        role: ''
      }
      localStorage.removeItem('token')
    },

    async login(username: string, password: string): Promise<boolean> {
      // 模拟登录成功
      this.setToken('mock-token')
      this.setUserInfo({
        id: 1,
        username: username,
        nickname: '测试用户',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        email: 'test@example.com',
        role: 'admin'
      })
      ElMessage.success('登录成功')
      return true
    },

    async logout(): Promise<boolean> {
      this.clearUserData()
      ElMessage.success('已退出登录')
      return true
    },

    async updateUserInfo(userData: Partial<UserInfo>): Promise<boolean> {
      this.setUserInfo(userData)
      ElMessage.success('更新成功')
      return true
    }
  }
})
