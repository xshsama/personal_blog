export interface Article {
    id: number
    title: string
    summary: string
    content: string
    coverImage?: string
    category: string
    tags: string[]
    viewCount: number
    commentCount: number
    likeCount: number
    isPublished: boolean
    createdAt: string
    updatedAt: string
    userId: number
    author: {
        id: number
        username: string
        avatar?: string
    }
}

export interface ArticleDTO {
    title: string
    category: string
    tags: string[]
    summary: string
    content: string
    coverImage?: string
    isDraft: boolean
}

export interface ArticleQuery {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    keyword?: string;
    category?: string;
    tag?: string;
}

export interface ArticleResponse {
    content: Article[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}