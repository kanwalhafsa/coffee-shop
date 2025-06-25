import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { sendOrderConfirmationEmailLegacy } from "@/lib/email"
import { supabase } from "@/lib/db"

// Type definitions
interface OrderItem {
  name: string
  description: string
  quantity: number
  price: number
}

interface DeliveryDetails {
  type: string
  address?: string | null
}

interface ContactInfo {
  name: string
  phone: string
  email: string
}

interface OrderRequestBody {
  items: OrderItem[]
  deliveryDetails: DeliveryDetails
  contactInfo: ContactInfo
  specialInstructions?: string
  paymentMethod?: string
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body: OrderRequestBody = await request.json()
    const { items, deliveryDetails, paymentMethod } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }

    // Calculate totals with proper typing
    const subtotal = items.reduce((total: number, item: OrderItem) => {
      return total + item.price * item.quantity
    }, 0)

    const tax = subtotal * 0.1 // 10% tax
    const deliveryFee = deliveryDetails?.type === "delivery" ? 5.99 : 0
    const total = subtotal + tax + deliveryFee

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_email: session.user.email,
        subtotal,
        tax,
        delivery_fee: deliveryFee,
        total,
        status: "pending",
        delivery_type: deliveryDetails?.type || "pickup",
        delivery_address: deliveryDetails?.address || null,
        payment_method: paymentMethod || "card",
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Database error: ${orderError.message}`)
    }

    // Add order items with proper typing
    const orderItems = items.map((item: OrderItem) => ({
      order_id: order.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw new Error(`Items error: ${itemsError.message}`)
    }

    // Get complete order with items for email
    const { data: completeOrder } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("id", order.id)
      .single()

    // Send confirmation email
    try {
      await sendOrderConfirmationEmailLegacy({
        order: {
          id: completeOrder.id,
          created_at: completeOrder.created_at,
          total: completeOrder.total,
          subtotal: completeOrder.subtotal,
          tax: completeOrder.tax,
          delivery_fee: completeOrder.delivery_fee,
          items: completeOrder.items.map((item: any) => ({
            id: item.id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        customerEmail: session.user.email,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
