"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Phone, Clock, CheckCheck, Search } from "lucide-react"

interface Message {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  message: string
  isFromCustomer: boolean
  timestamp: string
  isRead: boolean
}

interface Customer {
  id: string
  name: string
  phone: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }

    // Mock data
    const mockCustomers: Customer[] = [
      {
        id: "1",
        name: "Ali Ahmed",
        phone: "03001234567",
        lastMessage: "Is basmati rice available?",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
      },
      {
        id: "2",
        name: "Fatima Khan",
        phone: "03009876543",
        lastMessage: "Thank you for the quick delivery!",
        lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
        unreadCount: 0,
      },
      {
        id: "3",
        name: "Hassan Ali",
        phone: "03005555555",
        lastMessage: "When will fresh milk be available?",
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 1,
      },
    ]

    const mockMessages: Message[] = [
      {
        id: "1",
        customerId: "1",
        customerName: "Ali Ahmed",
        customerPhone: "03001234567",
        message: "Assalam o Alaikum, is basmati rice available?",
        isFromCustomer: true,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        isRead: false,
      },
      {
        id: "2",
        customerId: "1",
        customerName: "Ali Ahmed",
        customerPhone: "03001234567",
        message: "Walaikum Assalam! Yes, we have premium basmati rice 5kg for Rs. 850. Would you like to order?",
        isFromCustomer: false,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isRead: true,
      },
      {
        id: "3",
        customerId: "1",
        customerName: "Ali Ahmed",
        customerPhone: "03001234567",
        message: "Yes please, I need 2 bags. Can you deliver today?",
        isFromCustomer: true,
        timestamp: new Date().toISOString(),
        isRead: false,
      },
    ]

    setTimeout(() => {
      setCustomers(mockCustomers)
      setMessages(mockMessages)
      setLoading(false)
    }, 1000)
  }, [router])

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const customerMessages = messages.filter((msg) => (selectedCustomer ? msg.customerId === selectedCustomer.id : false))

  const totalUnread = customers.reduce((sum, customer) => sum + customer.unreadCount, 0)

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCustomer) return

    const message: Message = {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      message: newMessage,
      isFromCustomer: false,
      timestamp: new Date().toISOString(),
      isRead: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Update customer's last message
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
          : customer,
      ),
    )
  }

  const markAsRead = (customerId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.customerId === customerId ? { ...msg, isRead: true } : msg)))
    setCustomers((prev) =>
      prev.map((customer) => (customer.id === customerId ? { ...customer, unreadCount: 0 } : customer)),
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-8 w-8 mr-3" />
              Customer Messages
              {totalUnread > 0 && <Badge className="ml-3 bg-red-500 text-white">{totalUnread} unread</Badge>}
            </h1>
            <p className="text-gray-600">Chat with your customers in real-time</p>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Customers List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Customers</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[450px] overflow-y-auto">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => {
                          setSelectedCustomer(customer)
                          markAsRead(customer.id)
                        }}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                          selectedCustomer?.id === customer.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-green-100 text-green-800">
                              {customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
                              {customer.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">{customer.unreadCount}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">{customer.lastMessage}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-400">{customer.phone}</p>
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-400">
                                {new Date(customer.lastMessageTime).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedCustomer ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {selectedCustomer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedCustomer.name}</h3>
                      <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {customerMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromCustomer ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromCustomer ? "bg-gray-100 text-gray-900" : "bg-green-600 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <p className={`text-xs ${message.isFromCustomer ? "text-gray-500" : "text-green-100"}`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                            {!message.isFromCustomer && <CheckCheck className="h-3 w-3 text-green-100" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[40px] max-h-[100px]"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a customer to start chatting</p>
                  <p className="text-sm">Choose a customer from the list to view and send messages</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
