package com.xsh.personal_blog.service.impl;

import java.io.IOException;
import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xsh.personal_blog.dto.ImageUploadResponse;
import com.xsh.personal_blog.service.ImageService;

@Service
public class ImageServiceImpl implements ImageService {

    private static final Logger logger = LoggerFactory.getLogger(ImageServiceImpl.class);
    private static final String IMGBB_API_URL = "https://api.imgbb.com/1/upload";

    @Value("${imgbb.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ImageServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public ImageUploadResponse uploadImage(MultipartFile file) {
        logger.info("开始上传文件: {}", file.getOriginalFilename());

        try {
            logger.info("开始处理ImgBB上传请求 - 文件名: {}", file.getOriginalFilename());

            // 将文件转换为Base64
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            // 准备请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // 准备请求体
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("key", apiKey);
            body.add("image", base64Image);
            if (file.getOriginalFilename() != null) {
                body.add("name", file.getOriginalFilename());
            }

            // 发送请求
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    IMGBB_API_URL,
                    requestEntity,
                    String.class);

            logger.info("收到ImgBB响应 - 状态码: {}", response.getStatusCode());

            // 解析响应
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());

            if (jsonResponse.has("data")) {
                JsonNode data = jsonResponse.get("data");
                String url = data.get("url").asText();
                String thumbnailUrl = data.get("thumb").get("url").asText();
                String deleteUrl = data.get("delete_url").asText();

                logger.info("ImgBB上传成功 - URL: {}", url);
                return new ImageUploadResponse(true, "上传成功", url, thumbnailUrl, deleteUrl);
            } else {
                String errorMessage = "ImgBB响应中没有data字段";
                logger.error(errorMessage);
                return new ImageUploadResponse(false, errorMessage, null, null, null);
            }

        } catch (IOException e) {
            String errorMessage = "图片处理过程中发生IO异常: " + e.getMessage();
            logger.error(errorMessage, e);
            return new ImageUploadResponse(false, errorMessage, null, null, null);
        } catch (Exception e) {
            String errorMessage = "图片上传过程中发生异常: " + e.getMessage();
            logger.error(errorMessage, e);
            return new ImageUploadResponse(false, errorMessage, null, null, null);
        }
    }
}