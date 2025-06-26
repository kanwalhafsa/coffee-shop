import { Inter } from "next/font/google"
import "./globals.css"
import LayoutContent from "@/component/layout-content" // New client component

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  )
}