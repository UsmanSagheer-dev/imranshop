import Link from "next/link"
import { Facebook, Instagram, MapPin, Phone, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold">Ahmed General Store</span>
            </div>
            <p className="text-gray-400 mb-4">Your trusted local shop for groceries & essentials since 2015.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/rate-list" className="text-gray-400 hover:text-white transition-colors">
                  Rate List
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=Grocery" className="text-gray-400 hover:text-white transition-colors">
                  Grocery
                </Link>
              </li>
              <li>
                <Link href="/products?category=Snacks" className="text-gray-400 hover:text-white transition-colors">
                  Snacks
                </Link>
              </li>
              <li>
                <Link href="/products?category=Beverages" className="text-gray-400 hover:text-white transition-colors">
                  Beverages
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dairy" className="text-gray-400 hover:text-white transition-colors">
                  Dairy
                </Link>
              </li>
              <li>
                <Link href="/products?category=Fruits" className="text-gray-400 hover:text-white transition-colors">
                  Fruits
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Main Bazaar Road, Block A, Sector 15, Karachi</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                <a href="tel:+923001234567" className="text-gray-400 hover:text-white transition-colors text-sm">
                  +92 300 1234567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  WhatsApp Orders
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Ahmed General Store. All rights reserved. | Serving customers since 2015
          </p>
        </div>
      </div>
    </footer>
  )
}
