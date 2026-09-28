package com.civicfix.backend.service;

import com.civicfix.backend.dto.CreateAdminRequest;
import com.civicfix.backend.dto.UserResponse;
import com.civicfix.backend.entity.User;
import com.civicfix.backend.exception.BadRequestException;
import com.civicfix.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * List all users, optionally filtered by role.
     * role param: "ADMIN", "CITIZEN", or null for all users.
     */
    public List<UserResponse> listUsers(String role) {
        List<User> users;
        if (role != null && !role.isBlank()) {
            User.Role r = User.Role.valueOf(role.toUpperCase());
            users = userRepository.findByRoleOrderByCreatedAtDesc(r);
        } else {
            users = userRepository.findAllByOrderByCreatedAtDesc();
        }
        return users.stream().map(UserResponse::from).collect(Collectors.toList());
    }

    /**
     * Create a new admin account. Only callable by an existing ADMIN.
     */
    @Transactional
    public UserResponse createAdmin(CreateAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("Email is already registered");
        }

        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.ADMIN)
                .build();

        admin = userRepository.save(admin);
        logger.info("New admin account created: {}", admin.getEmail());
        return UserResponse.from(admin);
    }
}
