import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const result = await createUser({
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password,
      phone: body.phone,
      address: body.address,
      city: body.city,
      dateOfBirth: body.dateOfBirth,
    })

    if (result.success) {
      return NextResponse.json({ message: "User created successfully", user: result.user }, { status: 201 })
    }

    return NextResponse.json({ error: result.error }, { status: 400 })
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
