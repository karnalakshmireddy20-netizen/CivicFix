package com.civicfix.backend.dto;

import com.civicfix.backend.entity.User;

import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;

    private UserResponse(Builder b) {
        this.id = b.id; this.name = b.name; this.email = b.email;
        this.phone = b.phone; this.role = b.role; this.createdAt = b.createdAt;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private String name, email, phone, role; private LocalDateTime createdAt;
        public Builder id(Long v)              { this.id = v; return this; }
        public Builder name(String v)          { this.name = v; return this; }
        public Builder email(String v)         { this.email = v; return this; }
        public Builder phone(String v)         { this.phone = v; return this; }
        public Builder role(String v)          { this.role = v; return this; }
        public Builder createdAt(LocalDateTime v){ this.createdAt = v; return this; }
        public UserResponse build()            { return new UserResponse(this); }
    }

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public Long getId()               { return id; }
    public String getName()           { return name; }
    public String getEmail()          { return email; }
    public String getPhone()          { return phone; }
    public String getRole()           { return role; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
}
