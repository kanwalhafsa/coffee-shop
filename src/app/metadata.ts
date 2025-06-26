import type { Metadata, Viewport } from "next"

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