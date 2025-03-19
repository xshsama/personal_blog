package com.xsh.personal_blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xsh.personal_blog.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    // 基础的 CRUD 操作由 JpaRepository 提供
    // 可以根据需要添加自定义查询方法
}
