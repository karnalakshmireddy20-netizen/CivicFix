package com.civicfix.backend.dto;

import java.util.List;

public class DashboardResponse {
    private long totalIssues;
    private long reported;
    private long inProgress;
    private long resolved;
    private long rejected;
    private List<IssueResponse> recentIssues;

    private DashboardResponse(Builder b) {
        this.totalIssues = b.totalIssues; this.reported = b.reported;
        this.inProgress = b.inProgress; this.resolved = b.resolved;
        this.rejected = b.rejected; this.recentIssues = b.recentIssues;
    }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private long totalIssues, reported, inProgress, resolved, rejected;
        private List<IssueResponse> recentIssues;
        public Builder totalIssues(long v)               { this.totalIssues = v; return this; }
        public Builder reported(long v)                  { this.reported = v; return this; }
        public Builder inProgress(long v)                { this.inProgress = v; return this; }
        public Builder resolved(long v)                  { this.resolved = v; return this; }
        public Builder rejected(long v)                  { this.rejected = v; return this; }
        public Builder recentIssues(List<IssueResponse> v){ this.recentIssues = v; return this; }
        public DashboardResponse build()                 { return new DashboardResponse(this); }
    }

    public long getTotalIssues()              { return totalIssues; }
    public long getReported()                 { return reported; }
    public long getInProgress()               { return inProgress; }
    public long getResolved()                 { return resolved; }
    public long getRejected()                 { return rejected; }
    public List<IssueResponse> getRecentIssues() { return recentIssues; }
}
