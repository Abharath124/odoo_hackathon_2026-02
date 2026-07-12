import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, removeToken, saveToken } from '../utils/storage'

const AuthContext = createContext(null)

const USER_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const storedUser = localStorage.getItem(USER_KEY)
    if (token && storedUser) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 < Date.now()) {
          removeToken()
          localStorage.removeItem(USER_KEY)
          setUser(null)
        } else {
          setUser({ ...JSON.parse(storedUser), token })
        }
      } catch {
        removeToken()
        localStorage.removeItem(USER_KEY)
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = (data) => {
    saveToken(data.token)
    const userData = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser({ ...userData, token: data.token })
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
