import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRole]         = useState(sessionStorage.getItem('role') || '')
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '')
  const [label, setLabel]       = useState(sessionStorage.getItem('label') || '')

  const login = (role, username, label) => {
    sessionStorage.setItem('role', role)
    sessionStorage.setItem('username', username)
    sessionStorage.setItem('label', label)
    setRole(role)
    setUsername(username)
    setLabel(label)
  }

  const logout = () => {
    sessionStorage.clear()
    setRole('')
    setUsername('')
    setLabel('')
  }

  return (
    <AuthContext.Provider value={{ role, username, label, login, logout, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
