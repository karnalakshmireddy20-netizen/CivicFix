package com.civicfix.backend.repository;

import com.civicfix.backend.entity.Issue;
import com.civicfix.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long>, JpaSpecificationExecutor<Issue> {
    List<Issue> findByReportedByOrderByCreatedAtDesc(User user);
    Optional<Issue> findByComplaintId(String complaintId);
    List<Issue> findAllByOrderByCreatedAtDesc();

    long countByStatus(Issue.Status status);
    long countByCategory(Issue.Category category);

    @Query("SELECT i FROM Issue i ORDER BY i.createdAt DESC")
    List<Issue> findRecentIssues(org.springframework.data.domain.Pageable pageable);

    List<Issue> findByCategoryAndStatus(Issue.Category category, Issue.Status status);
    List<Issue> findByCategory(Issue.Category category);
    List<Issue> findByStatus(Issue.Status status);
}
