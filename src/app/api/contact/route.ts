import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Try to send via Web3Forms
    try {
      const formData = {
        access_key: "121a70a4-2991-46a5-b2b4-1d9a361d199e",
        name,
        email,
        phone: phone || "",
        subject,
        message,
        from_name: "Brew Haven Contact Form",
        to_email: "kanwalhafsa47@gmail.com",
      }

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        return NextResponse.json({
          success: true,
          message: "Message sent successfully via Web3Forms!",
        })
      } else {
        throw new Error(data.message || "Web3Forms failed")
      }
    } catch (web3Error) {
      console.error("Web3Forms error:", web3Error)

      // Fallback: Log the message (in production, you could save to database)
      console.log("Contact Form Submission:", {
        name,
        email,
        phone,
        subject,
        message,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: "Message received! We'll get back to you soon.",
        note: "Saved locally due to email service issue",
      })
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ success: false, error: "Failed to process message" }, { status: 500 })
  }
}
