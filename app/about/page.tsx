import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Clock, Users, Heart, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Ahmed General Store</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted neighborhood store serving the community with quality products and exceptional service since
            2015.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Ahmed General Store began as a small family business with a simple mission: to provide our community with
              fresh, quality products at affordable prices. What started as a modest shop has grown into a trusted
              neighborhood institution.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We believe in building relationships with our customers, understanding their needs, and going the extra
              mile to ensure their satisfaction. From fresh groceries to daily essentials, we stock everything you need
              under one roof.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our commitment to quality, competitive pricing, and friendly service has made us a beloved part of the
              local community. We're not just a store – we're your neighbors who care about your family's needs.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Quality Products</p>
                  <p className="text-sm text-gray-600">Carefully selected items</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Fast Service</p>
                  <p className="text-sm text-gray-600">Quick delivery & pickup</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">5000+ Customers</p>
                  <p className="text-sm text-gray-600">Trusted by families</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Heart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Family Owned</p>
                  <p className="text-sm text-gray-600">Personal touch in service</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Ahmed General Store - Interior View"
              width={600}
              height={500}
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
              <p className="text-3xl font-bold">9+</p>
              <p className="text-sm">Years of Service</p>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Meet the Owner</h3>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Ahmed Ali</h4>
              <p className="text-gray-600 mb-4">
                "I started this store with a vision to serve my community with honesty and dedication. Every customer
                who walks through our doors is treated like family. We take pride in knowing our customers by name and
                understanding their preferences."
              </p>
              <p className="text-gray-600 mb-4">
                "Quality is never an accident. It's the result of intelligent effort, and that's what we bring to every
                product we stock and every service we provide."
              </p>
              <p className="text-sm text-gray-500 italic">- Ahmed Ali, Founder & Owner</p>
            </div>
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Ahmed Ali - Store Owner"
                width={300}
                height={300}
                className="rounded-full mx-auto shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg p-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
              To be the most trusted and convenient neighborhood store, providing fresh, quality products at competitive
              prices while building lasting relationships with our community through exceptional customer service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Quality First</h4>
                <p className="text-gray-600 text-sm">We never compromise on the quality of products we offer</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Community Focus</h4>
                <p className="text-gray-600 text-sm">Supporting and serving our local community is our priority</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Care</h4>
                <p className="text-gray-600 text-sm">Every customer is treated with respect and personal attention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Visit Our Store</h4>
              </div>
              <p className="text-gray-600 mb-2">Main Bazaar Road, Block A</p>
              <p className="text-gray-600 mb-2">Sector 15, Karachi, Pakistan</p>
              <p className="text-sm text-gray-500">Open 7 days a week</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="h-6 w-6 text-green-600 mr-3" />
                <h4 className="text-lg font-semibold text-gray-900">Get in Touch</h4>
              </div>
              <p className="text-gray-600 mb-2">Phone: +92 300 1234567</p>
              <p className="text-gray-600 mb-2">WhatsApp: +92 300 1234567</p>
              <p className="text-sm text-gray-500">Available for orders & inquiries</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
