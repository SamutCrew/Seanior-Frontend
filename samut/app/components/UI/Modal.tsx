"use client"

import type React from "react"

import { FaTimes } from "react-icons/fa"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300 ease-out z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          className={`
            bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto
            transform transition-all duration-300 ease-out
            translate-y-0 opacity-100 scale-100
          `}
        >
          <div className="flex justify-between items-center border-b p-5 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-sky-800">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <FaTimes size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
