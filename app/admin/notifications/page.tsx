"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  ShoppingCart,
  Package,
  CheckCircle,
  MessageCircle,
  Eye,
  Trash2,
  BookMarkedIcon as MarkAsUnread,
} from "lucide-react"

interface Notification {
  id: string
  type: "order" | "stock" | "message" | "system"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }

    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "order",
        title: "New Order Received",
        message: "Ali Ahmed placed an order worth Rs. 1,250",
        isRead: false,
        createdAt: new Date().toISOString(),
        data: { orderId: "ORD001", customerName: "Ali Ahmed", amount: 1250 },
      },
      {
        id: "2",
        type: "message",
        title: "New Customer Message",
        message: "Fatima Khan sent: 'Is fresh milk available?'",
        isRead: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        data: { customerId: "CUST002", customerName: "Fatima Khan" },
      },
      {
        id: "3",
        type: "stock",
        title: "Low Stock Alert",
        message: "Fresh Milk 1L is running low (8 units left)",
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        data: { productId: "PROD002", productName: "Fresh Milk 1L", stock: 8 },
      },
      {
        id: "4",
        type: "order",
        title: "Order Delivered",
        message: "Order #ORD003 has been delivered to Hassan Ali",
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        data: { orderId: "ORD003", customerName: "Hassan Ali" },
      },
      {
        id: "5",
        type: "system",
        title: "Daily Backup Complete",
        message: "System backup completed successfully at 2:00 AM",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [router])

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const orderNotifications = notifications.filter((n) => n.type === "order")
  const stockNotifications = notifications.filter((n) => n.type === "stock")
  const messageNotifications = notifications.filter((n) => n.type === "message")

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAsUnread = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-600" />
      case "stock":
        return <Package className="h-5 w-5 text-orange-600" />
      case "message":
        return <MessageCircle className="h-5 w-5 text-green-600" />
      case "system":
        return <CheckCircle className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBg = (type: string, isRead: boolean) => {
    const opacity = isRead ? "50" : "100"
    switch (type) {
      case "order":
        return `bg-blue-${opacity} border-blue-200`
      case "stock":
        return `bg-orange-${opacity} border-orange-200`
      case "message":
        return `bg-green-${opacity} border-green-200`
      case "system":
        return `bg-purple-${opacity} border-purple-200`
      default:
        return `bg-gray-${opacity} border-gray-200`
    }
  }

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`${notification.isRead ? "opacity-60" : ""} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBg(notification.type, notification.isRead)}`}
            >
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                {!notification.isRead && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
              </div>
              <p className="text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {notification.isRead ? (
              <Button variant="ghost" size="sm" onClick={() => markAsUnread(notification.id)} className="h-8 w-8 p-0">
                <MarkAsUnread className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNotification(notification.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="h-8 w-8 mr-3" />
              Notifications
              {unreadCount > 0 && <Badge className="ml-3 bg-red-500 text-white">{unreadCount} new</Badge>}
            </h1>
            <p className="text-gray-600">Stay updated with your store activities</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} className="mt-4 md:mt-0">
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{orderNotifications.length}</p>
              <p className="text-sm text-gray-600">Order Notifications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{stockNotifications.length}</p>
              <p className="text-sm text-gray-600">Stock Alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{messageNotifications.length}</p>
              <p className="text-sm text-gray-600">Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Bell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{unreadCount}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orderNotifications.length})</TabsTrigger>
            <TabsTrigger value="stock">Stock ({stockNotifications.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messageNotifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <div className="space-y-4">
              {orderNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <div className="space-y-4">
              {stockNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <div className="space-y-4">
              {messageNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <div className="space-y-4">
              {notifications
                .filter((n) => !n.isRead)
                .map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
