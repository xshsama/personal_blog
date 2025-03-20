package com.xsh.personal_blog.service;

import org.springframework.web.multipart.MultipartFile;

import com.xsh.personal_blog.dto.ImageUploadResponse;

public interface ImageService {
    ImageUploadResponse uploadImage(MultipartFile file);
}