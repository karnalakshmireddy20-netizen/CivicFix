package com.civicfix.backend.repository;

import com.civicfix.backend.entity.Issue;
import com.civicfix.backend.entity.IssueStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueStatusHistoryRepository extends JpaRepository<IssueStatusHistory, Long> {
    List<IssueStatusHistory> findByIssueOrderByChangedAtAsc(Issue issue);
}
