import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-green-50 to-yellow-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-green-600">Ahmed General Store</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">Your trusted local shop for groceries & essentials</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3" asChild>
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                asChild
              >
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                  Order via WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Ahmed General Store - Fresh Groceries"
              width={600}
              height={500}
              className="rounded-lg shadow-xl"
              priority
            />
            <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-gray-900 p-4 rounded-lg shadow-lg">
              <p className="font-bold text-lg">Fresh Products</p>
              <p className="text-sm">Daily Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
