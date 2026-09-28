import React from 'react'

const STEPS = ['REPORTED', 'IN_PROGRESS', 'RESOLVED']
const LABELS = { REPORTED: 'Reported', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }

export default function StatusTimeline({ status }) {
  const isRejected = status === 'REJECTED'
  const currentIdx = STEPS.indexOf(status)

  if (isRejected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', margin: '1rem 0' }}>
        <div className="timeline-dot active" style={{ background: '#dc2626', borderColor: '#dc2626' }}>✕</div>
        <span style={{ color: '#dc2626', fontWeight: 700 }}>Issue Rejected</span>
      </div>
    )
  }

  return (
    <div className="timeline">
      {STEPS.map((step, i) => {
        const isDone   = currentIdx > i
        const isActive = currentIdx === i
        return (
          <React.Fragment key={step}>
            <div className="timeline-item">
              <div className={`timeline-dot ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                {isDone ? '✓' : i + 1}
              </div>
              <div className={`timeline-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                {LABELS[step]}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`timeline-line ${isDone ? 'done' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
