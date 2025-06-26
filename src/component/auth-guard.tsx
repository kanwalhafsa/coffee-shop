"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const publicRoutes = [
    "/",
    "/menu",
    "/about",
    "/contact",
    "/feedback",
    "/login",
    "/signup",
  ]

  useEffect(() => {
    console.log("AuthGuard: Checking path:", pathname, "user:", user, "isLoading:", isLoading)
    if (!isLoading && !user && !publicRoutes.includes(pathname)) {
      console.log("AuthGuard: Redirecting to /login from", pathname)
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}