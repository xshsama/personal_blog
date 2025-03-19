package com.xsh.personal_blog.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ArticleDTO {
    @NotBlank(message = "文章标题不能为空")
    @Size(min = 2, max = 100, message = "标题长度必须在2-100字符之间")
    private String title;

    @NotBlank(message = "文章分类不能为空")
    private String category;

    private List<String> tags;

    @Size(max = 500, message = "摘要长度不能超过500字符")
    private String summary;

    private String coverImage;

    @NotBlank(message = "文章内容不能为空")
    @Size(min = 100, message = "文章内容不能少于100字符")
    private String content;

    private Boolean isDraft = false;
}