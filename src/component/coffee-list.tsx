"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ShoppingCart, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import type { Coffee } from "@/lib/types"

// Coffee data
const coffees: Coffee[] = [
  {
    id: "1",
    name: "Espresso Classico",
    description: "Our signature espresso with rich, bold flavor and perfect crema.",
    price: 3.99,
    image: "/images/himg1.jpg",
    width: 400,
    height: 400,
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
    image: "/images/img1.jpg",
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
    image: "/images/himg3.jpg",
    width:400,
    height:400,
    category: "hot",
    featured: true,
  },
  {
    id: "5",
    name: "Cold Brew",
    description: "Smooth, low-acidity coffee brewed with cold water for 12+ hours.",
    price: 4.49,
    image: "/images/img2.jpg",
    width:400,
    height:400,
    category: "cold",
    featured: false,
  },
  {
    id: "6",
    name: "Vanilla Latte",
    description: "Espresso with steamed milk and vanilla syrup.",
    price: 4.79,
    image: "/images/himg4.jpg",
    width:400,
    height:400,
    category: "hot",
    featured: false,
  },
  {
    id: "7",
    name: "Cappuccino",
    description: "Equal parts espresso, steamed milk, and milk foam.",
    price: 4.29,
    image: "/images/himg5.jpg",
    width:400,
    height:400,
    category: "hot",
    featured: false,
  },
  {
    id: "8",
    name: "Iced Vanilla Latte",
    description: "Espresso with cold milk, vanilla syrup, and ice.",
    price: 4.99,
    image: "/images/img3.jpg",
    width:400,
    height:400,
    category: "cold",
    featured: false,
  },
  {
    id: "9",
    name: "Mocha Frappuccino",
    description: "Blended coffee with milk, ice, chocolate, topped with whipped cream.",
    price: 5.99,
    image: "/images/img4.jpg",
    width:400,
    height:400,
    category: "cold",
    featured: false,
  },
  {
    id: "10",
    name: "Pumpkin Spice Latte",
    description: "Espresso with steamed milk, pumpkin spice syrup, and whipped cream.",
    price: 5.49,
    image: "/images/img5.jpg",
    width:400,
    height:400,
    category: "specialty",
    featured: false,
  },
  {
    id: "11",
    name: "Chai Tea Latte",
    description: "Black tea infused with cinnamon, clove, and other spices with steamed milk.",
    price: 4.49,
    image: "/images/img6.jpg",
    width:400,
    height:400,
    category: "specialty",
    featured: false,
  },
  {
    id: "12",
    name: "Matcha Green Tea Latte",
    description: "Japanese green tea powder with steamed milk.",
    price: 4.99,
    image: "/images/img7.jpg",
    width:400,
    height:400,
    category: "specialty",
    featured: false,
  },
]

export default function CoffeeList({ category = "all" }: { category?: string }) {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
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

  const filteredCoffees = coffees.filter((coffee) => {
    // Filter by category
    if (category !== "all" && coffee.category !== category) {
      return false
    }

    // Filter by search query
    if (searchQuery && !coffee.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-full max-w-sm"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search coffees..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredCoffees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No coffees found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoffees.map((coffee) => (
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
      )}
    </div>
  )
}
