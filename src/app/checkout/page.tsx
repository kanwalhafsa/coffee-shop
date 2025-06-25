"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Truck, MapPin, User, CheckCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "../../../contexts/auth-context"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  notes: string
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Pay securely with your card",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    id: "online",
    name: "Online Banking",
    description: "Pay through online banking",
    icon: <CreditCard className="h-4 w-4" />,
  },
]

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("cod")
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })

  // Card payment form state
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  // Online banking form state
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  })

  useEffect(() => {
    setMounted(true)
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }
  }, [user])

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const deliveryFee = subtotal > 50 ? 0 : 5
  const total = subtotal + tax + deliveryFee

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setSelectedPayment(value)
    setShowPaymentForm(value !== "cod")
  }

  const validateForm = (): boolean => {
    const required = ["name", "email", "phone", "address", "city", "postalCode"]
    for (const field of required) {
      if (!customerInfo[field as keyof CustomerInfo].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`)
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerInfo.email)) {
      toast.error("Please enter a valid email address")
      return false
    }

    const phoneRegex = /^[\d\s\-+()]+$/
    if (!phoneRegex.test(customerInfo.phone)) {
      toast.error("Please enter a valid phone number")
      return false
    }

    // Validate payment method specific fields
    if (selectedPayment === "card") {
      if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardName) {
        toast.error("Please fill in all card details")
        return false
      }
    }

    if (selectedPayment === "online") {
      if (!bankInfo.bankName || !bankInfo.accountNumber) {
        toast.error("Please fill in all banking details")
        return false
      }
    }

    return true
  }

  const processPayment = async (): Promise<boolean> => {
    if (selectedPayment === "cod") {
      return true // No payment processing needed for COD
    }

    if (selectedPayment === "card") {
      // Simulate card payment processing
      toast.info("Processing card payment...")
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate payment success/failure (90% success rate)
      const paymentSuccess = Math.random() > 0.1

      if (!paymentSuccess) {
        toast.error("Payment failed. Please check your card details and try again.")
        return false
      }

      toast.success("Card payment successful!")
      return true
    }

    if (selectedPayment === "online") {
      // Simulate online banking
      toast.info("Redirecting to your bank...")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.info("Please complete the payment in your banking app...")
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate banking success
      const bankingSuccess = Math.random() > 0.05

      if (!bankingSuccess) {
        toast.error("Banking payment failed. Please try again.")
        return false
      }

      toast.success("Online banking payment successful!")
      return true
    }

    return false
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Process payment first
      const paymentSuccess = await processPayment()

      if (!paymentSuccess) {
        setIsLoading(false)
        return
      }

      // Generate order ID
      const newOrderId = `BH${Date.now().toString().slice(-6)}`

      // Save order to localStorage
      const order = {
        id: newOrderId,
        userId: user?.id,
        items: items,
        customerInfo,
        paymentMethod: selectedPayment,
        paymentDetails: selectedPayment === "card" ? { last4: cardInfo.cardNumber.slice(-4) } : null,
        subtotal,
        tax,
        deliveryFee,
        total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      }

      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      existingOrders.push(order)
      localStorage.setItem("orders", JSON.stringify(existingOrders))

      setOrderId(newOrderId)
      setOrderPlaced(true)
      clearCart()

      toast.success("Order placed successfully!")
    } catch (error) {
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to your cart before checkout.</p>
        <Button asChild>
          <Link href="/menu">Browse Our Menu</Link>
        </Button>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-lg text-muted-foreground mb-2">Thank you for your order</p>
        <p className="text-sm text-muted-foreground mb-6">
          Order ID: <span className="font-mono font-medium">{orderId}</span>
        </p>

        <div className="bg-muted/50 rounded-lg p-6 mb-6 max-w-md">
          <h3 className="font-semibold mb-2">What's next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• We'll prepare your order with care</li>
            <li>• You'll receive updates via email/SMS</li>
            <li>• Estimated delivery: 30-45 minutes</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={customerInfo.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={customerInfo.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any special instructions for delivery"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedPayment} onValueChange={handlePaymentMethodChange}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer flex items-center gap-2">
                        {method.icon}
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {/* Card Payment Form */}
              {showPaymentForm && selectedPayment === "card" && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                  <h4 className="font-medium mb-3">Card Details</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={cardInfo.cardName}
                        onChange={(e) => setCardInfo((prev) => ({ ...prev, cardName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo((prev) => ({ ...prev, expiryDate: e.target.value }))}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo((prev) => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Online Banking Form */}
              {showPaymentForm && selectedPayment === "online" && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                  <h4 className="font-medium mb-3">Banking Details</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={bankInfo.bankName}
                        onChange={(e) => setBankInfo((prev) => ({ ...prev, bankName: e.target.value }))}
                        placeholder="Select your bank"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={bankInfo.accountNumber}
                        onChange={(e) => setBankInfo((prev) => ({ ...prev, accountNumber: e.target.value }))}
                        placeholder="Your account number"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                </div>
                {subtotal < 50 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(50 - subtotal)} more for free delivery
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order • ${formatPrice(total)}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to our terms and conditions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
