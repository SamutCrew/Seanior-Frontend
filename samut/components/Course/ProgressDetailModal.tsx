"use client"

import type React from "react"

import { useState } from "react"
import { FaCamera, FaTimes, FaSave } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import Modal from "@/components/UI/Modal"
import { Button } from "@/components/Common/Button"

export interface StudySessionDetail {
  id: string
  date: string
  title: string
  description: string
  images: string[]
  moduleId: number
  topicId: number
}

interface ProgressDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (details: StudySessionDetail) => void
  moduleId: number
  topicId: number
  moduleName: string
  topicName: string
  initialDetails?: StudySessionDetail
}

export default function ProgressDetailModal({
  isOpen,
  onClose,
  onSave,
  moduleId,
  topicId,
  moduleName,
  topicName,
  initialDetails,
}: ProgressDetailModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [details, setDetails] = useState<StudySessionDetail>(
    initialDetails || {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      images: [],
      moduleId,
      topicId,
    },
  )

  const [imageUrls, setImageUrls] = useState<string[]>(initialDetails?.images || [])
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)

    // Simulate image upload
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      if (event.target?.result) {
        // In a real app, you would upload to a server and get back a URL
        const newImageUrl = event.target.result.toString()
        setImageUrls((prev) => [...prev, newImageUrl])
        setDetails((prev) => ({
          ...prev,
          images: [...prev.images, newImageUrl],
        }))
        setIsUploading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
    setDetails((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))
      onSave(details)
      onClose()
    } catch (error) {
      console.error("Failed to save progress details:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Study Session Details">
      <form onSubmit={handleSubmit} className="p-5">
        <div className="space-y-4">
          {/* Context information */}
          <div className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-blue-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Module: <span className="font-medium">{moduleName}</span>
            </p>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Topic: <span className="font-medium">{topicName}</span>
            </p>
          </div>

          {/* Date input */}
          <div>
            <label
              htmlFor="date"
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Session Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={details.date}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md border ${
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              required
            />
          </div>

          {/* Title input */}
          <div>
            <label
              htmlFor="title"
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Session Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={details.title}
              onChange={handleInputChange}
              placeholder="What was covered in this session?"
              className={`w-full p-2 rounded-md border ${
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              required
            />
          </div>

          {/* Description textarea */}
          <div>
            <label
              htmlFor="description"
              className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Session Details
            </label>
            <textarea
              id="description"
              name="description"
              value={details.description}
              onChange={handleInputChange}
              placeholder="Describe what was covered, achievements, challenges, etc."
              rows={4}
              className={`w-full p-2 rounded-md border ${
                isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              required
            />
          </div>

          {/* Image upload */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Session Images
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Session image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}

              {/* Image upload button */}
              <label
                className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer ${
                  isDarkMode
                    ? "border-gray-600 hover:border-gray-500 bg-slate-700/50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-blue-500"></div>
                ) : (
                  <>
                    <FaCamera className={`text-2xl mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Add Image</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" onClick={onClose} className="px-4">
            Cancel
          </Button>
          <Button
            variant={isDarkMode ? "gradient" : "primary"}
            type="submit"
            className="px-4 flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Details</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
