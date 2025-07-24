import bcrypt from "bcryptjs"
import { executeQuery } from "./database"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  dateOfBirth?: string
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
  dateOfBirth?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create new user
export async function createUser(userData: CreateUserData) {
  try {
    // Check if user already exists
    const existingUser = await executeQuery("SELECT id FROM users WHERE email = $1", [userData.email])

    if (existingUser.success && existingUser.data.length > 0) {
      return { success: false, error: "User already exists with this email" }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user
    const query = `
      INSERT INTO users (name, email, password_hash, phone, address, city, date_of_birth)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, phone, address, city, date_of_birth, is_active, email_verified, created_at
    `

    const params = [
      userData.name,
      userData.email,
      hashedPassword,
      userData.phone || null,
      userData.address || null,
      userData.city || null,
      userData.dateOfBirth || null,
    ]

    const result = await executeQuery(query, params)

    if (result.success) {
      // Create loyalty record for new user
      await executeQuery("INSERT INTO customer_loyalty (user_id) VALUES ($1)", [result.data[0].id])

      return { success: true, user: result.data[0] }
    }

    return { success: false, error: "Failed to create user" }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Authenticate user
export async function authenticateUser(credentials: LoginCredentials) {
  try {
    const query = `
      SELECT id, name, email, password_hash, phone, address, city, 
             date_of_birth, is_active, email_verified, created_at
      FROM users 
      WHERE email = $1 AND is_active = true
    `

    const result = await executeQuery(query, [credentials.email])

    if (!result.success || result.data.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = result.data[0]

    // Verify password
    const isValidPassword = await verifyPassword(credentials.password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error("Authenticate user error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const query = `
      SELECT id, name, email, phone, address, city, date_of_birth, 
             is_active, email_verified, created_at
      FROM users 
      WHERE id = $1 AND is_active = true
    `

    const result = await executeQuery(query, [id])

    if (result.success && result.data.length > 0) {
      return { success: true, user: result.data[0] }
    }

    return { success: false, error: "User not found" }
  } catch (error) {
    console.error("Get user by ID error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Update user profile
export async function updateUserProfile(id: string, updates: Partial<CreateUserData>) {
  try {
    const setClause = Object.keys(updates)
      .filter((key) => key !== "password") // Handle password separately
      .map((key, index) => {
        const dbKey = key === "dateOfBirth" ? "date_of_birth" : key.replace(/([A-Z])/g, "_$1").toLowerCase()
        return `${dbKey} = $${index + 2}`
      })
      .join(", ")

    if (!setClause) {
      return { success: false, error: "No valid fields to update" }
    }

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, phone, address, city, date_of_birth, is_active, email_verified, created_at
    `

    const params = [id, ...Object.values(updates).filter((_, index) => Object.keys(updates)[index] !== "password")]

    const result = await executeQuery(query, params)

    if (result.success) {
      return { success: true, user: result.data[0] }
    }

    return { success: false, error: "Failed to update user" }
  } catch (error) {
    console.error("Update user profile error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Create user session
export async function createUserSession(userId: string) {
  try {
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const query = `
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING session_token, expires_at
    `

    const result = await executeQuery(query, [userId, sessionToken, expiresAt])

    if (result.success) {
      return { success: true, session: result.data[0] }
    }

    return { success: false, error: "Failed to create session" }
  } catch (error) {
    console.error("Create session error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Validate user session
export async function validateUserSession(sessionToken: string) {
  try {
    const query = `
      SELECT s.user_id, s.expires_at, u.id, u.name, u.email, u.phone, u.address, u.city
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP AND u.is_active = true
    `

    const result = await executeQuery(query, [sessionToken])

    if (result.success && result.data.length > 0) {
      return { success: true, user: result.data[0] }
    }

    return { success: false, error: "Invalid or expired session" }
  } catch (error) {
    console.error("Validate session error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Delete user session (logout)
export async function deleteUserSession(sessionToken: string) {
  try {
    const query = "DELETE FROM user_sessions WHERE session_token = $1"
    const result = await executeQuery(query, [sessionToken])
    return { success: result.success }
  } catch (error) {
    console.error("Delete session error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Generate session token
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Get user's order history
export async function getUserOrderHistory(userId: string, limit = 10, offset = 0) {
  try {
    const query = `
      SELECT o.*, 
             COUNT(oi.id) as item_count,
             ARRAY_AGG(
               JSON_BUILD_OBJECT(
                 'product_name', oi.product_name,
                 'quantity', oi.quantity,
                 'unit_price', oi.unit_price,
                 'total_price', oi.total_price
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `

    const result = await executeQuery(query, [userId, limit, offset])

    if (result.success) {
      return { success: true, orders: result.data }
    }

    return { success: false, error: "Failed to fetch order history" }
  } catch (error) {
    console.error("Get user order history error:", error)
    return { success: false, error: "Internal server error" }
  }
}

// Get user's loyalty points
export async function getUserLoyalty(userId: string) {
  try {
    const query = `
      SELECT points_earned, points_used, points_balance, total_orders, 
             total_spent, membership_level, created_at
      FROM customer_loyalty
      WHERE user_id = $1
    `

    const result = await executeQuery(query, [userId])

    if (result.success && result.data.length > 0) {
      return { success: true, loyalty: result.data[0] }
    }

    return { success: false, error: "Loyalty data not found" }
  } catch (error) {
    console.error("Get user loyalty error:", error)
    return { success: false, error: "Internal server error" }
  }
}
