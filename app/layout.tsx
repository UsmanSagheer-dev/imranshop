import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ahmed General Store - Your Trusted Local Shop",
  description:
    "Ahmed General Store - Your trusted local shop for groceries & essentials. Fresh products, competitive prices, and excellent service since 2015.",
  keywords: "general store, grocery, karachi, local shop, essentials, ahmed store",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
