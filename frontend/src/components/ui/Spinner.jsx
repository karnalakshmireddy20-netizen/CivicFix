import React from 'react'

export default function Spinner({ center = false }) {
  if (center) {
    return (
      <div className="loading-center">
        <span className="spinner" />
      </div>
    )
  }
  return <span className="spinner" />
}
