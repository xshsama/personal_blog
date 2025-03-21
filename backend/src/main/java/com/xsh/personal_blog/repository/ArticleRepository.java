package com.xsh.personal_blog.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.xsh.personal_blog.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer>, JpaSpecificationExecutor<Article> {
    Page<Article> findByUserId(Integer userId, Pageable pageable);

    Page<Article> findByCategory(String category, Pageable pageable);

    Page<Article> findByIsPublished(Boolean isPublished, Pageable pageable);
}
