package com.civicfix.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String complaintId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String imagePath;
    private Double latitude;
    private Double longitude;

    @Column(length = 500)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_department_id")
    private Department assignedDepartment;

    @Column(length = 2000)
    private String adminRemarks;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;

    public enum Category {
        ROAD_POTHOLE, GARBAGE, STREETLIGHT, WATER, DRAINAGE, PUBLIC_PROPERTY, OTHER
    }

    public enum Status {
        REPORTED, IN_PROGRESS, RESOLVED, REJECTED
    }

    public Issue() {}

    private Issue(Builder b) {
        this.complaintId = b.complaintId; this.title = b.title;
        this.description = b.description; this.category = b.category;
        this.status = b.status; this.imagePath = b.imagePath;
        this.latitude = b.latitude; this.longitude = b.longitude;
        this.address = b.address; this.reportedBy = b.reportedBy;
        this.assignedDepartment = b.assignedDepartment;
        this.adminRemarks = b.adminRemarks;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String complaintId, title, description, imagePath, address, adminRemarks;
        private Category category;
        private Status status;
        private Double latitude, longitude;
        private User reportedBy;
        private Department assignedDepartment;
        public Builder complaintId(String v)              { this.complaintId = v; return this; }
        public Builder title(String v)                    { this.title = v; return this; }
        public Builder description(String v)              { this.description = v; return this; }
        public Builder category(Category v)               { this.category = v; return this; }
        public Builder status(Status v)                   { this.status = v; return this; }
        public Builder imagePath(String v)                { this.imagePath = v; return this; }
        public Builder latitude(Double v)                 { this.latitude = v; return this; }
        public Builder longitude(Double v)                { this.longitude = v; return this; }
        public Builder address(String v)                  { this.address = v; return this; }
        public Builder reportedBy(User v)                 { this.reportedBy = v; return this; }
        public Builder assignedDepartment(Department v)   { this.assignedDepartment = v; return this; }
        public Builder adminRemarks(String v)             { this.adminRemarks = v; return this; }
        public Issue build()                              { return new Issue(this); }
    }

    // Getters
    public Long getId()                         { return id; }
    public String getComplaintId()              { return complaintId; }
    public String getTitle()                    { return title; }
    public String getDescription()              { return description; }
    public Category getCategory()               { return category; }
    public Status getStatus()                   { return status; }
    public String getImagePath()                { return imagePath; }
    public Double getLatitude()                 { return latitude; }
    public Double getLongitude()                { return longitude; }
    public String getAddress()                  { return address; }
    public User getReportedBy()                 { return reportedBy; }
    public Department getAssignedDepartment()   { return assignedDepartment; }
    public String getAdminRemarks()             { return adminRemarks; }
    public LocalDateTime getCreatedAt()         { return createdAt; }
    public LocalDateTime getUpdatedAt()         { return updatedAt; }
    public LocalDateTime getResolvedAt()        { return resolvedAt; }

    // Setters
    public void setComplaintId(String v)            { this.complaintId = v; }
    public void setTitle(String v)                  { this.title = v; }
    public void setDescription(String v)            { this.description = v; }
    public void setCategory(Category v)             { this.category = v; }
    public void setStatus(Status v)                 { this.status = v; }
    public void setImagePath(String v)              { this.imagePath = v; }
    public void setLatitude(Double v)               { this.latitude = v; }
    public void setLongitude(Double v)              { this.longitude = v; }
    public void setAddress(String v)                { this.address = v; }
    public void setReportedBy(User v)               { this.reportedBy = v; }
    public void setAssignedDepartment(Department v) { this.assignedDepartment = v; }
    public void setAdminRemarks(String v)           { this.adminRemarks = v; }
    public void setResolvedAt(LocalDateTime v)      { this.resolvedAt = v; }
}
