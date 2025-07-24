import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createUserSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const authResult = await authenticateUser({
      email: body.email.toLowerCase(),
      password: body.password,
    })

    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Create session
    const sessionResult = await createUserSession(authResult.user.id)

    if (!sessionResult.success) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Set session cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: authResult.user,
      },
      { status: 200 },
    )

    response.cookies.set("session_token", sessionResult.session.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(sessionResult.session.expires_at),
    })

    return response
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
