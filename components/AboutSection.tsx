import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Users, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Ahmed General Store</h2>
            <p className="text-lg text-gray-600 mb-6">
              Serving our community since 2015, Ahmed General Store has been your trusted neighborhood shop for all
              daily essentials. We pride ourselves on providing fresh, quality products at affordable prices with
              exceptional customer service.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From fresh groceries to household items, we stock everything you need under one roof. Our commitment to
              quality and customer satisfaction has made us a beloved part of the local community.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Quality Products</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Fast Delivery</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">5000+ Customers</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Family Owned</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Ahmed General Store Interior"
              width={500}
              height={400}
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
              <p className="text-2xl font-bold">9+ Years</p>
              <p className="text-sm">Serving Community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
