"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Percent, ShoppingBag, Truck } from "lucide-react"

const offers = [
  {
    id: 1,
    title: "Buy 2 Get 1 Free",
    description: "On selected snacks and beverages",
    icon: Gift,
    color: "bg-red-500",
    bgColor: "bg-red-50",
    validUntil: "Limited Time",
  },
  {
    id: 2,
    title: "Flat Rs.100 Off",
    description: "On orders above Rs.1000",
    icon: Percent,
    color: "bg-green-500",
    bgColor: "bg-green-50",
    validUntil: "This Week",
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "On orders above Rs.500",
    icon: Truck,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    validUntil: "Always",
  },
  {
    id: 4,
    title: "Weekend Special",
    description: "20% off on fresh fruits",
    icon: ShoppingBag,
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    validUntil: "Weekends Only",
  },
]

export default function LatestOffers() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Offers</h2>
          <p className="text-lg text-gray-600">Don't miss out on these amazing deals!</p>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className={`${offer.bgColor} border-none hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${offer.color} flex items-center justify-center`}>
                  <offer.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-3">{offer.description}</p>
                <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">{offer.validUntil}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {offers.map((offer) => (
                <div key={offer.id} className="w-full flex-shrink-0 px-2">
                  <Card className={`${offer.bgColor} border-none`}>
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full ${offer.color} flex items-center justify-center`}
                      >
                        <offer.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                      <p className="text-gray-600 mb-3">{offer.description}</p>
                      <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">{offer.validUntil}</Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
