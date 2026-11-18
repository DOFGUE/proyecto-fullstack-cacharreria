import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import * as authService from "../services/auth.service"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
      return profile
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null)
        return null
      }
      throw error
    }
  }, [])

  useEffect(() => {
    refreshProfile().catch(() => setUser(null)).finally(() => setInitializing(false))
  }, [refreshProfile])

  const value = useMemo(() => ({
    user,
    initializing,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role?.name === "admin",
    login: async (data) => {
      const loggedUser = await authService.login(data)
      setUser(loggedUser)
      return loggedUser
    },
    register: async (data) => {
      const registeredUser = await authService.register(data)
      setUser(registeredUser)
      return registeredUser
    },
    logout: async () => {
      await authService.logout()
      setUser(null)
    },
    updateProfile: async (data) => {
      const updatedUser = await authService.updateProfile(data)
      setUser(updatedUser)
      return updatedUser
    }
  }), [initializing, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
