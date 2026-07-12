import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, removeToken, saveToken } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const storedRole = localStorage.getItem('role')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 < Date.now()) {
          removeToken()
          localStorage.removeItem('role')
          setUser(null)
        } else {
          setUser({ id: payload.id, role: storedRole, token })
        }
      } catch {
        removeToken()
        localStorage.removeItem('role')
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    saveToken(data.token)
    localStorage.setItem('role', data.user.role)
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role, token: data.token })
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem('role')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
