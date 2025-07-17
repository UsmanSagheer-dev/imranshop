"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  unit: string
  price: number
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const addToCart = () => {
    setIsAdding(true)

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart")
    const cart = existingCart ? JSON.parse(existingCart) : []

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item._id === product._id)

    if (existingItemIndex > -1) {
      // If exists, increment quantity
      cart[existingItemIndex].quantity += 1
    } else {
      // If doesn't exist, add new item
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        unit: product.unit,
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-48 object-cover rounded-md"
          />
          <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">{product.category}</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.unit}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-green-600">Rs. {product.price}</span>
            <Button onClick={addToCart} disabled={isAdding} className="bg-green-600 hover:bg-green-700" size="sm">
              {isAdding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
