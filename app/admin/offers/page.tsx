"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/AdminLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gift, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"

interface Offer {
  _id: string
  title: string
  description: string
  discountType: "percentage" | "fixed" | "bogo"
  discountValue: number
  minOrderAmount: number
  validFrom: string
  validTo: string
  isActive: boolean
  usageLimit: number
  usedCount: number
  createdAt: string
}

export default function OffersManagement() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed" | "bogo",
    discountValue: 0,
    minOrderAmount: 0,
    validFrom: "",
    validTo: "",
    isActive: true,
    usageLimit: 100,
  })

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin")
      return
    }

    // Mock offers data
    const mockOffers: Offer[] = [
      {
        _id: "1",
        title: "Buy 2 Get 1 Free",
        description: "On selected snacks and beverages",
        discountType: "bogo",
        discountValue: 0,
        minOrderAmount: 0,
        validFrom: "2024-01-01",
        validTo: "2024-12-31",
        isActive: true,
        usageLimit: 1000,
        usedCount: 45,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "Flat Rs.100 Off",
        description: "On orders above Rs.1000",
        discountType: "fixed",
        discountValue: 100,
        minOrderAmount: 1000,
        validFrom: "2024-01-01",
        validTo: "2024-06-30",
        isActive: true,
        usageLimit: 500,
        usedCount: 123,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "3",
        title: "20% Off Everything",
        description: "Special weekend discount",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 500,
        validFrom: "2024-01-20",
        validTo: "2024-01-22",
        isActive: false,
        usageLimit: 200,
        usedCount: 67,
        createdAt: new Date().toISOString(),
      },
    ]

    setTimeout(() => {
      setOffers(mockOffers)
      setLoading(false)
    }, 1000)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingOffer) {
      // Update existing offer
      setOffers(offers.map((offer) => (offer._id === editingOffer._id ? { ...offer, ...formData } : offer)))
    } else {
      // Add new offer
      const newOffer: Offer = {
        _id: Date.now().toString(),
        ...formData,
        usedCount: 0,
        createdAt: new Date().toISOString(),
      }
      setOffers([newOffer, ...offers])
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      validFrom: "",
      validTo: "",
      isActive: true,
      usageLimit: 100,
    })
    setEditingOffer(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minOrderAmount: offer.minOrderAmount,
      validFrom: offer.validFrom,
      validTo: offer.validTo,
      isActive: offer.isActive,
      usageLimit: offer.usageLimit,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (offerId: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter((offer) => offer._id !== offerId))
    }
  }

  const toggleOfferStatus = (offerId: string) => {
    setOffers(offers.map((offer) => (offer._id === offerId ? { ...offer, isActive: !offer.isActive } : offer)))
  }

  const getDiscountText = (offer: Offer) => {
    switch (offer.discountType) {
      case "percentage":
        return `${offer.discountValue}% Off`
      case "fixed":
        return `Rs. ${offer.discountValue} Off`
      case "bogo":
        return "Buy 2 Get 1 Free"
      default:
        return "Special Offer"
    }
  }

  const getOfferColor = (offer: Offer) => {
    if (!offer.isActive) return "bg-gray-100 text-gray-800"

    switch (offer.discountType) {
      case "percentage":
        return "bg-green-100 text-green-800"
      case "fixed":
        return "bg-blue-100 text-blue-800"
      case "bogo":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offers Management</h1>
            <p className="text-gray-600">Create and manage special offers for your customers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingOffer ? "Edit Offer" : "Create New Offer"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Offer Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Buy 2 Get 1 Free"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={formData.discountType}
                      onValueChange={(value: "percentage" | "fixed" | "bogo") =>
                        setFormData({ ...formData, discountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Off</SelectItem>
                        <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                        <SelectItem value="bogo">Buy One Get One</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your offer..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.discountType !== "bogo" && (
                    <div>
                      <Label htmlFor="discountValue">
                        Discount Value {formData.discountType === "percentage" ? "(%)" : "(Rs.)"}
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                        min="0"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="minOrderAmount">Minimum Order Amount (Rs.)</Label>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validFrom">Valid From</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="validTo">Valid To</Label>
                    <Input
                      id="validTo"
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active Offer</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingOffer(null)
                      setFormData({
                        title: "",
                        description: "",
                        discountType: "percentage",
                        discountValue: 0,
                        minOrderAmount: 0,
                        validFrom: "",
                        validTo: "",
                        isActive: true,
                        usageLimit: 100,
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingOffer ? "Update Offer" : "Create Offer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card
                key={offer._id}
                className={`hover:shadow-lg transition-shadow ${!offer.isActive ? "opacity-60" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      <Badge className={getOfferColor(offer)}>{getDiscountText(offer)}</Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleOfferStatus(offer._id)}
                        className="h-8 w-8 p-0"
                      >
                        {offer.isActive ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(offer)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(offer._id)} className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{offer.title}</h3>
                      <p className="text-sm text-gray-600">{offer.description}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      {offer.minOrderAmount > 0 && (
                        <p className="text-gray-600">
                          Minimum order: <span className="font-medium">Rs. {offer.minOrderAmount}</span>
                        </p>
                      )}
                      <p className="text-gray-600">
                        Valid:{" "}
                        <span className="font-medium">
                          {new Date(offer.validFrom).toLocaleDateString()} -{" "}
                          {new Date(offer.validTo).toLocaleDateString()}
                        </span>
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Usage:</span>
                        <span className="font-medium">
                          {offer.usedCount} / {offer.usageLimit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(offer.usedCount / offer.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={offer.isActive ? "default" : "secondary"}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Created {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {offers.length === 0 && !loading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
              <p className="text-gray-600 mb-4">Create your first special offer to attract customers</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Offer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
