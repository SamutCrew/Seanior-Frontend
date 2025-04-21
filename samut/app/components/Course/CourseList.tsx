"use client"

import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaStar } from "react-icons/fa"
import type { Course } from "@/app/types/course"
import { getLevelColor } from "@/app/utils/courseHelpers"

interface CourseListProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export default function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
  return (
    <div className="mb-8 space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100"
        >
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getLevelColor(course.level)}`}
                  >
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <FaStar />
                    <span className="font-medium">{course.rating.toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.focus}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                    <FaCalendarAlt className="text-sky-600" /> {course.duration}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Schedule</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                    <FaClock className="text-sky-600" /> {course.schedule}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                    <FaUsers className="text-sky-600" /> {course.students}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                    <FaDollarSign className="text-sky-600" /> {course.price}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(course)}
                  className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(course)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
