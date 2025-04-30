"use client"

import { motion } from "framer-motion"
import {
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHome,
  FaBuilding,
  FaSwimmingPool,
} from "react-icons/fa"
import type { Course } from "@/types/course"
import { useAppSelector } from "@/app/redux"
import Link from "next/link"

interface CoursesSectionProps {
  courses: Course[]
}

// Define course types
type CourseType = "private-location" | "public-pool" | "teacher-pool"

// Extended Course interface with course type
interface ExtendedCourse extends Course {
  courseType?: CourseType
}

export default function CoursesSection({ courses }: CoursesSectionProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Function to get course type icon and color
  const getCourseTypeInfo = (course: ExtendedCourse) => {
    // Default to public-pool if not specified
    const courseType = course.courseType || "public-pool"

    switch (courseType) {
      case "private-location":
        return {
          icon: <FaHome className="mr-2" />,
          label: "Private Location",
          color: isDarkMode
            ? "bg-purple-900/30 text-purple-400 border-purple-800/50"
            : "bg-purple-100 text-purple-800 border border-purple-200",
        }
      case "public-pool":
        return {
          icon: <FaBuilding className="mr-2" />,
          label: "Public Pool",
          color: isDarkMode
            ? "bg-blue-900/30 text-blue-400 border-blue-800/50"
            : "bg-blue-100 text-blue-800 border border-blue-200",
        }
      case "teacher-pool":
        return {
          icon: <FaSwimmingPool className="mr-2" />,
          label: "Teacher's Pool",
          color: isDarkMode
            ? "bg-green-900/30 text-green-400 border-green-800/50"
            : "bg-green-100 text-green-800 border border-green-200",
        }
      default:
        return {
          icon: <FaSwimmingPool className="mr-2" />,
          label: "Standard",
          color: isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800",
        }
    }
  }

  // Assign course types to courses if not already assigned
  const extendedCourses: ExtendedCourse[] = courses.map((course, index) => {
    if ((course as ExtendedCourse).courseType) {
      return course as ExtendedCourse
    }

    // Assign course types based on index for demo purposes
    const courseTypes: CourseType[] = ["public-pool", "teacher-pool", "private-location"]
    return {
      ...course,
      courseType: courseTypes[index % courseTypes.length],
    }
  })

  if (!extendedCourses || extendedCourses.length === 0) {
    return (
      <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        <p>This instructor doesn't have any courses available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
      >
        Available Courses
      </motion.h2>

      <div className="grid grid-cols-1 gap-6">
        {extendedCourses.map((course, index) => {
          const courseTypeInfo = getCourseTypeInfo(course)

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                isDarkMode
                  ? "bg-slate-700/50 border border-slate-600 hover:bg-slate-700"
                  : "bg-white border border-gray-100 hover:shadow-md"
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          course.level === "Beginner"
                            ? isDarkMode
                              ? "bg-green-900/30 text-green-400 border border-green-800/50"
                              : "bg-green-100 text-green-800 border border-green-200"
                            : course.level === "Intermediate"
                              ? isDarkMode
                                ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                              : isDarkMode
                                ? "bg-purple-900/30 text-purple-400 border border-purple-800/50"
                                : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}
                      >
                        {course.level}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <FaStar />
                        <span className="font-medium">{course.rating.toFixed(1)}</span>
                      </div>

                      {/* Course Type Badge */}
                      <span
                        className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${courseTypeInfo.color}`}
                      >
                        {courseTypeInfo.icon}
                        {courseTypeInfo.label}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {course.title}
                    </h3>

                    <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.focus}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{course.duration}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaClock className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{course.schedule}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                          {course.location.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaUsers className={isDarkMode ? "text-cyan-400" : "text-sky-600"} />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                          {course.students} students enrolled
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-2">
                    <div className={`text-center md:text-right ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      <span className="text-sm">Price</span>
                      <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        ${course.price}
                      </p>
                    </div>

                    <Link href={`/teacher/${1}/course/${course.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white"
                            : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                        }`}
                      >
                        View Details <FaArrowRight />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
