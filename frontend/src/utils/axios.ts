import axios, { AxiosInstance } from 'axios';
import { ElMessage } from 'element-plus';
import eventBus from './eventBus';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: 'http://localhost:9090/api',
    timeout: 5000,
    withCredentials: true, // 允许携带 cookies
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // 确保请求头包含正确的 Content-Type
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        // 确保明确设置请求方法
        if (!config.method) {
            config.method = 'get';
        }
        return config;
    },
    error => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => response,
    async error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 清除本地存储的认证信息
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // 发出认证错误事件
                    eventBus.emit('auth:error');
                    ElMessage.error('登录已过期，请重新登录');
                    break;
                case 403:
                    console.error('接口访问被拒绝，可能是CORS或权限问题:', error.config.url);
                    ElMessage.error('没有权限访问该资源');
                    break;
                case 404:
                    ElMessage.error('请求的资源不存在');
                    break;
                case 500:
                    ElMessage.error('服务器内部错误');
                    break;
                default:
                    ElMessage.error(`请求失败: ${error.message}`);
            }
        } else if (error.request) {
            // 请求发出但没有收到响应
            ElMessage.error('无法连接到服务器，请检查网络连接');
        } else {
            // 请求配置有误
            ElMessage.error(`请求配置错误: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export default service;
