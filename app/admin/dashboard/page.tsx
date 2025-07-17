"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Eye,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import SalesChart from "@/components/admin/SalesChart"
import InventoryChart from "@/components/admin/InventoryChart"
import TopProductsChart from "@/components/admin/TopProductsChart"
import RecentActivity from "@/components/admin/RecentActivity"

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

interface SalesData {
  date: string
  sales: number
  orders: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }

    // Mock data - In real app, this would come from API
    const mockOrders: Order[] = [
      {
        _id: "1",
        customerName: "Ali Ahmed",
        phone: "03001234567",
        total: 1250,
        status: "pending",
        createdAt: new Date().toISOString(),
        items: [
          { name: "Basmati Rice 5kg", quantity: 1, price: 850 },
          { name: "Cooking Oil 1L", quantity: 1, price: 280 },
          { name: "Fresh Milk 1L", quantity: 2, price: 120 },
        ],
      },
      {
        _id: "2",
        customerName: "Fatima Khan",
        phone: "03009876543",
        total: 2400,
        status: "confirmed",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        items: [{ name: "Wheat Flour 10kg", quantity: 2, price: 1200 }],
      },
      {
        _id: "3",
        customerName: "Hassan Ali",
        phone: "03005555555",
        total: 450,
        status: "delivered",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        items: [{ name: "Tea Bags 100pcs", quantity: 1, price: 450 }],
      },
      {
        _id: "4",
        customerName: "Sara Khan",
        phone: "03001111111",
        total: 680,
        status: "delivered",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        items: [
          { name: "Sugar 1kg", quantity: 2, price: 110 },
          { name: "Cooking Oil 1L", quantity: 1, price: 280 },
          { name: "Bread", quantity: 3, price: 80 },
        ],
      },
    ]

    const mockProducts: Product[] = [
      { _id: "1", name: "Basmati Rice 5kg", category: "Grocery", stock: 45, sold: 25, price: 850, lowStockAlert: 10 },
      { _id: "2", name: "Fresh Milk 1L", category: "Dairy", stock: 8, sold: 42, price: 120, lowStockAlert: 15 },
      { _id: "3", name: "Cooking Oil 1L", category: "Grocery", stock: 22, sold: 18, price: 280, lowStockAlert: 10 },
      { _id: "4", name: "Coca Cola 1.5L", category: "Beverages", stock: 35, sold: 15, price: 150, lowStockAlert: 20 },
      { _id: "5", name: "Lays Chips 50g", category: "Snacks", stock: 60, sold: 40, price: 50, lowStockAlert: 25 },
      { _id: "6", name: "Bread", category: "Bakery", stock: 5, sold: 35, price: 80, lowStockAlert: 10 },
      { _id: "7", name: "Sugar 1kg", category: "Grocery", stock: 30, sold: 20, price: 110, lowStockAlert: 15 },
      { _id: "8", name: "Tea Bags 100pcs", category: "Beverages", stock: 18, sold: 12, price: 450, lowStockAlert: 10 },
    ]

    const mockSalesData: SalesData[] = [
      { date: "2024-01-15", sales: 12500, orders: 15 },
      { date: "2024-01-16", sales: 18200, orders: 22 },
      { date: "2024-01-17", sales: 15800, orders: 19 },
      { date: "2024-01-18", sales: 22100, orders: 28 },
      { date: "2024-01-19", sales: 19500, orders: 24 },
      { date: "2024-01-20", sales: 25300, orders: 31 },
      { date: "2024-01-21", sales: 21800, orders: 26 },
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setProducts(mockProducts)
      setSalesData(mockSalesData)
      setLoading(false)
    }, 1000)
  }, [router])

  // Calculate statistics
  const todayOrders = orders.filter((order) => {
    const today = new Date().toDateString()
    const orderDate = new Date(order.createdAt).toDateString()
    return today === orderDate
  })

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((order) => order.status === "pending").length
  const lowStockProducts = products.filter((product) => product.stock <= product.lowStockAlert)
  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const totalSold = products.reduce((sum, product) => sum + product.sold, 0)

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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your store overview.</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button onClick={() => router.push("/admin/products")} className="bg-green-600 hover:bg-green-700">
              <Package className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
            <Button onClick={() => router.push("/admin/offers")} variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Manage Offers
            </Button>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Today's Orders</p>
                  <p className="text-3xl font-bold">{todayOrders.length}</p>
                  <p className="text-blue-100 text-xs">+12% from yesterday</p>
                </div>
                <ShoppingCart className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Sales</p>
                  <p className="text-3xl font-bold">Rs. {totalSales.toLocaleString()}</p>
                  <p className="text-green-100 text-xs">+8% from last week</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold">{pendingOrders}</p>
                  <p className="text-yellow-100 text-xs">Needs attention</p>
                </div>
                <Clock className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Low Stock Items</p>
                  <p className="text-3xl font-bold">{lowStockProducts.length}</p>
                  <p className="text-purple-100 text-xs">Restock needed</p>
                </div>
                <AlertTriangle className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Inventory Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="font-bold">{totalProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Stock</span>
                <span className="font-bold text-green-600">{totalStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sold</span>
                <span className="font-bold text-blue-600">{totalSold}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Level</span>
                  <span>{Math.round((totalStock / (totalStock + totalSold)) * 100)}%</span>
                </div>
                <Progress value={(totalStock / (totalStock + totalSold)) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Sales Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-bold text-green-600">Rs. {(totalSales * 0.7).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-bold text-blue-600">Rs. {totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order</span>
                <span className="font-bold">Rs. {Math.round(totalSales / orders.length)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Target</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="font-bold">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-bold text-green-600">
                  {orders.filter((o) => o.status === "delivered").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-bold text-blue-600">
                  {Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100)}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <PieChart className="h-4 w-4 mr-2" />
              Top Products
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <SalesChart data={salesData} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryChart products={products} />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <TopProductsChart products={products} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <RecentActivity orders={orders} products={products} />
          </TabsContent>
        </Tabs>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.map((product) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                    </div>
                    <Badge variant="destructive">Low Stock</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={() => router.push("/admin/products")} className="bg-red-600 hover:bg-red-700">
                  Restock Products
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" onClick={() => router.push("/admin/orders")}>
              View All Orders
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">Rs. {order.total}</p>
                      <Badge className={`${getStatusColor(order.status)} mt-1`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
