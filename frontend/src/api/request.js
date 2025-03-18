import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:9090/api', // API的base_url
  timeout: 15000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证相关的headers
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 如果响应成功就返回响应的数据
    return response
  },
  (error) => {
    console.error('Response error:', error)
    ElMessage.error(error.response?.data?.error || '请求失败')
    return Promise.reject(error)
  },
)

export default service
