"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function FeedbackForm() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  console.log("FeedbackForm: user =", user, "isLoading =", isLoading)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLoading) {
      console.log("FeedbackForm: Auth is loading, waiting...")
      toast.info("Please wait, checking authentication...")
      return
    }

    if (!user) {
      console.log("FeedbackForm: User not logged in, redirecting to /login")
      toast.error("Please log in or sign up to submit feedback")
      router.push("/login")
      return
    }

    if (rating === 0) {
      console.log("FeedbackForm: No rating selected")
      toast.error("Please select a rating before submitting your feedback")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)

      const formObject = {
        access_key: "121a70a4-2991-46a5-b2b4-1d9a361d199e",
        name: formData.get("name") as string,
        email: user.email,
        rating: rating,
        feedback: formData.get("feedback") as string,
        from_name: "Brew Haven Feedback Form",
        to_email: "kanwalhafsa47@gmail.com",
        user_id: user.id,
      }

      console.log("FeedbackForm: Submitting form:", formObject)

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formObject),
      })

      const data = await response.json()
      console.log("FeedbackForm: Web3Forms response:", data)

      if (response.ok && data.success) {
        toast.success("Feedback submitted successfully! Thank you for your input.")
        e.currentTarget.reset()
        setRating(0)
      } else {
        console.error("FeedbackForm: Web3Forms error:", data.message || "Unknown error")
        throw new Error(data.message || "Failed to submit feedback")
      }
    } catch (error: any) {
      console.error("FeedbackForm: Submission error:", error.message)
      toast.error("Failed to submit feedback. Please try again or contact us at kanwalhafsa47@gmail.com")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Your name" required />
      </div>

      <div className="space-y-2">
        <Label>Your Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback">Your Feedback</Label>
        <Textarea id="feedback" name="feedback" placeholder="Share your experience with us..." className="min-h-[150px]" required />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Feedback"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Please <a href="/login" className="text-primary hover:underline">log in</a> or{" "}
        <a href="/signup" className="text-primary hover:underline">sign up</a> to submit feedback.
        <br />
        We'll review your feedback within 24 hours. Direct email:{" "}
        <a href="mailto:kanwalhafsa47@gmail.com" className="text-primary hover:underline">
          kanwalhafsa47@gmail.com
        </a>
      </p>
    </form>
  )
}