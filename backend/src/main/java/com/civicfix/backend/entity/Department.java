package com.civicfix.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    public Department() {}

    private Department(Builder b) {
        this.name = b.name; this.description = b.description;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String name, description;
        public Builder name(String v)        { this.name = v; return this; }
        public Builder description(String v) { this.description = v; return this; }
        public Department build()            { return new Department(this); }
    }

    public Long getId()               { return id; }
    public String getName()           { return name; }
    public void setName(String v)     { this.name = v; }
    public String getDescription()    { return description; }
    public void setDescription(String v) { this.description = v; }
}
