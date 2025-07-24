import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Get user orders with items
    const ordersResult = await executeQuery(
      `SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'product_unit', oi.product_unit,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price
          )
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user.id],
    )

    if (!ordersResult.success) {
      return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orders: ordersResult.data,
    })
  } catch (error) {
    console.error("Get user orders API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
