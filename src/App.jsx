import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider, useTheme } from './hooks/useTheme'
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
  return <>{children}</>
}

function AppLayout({ children }) {
  const { dark, toggle } = useTheme()
  return (
    <>
      <Navbar dark={dark} toggle={toggle} />
      {children}
    </>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout><BalanceDashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/expense" element={<ProtectedRoute><AppLayout><ExpenseEntry /></AppLayout></ProtectedRoute>} />
        <Route path="/eggs" element={<ProtectedRoute><AppLayout><EggTracker /></AppLayout></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><AppLayout><MonthlySummary /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  )
}
