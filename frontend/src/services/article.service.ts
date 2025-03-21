import { Article, ArticleDTO, ArticleQuery } from '@/types/article';
import request from '@/utils/axios';

class ArticleService {
    async createArticle(articleData: ArticleDTO): Promise<Article> {
        const response = await request.post<Article>('/articles', articleData);
        return response.data;
    }

    async getArticle(id: number): Promise<Article> {
        const response = await request.get<Article>(`/articles/${id}`);
        return response.data;
    }

    async updateArticle(id: number, articleData: ArticleDTO): Promise<Article> {
        const response = await request.put<Article>(`/articles/${id}`, articleData);
        return response.data;
    }

    async deleteArticle(id: number): Promise<void> {
        await request.delete(`/articles/${id}`);
    }

    async getArticles(query: ArticleQuery) {
        const response = await request.get('/articles', { params: query });
        return response.data;
    }

    async searchArticles(query: ArticleQuery) {
        const response = await request.get('/articles/search', { params: query });
        return response.data;
    }
}

export default new ArticleService();