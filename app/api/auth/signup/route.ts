import { type NextRequest, NextResponse } from "next/server"
import { registerUser, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password, address, city } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    // Register user
    const result = await registerUser({
      name,
      email,
      phone,
      password,
      address,
      city,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    // Set auth cookie
    if (result.token) {
      await setAuthCookie(result.token)
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: result.user,
    })
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
