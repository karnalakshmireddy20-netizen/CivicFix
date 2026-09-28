package com.civicfix.backend.dto;

import com.civicfix.backend.entity.Issue;

public class AdminUpdateRequest {
    private Issue.Status status;
    private Long departmentId;
    private String adminRemarks;

    public Issue.Status getStatus()         { return status; }
    public void setStatus(Issue.Status v)   { this.status = v; }
    public Long getDepartmentId()           { return departmentId; }
    public void setDepartmentId(Long v)     { this.departmentId = v; }
    public String getAdminRemarks()         { return adminRemarks; }
    public void setAdminRemarks(String v)   { this.adminRemarks = v; }
}
