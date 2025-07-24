"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Star,
  Gift,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  Truck,
  LogOut,
} from "lucide-react"

interface DashboardUser {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  date_of_birth?: string
  created_at: string
}

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  final_amount: number
  created_at: string
  item_count: number
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

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Fetch current user
      const userResponse = await fetch("/api/auth/me")
      if (!userResponse.ok) {
        router.push("/auth/login?redirect=/dashboard")
        return
      }
      const userData = await userResponse.json()
      setUser(userData.user)

      // Fetch user orders
      const ordersResponse = await fetch("/api/user/orders")
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.orders)
      }

      // Fetch loyalty data
      const loyaltyResponse = await fetch("/api/user/loyalty")
      if (loyaltyResponse.ok) {
        const loyaltyData = await loyaltyResponse.json()
        setLoyalty(loyaltyData.loyalty)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      router.push("/auth/login?redirect=/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getMembershipColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "platinum":
        return "bg-gray-800 text-white"
      case "gold":
        return "bg-yellow-500 text-white"
      case "silver":
        return "bg-gray-400 text-white"
      default:
        return "bg-orange-600 text-white"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Manage your account and track your orders</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{loyalty?.total_orders || 0}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Gift className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{loyalty?.points_balance || 0}</p>
                  <p className="text-sm text-gray-600">Loyalty Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <Badge className={getMembershipColor(loyalty?.membership_level || "Bronze")}>
                    {loyalty?.membership_level || "Bronze"}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Membership</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">Rs. {loyalty?.total_spent?.toLocaleString() || 0}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-600">Email Address</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{user.phone}</p>
                        <p className="text-sm text-gray-600">Phone Number</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{user.address}</p>
                        <p className="text-sm text-gray-600">Address</p>
                      </div>
                    </div>
                  )}

                  {user.date_of_birth && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{new Date(user.date_of_birth).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Member Since</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex space-x-4">
                  <Button className="bg-green-600 hover:bg-green-700">Edit Profile</Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Order History</span>
                </CardTitle>
                <CardDescription>Track your past and current orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                    <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => router.push("/products")}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium">Order #{order.order_number}</p>
                              <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Items</p>
                              <p className="font-medium">{order.item_count} items</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Amount</p>
                              <p className="font-medium">Rs. {order.final_amount}</p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.id}`)}>
                                View Details
                              </Button>
                            </div>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm font-medium mb-2">Items:</p>
                              <div className="space-y-1">
                                {order.items.slice(0, 3).map((item, index) => (
                                  <p key={index} className="text-sm text-gray-600">
                                    {item.product_name} × {item.quantity} = Rs. {item.total_price}
                                  </p>
                                ))}
                                {order.items.length > 3 && (
                                  <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="h-5 w-5" />
                    <span>Loyalty Points</span>
                  </CardTitle>
                  <CardDescription>Earn points with every purchase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{loyalty?.points_balance || 0}</p>
                    <p className="text-gray-600">Available Points</p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Points Earned</span>
                      <span className="font-medium">{loyalty?.points_earned || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Points Used</span>
                      <span className="font-medium">{loyalty?.points_used || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Membership Status</span>
                  </CardTitle>
                  <CardDescription>Your current membership level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Badge className={`text-lg px-4 py-2 ${getMembershipColor(loyalty?.membership_level || "Bronze")}`}>
                      {loyalty?.membership_level || "Bronze"} Member
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-medium">{loyalty?.total_orders || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-medium">Rs. {loyalty?.total_spent?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      View Benefits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
