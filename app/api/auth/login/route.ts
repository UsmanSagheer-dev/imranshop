import { type NextRequest, NextResponse } from "next/server"
import { loginUser, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Login user
    const result = await loginUser(email, password)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }

    // Set auth cookie
    if (result.token) {
      await setAuthCookie(result.token)
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: result.user,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
