package com.civicfix.backend.controller;

import com.civicfix.backend.dto.IssueRequest;
import com.civicfix.backend.dto.IssueResponse;
import com.civicfix.backend.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    /**
     * POST /api/issues — citizen reports a new issue (multipart: JSON fields + optional image)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IssueResponse> createIssue(
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart("category") String category,
            @RequestPart(value = "address", required = false) String address,
            @RequestPart(value = "latitude", required = false) String latitude,
            @RequestPart(value = "longitude", required = false) String longitude,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {

        IssueRequest request = new IssueRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setCategory(com.civicfix.backend.entity.Issue.Category.valueOf(category.toUpperCase()));
        request.setAddress(address);
        if (latitude != null && !latitude.isBlank()) {
            request.setLatitude(Double.parseDouble(latitude));
        }
        if (longitude != null && !longitude.isBlank()) {
            request.setLongitude(Double.parseDouble(longitude));
        }

        IssueResponse response = issueService.createIssue(request, image, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/issues/my — get all issues reported by the logged-in citizen
     */
    @GetMapping("/my")
    public ResponseEntity<List<IssueResponse>> getMyIssues(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(issueService.getMyIssues(userDetails.getUsername()));
    }

    /**
     * GET /api/issues/{id} — get a specific issue (citizen sees own; admin sees all)
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(issueService.getIssueById(id, userDetails.getUsername()));
    }
}
