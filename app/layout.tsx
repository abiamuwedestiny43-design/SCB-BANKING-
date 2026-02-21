import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
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
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="c16472e9-cd8f-4db3-9506-7d72968c6333";
              (function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
