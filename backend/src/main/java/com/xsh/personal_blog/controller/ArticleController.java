package com.xsh.personal_blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    @PreAuthorize("isAuthenticated()")
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Article> updateArticle(
            @PathVariable Integer id,
            @Valid @RequestBody ArticleDTO articleDTO,
            @AuthenticationPrincipal Integer userId) {
        return articleService.updateArticle(id, articleDTO, userId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteArticle(
            @PathVariable Integer id,
            @AuthenticationPrincipal Integer userId) {
        return articleService.deleteArticle(id, userId);
    }

    @GetMapping
    public Page<Article> getAllArticles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        return articleService.getAllArticles(PageRequest.of(page, size, sort));
    }

    @GetMapping("/search")
    public Page<Article> searchArticles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        return articleService.searchArticles(keyword, category, tag, PageRequest.of(page, size, sort));
    }
}
