import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const search = searchParams.get("search") || undefined
    const isActive = searchParams.get("active") === "true" ? true : undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined

    const result = await getProducts({
      category,
      search,
      isActive,
      limit,
      offset,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ products: result.data })
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get admin ID (in a real app, this would come from authentication)
    const adminId = "00000000-0000-0000-0000-000000000001" // Default admin ID

    const productData = {
      name: body.name,
      description: body.description,
      categoryId: body.categoryId,
      unit: body.unit,
      price: Number.parseFloat(body.price),
      costPrice: body.costPrice ? Number.parseFloat(body.costPrice) : undefined,
      stockQuantity: Number.parseInt(body.stockQuantity),
      lowStockAlert: Number.parseInt(body.lowStockAlert),
      imageUrl: body.imageUrl,
      sku: body.sku,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      createdBy: adminId,
    }

    const result = await createProduct(productData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ product: result.data[0] }, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
