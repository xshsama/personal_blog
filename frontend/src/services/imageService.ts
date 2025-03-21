import { compressImage, validateImage } from '@/utils/image';
import axios, { AxiosInstance } from 'axios';

interface ImageUploadResponse {
    success: boolean;
    message: string;
    url: string;
    thumbnailUrl?: string;
    deleteUrl?: string;
}

class ImageService {
    private axios: AxiosInstance;

    constructor() {
        this.axios = axios.create({
            baseURL: 'http://localhost:9090/api',
            withCredentials: true
        });

        // 添加请求拦截器设置token
        this.axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async uploadImage(file: File): Promise<ImageUploadResponse> {
        try {
            // 验证图片
            validateImage(file);

            // 压缩图片
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], file.name, { type: file.type });

            // 创建 FormData
            const formData = new FormData();
            formData.append('file', compressedFile);

            // 发送请求
            const response = await this.axios.post<ImageUploadResponse>('/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            console.error('图片上传失败:', error);
            return {
                success: false,
                message: error.message || '图片上传失败',
                url: ''
            };
        }
    }
}

export default new ImageService();
