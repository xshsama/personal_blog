package com.xsh.personal_blog.dto;

import com.xsh.personal_blog.enums.LoginType;

import lombok.Data;

@Data
public class LoginRequest {

    private String loginId; // 登录标识（用户名或邮箱）
    private String password; // 密码
    private LoginType loginType; // 登录类型
}
