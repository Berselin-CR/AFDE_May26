import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './services/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FeedbackList from './pages/FeedbackList'
import SubmitFeedback from './pages/SubmitFeedback'
import SearchFilter from './pages/SearchFilter'
import { ToastProvider } from './components/Toast'

function PrivateRoute({ children }) {
  const { role } = useAuth()
  return role ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { role } = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={role ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<PrivateRoute><Navbar /><main><Dashboard /></main></PrivateRoute>} />
        <Route path="/feedback" element={<PrivateRoute><Navbar /><main><FeedbackList /></main></PrivateRoute>} />
        <Route path="/feedback/submit" element={<PrivateRoute><Navbar /><main><SubmitFeedback /></main></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><Navbar /><main><SearchFilter /></main></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  )
}
