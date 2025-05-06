"use client"
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaUsers, FaSwimmer } from "react-icons/fa"
import { HiAcademicCap, HiCurrencyDollar, HiUserGroup } from "react-icons/hi"
import type { Course } from "@/types/course"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"
import { motion } from "framer-motion"
import Link from "next/link"

interface CourseCardProps {
  course: Course
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
  variant?: "compact" | "featured" | "standard"
}

export default function CourseCard({ course, onEdit, onDelete, variant = "standard" }: CourseCardProps) {
  // Get dark mode state from Redux store
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Default instructor image if not provided
  const instructorImage =
    course.instructorImage ||
    `/placeholder.svg?height=200&width=200&query=swimming instructor portrait ${course.instructor}`

  // Default course image if not provided
  const courseImage = course.image || `/placeholder.svg?height=400&width=800&query=swimming pool ${course.level} class`

  // Function to get level badge styling
  const getLevelBadgeStyle = (level: string) => {
    const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full"

    if (isDarkMode) {
      switch (level.toLowerCase()) {
        case "beginner":
          return `${baseClasses} bg-emerald-900/40 text-emerald-300 border border-emerald-800`
        case "intermediate":
          return `${baseClasses} bg-amber-900/40 text-amber-300 border border-amber-800`
        case "advanced":
          return `${baseClasses} bg-purple-900/40 text-purple-300 border border-purple-800`
        case "expert":
          return `${baseClasses} bg-red-900/40 text-red-300 border border-red-800`
        default:
          return `${baseClasses} bg-slate-800 text-slate-300 border border-slate-700`
      }
    } else {
      switch (level.toLowerCase()) {
        case "beginner":
          return `${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`
        case "intermediate":
          return `${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`
        case "advanced":
          return `${baseClasses} bg-purple-50 text-purple-700 border border-purple-200`
        case "expert":
          return `${baseClasses} bg-red-50 text-red-700 border border-red-200`
        default:
          return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`
      }
    }
  }

  // Render featured variant - simplified to match the image
  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`rounded-xl overflow-hidden group ${
          isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100"
        } shadow-lg h-full`}
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Image */}
          <div className="relative md:w-2/5 h-64 md:h-auto">
            <Image src={courseImage || "/placeholder.svg"} alt={course.title} fill className="object-cover" />

            {/* Featured Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg">
              Featured Course
            </div>

            {/* Course Title Overlay */}
            <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-xl font-bold text-white">{course.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className={getLevelBadgeStyle(course.level)}>{course.level}</span>
                <div className="flex items-center gap-1 text-white">
                  <FaStar className="text-amber-400" />
                  <span>{course.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm mt-2 line-clamp-2">{course.focus}</p>
            </div>
          </div>

          {/* Right side - Course Info */}
          <div className="p-5 md:w-3/5 flex flex-col">
            {/* Instructor */}
            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
                <Image
                  src={instructorImage || "/placeholder.svg"}
                  alt={`Instructor ${course.instructor}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-indigo-600">INSTRUCTOR</p>
                <h4 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {course.instructor}
                </h4>
              </div>
            </div>

            {/* Schedule & Location */}
            <div className="flex mb-4">
              <div className="mr-6">
                <div className="flex items-center mb-1">
                  <FaCalendarAlt className="text-indigo-500 mr-2" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.schedule}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-indigo-500 mr-2" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.duration}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <FaMapMarkerAlt className="text-indigo-500 mr-2" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {course.location.address}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUsers className="text-indigo-500 mr-2" />
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {course.students} Students
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Enroll */}
            <div className="mt-auto flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  ${course.price}
                </div>
                <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {course.courseType || "public-pool"}
                </span>
              </div>

              <Link href={`/course/${course.id}`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition-all duration-200"
                >
                  Enroll Now
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render compact variant
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className={`rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col
          ${
            isDarkMode
              ? "bg-slate-800 border border-slate-700 hover:border-indigo-700 shadow-lg shadow-slate-900/30"
              : "bg-white border border-gray-100 hover:border-indigo-200 shadow-md hover:shadow-lg"
          }`}
      >
        {/* Course Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={courseImage || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className={getLevelBadgeStyle(course.level)}>{course.level}</span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                isDarkMode ? "bg-slate-900/80 text-white" : "bg-white/90 text-gray-800"
              } backdrop-blur-sm`}
            >
              ${course.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className={`text-lg font-bold mb-1 line-clamp-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            {course.title}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <div className="relative h-6 w-6 rounded-full overflow-hidden">
              <Image
                src={instructorImage || "/placeholder.svg"}
                alt={`Instructor ${course.instructor}`}
                fill
                className="object-cover"
              />
            </div>
            <span className={`text-xs ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>{course.instructor}</span>
            <div className="flex items-center gap-1 ml-auto">
              <FaStar className="text-amber-400 text-xs" />
              <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className={`text-xs mb-3 line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            {course.focus}
          </p>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className={`flex items-center gap-1 text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              <FaCalendarAlt className="text-xs" />
              <span>{course.duration}</span>
            </div>
            <Link href={`/course/${course.id}`}>
              <button
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                } transition-colors`}
              >
                View Details
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render standard variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={`rounded-xl overflow-hidden transition-all duration-300 group h-full flex flex-col
        ${
          isDarkMode
            ? "bg-slate-800 border border-slate-700 hover:border-indigo-600 shadow-lg shadow-slate-900/30"
            : "bg-white border border-gray-100 hover:border-indigo-200 shadow-md hover:shadow-lg"
        }`}
    >
      {/* Course Image with Overlay */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={courseImage || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode ? "from-slate-900/90 to-transparent" : "from-black/60 to-transparent"
          }`}
        ></div>

        {/* Course Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{course.title}</h3>
          <div className="flex items-center justify-between">
            <span className={getLevelBadgeStyle(course.level)}>{course.level}</span>
            <div className="flex items-center gap-1 bg-black/30 text-white px-2 py-1 rounded-full text-xs">
              <HiCurrencyDollar className="text-amber-400" />
              <span className="font-bold">{course.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-4 flex-grow">
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-1">
            <div className={`p-1.5 rounded-full ${isDarkMode ? "bg-indigo-900/50" : "bg-indigo-100"}`}>
              <FaSwimmer className={`text-sm ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
              {course.focus}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <FaStar className="text-amber-400" />
            <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {course.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaCalendarAlt className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
            <span>{course.duration}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaClock className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
            <span>{course.schedule}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaMapMarkerAlt className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
            <span>{course.location.address}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <HiUserGroup className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
            <span>{course.students} Students</span>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      <div
        className={`px-4 pt-3 pb-4 mt-auto ${isDarkMode ? "border-t border-slate-700" : "border-t border-gray-100"}`}
      >
        <div className="flex items-center mb-4">
          <div
            className={`relative h-10 w-10 rounded-full overflow-hidden border-2 shadow-md
            ${isDarkMode ? "border-indigo-700" : "border-indigo-100"}`}
          >
            <Image
              src={instructorImage || "/placeholder.svg"}
              alt={`Instructor ${course.instructor}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Instructor</p>
            <h4 className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.instructor}</h4>
          </div>
          <div className="ml-auto">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-700"}`}
            >
              {course.courseType || "Private"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-between">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(course)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                  ${
                    isDarkMode
                      ? "bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300"
                      : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                  }`}
              >
                Edit
              </motion.button>
            )}

            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(course)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                  ${
                    isDarkMode
                      ? "bg-red-900/30 hover:bg-red-900/50 text-red-300"
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
              >
                Delete
              </motion.button>
            )}
          </div>
        )}

        {/* Join Now Button - Only show if no edit/delete buttons */}
        {!onEdit && !onDelete && (
          <Link href={`/course/${course.id}`}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <HiAcademicCap /> Enroll Now
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}
