"use client"
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaSwimmer } from "react-icons/fa"
import { HiAcademicCap, HiCurrencyDollar, HiHome } from "react-icons/hi"
import { MdPublic, MdPool } from "react-icons/md"
import type { Course } from "@/types/course"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"
import { motion } from "framer-motion"
import Link from "next/link"
import { formatDbPrice } from "@/utils/moneyUtils"

interface CourseCardProps {
  course: Course
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
  variant?: "compact" | "featured" | "standard"
}

// Interface for formatted schedule day
interface ScheduleDay {
  day: string
  dayShort: string
  selected: boolean
  timeSlots: string[]
  colorClass: string
}

/**
 * Extract only the address from location data
 */
const formatLocation = (location: any): string => {
  try {
    // If location is a string that looks like JSON, try to parse it
    if (
      typeof location === "string" &&
      (location.includes('"lat"') || location.includes('"lng"') || location.includes('"address"'))
    ) {
      try {
        const parsed = JSON.parse(location)
        return parsed.address || "Address not available"
      } catch (error) {
        // If it contains lat/lng format but can't be parsed, extract just the address part
        const addressMatch = location.match(/"address":"([^"]+)"/)
        if (addressMatch && addressMatch[1]) {
          return addressMatch[1]
        }
        return "Location format error"
      }
    }

    // If it's already an object with an address property
    if (location && typeof location === "object" && "address" in location) {
      return location.address as string
    }

    // If it's a string but not JSON, return it directly
    if (typeof location === "string") {
      return location
    }

    // If it's an object with lat/lng but no address, return a formatted string
    if (location && typeof location === "object" && "lat" in location && "lng" in location) {
      return location.address || "Location coordinates available"
    }

    return "Location unavailable"
  } catch (error) {
    console.error("Error formatting location:", error)
    return "Location error"
  }
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
 * Get color class for a specific day
 */
const getDayColorClass = (day: string, isDarkMode: boolean): string => {
  // Color classes for each day in both dark and light mode
  const colorClasses = {
    monday: isDarkMode ? "bg-blue-900/30 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200",
    tuesday: isDarkMode
      ? "bg-purple-900/30 text-purple-300 border-purple-800"
      : "bg-purple-50 text-purple-700 border-purple-200",
    wednesday: isDarkMode
      ? "bg-green-900/30 text-green-300 border-green-800"
      : "bg-green-50 text-green-700 border-green-200",
    thursday: isDarkMode
      ? "bg-amber-900/30 text-amber-300 border-amber-800"
      : "bg-amber-50 text-amber-700 border-amber-200",
    friday: isDarkMode ? "bg-pink-900/30 text-pink-300 border-pink-800" : "bg-pink-50 text-pink-700 border-pink-200",
    saturday: isDarkMode
      ? "bg-indigo-900/30 text-indigo-300 border-indigo-800"
      : "bg-indigo-50 text-indigo-700 border-indigo-200",
    sunday: isDarkMode ? "bg-red-900/30 text-red-300 border-red-800" : "bg-red-50 text-red-700 border-red-200",
  }

  return (
    colorClasses[day.toLowerCase()] ||
    (isDarkMode ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-gray-50 text-gray-700 border-gray-200")
  )
}

/**
 * Get day abbreviation
 */
const getDayAbbreviation = (day: string): string => {
  const abbreviations = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  }

  return abbreviations[day.toLowerCase()] || day.substring(0, 3)
}

/**
 * Format schedule object into structured data with color coding
 */
const formatScheduleObject = (scheduleObj: any, isDarkMode: boolean): ScheduleDay[] => {
  try {
    // Define day order for consistent display
    const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    // Format each day with its time slots and color
    return daysOrder.map((day) => {
      const dayData = scheduleObj[day] || { selected: false, ranges: [] }
      const dayName = day.charAt(0).toUpperCase() + day.slice(1)
      const ranges = dayData.ranges || []

      // Format all time ranges for this day
      const timeSlots = ranges.map((range: any) => `${formatTime(range.start)} - ${formatTime(range.end)}`)

      return {
        day: dayName,
        dayShort: getDayAbbreviation(day),
        selected: dayData.selected || false,
        timeSlots: timeSlots,
        colorClass: getDayColorClass(day, isDarkMode),
      }
    })
  } catch (error) {
    console.error("Error formatting schedule object:", error)
    return []
  }
}

/**
 * Safely parse and format schedule data
 */
const safeFormatSchedule = (schedule: any, isDarkMode: boolean): ScheduleDay[] => {
  // If schedule is a string that looks like JSON, try to parse it
  if (
    typeof schedule === "string" &&
    (schedule.includes('"monday"') || schedule.includes('"selected"') || schedule.includes('"ranges"'))
  ) {
    try {
      const parsed = JSON.parse(schedule)
      return formatScheduleObject(parsed, isDarkMode)
    } catch (error) {
      console.log("Schedule string couldn't be parsed as JSON:", error)
      return []
    }
  }

  // If it's an object, format it
  if (schedule && typeof schedule === "object") {
    return formatScheduleObject(schedule, isDarkMode)
  }

  return []
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
      icon: HiHome,
      label: "Private Location",
      colorClass: isDarkMode
        ? "bg-amber-900/40 text-amber-300 border-amber-800"
        : "bg-amber-50 text-amber-700 border-amber-200",
    },
  }

  // Normalize the type string
  const normalizedType = type.toLowerCase().trim()

  // Find the matching type or use a default
  const typeInfo = Object.entries(types).find(([key]) => normalizedType === key || normalizedType.includes(key))

  return typeInfo
    ? typeInfo[1]
    : {
        icon: FaSwimmer,
        label: type,
        colorClass: isDarkMode
          ? "bg-slate-800 text-slate-300 border-slate-700"
          : "bg-gray-50 text-gray-700 border-gray-200",
      }
}

