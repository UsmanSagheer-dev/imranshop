import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600">Visit us or contact us for quick orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Store Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Main Bazaar Road,
                <br />
                Block A, Sector 15,
                <br />
                Karachi, Pakistan
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Phone Number</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">+92 300 1234567</p>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+923001234567">Call Now</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">Quick Orders & Support</p>
              <Button className="bg-green-600 hover:bg-green-700" size="sm" asChild>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                  Chat Now
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle className="text-lg">Store Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Mon - Sat: 8:00 AM - 10:00 PM
                <br />
                Sunday: 9:00 AM - 9:00 PM
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Something Specific?</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Send us a message on WhatsApp and we'll help you find it!
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <a
                href="https://wa.me/923001234567?text=Hi! I'm looking for a specific product."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Send WhatsApp Message
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
