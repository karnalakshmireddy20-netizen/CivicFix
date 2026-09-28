import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import { listAdminUsers, createAdminUser } from '../../api/issues'
import { formatDate, getErrorMessage } from '../../utils/helpers'

export default function ManageAdminsPage() {
  const [admins, setAdmins]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [fetchError, setFetchError] = useState('')

  // Create form state
  const [form, setForm]         = useState({ name: '', email: '', password: '', phone: '' })
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]   = useState('')
  const [apiError, setApiError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadAdmins = () => {
    setLoading(true)
    listAdminUsers('ADMIN')
      .then(res => setAdmins(res.data))
      .catch(err => setFetchError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAdmins() }, [])

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setFormErrors(fe => ({ ...fe, [field]: '' }))
    setApiError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)       e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) e.phone = 'Phone must be 10 digits'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }

    setSubmitting(true)
    setApiError('')
    try {
      await createAdminUser({
        name:     form.name.trim(),
        email:    form.email.trim(),
        password: form.password,
        phone:    form.phone.trim() || undefined,
      })
      setSuccess(`Admin account created for ${form.email.trim()}`)
      setForm({ name: '', email: '', password: '', phone: '' })
      setShowForm(false)
      loadAdmins()
    } catch (err) {
      setApiError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="page-header page-header-row">
        <div>
          <h1>Manage Admins</h1>
          <p>View all admin accounts and create new ones.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(s => !s); setApiError(''); setFormErrors({}) }}
        >
          {showForm ? '✕ Cancel' : '+ Create New Admin'}
        </button>
      </div>

      {success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Create Admin Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: 520 }}>
          <div className="card-title">Create New Admin Account</div>
          <p style={{ color: 'var(--gray-500)', fontSize: '.875rem', marginBottom: '1.25rem' }}>
            This account will have full admin access. Share credentials securely.
          </p>

          {apiError && <Alert type="error" onClose={() => setApiError('')}>{apiError}</Alert>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                className={`form-control${formErrors.name ? ' error' : ''}`}
                placeholder="e.g. Priya Verma"
                value={form.name} onChange={set('name')}
              />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input
                type="email"
                className={`form-control${formErrors.email ? ' error' : ''}`}
                placeholder="admin@civicfix.com"
                value={form.email} onChange={set('email')}
              />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input
                type="password"
                className={`form-control${formErrors.password ? ' error' : ''}`}
                placeholder="Minimum 6 characters"
                value={form.password} onChange={set('password')}
              />
              {formErrors.password && <div className="form-error">{formErrors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control${formErrors.phone ? ' error' : ''}`}
                placeholder="10-digit mobile number (optional)"
                value={form.phone} onChange={set('phone')}
                maxLength={10}
              />
              {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
            </div>

            <div style={{ display: 'flex', gap: '.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <><Spinner /> Creating…</> : 'Create Admin'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setShowForm(false); setFormErrors({}); setApiError('') }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins List */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-100)' }}>
          <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
            Admin Accounts ({admins.length})
          </span>
        </div>

        {loading && <div style={{ padding: '2rem' }}><Spinner center /></div>}
        {fetchError && <div style={{ padding: '1rem' }}><Alert type="error">{fetchError}</Alert></div>}

        {!loading && !fetchError && admins.length === 0 && (
          <div className="empty-state">
            <div className="icon">👤</div>
            <h3>No admin accounts found</h3>
          </div>
        )}

        {!loading && admins.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => (
                  <tr key={admin.id}>
                    <td style={{ color: 'var(--gray-400)', fontSize: '.8rem' }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone || '—'}</td>
                    <td>{formatDate(admin.createdAt)}</td>
                    <td>
                      <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                        ADMIN
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
