package com.xsh.personal_blog.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.xsh.personal_blog.dto.LoginRequest;
import com.xsh.personal_blog.dto.LoginResponse;
import com.xsh.personal_blog.dto.RegisterRequest;
import com.xsh.personal_blog.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class AuthController {

  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

  @Autowired
  private AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest registerRequest,
      HttpServletResponse response) {
    logger.info("Received registration request for username: {}", registerRequest.getUsername());
    try {
      LoginResponse loginResponse = authService.register(registerRequest);
      logger.info("Registration successful for username: {}", registerRequest.getUsername());

      addRefreshTokenCookie(response, loginResponse.getRefreshToken());
      loginResponse.setRefreshToken(null);
      return ResponseEntity.ok(loginResponse);
    } catch (RuntimeException e) {
      logger.error("Registration failed for username: {}, reason: {}", registerRequest.getUsername(), e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(LoginResponse.builder().error(e.getMessage()).build());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
    logger.info("Received login request for loginId: {}", loginRequest.getLoginId());
    try {
      LoginResponse loginResponse = authService.login(loginRequest);
      logger.info("Login successful for loginId: {}", loginRequest.getLoginId());

      addRefreshTokenCookie(response, loginResponse.getRefreshToken());
      loginResponse.setRefreshToken(null);
      return ResponseEntity.ok(loginResponse);
    } catch (Exception e) {
      logger.error("Login failed for loginId: {}, reason: {}", loginRequest.getLoginId(), e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(LoginResponse.builder().error("Invalid credentials").build());
    }
  }

  @PostMapping("/refresh")
  public ResponseEntity<LoginResponse> refreshToken(
      @CookieValue(name = "refreshToken", required = false) String refreshToken,
      HttpServletResponse response) {
    logger.debug("Attempting to refresh token");
    if (refreshToken == null) {
      logger.warn("Refresh token is missing in the request");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    try {
      LoginResponse loginResponse = authService.refreshToken(refreshToken);
      logger.info("Token refresh successful");
      addRefreshTokenCookie(response, loginResponse.getRefreshToken());
      loginResponse.setRefreshToken(null);
      return ResponseEntity.ok(loginResponse);
    } catch (Exception e) {
      logger.error("Token refresh failed: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletResponse response) {
    logger.info("Processing logout request");
    addRefreshTokenCookie(response, null);
    logger.info("Logout successful");
    return ResponseEntity.ok().build();
  }

  private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
    Cookie cookie = new Cookie("refreshToken", refreshToken);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/api/auth");
    cookie.setMaxAge(refreshToken == null ? 0 : 7 * 24 * 60 * 60);
    response.addHeader("Set-Cookie",
        String.format("%s=%s; Path=%s; HttpOnly; Secure; SameSite=Strict",
            cookie.getName(), cookie.getValue(), cookie.getPath()));
    logger.debug("Refresh token cookie {} set with max age: {}",
        refreshToken != null ? "updated" : "cleared", cookie.getMaxAge());
  }
}
