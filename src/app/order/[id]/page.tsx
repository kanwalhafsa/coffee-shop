"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../../../../contexts/auth-context"
import { formatPrice } from "@/lib/utils"

interface OrderTrackingPageProps {
  params: { id: string }
}

const statusConfig = {
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "bg-green-500" },
  preparing: { label: "Preparing", icon: Clock, color: "bg-yellow-500" },
  ready: { label: "Ready for Pickup", icon: Package, color: "bg-blue-500" },
  delivering: { label: "Out for Delivery", icon: Truck, color: "bg-blue-500" },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-gray-500" },
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchOrder()
  }, [user, params.id, router])

  const fetchOrder = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      const foundOrder = allOrders.find((o: any) => o.id === params.id && o.userId === user?.id)

      if (foundOrder) {
        setOrder(foundOrder)
      }
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link href="/orders">View All Orders</Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.confirmed
  const StatusIcon = status.icon

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <StatusIcon className="h-4 w-4 mr-2" />
          {status.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Order Type</h3>
                  <p className="text-muted-foreground">
                    {order.orderType === "pickup" ? "Pickup at Store" : "Delivery"}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Contact Information</h3>
                  <p className="text-muted-foreground">{order.customerInfo.name}</p>
                  <p className="text-muted-foreground">{order.customerInfo.phone}</p>
                  <p className="text-muted-foreground">{order.customerInfo.email}</p>
                </div>

                {order.orderType === "delivery" && (
                  <div>
                    <h3 className="font-medium mb-1">Delivery Address</h3>
                    <p className="text-muted-foreground">{order.customerInfo.address}</p>
                  </div>
                )}

                {order.customerInfo.notes && (
                  <div>
                    <h3 className="font-medium mb-1">Special Instructions</h3>
                    <p className="text-muted-foreground">{order.customerInfo.notes}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-1">Payment Method</h3>
                  <p className="text-muted-foreground">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : "Online Banking"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
