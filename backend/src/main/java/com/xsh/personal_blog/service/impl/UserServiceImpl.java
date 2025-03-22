package com.xsh.personal_blog.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.xsh.personal_blog.dto.RegisterRequest;
import com.xsh.personal_blog.entity.User;
import com.xsh.personal_blog.repository.UserRepository;
import com.xsh.personal_blog.security.UserDetailsImpl;
import com.xsh.personal_blog.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findByUsername(String username) {
        logger.debug("Searching for user by username: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("User not found with username: {}", username);
                    return new UsernameNotFoundException("User not found with username: " + username);
                });
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Loading UserDetails for username: {}", username);
        User user = findByUsername(username);
        logger.debug("UserDetails loaded successfully for username: {}", username);
        return new UserDetailsImpl(user);
    }

    @Override
    public User createUser(RegisterRequest registerRequest) {
        logger.debug("Starting user creation process for username: {}", registerRequest.getUsername());

        if (existsByUsername(registerRequest.getUsername())) {
            logger.warn("Username already exists: {}", registerRequest.getUsername());
            throw new RuntimeException("用户名已存在");
        }
        if (existsByEmail(registerRequest.getEmail())) {
            logger.warn("Email already in use: {}", registerRequest.getEmail());
            throw new RuntimeException("邮箱已被使用");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        User savedUser = userRepository.save(user);
        logger.info("New user created successfully with username: {}", savedUser.getUsername());

        return savedUser;
    }

    @Override
    public boolean existsByUsername(String username) {
        logger.debug("Checking if username exists: {}", username);
        boolean exists = userRepository.existsByUsername(username);
        if (exists) {
            logger.debug("Username found: {}", username);
        }
        return exists;
    }

    @Override
    public boolean existsByEmail(String email) {
        logger.debug("Checking if email exists: {}", email);
        boolean exists = userRepository.existsByEmail(email);
        if (exists) {
            logger.debug("Email found: {}", email);
        }
        return exists;
    }
}