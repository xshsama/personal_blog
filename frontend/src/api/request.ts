import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

interface ApiErrorResponse {
    error: string;
    message?: string;
}

// 创建axios实例
const service: AxiosInstance = axios.create({
    baseURL: 'http://localhost:9090/api', // API的base_url
    timeout: 15000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        console.error('Request error:', error)
        return Promise.reject(error)
    },
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error: AxiosError<ApiErrorResponse>) => {
        console.error('Response error:', error)
        if (error.response?.status === 401) {
            ElMessage.error('认证失败，请重新登录')
            // 可以在这里处理token过期的情况
        } else {
            ElMessage.error(error.response?.data?.message || '请求失败')
        }
        return Promise.reject(error)
    },
)

export default service;