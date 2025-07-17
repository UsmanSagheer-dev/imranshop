"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, Home, Bell, MessageCircle, Gift } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Notifications", href: "/admin/notifications", icon: Bell, badge: 3 },
    { name: "Messages", href: "/admin/messages", icon: MessageCircle, badge: 2 },
    { name: "Offers", href: "/admin/offers", icon: Gift },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4 py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
              </Link>
            ))}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
              <Home className="h-4 w-4 mr-2" />
              View Store
            </Button>
            <Button variant="outline" className="w-full mt-2 bg-transparent" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Admin</span>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                    {item.badge && <Badge className="bg-red-500 text-white text-xs">{item.badge}</Badge>}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    router.push("/")
                  }}
                >
                  <Home className="h-4 w-4 mr-2" />
                  View Store
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
