"use client"

import { Suspense, useEffect, useState } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "../../contexts/auth-context"
import { AdminProvider } from "../../contexts/admin-context"
import AuthGuard from "@/component/auth-guard"
import Navbar from "@/component/navbar"
import Footer from "@/component/footer"
import { Providers } from "./providers"
import GoogleAnalytics from "@/component/google-analytics"

const inter = Inter({ subsets: ["latin"] })

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <>
      <GoogleAnalytics />
      <Providers>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <AuthGuard>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <Suspense fallback={<div>Loading content...</div>}>
                    <main className="flex-1">{children}</main>
                  </Suspense>
                  <Footer />
                </div>
                <Toaster position="bottom-right" />
              </AuthGuard>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </Providers>
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  )
}