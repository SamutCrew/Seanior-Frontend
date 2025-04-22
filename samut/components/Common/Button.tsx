
"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  ...props
}: ButtonProps) => {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition"

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-white text-blue-500 hover:bg-gray-100",
    outline: "border border-white text-white hover:bg-white/10",
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

