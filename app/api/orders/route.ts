import { type NextRequest, NextResponse } from "next/server"
import { getOrders, createOrder, createNotification } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const customerId = searchParams.get("customer_id") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    const result = await getOrders({
      status,
      customerId,
      limit,
      offset,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ orders: result.data })
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    const orderData = {
      orderNumber,
      userId: body.userId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      deliveryAddress: body.deliveryAddress,
      city: body.city,
      totalAmount: Number.parseFloat(body.totalAmount),
      discountAmount: body.discountAmount ? Number.parseFloat(body.discountAmount) : 0,
      deliveryCharges: body.deliveryCharges ? Number.parseFloat(body.deliveryCharges) : 0,
      finalAmount: Number.parseFloat(body.finalAmount),
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      items: body.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        productUnit: item.productUnit,
        quantity: Number.parseInt(item.quantity),
        unitPrice: Number.parseFloat(item.unitPrice),
        totalPrice: Number.parseFloat(item.totalPrice),
      })),
    }

    const result = await createOrder(orderData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Create notification for admin
    await createNotification({
      type: "order",
      title: "New Order Received",
      message: `Order ${orderNumber} has been placed by ${body.customerName}`,
      data: {
        orderId: result.data.id,
        orderNumber,
        customer: body.customerName,
        amount: body.finalAmount,
      },
      priority: "high",
    })

    return NextResponse.json({ order: result.data }, { status: 201 })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
