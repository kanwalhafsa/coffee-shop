"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Coffee } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface AnalyticsData {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  averageOrderValue: number
  aovChange: number
  totalCustomers: number
  customersChange: number
  salesByDay: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  salesByCategory: Array<{
    category: string
    sales: number
    percentage: number
  }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (dateRange?.from) {
        params.append("from", dateRange.from.toISOString())
      }
      if (dateRange?.to) {
        params.append("to", dateRange.to.toISOString())
      }

      const response = await fetch(`/api/admin/analytics?${params.toString()}`)

      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        // Fallback to mock data if API fails
        setData(getMockData())
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
      // Use mock data as fallback
      setData(getMockData())
    } finally {
      setLoading(false)
    }
  }

  const getMockData = (): AnalyticsData => ({
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
  })

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Failed to load analytics data</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <DateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.revenueChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={data.revenueChange >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(data.revenueChange)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.ordersChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={data.ordersChange >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(data.ordersChange)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.averageOrderValue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.aovChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={data.aovChange >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(data.aovChange)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.customersChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={data.customersChange >= 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(data.customersChange)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Over Time</CardTitle>
              <CardDescription>Daily revenue and order count for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-revenue)" }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="var(--color-orders)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-orders)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topProducts} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category} (${percentage}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {data.salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
