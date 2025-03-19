package com.xsh.personal_blog.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.xsh.personal_blog.dto.ArticleDTO;
import com.xsh.personal_blog.entity.Article;
import com.xsh.personal_blog.repository.ArticleRepository;
import com.xsh.personal_blog.service.ArticleService;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Override
    public ResponseEntity<Article> uploadArticle(ArticleDTO articleDTO, Integer userId) {
        Article article = new Article();

        article.setTitle(articleDTO.getTitle());
        article.setCategory(articleDTO.getCategory());
        article.setTags(articleDTO.getTags());
        article.setSummary(articleDTO.getSummary());
        article.setCoverImage(articleDTO.getCoverImage());
        article.setContent(articleDTO.getContent());
        article.setUserId(userId);
        article.setViewCount(0);
        article.setCommentCount(0);
        article.setCreatedAt(LocalDateTime.now());
        article.setUpdatedAt(LocalDateTime.now());

        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.ok(savedArticle);
    }

    @Override
    public ResponseEntity<Article> getArticleById(Integer id) {
        return articleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<?> deleteArticle(Integer id, Integer userId) {
        return articleRepository.findById(id)
                .filter(article -> article.getUserId().equals(userId))
                .map(article -> {
                    articleRepository.delete(article);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Article> updateArticle(Integer id, ArticleDTO articleDTO, Integer userId) {
        return articleRepository.findById(id)
                .filter(article -> article.getUserId().equals(userId))
                .map(article -> {
                    article.setTitle(articleDTO.getTitle());
                    article.setCategory(articleDTO.getCategory());
                    article.setTags(articleDTO.getTags());
                    article.setSummary(articleDTO.getSummary());
                    article.setCoverImage(articleDTO.getCoverImage());
                    article.setContent(articleDTO.getContent());
                    article.setUpdatedAt(LocalDateTime.now());

                    Article updatedArticle = articleRepository.save(article);
                    return ResponseEntity.ok(updatedArticle);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
