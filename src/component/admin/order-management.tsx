"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Package, Clock, CheckCircle, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface Order {
  id: string
  userId: string
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: any[]
  total: number
  status: string
  paymentMethod: string
  createdAt: string
}

const statusOptions = [
  { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { value: "preparing", label: "Preparing", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  { value: "ready", label: "Ready", icon: Package, color: "bg-blue-100 text-blue-800" },
  { value: "delivering", label: "Delivering", icon: Truck, color: "bg-purple-100 text-purple-800" },
  { value: "completed", label: "Completed", icon: CheckCircle, color: "bg-gray-100 text-gray-800" },
]

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const loadOrders = () => {
    try {
      const ordersData = JSON.parse(localStorage.getItem("orders") || "[]")
      const sortedOrders = ordersData.sort(
        (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      setOrders(sortedOrders)
    } catch (error) {
      console.error("Error loading orders:", error)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))

    localStorage.setItem("orders", JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
    toast.success("Order status updated successfully!")
  }

  const getStatusConfig = (status: string) => {
    return statusOptions.find((option) => option.value === status) || statusOptions[0]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Order Management</h2>
        <p className="text-muted-foreground">Track and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status)
          const StatusIcon = statusConfig.icon

          return (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p>
                          <strong>Customer:</strong> {order.customerInfo.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.customerInfo.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.customerInfo.phone}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Total:</strong>{" "}
                          <span className="text-primary font-semibold">{formatPrice(order.total)}</span>
                        </p>
                        <p>
                          <strong>Payment:</strong>{" "}
                          {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{order.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                              <h4 className="font-semibold mb-2">Customer Information</h4>
                              <div className="bg-muted/50 p-4 rounded-lg space-y-1">
                                <p>
                                  <strong>Name:</strong> {selectedOrder.customerInfo.name}
                                </p>
                                <p>
                                  <strong>Email:</strong> {selectedOrder.customerInfo.email}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {selectedOrder.customerInfo.phone}
                                </p>
                                <p>
                                  <strong>Address:</strong> {selectedOrder.customerInfo.address}
                                </p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {selectedOrder.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div className="flex justify-between items-center text-lg font-semibold">
                              <span>Total Amount:</span>
                              <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Orders will appear here when customers place them"}
          </p>
        </div>
      )}
    </div>
  )
}
