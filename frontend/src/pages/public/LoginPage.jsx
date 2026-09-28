import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { getErrorMessage } from '../../utils/helpers'

export default function LoginPage() {
  const { login, isAdmin } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname

  const [form, setForm]       = useState({ email: '', password: '' })
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
    if (!form.email.trim())    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password.trim()) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError('')
    try {
      const data = await login(form.email.trim(), form.password)
      const dest = from || (data.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard')
      navigate(dest, { replace: true })
    } catch (err) {
      setApiError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (type) => {
    if (type === 'admin') {
      setForm({ email: 'admin@civicfix.com', password: 'Admin@123' })
    } else {
      setForm({ email: 'citizen@civicfix.com', password: 'Citizen@123' })
    }
    setErrors({})
    setApiError('')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🏛️ CivicFix</h1>
          <p>Report. Track. Resolve.</p>
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center' }}>
          Sign in to your account
        </h2>

        {apiError && <Alert type="error" onClose={() => setApiError('')}>{apiError}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
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
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control${errors.password ? ' error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              autoComplete="current-password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">— Demo Accounts —</div>
        <div style={{ display: 'flex', gap: '.75rem' }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('citizen')}>
            👤 Citizen Demo
          </button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('admin')}>
            🔧 Admin Demo
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: 'var(--gray-500)' }}>
          New here?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}
