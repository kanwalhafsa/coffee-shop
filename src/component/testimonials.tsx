import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "The best coffee I've ever had! The atmosphere is cozy and the staff is incredibly friendly. I come here every morning before work.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    comment:
      "Great selection of specialty coffees. The Hazelnut Latte is my favorite. Prices are reasonable for the quality you get.",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    comment:
      "I love working from this coffee shop. The WiFi is reliable, and they don't mind if you stay for hours. Plus, their pastries are amazing!",
    date: "3 weeks ago",
  },
]

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.date}</p>
              </div>
            </div>
            <div className="flex mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{testimonial.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
