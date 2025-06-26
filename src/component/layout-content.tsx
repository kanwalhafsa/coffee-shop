"use client"

import { Suspense, useEffect, useState } from "react"
import { Toaster } from "sonner"
import { CartProvider } from "@/hooks/use-cart"
import { AdminProvider } from "../../contexts/admin-context"
import { AuthProvider } from "../../contexts/auth-context"
import AuthGuard from "@/component/auth-guard"
import Navbar from "@/component/navbar"
import Footer from "@/component/footer"
import { Providers } from "../app/providers"
import GoogleAnalytics from "@/component/google-analytics"

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    console.log("LayoutContent: Setting isClient to true")
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <AuthProvider>
      <Providers>
        <CartProvider>
          <AdminProvider>
            <AuthGuard>
              <GoogleAnalytics />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <Suspense fallback={<div>Loading content...</div>}>
                  <main className="flex-1">{children}</main>
                </Suspense>
                <Footer />
              </div>
              <Toaster position="bottom-right" />
            </AuthGuard>
          </AdminProvider>
        </CartProvider>
      </Providers>
    </AuthProvider>
  )
}