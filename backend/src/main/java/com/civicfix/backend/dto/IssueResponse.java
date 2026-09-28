package com.civicfix.backend.dto;

import com.civicfix.backend.entity.Issue;

import java.time.LocalDateTime;

public class IssueResponse {
    private Long id;
    private String complaintId;
    private String title;
    private String description;
    private String category;
    private String status;
    private String imagePath;
    private Double latitude;
    private Double longitude;
    private String address;
    private Long reportedById;
    private String reportedByName;
    private String reportedByEmail;
    private Long assignedDepartmentId;
    private String assignedDepartmentName;
    private String adminRemarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    private IssueResponse(Builder b) {
        this.id = b.id; this.complaintId = b.complaintId; this.title = b.title;
        this.description = b.description; this.category = b.category; this.status = b.status;
        this.imagePath = b.imagePath; this.latitude = b.latitude; this.longitude = b.longitude;
        this.address = b.address; this.reportedById = b.reportedById;
        this.reportedByName = b.reportedByName; this.reportedByEmail = b.reportedByEmail;
        this.assignedDepartmentId = b.assignedDepartmentId;
        this.assignedDepartmentName = b.assignedDepartmentName;
        this.adminRemarks = b.adminRemarks; this.createdAt = b.createdAt;
        this.updatedAt = b.updatedAt; this.resolvedAt = b.resolvedAt;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id, reportedById, assignedDepartmentId;
        private String complaintId, title, description, category, status, imagePath;
        private Double latitude, longitude;
        private String address, reportedByName, reportedByEmail, assignedDepartmentName, adminRemarks;
        private LocalDateTime createdAt, updatedAt, resolvedAt;

        public Builder id(Long v)                        { this.id = v; return this; }
        public Builder complaintId(String v)             { this.complaintId = v; return this; }
        public Builder title(String v)                   { this.title = v; return this; }
        public Builder description(String v)             { this.description = v; return this; }
        public Builder category(String v)                { this.category = v; return this; }
        public Builder status(String v)                  { this.status = v; return this; }
        public Builder imagePath(String v)               { this.imagePath = v; return this; }
        public Builder latitude(Double v)                { this.latitude = v; return this; }
        public Builder longitude(Double v)               { this.longitude = v; return this; }
        public Builder address(String v)                 { this.address = v; return this; }
        public Builder reportedById(Long v)              { this.reportedById = v; return this; }
        public Builder reportedByName(String v)          { this.reportedByName = v; return this; }
        public Builder reportedByEmail(String v)         { this.reportedByEmail = v; return this; }
        public Builder assignedDepartmentId(Long v)      { this.assignedDepartmentId = v; return this; }
        public Builder assignedDepartmentName(String v)  { this.assignedDepartmentName = v; return this; }
        public Builder adminRemarks(String v)            { this.adminRemarks = v; return this; }
        public Builder createdAt(LocalDateTime v)        { this.createdAt = v; return this; }
        public Builder updatedAt(LocalDateTime v)        { this.updatedAt = v; return this; }
        public Builder resolvedAt(LocalDateTime v)       { this.resolvedAt = v; return this; }
        public IssueResponse build()                     { return new IssueResponse(this); }
    }

    public static IssueResponse from(Issue issue) {
        return IssueResponse.builder()
                .id(issue.getId())
                .complaintId(issue.getComplaintId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .category(issue.getCategory().name())
                .status(issue.getStatus().name())
                .imagePath(issue.getImagePath())
                .latitude(issue.getLatitude())
                .longitude(issue.getLongitude())
                .address(issue.getAddress())
                .reportedById(issue.getReportedBy() != null ? issue.getReportedBy().getId() : null)
                .reportedByName(issue.getReportedBy() != null ? issue.getReportedBy().getName() : null)
                .reportedByEmail(issue.getReportedBy() != null ? issue.getReportedBy().getEmail() : null)
                .assignedDepartmentId(issue.getAssignedDepartment() != null ? issue.getAssignedDepartment().getId() : null)
                .assignedDepartmentName(issue.getAssignedDepartment() != null ? issue.getAssignedDepartment().getName() : null)
                .adminRemarks(issue.getAdminRemarks())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .resolvedAt(issue.getResolvedAt())
                .build();
    }

    // Getters
    public Long getId()                       { return id; }
    public String getComplaintId()            { return complaintId; }
    public String getTitle()                  { return title; }
    public String getDescription()            { return description; }
    public String getCategory()               { return category; }
    public String getStatus()                 { return status; }
    public String getImagePath()              { return imagePath; }
    public Double getLatitude()               { return latitude; }
    public Double getLongitude()              { return longitude; }
    public String getAddress()                { return address; }
    public Long getReportedById()             { return reportedById; }
    public String getReportedByName()         { return reportedByName; }
    public String getReportedByEmail()        { return reportedByEmail; }
    public Long getAssignedDepartmentId()     { return assignedDepartmentId; }
    public String getAssignedDepartmentName() { return assignedDepartmentName; }
    public String getAdminRemarks()           { return adminRemarks; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
    public LocalDateTime getUpdatedAt()       { return updatedAt; }
    public LocalDateTime getResolvedAt()      { return resolvedAt; }
}
