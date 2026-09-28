package com.civicfix.backend.controller;

import com.civicfix.backend.dto.AdminUpdateRequest;
import com.civicfix.backend.dto.CreateAdminRequest;
import com.civicfix.backend.dto.DashboardResponse;
import com.civicfix.backend.dto.IssueResponse;
import com.civicfix.backend.dto.UserResponse;
import com.civicfix.backend.entity.Department;
import com.civicfix.backend.service.AdminUserService;
import com.civicfix.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private AdminUserService adminUserService;

    /**
     * GET /api/admin/dashboard — dashboard statistics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(issueService.getDashboard());
    }

    /**
     * GET /api/admin/issues — all issues, with optional filters
     */
    @GetMapping("/issues")
    public ResponseEntity<List<IssueResponse>> getAllIssues(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(issueService.getAllIssues(category, status));
    }

    /**
     * GET /api/admin/issues/{id} — issue detail
     */
    @GetMapping("/issues/{id}")
    public ResponseEntity<IssueResponse> getIssue(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getIssueByIdAdmin(id));
    }

    /**
     * PUT /api/admin/issues/{id}/status — update status
     */
    @PutMapping("/issues/{id}/status")
    public ResponseEntity<IssueResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody AdminUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(issueService.updateStatus(id, request, userDetails.getUsername()));
    }

    /**
     * PUT /api/admin/issues/{id}/assign — assign department
     */
    @PutMapping("/issues/{id}/assign")
    public ResponseEntity<IssueResponse> assignDepartment(
            @PathVariable Long id,
            @RequestBody AdminUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(issueService.assignDepartment(id, request, userDetails.getUsername()));
    }

    /**
     * PUT /api/admin/issues/{id}/remarks — add/update admin remarks
     */
    @PutMapping("/issues/{id}/remarks")
    public ResponseEntity<IssueResponse> updateRemarks(
            @PathVariable Long id,
            @RequestBody AdminUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(issueService.updateRemarks(id, request, userDetails.getUsername()));
    }

    /**
     * GET /api/admin/departments — list all departments (for assign dropdown)
     */
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(issueService.getAllDepartments());
    }

    /**
     * GET /api/admin/users — list all users (optionally filter by ?role=ADMIN or ?role=CITIZEN)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> listUsers(
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(adminUserService.listUsers(role));
    }

    /**
     * POST /api/admin/users — create a new ADMIN account (only existing admins can do this)
     */
    @PostMapping("/users")
    public ResponseEntity<UserResponse> createAdmin(
            @Valid @RequestBody CreateAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminUserService.createAdmin(request));
    }
}
