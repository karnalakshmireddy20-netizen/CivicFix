import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { getErrorMessage } from '../../utils/helpers'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' })
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
    setApiError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Full name is required'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'

    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'

    if (!form.password)       e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'

    if (form.phone && !/^[0-9]{10}$/.test(form.phone))
      e.phone = 'Phone must be exactly 10 digits'

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.phone.trim() || undefined)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setApiError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <h1>🏛️ CivicFix</h1>
          <p>Report. Track. Resolve.</p>
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center' }}>
          Create a Citizen Account
        </h2>

        {apiError && <Alert type="error" onClose={() => setApiError('')}>{apiError}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              className={`form-control${errors.name ? ' error' : ''}`}
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input
              type="email"
              className={`form-control${errors.email ? ' error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className={`form-control${errors.phone ? ' error' : ''}`}
              placeholder="9876543210"
              value={form.phone}
              onChange={set('phone')}
              maxLength={10}
              autoComplete="tel"
            />
            <div className="form-hint">Optional. 10-digit mobile number.</div>
            {errors.phone && <div className="form-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <input
              type="password"
              className={`form-control${errors.password ? ' error' : ''}`}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password <span className="required">*</span></label>
            <input
              type="password"
              className={`form-control${errors.confirmPassword ? ' error' : ''}`}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><Spinner /> Creating Account…</> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: 'var(--gray-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '.75rem', fontSize: '.78rem', color: 'var(--gray-400)' }}>
          Are you an admin/authority?{' '}
          <Link to="/login" style={{ color: 'var(--gray-500)' }}>Use Admin Login</Link>
        </p>
      </div>
    </div>
  )
}
