import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { getAdminDashboard } from '../../api/issues'
import { formatDate, categoryLabel, categoryIcon, getErrorMessage } from '../../utils/helpers'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminDashboard()
      .then(res => setData(res.data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="page-header page-header-row">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of all civic issues across the platform.</p>
        </div>
        <Link to="/admin/issues" className="btn btn-primary">View All Issues →</Link>
      </div>

      {loading && <Spinner center />}
      {error   && <div className="alert alert-error">{error}</div>}

      {data && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{data.totalIssues}</div>
              <div className="stat-label">Total Issues</div>
            </div>
            <div className="stat-card reported">
              <div className="stat-value">{data.reported}</div>
              <div className="stat-label">Reported</div>
            </div>
            <div className="stat-card inprogress">
              <div className="stat-value">{data.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card resolved">
              <div className="stat-value">{data.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-value">{data.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {/* Resolution Rate */}
          {data.totalIssues > 0 && (
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div className="card-title">Resolution Rate</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: 12, background: 'var(--gray-200)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((data.resolved / data.totalIssues) * 100)}%`,
                    background: 'var(--success)', borderRadius: 99,
                    transition: 'width .6s ease'
                  }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--success)', minWidth: 48 }}>
                  {Math.round((data.resolved / data.totalIssues) * 100)}%
                </span>
              </div>
              <p style={{ color: 'var(--gray-500)', fontSize: '.8rem', marginTop: '.5rem' }}>
                {data.resolved} resolved out of {data.totalIssues} total issues
              </p>
            </div>
          )}

          {/* Recent Issues */}
          <div className="card">
            <div className="card-title">Recent Issues</div>
            {data.recentIssues.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>No issues yet</h3>
              </div>
            ) : (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Complaint ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Reported By</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentIssues.map(issue => (
                        <tr key={issue.id}>
                          <td><code style={{ fontSize: '.78rem' }}>{issue.complaintId}</code></td>
                          <td style={{ maxWidth: 200 }}>
                            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {issue.title}
                            </span>
                          </td>
                          <td>{categoryIcon(issue.category)} {categoryLabel(issue.category)}</td>
                          <td>{issue.reportedByName || '—'}</td>
                          <td>{formatDate(issue.createdAt)}</td>
                          <td><StatusBadge status={issue.status} /></td>
                          <td>
                            <Link to={`/admin/issues/${issue.id}`} className="btn btn-primary btn-sm">Manage</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Link to="/admin/issues" className="btn btn-secondary btn-sm">View All Issues →</Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
