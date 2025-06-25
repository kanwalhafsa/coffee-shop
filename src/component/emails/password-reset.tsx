import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components"

interface PasswordResetEmailProps {
  customerName: string
  resetLink: string
  expiryTime?: string
}

export default function PasswordResetEmail({ customerName, resetLink, expiryTime }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Brew Haven password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Password Reset Request</Heading>

          <Text style={paragraph}>Hi {customerName},</Text>

          <Text style={paragraph}>We received a request to reset your password for your Brew Haven account.</Text>

          <Section style={ctaContainer}>
            <Link href={resetLink} style={button}>
              Reset Password
            </Link>
          </Section>

          <Text style={paragraph}>This link will expire in {expiryTime || "1 hour"}.</Text>

          <Text style={paragraph}>
            If you didn't request this password reset, please ignore this email or contact us if you have concerns.
          </Text>

          <Text style={paragraph}>For security reasons, please don't share this link with anyone.</Text>

          <Text style={paragraph}>
            Best regards,
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
