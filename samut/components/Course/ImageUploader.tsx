"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FaUpload, FaTrash, FaImage } from "react-icons/fa"
import Image from "next/image"

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void
  initialImage?: string
  isDarkMode?: boolean
  label?: string
  description?: string
}

export default function ImageUploader({
  onFileChange,
  initialImage,
  isDarkMode = false,
  label = "Upload Image",
  description = "Drag and drop or click to select",
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset preview if initialImage changes
  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onFileChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      onFileChange(file)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileChange(null)
  }

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 relative h-48">
            <Image src={previewUrl || "/placeholder.svg"} alt={label} fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isDarkMode
                ? "bg-slate-800/80 text-red-400 hover:bg-slate-700 hover:text-red-300"
                : "bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
            } backdrop-blur-sm transition-colors`}
            aria-label="Remove image"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? isDarkMode
                ? "border-cyan-500 bg-slate-800/50"
                : "border-blue-500 bg-blue-50"
              : isDarkMode
                ? "border-slate-600 hover:border-cyan-600 bg-slate-800/30 hover:bg-slate-700/50"
                : "border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-gray-100"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`p-3 rounded-full ${isDarkMode ? "bg-slate-700 text-cyan-400" : "bg-blue-100 text-blue-500"}`}
            >
              {isDragging ? <FaImage size={24} /> : <FaUpload size={24} />}
            </div>
            <div>
              <p className={`text-base font-medium ${isDarkMode ? "text-white" : "text-gray-700"}`}>{label}</p>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
            </div>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
        </div>
      )}
    </div>
  )
}
