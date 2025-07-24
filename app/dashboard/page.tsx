"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, LogOut, Phone, Mail, MapPin, Calendar, Award } from "lucide-react"

interface DashboardUser {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  createdAt: string
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  final_amount: number
  status: string
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

interface Loyalty {
  points_earned: number
  points_used: number
  points_balance: number
  total_orders: number
  total_spent: number
  membership_level: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loyalty, setLoyalty] = useState<Loyalty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Fetch user info
      const userResponse = await fetch("/api/auth/me")
      const userData = await userResponse.json()

      if (!userData.success) {
        router.push("/auth/login")
        return
      }

      setUser(userData.user)

      // Fetch orders
      const ordersResponse = await fetch("/api/user/orders")
      const ordersData = await ordersResponse.json()

      if (ordersData.success) {
        setOrders(ordersData.orders)
      }

      // Fetch loyalty data
      const loyaltyResponse = await fetch("/api/user/loyalty")
      const loyaltyData = await loyaltyResponse.json()

      if (loyaltyData.success) {
        setLoyalty(loyaltyData.loyalty)
      }
    } catch (error) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Bronze":
        return "bg-amber-100 text-amber-800"
      case "Silver":
        return "bg-gray-100 text-gray-800"
      case "Gold":
        return "bg-yellow-100 text-yellow-800"
      case "Platinum":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Manage your account and orders</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {user.address}, {user.city}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Member since {new Date(user?.createdAt || "").toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Card */}
            {loyalty && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Loyalty Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Membership Level:</span>
                    <Badge className={getMembershipColor(loyalty.membership_level)}>{loyalty.membership_level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Points Balance:</span>
                    <span className="font-bold text-green-600">{loyalty.points_balance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Orders:</span>
                    <span>{loyalty.total_orders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Spent:</span>
                    <span>Rs. {loyalty.total_spent?.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Your order history and current status</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                    <div className="mt-6">
                      <Button onClick={() => router.push("/products")}>Browse Products</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">Order #{order.order_number}</h4>
                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <p className="text-sm font-medium mt-1">Rs. {order.final_amount?.toLocaleString()}</p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.product_name} x {item.quantity}
                              </span>
                              <span>Rs. {item.total_price?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
