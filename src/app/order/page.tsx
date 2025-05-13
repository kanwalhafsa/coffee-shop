"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"

export default function OrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, clearCart } = useCart()
  const [orderType, setOrderType] = useState("pickup")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      clearCart()
      setIsSubmitting(false)

      toast({
        title: "Order placed successfully!",
        description: "Your order has been received and is being processed.",
      })

      router.push("/order/success")
    }, 1500)
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
                        Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                </div>

                {orderType === "delivery" && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input id="address" placeholder="123 Main St" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="10001" required />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-4">Additional Instructions</h3>
                  <Textarea
                    placeholder="Any special requests or instructions for your order..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
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
                {items.length > 0 ? (
                  <>
                    {items.map((item) => (
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
                          <span>{formatPrice(5.99)}</span>
                        </div>
                      )}
                      <div className="flex justify-between mt-4 text-lg font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total + (orderType === "delivery" ? 5.99 : 0))}</span>
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
