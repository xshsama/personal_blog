package com.xsh.personal_blog;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class MyApplication {

    private String jwtSecret;

    public static void main(String[] args) {
        // 1. 生成随机密钥
        SecureRandom secureRandom = new SecureRandom();
        byte[] keyBytes = new byte[32]; // 256-bit key
        secureRandom.nextBytes(keyBytes);
        String secretKey = Base64.getEncoder().encodeToString(keyBytes);

        // 2. 设置 JVM 系统属性
        System.setProperty("jwt.secret", secretKey);

        // 3. 启动 Spring Boot 应用程序
        ConfigurableApplicationContext context = SpringApplication.run(MyApplication.class, args);

        System.out.println("读取到的 JWT Secret: " + context.getEnvironment().getProperty("jwt.secret"));

    }

}
