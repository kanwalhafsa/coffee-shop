import type React from "react"
import type { Metadata, Viewport } from "next"
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
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brew Haven | Premium Coffee Shop",
  description: "Experience the perfect brew with our premium coffee selection",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brew Haven",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4F46E5",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <AuthProvider>
            <AdminProvider>
              <CartProvider>
                <AuthGuard>
                  <div className="flex min-h-screen flex-col">
                    <Navbar />
                    <Suspense>
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
      </body>
    </html>
  )
}
