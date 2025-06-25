"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, ShoppingCart, Star, Clock, ArrowRight, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

// Featured/Popular items data
const featuredItems = [
  {
    id: "espresso-classic",
    name: "Classic Espresso",
    description: "Rich and bold espresso shot",
    price: 3.5,
    image: "/images/oimg1.jpg?height=200&width=200",
    category: "Hot Coffee",
    popular: true,
    prepTime: "2-3 min",
  },
  {
    id: "latte-vanilla",
    name: "Vanilla Latte",
    description: "Smooth espresso with steamed milk and vanilla",
    price: 5.25,
    image: "/images/oimg2.jpg?height=200&width=200",
    category: "Hot Coffee",
    popular: true,
    prepTime: "3-4 min",
  },
  {
    id: "cappuccino-classic",
    name: "Classic Cappuccino",
    description: "Perfect balance of espresso, steamed milk, and foam",
    price: 4.75,
    image: "/images/oimg3.jpg?height=200&width=200",
    category: "Hot Coffee",
    popular: true,
    prepTime: "3-4 min",
  },
  {
    id: "americano-iced",
    name: "Iced Americano",
    description: "Refreshing iced coffee with bold espresso",
    price: 4.25,
    image: "/images/oimg7.jpg?height=200&width=200",
    category: "Cold Coffee",
    popular: true,
    prepTime: "2-3 min",
  },
  {
    id: "mocha-chocolate",
    name: "Chocolate Mocha",
    description: "Rich espresso with chocolate and steamed milk",
    price: 5.75,
    image: "/images/oimg8.jpg?height=200&width=200",
    category: "Hot Coffee",
    popular: true,
    prepTime: "4-5 min",
  },
  {
    id: "frappuccino-caramel",
    name: "Caramel Frappuccino",
    description: "Blended coffee with caramel and whipped cream",
    price: 6.25,
    image: "/images/oimg6.jpg?height=200&width=200",
    category: "Cold Coffee",
    popular: true,
    prepTime: "3-4 min",
  },
]

// More coffee varieties instead of snacks
const specialtyCoffees = [
  {
    id: "macchiato-caramel",
    name: "Caramel Macchiato",
    description: "Espresso with vanilla syrup and caramel drizzle",
    price: 5.5,
    image: "/images/oimg4.jpg?height=150&width=150",
    category: "Hot Coffee",
  },
  {
    id: "cortado-spanish",
    name: "Spanish Cortado",
    description: "Equal parts espresso and warm milk",
    price: 4.25,
    image: "/images/oimg9.jpg?height=150&width=150",
    category: "Hot Coffee",
  },
  {
    id: "affogato-vanilla",
    name: "Vanilla Affogato",
    description: "Hot espresso poured over vanilla ice cream",
    price: 6.75,
    image: "/images/oimg5.jpg?height=150&width=150",
    category: "Specialty Coffee",
  },
  {
    id: "cold-brew-original",
    name: "Cold Brew Coffee",
    description: "Smooth, slow-steeped cold coffee",
    price: 4.5,
    image: "/images/oimg10.jpg?height=150&width=150",
    category: "Cold Coffee",
  },
  {
    id: "turkish-coffee",
    name: "Turkish Coffee",
    description: "Traditional finely ground coffee",
    price: 4.0,
    image: "/images/oimg11.jpg?height=150&width=150",
    category: "Specialty Coffee",
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: "Double shot espresso with microfoam milk",
    price: 5.0,
    image: "/images/oimg12.jpg?height=150&width=150",
    category: "Hot Coffee",
  },
]

export default function OrderNowPage() {
  const { items, addItem } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      quantity: 1,
      width: 200, 
      height: 200, 
    })
    toast.success(`${item.name} added to cart!`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Coffee className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Your Perfect Coffee</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose from our most popular coffee drinks or browse our full menu for more options
        </p>
      </div>

      {/* Cart Status Bar */}
      {mounted && cartItemCount > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {cartItemCount} item{cartItemCount !== 1 ? "s" : ""} in cart
                </p>
                <p className="text-sm text-muted-foreground">Total: {formatPrice(cartTotal)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button asChild>
                <Link href="/checkout">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Coffee Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Most Popular Coffee</h2>
          <Button variant="outline" asChild>
            <Link href="/menu">View All Menu</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.popular && (
                    <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.prepTime}
                  </div>
                  <Button size="sm" onClick={() => handleAddToCart(item)} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Specialty Coffee Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Specialty Coffee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialtyCoffees.map((item) => (
            <Card key={item.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <Button size="sm" variant="outline" onClick={() => handleAddToCart(item)} className="w-full">
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/menu">
              <Coffee className="mr-2 h-5 w-5" />
              Browse Full Coffee Menu
            </Link>
          </Button>

          {mounted && cartItemCount > 0 && (
            <Button size="lg" variant="outline" asChild>
              <Link href="/checkout">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Proceed to Checkout ({cartItemCount})
              </Link>
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Need help choosing the perfect coffee?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          for recommendations
        </p>
      </div>
    </div>
  )
}
