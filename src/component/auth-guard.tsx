"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"]

  useEffect(() => {
    if (!isLoading && !user && !publicRoutes.includes(pathname)) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !publicRoutes.includes(pathname)) {
    return null // AuthGuard will redirect to login
  }

  return <>{children}</>
}
