import type { InjectionKey } from 'vue'
import type { Store } from 'vuex'
import { createStore } from 'vuex'
import auth from './modules/auth'

// 定义根状态类型
export interface RootState {
    auth: typeof auth.state
}

// 为 store 创建一个 injection key
export const key: InjectionKey<Store<RootState>> = Symbol()

export default createStore({
    modules: {
        auth,
    },
})