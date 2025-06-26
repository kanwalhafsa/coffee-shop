"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, Menu, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "../../contexts/auth-context"

export default function Navbar() {
  const pathname = usePathname()
  const { cart } = useCart() // Changed from items to cart
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log("Navbar: Mounted, cart =", cart, "user =", user)
    setMounted(true)
  }, [cart, user])

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const routes = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/feedback", label: "Feedback" },
    { href: "/contact", label: "Contact" },
  ]

  // Don't render auth-dependent UI on login/signup pages
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Coffee className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Brew Haven</span>
        </Link>

        {!isAuthPage && (
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
        )}

        <div className="flex items-center gap-2 ml-auto">
          {!isAuthPage && (
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
          )}

          {!isAuthPage && (
            <>
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline">Sign Up</Button>
                  </Link>
                </div>
              )}

              <Link href="/order-now" className="hidden sm:block">
                <Button>Order Now</Button>
              </Link>
            </>
          )}

          {!isAuthPage && (
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

                  {user ? (
                    <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">Welcome, {user.name}</div>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href="/login">
                        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}

                  <Link href="/order-now" className="mt-2">
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                      Order Now
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}