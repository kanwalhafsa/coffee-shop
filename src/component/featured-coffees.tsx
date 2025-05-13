"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import type { Coffee } from "@/lib/types"

// Featured coffee data
const featuredCoffees: Coffee[] = [
  {
    id: "1",
    name: "Espresso Classico",
    description: "Our signature espresso with rich, bold flavor and perfect crema.",
    price: 3.99,
    image: "/images/himg1.jpg",
    width:400,
    height:400,
    category: "hot",
    featured: true,
  },
  {
    id: "2",
    name: "Caramel Macchiato",
    description: "Espresso with steamed milk, vanilla, and caramel drizzle.",
    price: 4.99,
    image: "/images/himg2.jpg",
    width:400,
    height:400,
    category: "hot",
    featured: true,
  },
  {
    id: "3",
    name: "Iced Mocha",
    description: "Espresso with chocolate, milk, and ice, topped with whipped cream.",
    price: 5.49,
    image: "/images/img2.jpg",
    width:400,
    height:400,
    category: "cold",
    featured: true,
  },
  {
    id: "4",
    name: "Hazelnut Latte",
    description: "Espresso with steamed milk and hazelnut syrup.",
    price: 4.79,
    image: "/images/img4.jpg",
    width:400,
    height:400,
    category: "hot",
    featured: true,
  },
]

export default function FeaturedCoffees() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = (coffee: Coffee) => {
    addItem({
      ...coffee,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${coffee.name} has been added to your cart.`,
    })
  }

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-1"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-9 bg-muted rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredCoffees.map((coffee) => (
        <Card key={coffee.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={coffee.image || "/placeholder.svg"}
              alt={coffee.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
            {coffee.featured && <Badge className="absolute top-2 right-2">Featured</Badge>}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{coffee.name}</h3>
              <span className="font-medium text-primary">{formatPrice(coffee.price)}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{coffee.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={() => handleAddToCart(coffee)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
