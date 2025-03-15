import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router/index.js'
import auth from './store/modules/auth'

// 创建 Vuex store
const store = createStore({
  modules: {
    auth,
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
