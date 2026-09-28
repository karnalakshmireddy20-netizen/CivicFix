import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { getMyIssues } from '../../api/issues'
import { formatDate, categoryLabel, categoryIcon, getErrorMessage } from '../../utils/helpers'

export default function MyIssuesPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    getMyIssues()
      .then(res => setIssues(res.data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = issues.filter(i => {
    const matchSearch = !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.complaintId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || i.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <Layout>
      <div className="page-header page-header-row">
        <div>
          <h1>My Issues</h1>
          <p>Track all your reported civic complaints.</p>
        </div>
        <Link to="/report" className="btn btn-primary">+ Report New</Link>
      </div>

      <div className="filter-row">
        <input
          className="form-control search-input"
          placeholder="🔍 Search by title or complaint ID…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading && <Spinner center />}
      {error  && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>{issues.length === 0 ? 'No issues reported yet' : 'No issues match your filter'}</h3>
          {issues.length === 0 && (
            <Link to="/report" className="btn btn-primary" style={{ marginTop: '1rem' }}>Report an Issue</Link>
          )}
        </div>
      )}

      {!loading && filtered.map(issue => (
        <Link to={`/issues/${issue.id}`} key={issue.id} style={{ textDecoration: 'none' }}>
          <div className="issue-card">
            <div className="issue-card-left">
              <div className="issue-card-id">{issue.complaintId}</div>
              <div className="issue-card-title">{issue.title}</div>
              <div className="issue-card-meta">
                <span>{categoryIcon(issue.category)} {categoryLabel(issue.category)}</span>
                <span>📅 {formatDate(issue.createdAt)}</span>
                {issue.address && <span>📍 {issue.address}</span>}
                {issue.assignedDepartmentName && (
                  <span>🏢 {issue.assignedDepartmentName}</span>
                )}
              </div>
            </div>
            <StatusBadge status={issue.status} />
          </div>
        </Link>
      ))}
    </Layout>
  )
}
