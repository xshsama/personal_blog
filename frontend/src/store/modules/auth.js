import authService from '../../services/auth.service'

// 安全地解析 localStorage 中的用户数据
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e)
    return null
  }
}

const state = () => ({
  user: getUserFromStorage(),
  token: localStorage.getItem('token') || null,
})

const mutations = {
  setUser(state, user) {
    state.user = user
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },
  setToken(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  clearUserState(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
}

const actions = {
  async register({ commit }, { username, email, password }) {
    try {
      const response = await authService.register(username, email, password)
      const { accessToken, user } = response

      commit('setToken', accessToken)
      commit('setUser', user)
      return response
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  async login({ commit }, { username, password }) {
    try {
      const response = await authService.login(username, password)
      const { accessToken, user } = response

      commit('setToken', accessToken)
      commit('setUser', user)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async logout({ commit }) {
    try {
      await authService.logout()
    } finally {
      commit('clearUserState')
    }
  },
}

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
