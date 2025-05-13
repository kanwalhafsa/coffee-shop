import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const feedbacks = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/images/fimg1.jpg",
    width:100,
    height:100,
    rating: 5,
    comment:
      "The best coffee I've ever had! The atmosphere is cozy and the staff is incredibly friendly. I come here every morning before work.",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/images/fimg1.jpg",
    width:100,
    height:100,
    rating: 4,
    comment:
      "Great selection of specialty coffees. The Hazelnut Latte is my favorite. Prices are reasonable for the quality you get.",
    date: "1 month ago",
    verified: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/images/fimg1.jpg",
    width:100,
    height:100,
    rating: 5,
    comment:
      "I love working from this coffee shop. The WiFi is reliable, and they don't mind if you stay for hours. Plus, their pastries are amazing!",
    date: "3 weeks ago",
    verified: true,
  },
  {
    id: 4,
    name: "David Thompson",
    avatar: "/images/fimg1.jpg",
    width:100,
    height:100,
    rating: 3,
    comment:
      "Good coffee but sometimes it takes a while to get served during peak hours. The cold brew is excellent though.",
    date: "2 months ago",
    verified: false,
  },
  {
    id: 5,
    name: "Jessica Lee",
    avatar: "/images/fimg1.jpg",
    width:100,
    height:100,
    rating: 5,
    comment:
      "The seasonal specials are always something to look forward to. The pumpkin spice latte is the best I've had anywhere.",
    date: "3 weeks ago",
    verified: true,
  },
  {
    id: 6,
    name: "Robert Garcia",
    avatar: "/images/fimg1.jpg",
    width:100,
    height:100,
    rating: 4,
    comment:
      "Great place to meet friends or have a business meeting. The ambient noise level is perfect - not too loud, not too quiet.",
    date: "1 month ago",
    verified: false,
  },
]

export default function FeedbackList() {
  return (
    <div className="space-y-6">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={feedback.avatar || "/placeholder.svg"} alt={feedback.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">{feedback.name}</h3>
                  {feedback.verified && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Verified Customer
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{feedback.date}</p>
              </div>
            </div>
            <div className="flex mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{feedback.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
