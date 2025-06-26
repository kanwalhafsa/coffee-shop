"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactFormAPI() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check if authentication is still loading
    if (isLoading) {
      toast.info("Please wait, checking authentication...")
      return
    }

    // Check if user is logged in
    if (!user) {
      toast.info("Please log in to send a message.")
      router.push("/login")
      return
    }

    setIsSubmitting(true)

    // Declare contactData outside try block to make it accessible in catch block
    const formData = new FormData(e.currentTarget)
    const contactData = {
      access_key: "121a70a4-2991-46a5-b2b4-1d9a361d199e", // Replace with your valid Web3Forms access key
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || "",
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      from_name: "Brew Haven Contact Form",
      to_email: "kanwalhafsa47@gmail.com",
      user_id: user.id,
    }

    try {
      // Validate form data
      if (!contactData.name.trim() || !contactData.email.trim() || !contactData.subject.trim() || !contactData.message.trim()) {
        toast.error("Please fill in all required fields.")
        setIsSubmitting(false)
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactData.email)) {
        toast.error("Please enter a valid email address.")
        setIsSubmitting(false)
        return
      }

      console.log("ContactFormAPI: Submitting form data:", contactData)

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()
      console.log("ContactFormAPI: Web3Forms API response:", {
        status: response.status,
        body: data,
      })

      if (response.ok && data.success) {
        toast.success("Message sent successfully! Check your email for confirmation.")
        const form = e.target as HTMLFormElement
        form.reset()
      } else {
        throw new Error(data.message || `API request failed with status ${response.status}`)
      }
    } catch (error) {
      console.error("ContactFormAPI: Error sending message:", error)
      toast.error(
        "Failed to send message. Please check your Web3Forms configuration or contact us directly at kanwalhafsa47@gmail.com"
      )

      // Fallback: Save to localStorage for debugging
      const messages = JSON.parse(localStorage.getItem("contact_messages") || "[]")
      messages.push({
        ...contactData,
        userId: user.id,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("contact_messages", JSON.stringify(messages))
      console.log("ContactFormAPI: Saved to localStorage for debugging:", messages)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" placeholder="Your full name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" name="subject" placeholder="What is this regarding?" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us how we can help you..."
          className="min-h-[120px]"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Please <a href="/login" className="text-primary hover:underline">log in</a> or{" "}
        <a href="/signup" className="text-primary hover:underline">sign up</a> to send a message.
        <br />
        We'll respond to your message within 24 hours. Direct email:{" "}
        <a href="mailto:kanwalhafsa47@gmail.com" className="text-primary hover:underline">
          kanwalhafsa47@gmail.com
        </a>
      </p>
    </form>
  )
}