package com.xsh.personal_blog.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class UserInfo {
    private Long userId; // 用户ID
    private String username; // 用户名
    private String email; // 邮箱
    private String avatar; // 头像URL
}
