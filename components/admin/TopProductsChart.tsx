"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, TrendingUp, Package } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  stock: number
  sold: number
  price: number
  lowStockAlert: number
}

interface TopProductsChartProps {
  products: Product[]
}

export default function TopProductsChart({ products }: TopProductsChartProps) {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <PieChart className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No sales data available</p>
            <p className="text-sm">Top selling products will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort products by sold quantity and revenue
  const topBySold = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5)

  const topByRevenue = [...products].sort((a, b) => b.sold * b.price - a.sold * a.price).slice(0, 5)

  const maxSold = topBySold.length > 0 ? Math.max(...topBySold.map((p) => p.sold)) : 1
  const maxRevenue = topByRevenue.length > 0 ? Math.max(...topByRevenue.map((p) => p.sold * p.price)) : 1

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top by Quantity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Top by Quantity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topBySold.map((product, index) => (
              <div key={product._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{product.sold} sold</span>
                </div>
                <Progress value={(product.sold / maxSold) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top by Revenue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top by Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topByRevenue.map((product, index) => {
              const revenue = product.sold * product.price
              return (
                <div key={product._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">Rs. {revenue.toLocaleString()}</span>
                  </div>
                  <Progress value={(revenue / maxRevenue) * 100} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
