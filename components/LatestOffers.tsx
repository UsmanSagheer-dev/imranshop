"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Percent, ShoppingBag, Clock } from "lucide-react"

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
}

export default function LatestOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In real app, this would fetch from API
    // For now, get from localStorage (admin created offers) or use defaults
    const savedOffers = localStorage.getItem("adminOffers")

    const defaultOffers: Offer[] = [
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
      },
      {
        _id: "3",
        title: "Free Delivery",
        description: "On orders above Rs.500",
        discountType: "fixed",
        discountValue: 0,
        minOrderAmount: 500,
        validFrom: "2024-01-01",
        validTo: "2024-12-31",
        isActive: true,
        usageLimit: 1000,
        usedCount: 234,
      },
    ]

    const offersToShow = savedOffers ? JSON.parse(savedOffers) : defaultOffers

    setTimeout(() => {
      setOffers(offersToShow.filter((offer: Offer) => offer.isActive))
      setLoading(false)
    }, 500)
  }, [])

  const getOfferIcon = (discountType: string) => {
    switch (discountType) {
      case "bogo":
        return Gift
      case "percentage":
        return Percent
      case "fixed":
        return ShoppingBag
      default:
        return Gift
    }
  }

  const getOfferColor = (discountType: string) => {
    switch (discountType) {
      case "bogo":
        return "bg-red-500"
      case "percentage":
        return "bg-green-500"
      case "fixed":
        return "bg-blue-500"
      default:
        return "bg-purple-500"
    }
  }

  const getOfferBgColor = (discountType: string) => {
    switch (discountType) {
      case "bogo":
        return "bg-red-50"
      case "percentage":
        return "bg-green-50"
      case "fixed":
        return "bg-blue-50"
      default:
        return "bg-purple-50"
    }
  }

  const getDiscountText = (offer: Offer) => {
    switch (offer.discountType) {
      case "percentage":
        return `${offer.discountValue}% Off`
      case "fixed":
        return offer.discountValue > 0 ? `Rs. ${offer.discountValue} Off` : "Free Delivery"
      case "bogo":
        return "Buy 2 Get 1 Free"
      default:
        return "Special Offer"
    }
  }

  const isOfferExpiringSoon = (validTo: string) => {
    const expiryDate = new Date(validTo)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600">Don't miss out on these amazing deals!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (offers.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600">Check back soon for amazing deals!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
          <p className="text-lg text-gray-600">Don't miss out on these amazing deals!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const OfferIcon = getOfferIcon(offer.discountType)
            const isExpiringSoon = isOfferExpiringSoon(offer.validTo)

            return (
              <Card
                key={offer._id}
                className={`${getOfferBgColor(offer.discountType)} border-none hover:shadow-lg transition-shadow relative overflow-hidden`}
              >
                {isExpiringSoon && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="destructive" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Ending Soon
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${getOfferColor(offer.discountType)} flex items-center justify-center`}
                  >
                    <OfferIcon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>

                  <div className="space-y-2 mb-4">
                    <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">{getDiscountText(offer)}</Badge>

                    {offer.minOrderAmount > 0 && (
                      <p className="text-sm text-gray-600">Min. order: Rs. {offer.minOrderAmount}</p>
                    )}

                    <p className="text-xs text-gray-500">Valid till {new Date(offer.validTo).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Used:</span>
                      <span>
                        {offer.usedCount} / {offer.usageLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getOfferColor(offer.discountType)}`}
                        style={{ width: `${Math.min((offer.usedCount / offer.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => (window.location.href = "/products")}
                  >
                    Shop Now
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {offers.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-4">* Terms and conditions apply. Offers cannot be combined.</p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/products")}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
