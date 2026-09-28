import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/ui/StatusBadge'
import StatusTimeline from '../../components/ui/StatusTimeline'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'
import { getIssueById, getAdminIssueById } from '../../api/issues'
import { formatDateTime, categoryLabel, categoryIcon, getImageUrl, getErrorMessage } from '../../utils/helpers'

// Dynamically import Leaflet only when needed
let MapComponent = null

export default function IssueDetailPage() {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const fetch = isAdmin ? getAdminIssueById : getIssueById
    fetch(id)
      .then(res => {
        setIssue(res.data)
        if (res.data.latitude && res.data.longitude) {
          // Lazy-load map
          import('./MapView').then(m => {
            MapComponent = m.default
            setMapReady(true)
          }).catch(() => setMapReady(false))
        }
      })
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, isAdmin])

  if (loading) return <Layout><Spinner center /></Layout>
  if (error)   return <Layout><div className="alert alert-error">{error}</div></Layout>
  if (!issue)  return <Layout><div className="alert alert-error">Issue not found.</div></Layout>

  const imgUrl = getImageUrl(issue.imagePath)
  const backPath = isAdmin ? `/admin/issues/${id}` : '/my-issues'
  const backLabel = isAdmin ? '← Manage Issue' : '← My Issues'

  return (
    <Layout>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link to={isAdmin ? '/admin/issues' : '/my-issues'} className="btn btn-secondary btn-sm">{backLabel}</Link>
        </div>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontFamily: 'monospace', color: 'var(--gray-400)', fontSize: '.85rem', marginBottom: '.25rem' }}>
                {issue.complaintId}
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gray-900)' }}>{issue.title}</h2>
            </div>
            <StatusBadge status={issue.status} />
          </div>

          {/* Status Timeline */}
          <StatusTimeline status={issue.status} />

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' }}>
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.2rem' }}>Category</div>
              <div>{categoryIcon(issue.category)} {categoryLabel(issue.category)}</div>
            </div>
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.2rem' }}>Reported On</div>
              <div>{formatDateTime(issue.createdAt)}</div>
            </div>
            {issue.assignedDepartmentName && (
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.2rem' }}>Assigned Department</div>
                <div>🏢 {issue.assignedDepartmentName}</div>
              </div>
            )}
            {issue.resolvedAt && (
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.2rem' }}>Resolved On</div>
                <div style={{ color: 'var(--success)' }}>{formatDateTime(issue.resolvedAt)}</div>
              </div>
            )}
            {issue.updatedAt && (
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.2rem' }}>Last Updated</div>
                <div>{formatDateTime(issue.updatedAt)}</div>
              </div>
            )}
            {isAdmin && issue.reportedByName && (
              <div>
                <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.2rem' }}>Reported By</div>
                <div>👤 {issue.reportedByName} ({issue.reportedByEmail})</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.4rem' }}>Description</div>
            <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{issue.description}</p>
          </div>

          {/* Admin Remarks */}
          {issue.adminRemarks && (
            <div style={{ background: 'var(--primary-light)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.4rem' }}>Admin Remarks</div>
              <p style={{ color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{issue.adminRemarks}</p>
            </div>
          )}

          {/* Location */}
          {(issue.address || issue.latitude) && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.4rem' }}>Location</div>
              {issue.address && <p style={{ color: 'var(--gray-700)', marginBottom: '.5rem' }}>📍 {issue.address}</p>}
              {issue.latitude && issue.longitude && !mapReady && (
                <p style={{ color: 'var(--gray-500)', fontSize: '.85rem' }}>
                  Coordinates: {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
                </p>
              )}
              {mapReady && MapComponent && (
                <div className="map-container">
                  <MapComponent lat={issue.latitude} lng={issue.longitude} title={issue.title} />
                </div>
              )}
            </div>
          )}

          {/* Image */}
          {imgUrl && (
            <div>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '.5rem' }}>Uploaded Photo</div>
              <img src={imgUrl} alt="Issue" className="img-preview" style={{ maxHeight: 320, borderRadius: 'var(--radius)' }} />
            </div>
          )}
        </div>

        {isAdmin && (
          <div style={{ textAlign: 'center' }}>
            <Link to={`/admin/issues/${id}`} className="btn btn-primary">Manage This Issue →</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
