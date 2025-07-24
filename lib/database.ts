import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database helper functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return { success: true, data: result }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Product functions
export async function getProducts(
  filters: {
    category?: string
    search?: string
    isActive?: boolean
    limit?: number
    offset?: number
  } = {},
) {
  let query = `
    SELECT 
      p.*,
      c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `
  const params: any[] = []
  let paramIndex = 1

  if (filters.isActive !== undefined) {
    query += ` AND p.is_active = $${paramIndex}`
    params.push(filters.isActive)
    paramIndex++
  }

  if (filters.category && filters.category !== "all") {
    query += ` AND c.name = $${paramIndex}`
    params.push(filters.category)
    paramIndex++
  }

  if (filters.search) {
    query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`
    params.push(`%${filters.search}%`)
    paramIndex++
  }

  query += ` ORDER BY p.created_at DESC`

  if (filters.limit) {
    query += ` LIMIT $${paramIndex}`
    params.push(filters.limit)
    paramIndex++
  }

  if (filters.offset) {
    query += ` OFFSET $${paramIndex}`
    params.push(filters.offset)
    paramIndex++
  }

  return executeQuery(query, params)
}

export async function getProductById(id: string) {
  const query = `
    SELECT 
      p.*,
      c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `
  return executeQuery(query, [id])
}

export async function createProduct(product: {
  name: string
  description?: string
  categoryId: string
  unit: string
  price: number
  costPrice?: number
  stockQuantity: number
  lowStockAlert: number
  imageUrl?: string
  sku?: string
  isActive?: boolean
  isFeatured?: boolean
  createdBy: string
}) {
  const query = `
    INSERT INTO products (
      name, description, category_id, unit, price, cost_price, 
      stock_quantity, low_stock_alert, image_url, sku, 
      is_active, is_featured, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `
  const params = [
    product.name,
    product.description || null,
    product.categoryId,
    product.unit,
    product.price,
    product.costPrice || null,
    product.stockQuantity,
    product.lowStockAlert,
    product.imageUrl || null,
    product.sku || null,
    product.isActive ?? true,
    product.isFeatured ?? false,
    product.createdBy,
  ]
  return executeQuery(query, params)
}

export async function updateProduct(
  id: string,
  updates: Partial<{
    name: string
    description: string
    categoryId: string
    unit: string
    price: number
    costPrice: number
    stockQuantity: number
    lowStockAlert: number
    imageUrl: string
    isActive: boolean
    isFeatured: boolean
  }>,
) {
  const setClause = Object.keys(updates)
    .map((key, index) => {
      const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      return `${dbKey} = $${index + 2}`
    })
    .join(", ")

  const query = `
    UPDATE products 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `
  const params = [id, ...Object.values(updates)]
  return executeQuery(query, params)
}

export async function deleteProduct(id: string) {
  const query = `DELETE FROM products WHERE id = $1`
  return executeQuery(query, [id])
}

// Category functions
export async function getCategories(isActive?: boolean) {
  let query = `SELECT * FROM categories`
  const params: any[] = []

  if (isActive !== undefined) {
    query += ` WHERE is_active = $1`
    params.push(isActive)
  }

  query += ` ORDER BY sort_order, name`
  return executeQuery(query, params)
}

export async function createCategory(category: {
  name: string
  description?: string
  imageUrl?: string
  sortOrder?: number
}) {
  const query = `
    INSERT INTO categories (name, description, image_url, sort_order)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  const params = [category.name, category.description || null, category.imageUrl || null, category.sortOrder || 0]
  return executeQuery(query, params)
}

// Order functions
export async function getOrders(
  filters: {
    status?: string
    customerId?: string
    limit?: number
    offset?: number
  } = {},
) {
  let query = `
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `
  const params: any[] = []
  let paramIndex = 1

  if (filters.status) {
    query += ` AND o.status = $${paramIndex}`
    params.push(filters.status)
    paramIndex++
  }

  if (filters.customerId) {
    query += ` AND o.user_id = $${paramIndex}`
    params.push(filters.customerId)
    paramIndex++
  }

  query += ` ORDER BY o.created_at DESC`

  if (filters.limit) {
    query += ` LIMIT $${paramIndex}`
    params.push(filters.limit)
    paramIndex++
  }

  if (filters.offset) {
    query += ` OFFSET $${paramIndex}`
    params.push(filters.offset)
    paramIndex++
  }

  return executeQuery(query, params)
}

export async function getOrderById(id: string) {
  const orderQuery = `
    SELECT 
      o.*,
      u.name as user_name,
      u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
  `

  const itemsQuery = `
    SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at
  `

  const orderResult = await executeQuery(orderQuery, [id])
  const itemsResult = await executeQuery(itemsQuery, [id])

  if (orderResult.success && itemsResult.success) {
    return {
      success: true,
      data: {
        ...orderResult.data[0],
        items: itemsResult.data,
      },
    }
  }

  return { success: false, error: "Order not found" }
}

export async function createOrder(order: {
  orderNumber: string
  userId?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  city: string
  totalAmount: number
  discountAmount?: number
  deliveryCharges?: number
  finalAmount: number
  paymentMethod?: string
  notes?: string
  items: Array<{
    productId: string
    productName: string
    productUnit: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}) {
  // Start transaction
  const orderQuery = `
    INSERT INTO orders (
      order_number, user_id, customer_name, customer_phone, customer_email,
      delivery_address, city, total_amount, discount_amount, delivery_charges,
      final_amount, payment_method, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `

  const orderParams = [
    order.orderNumber,
    order.userId || null,
    order.customerName,
    order.customerPhone,
    order.customerEmail || null,
    order.deliveryAddress,
    order.city,
    order.totalAmount,
    order.discountAmount || 0,
    order.deliveryCharges || 0,
    order.finalAmount,
    order.paymentMethod || null,
    order.notes || null,
  ]

  const orderResult = await executeQuery(orderQuery, orderParams)

  if (!orderResult.success) {
    return orderResult
  }

  const orderId = orderResult.data[0].id

  // Insert order items
  for (const item of order.items) {
    const itemQuery = `
      INSERT INTO order_items (
        order_id, product_id, product_name, product_unit,
        quantity, unit_price, total_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    const itemParams = [
      orderId,
      item.productId,
      item.productName,
      item.productUnit,
      item.quantity,
      item.unitPrice,
      item.totalPrice,
    ]

    await executeQuery(itemQuery, itemParams)

    // Update product stock
    const stockQuery = `
      UPDATE products 
      SET stock_quantity = stock_quantity - $1
      WHERE id = $2
    `
    await executeQuery(stockQuery, [item.quantity, item.productId])
  }

  return { success: true, data: orderResult.data[0] }
}

export async function updateOrderStatus(id: string, status: string) {
  const query = `
    UPDATE orders 
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `
  return executeQuery(query, [status, id])
}

// Notification functions
export async function getNotifications(
  filters: {
    isRead?: boolean
    type?: string
    limit?: number
  } = {},
) {
  let query = `SELECT * FROM notifications WHERE 1=1`
  const params: any[] = []
  let paramIndex = 1

  if (filters.isRead !== undefined) {
    query += ` AND is_read = $${paramIndex}`
    params.push(filters.isRead)
    paramIndex++
  }

  if (filters.type) {
    query += ` AND type = $${paramIndex}`
    params.push(filters.type)
    paramIndex++
  }

  query += ` ORDER BY created_at DESC`

  if (filters.limit) {
    query += ` LIMIT $${paramIndex}`
    params.push(filters.limit)
    paramIndex++
  }

  return executeQuery(query, params)
}

export async function createNotification(notification: {
  type: string
  title: string
  message: string
  data?: any
  recipientType?: string
  recipientId?: string
  priority?: string
}) {
  const query = `
    INSERT INTO notifications (
      type, title, message, data, recipient_type, recipient_id, priority
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `
  const params = [
    notification.type,
    notification.title,
    notification.message,
    notification.data ? JSON.stringify(notification.data) : null,
    notification.recipientType || "admin",
    notification.recipientId || null,
    notification.priority || "normal",
  ]
  return executeQuery(query, params)
}

export async function markNotificationAsRead(id: string) {
  const query = `
    UPDATE notifications 
    SET is_read = true, read_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `
  return executeQuery(query, [id])
}

// Message functions
export async function getConversations() {
  const query = `
    SELECT * FROM conversations 
    ORDER BY last_message_at DESC
  `
  return executeQuery(query)
}

export async function getMessages(conversationId: string) {
  const query = `
    SELECT * FROM messages 
    WHERE conversation_id = $1 
    ORDER BY created_at ASC
  `
  return executeQuery(query, [conversationId])
}

export async function createMessage(message: {
  conversationId: string
  senderType: string
  senderId?: string
  senderName: string
  message: string
  messageType?: string
}) {
  const query = `
    INSERT INTO messages (
      conversation_id, sender_type, sender_id, sender_name, message, message_type
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `
  const params = [
    message.conversationId,
    message.senderType,
    message.senderId || null,
    message.senderName,
    message.message,
    message.messageType || "text",
  ]

  const result = await executeQuery(query, params)

  if (result.success) {
    // Update conversation
    const updateQuery = `
      UPDATE conversations 
      SET last_message = $1, last_message_at = CURRENT_TIMESTAMP,
          unread_count = CASE WHEN $2 = 'customer' THEN unread_count + 1 ELSE unread_count END
      WHERE id = $3
    `
    await executeQuery(updateQuery, [message.message, message.senderType, message.conversationId])
  }

  return result
}

// Analytics functions
export async function getSalesAnalytics(days = 7) {
  const query = `
    SELECT * FROM sales_analytics 
    WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
    ORDER BY date ASC
  `
  return executeQuery(query)
}

export async function updateSalesAnalytics(
  date: string,
  data: {
    totalOrders: number
    totalSales: number
    totalCustomers: number
    avgOrderValue: number
  },
) {
  const query = `
    INSERT INTO sales_analytics (date, total_orders, total_sales, total_customers, avg_order_value)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (date) 
    DO UPDATE SET 
      total_orders = EXCLUDED.total_orders,
      total_sales = EXCLUDED.total_sales,
      total_customers = EXCLUDED.total_customers,
      avg_order_value = EXCLUDED.avg_order_value
    RETURNING *
  `
  const params = [date, data.totalOrders, data.totalSales, data.totalCustomers, data.avgOrderValue]
  return executeQuery(query, params)
}
