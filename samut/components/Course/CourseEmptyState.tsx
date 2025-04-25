"use client"

import { FaPlus } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"

interface CourseEmptyStateProps {
  hasAnyCourses: boolean
  onCreateCourse: () => void
}

export default function CourseEmptyState({ hasAnyCourses, onCreateCourse }: CourseEmptyStateProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div
      className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} rounded-xl shadow-sm p-12 text-center transition-all duration-300 border`}
    >
      <div className="max-w-md mx-auto">
        <div className="text-5xl mb-4 text-gray-300">🏊‍♂️</div>
        <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
          {hasAnyCourses ? "No matching courses" : "No courses yet"}
        </h3>
        <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {hasAnyCourses ? "Try adjusting your search filters" : "Create your first swimming course to get started"}
        </p>
        <button
          onClick={onCreateCourse}
          className={`${
            isDarkMode
              ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
              : "bg-sky-600 hover:bg-sky-700"
          } text-white px-6 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors duration-200`}
        >
          <FaPlus /> Create Course
        </button>
      </div>
    </div>
  )
}
