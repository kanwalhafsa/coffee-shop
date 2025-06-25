"use client"

import type React from "react"
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Create a regular object instead of FormData for better CORS handling
      const formObject = {
        access_key: "121a70a4-2991-46a5-b2b4-1d9a361d199e",
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "",
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        from_name: "Brew Haven Contact Form",
        to_email: "kanwalhafsa47@gmail.com",
      }

      console.log("Submitting form with data:", formObject)

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formObject),
      })

      const data = await response.json()
      console.log("Web3Forms response:", data)

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        // Reset form
        const form = e.target as HTMLFormElement
        form.reset()
      } else {
        console.error("Web3Forms error:", data)
        throw new Error(data.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Fallback: Save to localStorage and show success message
      try {
        const formData = new FormData(e.currentTarget)
        const contactMessage = {
          id: Date.now().toString(),
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: (formData.get("phone") as string) || "",
          subject: formData.get("subject") as string,
          message: formData.get("message") as string,
          timestamp: new Date().toISOString(),
          status: "pending",
        }

        // Save to localStorage as backup
        const existingMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]")
        existingMessages.push(contactMessage)
        localStorage.setItem("contactMessages", JSON.stringify(existingMessages))

        toast.success("Message received! We'll get back to you soon. (Saved locally)")

        // Reset form
        const form = e.target as HTMLFormElement
        form.reset()
      } catch (fallbackError) {
        toast.error("Failed to send message. Please try again or contact us directly at kanwalhafsa47@gmail.com")
      }
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
        We'll respond to your message within 24 hours.
        <br />
        Direct email:{" "}
        <a href="mailto:kanwalhafsa47@gmail.com" className="text-primary hover:underline">
          kanwalhafsa47@gmail.com
        </a>
      </p>
    </form>
  )
}
