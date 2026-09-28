package com.civicfix.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateAdminRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    public String getName()           { return name; }
    public void setName(String v)     { this.name = v; }
    public String getEmail()          { return email; }
    public void setEmail(String v)    { this.email = v; }
    public String getPassword()       { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getPhone()          { return phone; }
    public void setPhone(String v)    { this.phone = v; }
}
