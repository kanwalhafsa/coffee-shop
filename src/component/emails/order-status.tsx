import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface OrderStatusEmailProps {
  customerName: string
  orderNumber: string
  status: string
  estimatedTime?: string
}

export default function OrderStatusEmail({ customerName, orderNumber, status, estimatedTime }: OrderStatusEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order status has been updated</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Order Status Update</Heading>

          <Text style={paragraph}>Hi {customerName},</Text>

          <Text style={paragraph}>
            Your order <strong>#{orderNumber}</strong> status has been updated to:{" "}
            <strong>{status.toUpperCase()}</strong>
          </Text>

          {estimatedTime && (
            <Text style={paragraph}>
              Estimated time: <strong>{estimatedTime}</strong>
            </Text>
          )}

          <Section style={orderInfo}>
            <Text style={orderInfoText}>
              <strong>Order Number:</strong> #{orderNumber}
            </Text>
            <Text style={orderInfoText}>
              <strong>Status:</strong> {status.toUpperCase()}
            </Text>
          </Section>

          <Section style={ctaContainer}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/order/${orderNumber}`} style={button}>
              Track Your Order
            </Link>
          </Section>

          <Text style={paragraph}>Thank you for choosing Brew Haven!</Text>

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

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
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

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "30px",
  textAlign: "center" as const,
}
