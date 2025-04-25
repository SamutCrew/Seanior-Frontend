"use client"

import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaUsers, FaDollarSign, FaStar } from "react-icons/fa"
import type { Course } from "@/types/course"
import { getLevelColor } from "@/utils/courseHelpers"
import { useAppSelector } from "@/app/redux"

interface CourseListProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export default function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className="mb-8 space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className={`${
            isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-gray-100 hover:shadow-md"
          } rounded-xl shadow-sm overflow-hidden transition-all duration-200 border`}
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
                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {course.title}
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.focus}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} /> {course.duration}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Schedule</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    <FaClock className={isDarkMode ? "text-cyan-400" : "text-sky-600"} /> {course.schedule}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Students</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    <FaUsers className={isDarkMode ? "text-cyan-400" : "text-sky-600"} /> {course.students}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Price</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                  >
                    <FaDollarSign className={isDarkMode ? "text-cyan-400" : "text-sky-600"} /> {course.price}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(course)}
                  className={`${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-cyan-400"
                      : "bg-sky-100 hover:bg-sky-200 text-sky-700"
                  } px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(course)}
                  className={`${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-red-400"
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  } px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
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
