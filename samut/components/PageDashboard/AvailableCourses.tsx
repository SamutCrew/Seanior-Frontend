"use client"
import { useState } from "react"
import { FaUsers, FaCalendarAlt, FaClock, FaChevronDown, FaChevronUp, FaCog, FaStar } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Available Courses</h2>
        <Link
          href="/dashboard/courses"
          className={`${
            isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
        >
          View All Courses
        </Link>
      </div>

      {availableCourses.length === 0 ? (
        <div
          className={`p-8 text-center rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
          }`}
        >
          <p>No available courses at the moment.</p>
          <Link
            href="/dashboard/courses/create"
            className={`inline-block mt-4 ${
              isDarkMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-sky-600 hover:bg-sky-700"
            } text-white px-4 py-2 rounded-md font-medium`}
          >
            Create New Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {availableCourses.map((course) => (
            <div
              key={course.id}
              className={`${
                isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
              } rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex">
                {/* Instructor Image */}
                <div className="relative w-24 h-auto flex-shrink-0 border-r border-slate-700">
                  {course.image ? (
                    <div className="relative h-full min-h-[120px]">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.instructor}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-full min-h-[120px] bg-gradient-to-b from-blue-500 to-cyan-400 flex items-center justify-center">
                      <span className="text-white font-medium">{course.instructor?.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-4 md:p-5 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-2 md:mb-0">
                      <div className="flex items-center">
                        <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                          {course.instructor}
                        </h3>
                        <div className="flex items-center ml-3">
                          <FaStar className="text-amber-400" size={14} />
                          <span className={`ml-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            {course.rating}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {course.title} • {course.level}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-2 mb-3">
                        <div className={`w-full h-1.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} rounded-full`}>
                          <div
                            className="bg-blue-500 rounded-full h-1.5"
                            style={{
                              width: `${Math.min((course.students / (course.maxStudents || 1)) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/dashboard/courses/manage/${course.id}`}
                        className={`px-4 py-2 rounded-lg ${
                          isDarkMode
                            ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                            : "bg-sky-600 hover:bg-sky-700 text-white"
                        } transition-colors duration-200 font-medium text-sm flex items-center gap-2`}
                      >
                        <FaCog size={14} /> Manage
                      </Link>
                      <button
                        onClick={() => toggleExpand(course.id)}
                        className={`p-2 rounded-full ${
                          isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                        } transition-colors`}
                      >
                        {expandedCourse === course.id ? (
                          <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                        ) : (
                          <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Course Stats - Always visible */}
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} size={14} />
                      <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className={isDarkMode ? "text-cyan-400" : "text-sky-600"} size={14} />
                      <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {course.students}/{course.maxStudents || 0} Students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className={isDarkMode ? "text-cyan-400" : "text-sky-600"} size={14} />
                      <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {course.schedule}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedCourse === course.id && (
                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Image */}
                        {course.image && (
                          <div className="md:col-span-2">
                            <div className="relative h-48 w-full rounded-lg overflow-hidden">
                              <Image
                                src={course.image || "/placeholder.svg"}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Focus
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{course.focus}</p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Location
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                            {course.location.address}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Price
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>${course.price}</p>
                        </div>
                        <div>
                          <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Max Students
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                            {course.maxStudents}
                          </p>
                        </div>
                        {course.description && (
                          <div className="md:col-span-2">
                            <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Description
                            </p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                              {course.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
