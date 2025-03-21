import request from '@/utils/axios';

class ImageService {
    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await request.post<{ url: string }>('/images/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    }

    async deleteImage(imageUrl: string): Promise<void> {
        await request.delete('/images', { params: { url: imageUrl } });
    }
}

export default new ImageService();