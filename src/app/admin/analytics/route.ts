import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/db"

// Type definitions
interface OrderData {
  total: number
  user_email: string
  created_at: string
}

interface OrderItemData {
  product_name: string
  quantity: number
  price: number
}

interface ProductStats {
  sales: number
  revenue: number
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if user is admin
    const { data: user } = await supabase.from("users").select("role").eq("email", session.user.email).single()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    // For now, return mock data since database functions might not be ready
    const mockAnalyticsData = {
      totalRevenue: 12450.5,
      revenueChange: 12.5,
      totalOrders: 156,
      ordersChange: 8.2,
      averageOrderValue: 79.81,
      aovChange: 3.1,
      totalCustomers: 89,
      customersChange: 15.3,
      salesByDay: [
        { date: "2024-01-01", revenue: 1200, orders: 15 },
        { date: "2024-01-02", revenue: 1450, orders: 18 },
        { date: "2024-01-03", revenue: 1100, orders: 14 },
        { date: "2024-01-04", revenue: 1650, orders: 21 },
        { date: "2024-01-05", revenue: 1800, orders: 23 },
        { date: "2024-01-06", revenue: 2100, orders: 27 },
        { date: "2024-01-07", revenue: 1950, orders: 25 },
      ],
      topProducts: [
        { name: "Espresso Classico", sales: 45, revenue: 179.55 },
        { name: "Caramel Macchiato", sales: 38, revenue: 189.62 },
        { name: "Iced Mocha", sales: 32, revenue: 175.68 },
        { name: "Hazelnut Latte", sales: 28, revenue: 134.12 },
        { name: "Cold Brew", sales: 25, revenue: 112.25 },
      ],
      salesByCategory: [
        { category: "Hot Coffee", sales: 120, percentage: 45 },
        { category: "Cold Coffee", sales: 80, percentage: 30 },
        { category: "Specialty", sales: 67, percentage: 25 },
      ],
    }

    // Try to get real data from database functions
    try {
      // Get basic order stats with proper typing
      const { data: orders } = await supabase.from("orders").select("total, user_email, created_at")

      if (orders && orders.length > 0) {
        const totalRevenue = orders.reduce((sum: number, order: OrderData) => {
          return sum + Number(order.total)
        }, 0)

        const totalOrders = orders.length
        const uniqueCustomers = new Set(orders.map((order: OrderData) => order.user_email)).size
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        // Get order items for product analysis with proper typing
        const { data: orderItems } = await supabase.from("order_items").select("product_name, quantity, price")

        let topProducts: TopProduct[] = mockAnalyticsData.topProducts
        if (orderItems && orderItems.length > 0) {
          const productStats: Record<string, ProductStats> = orderItems.reduce(
            (acc: Record<string, ProductStats>, item: OrderItemData) => {
              if (!acc[item.product_name]) {
                acc[item.product_name] = { sales: 0, revenue: 0 }
              }
              acc[item.product_name].sales += item.quantity
              acc[item.product_name].revenue += item.price * item.quantity
              return acc
            },
            {},
          )

          // Fix: Properly type the Object.entries() result
          topProducts = (Object.entries(productStats) as [string, ProductStats][])
            .map(
              ([name, stats]: [string, ProductStats]): TopProduct => ({
                name,
                sales: stats.sales,
                revenue: stats.revenue,
              }),
            )
            .sort((a: TopProduct, b: TopProduct) => b.sales - a.sales)
            .slice(0, 5)
        }

        // Update mock data with real data
        mockAnalyticsData.totalRevenue = totalRevenue
        mockAnalyticsData.totalOrders = totalOrders
        mockAnalyticsData.averageOrderValue = averageOrderValue
        mockAnalyticsData.totalCustomers = uniqueCustomers
        mockAnalyticsData.topProducts = topProducts
      }
    } catch (dbError) {
      console.log("Using mock data due to database error:", dbError)
    }

    return NextResponse.json(mockAnalyticsData)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
