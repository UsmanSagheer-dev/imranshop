"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react"

interface SalesData {
  date: string
  sales: number
  orders: number
}

interface SalesChartProps {
  data: SalesData[]
}

export default function SalesChart({ data }: SalesChartProps) {
  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Sales Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BarChart3 className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No sales data available</p>
            <p className="text-sm">Sales analytics will appear here once you have orders</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safe calculations with initial values
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0)
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0
  const maxSales = data.length > 0 ? Math.max(...data.map((d) => d.sales)) : 0

  // Calculate growth (compare last two days if available)
  const growth =
    data.length >= 2
      ? ((data[data.length - 1].sales - data[data.length - 2].sales) / data[data.length - 2].sales) * 100
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Sales Analytics
          </div>
          <div className="flex items-center text-sm">
            {growth >= 0 ? (
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />+{growth.toFixed(1)}%
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                {growth.toFixed(1)}%
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">Rs. {totalSales.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">Rs. {avgOrderValue}</p>
            <p className="text-sm text-gray-500">Avg Order</p>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600">
                {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${maxSales > 0 ? (item.sales / maxSales) * 100 : 0}%` }}
                    >
                      <span className="text-white text-xs font-medium">Rs. {item.sales.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">{item.orders} orders</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
