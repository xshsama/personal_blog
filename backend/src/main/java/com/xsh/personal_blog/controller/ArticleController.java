package com.xsh.personal_blog.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);

    @Autowired
    private ArticleService articleService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Article> createArticle(
            @Valid @RequestBody ArticleDTO articleDTO,
            @AuthenticationPrincipal Integer userId) {
        if (userId == null) {
            logger.error("Attempted to create article with null user ID");
            throw new IllegalStateException("User ID is required to create an article");
        }
        logger.debug("Creating article for user ID: {}", userId);
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
        if (userId == null) {
            logger.error("Attempted to update article {} with null user ID", id);
            throw new IllegalStateException("User ID is required to update an article");
        }
        logger.debug("Updating article {} for user ID: {}", id, userId);
        return articleService.updateArticle(id, articleDTO, userId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteArticle(
            @PathVariable Integer id,
            @AuthenticationPrincipal Integer userId) {
        if (userId == null) {
            logger.error("Attempted to delete article {} with null user ID", id);
            throw new IllegalStateException("User ID is required to delete an article");
        }
        logger.debug("Deleting article {} for user ID: {}", id, userId);
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
