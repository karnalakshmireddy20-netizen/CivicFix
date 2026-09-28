package com.civicfix.backend.service;

import com.civicfix.backend.dto.*;
import com.civicfix.backend.entity.*;
import com.civicfix.backend.exception.BadRequestException;
import com.civicfix.backend.exception.ResourceNotFoundException;
import com.civicfix.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class IssueService {

    private static final Logger logger = LoggerFactory.getLogger(IssueService.class);

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private IssueStatusHistoryRepository statusHistoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // ─── CITIZEN METHODS ────────────────────────────────────────────────────────

    @Transactional
    public IssueResponse createIssue(IssueRequest request, MultipartFile image, String userEmail) {
        User user = findUserByEmail(userEmail);

        String imagePath = fileStorageService.storeFile(image);

        Issue issue = Issue.builder()
                .complaintId(generateComplaintId())
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .status(Issue.Status.REPORTED)
                .imagePath(imagePath)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .reportedBy(user)
                .build();

        issue = issueRepository.save(issue);

        // Record initial status history
        recordStatusChange(issue, null, Issue.Status.REPORTED, "Issue reported by citizen", userEmail);

        logger.info("New issue created: {} by {}", issue.getComplaintId(), userEmail);
        return IssueResponse.from(issue);
    }

    public List<IssueResponse> getMyIssues(String userEmail) {
        User user = findUserByEmail(userEmail);
        return issueRepository.findByReportedByOrderByCreatedAtDesc(user)
                .stream()
                .map(IssueResponse::from)
                .collect(Collectors.toList());
    }

    public IssueResponse getIssueById(Long id, String userEmail) {
        Issue issue = issueRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        User user = findUserByEmail(userEmail);
        // Citizens can only view their own issues
        if (user.getRole() == User.Role.CITIZEN &&
                !issue.getReportedBy().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied: You can only view your own issues");
        }

        return IssueResponse.from(issue);
    }

    // ─── ADMIN METHODS ──────────────────────────────────────────────────────────

    public List<IssueResponse> getAllIssues(String category, String status) {
        List<Issue> issues;

        if (category != null && status != null) {
            issues = issueRepository.findByCategoryAndStatus(
                    Issue.Category.valueOf(category.toUpperCase()),
                    Issue.Status.valueOf(status.toUpperCase()));
        } else if (category != null) {
            issues = issueRepository.findByCategory(Issue.Category.valueOf(category.toUpperCase()));
        } else if (status != null) {
            issues = issueRepository.findByStatus(Issue.Status.valueOf(status.toUpperCase()));
        } else {
            issues = issueRepository.findAllByOrderByCreatedAtDesc();
        }

        return issues.stream().map(IssueResponse::from).collect(Collectors.toList());
    }

    public IssueResponse getIssueByIdAdmin(Long id) {
        Issue issue = issueRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));
        return IssueResponse.from(issue);
    }

    @Transactional
    public IssueResponse updateStatus(Long id, AdminUpdateRequest request, String adminEmail) {
        Issue issue = issueRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        Issue.Status oldStatus = issue.getStatus();
        Issue.Status newStatus = request.getStatus();

        if (newStatus == null) {
            throw new BadRequestException("Status is required");
        }

        issue.setStatus(newStatus);

        if (newStatus == Issue.Status.RESOLVED) {
            issue.setResolvedAt(LocalDateTime.now());
        }

        if (request.getAdminRemarks() != null && !request.getAdminRemarks().isBlank()) {
            issue.setAdminRemarks(request.getAdminRemarks());
        }

        issue = issueRepository.save(issue);
        recordStatusChange(issue, oldStatus, newStatus, request.getAdminRemarks(), adminEmail);

        logger.info("Issue {} status updated: {} -> {} by {}", issue.getComplaintId(), oldStatus, newStatus, adminEmail);
        return IssueResponse.from(issue);
    }

    @Transactional
    public IssueResponse assignDepartment(Long id, AdminUpdateRequest request, String adminEmail) {
        Issue issue = issueRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        if (request.getDepartmentId() == null) {
            throw new BadRequestException("Department ID is required");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        issue.setAssignedDepartment(department);
        issue = issueRepository.save(issue);

        logger.info("Issue {} assigned to department: {}", issue.getComplaintId(), department.getName());
        return IssueResponse.from(issue);
    }

    @Transactional
    public IssueResponse updateRemarks(Long id, AdminUpdateRequest request, String adminEmail) {
        Issue issue = issueRepository.findByIdWithAssociations(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id: " + id));

        issue.setAdminRemarks(request.getAdminRemarks());
        issue = issueRepository.save(issue);

        logger.info("Issue {} remarks updated by {}", issue.getComplaintId(), adminEmail);
        return IssueResponse.from(issue);
    }

    public DashboardResponse getDashboard() {
        long total = issueRepository.count();
        long reported = issueRepository.countByStatus(Issue.Status.REPORTED);
        long inProgress = issueRepository.countByStatus(Issue.Status.IN_PROGRESS);
        long resolved = issueRepository.countByStatus(Issue.Status.RESOLVED);
        long rejected = issueRepository.countByStatus(Issue.Status.REJECTED);

        List<IssueResponse> recent = issueRepository
                .findRecentIssues(PageRequest.of(0, 5))
                .stream()
                .map(IssueResponse::from)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalIssues(total)
                .reported(reported)
                .inProgress(inProgress)
                .resolved(resolved)
                .rejected(rejected)
                .recentIssues(recent)
                .build();
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // ─── HELPERS ────────────────────────────────────────────────────────────────

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private void recordStatusChange(Issue issue, Issue.Status oldStatus,
                                     Issue.Status newStatus, String remarks, String changedBy) {
        IssueStatusHistory history = IssueStatusHistory.builder()
                .issue(issue)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .remarks(remarks)
                .changedBy(changedBy)
                .build();
        statusHistoryRepository.save(history);
    }

    private String generateComplaintId() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + new Random().nextInt(9000);
        String id = "CF-" + date + "-" + rand;
        // Ensure uniqueness (retry if collision)
        if (issueRepository.findByComplaintId(id).isPresent()) {
            id = "CF-" + date + "-" + (new Random().nextInt(90000) + 10000);
        }
        return id;
    }
}
