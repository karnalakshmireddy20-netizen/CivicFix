package com.civicfix.backend.dto;

import com.civicfix.backend.entity.Issue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class IssueRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private Issue.Category category;

    private Double latitude;
    private Double longitude;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    public String getTitle()             { return title; }
    public void setTitle(String v)       { this.title = v; }
    public String getDescription()       { return description; }
    public void setDescription(String v) { this.description = v; }
    public Issue.Category getCategory()  { return category; }
    public void setCategory(Issue.Category v) { this.category = v; }
    public Double getLatitude()          { return latitude; }
    public void setLatitude(Double v)    { this.latitude = v; }
    public Double getLongitude()         { return longitude; }
    public void setLongitude(Double v)   { this.longitude = v; }
    public String getAddress()           { return address; }
    public void setAddress(String v)     { this.address = v; }
}
