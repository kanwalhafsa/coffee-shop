
import { Body, Container, Head, Heading, Html, Img, Link, Preview, Section, Text } from "@react-email/components"

// Interface add karein
interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  created_at: string
  total: number
  subtotal: number
  tax: number
  delivery_fee: number
  items: OrderItem[]
}

interface OrderConfirmationEmailProps {
  order: Order
}

export default function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <Html>
      <Head />
      <Preview>Your Brew Haven order confirmation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/placeholder.svg?height=40&width=120`}
            width="120"
            height="40"
            alt="Brew Haven"
            style={logo}
          />
          <Heading style={heading}>Order Confirmation</Heading>
          <Text style={paragraph}>Thank you for your order! We've received your order and are preparing it now.</Text>

          <Section style={orderInfo}>
            <Text style={orderInfoText}>
              <strong>Order Number:</strong> #{order.id.slice(-6)}
            </Text>
            <Text style={orderInfoText}>
              <strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}
            </Text>
            <Text style={orderInfoText}>
              <strong>Order Total:</strong> {formatPrice(order.total)}
            </Text>
          </Section>

          <Heading as="h2" style={subheading}>
            Order Summary
          </Heading>

          {order.items.map((item) => (
            <Section key={item.id} style={orderItem}>
              <Text style={itemName}>
                {item.quantity} x {item.product_name}
              </Text>
              <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </Section>
          ))}

          <Section style={totals}>
            <Text style={totalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </Text>
            <Text style={totalRow}>
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </Text>
            {order.delivery_fee > 0 && (
              <Text style={totalRow}>
                <span>Delivery Fee</span>
                <span>{formatPrice(order.delivery_fee)}</span>
              </Text>
            )}
            <Text style={totalRowBold}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </Text>
          </Section>

          <Section style={ctaContainer}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}`} style={button}>
              Track Your Order
            </Link>
          </Section>

          <Text style={paragraph}>
            If you have any questions about your order, please contact us at{" "}
            <Link href="mailto:support@brewhaven.com" style={link}>
              support@brewhaven.com
            </Link>
          </Text>

          <Text style={footer}>&copy; {new Date().getFullYear()} Brew Haven. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
}

const logo = {
  margin: "0 auto 20px",
  display: "block",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#333",
}

const subheading = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "30px 0 15px",
  color: "#333",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#555",
}

const orderInfo = {
  backgroundColor: "#f7f7f7",
  padding: "20px",
  borderRadius: "5px",
  margin: "20px 0",
}

const orderInfoText = {
  margin: "5px 0",
  fontSize: "14px",
  color: "#555",
}

const orderItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
}

const itemName = {
  fontSize: "14px",
  color: "#555",
  margin: "0",
}

const itemPrice = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#555",
  margin: "0",
}

const totals = {
  marginTop: "20px",
}

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  color: "#555",
  margin: "5px 0",
}

const totalRowBold = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  margin: "15px 0 5px",
  borderTop: "1px solid #eee",
  paddingTop: "15px",
}

const ctaContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 30px",
  textDecoration: "none",
}

const link = {
  color: "#4F46E5",
  textDecoration: "underline",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "30px",
  textAlign: "center" as const,
}
