import { type NextRequest, NextResponse } from "next/server"
import { deleteUserSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (sessionToken) {
      await deleteUserSession(sessionToken)
    }

    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

    // Clear session cookie
    response.cookies.delete("session_token")

    return response
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
