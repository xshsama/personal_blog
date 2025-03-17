package com.xsh.personal_blog.service;

import java.util.List;
import java.util.Map;

import org.eclipse.jgit.api.errors.GitAPIException;

public interface GitService {
    List<Map<String, String>> getGitCommits(int limit) throws GitAPIException;
}