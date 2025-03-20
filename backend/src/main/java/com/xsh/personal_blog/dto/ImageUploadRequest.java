package com.xsh.personal_blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadRequest {
    private boolean success;
    private String message;
    private String url;

    public ImageUploadRequest(boolean success, String url) {
        this.success = success;
        this.url = url;
        this.message = success ? "Image uploaded successfully" : "Failed to upload image";
    }
}