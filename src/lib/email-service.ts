import { render } from "@react-email/render"
import OrderConfirmationEmail from "@/component/emails/order-confirmation"

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
    // React Email component ko HTML mein convert karein - await add kiya
    const htmlContent = await render(
      OrderConfirmationEmail({
        order: {
          id: data.orderNumber,
          created_at: new Date().toISOString(),
          total: data.total,
          subtotal: data.total * 0.9, // Assuming 10% tax
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

// Order status update email
export async function sendOrderStatusEmail(data: OrderStatusData) {
  try {
    // Simple HTML template for order status (since we don't have the component yet)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">Brew Haven</h1>
          </div>
          
          <h2>Order Status Update</h2>
          
          <p>Hi ${data.customerName},</p>
          
          <p>Your order <strong>#${data.orderNumber}</strong> status has been updated to: <strong>${data.status.toUpperCase()}</strong></p>
          
          ${data.estimatedTime ? `<p>Estimated time: <strong>${data.estimatedTime}</strong></p>` : ""}
          
          <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order Number:</strong> #${data.orderNumber}</p>
            <p><strong>Status:</strong> ${data.status.toUpperCase()}</p>
          </div>
          
          <p>Thank you for choosing Brew Haven!</p>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Brew Haven. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

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

// Welcome email
export async function sendWelcomeEmail(customerName: string, customerEmail: string) {
  try {
    // Simple HTML template for welcome email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Brew Haven</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">☕ Brew Haven</h1>
          </div>
          
          <h2>Welcome to Brew Haven!</h2>
          
          <p>Hi ${customerName},</p>
          
          <p>Welcome to Brew Haven! We're excited to have you join our coffee-loving community.</p>
          
          <p>Here's what you can do with your new account:</p>
          <ul>
            <li>Browse our premium coffee selection</li>
            <li>Place orders for pickup or delivery</li>
            <li>Track your order status</li>
            <li>Save your favorite drinks</li>
            <li>Get exclusive offers and updates</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/menu" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Browse Our Menu
            </a>
          </div>
          
          <p>If you have any questions, feel free to contact us at support@brewhaven.com</p>
          
          <p>Happy brewing!</p>
          <p>The Brew Haven Team</p>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Brew Haven. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

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

// Password reset email
export async function sendPasswordResetEmail(data: PasswordResetData) {
  try {
    // Simple HTML template for password reset
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - Brew Haven</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5;">Brew Haven</h1>
          </div>
          
          <h2>Password Reset Request</h2>
          
          <p>Hi ${data.customerName},</p>
          
          <p>We received a request to reset your password for your Brew Haven account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>This link will expire in ${data.expiryTime || "1 hour"}.</p>
          
          <p>If you didn't request this password reset, please ignore this email or contact us if you have concerns.</p>
          
          <p>For security reasons, please don't share this link with anyone.</p>
          
          <p>Best regards,<br>The Brew Haven Team</p>
          
          <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Brew Haven. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

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
