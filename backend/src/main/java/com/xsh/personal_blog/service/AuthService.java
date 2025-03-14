package com.xsh.personal_blog.service;

import com.xsh.personal_blog.dto.LoginRequest;
import com.xsh.personal_blog.dto.LoginResponse;
import com.xsh.personal_blog.dto.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);

    LoginResponse register(RegisterRequest registerRequest);

    LoginResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}
