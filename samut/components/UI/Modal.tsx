"use client"

import type React from "react"
import { FaTimes } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export default function Modal({ isOpen, onClose, title, children, className = "max-w-2xl" }: ModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className={`${className} w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl transform transition-all overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <FaTimes className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
