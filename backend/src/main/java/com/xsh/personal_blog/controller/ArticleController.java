package com.xsh.personal_blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xsh.personal_blog.dto.ArticleDTO;
import com.xsh.personal_blog.entity.Article;
import com.xsh.personal_blog.service.ArticleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> createArticle(
            @Valid @RequestBody ArticleDTO articleDTO,
            @AuthenticationPrincipal Integer userId) {
        return articleService.uploadArticle(articleDTO, userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Integer id) {
        return articleService.getArticleById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(
            @PathVariable Integer id,
            @Valid @RequestBody ArticleDTO articleDTO,
            @AuthenticationPrincipal Integer userId) {
        return articleService.updateArticle(id, articleDTO, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(
            @PathVariable Integer id,
            @AuthenticationPrincipal Integer userId) {
        return articleService.deleteArticle(id, userId);
    }
}
