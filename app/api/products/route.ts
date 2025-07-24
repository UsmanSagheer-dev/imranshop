import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct, getCategories } from "@/lib/database"

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

    // Get category ID by name
    const categoriesResult = await getCategories(true)
    if (!categoriesResult.success) {
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    const category = categoriesResult.data.find((c: any) => c.name === body.category)
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const productData = {
      name: body.name,
      description: body.description,
      categoryId: category.id,
      unit: body.unit,
      price: Number.parseFloat(body.price),
      costPrice: body.costPrice ? Number.parseFloat(body.costPrice) : undefined,
      stockQuantity: Number.parseInt(body.stock),
      lowStockAlert: Number.parseInt(body.lowStockAlert),
      imageUrl: body.image,
      sku: body.sku,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      createdBy: "admin-id", // In real app, get from auth
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
