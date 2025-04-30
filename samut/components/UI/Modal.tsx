"use client"

import type React from "react"
import { useEffect } from "react"
import { FaTimes } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import { motion, AnimatePresence } from "framer-motion"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscapeKey)
    return () => window.removeEventListener("keydown", handleEscapeKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className={`
                w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl
                ${
                  isDarkMode
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "bg-white text-gray-900 border border-gray-200"
                }
                transition-colors duration-300
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`
                flex justify-between items-center p-5 sticky top-0 z-10
                ${isDarkMode ? "bg-slate-800 border-b border-slate-700" : "bg-white border-b border-gray-200"}
                transition-colors duration-300
              `}
              >
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-sky-800"}`}>{title}</h2>
                <button
                  onClick={onClose}
                  className={`
                    p-2 rounded-full transition-colors duration-200
                    ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-slate-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  aria-label="Close modal"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className={`${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
