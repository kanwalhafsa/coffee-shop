"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Coffee, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function OrderSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // If someone navigates directly to this page without placing an order
    // redirect them to the menu page after a short delay
    const timer = setTimeout(() => {
      // Check if there's no order data
      if (!localStorage.getItem("lastOrderId")) {
        router.push("/menu")
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  // Generate a random order number
  const orderNumber = Math.floor(10000 + Math.random() * 90000)

  // Store the order number in localStorage for reference
  useEffect(() => {
    localStorage.setItem("lastOrderId", orderNumber.toString())
  }, [orderNumber])

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've received your request and are preparing it now.
          </p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="text-xl font-medium">{orderNumber}</p>
          </div>

          <div className="text-left space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Pickup Time</p>
              <p className="font-medium">15-20 minutes</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Pickup Location</p>
              <p className="font-medium">123 Coffee Street, Brew City</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" asChild>
            <Link href="/menu">
              <Coffee className="mr-2 h-4 w-4" />
              Order More Coffee
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
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
