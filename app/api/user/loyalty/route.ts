import { type NextRequest, NextResponse } from "next/server"
import { validateUserSession, getUserLoyalty } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const sessionResult = await validateUserSession(sessionToken)

    if (!sessionResult.success) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const loyaltyResult = await getUserLoyalty(sessionResult.user.user_id)

    if (!loyaltyResult.success) {
      return NextResponse.json({ error: loyaltyResult.error }, { status: 500 })
    }

    return NextResponse.json({ loyalty: loyaltyResult.loyalty }, { status: 200 })
  } catch (error) {
    console.error("Get user loyalty API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
