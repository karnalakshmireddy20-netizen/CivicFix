package com.civicfix.backend.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;

    public AuthResponse() {}

    private AuthResponse(Builder b) {
        this.token = b.token; this.type = b.type != null ? b.type : "Bearer";
        this.id = b.id; this.name = b.name; this.email = b.email; this.role = b.role;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String token, type, name, email, role;
        private Long id;
        public Builder token(String v) { this.token = v; return this; }
        public Builder type(String v)  { this.type = v; return this; }
        public Builder id(Long v)      { this.id = v; return this; }
        public Builder name(String v)  { this.name = v; return this; }
        public Builder email(String v) { this.email = v; return this; }
        public Builder role(String v)  { this.role = v; return this; }
        public AuthResponse build()    { return new AuthResponse(this); }
    }

    public String getToken()  { return token; }
    public String getType()   { return type; }
    public Long getId()       { return id; }
    public String getName()   { return name; }
    public String getEmail()  { return email; }
    public String getRole()   { return role; }
}
