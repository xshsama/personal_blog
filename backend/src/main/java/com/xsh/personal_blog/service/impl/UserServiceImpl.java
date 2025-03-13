package com.xsh.personal_blog.service.impl;

import java.util.ArrayList; // 导入 ArrayList

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.xsh.personal_blog.entity.User;
import com.xsh.personal_blog.repository.UserRepository;
import com.xsh.personal_blog.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username); // 使用你自己的 findByUsername 方法

        // 创建一个 Spring Security 的 UserDetails 对象
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>() // 这里可以添加用户的权限 (GrantedAuthority)
        );
    }
    // 其他方法 (例如：createUser, updateUser 等)

}