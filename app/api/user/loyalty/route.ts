import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Get user loyalty data
    const loyaltyResult = await executeQuery(`SELECT * FROM customer_loyalty WHERE user_id = $1`, [user.id])

    if (!loyaltyResult.success) {
      return NextResponse.json({ success: false, message: "Failed to fetch loyalty data" }, { status: 500 })
    }

    const loyalty = loyaltyResult.data[0] || {
      points_earned: 0,
      points_used: 0,
      points_balance: 0,
      total_orders: 0,
      total_spent: 0,
      membership_level: "Bronze",
    }

    return NextResponse.json({
      success: true,
      loyalty,
    })
  } catch (error) {
    console.error("Get user loyalty API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
