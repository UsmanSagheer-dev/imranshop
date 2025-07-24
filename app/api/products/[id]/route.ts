import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct, getCategories } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getProductById(params.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    if (result.data.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product: result.data[0] })
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updates: any = {}

    if (body.name) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.unit) updates.unit = body.unit
    if (body.price !== undefined) updates.price = Number.parseFloat(body.price)
    if (body.costPrice !== undefined) updates.costPrice = Number.parseFloat(body.costPrice)
    if (body.stock !== undefined) updates.stockQuantity = Number.parseInt(body.stock)
    if (body.lowStockAlert !== undefined) updates.lowStockAlert = Number.parseInt(body.lowStockAlert)
    if (body.image !== undefined) updates.imageUrl = body.image
    if (body.isActive !== undefined) updates.isActive = body.isActive
    if (body.isFeatured !== undefined) updates.isFeatured = body.isFeatured

    if (body.category) {
      // Get category ID by name
      const categoriesResult = await getCategories(true)
      if (categoriesResult.success) {
        const category = categoriesResult.data.find((c: any) => c.name === body.category)
        if (category) {
          updates.categoryId = category.id
        }
      }
    }

    const result = await updateProduct(params.id, updates)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    if (result.data.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product: result.data[0] })
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteProduct(params.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
