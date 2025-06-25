import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Mock loyalty data - replace with actual database queries
    const mockLoyaltyData = {
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
    }

    return NextResponse.json(mockLoyaltyData)
  } catch (error) {
    console.error("Loyalty data error:", error)
    return NextResponse.json({ error: "Failed to fetch loyalty data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { rewardId } = await request.json()

    if (!rewardId) {
      return NextResponse.json({ error: "Reward ID required" }, { status: 400 })
    }

    // Mock redemption - replace with actual database logic
    const rewardCode = `BREW${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    return NextResponse.json({
      success: true,
      rewardCode,
      remainingPoints: 150, // Mock remaining points
    })
  } catch (error) {
    console.error("Reward redemption error:", error)
    return NextResponse.json({ error: "Failed to redeem reward" }, { status: 500 })
  }
}
