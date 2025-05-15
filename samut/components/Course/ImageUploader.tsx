"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FaUpload, FaImage, FaTrash, FaSpinner } from "react-icons/fa"

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void
  initialImage?: string | null
  isDarkMode?: boolean
  label?: string
  description?: string
}

export default function ImageUploader({
  onFileChange,
  initialImage,
  isDarkMode = false,
  label = "Upload Image",
  description = "Click or drag to upload an image",
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset preview when initialImage changes
  useEffect(() => {
    if (initialImage !== undefined) {
      setPreviewUrl(initialImage)
    }
  }, [initialImage])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    processFile(file)
  }

  const processFile = (file: File | null) => {
    // Clear previous error
    setError(null)

    if (!file) {
      setPreviewUrl(initialImage || null)
      onFileChange(null)
      return
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setError("Image size should be less than 5MB")
      return
    }

    setIsLoading(true)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
      setIsLoading(false)
    }
    reader.onerror = () => {
      setError("Failed to read file")
      setIsLoading(false)
    }
    reader.readAsDataURL(file)

    // Pass file to parent component
    onFileChange(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0] || null
    processFile(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = (event: React.MouseEvent) => {
    event.stopPropagation()
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onFileChange(null)
  }

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed transition-colors ${
        isDragging
          ? isDarkMode
            ? "border-cyan-500 bg-slate-800"
            : "border-blue-500 bg-blue-50"
          : isDarkMode
            ? "border-slate-600 hover:border-slate-500"
            : "border-gray-300 hover:border-gray-400"
      } ${error ? (isDarkMode ? "border-red-500" : "border-red-400") : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        aria-label="Upload image"
      />

      <div className="flex flex-col items-center justify-center p-6 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <FaSpinner className={`animate-spin text-3xl ${isDarkMode ? "text-cyan-500" : "text-blue-500"}`} />
            <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Processing image...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="mx-auto max-h-48 rounded object-contain"
              onError={() => {
                setError("Failed to load image preview")
                setPreviewUrl(null)
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className={`absolute right-0 top-0 rounded-full p-1 ${
                isDarkMode
                  ? "bg-slate-800 text-red-400 hover:bg-slate-700 hover:text-red-300"
                  : "bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
              }`}
              aria-label="Remove image"
            >
              <FaTrash size={16} />
            </button>
          </div>
        ) : (
          <>
            <FaUpload
              className={`mb-2 text-3xl ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
              aria-hidden="true"
            />
            <p className={`text-base font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{label}</p>
            <p className={`mt-1 text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{description}</p>
            <div className="mt-2">
              <FaImage
                className={`inline text-xl ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
                aria-hidden="true"
              />
              <span className={`ml-1 text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                JPEG, PNG, GIF, WEBP (max 5MB)
              </span>
            </div>
          </>
        )}

        {error && (
          <p className={`mt-2 text-sm ${isDarkMode ? "text-red-400" : "text-red-500"}`} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
