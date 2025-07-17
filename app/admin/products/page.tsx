"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Package, Plus, Edit, Trash2, Search, AlertTriangle, CheckCircle, Eye, TrendingUp } from "lucide-react"
import Image from "next/image"

interface Product {
  _id: string
  name: string
  category: string
  unit: string
  price: number
  stock: number
  sold: number
  lowStockAlert: number
  image: string
  description: string
  isActive: boolean
  createdAt: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    price: "",
    stock: "",
    lowStockAlert: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }

    // Mock products data
    const mockProducts: Product[] = [
      {
        _id: "1",
        name: "Basmati Rice",
        category: "Grocery",
        unit: "5kg",
        price: 850,
        stock: 45,
        sold: 25,
        lowStockAlert: 10,
        image: "/placeholder.svg?height=200&width=200",
        description: "Premium quality basmati rice",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Fresh Milk",
        category: "Dairy",
        unit: "1L",
        price: 120,
        stock: 8,
        sold: 42,
        lowStockAlert: 15,
        image: "/placeholder.svg?height=200&width=200",
        description: "Fresh cow milk",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        name: "Cooking Oil",
        category: "Grocery",
        unit: "1L",
        price: 280,
        stock: 22,
        sold: 18,
        lowStockAlert: 10,
        image: "/placeholder.svg?height=200&width=200",
        description: "Pure cooking oil",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "4",
        name: "Coca Cola",
        category: "Beverages",
        unit: "1.5L",
        price: 150,
        stock: 35,
        sold: 15,
        lowStockAlert: 20,
        image: "/placeholder.svg?height=200&width=200",
        description: "Refreshing cola drink",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "5",
        name: "Lays Chips",
        category: "Snacks",
        unit: "50g",
        price: 50,
        stock: 60,
        sold: 40,
        lowStockAlert: 25,
        image: "/placeholder.svg?height=200&width=200",
        description: "Crispy potato chips",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "6",
        name: "Bread",
        category: "Bakery",
        unit: "1 loaf",
        price: 80,
        stock: 5,
        sold: 35,
        lowStockAlert: 10,
        image: "/placeholder.svg?height=200&width=200",
        description: "Fresh white bread",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [router])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, products])

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockAlert)
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData: Product = {
      _id: editingProduct?._id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sold: editingProduct?.sold || 0,
      lowStockAlert: Number(formData.lowStockAlert),
      image: formData.image || "/placeholder.svg?height=200&width=200",
      description: formData.description,
      isActive: true,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    }

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? productData : p)))
    } else {
      setProducts((prev) => [...prev, productData])
    }

    // Reset form
    setFormData({
      name: "",
      category: "",
      unit: "",
      price: "",
      stock: "",
      lowStockAlert: "",
      description: "",
      image: "",
    })
    setEditingProduct(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      unit: product.unit,
      price: product.price.toString(),
      stock: product.stock.toString(),
      lowStockAlert: product.lowStockAlert.toString(),
      description: product.description,
      image: product.image,
    })
    setEditingProduct(product)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p._id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your store inventory and products</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    /* undefined tells Radix that no option is selected yet,
                       avoiding the empty-string error */
                    value={formData.category || undefined}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Dairy">Dairy</SelectItem>
                      <SelectItem value="Beverages">Beverages</SelectItem>
                      <SelectItem value="Snacks">Snacks</SelectItem>
                      <SelectItem value="Bakery">Bakery</SelectItem>
                      <SelectItem value="Personal Care">Personal Care</SelectItem>
                      <SelectItem value="Household">Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., 1kg, 500ml"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (Rs.)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                    <Input
                      id="lowStockAlert"
                      type="number"
                      value={formData.lowStockAlert}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lowStockAlert: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      setEditingProduct(null)
                      setFormData({
                        name: "",
                        category: "",
                        unit: "",
                        price: "",
                        stock: "",
                        lowStockAlert: "",
                        description: "",
                        image: "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock Value</p>
                  <p className="text-2xl font-bold text-gray-900">Rs. {totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="absolute top-2 left-2 flex space-x-1">
                      <Badge className="bg-blue-100 text-blue-800">{product.category}</Badge>
                      {product.stock <= product.lowStockAlert && <Badge variant="destructive">Low Stock</Badge>}
                      {!product.isActive && <Badge variant="secondary">Inactive</Badge>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.unit}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">Rs. {product.price}</span>
                      <div className="flex items-center space-x-1">
                        {product.stock <= product.lowStockAlert ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Sold: {product.sold}</span>
                      <span>Alert: {product.lowStockAlert}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(product._id)}
                        className={product.isActive ? "text-orange-600" : "text-green-600"}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
