"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { FaTimes } from "react-icons/fa"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full" | string
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

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
  const getModalSize = () => {
    switch (size) {
      case "sm":
        return "max-w-md" // Small - 28rem
      case "md":
        return "max-w-2xl" // Medium - 42rem
      case "lg":
        return "max-w-4xl" // Large - 56rem
      case "xl":
        return "max-w-6xl" // Extra large - 72rem
      case "full":
        return "max-w-[95vw] max-h-[95vh]" // Almost full screen
      default:
        return "max-w-2xl" // Default to medium
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full ${getModalSize()} overflow-hidden transition-transform`}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h2 className="text-lg font-medium dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(95vh-8rem)]">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
