"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FaTimes } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [mounted, setMounted] = useState(false)

  // Handle mounting for client-side rendering
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Get modal size classes
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "max-w-md" // Small - 28rem
      case "md":
        return "max-w-2xl" // Medium - 42rem
      case "lg":
        return "max-w-4xl" // Large - 56rem
      case "xl":
        return "max-w-6xl" // Extra large - 72rem
      case "2xl":
        return "max-w-7xl" // 2X large - 80rem
      case "full":
        return "max-w-[95vw] max-h-[95vh]" // Almost full screen
      default:
        return "max-w-2xl" // Default to medium
    }
  }

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div
        ref={modalRef}
        className={`${
          isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        } rounded-lg shadow-xl w-full ${getSizeClass()} overflow-hidden transition-transform`}
      >
        {title && (
          <div
            className={`flex justify-between items-center px-6 py-4 border-b ${
              isDarkMode ? "border-slate-700" : "border-gray-200"
            }`}
          >
            <h3 className="text-lg leading-6 font-medium">{title}</h3>
            <button
              type="button"
              className={`rounded-md ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              } focus:outline-none p-2`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
