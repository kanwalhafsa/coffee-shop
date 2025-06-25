export interface Coffee {
  id: string
  name: string
  description: string
  price: number
  width: number
  height: number
  image: string
  category: string
  featured?: boolean
}

export interface CartItem extends Coffee {
  quantity: number
}

export interface Feedback {
  id: number
  name: string
  rating: number
  comment: string
  date: string
}

// Analytics types
export interface OrderData {
  total: number
  user_email: string
  created_at: string
}

export interface OrderItemData {
  product_name: string
  quantity: number
  price: number
}

export interface ProductStats {
  sales: number
  revenue: number
}

export interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export interface SalesByDay {
  date: string
  revenue: number
  orders: number
}

export interface SalesByCategory {
  category: string
  sales: number
  percentage: number
}

export interface AnalyticsData {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  averageOrderValue: number
  aovChange: number
  totalCustomers: number
  customersChange: number
  salesByDay: SalesByDay[]
  topProducts: TopProduct[]
  salesByCategory: SalesByCategory[]
}

// Order types
export interface OrderItem {
  name: string
  description: string
  quantity: number
  price: number
}

export interface DeliveryDetails {
  type: string
  address?: string | null
}

export interface ContactInfo {
  name: string
  phone: string
  email: string
}

export interface OrderRequestBody {
  items: OrderItem[]
  deliveryDetails: DeliveryDetails
  contactInfo: ContactInfo
  specialInstructions?: string
  paymentMethod?: string
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: string
  provider: string
  created_at: string
}

// Admin types
export interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  totalProducts: number
}
