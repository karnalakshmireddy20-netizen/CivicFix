const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export function getImageUrl(imagePath) {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${API_URL}/uploads/${imagePath}`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function categoryLabel(cat) {
  const map = {
    ROAD_POTHOLE:    'Road / Pothole',
    GARBAGE:         'Garbage',
    STREETLIGHT:     'Streetlight',
    WATER:           'Water',
    DRAINAGE:        'Drainage',
    PUBLIC_PROPERTY: 'Public Property',
    OTHER:           'Other',
  }
  return map[cat] || cat
}

export function categoryIcon(cat) {
  const map = {
    ROAD_POTHOLE:    '🛣️',
    GARBAGE:         '🗑️',
    STREETLIGHT:     '💡',
    WATER:           '💧',
    DRAINAGE:        '🚿',
    PUBLIC_PROPERTY: '🏛️',
    OTHER:           '📋',
  }
  return map[cat] || '📋'
}

export function statusLabel(status) {
  const map = {
    REPORTED:    'Reported',
    IN_PROGRESS: 'In Progress',
    RESOLVED:    'Resolved',
    REJECTED:    'Rejected',
  }
  return map[status] || status
}

export function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    'An unexpected error occurred'
  )
}
