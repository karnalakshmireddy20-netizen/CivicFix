import React from 'react'

export default function Alert({ type = 'info', children, onClose }) {
  return (
    <div className={`alert alert-${type}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span>{children}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem', fontSize: '1rem', opacity: .7 }}>✕</button>
      )}
    </div>
  )
}
