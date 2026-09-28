import React, { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin, register as apiRegister } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const saveSession = useCallback((data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    }))
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role })
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password })
    saveSession(res.data)
    return res.data
  }, [saveSession])

  const register = useCallback(async (name, email, password, phone) => {
    const res = await apiRegister({ name, email, password, phone })
    saveSession(res.data)
    return res.data
  }, [saveSession])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const isAdmin   = user?.role === 'ADMIN'
  const isCitizen = user?.role === 'CITIZEN'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isCitizen }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
