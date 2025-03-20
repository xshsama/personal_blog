package com.xsh.personal_blog.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.xsh.personal_blog.dto.ImageUploadResponse;
import com.xsh.personal_blog.service.ImageService;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class ImageController {
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        logger.info("=== 开始处理图片上传请求 ===");
        logger.info("文件信息 - 名称: {}, 大小: {} KB, 类型: {}",
                file.getOriginalFilename(),
                file.getSize() / 1024,
                file.getContentType());

        try {
            // 文件为空检查
            if (file.isEmpty()) {
                logger.warn("上传失败：收到空文件");
                return ResponseEntity.badRequest().body(
                        new ImageUploadResponse(false, "文件为空", null, null, null));
            }

            // 文件类型检查
            if (!file.getContentType().startsWith("image/")) {
                logger.warn("上传失败：非图片类型文件 ({})", file.getContentType());
                return ResponseEntity.badRequest().body(
                        new ImageUploadResponse(false, "只支持图片文件格式", null, null, null));
            }

            // 文件大小检查 (32MB)
            long maxSize = 32 * 1024 * 1024;
            if (file.getSize() > maxSize) {
                logger.warn("上传失败：文件大小 {} MB 超过限制 (最大 32 MB)",
                        String.format("%.2f", file.getSize() / (1024.0 * 1024)));
                return ResponseEntity.badRequest().body(
                        new ImageUploadResponse(false, "文件大小超过32MB限制", null, null, null));
            }

            logger.info("文件验证通过，准备上传到ImgBB...");

            ImageUploadResponse response = imageService.uploadImage(file);

            if (response.isSuccess()) {
                logger.info("图片上传成功 - 图片URL: {}", response.getUrl());
                logger.info("缩略图URL: {}", response.getThumbnailUrl());
                logger.info("删除URL: {}", response.getDeleteUrl());
                logger.info("=== 图片上传请求处理完成 ===");
                return ResponseEntity.ok(response);
            } else {
                logger.error("ImgBB上传失败 - 错误信息: {}", response.getMessage());
                logger.info("=== 图片上传请求处理完成 ===");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("图片上传过程中发生异常: {}", e.getMessage());
            logger.error("异常堆栈: ", e);
            logger.info("=== 图片上传请求处理完成 ===");
            return ResponseEntity.badRequest().body(
                    new ImageUploadResponse(false, "上传失败: " + e.getMessage(), null, null, null));
        }
    }
}