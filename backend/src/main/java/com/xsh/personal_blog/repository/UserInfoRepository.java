package com.xsh.personal_blog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.xsh.personal_blog.entity.UserInfo;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    Optional<UserInfo> findByUserId(Integer userId);

    Optional<UserInfo> findByUsername(String username);

    Optional<UserInfo> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}