
import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import "../globals.css"
import { Toaster } from "sonner"
import { CartProvider } from "@/hooks/use-cart"
import Navbar from "@/component/navbar"
import Footer from "@/component/footer"
import { SessionProvider } from "next-auth/react"
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Brew Haven | Premium Coffee Shop",
  description: "Experience the perfect brew with our premium coffee selection",
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brew Haven",
  },
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster position="bottom-right" />
            </CartProvider>
          </SessionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}