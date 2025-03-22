package com.xsh.personal_blog.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.xsh.personal_blog.dto.LoginRequest;
import com.xsh.personal_blog.dto.LoginResponse;
import com.xsh.personal_blog.dto.RegisterRequest;
import com.xsh.personal_blog.entity.User;
import com.xsh.personal_blog.security.UserDetailsImpl;
import com.xsh.personal_blog.service.AuthService;
import com.xsh.personal_blog.service.UserService;
import com.xsh.personal_blog.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        logger.debug("Attempting authentication for user: {}", loginRequest.getLoginId());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getLoginId(), loginRequest.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        logger.debug("Generating tokens for authenticated user: {} with ID: {}",
                userDetails.getUsername(), userDetails.getUserId());

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        logger.debug("Tokens generated successfully for user: {}", userDetails.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public LoginResponse register(RegisterRequest registerRequest) {
        logger.debug("Starting user registration process for username: {}", registerRequest.getUsername());

        // Create new user
        User user = userService.createUser(registerRequest);
        logger.info("New user created successfully: {}", user.getUsername());

        // Generate tokens
        UserDetailsImpl userDetails = (UserDetailsImpl) userService.loadUserByUsername(user.getUsername());
        logger.debug("Generating tokens for new user: {} with ID: {}",
                user.getUsername(), userDetails.getUserId());

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        logger.debug("Tokens generated successfully for new user: {}", user.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        logger.debug("Validating refresh token");
        if (!jwtUtil.validateToken(refreshToken)) {
            logger.warn("Invalid refresh token detected");
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.getUsernameFromToken(refreshToken);
        logger.debug("Refresh token valid for user: {}", username);

        UserDetailsImpl userDetails = (UserDetailsImpl) userService.loadUserByUsername(username);
        logger.debug("Generating new tokens for user: {} with ID: {}",
                userDetails.getUsername(), userDetails.getUserId());

        String newAccessToken = jwtUtil.generateAccessToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        logger.debug("New tokens generated successfully for user: {}", username);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Override
    public void logout(String refreshToken) {
        // 如果需要，可以在这里实现令牌黑名单逻辑
        // 目前前端会清除本地存储的令牌，服务端不需要特殊处理
        if (refreshToken != null) {
            String username = jwtUtil.getUsernameFromToken(refreshToken);
            logger.info("User logged out: {}", username);
        }
    }
}
