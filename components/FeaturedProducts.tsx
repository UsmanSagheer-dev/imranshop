"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  category: string
  unit: string
  price: number
  image: string
  description: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock featured products - In real app, this would come from API
    const mockProducts: Product[] = [
      {
        _id: "1",
        name: "Basmati Rice",
        category: "Grocery",
        unit: "5kg",
        price: 850,
        image: "/placeholder.svg?height=200&width=200",
        description: "Premium quality basmati rice",
      },
      {
        _id: "2",
        name: "Fresh Milk",
        category: "Dairy",
        unit: "1L",
        price: 120,
        image: "/placeholder.svg?height=200&width=200",
        description: "Fresh cow milk",
      },
      {
        _id: "3",
        name: "Cooking Oil",
        category: "Grocery",
        unit: "1L",
        price: 280,
        image: "/placeholder.svg?height=200&width=200",
        description: "Pure cooking oil",
      },
      {
        _id: "4",
        name: "Wheat Flour",
        category: "Grocery",
        unit: "10kg",
        price: 1200,
        image: "/placeholder.svg?height=200&width=200",
        description: "Fine wheat flour",
      },
      {
        _id: "5",
        name: "Sugar",
        category: "Grocery",
        unit: "1kg",
        price: 110,
        image: "/placeholder.svg?height=200&width=200",
        description: "Pure white sugar",
      },
      {
        _id: "6",
        name: "Tea Bags",
        category: "Beverages",
        unit: "100pcs",
        price: 450,
        image: "/placeholder.svg?height=200&width=200",
        description: "Premium tea bags",
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Best deals on quality products</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3 mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
            asChild
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
