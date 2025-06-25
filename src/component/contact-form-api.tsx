"use client"

import type React from "react"
import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactFormAPI() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      const contactData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "",
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      }

      console.log("Submitting via API:", contactData)

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      const data = await response.json()
      console.log("API response:", data)

      if (data.success) {
        toast.success(data.message)
        // Reset form
        const form = e.target as HTMLFormElement
        form.reset()
      } else {
        throw new Error(data.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message. Please try again or contact us directly.")
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
