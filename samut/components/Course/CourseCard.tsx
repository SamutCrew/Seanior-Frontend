"use client"
import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserPlus, FaStar, FaUsers } from "react-icons/fa"
import type { Course } from "@/types/course"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"
import { motion } from "framer-motion"
import Link from "next/link"

interface CourseCardProps {
  course: Course
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
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
          return `${baseClasses} bg-green-900/40 text-green-300 border border-green-800`
        case "intermediate":
          return `${baseClasses} bg-blue-900/40 text-blue-300 border border-blue-800`
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
          return `${baseClasses} bg-green-50 text-green-700 border border-green-200`
        case "intermediate":
          return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`
        case "advanced":
          return `${baseClasses} bg-purple-50 text-purple-700 border border-purple-200`
        case "expert":
          return `${baseClasses} bg-red-50 text-red-700 border border-red-200`
        default:
          return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={`rounded-xl overflow-hidden transition-all duration-300 group
        ${isDarkMode 
          ? "bg-slate-800 border border-slate-700 hover:border-cyan-700 shadow-lg shadow-slate-900/30" 
          : "bg-white border border-gray-100 hover:border-cyan-200 shadow-md hover:shadow-lg"
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
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode 
          ? "from-slate-900/90 to-transparent" 
          : "from-black/60 to-transparent"}`}>
        </div>
        
        {/* Course Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{course.title}</h3>
          <div className="flex items-center justify-between">
            <span className={getLevelBadgeStyle(course.level)}>
              {course.level}
            </span>
            <span className="text-xl font-bold text-white drop-shadow-md">${course.price}</span>
          </div>
        </div>
      </div>
      
      {/* Instructor Section */}
      <div className={`flex items-center p-4 ${isDarkMode ? "border-b border-slate-700" : "border-b border-gray-100"}`}>
        <div className={`relative h-14 w-14 rounded-full overflow-hidden border-2 shadow-md
          ${isDarkMode ? "border-cyan-700" : "border-cyan-100"}`}>
          <Image
            src={instructorImage || "/placeholder.svg"}
            alt={`Instructor ${course.instructor}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <div className="flex items-center gap-1">
            <p className={`text-xs font-medium ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>INSTRUCTOR</p>
            <div className="flex items-center gap-1 text-amber-500 ml-2">
              <FaStar className="text-xs" />
              <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
            </div>
          </div>
          <h4 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.instructor}</h4>
        </div>
        
        {/* Join Anytime Badge */}
        <div className="ml-auto">
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
            ${isDarkMode 
              ? "bg-cyan-900/30 text-cyan-300 border border-cyan-800/50" 
              : "bg-cyan-50 text-cyan-700 border border-cyan-100"}`}>
            <FaUserPlus className="text-xs" />
            <span>Join Anytime</span>
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-4">
        <p className={`text-sm mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>{course.focus}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
            <span>{course.duration}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaClock className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
            <span>{course.schedule}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaMapMarkerAlt className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
            <span>{course.location.address}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
            <FaUsers className={isDarkMode ? "text-cyan-400" : "text-cyan-600"} />
            <span>1-on-1 Training</span>
          </div>
        </div>
        
        {/* Course Stats */}
        <div className={`flex items-center justify-between pt-3 ${isDarkMode ? "border-t border-slate-700" : "border-t border-gray-100"}`}>
          <div>
            <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Students</p>
            <p className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.students}</p>
          </div>
          <div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${isDarkMode 
                ? "bg-slate-700 text-slate-300" 
                : "bg-gray-100 text-gray-700"}`}>
              {course.courseType || "Private"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className={`p-4 ${isDarkMode ? "bg-slate-900" : "bg-gray-50"} border-t ${isDarkMode ? "border-slate-700" : "border-gray-100"}`}>
          <div className="flex justify-between">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(course)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                  ${isDarkMode 
                    ? "bg-cyan-900/50 hover:bg-cyan-800 text-cyan-300" 
                    : "bg-cyan-100 hover:bg-cyan-200 text-cyan-700"}`}
              >
                <FaEdit /> Edit
              </motion.button>
            )}

            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(course)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200
                  ${isDarkMode 
                    ? "bg-red-900/30 hover:bg-red-900/50 text-red-300" 
                    : "bg-red-100 hover:bg-red-200 text-red-700"}`}
              >
                <FaTrash /> Delete
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Join Now Button - Only show if no edit/delete buttons */}
      {!onEdit && !onDelete && (
        <div className={`p-4 ${isDarkMode ? "bg-slate-900" : "bg-gray-50"} border-t ${isDarkMode ? "border-slate-700" : "border-gray-100"}`}>
          <Link href={`/course/${course.id}`}>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <FaUserPlus /> Join Now
            </motion.button>
          </Link>
        </div>
      )}
    </motion.div>
  )
}
