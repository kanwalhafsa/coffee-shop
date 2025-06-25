"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, DollarSign, Coffee, TrendingUp, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Stats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  pendingOrders: number
  lowStockItems: number
  todayOrders: number
  monthlyRevenue: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get data from localStorage instead of API
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]")
      const inventory = JSON.parse(localStorage.getItem("inventory") || "[]")

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0)

      // Calculate today's orders
      const today = new Date().toDateString()
      const todayOrders = orders.filter((order: any) => new Date(order.createdAt).toDateString() === today).length

      // Calculate monthly revenue
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue = orders
        .filter((order: any) => {
          const orderDate = new Date(order.createdAt)
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
        })
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0)

      // Calculate pending orders
      const pendingOrders = orders.filter(
        (order: any) => order.status === "confirmed" || order.status === "preparing",
      ).length

      // Calculate low stock items
      const lowStockItems = inventory.filter((item: any) => (item.stock || 0) < 10).length

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: menuItems.length,
        pendingOrders,
        lowStockItems,
        todayOrders,
        monthlyRevenue,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      description: `${stats.todayOrders} today`,
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      description: `${formatPrice(stats.monthlyRevenue)} this month`,
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      icon: Coffee,
      description: "Menu items available",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: TrendingUp,
      description: "Need attention",
    },
    {
      title: "Low Stock Alert",
      value: stats.lowStockItems.toString(),
      icon: Package,
      description: "Items < 10 units",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.slice(0, 4).map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
