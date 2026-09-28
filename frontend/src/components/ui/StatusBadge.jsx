import React from 'react'
import { statusLabel } from '../../utils/helpers'

export default function StatusBadge({ status }) {
  if (!status) return null
  const cls = `badge badge-${status.toLowerCase().replace('_', '_')}`
  return <span className={cls}>{statusLabel(status)}</span>
}
