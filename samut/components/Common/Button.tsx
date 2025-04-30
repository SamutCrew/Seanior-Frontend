"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "gradient"
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  icon?: React.ReactNode
  showArrow?: boolean
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  icon,
  showArrow = false,
  size = "md",
  disabled = false,
  ...props
}: ButtonProps) => {
  // Base classes for all buttons
  const baseClasses = "relative rounded-lg font-medium transition-all duration-300 flex items-center justify-center"

  // Size variations - increased touch target size for mobile
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3.5 text-lg",
  }

  // Style variations
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-1",
    secondary:
      "bg-white text-blue-600 hover:bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1",
    outline: "bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm",
    gradient:
      "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-md hover:shadow-lg hover:-translate-y-1",
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {showArrow && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}

      {/* Add subtle water ripple effect on hover for primary and gradient buttons */}
      {(variant === "primary" || variant === "gradient") && (
        <span className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <span className="ripple-on-hover"></span>
        </span>
      )}
    </motion.button>
  )
}
