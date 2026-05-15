import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'
import './Login.css'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

export default function Login() {
  const [role, setRole]       = useState('')
  const [name, setName]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleRoleChange = (e) => {
    setRole(e.target.value)
    setError('')
    setPassword('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!role)              { setError('Please select a role.'); return }
    if (!name.trim())       { setError('Please enter your name.'); return }
    if (role === 'admin' && (name.trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD)) {
      setError('Incorrect administrator username or password.')
      return
    }
    const label = role === 'admin' ? 'Administrator' : 'User'
    login(role, name.trim(), label)
    navigate('/')
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">📋</span>
          <h1>Feedback Management System</h1>
          <p>Select your role to continue</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}
          <div className="form-group">
            <label>Login As</label>
            <select value={role} onChange={handleRoleChange}>
              <option value="">— Select role —</option>
              <option value="user">User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="form-group">
            <label>Your Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="username"
            />
          </div>
          {role === 'admin' && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-full">Continue</button>
        </form>
      </div>
    </div>
  )
}
