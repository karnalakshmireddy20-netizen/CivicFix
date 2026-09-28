import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import {
  RequireAuth, RequireAdmin, RequireCitizen, RedirectIfLoggedIn
} from './components/layout/ProtectedRoute'

// Public pages
import LandingPage    from './pages/public/LandingPage'
import LoginPage      from './pages/public/LoginPage'
import RegisterPage   from './pages/public/RegisterPage'

// Citizen pages
import CitizenDashboard from './pages/citizen/CitizenDashboard'
import ReportIssuePage  from './pages/citizen/ReportIssuePage'
import MyIssuesPage     from './pages/citizen/MyIssuesPage'
import IssueDetailPage  from './pages/citizen/IssueDetailPage'

// Admin pages
import AdminDashboard   from './pages/admin/AdminDashboard'
import AllIssuesPage    from './pages/admin/AllIssuesPage'
import ManageIssuePage  from './pages/admin/ManageIssuePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            <RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>
          } />
          <Route path="/register" element={
            <RedirectIfLoggedIn><RegisterPage /></RedirectIfLoggedIn>
          } />

          {/* Citizen */}
          <Route path="/dashboard" element={
            <RequireCitizen><CitizenDashboard /></RequireCitizen>
          } />
          <Route path="/report" element={
            <RequireCitizen><ReportIssuePage /></RequireCitizen>
          } />
          <Route path="/my-issues" element={
            <RequireCitizen><MyIssuesPage /></RequireCitizen>
          } />
          <Route path="/issues/:id" element={
            <RequireAuth><IssueDetailPage /></RequireAuth>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <RequireAdmin><AdminDashboard /></RequireAdmin>
          } />
          <Route path="/admin/issues" element={
            <RequireAdmin><AllIssuesPage /></RequireAdmin>
          } />
          <Route path="/admin/issues/:id" element={
            <RequireAdmin><ManageIssuePage /></RequireAdmin>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
