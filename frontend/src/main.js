import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router/index.js'
import authService from './services/auth.service'

// 创建 Vuex store
const store = createStore({
  state() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
    }
  },
  mutations: {
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
      authService.logout()
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token
    },
    currentUser(state) {
      return state.user
    },
  },
})

// 配置全局 axios 默认值
axios.defaults.baseURL = '/api'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// 添加全局请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 创建 Vue 应用实例
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用插件
app.use(router)
app.use(store)
app.use(ElementPlus, { size: 'default' })

// 添加全局属性以便在模板中使用
app.config.globalProperties.$filters = {
  formatDate(date, format = 'YYYY-MM-DD') {
    return date ? new Date(date).toLocaleDateString() : '-'
  },
}

app.mount('#app')
