package com.xsh.personal_blog.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class LoginResponse {
    private String message;
    private String token; // JWT token
    private Long userId; // 用户ID
    private String username; // 用户名
    private String email; // 邮箱
    private String avatar; // 头像URL
    private String nickname; // 昵称
    private Boolean isAdmin; // 是否为管理员
}
