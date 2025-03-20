package com.xsh.personal_blog.controller;

import java.util.List;
import java.util.Map;

import org.eclipse.jgit.api.errors.GitAPIException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xsh.personal_blog.service.GitService;

@RestController
@RequestMapping("/api/git")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class GitController {
    private static final Logger logger = LoggerFactory.getLogger(GitController.class);

    @Autowired
    private GitService gitService;

    @GetMapping("/commits")
    public ResponseEntity<?> getCommits(@RequestParam(defaultValue = "10") int limit) {
        logger.debug("Fetching {} most recent commits", limit);
        try {
            if (limit <= 0) {
                logger.warn("Invalid limit parameter: {}", limit);
                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "error", "Limit must be a positive number",
                                "status", "400"));
            }

            List<Map<String, String>> commits = gitService.getGitCommits(limit);

            if (commits.isEmpty()) {
                logger.info("No commits found");
                return ResponseEntity
                        .ok()
                        .body(Map.of(
                                "message", "No commits found",
                                "status", "200"));
            }

            logger.debug("Successfully retrieved {} commits", commits.size());
            return ResponseEntity.ok(commits);
        } catch (GitAPIException e) {
            logger.error("Git operation failed: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Git operation failed: " + e.getMessage(),
                            "status", "500",
                            "details", e.getClass().getSimpleName()));
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Unexpected error: " + e.getMessage(),
                            "status", "500",
                            "details", e.getClass().getSimpleName()));
        }
    }
}
