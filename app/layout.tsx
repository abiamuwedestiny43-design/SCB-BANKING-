import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "@/styles/globals.css"
import Footer from "@/components/Footer"
import ConditionalHeader from "@/components/conditional-header"

export const metadata: Metadata = {
  title: "Danamon Bank - Secure Banking in Indonesia",
  description:
    "Danamon Bank provides secure and innovative banking solutions in Indonesia, empowering your financial journey with precision and care.",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased text-[0.95rem]`}>
        <ConditionalHeader />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}
