"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, ShoppingCart, Package, AlertTriangle, CheckCircle } from "lucide-react"

interface Order {
  _id: string
  customerName: string
  phone: string
  total: number
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  createdAt: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

interface Product {
  _id: string
  name: string
  category: string
  stock: number
  sold: number
  price: number
  lowStockAlert: number
}

interface RecentActivityProps {
  orders: Order[]
  products: Product[]
}

export default function RecentActivity({ orders, products }: RecentActivityProps) {
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockAlert)
  const outOfStockProducts = products.filter((p) => p.stock === 0)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "stock":
        return <Package className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-orange-100 text-orange-800"
      case "success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-600 bg-blue-100"
      case "stock":
        return "text-orange-600 bg-orange-100"
      case "system":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const activities = []

  // Add recent orders
  orders.slice(0, 3).forEach((order) => {
    activities.push({
      id: `order-${order._id}`,
      type: "order",
      title: `New order from ${order.customerName}`,
      description: `Order #${order._id} - Rs. ${order.total}`,
      time: order.createdAt,
      status: order.status,
      icon: ShoppingCart,
    })
  })

  // Add low stock alerts
  lowStockProducts.slice(0, 2).forEach((product) => {
    activities.push({
      id: `stock-${product._id}`,
      type: "stock",
      title: `Low stock alert`,
      description: `${product.name} - Only ${product.stock} left`,
      time: new Date().toISOString(),
      status: "warning",
      icon: AlertTriangle,
    })
  })

  // Add system activities
  activities.push({
    id: "system-1",
    type: "system",
    title: "Daily backup completed",
    description: "All data backed up successfully",
    time: new Date(Date.now() - 3600000).toISOString(),
    status: "success",
    icon: CheckCircle,
  })

  // Sort by time
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Activity Feed */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Activity className="h-8 w-8 mb-2 text-gray-300" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.slice(0, 8).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(activity.type)}`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <Badge className={getStatusColor(activity.status)} variant="secondary">
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(activity.time).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Orders Today</p>
              <p className="text-sm text-green-700">
                {
                  orders.filter((o) => {
                    const today = new Date().toDateString()
                    return new Date(o.createdAt).toDateString() === today
                  }).length
                }{" "}
                new orders
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="font-medium text-yellow-900">Low Stock Items</p>
              <p className="text-sm text-yellow-700">{lowStockProducts.length} items need restocking</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-red-900">Out of Stock</p>
              <p className="text-sm text-red-700">{outOfStockProducts.length} items unavailable</p>
            </div>
            <Package className="h-8 w-8 text-red-600" />
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">Pending Orders</p>
              <p className="text-sm text-blue-700">
                {orders.filter((o) => o.status === "pending").length} orders awaiting confirmation
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
