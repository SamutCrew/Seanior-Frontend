"use client"

import type React from "react"

import { useAuth } from "@/context/AuthContext"
import LoadingPage from "@/components/Common/LoadingPage"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default ProtectedRoute
