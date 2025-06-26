"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { CheckCircle, Coffee, ArrowRight, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"

function SuccessContent() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set isClient to true only on client-side to avoid server-side rendering issues
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Only run on client-side

    // Dynamically import useSearchParams to ensure it only runs client-side
    import("next/navigation").then((module) => {
      const searchParams = module.useSearchParams()
      const orderId = searchParams.get("orderId") || localStorage.getItem("lastOrderId")

      if (orderId) {
        setOrderNumber(orderId)
        localStorage.setItem("lastOrderId", orderId)
      } else {
        const timer = setTimeout(() => {
          router.push("/menu")
        }, 3000)
        return () => clearTimeout(timer)
      }
    })
  }, [router, isClient])

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've received your request and are preparing it now.
          </p>

          {orderNumber && (
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Order Number</p>
              <p className="text-xl font-medium font-mono">{orderNumber}</p>
            </div>
          )}

          <div className="text-left space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Preparation Time</p>
              <p className="font-medium">15-20 minutes</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">What's Next?</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• We'll prepare your order with care</li>
                <li>• You'll receive updates on your order status</li>
                <li>• Pick up at our store or wait for delivery</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {orderNumber && (
            <Button className="w-full" asChild>
              <Link href={`/order/${orderNumber}`}>
                <Package className="mr-2 h-4 w-4" />
                Track Your Order
              </Link>
            </Button>
          )}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/menu">
              <Coffee className="mr-2 h-4 w-4" />
              Order More Coffee
            </Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/">
              Return to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading order confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  )
}