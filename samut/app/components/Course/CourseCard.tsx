"use client"

import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChalkboardTeacher, FaStar } from "react-icons/fa"
import type { Course } from "@/app/types/course"
import { getLevelColor } from "@/app/utils/courseHelpers"

interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <FaStar />
            <span className="font-medium">{course.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.focus}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaCalendarAlt className="text-sky-600" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaClock className="text-sky-600" />
            <span>{course.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaMapMarkerAlt className="text-sky-600" />
            <span>{course.location.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaChalkboardTeacher className="text-sky-600" />
            <span>{course.instructor}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500">Students</p>
            <p className="font-bold text-gray-800">{course.students}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-bold text-gray-800">${course.price}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t">
        <div className="flex justify-between">
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
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
