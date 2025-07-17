"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Filter, Calendar } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
  unit: string
  price: number
}

export default function RateListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  // Mock data - In real app, this would come from API
  useEffect(() => {
    const mockProducts: Product[] = [
      { _id: "1", name: "Basmati Rice", category: "Grocery", unit: "5kg", price: 850 },
      { _id: "2", name: "Fresh Milk", category: "Dairy", unit: "1L", price: 120 },
      { _id: "3", name: "Cooking Oil", category: "Grocery", unit: "1L", price: 280 },
      { _id: "4", name: "Wheat Flour", category: "Grocery", unit: "10kg", price: 1200 },
      { _id: "5", name: "Sugar", category: "Grocery", unit: "1kg", price: 110 },
      { _id: "6", name: "Tea Bags", category: "Beverages", unit: "100pcs", price: 450 },
      { _id: "7", name: "Coca Cola", category: "Beverages", unit: "1.5L", price: 150 },
      { _id: "8", name: "Lays Chips", category: "Snacks", unit: "50g", price: 50 },
      { _id: "9", name: "Bread", category: "Bakery", unit: "1 loaf", price: 80 },
      { _id: "10", name: "Eggs", category: "Dairy", unit: "12pcs", price: 180 },
      { _id: "11", name: "Chicken", category: "Meat", unit: "1kg", price: 450 },
      { _id: "12", name: "Tomatoes", category: "Vegetables", unit: "1kg", price: 60 },
      { _id: "13", name: "Onions", category: "Vegetables", unit: "1kg", price: 40 },
      { _id: "14", name: "Potatoes", category: "Vegetables", unit: "1kg", price: 35 },
      { _id: "15", name: "Bananas", category: "Fruits", unit: "1 dozen", price: 120 },
      { _id: "16", name: "Apples", category: "Fruits", unit: "1kg", price: 200 },
      { _id: "17", name: "Oranges", category: "Fruits", unit: "1kg", price: 150 },
      { _id: "18", name: "Yogurt", category: "Dairy", unit: "500g", price: 90 },
      { _id: "19", name: "Cheese", category: "Dairy", unit: "200g", price: 250 },
      { _id: "20", name: "Butter", category: "Dairy", unit: "250g", price: 180 },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.unit.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert("PDF download functionality would be implemented here!")
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const categories = Array.from(new Set(products.map((p) => p.category))).sort()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate List</h1>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Updated: {currentDate}</span>
              </div>
            </div>
            <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{products.length}</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{filteredProducts.length}</p>
                <p className="text-sm text-gray-600">Showing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  Rs. {Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}
                </p>
                <p className="text-sm text-gray-600">Avg. Price</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rate List Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Product Rate List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Product Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Unit</TableHead>
                      <TableHead className="font-semibold text-right">Price (Rs.)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {product.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600">{product.unit}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">Rs. {product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No products found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const categoryProducts = products.filter((p) => p.category === category)
                  const avgPrice = Math.round(
                    categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length,
                  )

                  return (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                      <div className="text-sm text-gray-600">
                        <p>{categoryProducts.length} products</p>
                        <p>Avg. Price: Rs. {avgPrice}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Prices are subject to change without prior notice. For bulk orders or special
            pricing, please contact us directly. Last updated: {currentDate}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
