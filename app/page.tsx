import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import CategoriesSection from "@/components/CategoriesSection"
import FeaturedProducts from "@/components/FeaturedProducts"
import LatestOffers from "@/components/LatestOffers"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <LatestOffers />
      </main>
      <Footer />
    </div>
  )
}
