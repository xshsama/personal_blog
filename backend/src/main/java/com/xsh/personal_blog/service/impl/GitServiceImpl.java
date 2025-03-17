package com.xsh.personal_blog.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.xsh.personal_blog.service.GitService;

@Service
public class GitServiceImpl implements GitService {
    private static final Logger logger = LoggerFactory.getLogger(GitServiceImpl.class);

    @Value("${git.repository.path}")
    private String repositoryPath;

    @Override
    public List<Map<String, String>> getGitCommits(int limit) throws GitAPIException {
        List<Map<String, String>> commits = new ArrayList<>();
        logger.debug("Attempting to get {} commits from repository at {}", limit, repositoryPath);

        try {
            File gitDir = new File(repositoryPath);
            if (!gitDir.exists() || !gitDir.isDirectory()) {
                logger.error("Git repository directory not found at {}", repositoryPath);
                throw new GitAPIException("Git repository not found") {
                    private static final long serialVersionUID = 1L;
                };
            }

            FileRepositoryBuilder builder = new FileRepositoryBuilder();
            Repository repository = builder
                    .setGitDir(new File(repositoryPath))
                    .readEnvironment()
                    .findGitDir()
                    .build();

            try (Git git = new Git(repository)) {
                logger.debug("Successfully opened Git repository");
                Iterable<RevCommit> log = git.log()
                        .setMaxCount(limit)
                        .call();

                for (RevCommit commit : log) {
                    Map<String, String> commitInfo = new HashMap<>();
                    commitInfo.put("id", commit.getName());
                    commitInfo.put("shortId", commit.getName().substring(0, 7));
                    commitInfo.put("message", commit.getShortMessage());
                    commitInfo.put("fullMessage", commit.getFullMessage());
                    commitInfo.put("author", commit.getAuthorIdent().getName());
                    commitInfo.put("email", commit.getAuthorIdent().getEmailAddress());
                    commitInfo.put("date", commit.getAuthorIdent().getWhen().toString());
                    commits.add(commitInfo);
                    logger.trace("Added commit: {}", commit.getName());
                }
            }

            logger.info("Successfully retrieved {} commits", commits.size());
        } catch (Exception e) {
            logger.error("Failed to get git commits", e);
            throw new GitAPIException("Error accessing git repository: " + e.getMessage()) {
                private static final long serialVersionUID = 1L;
            };
        }

        return commits;
    }
}
