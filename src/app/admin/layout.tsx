"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Coffee, Users, BarChart3, Package, Menu, LogOut, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useAdmin } from "../../../contexts/admin-context"
import AdminGuard from "@/component/admin-guard"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Menu Items", href: "/admin/menu", icon: Coffee },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { adminLogout } = useAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-6 border-b">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t p-4">
                <Button variant="outline" className="w-full" onClick={adminLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center h-16 px-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full" onClick={adminLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find((item) => item.href === pathname)?.name || "Admin"}
                </h1>
              </div>
            </div>
          </div>

          <main className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
