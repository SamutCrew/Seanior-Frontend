"use client"
import { FaCalendarAlt, FaClock, FaStar, FaTrash, FaEdit, FaUsers } from "react-icons/fa"
import { HiCurrencyDollar } from "react-icons/hi"
import { MdPublic, MdPool, MdHome } from "react-icons/md"
import type { Course } from "@/types/course"
import { useAppSelector } from "@/app/redux"
import { motion } from "framer-motion"
import { formatDbPrice } from "@/utils/moneyUtils"

interface CourseListItemProps {
  course: Course
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
}

/**
 * Format a time string to AM/PM format
 */
const formatTime = (time: string): string => {
  if (!time) return "N/A"
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Format schedule data into a readable string
 */
const formatSchedule = (schedule: any): string => {
  try {
    // If it's already a string but not JSON, return it
    if (typeof schedule === "string" && !schedule.includes('"selected"') && !schedule.includes('"ranges"')) {
      // Clean up any raw JSON formatting
      if (schedule.includes('["Monday')) {
        return schedule.replace(/\[|\]|"/g, "").replace(/\\"/g, '"')
      }
      return schedule
    }

    // Parse JSON string if needed
    let scheduleObj = schedule
    if (typeof schedule === "string") {
      try {
        scheduleObj = JSON.parse(schedule)
      } catch (error) {
        // If it contains schedule-like patterns but can't be parsed, try to extract day info
        if (schedule.includes("Monday") || schedule.includes("Tuesday")) {
          const dayMatches = schedule.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^,}]+/g)
          if (dayMatches) {
            return dayMatches.join(" • ")
          }
        }
        return "Flexible schedule"
      }
    }

    // Handle flexible schedule object
    if (scheduleObj && typeof scheduleObj === "object" && "flexible" in scheduleObj) {
      return "Flexible schedule"
    }

    // Handle standard schedule object with days
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const selectedDays = []

    for (const day of days) {
      if (scheduleObj[day] && scheduleObj[day].selected) {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1)
        const ranges = scheduleObj[day].ranges || []

        if (ranges.length === 0) {
          selectedDays.push(dayName)
          continue
        }

        // Format the first time range for this day
        const firstRange = ranges[0]
        const timeStr = `${formatTime(firstRange.start)} - ${formatTime(firstRange.end)}`
        selectedDays.push(`${dayName} ${timeStr}`)
      }
    }

    return selectedDays.length > 0 ? selectedDays.join(" • ") : "Flexible schedule"
  } catch (error) {
    console.error("Error formatting schedule:", error)
    return "Schedule format error"
  }
}

/**
 * Get pool type icon and styling
 */
const getPoolTypeInfo = (type: string, isDarkMode: boolean) => {
  // Define the three pool types
  const types = {
    "public-pool": {
      icon: MdPublic,
      label: "Public Pool",
      colorClass: isDarkMode
        ? "bg-blue-900/40 text-blue-300 border-blue-800"
        : "bg-blue-50 text-blue-700 border-blue-200",
    },
    "private-pool": {
      icon: MdPool,
      label: "Private Pool",
      colorClass: isDarkMode
        ? "bg-violet-900/40 text-violet-300 border-violet-800"
        : "bg-violet-50 text-violet-700 border-violet-200",
    },
    "private-location": {
      icon: MdHome,
      label: "Private Location",
      colorClass: isDarkMode
        ? "bg-amber-900/40 text-amber-300 border-amber-800"
        : "bg-amber-50 text-amber-700 border-amber-200",
    },
  }

  // Normalize the type string
  const normalizedType = type ? type.toLowerCase().trim() : "public-pool"

  // Find the matching type or use a default
  const typeInfo = Object.entries(types).find(([key]) => normalizedType === key || normalizedType.includes(key))

  return typeInfo
    ? typeInfo[1]
    : {
        icon: MdPublic,
        label: type || "Public Pool",
        colorClass: isDarkMode
          ? "bg-slate-800 text-slate-300 border-slate-700"
          : "bg-gray-50 text-gray-700 border-gray-200",
      }
}

/**
 * Get level badge styling
 */
const getLevelBadgeStyle = (level: string, isDarkMode: boolean) => {
  const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full"

  if (isDarkMode) {
    switch (level?.toLowerCase()) {
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
    switch (level?.toLowerCase()) {
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

export default function CourseListItem({ course, onEdit, onDelete }: CourseListItemProps) {
  // Get dark mode state from Redux store
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Get course title (handle both title and course_name)
  const courseTitle = course.title || course.course_name || "Untitled Course"

  // Get course ID (handle both id and course_id)
  const courseId = course.id || course.course_id || "unknown"

  // Get course type with enhanced styling
  const courseType = course.courseType || course.pool_type || "public-pool"
  const poolTypeInfo = getPoolTypeInfo(courseType, isDarkMode)
  const PoolTypeIcon = poolTypeInfo.icon

  // Get formatted schedule
  const scheduleStr = formatSchedule(course.schedule)

  // Get level badge style
  const levelBadgeStyle = getLevelBadgeStyle(course.level, isDarkMode)

  // Format price using the utility function
  const formattedPrice = formatDbPrice(course.price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg p-4 mb-4 ${
        isDarkMode ? "bg-slate-800/70 hover:bg-slate-800" : "bg-white hover:bg-gray-50"
      } border ${isDarkMode ? "border-slate-700" : "border-gray-200"} transition-colors duration-200 shadow-sm`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Course Info */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className={levelBadgeStyle}>{course.level || "Beginner"}</span>
            <div className="flex items-center">
              <FaStar className="text-amber-400 mr-1" />
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {(course.rating || 4.5).toFixed(1)}
              </span>
            </div>
          </div>

          <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{courseTitle}</h3>

          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {course.course_id || course.id || ""}
          </p>
        </div>

        {/* Duration */}
        <div className="min-w-[120px]">
          <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration</p>
          <div className="flex items-center">
            <FaClock className={`mr-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <span className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {course.duration || `${course.course_duration || 8} weeks`}
            </span>
          </div>
        </div>

        {/* Schedule */}
        <div className="min-w-[200px] lg:min-w-[250px]">
          <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Schedule</p>
          <div className="flex items-center">
            <FaCalendarAlt className={`mr-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <span className={`${isDarkMode ? "text-white" : "text-gray-800"} text-sm`}>{scheduleStr}</span>
          </div>
        </div>

        {/* Students */}
        <div className="min-w-[100px]">
          <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Students</p>
          <div className="flex items-center">
            <FaUsers className={`mr-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <span className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.students || 0}</span>
          </div>
        </div>

        {/* Price */}
        <div className="min-w-[100px]">
          <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Price</p>
          <div className="flex items-center">
            <HiCurrencyDollar className={`mr-1 text-lg ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            <span className={`${isDarkMode ? "text-white" : "text-gray-800"} font-bold`}>{formattedPrice}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 min-w-[120px] justify-end">
          {onEdit && (
            <button
              onClick={() => onEdit(course)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <FaEdit />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(course)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-slate-700 hover:bg-red-900/50 text-gray-300 hover:text-red-300"
                  : "bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700"
              }`}
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
