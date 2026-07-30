import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './hooks/useAuth'
import LoginPage from './auth/LoginPage'
import Navbar from './components/Navbar'
import ExpenseEntry from './pages/ExpenseEntry'
import BalanceDashboard from './pages/BalanceDashboard'
import EggTracker from './pages/EggTracker'
import MonthlySummary from './pages/MonthlySummary'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="pb-16">
      {children}
      <Navbar />
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute><BalanceDashboard /></ProtectedRoute>} />
        <Route path="/expense" element={<ProtectedRoute><ExpenseEntry /></ProtectedRoute>} />
        <Route path="/eggs" element={<ProtectedRoute><EggTracker /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><MonthlySummary /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  )
}
