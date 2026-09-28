package com.civicfix.backend.repository;

import com.civicfix.backend.entity.Issue;
import com.civicfix.backend.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long>, JpaSpecificationExecutor<Issue> {

    // ─── Citizen: my issues ───────────────────────────────────────────────────
    // JOIN FETCH loads reportedBy and assignedDepartment in a single query,
    // avoiding LazyInitializationException when open-in-view=false
    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "WHERE i.reportedBy = :user " +
           "ORDER BY i.createdAt DESC")
    List<Issue> findByReportedByOrderByCreatedAtDesc(@Param("user") User user);

    // ─── Single issue lookup ──────────────────────────────────────────────────
    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "WHERE i.id = :id")
    Optional<Issue> findByIdWithAssociations(@Param("id") Long id);

    Optional<Issue> findByComplaintId(String complaintId);

    // ─── Admin: all issues ────────────────────────────────────────────────────
    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "ORDER BY i.createdAt DESC")
    List<Issue> findAllByOrderByCreatedAtDesc();

    // ─── Admin: dashboard recent issues ──────────────────────────────────────
    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "ORDER BY i.createdAt DESC")
    List<Issue> findRecentIssues(Pageable pageable);

    // ─── Counts (no associations needed) ─────────────────────────────────────
    long countByStatus(Issue.Status status);
    long countByCategory(Issue.Category category);

    // ─── Filtered queries ─────────────────────────────────────────────────────
    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "WHERE i.category = :category AND i.status = :status " +
           "ORDER BY i.createdAt DESC")
    List<Issue> findByCategoryAndStatus(
            @Param("category") Issue.Category category,
            @Param("status") Issue.Status status);

    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "WHERE i.category = :category " +
           "ORDER BY i.createdAt DESC")
    List<Issue> findByCategory(@Param("category") Issue.Category category);

    @Query("SELECT i FROM Issue i " +
           "LEFT JOIN FETCH i.reportedBy " +
           "LEFT JOIN FETCH i.assignedDepartment " +
           "WHERE i.status = :status " +
           "ORDER BY i.createdAt DESC")
    List<Issue> findByStatus(@Param("status") Issue.Status status);
}
