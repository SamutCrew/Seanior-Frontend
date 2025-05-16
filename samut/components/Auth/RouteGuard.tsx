"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import LoginModal from "./LoginModal"

interface RouteGuardProps {
  children: React.ReactNode
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Check if the route is public
    const isPublicRoute =
      pathname === "/" ||
      pathname.startsWith("/auth/Login") ||
      pathname.startsWith("/auth/Register") ||
      pathname.startsWith("/auth/Forgotpassword") ||
      pathname.startsWith("/allcourse") ||
      pathname.startsWith("/allinstructor")

    // For debugging
    console.log("RouteGuard: Auth state", {
      user,
      loading,
      pathname,
      isPublicRoute,
    })

    // If not loading and user is authenticated, allow access
    if (!loading && user) {
      console.log("User is authenticated, allowing access")
      setShowLoginModal(false)
      setAuthorized(true)
      return
    }

    // If not loading and not authenticated and not a public route
    if (!loading && !user && !isPublicRoute) {
      console.log("User is not authenticated, showing login modal")
      setShowLoginModal(true)
      setAuthorized(false)
      return
    }

    // If public route, allow access regardless of auth state
    if (isPublicRoute) {
      console.log("Public route, allowing access")
      setShowLoginModal(false)
      setAuthorized(true)
      return
    }

    // Default case - while loading, maintain current state
    console.log("Default case, maintaining current state")
  }, [user, loading, pathname])

  const closeLoginModal = () => {
    setShowLoginModal(false)
    // Redirect to home page if user cancels login
    if (pathname !== "/") {
      router.push("/")
    }
  }

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <>
      {authorized && children}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} returnUrl={pathname} />
    </>
  )
}
