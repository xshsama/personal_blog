package com.xsh.personal_blog.service.impl;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.xsh.personal_blog.dto.ArticleDTO;
import com.xsh.personal_blog.entity.Article;
import com.xsh.personal_blog.entity.User;
import com.xsh.personal_blog.exception.ResourceNotFoundException;
import com.xsh.personal_blog.exception.UnauthorizedException;
import com.xsh.personal_blog.repository.ArticleRepository;
import com.xsh.personal_blog.repository.UserRepository;
import com.xsh.personal_blog.service.ArticleService;

import jakarta.persistence.criteria.Predicate;
import jakarta.validation.Valid;

@Service
public class ArticleServiceImpl implements ArticleService {

    private static final Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    @CacheEvict(value = "articles", allEntries = true)
    public ResponseEntity<Article> uploadArticle(@Valid ArticleDTO articleDTO, Integer userId) {
        if (userId == null) {
            logger.error("User ID cannot be null when creating an article");
            throw new IllegalArgumentException("User ID cannot be null");
        }

        logger.info("Creating new article for user ID: {}", userId);
        try {
            User author = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            Article article = new Article();
            article.setTitle(articleDTO.getTitle());
            article.setCategory(articleDTO.getCategory());
            article.setTags(articleDTO.getTags());
            article.setSummary(articleDTO.getSummary());
            article.setCoverImage(articleDTO.getCoverImage());
            article.setContent(articleDTO.getContent());
            article.setIsPublished(!articleDTO.getIsDraft());

            // 确保设置作者和用户ID
            article.setUserId(userId);
            article.setAuthor(author);

            // 初始化计数器
            article.setViewCount(0);
            article.setCommentCount(0);
            article.setLikeCount(0);

            Article savedArticle = articleRepository.save(article);
            logger.info("Article created successfully with ID: {} for user ID: {}", savedArticle.getId(), userId);

            return ResponseEntity.ok(savedArticle);
        } catch (Exception e) {
            logger.error("Error creating article for user ID: {}", userId, e);
            throw e;
        }
    }

    @Override
    @Cacheable(value = "articles", key = "#id", unless = "#result == null")
    public ResponseEntity<Article> getArticleById(Integer id) {
        logger.debug("Fetching article with ID: {}", id);
        return articleRepository.findById(id)
                .map(article -> {
                    logger.debug("Article found: {}", article.getTitle());
                    return ResponseEntity.ok(article);
                })
                .orElseGet(() -> {
                    logger.debug("Article not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Override
    @Transactional
    @CacheEvict(value = "articles", allEntries = true)
    public ResponseEntity<?> deleteArticle(Integer id, Integer userId) {
        logger.info("Attempting to delete article ID: {} by user ID: {}", id, userId);
        return articleRepository.findById(id)
                .map(article -> {
                    if (!article.getUserId().equals(userId)) {
                        logger.warn("Unauthorized deletion attempt of article ID: {} by user ID: {}", id, userId);
                        throw new UnauthorizedException("You don't have permission to delete this article");
                    }
                    articleRepository.delete(article);
                    logger.info("Article ID: {} deleted successfully", id);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> {
                    logger.warn("Article not found for deletion - ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Override
    @Transactional
    @CacheEvict(value = "articles", allEntries = true)
    public ResponseEntity<Article> updateArticle(Integer id, @Valid ArticleDTO articleDTO, Integer userId) {
        logger.info("Attempting to update article ID: {} by user ID: {}", id, userId);
        return articleRepository.findById(id)
                .map(article -> {
                    if (!article.getUserId().equals(userId)) {
                        logger.warn("Unauthorized update attempt of article ID: {} by user ID: {}", id, userId);
                        throw new UnauthorizedException("You don't have permission to update this article");
                    }

                    article.setTitle(articleDTO.getTitle());
                    article.setCategory(articleDTO.getCategory());
                    article.setTags(articleDTO.getTags());
                    article.setSummary(articleDTO.getSummary());
                    article.setCoverImage(articleDTO.getCoverImage());
                    article.setContent(articleDTO.getContent());
                    article.setIsPublished(!articleDTO.getIsDraft());

                    Article updatedArticle = articleRepository.save(article);
                    logger.info("Article ID: {} updated successfully", id);
                    return ResponseEntity.ok(updatedArticle);
                })
                .orElseGet(() -> {
                    logger.warn("Article not found for update - ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @Override
    @Cacheable(value = "articles", key = "'all:' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<Article> getAllArticles(Pageable pageable) {
        logger.debug("Fetching all articles with pagination: {}", pageable);
        Specification<Article> spec = (root, query, cb) -> {
            return cb.isTrue(root.get("isPublished"));
        };
        return articleRepository.findAll(spec, pageable);
    }

    @Override
    @Cacheable(value = "articles", key = "'search:' + #keyword + ':' + #category + ':' + #tag + ':' + #pageable.pageNumber")
    public Page<Article> searchArticles(String keyword, String category, String tag, Pageable pageable) {
        logger.debug("Searching articles with keyword: {}, category: {}, tag: {}", keyword, category, tag);

        Specification<Article> spec = (root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();

            if (StringUtils.hasText(keyword)) {
                String searchTerm = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), searchTerm),
                        cb.like(cb.lower(root.get("content")), searchTerm),
                        cb.like(cb.lower(root.get("summary")), searchTerm)));
            }

            if (StringUtils.hasText(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (StringUtils.hasText(tag)) {
                predicates.add(cb.isMember(tag, root.get("tags")));
            }

            // 只返回已发布的文章
            predicates.add(cb.isTrue(root.get("isPublished")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Article> results = articleRepository.findAll(spec, pageable);
        logger.debug("Found {} articles matching search criteria", results.getTotalElements());
        return results;
    }
}
