"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Users, Coffee, TrendingUp, Package, DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import AdminTestHelper from "@/component/admin-test-helper"
import IconGenerator from "@/component/icon-generator"

interface DashboardStats {
  totalOrders: number
  totalCustomers: number
  totalMenuItems: number
  totalRevenue: number
  pendingOrders: number
  lowStockItems: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  })

  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    // Load orders
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]")
    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]")

    // Calculate stats
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0)
    const pendingOrders = orders.filter((order: any) => order.status === "confirmed").length
    const lowStockItems = inventory.filter((item: any) => item.stock < 10).length

    setStats({
      totalOrders: orders.length,
      totalCustomers: users.length,
      totalMenuItems: menuItems.length,
      totalRevenue,
      pendingOrders,
      lowStockItems,
    })

    // Get recent orders (last 5)
    const recent = orders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    setRecentOrders(recent)
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Menu Items",
      value: stats.totalMenuItems,
      icon: Coffee,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: Package,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-8">
      <AdminTestHelper />
      <IconGenerator />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        order.status === "confirmed"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "preparing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
