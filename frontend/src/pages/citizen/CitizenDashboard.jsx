import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'
import { getMyIssues } from '../../api/issues'
import { formatDate, categoryLabel, categoryIcon, getErrorMessage } from '../../utils/helpers'

export default function CitizenDashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyIssues()
      .then(res => setIssues(res.data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const counts = {
    total:      issues.length,
    reported:   issues.filter(i => i.status === 'REPORTED').length,
    inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
    resolved:   issues.filter(i => i.status === 'RESOLVED').length,
  }

  const recent = [...issues].slice(0, 5)

  return (
    <Layout>
      <div className="page-header page-header-row">
        <div>
          <h1>Welcome back, {user.name} 👋</h1>
          <p>Here's a summary of your reported issues.</p>
        </div>
        <Link to="/report" className="btn btn-primary">+ Report New Issue</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{counts.total}</div>
          <div className="stat-label">Total Issues</div>
        </div>
        <div className="stat-card reported">
          <div className="stat-value">{counts.reported}</div>
          <div className="stat-label">Reported</div>
        </div>
        <div className="stat-card inprogress">
          <div className="stat-value">{counts.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-value">{counts.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Issues</div>
        {loading && <Spinner center />}
        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
        {!loading && !error && issues.length === 0 && (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No issues reported yet</h3>
            <p>Start by reporting a civic issue in your area.</p>
            <Link to="/report" className="btn btn-primary" style={{ marginTop: '1rem' }}>Report an Issue</Link>
          </div>
        )}
        {!loading && recent.map(issue => (
          <Link to={`/issues/${issue.id}`} key={issue.id} style={{ textDecoration: 'none' }}>
            <div className="issue-card">
              <div className="issue-card-left">
                <div className="issue-card-id">{issue.complaintId}</div>
                <div className="issue-card-title">{issue.title}</div>
                <div className="issue-card-meta">
                  <span>{categoryIcon(issue.category)} {categoryLabel(issue.category)}</span>
                  <span>📅 {formatDate(issue.createdAt)}</span>
                  {issue.address && <span>📍 {issue.address}</span>}
                </div>
              </div>
              <StatusBadge status={issue.status} />
            </div>
          </Link>
        ))}
        {!loading && issues.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/my-issues" className="btn btn-secondary btn-sm">View All Issues →</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
