"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, Menu, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"

export default function Navbar() {
  const pathname = usePathname()
  const { items } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0)

  const routes = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/feedback", label: "Feedback" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Coffee className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Brew Haven</span>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex space-x-6">
            {routes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === route.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Link href="/order" className="hidden sm:block">
            <Button>Order Now</Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex items-center gap-2 mb-8">
                <Coffee className="h-6 w-6" />
                <span className="font-bold">Brew Haven</span>
              </div>
              <nav className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      pathname === route.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <Link href="/order" className="mt-4">
                  <Button className="w-full" onClick={() => setIsOpen(false)}>
                    Order Now
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
