import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface WelcomeEmailProps {
  customerName: string
  customerEmail: string
}

export default function WelcomeEmail({ customerName, customerEmail }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Brew Haven!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>☕ Welcome to Brew Haven!</Heading>

          <Text style={paragraph}>Hi {customerName},</Text>

          <Text style={paragraph}>
            Welcome to Brew Haven! We're excited to have you join our coffee-loving community.
          </Text>

          <Text style={paragraph}>Here's what you can do with your new account:</Text>

          <Section style={featureList}>
            <Text style={featureItem}>• Browse our premium coffee selection</Text>
            <Text style={featureItem}>• Place orders for pickup or delivery</Text>
            <Text style={featureItem}>• Track your order status</Text>
            <Text style={featureItem}>• Save your favorite drinks</Text>
            <Text style={featureItem}>• Get exclusive offers and updates</Text>
          </Section>

          <Section style={ctaContainer}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/menu`} style={button}>
              Browse Our Menu
            </Link>
          </Section>

          <Text style={paragraph}>
            If you have any questions, feel free to contact us at{" "}
            <Link href="mailto:support@brewhaven.com" style={link}>
              support@brewhaven.com
            </Link>
          </Text>

          <Text style={paragraph}>
            Happy brewing!
            <br />
            The Brew Haven Team
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
  margin: "16px 0",
}

const featureList = {
  margin: "20px 0",
}

const featureItem = {
  fontSize: "14px",
  color: "#555",
  margin: "8px 0",
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
