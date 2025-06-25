import { render } from "@react-email/render"
import OrderConfirmationEmail from "@/component/emails/order-confirmation"
import OrderStatusEmail from "@/component/emails/order-status"
import WelcomeEmail from "@/component/emails/welcome"
import PasswordResetEmail from "@/component/emails/password-reset"

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderNumber: string
  orderItems: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  orderType: "pickup" | "delivery"
}

interface OrderStatusData {
  customerName: string
  customerEmail: string
  orderNumber: string
  status: string
  estimatedTime?: string
}

interface PasswordResetData {
  customerName: string
  customerEmail: string
  resetLink: string
  expiryTime?: string
}

// Order confirmation email
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const htmlContent = await render(
      OrderConfirmationEmail({
        order: {
          id: data.orderNumber,
          created_at: new Date().toISOString(),
          total: data.total,
          subtotal: data.total * 0.9,
          tax: data.total * 0.1,
          delivery_fee: data.orderType === "delivery" ? 5.99 : 0,
          items: data.orderItems.map((item, index) => ({
            id: `item_${index}`,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      }),
    )

    return await sendEmail({
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: htmlContent,
    })
  } catch (error) {
    console.error("Order confirmation email error:", error)
    throw error
  }
}

// Order status update email - FIXED
export async function sendOrderStatusEmail(data: OrderStatusData) {
  try {
    const htmlContent = await render(
      OrderStatusEmail({
        customerName: data.customerName,
        orderNumber: data.orderNumber,
        status: data.status,
        estimatedTime: data.estimatedTime,
      }),
    )

    return await sendEmail({
      to: data.customerEmail,
      subject: `Order Update - ${data.orderNumber}`,
      html: htmlContent,
    })
  } catch (error) {
    console.error("Order status email error:", error)
    throw error
  }
}

// Welcome email - FIXED
export async function sendWelcomeEmail(customerName: string, customerEmail: string) {
  try {
    const htmlContent = await render(
      WelcomeEmail({
        customerName,
        customerEmail,
      }),
    )

    return await sendEmail({
      to: customerEmail,
      subject: "Welcome to Brew Haven! ☕",
      html: htmlContent,
    })
  } catch (error) {
    console.error("Welcome email error:", error)
    throw error
  }
}

// Password reset email - FIXED
export async function sendPasswordResetEmail(data: PasswordResetData) {
  try {
    const htmlContent = await render(
      PasswordResetEmail({
        customerName: data.customerName,
        resetLink: data.resetLink,
        expiryTime: data.expiryTime,
      }),
    )

    return await sendEmail({
      to: data.customerEmail,
      subject: "Password Reset - Brew Haven",
      html: htmlContent,
    })
  } catch (error) {
    console.error("Password reset email error:", error)
    throw error
  }
}

// Generic email sender
async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Brew Haven <noreply@brewhaven.com>",
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send email: ${errorText}`)
    }

    return await response.json()
  }

  // Development mode
  console.log("📧 Email would be sent:")
  console.log("To:", to)
  console.log("Subject:", subject)
  console.log("---")

  return {
    success: true,
    message: "Email logged (development mode)",
    id: `dev_${Date.now()}`,
  }
}

// Alternative function for backward compatibility
export async function sendOrderConfirmationEmailLegacy({
  order,
  customerEmail,
}: {
  order: {
    id: string
    created_at: string
    total: number
    subtotal: number
    tax: number
    delivery_fee: number
    items: Array<{
      id: string
      product_name: string
      quantity: number
      price: number
    }>
  }
  customerEmail: string
}) {
  try {
    const htmlContent = await render(OrderConfirmationEmail({ order }))

    return await sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - #${order.id.slice(-6)}`,
      html: htmlContent,
    })
  } catch (error) {
    console.error("❌ Email sending error:", error)
    throw error
  }
}
