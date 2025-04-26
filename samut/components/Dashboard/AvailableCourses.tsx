"use client"
import { useState } from "react"
import { FaUsers, FaCalendarAlt, FaClock } from "react-icons/fa"
import type { Course } from "@/types/course"
import { useAppSelector } from "@/app/redux"

interface AvailableCoursesProps {
  availableCourses: Course[]
}

export default function AvailableCourses({ availableCourses }: AvailableCoursesProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)

  const toggleExpand = (courseId: number) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  return (
    <div className="space-y-4">
      {availableCourses.map((course) => (
        <div
          key={course.id}
          className={`${
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          } rounded-xl shadow-sm border overflow-hidden`}
        >
          <div
            className={`p-4 cursor-pointer ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-50"}`}
            onClick={() => toggleExpand(course.id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.title}</h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.focus}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Students</p>
                  <div className="flex items-center gap-1">
                    <FaUsers className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {course.students}/{course.maxStudents || 0}
                    </p>
                  </div>
                </div>
                <div
                  className={`h-8 w-8 flex items-center justify-center rounded-full transition-transform ${
                    expandedCourse === course.id ? "rotate-180" : ""
                  } ${isDarkMode ? "bg-slate-700 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Capacity</span>
                <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  {Math.round((course.students / (course.maxStudents || course.students)) * 100)}%
                </span>
              </div>
              <div className={`w-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full`}>
                <div
                  className={`${isDarkMode ? "bg-cyan-500" : "bg-sky-600"} rounded-full h-2`}
                  style={{
                    width: `${Math.min((course.students / (course.maxStudents || course.students)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {expandedCourse === course.id && (
            <div
              className={`p-4 border-t ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-gray-50"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} /> {course.duration}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Schedule</p>
                  <p
                    className={`text-sm font-medium flex items-center gap-1 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <FaClock className={isDarkMode ? "text-cyan-400" : "text-sky-600"} /> {course.schedule}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {course.location.address}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
