import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import './assets/styles/bytemd.scss'
import router from './router'
import auth from './store/modules/auth'

// 创建 Vuex store
const store = createStore({
    modules: {
        auth,
    },
})

const app: VueApp = createApp(App)

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
    formatDate(date: string | number | Date, format = 'YYYY-MM-DD'): string {
        return date ? new Date(date).toLocaleDateString() : '-'
    },
}

app.mount('#app')