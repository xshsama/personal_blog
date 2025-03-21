import axios, { AxiosInstance } from 'axios';

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
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Token 过期，尝试刷新
                const response = await service.post('/auth/refresh');
                const { accessToken } = response.data;
                localStorage.setItem('token', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return service(originalRequest);
            } catch (err) {
                // 刷新失败，清除登录状态
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default service;
