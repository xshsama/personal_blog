import { ActionContext } from 'vuex';
import authService from '../../services/auth.service';

interface User {
    username: string;
    email?: string;
    avatar?: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

interface LoginPayload {
    username: string;
    password: string;
}

interface AuthResponse {
    accessToken: string;
    user: User;
}

// 安全地解析 localStorage 中的用户数据
const getUserFromStorage = (): User | null => {
    try {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    } catch (e) {
        console.error('Failed to parse user from localStorage:', e)
        return null
    }
}

const state = (): AuthState => ({
    user: getUserFromStorage(),
    token: localStorage.getItem('token') || null,
})

const mutations = {
    setUser(state: AuthState, user: User | null) {
        state.user = user
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    },
    setToken(state: AuthState, token: string | null) {
        state.token = token
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    },
    clearUserState(state: AuthState) {
        state.user = null
        state.token = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    },
}

const actions = {
    async register(
        { commit }: ActionContext<AuthState, any>,
        payload: RegisterPayload
    ): Promise<AuthResponse> {
        try {
            const response = await authService.register(
                payload.username,
                payload.email,
                payload.password
            )
            const { accessToken, user } = response
            commit('setToken', accessToken)
            commit('setUser', user)
            return response
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    },
    async login(
        { commit }: ActionContext<AuthState, any>,
        payload: LoginPayload
    ): Promise<AuthResponse> {
        try {
            const response = await authService.login(payload.username, payload.password)
            const { accessToken, user } = response
            commit('setToken', accessToken)
            commit('setUser', user)
            return response
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    },
    async logout({ commit }: ActionContext<AuthState, any>): Promise<void> {
        try {
            await authService.logout()
        } finally {
            commit('clearUserState')
        }
    },
}

const getters = {
    isAuthenticated: (state: AuthState): boolean => !!state.token,
    currentUser: (state: AuthState): User | null => state.user,
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}