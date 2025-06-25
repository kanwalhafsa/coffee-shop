"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import AnalyticsProvider from "@/component/analytics-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      // Add basePath if needed
      basePath="/api/auth"
      // Add refetchInterval for better session management
      refetchInterval={5 * 60} // 5 minutes
    >
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </SessionProvider>
  )
}
