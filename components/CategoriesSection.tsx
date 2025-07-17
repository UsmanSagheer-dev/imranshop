import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Apple, Coffee, Droplets, Home, Baby, Grape } from "lucide-react"

const categories = [
  { name: "Grocery", icon: Apple, color: "bg-green-100 text-green-600", href: "/products?category=Grocery" },
  { name: "Snacks", icon: Coffee, color: "bg-orange-100 text-orange-600", href: "/products?category=Snacks" },
  { name: "Beverages", icon: Droplets, color: "bg-blue-100 text-blue-600", href: "/products?category=Beverages" },
  { name: "Household", icon: Home, color: "bg-purple-100 text-purple-600", href: "/products?category=Household" },
  { name: "Baby Products", icon: Baby, color: "bg-pink-100 text-pink-600", href: "/products?category=Baby" },
  { name: "Fruits", icon: Grape, color: "bg-yellow-100 text-yellow-600", href: "/products?category=Fruits" },
]

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Find everything you need in one place</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
