import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('mess-user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (member) => {
    setUser(member)
    sessionStorage.setItem('mess-user', JSON.stringify(member))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('mess-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
