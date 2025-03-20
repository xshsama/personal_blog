package com.xsh.personal_blog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadResponse {
    private boolean success;
    private String message;
    private String url;
    private String thumbnailUrl;
    private String deleteUrl;

    public ImageUploadResponse(boolean success, String url) {
        this.success = success;
        this.url = url;
        this.message = success ? "Image uploaded successfully" : "Failed to upload image";
    }
}