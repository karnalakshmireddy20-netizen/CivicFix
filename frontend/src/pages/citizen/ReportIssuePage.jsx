import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { createIssue } from '../../api/issues'
import { getErrorMessage } from '../../utils/helpers'

const CATEGORIES = [
  { value: 'ROAD_POTHOLE',    label: 'Road / Pothole',     icon: '🛣️' },
  { value: 'GARBAGE',         label: 'Garbage',            icon: '🗑️' },
  { value: 'STREETLIGHT',     label: 'Streetlight',        icon: '💡' },
  { value: 'WATER',           label: 'Water',              icon: '💧' },
  { value: 'DRAINAGE',        label: 'Drainage',           icon: '🚿' },
  { value: 'PUBLIC_PROPERTY', label: 'Public Property',    icon: '🏛️' },
  { value: 'OTHER',           label: 'Other',              icon: '📋' },
]

export default function ReportIssuePage() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', address: '',
    latitude: '', longitude: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [apiError, setApiError] = useState('')
  const [locating, setLocating] = useState(false)
  const fileRef = useRef()

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowed.includes(file.type)) {
      setErrors(er => ({ ...er, image: 'Only image files are allowed (JPEG, PNG, GIF, WEBP)' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(er => ({ ...er, image: 'Image must be under 5MB' }))
      return
    }
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors(er => ({ ...er, image: '' }))
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setApiError('Geolocation is not supported by your browser. Please enter address manually.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude:  pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }))
        setLocating(false)
      },
      () => {
        setLocating(false)
        setApiError('Location permission denied. Please enter address manually.')
      }
    )
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (form.title.length > 255)  e.title       = 'Title must not exceed 255 characters'
    if (!form.description.trim()) e.description = 'Description is required'
    if (form.description.length < 10) e.description = 'Description must be at least 10 characters'
    if (!form.category)           e.category    = 'Please select a category'
    if (!form.address.trim() && !form.latitude)
      e.address = 'Please provide an address or use current location'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title',       form.title.trim())
      fd.append('description', form.description.trim())
      fd.append('category',    form.category)
      fd.append('address',     form.address.trim())
      if (form.latitude)  fd.append('latitude',  form.latitude)
      if (form.longitude) fd.append('longitude', form.longitude)
      if (image)          fd.append('image',     image)

      const res = await createIssue(fd)
      setSuccess(res.data)
      setForm({ title: '', description: '', category: '', address: '', latitude: '', longitude: '' })
      setImage(null)
      setImagePreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setApiError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <Layout>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: 'var(--success)', marginBottom: '.5rem' }}>Issue Reported Successfully!</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
            Your complaint has been submitted. Keep your complaint ID safe to track the status.
          </p>
          <div className="complaint-id-box">
            <p>Your Complaint ID</p>
            <div className="cid">{success.complaintId}</div>
            <p style={{ marginTop: '.5rem' }}>Screenshot or note this ID for future reference.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Link to="/my-issues" className="btn btn-primary">View My Issues</Link>
            <button className="btn btn-secondary" onClick={() => setSuccess(null)}>Report Another</button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header">
          <h1>Report a Civic Issue</h1>
          <p>Fill in the details below. Your complaint will be assigned a unique ID.</p>
        </div>

        {apiError && <Alert type="error" onClose={() => setApiError('')}>{apiError}</Alert>}

        <form onSubmit={handleSubmit} className="card">
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input
              className={`form-control${errors.title ? ' error' : ''}`}
              placeholder="e.g. Deep pothole on Main Street near bus stop"
              value={form.title} onChange={set('title')} maxLength={255}
            />
            {errors.title && <div className="form-error">{errors.title}</div>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category <span className="required">*</span></label>
            <select
              className={`form-control${errors.category ? ' error' : ''}`}
              value={form.category} onChange={set('category')}
            >
              <option value="">— Select a category —</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
            {errors.category && <div className="form-error">{errors.category}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea
              className={`form-control${errors.description ? ' error' : ''}`}
              placeholder="Describe the issue in detail. Include any relevant information that can help resolve it faster."
              value={form.description} onChange={set('description')}
              rows={5} maxLength={2000}
            />
            <div className="form-hint">{form.description.length}/2000 characters</div>
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>

          {/* Image */}
          <div className="form-group">
            <label className="form-label">Photo of the Issue</label>
            <input
              ref={fileRef}
              type="file" accept="image/*"
              className="form-control"
              onChange={handleImage}
            />
            <div className="form-hint">Optional. Max 5MB. JPEG, PNG, GIF, WEBP.</div>
            {errors.image && <div className="form-error">{errors.image}</div>}
            {imagePreview && (
              <div style={{ marginTop: '.75rem' }}>
                <img src={imagePreview} alt="Preview" className="img-preview" style={{ maxHeight: 200 }} />
                <button type="button" className="btn btn-secondary btn-sm" style={{ display: 'block', marginTop: '.5rem' }}
                  onClick={() => { setImage(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = '' }}>
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location <span className="required">*</span></label>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', marginBottom: '.5rem' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={getLocation} disabled={locating}>
                {locating ? <><Spinner /> Detecting…</> : '📍 Use My Location'}
              </button>
              {form.latitude && (
                <span style={{ fontSize: '.8rem', color: 'var(--success)' }}>
                  ✓ Location captured ({parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)})
                </span>
              )}
            </div>
            <input
              className={`form-control${errors.address ? ' error' : ''}`}
              placeholder="Enter address / landmark (e.g. Near Railway Station, MG Road, Bengaluru)"
              value={form.address} onChange={set('address')}
            />
            <div className="form-hint">Use location button OR type an address — at least one is required.</div>
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
            {submitting ? <><Spinner /> Submitting…</> : '📤 Submit Complaint'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
