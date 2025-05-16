import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import DashboardWrapper from "./dashboardWrapper"
import "leaflet/dist/leaflet.css"
import RouteGuard from "@/components/Auth/RouteGuard"
import StoreProvider from "./redux"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SeaNior - Swimming Instructor Platform",
  description: "Connect with certified swimming instructors for all ages and skill levels",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/shortcut-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <AuthProvider>
            <RouteGuard>
              <DashboardWrapper>{children}</DashboardWrapper>
            </RouteGuard>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
