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

      // Check if location is already a string (already formatted)
      if (typeof data.location === "string") {
        // Location is already formatted, proceed with submission
        await onSubmit(data)
        return
      }

      // Ensure location has all required properties if it's an object
      if (typeof data.location === "object" && data.location !== null) {
        if (!data.location.lat || !data.location.lng || !data.location.address) {
          console.error("Location data is incomplete")
          setIsSubmitting(false)
          return
        }
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

        {/* คำแนะนำการกรอกฟอร์ม */}
        <div
          className={`mb-6 p-4 rounded-lg ${isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50 border border-blue-100"}`}
        >
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            คำแนะนำการกรอกข้อมูล
          </h3>
          <ul className={`list-disc pl-5 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>กรอกชื่อคอร์สและรายละเอียดให้ครบถ้วน</li>
            <li>ราคาให้กรอกเป็นบาท เช่น 10.00 สำหรับ 10 บาท (ระบบจะแปลงเป็นสตางค์อัตโนมัติ)</li>
            <li>เลือกสถานที่และประเภทสระว่ายน้ำให้ถูกต้อง</li>
            <li>กำหนดตารางเวลาเรียนโดยเลือกวันและช่วงเวลา</li>
          </ul>
        </div>

        <EnhancedCourseForm onSubmit={handleSubmit} onCancel={onClose} isSubmitting={isSubmitting} />
      </div>
    </Modal>
  )
}
