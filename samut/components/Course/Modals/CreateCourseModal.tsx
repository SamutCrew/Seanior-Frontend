"use client"
import EnhancedCourseForm from "../EnhancedCourseForm"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"
import { useState } from "react"

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Course>) => void
  stats: {
    totalCourses: number
    totalStudents: number
    avgRating: string
    totalRevenue: number
  }
}

export default function CreateCourseModal({ isOpen, onClose, onSubmit, stats }: CreateCourseModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (data: Partial<Course>) => {
    try {
      setIsSubmitting(true)

      // Make sure number_of_total_sessions is included
      if (!data.number_of_total_sessions) {
        data.number_of_total_sessions = 8 // Default value
      }

      // Validate that required fields are present
      if (!data.course_name || !data.location || !data.description) {
        console.error("Missing required fields")
        setIsSubmitting(false)
        return // Don't proceed if required fields are missing
      }

      await onSubmit(data)
    } catch (error) {
      console.error("Error submitting course:", error)
      // Don't close the modal on error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Course" size="xl">
      <div className="p-6">
        {/* Stats in Create Modal */}
        <div className={`${isDarkMode ? "bg-slate-700" : "bg-sky-50"} rounded-xl p-5 mb-6 transition-all duration-200`}>
          <h3 className={`font-medium ${isDarkMode ? "text-cyan-400" : "text-sky-700"} mb-3`}>Your Current Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Courses</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{stats.totalCourses}</p>
            </div>
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Students</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {stats.totalStudents}
              </p>
            </div>
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Avg Rating</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{stats.avgRating}</p>
            </div>
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Revenue</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <EnhancedCourseForm onSubmit={handleSubmit} onCancel={onClose} isSubmitting={isSubmitting} />
      </div>
    </Modal>
  )
}
