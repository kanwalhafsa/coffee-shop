"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Gift, Coffee, Clock, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Type definitions
interface LoyaltyReward {
  id: string
  name: string
  description: string
  points_required: number
  active: boolean
}

interface RedemptionHistory {
  id: string
  points_used: number
  redeemed_at: string
  loyalty_rewards: {
    name: string
    description: string
  }
}

interface LoyaltyData {
  points: number
  tier: string
  rewards: LoyaltyReward[]
  history: RedemptionHistory[]
}

interface RedeemResponse {
  success: boolean
  rewardCode: string
  remainingPoints: number
  error?: string
}

export default function LoyaltyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null)
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [rewardCode, setRewardCode] = useState("")
  const [redeeming, setRedeeming] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/loyalty")
    }

    if (status === "authenticated") {
      fetchLoyaltyData()
    }
  }, [status, router])

  const fetchLoyaltyData = async () => {
    try {
      const response = await fetch("/api/loyalty")

      if (!response.ok) {
        throw new Error("Failed to fetch loyalty data")
      }

      const data: LoyaltyData = await response.json()
      setLoyaltyData(data)
    } catch (error) {
      console.error("Error fetching loyalty data:", error)

      // Fallback to mock data if API fails
      setLoyaltyData({
        points: 250,
        tier: "Bronze",
        rewards: [
          {
            id: "1",
            name: "Free Coffee",
            description: "Get any regular coffee for free",
            points_required: 100,
            active: true,
          },
          {
            id: "2",
            name: "Free Pastry",
            description: "Choose any pastry from our selection",
            points_required: 150,
            active: true,
          },
          {
            id: "3",
            name: "Premium Drink",
            description: "Any specialty drink of your choice",
            points_required: 200,
            active: true,
          },
          {
            id: "4",
            name: "Free Lunch Combo",
            description: "Sandwich + drink + side",
            points_required: 300,
            active: true,
          },
        ],
        history: [
          {
            id: "1",
            points_used: 100,
            redeemed_at: "2024-01-15T10:30:00Z",
            loyalty_rewards: {
              name: "Free Coffee",
              description: "Regular coffee",
            },
          },
        ],
      })

      toast({
        title: "Using demo data",
        description: "Loyalty API not available, showing sample data",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemClick = (reward: LoyaltyReward) => {
    setSelectedReward(reward)
    setRedeemDialogOpen(true)
  }

  const handleRedeemConfirm = async () => {
    if (!selectedReward || !loyaltyData) return

    setRedeeming(true)

    try {
      const response = await fetch("/api/loyalty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rewardId: selectedReward.id,
        }),
      })

      const data: RedeemResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to redeem reward")
      }

      setRewardCode(data.rewardCode)
      setLoyaltyData((prev) =>
        prev
          ? {
              ...prev,
              points: data.remainingPoints,
            }
          : null,
      )

      setRedeemDialogOpen(false)
      setSuccessDialogOpen(true)

      // Refresh loyalty data
      fetchLoyaltyData()
    } catch (error) {
      console.error("Error redeeming reward:", error)

      // Mock successful redemption for demo
      const mockRewardCode = `BREW${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      setRewardCode(mockRewardCode)

      if (loyaltyData) {
        setLoyaltyData((prev) =>
          prev
            ? {
                ...prev,
                points: prev.points - selectedReward.points_required,
              }
            : null,
        )
      }

      setRedeemDialogOpen(false)
      setSuccessDialogOpen(true)

      toast({
        title: "Demo redemption successful",
        description: `Reward code: ${mockRewardCode}`,
      })
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!loyaltyData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load loyalty data</h2>
          <p className="text-muted-foreground mb-4">Please try again later.</p>
          <Button onClick={fetchLoyaltyData}>Retry</Button>
        </div>
      </div>
    )
  }

  // Find the next reward the user can redeem
  const nextReward = loyaltyData.rewards.find((reward) => reward.points_required > loyaltyData.points)
  const pointsToNextReward = nextReward ? nextReward.points_required - loyaltyData.points : 0
  const progressPercentage = nextReward ? (loyaltyData.points / nextReward.points_required) * 100 : 100

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Loyalty Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
              <CardDescription>Earn points with every purchase and redeem them for rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-2xl font-bold">{loyaltyData.points}</span>
                    <span className="text-muted-foreground ml-2">points</span>
                  </div>
                  {nextReward && (
                    <div className="text-sm text-muted-foreground">{pointsToNextReward} points until next reward</div>
                  )}
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Available Rewards</h3>

                {loyaltyData.rewards.length === 0 ? (
                  <p className="text-muted-foreground">No rewards available at the moment.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loyaltyData.rewards.map((reward) => (
                      <Card key={reward.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center mb-2">
                                <Gift className="h-5 w-5 text-primary mr-2" />
                                <h4 className="font-medium">{reward.name}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                              <Badge variant="outline" className="mb-4">
                                {reward.points_required} points
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleRedeemClick(reward)}
                            disabled={loyaltyData.points < reward.points_required}
                            className="w-full"
                          >
                            {loyaltyData.points >= reward.points_required
                              ? "Redeem Reward"
                              : `Need ${reward.points_required - loyaltyData.points} more points`}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Coffee className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">1. Earn Points</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn 10 points for every $1 spent on coffee and food items.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">2. Redeem Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your points to redeem free drinks, food items, and exclusive perks.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <ChevronRight className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">3. Level Up</h3>
                  <p className="text-sm text-muted-foreground">
                    Reach higher tiers for bonus points and special member-only offers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Redemption History</CardTitle>
            </CardHeader>
            <CardContent>
              {loyaltyData.history.length === 0 ? (
                <p className="text-muted-foreground">You haven't redeemed any rewards yet.</p>
              ) : (
                <div className="space-y-4">
                  {loyaltyData.history.map((redemption) => (
                    <div key={redemption.id} className="flex items-start space-x-3 pb-4 border-b">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Gift className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{redemption.loyalty_rewards.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(redemption.redeemed_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-auto text-sm">
                        <Badge variant="outline">-{redemption.points_used} pts</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/terms#loyalty" target="_blank" rel="noreferrer">
                  Program Terms & Conditions
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Redeem Confirmation Dialog */}
      <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="py-4">
              <h4 className="font-medium mb-2">{selectedReward.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">{selectedReward.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cost:</span>
                <Badge variant="outline">{selectedReward.points_required} points</Badge>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">Your balance after redemption:</span>
                <span className="font-medium">{loyaltyData.points - selectedReward.points_required} points</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRedeemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRedeemConfirm} disabled={redeeming}>
              {redeeming ? "Processing..." : "Confirm Redemption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reward Redeemed!</DialogTitle>
            <DialogDescription>Your reward has been successfully redeemed.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-muted p-4 rounded-md text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">Your reward code:</p>
              <p className="text-xl font-mono font-bold tracking-wider">{rewardCode}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Show this code to our staff when visiting our store to claim your reward. This code has also been sent to
              your email.
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => setSuccessDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
