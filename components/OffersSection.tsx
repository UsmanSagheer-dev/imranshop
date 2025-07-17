import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Percent, ShoppingBag } from "lucide-react"

const offers = [
  {
    id: 1,
    title: "Buy 2 Get 1 Free",
    description: "On selected snacks and beverages",
    icon: Gift,
    color: "bg-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    title: "Flat Rs.100 Off",
    description: "On orders above Rs.1000",
    icon: Percent,
    color: "bg-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "Free Delivery",
    description: "On orders above Rs.500",
    icon: ShoppingBag,
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
  },
]

export default function OffersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
          <p className="text-lg text-gray-600">Don't miss out on these amazing deals!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className={`${offer.bgColor} border-none hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${offer.color} flex items-center justify-center`}>
                  <offer.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600">{offer.description}</p>
                <Badge className="mt-4 bg-yellow-400 text-gray-900 hover:bg-yellow-500">Limited Time</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
