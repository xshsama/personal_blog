package com.xsh.personal_blog.util;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.xsh.personal_blog.security.UserDetailsImpl;

import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token.expire:3600000}") // 1小时
    private long accessTokenExpire;

    @Value("${jwt.refresh-token.expire:604800000}") // 7天
    private long refreshTokenExpire;

    private Algorithm algorithm;
    private JWTVerifier verifier;

    @PostConstruct
    public void init() {
        logger.info("Initializing JwtUtil with secret key length: {}", secret != null ? secret.length() : 0);
        try {
            this.algorithm = Algorithm.HMAC256(secret);
            this.verifier = JWT.require(algorithm).build();
            logger.info("JWT algorithm and verifier initialized successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Failed to initialize JWT algorithm: {}", e.getMessage());
            throw new RuntimeException("JWT initialization failed", e);
        }
    }

    public String generateAccessToken(UserDetails userDetails) {
        logger.debug("Generating access token for user: {}", userDetails.getUsername());
        Integer userId = null;
        if (userDetails instanceof UserDetailsImpl) {
            userId = ((UserDetailsImpl) userDetails).getUserId();
        }
        return generateToken(userDetails, userId, accessTokenExpire);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        logger.debug("Generating refresh token for user: {}", userDetails.getUsername());
        Integer userId = null;
        if (userDetails instanceof UserDetailsImpl) {
            userId = ((UserDetailsImpl) userDetails).getUserId();
        }
        return generateToken(userDetails, userId, refreshTokenExpire);
    }

    private String generateToken(UserDetails userDetails, Integer userId, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        try {
            String token = JWT.create()
                    .withSubject(userDetails.getUsername())
                    .withClaim("userId", userId)
                    .withIssuedAt(now)
                    .withExpiresAt(expiryDate)
                    .sign(algorithm);
            logger.debug("Token generated successfully for user: {} with expiry: {}", userDetails.getUsername(),
                    expiryDate);
            return token;
        } catch (Exception e) {
            logger.error("Failed to generate token for user: {}", userDetails.getUsername(), e);
            throw new RuntimeException("Token generation failed", e);
        }
    }

    public boolean validateToken(String token) {
        if (token == null) {
            logger.warn("Null token provided for validation");
            return false;
        }

        try {
            DecodedJWT decodedJWT = verifier.verify(token);
            boolean isValid = !decodedJWT.getExpiresAt().before(new Date());
            if (!isValid) {
                logger.warn("Token has expired: {}", decodedJWT.getExpiresAt());
            }
            return isValid;
        } catch (JWTVerificationException e) {
            logger.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            DecodedJWT decodedJWT = verifier.verify(token);
            String username = decodedJWT.getSubject();
            logger.debug("Username extracted from token: {}", username);
            return username;
        } catch (JWTVerificationException e) {
            logger.warn("Failed to extract username from token: {}", e.getMessage());
            return null;
        }
    }

    public Integer getUserIdFromToken(String token) {
        try {
            DecodedJWT decodedJWT = verifier.verify(token);
            Integer userId = decodedJWT.getClaim("userId").asInt();
            logger.debug("User ID extracted from token: {}", userId);
            return userId;
        } catch (JWTVerificationException e) {
            logger.warn("Failed to extract user ID from token: {}", e.getMessage());
            return null;
        }
    }
}
