"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on app start
    try {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false // User already exists
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Auto login after signup
      const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email }
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
