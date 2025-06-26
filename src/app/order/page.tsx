"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "../../../contexts/auth-context"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import { CartItem } from "@/lib/types"

export const dynamic = 'force-dynamic'

function OrderContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, clearCart } = useCart() // Changed from items to cart
  const [orderType, setOrderType] = useState("pickup")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = cart.reduce((total: number, item: CartItem) => {
    return total + item.price * item.quantity
  }, 0)

  const tax = subtotal * 0.1 // 10% tax
  const deliveryFee = orderType === "delivery" ? 5.99 : 0
  const total = subtotal + tax + deliveryFee

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      console.log("OrderContent: User not logged in, redirecting to /login")
      toast.error("Please login to place an order.")
      router.push("/login")
      return
    }

    if (cart.length === 0) {
      toast.error("Please add some items to your cart before placing an order.")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Generate order ID
      const orderId = `BH${Date.now().toString().slice(-6)}`

      const orderData = {
        id: orderId,
        userId: user.id,
        items: cart.map((item: CartItem) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          quantity: item.quantity,
          price: item.price,
          image: item.image || "",
        })),
        customerInfo: {
          name: formData.get("name") as string,
          phone: formData.get("phone") as string,
          email: formData.get("email") as string,
          address:
            orderType === "delivery"
              ? `${formData.get("address")}, ${formData.get("city")}, ${formData.get("zip")}`
              : "Pickup at Store",
          city: (formData.get("city") as string) || "",
          postalCode: (formData.get("zip") as string) || "",
          notes: (formData.get("instructions") as string) || "",
        },
        orderType,
        paymentMethod: "cod", // Default to cash on delivery
        subtotal,
        tax,
        deliveryFee,
        total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      existingOrders.push(orderData)
      localStorage.setItem("orders", JSON.stringify(existingOrders))

      clearCart()

      toast.success("Order placed successfully!")
      router.push(`/order/${orderId}`)
    } catch (error) {
      console.error("Order submission error:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Complete Your Order</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Just a few more details to get your coffee on the way.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Order Type</h3>
                  <RadioGroup
                    defaultValue="pickup"
                    value={orderType}
                    onValueChange={setOrderType}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                        <Clock className="h-4 w-4 mr-2" />
                        Pickup at Store
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="cursor-pointer">
                        Delivery (+{formatPrice(5.99)})
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="John Doe" defaultValue={user?.name || ""} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        defaultValue={user?.email || ""}
                        required
                      />
                    </div>
                  </div>
                </div>

                {orderType === "delivery" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" name="address" placeholder="123 Main St" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" placeholder="New York" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" name="zip" placeholder="10001" required />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Instructions</h3>
                  <Textarea
                    name="instructions"
                    placeholder="Any special requests or instructions for your order..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting || cart.length === 0}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.length > 0 ? (
                  <>
                    {cart.map((item: CartItem) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity} x {item.name}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-muted-foreground">Tax (10%)</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      {orderType === "delivery" && (
                        <div className="flex justify-between mt-2">
                          <span className="text-muted-foreground">Delivery Fee</span>
                          <span>{formatPrice(deliveryFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between mt-4 text-lg font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Button variant="link" className="mt-2" onClick={() => router.push("/menu")}>
                      Browse our menu
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <OrderContent />
    </Suspense>
  )
}