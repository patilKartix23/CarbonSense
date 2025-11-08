import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginCredentials, RegisterData } from '../types/auth'
import { authAPI } from '../api/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('access_token')
    if (token) {
      // Verify token and get user data
      authAPI.getCurrentUser()
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials)
      
      // Store tokens
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      // Get user data
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      await authAPI.register(data)
      
      // Auto-login after registration
      await login({
        email: data.email,
        password: data.password
      })
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
