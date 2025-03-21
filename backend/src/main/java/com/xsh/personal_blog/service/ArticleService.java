package com.xsh.personal_blog.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.xsh.personal_blog.dto.ArticleDTO;
import com.xsh.personal_blog.entity.Article;

public interface ArticleService {
    ResponseEntity<Article> uploadArticle(ArticleDTO articleDTO, Integer userId);

    ResponseEntity<Article> getArticleById(Integer id);

    ResponseEntity<?> deleteArticle(Integer id, Integer userId);

    ResponseEntity<Article> updateArticle(Integer id, ArticleDTO articleDTO, Integer userId);

    Page<Article> getAllArticles(Pageable pageable);

    Page<Article> searchArticles(String keyword, String category, String tag, Pageable pageable);
}
