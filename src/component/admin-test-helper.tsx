"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function AdminTestHelper() {
  const generateTestData = () => {
    // Test users data
    const testUsers = [
      { id: "1", name: "John Doe", email: "john@example.com", password: "password123" },
      { id: "2", name: "Jane Smith", email: "jane@example.com", password: "password123" },
      { id: "3", name: "Mike Johnson", email: "mike@example.com", password: "password123" },
    ]

    // Test menu items data
    const testMenuItems = [
      {
        id: "1",
        name: "Classic Espresso",
        description: "Rich and bold espresso shot",
        price: 3.5,
        category: "Hot Coffee",
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Vanilla Latte",
        description: "Smooth espresso with steamed milk and vanilla",
        price: 5.25,
        category: "Hot Coffee",
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Iced Americano",
        description: "Refreshing iced coffee with bold espresso",
        price: 4.25,
        category: "Cold Coffee",
        image: "/placeholder.svg?height=200&width=200",
        available: false,
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Cappuccino",
        description: "Perfect balance of espresso, steamed milk, and foam",
        price: 4.75,
        category: "Hot Coffee",
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Mocha",
        description: "Rich chocolate and espresso blend",
        price: 5.5,
        category: "Hot Coffee",
        image: "/placeholder.svg?height=200&width=200",
        available: true,
        featured: false,
        createdAt: new Date().toISOString(),
      },
    ]

    // Test orders data
    const testOrders = [
      {
        id: "BH123456",
        userId: "1",
        items: [
          {
            id: "1",
            name: "Classic Espresso",
            price: 3.5,
            quantity: 2,
            image: "/placeholder.svg?height=100&width=100",
          },
          { id: "2", name: "Vanilla Latte", price: 5.25, quantity: 1, image: "/placeholder.svg?height=100&width=100" },
        ],
        customerInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          address: "123 Main St, City, State 12345",
          city: "New York",
          postalCode: "12345",
          notes: "Please ring the doorbell",
        },
        orderType: "delivery",
        paymentMethod: "card",
        subtotal: 12.25,
        tax: 1.23,
        deliveryFee: 5.0,
        total: 18.48,
        status: "confirmed",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      {
        id: "BH123457",
        userId: "2",
        items: [
          { id: "2", name: "Vanilla Latte", price: 5.25, quantity: 3, image: "/placeholder.svg?height=100&width=100" },
        ],
        customerInfo: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1234567891",
          address: "456 Oak Ave, City, State 12345",
          city: "Los Angeles",
          postalCode: "90210",
          notes: "",
        },
        orderType: "pickup",
        paymentMethod: "cod",
        subtotal: 15.75,
        tax: 1.58,
        deliveryFee: 0,
        total: 17.33,
        status: "preparing",
        createdAt: new Date().toISOString(), // Today
      },
      {
        id: "BH123458",
        userId: "3",
        items: [
          {
            id: "1",
            name: "Classic Espresso",
            price: 3.5,
            quantity: 1,
            image: "/placeholder.svg?height=100&width=100",
          },
          { id: "4", name: "Cappuccino", price: 4.75, quantity: 2, image: "/placeholder.svg?height=100&width=100" },
        ],
        customerInfo: {
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "+1234567892",
          address: "789 Pine St, City, State 12345",
          city: "Chicago",
          postalCode: "60601",
          notes: "Leave at front door",
        },
        orderType: "delivery",
        paymentMethod: "online",
        subtotal: 13.0,
        tax: 1.3,
        deliveryFee: 5.0,
        total: 19.3,
        status: "delivering",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
    ]

    // Test inventory data
    const testInventory = [
      { id: "1", name: "Coffee Beans - Arabica", stock: 5, minStock: 10, unit: "kg" },
      { id: "2", name: "Milk", stock: 25, minStock: 10, unit: "liters" },
      { id: "3", name: "Vanilla Syrup", stock: 8, minStock: 10, unit: "bottles" },
      { id: "4", name: "Sugar", stock: 15, minStock: 5, unit: "kg" },
      { id: "5", name: "Paper Cups", stock: 3, minStock: 20, unit: "packs" },
    ]

    // Save all data to localStorage
    localStorage.setItem("users", JSON.stringify(testUsers))
    localStorage.setItem("menuItems", JSON.stringify(testMenuItems))
    localStorage.setItem("orders", JSON.stringify(testOrders))
    localStorage.setItem("inventory", JSON.stringify(testInventory))

    toast.success("✅ Test data generated successfully!")

    // Refresh the page to show updated data
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("users")
      localStorage.removeItem("menuItems")
      localStorage.removeItem("orders")
      localStorage.removeItem("inventory")
      localStorage.removeItem("user") // Current logged in user
      localStorage.removeItem("cart") // Cart data
      localStorage.removeItem("contactMessages") // Contact messages

      toast.success("🗑️ All data cleared successfully!")

      // Refresh the page
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  const checkDataStatus = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]")
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    const inventory = JSON.parse(localStorage.getItem("inventory") || "[]")

    const statusMessage = `📊 Data Status:
• Users: ${users.length}
• Menu Items: ${menuItems.length}
• Orders: ${orders.length}
• Inventory: ${inventory.length}`

    toast.info(statusMessage, {
      duration: 5000,
    })

    console.log("📊 Detailed Data Status:", {
      users: users.length,
      menuItems: menuItems.length,
      orders: orders.length,
      inventory: inventory.length,
      userData: users,
      menuData: menuItems,
      orderData: orders,
      inventoryData: inventory,
    })
  }

  const exportData = () => {
    const allData = {
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      menuItems: JSON.parse(localStorage.getItem("menuItems") || "[]"),
      orders: JSON.parse(localStorage.getItem("orders") || "[]"),
      inventory: JSON.parse(localStorage.getItem("inventory") || "[]"),
      contactMessages: JSON.parse(localStorage.getItem("contactMessages") || "[]"),
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `brew-haven-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
    toast.success("📥 Data exported successfully!")
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🧪 Admin Testing Helper</CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate test data to populate your admin dashboard with sample content
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <Button onClick={generateTestData} variant="default" className="w-full">
            🎲 Generate Test Data
          </Button>
          <Button onClick={checkDataStatus} variant="outline" className="w-full">
            📊 Check Data Status
          </Button>
          <Button onClick={exportData} variant="outline" className="w-full">
            📥 Export Data
          </Button>
          <Button onClick={clearAllData} variant="destructive" className="w-full">
            🗑️ Clear All Data
          </Button>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Quick Start Guide:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Generate Test Data" to populate the admin panel</li>
            <li>Use "Check Data Status" to see current data counts</li>
            <li>Navigate to different admin sections to see the data</li>
            <li>Use "Clear All Data" to reset everything</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
