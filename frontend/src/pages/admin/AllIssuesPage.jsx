import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/ui/StatusBadge'
import Spinner from '../../components/ui/Spinner'
import { getAllIssues } from '../../api/issues'
import { formatDate, categoryLabel, categoryIcon, getErrorMessage, getImageUrl } from '../../utils/helpers'

const CATEGORIES = [
  { value: 'ROAD_POTHOLE', label: 'Road / Pothole' },
  { value: 'GARBAGE', label: 'Garbage' },
  { value: 'STREETLIGHT', label: 'Streetlight' },
  { value: 'WATER', label: 'Water' },
  { value: 'DRAINAGE', label: 'Drainage' },
  { value: 'PUBLIC_PROPERTY', label: 'Public Property' },
  { value: 'OTHER', label: 'Other' },
]

export default function AllIssuesPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const fetchIssues = useCallback(() => {
    setLoading(true)
    const params = {}
    if (filterStatus)   params.status   = filterStatus
    if (filterCategory) params.category = filterCategory
    getAllIssues(params)
      .then(res => setIssues(res.data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [filterStatus, filterCategory])

  useEffect(() => { fetchIssues() }, [fetchIssues])

  const filtered = issues.filter(i => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      i.title.toLowerCase().includes(q) ||
      i.complaintId.toLowerCase().includes(q) ||
      (i.reportedByName || '').toLowerCase().includes(q) ||
      (i.address || '').toLowerCase().includes(q)
    )
  })

  return (
    <Layout>
      <div className="page-header page-header-row">
        <div>
          <h1>All Issues</h1>
          <p>{filtered.length} issue{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
      </div>

      <div className="filter-row">
        <input
          className="form-control search-input"
          placeholder="🔍 Search by title, ID, reporter, address…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select className="form-control" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {(filterStatus || filterCategory) && (
          <button className="btn btn-secondary btn-sm"
            onClick={() => { setFilterStatus(''); setFilterCategory('') }}>
            Clear Filters
          </button>
        )}
      </div>

      {loading && <Spinner center />}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No issues found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Reported By</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(issue => (
                  <tr key={issue.id}>
                    <td>
                      {issue.imagePath
                        ? <img src={getImageUrl(issue.imagePath)} alt="" className="img-thumb" />
                        : <span style={{ color: 'var(--gray-300)', fontSize: '1.25rem' }}>🖼️</span>
                      }
                    </td>
                    <td><code style={{ fontSize: '.75rem', color: 'var(--gray-500)' }}>{issue.complaintId}</code></td>
                    <td style={{ maxWidth: 180 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {issue.title}
                      </span>
                      {issue.address && (
                        <span style={{ fontSize: '.75rem', color: 'var(--gray-400)' }}>📍 {issue.address}</span>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{categoryIcon(issue.category)} {categoryLabel(issue.category)}</td>
                    <td>{issue.reportedByName || '—'}</td>
                    <td>{issue.assignedDepartmentName || <span style={{ color: 'var(--gray-300)' }}>Unassigned</span>}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(issue.createdAt)}</td>
                    <td><StatusBadge status={issue.status} /></td>
                    <td>
                      <Link to={`/admin/issues/${issue.id}`} className="btn btn-primary btn-sm">Manage</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  )
}
