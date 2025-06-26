"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "../../contexts/auth-context"
import { CartItem } from "@/lib/types" // Import CartItem from lib/types.ts

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user } = useAuth()

  useEffect(() => {
    console.log("CartProvider: Initializing cart, user =", user)
    if (user) {
      try {
        const savedCart = localStorage.getItem(`cart_${user.id}`)
        if (savedCart) {
          setCart(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error("CartProvider: Error loading cart from localStorage:", error)
      }
    }
  }, [user])

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      let newCart: CartItem[]
      if (existingItem) {
        newCart = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      } else {
        newCart = [...prev, item]
      }
      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
      }
      return newCart
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.id !== id)
      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
      }
      return newCart
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(newCart))
      }
      return newCart
    })
  }

  const clearCart = () => {
    setCart([])
    if (user) {
      localStorage.removeItem(`cart_${user.id}`)
    }
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}