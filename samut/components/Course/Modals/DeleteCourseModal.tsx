"use client"

import { FaCheck } from "react-icons/fa"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"

interface DeleteCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  course: Course | null
}

export default function DeleteCourseModal({ isOpen, onClose, onConfirm, course }: DeleteCourseModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  if (!isOpen || !course) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="p-6">
        <div
          className={`${
            isDarkMode ? "bg-red-900/30 border-red-800/50 text-red-300" : "bg-red-50 border-red-100 text-red-800"
          } p-4 rounded-lg mb-6 border`}
        >
          <p>
            Are you sure you want to delete <strong>{course.title}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className={`${
              isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200"
            } px-4 py-2 rounded-lg transition-colors duration-200`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${
              isDarkMode ? "bg-red-700 hover:bg-red-600" : "bg-red-600 hover:bg-red-700"
            } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
          >
            <FaCheck /> Confirm Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}
