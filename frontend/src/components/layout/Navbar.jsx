import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin, isCitizen } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
          🏛️ CivicFix
          <span>Report. Track. Resolve.</span>
        </Link>

        <div className="navbar-links">
          {!user && (
            <>
              <Link to="/">Home</Link>
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
            </>
          )}

          {isCitizen && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/report">Report Issue</Link>
              <Link to="/my-issues">My Issues</Link>
              <div className="navbar-user">
                <span className="navbar-user-name">👤 {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
              </div>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/issues">All Issues</Link>
              <Link to="/admin/users">Manage Admins</Link>
              <div className="navbar-user">
                <span className="navbar-user-name">🔧 {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
