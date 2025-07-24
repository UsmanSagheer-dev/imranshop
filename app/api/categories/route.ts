import { type NextRequest, NextResponse } from "next/server"
import { getCategories, createCategory } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("active") === "true" ? true : undefined

    const result = await getCategories(isActive)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ categories: result.data })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const categoryData = {
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl,
      sortOrder: body.sortOrder || 0,
    }

    const result = await createCategory(categoryData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ category: result.data[0] }, { status: 201 })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
