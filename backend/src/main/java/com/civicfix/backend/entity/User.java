package com.civicfix.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "reportedBy", fetch = FetchType.LAZY)
    private List<Issue> issues;

    public enum Role { CITIZEN, ADMIN }

    // Constructors
    public User() {}

    private User(Builder b) {
        this.name = b.name; this.email = b.email; this.password = b.password;
        this.phone = b.phone; this.role = b.role;
    }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String name, email, password, phone;
        private Role role;
        public Builder name(String v)     { this.name = v; return this; }
        public Builder email(String v)    { this.email = v; return this; }
        public Builder password(String v) { this.password = v; return this; }
        public Builder phone(String v)    { this.phone = v; return this; }
        public Builder role(Role v)       { this.role = v; return this; }
        public User build()               { return new User(this); }
    }

    // Getters & Setters
    public Long getId()            { return id; }
    public String getName()        { return name; }
    public void setName(String v)  { this.name = v; }
    public String getEmail()       { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPassword()    { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getPhone()       { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public Role getRole()          { return role; }
    public void setRole(Role v)    { this.role = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Issue> getIssues() { return issues; }
}