export default function CourseCard({ course, onEdit, onDelete, variant = "standard" }: CourseCardProps) {
  // Get dark mode state from Redux store
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Get course title (handle both title and course_name)
  const courseTitle = course.title || course.course_name || "Untitled Course"

  // Get course focus/description
  const courseFocus = course.focus || course.description || "Swimming techniques"

  // Get course ID (handle both id and course_id)
  const courseId = course.id || course.course_id || "unknown"

  // Get instructor name
  let instructorName = "Unknown Instructor"
  if (typeof course.instructor === "string") {
    instructorName = course.instructor
  } else if (course.instructor && typeof course.instructor === "object") {
    instructorName = course.instructor.name || "Unknown Instructor"
  }

  // Default instructor image if not provided
  const instructorImage =
    course.instructorImage ||
    `/placeholder.svg?height=200&width=200&query=swimming instructor portrait ${instructorName}`

  // Default course image if not provided
  const courseImage =
    course.image ||
    course.course_image ||
    `/placeholder.svg?height=400&width=800&query=swimming pool ${course.level} class`

  // Get location with improved formatting
  const locationAddress = formatLocation(course.location)

  // Get course type with enhanced styling
  const courseType = course.courseType || course.pool_type || "public-pool"
  const poolTypeInfo = getPoolTypeInfo(courseType, isDarkMode)
  const PoolTypeIcon = poolTypeInfo.icon

  // Get max students
  const maxStudents = course.maxStudents || course.max_students || 10

  // Get duration
  const duration = course.duration || `${course.course_duration || 8} weeks`

  // Get schedule - safely formatted with color coding
  const scheduleDays = safeFormatSchedule(course.schedule, isDarkMode)

  // Get selected days for display
  const selectedDays = scheduleDays.filter((day) => day.selected)

  // Get course status
  const courseStatus = course.status || "active"

  // Get course capacity
  const capacityPercentage = course.students ? Math.min((course.students / maxStudents) * 100, 100) : 0
  const isAlmostFull = capacityPercentage >= 80
  const isFull = capacityPercentage >= 100

  // Format price using the utility function
  const formattedPrice = formatDbPrice(course.price)

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

  // Function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full"

    if (isDarkMode) {
      switch (status.toLowerCase()) {
        case "active":
          return `${baseClasses} bg-green-900/40 text-green-300 border border-green-800`
        case "upcoming":
          return `${baseClasses} bg-blue-900/40 text-blue-300 border border-blue-800`
        case "completed":
          return `${baseClasses} bg-gray-800 text-gray-300 border border-gray-700`
        case "cancelled":
          return `${baseClasses} bg-red-900/40 text-red-300 border border-red-800`
        default:
          return `${baseClasses} bg-slate-800 text-slate-300 border border-slate-700`
      }
    } else {
      switch (status.toLowerCase()) {
        case "active":
          return `${baseClasses} bg-green-50 text-green-700 border border-green-200`
        case "upcoming":
          return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`
        case "completed":
          return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`
        case "cancelled":
          return `${baseClasses} bg-red-50 text-red-700 border border-red-200`
        default:
          return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`
      }
    }
  }

  // Render standard variant (default) - completely redesigned with color-coded schedule
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
          alt={courseTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={getStatusBadgeStyle(courseStatus)}>{courseStatus}</span>
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <span className={getLevelBadgeStyle(course.level)}>{course.level}</span>
        </div>

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode ? "from-slate-900/90 to-transparent" : "from-black/60 to-transparent"
          }`}
        ></div>

        {/* Course Title on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{courseTitle}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-white">
              <FaStar className="text-amber-400" />
              <span className="font-medium">{(course.rating || 4.5).toFixed(1)}</span>
            </div>
            {/* แก้ไขการแสดงราคาในการ์ดคอร์ส */}
            <div className="flex items-center gap-1 bg-black/30 text-white px-2 py-1 rounded-full text-xs">
              <HiCurrencyDollar className="text-amber-400" />
              <span className="font-bold">{formattedPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="p-4 flex-grow">
        {/* Location Section - Enhanced */}
        <div className={`mb-3 p-2 rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-2 ${isDarkMode ? "bg-slate-600" : "bg-white border border-gray-200"}`}>
              <FaMapMarkerAlt className={`${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>LOCATION</p>
              <p className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {locationAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Section - Enhanced with color-coded days */}
        <div className={`mb-3 p-2 rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"}`}>
          <div className="flex items-start">
            <div className={`p-2 rounded-full mr-2 ${isDarkMode ? "bg-slate-600" : "bg-white border border-gray-200"}`}>
              <FaCalendarAlt className={`${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            </div>
            <div className="flex-grow">
              <p className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>SCHEDULE</p>

              {selectedDays.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {selectedDays.map((day, index) => (
                    <div key={index} className={`p-2 rounded-md border ${day.colorClass}`}>
                      <p className="text-sm font-medium">{day.day}</p>
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center mt-1">
                          <FaClock className="text-xs mr-1 opacity-70" />
                          <p className="text-xs">{slot}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Flexible schedule</p>
              )}

              <p className={`text-xs mt-2 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Course duration: {duration}
              </p>
            </div>
          </div>
        </div>

        {/* Course Type & Capacity - Enhanced with distinct pool type styling */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${poolTypeInfo.colorClass}`}>
            <PoolTypeIcon className="text-lg" />
            <span className="text-sm font-medium">{poolTypeInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      <div
        className={`px-4 pt-3 pb-4 mt-auto ${isDarkMode ? "border-t border-slate-700" : "border-t border-gray-100"}`}
      >
        

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
          <Link href={`/course/${courseId}`}>
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
