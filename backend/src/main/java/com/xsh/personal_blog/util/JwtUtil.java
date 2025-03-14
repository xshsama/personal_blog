package com.xsh.personal_blog.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token.expire:3600000}") // 1小时
    private long accessTokenExpire;

    @Value("${jwt.refresh-token.expire:604800000}") // 7天
    private long refreshTokenExpire;

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, accessTokenExpire);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, refreshTokenExpire);
    }

    private String generateToken(UserDetails userDetails, long expiration) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.create()
                .withSubject(userDetails.getUsername())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(algorithm);
    }

    public boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .build()
                    .verify(token);
            return !decodedJWT.getExpiresAt().before(new Date());
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decodedJWT = JWT.require(algorithm)
                    .build()
                    .verify(token);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }
}
