package com.xsh.personal_blog.service;

import com.xsh.personal_blog.dto.LoginRequest;
import com.xsh.personal_blog.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

}
