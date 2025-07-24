import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { executeQuery } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

// Register new user
export async function registerUser(userData: {
  name: string
  email: string
  phone?: string
  password: string
  address?: string
  city?: string
}): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await executeQuery("SELECT id FROM users WHERE email = $1", [userData.email])

    if (existingUser.success && existingUser.data.length > 0) {
      return { success: false, message: "User already exists with this email" }
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password)

    // Create user
    const result = await executeQuery(
      `INSERT INTO users (name, email, phone, password_hash, address, city)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, address, city, is_active, email_verified, created_at`,
      [
        userData.name,
        userData.email,
        userData.phone || null,
        passwordHash,
        userData.address || null,
        userData.city || null,
      ],
    )

    if (!result.success || result.data.length === 0) {
      return { success: false, message: "Failed to create user" }
    }

    const user = result.data[0]
    const token = generateToken(user.id)

    // Create loyalty record
    await executeQuery(
      `INSERT INTO customer_loyalty (user_id, points_balance, membership_level)
       VALUES ($1, 0, 'Bronze')`,
      [user.id],
    )

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
      },
      token,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Registration failed" }
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    const result = await executeQuery(
      `SELECT id, name, email, phone, password_hash, address, city, is_active, email_verified, created_at
       FROM users WHERE email = $1 AND is_active = true`,
      [email],
    )

    if (!result.success || result.data.length === 0) {
      return { success: false, message: "Invalid email or password" }
    }

    const user = result.data[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, message: "Invalid email or password" }
    }

    const token = generateToken(user.id)

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
      },
      token,
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Login failed" }
  }
}

// Get current user from token
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const result = await executeQuery(
      `SELECT id, name, email, phone, address, city, is_active, email_verified, created_at
       FROM users WHERE id = $1 AND is_active = true`,
      [decoded.userId],
    )

    if (!result.success || result.data.length === 0) {
      return null
    }

    const user = result.data[0]
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      isActive: user.is_active,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
