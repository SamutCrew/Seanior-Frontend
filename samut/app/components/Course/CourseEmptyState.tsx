"use client"

import { FaPlus } from "react-icons/fa"

interface CourseEmptyStateProps {
  hasAnyCourses: boolean
  onCreateCourse: () => void
}

export default function CourseEmptyState({ hasAnyCourses, onCreateCourse }: CourseEmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center transition-all duration-300 border border-gray-100">
      <div className="max-w-md mx-auto">
        <div className="text-5xl mb-4 text-gray-300">🏊‍♂️</div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          {hasAnyCourses ? "No matching courses" : "No courses yet"}
        </h3>
        <p className="text-gray-500 mb-6">
          {hasAnyCourses ? "Try adjusting your search filters" : "Create your first swimming course to get started"}
        </p>
        <button
          onClick={onCreateCourse}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 transition-colors duration-200"
        >
          <FaPlus /> Create Course
        </button>
      </div>
    </div>
  )
}
