import authService from '@/services/auth.service'

const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
}

const mutations = {
  setUser(state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  setToken(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  logout(state) {
    state.user = null
    state.token = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
}

const actions = {
  async login({ commit }, { username, password }) {
    try {
      const response = await authService.login(username, password)
      commit('setToken', response.accessToken)
      commit('setUser', response.user)
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
      commit('logout')
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
