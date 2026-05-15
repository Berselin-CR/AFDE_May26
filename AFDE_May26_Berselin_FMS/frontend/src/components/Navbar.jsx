import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { username, label, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">Learn Next <span>Feedback Management System</span></div>
      <div className="nav-links">
        <NavLink to="/"                end className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Dashboard</NavLink>
        <NavLink to="/feedback"            className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>All Feedback</NavLink>
        <NavLink to="/feedback/submit"     className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Submit Feedback</NavLink>
        <NavLink to="/search"              className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}>Search & Filter</NavLink>
      </div>
      <div className="nav-user">
        <div className="nav-user-info">
          <div className="nav-username">{username}</div>
          <span className={`nav-role-badge ${role}`}>{label}</span>
        </div>
        <button className="nav-logout" onClick={handleLogout}>Sign Out</button>
      </div>
    </nav>
  )
}
