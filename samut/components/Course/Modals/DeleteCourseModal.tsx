"use client"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"
import { FaExclamationTriangle } from "react-icons/fa"

interface DeleteCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  course: Course | null
  isLoading?: boolean
  error?: string | null
}

export default function DeleteCourseModal({
  isOpen,
  onClose,
  onConfirm,
  course,
  isLoading,
  error,
}: DeleteCourseModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (!isOpen || !course) return null

  // Check if the error is related to foreign key constraints
  const isForeignKeyError =
    error && (error.includes("Foreign key constraint") || error.includes("bookings") || error.includes("associated"))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="p-6">
        {/* Error message */}
        {error && (
          <div
            className={`${
              isDarkMode ? "bg-red-900/30 border-red-800/50 text-red-300" : "bg-red-50 border-red-100 text-red-800"
            } p-4 rounded-lg mb-6 border flex items-start gap-3`}
          >
            <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Unable to delete course</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Confirmation message */}
        {!error && (
          <div
            className={`${
              isDarkMode
                ? "bg-amber-900/30 border-amber-800/50 text-amber-300"
                : "bg-amber-50 border-amber-100 text-amber-800"
            } p-4 rounded-lg mb-6 border`}
          >
            <p>
              Are you sure you want to delete <strong>{course.title}</strong>? This action cannot be undone.
            </p>
          </div>
        )}

        {/* Course details */}
        <div className={`${isDarkMode ? "bg-slate-800" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
          <h3 className="font-medium mb-2">Course Details:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="opacity-70">Title:</span> {course.title}
            </li>
            <li>
              <span className="opacity-70">Level:</span> {course.level}
            </li>
            <li>
              <span className="opacity-70">Students:</span> {course.students} enrolled
            </li>
            <li>
              <span className="opacity-70">Location:</span> {course.location?.address}
            </li>
            <li>
              <span className="opacity-70">ID:</span> {course.id}
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className={`${
              isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            } px-4 py-2 rounded-lg transition-colors duration-200`}
          >
            {error ? "Close" : "Cancel"}
          </button>

          {!error && (
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? "bg-red-900/70 hover:bg-red-800 text-red-100" : "bg-red-600 hover:bg-red-700 text-white"
              } transition-colors duration-200 flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete Course"
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
