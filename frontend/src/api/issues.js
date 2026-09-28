import api from './axios'

// ─── Citizen ────────────────────────────────────────────────────────────────
export const createIssue = (formData) =>
  api.post('/api/issues', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getMyIssues = () => api.get('/api/issues/my')

export const getIssueById = (id) => api.get(`/api/issues/${id}`)

// ─── Admin ──────────────────────────────────────────────────────────────────
export const getAllIssues = (params) => api.get('/api/admin/issues', { params })

export const getAdminIssueById = (id) => api.get(`/api/admin/issues/${id}`)

export const updateIssueStatus = (id, data) =>
  api.put(`/api/admin/issues/${id}/status`, data)

export const assignDepartment = (id, data) =>
  api.put(`/api/admin/issues/${id}/assign`, data)

export const updateRemarks = (id, data) =>
  api.put(`/api/admin/issues/${id}/remarks`, data)

export const getAdminDashboard = () => api.get('/api/admin/dashboard')

export const getDepartments = () => api.get('/api/admin/departments')
