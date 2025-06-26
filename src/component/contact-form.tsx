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

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  console.log("ContactForm: user =", user, "isLoading =", isLoading)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLoading) {
      console.log("ContactForm: Auth is loading, waiting...")
      toast.info("Please wait, checking authentication...")
      return
    }

    if (!user) {
      console.log("ContactForm: User not logged in, redirecting to /login")
      toast.error("Please log in or sign up to send a message")
      router.push("/login")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      const formObject = {
        access_key: "121a70a4-2991-46a5-b2b4-1d9a361d199e",
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || "",
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        from_name: "Brew Haven Contact Form",
        to_email: "kanwalhafsa47@gmail.com",
        user_id: user.id,
      }

      console.log("ContactForm: Submitting form:", formObject)

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formObject),
      })

      const data = await response.json()
      console.log("ContactForm: Web3Forms response:", data)

      if (data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        e.currentTarget.reset()
      } else {
        throw new Error(data.message || "Failed to send message")
      }
    } catch (error) {
      console.error("ContactForm: Error sending message:", error)
      toast.error("Failed to send message. Please try again or contact us at kanwalhafsa47@gmail.com")
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

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
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
        We'll respond within 24 hours. Direct email:{" "}
        <a href="mailto:kanwalhafsa47@gmail.com" className="text-primary hover:underline">
          kanwalhafsa47@gmail.com
        </a>
      </p>
    </form>
  )
}