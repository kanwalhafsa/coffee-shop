"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdmin } from "../../contexts/admin-context"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAdmin && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAdmin, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return null
  }

  return <>{children}</>
}
