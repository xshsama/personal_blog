// UserService.java
package com.xsh.personal_blog.service;

import org.springframework.security.core.userdetails.UserDetailsService; // 导入 UserDetailsService

import com.xsh.personal_blog.dto.RegisterRequest;
import com.xsh.personal_blog.entity.User;

public interface UserService extends UserDetailsService { // 继承 UserDetailsService
    User findByUsername(String username);

    User createUser(RegisterRequest registerRequest);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}