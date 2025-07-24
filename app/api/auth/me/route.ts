import { type NextRequest, NextResponse } from "next/server"
import { validateUserSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "No session found" }, { status: 401 })
    }

    const result = await validateUserSession(sessionToken)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({ user: result.user }, { status: 200 })
  } catch (error) {
    console.error("Get current user API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
