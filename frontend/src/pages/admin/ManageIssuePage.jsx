import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import StatusBadge from '../../components/ui/StatusBadge'
import StatusTimeline from '../../components/ui/StatusTimeline'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import {
  getAdminIssueById, getDepartments,
  updateIssueStatus, assignDepartment, updateRemarks
} from '../../api/issues'
import {
  formatDateTime, categoryLabel, categoryIcon,
  getImageUrl, getErrorMessage, statusLabel
} from '../../utils/helpers'

export default function ManageIssuePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [issue, setIssue]           = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  // Form state
  const [newStatus, setNewStatus]         = useState('')
  const [selectedDept, setSelectedDept]   = useState('')
  const [remarks, setRemarks]             = useState('')
  const [saving, setSaving]               = useState(false)

  // Image modal
  const [imgModal, setImgModal] = useState(false)

  // Map lazy
  const [MapComponent, setMapComponent] = useState(null)

  useEffect(() => {
    Promise.all([
      getAdminIssueById(id),
      getDepartments(),
    ]).then(([issueRes, deptRes]) => {
      const iss = issueRes.data
      setIssue(iss)
      setDepartments(deptRes.data)
      setNewStatus(iss.status)
      setSelectedDept(iss.assignedDepartmentId || '')
      setRemarks(iss.adminRemarks || '')
      if (iss.latitude && iss.longitude) {
        import('../citizen/MapView').then(m => setMapComponent(() => m.default)).catch(() => {})
      }
    }).catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  const flash = (msg, isError = false) => {
    if (isError) setError(msg)
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 4000) }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus) return
    setSaving(true)
    try {
      const res = await updateIssueStatus(id, { status: newStatus, adminRemarks: remarks })
      setIssue(res.data)
      flash(`Status updated to ${statusLabel(newStatus)}`)
    } catch (err) {
      flash(getErrorMessage(err), true)
    } finally { setSaving(false) }
  }

  const handleAssign = async () => {
    if (!selectedDept) return
    setSaving(true)
    try {
      const res = await assignDepartment(id, { departmentId: parseInt(selectedDept) })
      setIssue(res.data)
      flash('Department assigned successfully')
    } catch (err) {
      flash(getErrorMessage(err), true)
    } finally { setSaving(false) }
  }

  const handleRemarks = async () => {
    setSaving(true)
    try {
      const res = await updateRemarks(id, { adminRemarks: remarks })
      setIssue(res.data)
      setRemarks(res.data.adminRemarks || '')
      flash('Remarks saved successfully')
    } catch (err) {
      flash(getErrorMessage(err), true)
    } finally { setSaving(false) }
  }

  if (loading) return <Layout><Spinner center /></Layout>
  if (error && !issue) return <Layout><div className="alert alert-error">{error}</div></Layout>
  if (!issue) return <Layout><div className="alert alert-error">Issue not found.</div></Layout>

  const imgUrl = getImageUrl(issue.imagePath)

  return (
    <Layout>
      {/* Image modal */}
      {imgModal && imgUrl && (
        <div
          onClick={() => setImgModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '2rem'
          }}
        >
          <img src={imgUrl} alt="Issue" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: 8 }} />
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '.75rem' }}>
          <Link to="/admin/issues" className="btn btn-secondary btn-sm">← All Issues</Link>
        </div>

        {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
        {error   && <Alert type="error"   onClose={() => setError('')}>{error}</Alert>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>

          {/* ── Left: Issue Info ── */}
          <div>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '.85rem', color: 'var(--gray-400)', marginBottom: '.2rem' }}>
                    {issue.complaintId}
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gray-900)' }}>{issue.title}</h2>
                </div>
                <StatusBadge status={issue.status} />
              </div>

              <StatusTimeline status={issue.status} />

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', margin: '1rem 0', fontSize: '.875rem' }}>
                <Detail label="Category"    value={`${categoryIcon(issue.category)} ${categoryLabel(issue.category)}`} />
                <Detail label="Reported By" value={`${issue.reportedByName || '—'} (${issue.reportedByEmail || '—'})`} />
                <Detail label="Reported On" value={formatDateTime(issue.createdAt)} />
                {issue.updatedAt && <Detail label="Last Updated" value={formatDateTime(issue.updatedAt)} />}
                {issue.resolvedAt && <Detail label="Resolved On" value={formatDateTime(issue.resolvedAt)} color="var(--success)" />}
                {issue.assignedDepartmentName && <Detail label="Department" value={`🏢 ${issue.assignedDepartmentName}`} />}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={labelStyle}>Description</div>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{issue.description}</p>
              </div>

              {/* Current Remarks */}
              {issue.adminRemarks && (
                <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '.85rem', border: '1px solid #bfdbfe' }}>
                  <div style={labelStyle}>Current Admin Remarks</div>
                  <p style={{ color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{issue.adminRemarks}</p>
                </div>
              )}
            </div>

            {/* Location */}
            {(issue.address || issue.latitude) && (
              <div className="card" style={{ marginBottom: '1.25rem' }}>
                <div className="card-title">Location</div>
                {issue.address && <p style={{ color: 'var(--gray-700)', marginBottom: '.5rem' }}>📍 {issue.address}</p>}
                {issue.latitude && issue.longitude && (
                  <p style={{ fontSize: '.85rem', color: 'var(--gray-500)', marginBottom: '.5rem' }}>
                    Coordinates: {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
                  </p>
                )}
                {MapComponent && issue.latitude && (
                  <div className="map-container">
                    <MapComponent lat={issue.latitude} lng={issue.longitude} title={issue.title} />
                  </div>
                )}
              </div>
            )}

            {/* Image */}
            {imgUrl && (
              <div className="card">
                <div className="card-title">Uploaded Photo</div>
                <img
                  src={imgUrl} alt="Issue"
                  className="img-preview"
                  style={{ maxHeight: 280, cursor: 'zoom-in' }}
                  onClick={() => setImgModal(true)}
                />
                <p style={{ fontSize: '.75rem', color: 'var(--gray-400)', marginTop: '.35rem' }}>Click image to enlarge</p>
              </div>
            )}
          </div>

          {/* ── Right: Admin Actions ── */}
          <div>
            {/* Update Status */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-title">Update Status</div>
              <div className="form-group" style={{ marginBottom: '.75rem' }}>
                <label className="form-label">New Status</label>
                <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="REPORTED">Reported</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={handleStatusUpdate}
                disabled={saving || newStatus === issue.status}
              >
                {saving ? <Spinner /> : 'Update Status'}
              </button>
              {newStatus === issue.status && (
                <p style={{ fontSize: '.78rem', color: 'var(--gray-400)', marginTop: '.35rem', textAlign: 'center' }}>
                  Already {statusLabel(issue.status)}
                </p>
              )}
            </div>

            {/* Assign Department */}
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="card-title">Assign Department</div>
              <div className="form-group" style={{ marginBottom: '.75rem' }}>
                <label className="form-label">Department</label>
                <select
                  className="form-control"
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                >
                  <option value="">— Select Department —</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-secondary btn-block"
                onClick={handleAssign}
                disabled={saving || !selectedDept}
              >
                {saving ? <Spinner /> : 'Assign Department'}
              </button>
            </div>

            {/* Remarks */}
            <div className="card">
              <div className="card-title">Admin Remarks</div>
              <div className="form-group" style={{ marginBottom: '.75rem' }}>
                <label className="form-label">Remarks / Resolution Note</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Add notes about this issue, actions taken, or resolution details…"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  maxLength={2000}
                />
                <div className="form-hint">{remarks.length}/2000</div>
              </div>
              <button
                className="btn btn-secondary btn-block"
                onClick={handleRemarks}
                disabled={saving}
              >
                {saving ? <Spinner /> : 'Save Remarks'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Small helper sub-components
const labelStyle = { fontSize: '.72rem', color: 'var(--gray-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '.2rem' }

function Detail({ label, value, color }) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={{ color: color || 'var(--gray-700)', fontSize: '.875rem' }}>{value}</div>
    </div>
  )
}
