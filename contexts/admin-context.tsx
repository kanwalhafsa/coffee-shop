"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AdminContextType {
  isAdmin: boolean
  adminLogin: (password: string) => boolean
  adminLogout: () => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Default admin password (in production, use proper authentication)
const ADMIN_PASSWORD = "admin123"

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = localStorage.getItem("adminSession")
    if (adminSession) {
      const session = JSON.parse(adminSession)
      if (session.expires > Date.now()) {
        setIsAdmin(true)
      } else {
        localStorage.removeItem("adminSession")
      }
    }
    setIsLoading(false)
  }, [])

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const session = {
        loggedIn: true,
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }
      localStorage.setItem("adminSession", JSON.stringify(session))
      setIsAdmin(true)
      return true
    }
    return false
  }

  const adminLogout = () => {
    localStorage.removeItem("adminSession")
    setIsAdmin(false)
    router.push("/admin/login")
  }

  return (
    <AdminContext.Provider value={{ isAdmin, adminLogin, adminLogout, isLoading }}>{children}</AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
