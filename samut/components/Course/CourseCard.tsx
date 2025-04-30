"use client"
import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChalkboardTeacher, FaStar } from "react-icons/fa"
import type { Course } from "@/types/course"
import { getLevelColor } from "@/utils/courseHelpers"
import { useAppSelector } from "@/app/redux"

interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div
      className={`${
        isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white hover:shadow-md border-gray-100"
      } rounded-xl shadow-sm overflow-hidden transition-all duration-200 border`}
    >
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
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.title}</h3>
        <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.focus}</p>

        <div className="space-y-2 mb-4">
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
            <span>{course.duration}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <FaClock className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
            <span>{course.schedule}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <FaMapMarkerAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
            <span>{course.location.address}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <FaChalkboardTeacher className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
            <span>{course.instructor}</span>
          </div>
        </div>

        <div
          className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? "border-slate-700" : "border-t"}`}
        >
          <div>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Students</p>
            <p className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.students}</p>
          </div>
          <div>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Price</p>
            <p className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>${course.price}</p>
          </div>
        </div>
      </div>

      <div
        className={`p-4 ${isDarkMode ? "bg-slate-700" : "bg-gray-50"} border-t ${isDarkMode ? "border-slate-600" : "border-t"}`}
      >
        <div className="flex justify-between">
          <button
            onClick={() => onEdit(course)}
            className={`${
              isDarkMode ? "bg-slate-600 hover:bg-slate-500 text-cyan-400" : "bg-sky-100 hover:bg-sky-200 text-sky-700"
            } px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(course)}
            className={`${
              isDarkMode ? "bg-slate-600 hover:bg-slate-500 text-red-400" : "bg-red-100 hover:bg-red-200 text-red-700"
            } px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
