import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, removeToken, saveToken } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      try {
        // Decode JWT payload (no verification — just read user info)
        const payload = JSON.parse(atob(token.split('.')[1]))
        // Check if token is expired
        if (payload.exp * 1000 < Date.now()) {
          removeToken()
          setUser(null)
        } else {
          setUser({ id: payload.id, token })
        }
      } catch {
        removeToken()
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    saveToken(data.token)
    setUser({ id: data.user.id, name: data.user.name, email: data.user.email, token: data.token })
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
