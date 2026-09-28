import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const CATEGORIES = [
  { icon: '🛣️', label: 'Road / Pothole' },
  { icon: '🗑️', label: 'Garbage' },
  { icon: '💡', label: 'Streetlight' },
  { icon: '💧', label: 'Water' },
  { icon: '🚿', label: 'Drainage' },
  { icon: '🏛️', label: 'Public Property' },
  { icon: '📋', label: 'Other' },
]

const STEPS = [
  { num: 1, title: 'Register / Login', desc: 'Create a free account or log in to get started.' },
  { num: 2, title: 'Report an Issue', desc: 'Describe the problem, upload a photo, and share your location.' },
  { num: 3, title: 'Get a Complaint ID', desc: 'Receive a unique ID to track your complaint at any time.' },
  { num: 4, title: 'Track & Resolve', desc: 'Authorities review and update the status as the issue is resolved.' },
]

const FEATURES = [
  { icon: '📍', title: 'Location-Based Reporting', desc: 'Use GPS or enter an address to pin the exact location of the issue.' },
  { icon: '📸', title: 'Photo Upload', desc: 'Attach a photo as evidence to help authorities understand the problem.' },
  { icon: '🔔', title: 'Real-Time Tracking', desc: 'Track your complaint status from Reported → In Progress → Resolved.' },
  { icon: '🏢', title: 'Department Assignment', desc: 'Issues are routed to the right department automatically or by admin.' },
  { icon: '🛡️', title: 'Secure & Private', desc: 'Your data is protected with JWT authentication and BCrypt encryption.' },
  { icon: '📊', title: 'Admin Dashboard', desc: 'Authorities get a full dashboard to manage and resolve issues efficiently.' },
]

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="landing-hero">
        <div className="container">
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.15)', borderRadius: 99, padding: '.3rem 1rem', fontSize: '.85rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '.04em' }}>
            🏆 Smart India Hackathon 2025 — SIH25031
          </div>
          <h1>🏛️ CivicFix</h1>
          <p style={{ fontSize: '1.35rem', fontWeight: 700, opacity: 1, marginBottom: '.5rem' }}>
            Report. Track. Resolve.
          </p>
          <p>
            Empowering citizens to report civic problems — potholes, garbage, broken streetlights,
            water leaks and more — so local authorities can fix them faster.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-white btn-lg">Get Started Free</Link>
            <Link to="/login"    className="btn btn-outline-white btn-lg">Login</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: '#1e3a8a', color: '#fff', padding: '1.25rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', textAlign: 'center' }}>
            {[
              { val: '7', label: 'Issue Categories' },
              { val: '4', label: 'Status Stages' },
              { val: '6', label: 'Departments' },
              { val: '24/7', label: 'Reporting' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{s.val}</div>
                <div style={{ fontSize: '.8rem', opacity: .75, marginTop: '.15rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Can You Report?</h2>
          <p className="section-subtitle">Report any of these civic issues in your neighborhood.</p>
          <div className="categories-grid">
            {CATEGORIES.map(c => (
              <div className="category-card" key={c.label}>
                <div className="icon">{c.icon}</div>
                <p>{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps from complaint to resolution.</p>
          <div className="steps-grid">
            {STEPS.map(s => (
              <div className="step-card" key={s.num}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">Everything needed for end-to-end civic issue management.</p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Ready to Make Your City Better?</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Join thousands of citizens working together for cleaner, safer communities.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Register as Citizen</Link>
            <Link to="/login"    className="btn btn-secondary btn-lg">Admin / Authority Login</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
