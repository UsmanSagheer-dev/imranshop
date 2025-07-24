import { type NextRequest, NextResponse } from "next/server"
import { validateUserSession, getUserOrderHistory } from "@/lib/auth"

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

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const ordersResult = await getUserOrderHistory(sessionResult.user.user_id, limit, offset)

    if (!ordersResult.success) {
      return NextResponse.json({ error: ordersResult.error }, { status: 500 })
    }

    return NextResponse.json({ orders: ordersResult.orders }, { status: 200 })
  } catch (error) {
    console.error("Get user orders API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
