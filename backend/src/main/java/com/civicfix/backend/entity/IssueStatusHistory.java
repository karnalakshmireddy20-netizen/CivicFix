package com.civicfix.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "issue_status_history")
public class IssueStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @Enumerated(EnumType.STRING)
    private Issue.Status oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Issue.Status newStatus;

    @Column(length = 1000)
    private String remarks;

    private String changedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime changedAt;

    public IssueStatusHistory() {}

    private IssueStatusHistory(Builder b) {
        this.issue = b.issue; this.oldStatus = b.oldStatus;
        this.newStatus = b.newStatus; this.remarks = b.remarks;
        this.changedBy = b.changedBy;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Issue issue;
        private Issue.Status oldStatus, newStatus;
        private String remarks, changedBy;
        public Builder issue(Issue v)              { this.issue = v; return this; }
        public Builder oldStatus(Issue.Status v)   { this.oldStatus = v; return this; }
        public Builder newStatus(Issue.Status v)   { this.newStatus = v; return this; }
        public Builder remarks(String v)           { this.remarks = v; return this; }
        public Builder changedBy(String v)         { this.changedBy = v; return this; }
        public IssueStatusHistory build()          { return new IssueStatusHistory(this); }
    }

    public Long getId()               { return id; }
    public Issue getIssue()           { return issue; }
    public Issue.Status getOldStatus(){ return oldStatus; }
    public Issue.Status getNewStatus(){ return newStatus; }
    public String getRemarks()        { return remarks; }
    public String getChangedBy()      { return changedBy; }
    public LocalDateTime getChangedAt(){ return changedAt; }
}
