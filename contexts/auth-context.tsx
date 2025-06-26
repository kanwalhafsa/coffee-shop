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
    const loadUser = async () => {
      try {
        console.log("AuthProvider: Initializing user check")
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          const parsedUser: User = JSON.parse(savedUser)
          if (parsedUser.id && parsedUser.name && parsedUser.email) {
            console.log("AuthProvider: User loaded from localStorage:", parsedUser)
            setUser(parsedUser)
          } else {
            console.log("AuthProvider: Invalid user data in localStorage, clearing")
            localStorage.removeItem("user")
          }
        } else {
          console.log("AuthProvider: No user found in localStorage")
        }
      } catch (error) {
        console.error("AuthProvider: Error loading user from localStorage:", error)
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("AuthProvider: Login attempt with email:", email)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        const userWithoutPassword: User = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        console.log("AuthProvider: Login successful:", userWithoutPassword)
        router.push("/")
        return true
      }
      console.log("AuthProvider: Login failed: Invalid credentials")
      return false
    } catch (error) {
      console.error("AuthProvider: Login error:", error)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log("AuthProvider: Signup attempt with email:", email)
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (users.find((u: any) => u.email === email)) {
        console.log("AuthProvider: Signup failed: Email already exists")
        return false
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const userWithoutPassword: User = { id: newUser.id, name: newUser.name, email: newUser.email } // Fixed typo: 'id Skinner' to 'id: newUser.id'
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      console.log("AuthProvider: Signup successful:", userWithoutPassword)
      router.push("/")
      return true
    } catch (error) {
      console.error("AuthProvider: Signup error:", error)
      return false
    }
  }

  const logout = () => {
    console.log("AuthProvider: Logging out")
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}