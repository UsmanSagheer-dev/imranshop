"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, CheckCircle } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  stock: number
  sold: number
  price: number
  lowStockAlert: number
}

interface InventoryChartProps {
  products: Product[]
}

export default function InventoryChart({ products }: InventoryChartProps) {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventory Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No products in inventory</p>
            <p className="text-sm">Add products to see inventory analytics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const totalSold = products.reduce((sum, product) => sum + product.sold, 0)
  const lowStockProducts = products.filter((product) => product.stock <= product.lowStockAlert)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalStock}</p>
            <p className="text-sm text-gray-500">In Stock</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{totalSold}</p>
            <p className="text-sm text-gray-500">Sold</p>
          </div>
        </div>

        <div className="space-y-4">
          {products.slice(0, 8).map((product) => {
            const total = product.stock + product.sold
            const stockPercentage = total > 0 ? (product.stock / total) * 100 : 0
            const isLowStock = product.stock <= product.lowStockAlert

            return (
              <div key={product._id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    {isLowStock ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock}/{total}
                  </span>
                </div>
                <Progress value={stockPercentage} className={`h-2 ${isLowStock ? "bg-red-100" : "bg-gray-200"}`} />
              </div>
            )
          })}
        </div>

        {lowStockProducts.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Low Stock Alert</span>
            </div>
            <p className="text-sm text-red-700">{lowStockProducts.length} products need restocking</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
