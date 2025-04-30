"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaSave,
  FaPlus,
  FaCamera,
  FaTimes,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import type { CourseProgress, WeeklyUpdate } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { Button } from "@/components/Common/Button"
import Image from "next/image"

interface WeeklyLessonUpdateProps {
  courseId: number
  initialProgress?: CourseProgress
  onSave: (progress: CourseProgress) => void
}

export default function WeeklyLessonUpdate({ courseId, initialProgress, onSave }: WeeklyLessonUpdateProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Use provided progress or create empty structure
  const [progress, setProgress] = useState<CourseProgress>(
    initialProgress || {
      overallCompletion: 0,
      modules: [],
      lastUpdated: new Date().toISOString(),
      weeklyUpdates: [],
    },
  )

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUpdate, setEditingUpdate] = useState<WeeklyUpdate | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null)

  // Form state for new/editing weekly update
  const [formData, setFormData] = useState<Omit<WeeklyUpdate, "id"> & { progressPercentage?: number }>({
    weekNumber: 1,
    date: new Date().toISOString().split("T")[0],
    title: "",
    content: "",
    achievements: "",
    challenges: "",
    nextSteps: "",
    images: [],
    progressPercentage: 0,
  })

  // Image upload handling
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Week selection options
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([])

  // Update available weeks when progress changes
  useEffect(() => {
    if (progress?.weeklyUpdates) {
      // Get existing week numbers
      const existingWeeks = progress.weeklyUpdates.map((update) => update.weekNumber)

      // Create an array of weeks 1-12 (typical course length)
      const allWeeks = Array.from({ length: 12 }, (_, i) => i + 1)

      // Set available weeks
      setAvailableWeeks(allWeeks)
    }
  }, [progress])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "weekNumber") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
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
        setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const openAddModal = () => {
    // Find the next week number
    const weeklyUpdates = progress.weeklyUpdates || []
    const existingWeeks = weeklyUpdates.map((update) => update.weekNumber)

    // Find the first available week number
    let nextWeekNumber = 1
    while (existingWeeks.includes(nextWeekNumber)) {
      nextWeekNumber++
    }

    setFormData({
      weekNumber: nextWeekNumber,
      date: new Date().toISOString().split("T")[0],
      title: "",
      content: "",
      achievements: "",
      challenges: "",
      nextSteps: "",
      images: [],
      progressPercentage: progress.overallCompletion || 0,
    })
    setImageUrls([])
    setEditingUpdate(null)
    setIsModalOpen(true)
  }

  const openEditModal = (update: WeeklyUpdate) => {
    setFormData({
      weekNumber: update.weekNumber,
      date: update.date,
      title: update.title,
      content: update.content,
      achievements: update.achievements,
      challenges: update.challenges,
      nextSteps: update.nextSteps,
      images: update.images,
      progressPercentage: progress.overallCompletion,
    })
    setImageUrls(update.images)
    setEditingUpdate(update)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const weeklyUpdates = progress.weeklyUpdates || []
      let updatedWeeklyUpdates: WeeklyUpdate[]

      if (editingUpdate) {
        // Update existing entry
        updatedWeeklyUpdates = weeklyUpdates.map((update) =>
          update.id === editingUpdate.id ? { ...formData, id: update.id } : update,
        )
      } else {
        // Add new entry
        const newUpdate: WeeklyUpdate = {
          ...formData,
          id: crypto.randomUUID(),
        }
        updatedWeeklyUpdates = [...weeklyUpdates, newUpdate]
      }

      // Sort by week number (descending)
      updatedWeeklyUpdates.sort((a, b) => b.weekNumber - a.weekNumber)

      // Update overall completion based on the progress percentage
      const newOverallCompletion = formData.progressPercentage || progress.overallCompletion || 0

      const updatedProgress: CourseProgress = {
        ...progress,
        weeklyUpdates: updatedWeeklyUpdates,
        overallCompletion: newOverallCompletion,
        lastUpdated: new Date().toISOString(),
      }

      setProgress(updatedProgress)
      onSave(updatedProgress)
      setIsModalOpen(false)

      // Show success message
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to save weekly update:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (updateId: string) => {
    setIsDeleting(updateId)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const weeklyUpdates = progress.weeklyUpdates || []
      const updatedWeeklyUpdates = weeklyUpdates.filter((update) => update.id !== updateId)

      const updatedProgress: CourseProgress = {
        ...progress,
        weeklyUpdates: updatedWeeklyUpdates,
        lastUpdated: new Date().toISOString(),
      }

      setProgress(updatedProgress)
      onSave(updatedProgress)
    } catch (error) {
      console.error("Failed to delete weekly update:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const toggleUpdateExpansion = (updateId: string) => {
    setExpandedUpdateId(expandedUpdateId === updateId ? null : updateId)
  }

  const weeklyUpdates = progress.weeklyUpdates || []

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm transition-colors duration-300`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Weekly Lesson Updates</h2>

          <Button
            variant={isDarkMode ? "gradient" : "primary"}
            onClick={openAddModal}
            className="flex items-center gap-2"
          >
            <FaPlus className="h-4 w-4" />
            <span>Add Weekly Update</span>
          </Button>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-3 rounded-md ${
                isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"
              }`}
            >
              Weekly update saved successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {weeklyUpdates.length === 0 ? (
          <div
            className={`p-8 text-center rounded-lg border-2 border-dashed ${
              isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
            } transition-colors duration-300`}
          >
            <p className="mb-4">No weekly updates have been added yet.</p>
            <p>Click the "Add Weekly Update" button to document your first lesson.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {weeklyUpdates.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg border ${
                  isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-white"
                } overflow-hidden transition-colors duration-300`}
              >
                <div
                  className={`p-4 flex justify-between items-center ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"} transition-colors duration-300`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Week {update.weekNumber}: {update.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaCalendarAlt className={`h-3 w-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(update.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleUpdateExpansion(update.id)}
                      className={`p-2 rounded-full ${
                        isDarkMode ? "hover:bg-slate-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                      } transition-colors duration-200`}
                      title={expandedUpdateId === update.id ? "Collapse" : "Expand"}
                    >
                      {expandedUpdateId === update.id ? (
                        <FaChevronUp className="h-4 w-4" />
                      ) : (
                        <FaChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(update)}
                      className={`p-2 rounded-full ${
                        isDarkMode ? "hover:bg-slate-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                      } transition-colors duration-200`}
                      title="Edit update"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(update.id)}
                      disabled={isDeleting === update.id}
                      className={`p-2 rounded-full ${
                        isDeleting === update.id
                          ? "opacity-50 cursor-not-allowed"
                          : isDarkMode
                            ? "hover:bg-red-900/50 text-red-400"
                            : "hover:bg-red-100 text-red-500"
                      } transition-colors duration-200`}
                      title="Delete update"
                    >
                      {isDeleting === update.id ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin" />
                      ) : (
                        <FaTrash className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedUpdateId === update.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4">
                        <div className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <p className="whitespace-pre-line">{update.content}</p>
                        </div>

                        {update.images && update.images.length > 0 && (
                          <div className="mb-4">
                            <h4
                              className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                            >
                              Lesson Images:
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {update.images.map((image, index) => (
                                <div
                                  key={index}
                                  className="aspect-video rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                                >
                                  <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`Week ${update.weekNumber} lesson image ${index + 1}`}
                                    width={200}
                                    height={150}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div
                            className={`p-3 rounded-lg ${
                              isDarkMode
                                ? "bg-green-900/20 border border-green-800/30"
                                : "bg-green-50 border border-green-100"
                            } transition-colors duration-300`}
                          >
                            <h4
                              className={`text-sm font-medium mb-1 ${isDarkMode ? "text-green-400" : "text-green-700"}`}
                            >
                              Achievements
                            </h4>
                            <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-600"}`}>
                              {update.achievements}
                            </p>
                          </div>

                          <div
                            className={`p-3 rounded-lg ${
                              isDarkMode
                                ? "bg-amber-900/20 border border-amber-800/30"
                                : "bg-amber-50 border border-amber-100"
                            } transition-colors duration-300`}
                          >
                            <h4
                              className={`text-sm font-medium mb-1 ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}
                            >
                              Challenges
                            </h4>
                            <p className={`text-sm ${isDarkMode ? "text-amber-300" : "text-amber-600"}`}>
                              {update.challenges}
                            </p>
                          </div>

                          <div
                            className={`p-3 rounded-lg ${
                              isDarkMode
                                ? "bg-blue-900/20 border border-blue-800/30"
                                : "bg-blue-50 border border-blue-100"
                            } transition-colors duration-300`}
                          >
                            <h4
                              className={`text-sm font-medium mb-1 ${isDarkMode ? "text-blue-400" : "text-blue-700"}`}
                            >
                              Next Steps
                            </h4>
                            <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>
                              {update.nextSteps}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Weekly Update Modal - Enhanced with better week selection and dark mode support */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUpdate ? "Edit Weekly Update" : "Add Weekly Update"}
      >
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Week Number and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="weekNumber"
                  className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Week Number
                </label>
                <select
                  id="weekNumber"
                  name="weekNumber"
                  value={formData.weekNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-md border ${
                    isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                  required
                >
                  {availableWeeks.map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="date"
                  className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Lesson Date
                </label>
                <div className={`relative ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCalendarAlt className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full p-2 pl-10 rounded-md border ${
                      isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Lesson Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What was the focus of this lesson?"
                className={`w-full p-2 rounded-md border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Lesson Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Describe what was covered in this lesson..."
                rows={4}
                className={`w-full p-2 rounded-md border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Achievements */}
            <div>
              <label
                htmlFor="achievements"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Achievements
              </label>
              <textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                placeholder="What did students accomplish in this lesson?"
                rows={2}
                className={`w-full p-2 rounded-md border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Challenges */}
            <div>
              <label
                htmlFor="challenges"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Challenges
              </label>
              <textarea
                id="challenges"
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                placeholder="What difficulties did students face?"
                rows={2}
                className={`w-full p-2 rounded-md border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Next Steps */}
            <div>
              <label
                htmlFor="nextSteps"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Next Steps
              </label>
              <textarea
                id="nextSteps"
                name="nextSteps"
                value={formData.nextSteps}
                onChange={handleInputChange}
                placeholder="What will be covered in the next lesson?"
                rows={2}
                className={`w-full p-2 rounded-md border ${
                  isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                required
              />
            </div>

            {/* Image upload */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Lesson Images
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Lesson image ${index + 1}`}
                      width={200}
                      height={150}
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
                  className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer ${
                    isDarkMode
                      ? "border-gray-600 hover:border-gray-500 bg-slate-700/50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  } transition-colors duration-300`}
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

          {/* Progress indicator - Enhanced with better visual feedback */}
          <div className="mt-6 mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Student Progress
            </label>
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progressPercentage || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, progressPercentage: Number.parseInt(e.target.value) }))
                    }
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer 
                      ${isDarkMode ? "bg-slate-600" : "bg-gray-200"}`}
                  />
                </div>
                <div className={`w-12 text-center font-medium ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                  {formData.progressPercentage || 0}%
                </div>
              </div>

              {/* Progress visualization */}
              <div
                className={`mt-2 h-2 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}
              >
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${formData.progressPercentage || 0}%` }}
                ></div>
              </div>

              <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Estimate how much of the course material the student has mastered after this lesson
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="px-4">
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
                  <span>{editingUpdate ? "Update" : "Save"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
