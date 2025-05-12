"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"
import { updateCourse } from "@/api/course_api"
import { AlertType } from "@/types/AlertTypes"
import AlertResponse from "@/components/Responseback/AlertResponse"
import { motion, AnimatePresence } from "framer-motion"
import OSMMapSelector from "@/components/Searchpage/OSMMAPSelector"
import {
  FaInfoCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBook,
  FaSwimmingPool,
  FaMoneyBillWave,
  FaImage,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMapMarkedAlt,
  FaPlus,
  FaTimes,
  FaWater,
  FaUpload,
  FaTrash,
} from "react-icons/fa"
import { Button } from "@/components/Common/Button"
import { useAuth } from "@/context/AuthContext"
import imageCompression from "browser-image-compression"

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  onSuccess?: () => void
  course: Course | null
}

// Define a type for schedule items
interface ScheduleItem {
  day: string
  startTime: string
  endTime: string
}

// Define a type for the API data structure
interface CourseApiData {
  course_name: string
  pool_type: string
  location: string
  description: string
  course_duration: number
  study_frequency: string
  days_study: number
  number_of_total_sessions: number
  course_image: string
  level: string
  max_students: number
  price: number
  schedule: string
  instructor_id?: string // Optional instructor_id
}

export default function EditCourseModal({ isOpen, onClose, onSubmit, onSuccess, course }: EditCourseModalProps) {
  // Get user from Auth context
  const { user, refreshUser } = useAuth()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Ref to track if we should allow the modal to close
  const allowCloseRef = useRef(false)

  // State to control modal visibility internally
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null)
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)

  // Form state
  const [courseName, setCourseName] = useState("")
  const [poolType, setPoolType] = useState("")
  const [location, setLocation] = useState("")
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [description, setDescription] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [studyFrequency, setStudyFrequency] = useState("")
  const [numberOfTotalSessions, setNumberOfTotalSessions] = useState("")
  const [image, setImage] = useState("")
  const [poolImage, setPoolImage] = useState("") // Keep for UI but don't send to database
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")
  const [maxStudents, setMaxStudents] = useState("10")
  const [dayStudy, setDayStudy] = useState("0")
  const [courseId, setCourseId] = useState<number | string>("")

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{ day: "", startTime: "", endTime: "" }])

  // Form section expansion state
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    scheduleDetails: true,
    enrollment: true,
    media: false,
    debug: false,
  })

  // New state variables for image upload
  const [imagePreview, setImagePreview] = useState<string>("")
  const [poolImagePreview, setPoolImagePreview] = useState<string>("")

  // Update internal state when isOpen changes
  useEffect(() => {
    setInternalIsOpen(isOpen)
  }, [isOpen])

  // Initialize form data when course changes
  useEffect(() => {
    if (course && isOpen) {
      console.log("Initializing edit form with course data:", course)

      // Set course ID
      setCourseId(course.id || course.course_id || "")

      // Set basic info - handle both API naming conventions
      setCourseName(course.title || course.course_name || "")
      setLevel(course.level || "")
      setDescription(course.description || "")

      // Set pool type - handle different formats with better logging
      let poolTypeValue = ""
      console.log("Original pool type value:", course.courseType || course.pool_type)

      if (course.courseType === "public-pool" || course.pool_type === "public_pool") {
        poolTypeValue = "public_pool"
      } else if (course.courseType === "teacher-pool" || course.pool_type === "instructor_pool") {
        poolTypeValue = "instructor_pool"
      } else if (course.courseType === "private-location" || course.pool_type === "students_pool") {
        poolTypeValue = "students_pool"
      } else {
        // If none of the above, use the original value
        poolTypeValue = course.pool_type || course.courseType || ""
      }

      console.log("Setting pool type to:", poolTypeValue)
      setPoolType(poolTypeValue)

      // Set location
      if (course.location) {
        if (typeof course.location === "string") {
          setLocation(course.location)
        } else if (course.location.address) {
          setLocation(course.location.address)
        }

        // Try to parse coordinates from location string
        const locationStr = typeof course.location === "string" ? course.location : course.location.address || ""

        const coordsMatch = locationStr.match(/Lat: ([\d.]+), Lng: ([\d.]+)/)

        if (coordsMatch) {
          setLocationCoords({
            lat: Number.parseFloat(coordsMatch[1]),
            lng: Number.parseFloat(coordsMatch[2]),
          })
        }
      }

      // Set schedule
      if (course.schedule) {
        try {
          // Try to parse as JSON first (for array format)
          let scheduleArray: string[] = []
          try {
            if (typeof course.schedule === "string" && course.schedule.startsWith("[")) {
              scheduleArray = JSON.parse(course.schedule)
            } else if (Array.isArray(course.schedule)) {
              scheduleArray = course.schedule
            } else if (typeof course.schedule === "string") {
              // Split by commas if it's a comma-separated string
              scheduleArray = course.schedule.includes(",")
                ? course.schedule.split(",").map((s) => s.trim())
                : [course.schedule.trim()]
            }
          } catch (e) {
            console.error("Error parsing schedule JSON:", e)
            scheduleArray = typeof course.schedule === "string" ? [course.schedule] : []
          }

          // Convert schedule strings to schedule items
          const parsedItems: ScheduleItem[] = scheduleArray.map((scheduleStr) => {
            const match = scheduleStr.match(/([A-Za-z]+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/)
            if (match) {
              return {
                day: match[1],
                startTime: match[2],
                endTime: match[3],
              }
            }
            return { day: "Monday", startTime: "09:00", endTime: "10:00" }
          })

          setScheduleItems(
            parsedItems.length > 0 ? parsedItems : [{ day: "Monday", startTime: "09:00", endTime: "10:00" }],
          )
        } catch (e) {
          console.error("Error parsing schedule:", e)
          setScheduleItems([{ day: "Monday", startTime: "09:00", endTime: "10:00" }])
        }
      }

      // Extract duration value - improved to handle different formats
      let durationValue = 1 // Default value

      // Try to get the duration from various possible properties and formats
      if (typeof course.duration === "number") {
        durationValue = course.duration
      } else if (typeof course.course_duration === "number") {
        durationValue = course.course_duration
      } else if (typeof course.duration === "string") {
        // Try to extract numeric value if it's in format like "8 weeks"
        const match = course.duration.match(/(\d+)/)
        if (match) {
          durationValue = Number.parseInt(match[1], 10)
        }
      } else if (typeof course.course_duration === "string" && !isNaN(Number(course.course_duration))) {
        durationValue = Number(course.course_duration)
      }

      console.log("Setting course duration to:", durationValue, "Type:", typeof durationValue)
      setCourseDuration(String(durationValue))

      setStudyFrequency(String(course.study_frequency || 1))
      setNumberOfTotalSessions(String(course.number_of_total_sessions || 1))
      setPrice(String(course.price || 0))
      setMaxStudents(String(course.maxStudents || course.max_students || 10))
      setDayStudy(String(course.days_study || 0))

      // Set images - handle both API naming conventions
      const courseImage = course.image || course.course_image || ""
      setImage(courseImage)
      if (courseImage) {
        setImagePreview(courseImage)
      }
    }
  }, [course, isOpen])

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle location selection from map
  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    setLocationCoords(coords)
    // You could also reverse geocode here to get the address
    setLocation(`Latitude: ${coords.lat.toFixed(6)}, Longitude: ${coords.lng.toFixed(6)}`)
  }

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!courseName.trim()) newErrors.courseName = "Course name is required"
    if (!poolType) newErrors.poolType = "Pool type is required"

    // Only validate location if not students pool
    if (poolType !== "students_pool" && !location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!description.trim()) newErrors.description = "Description is required"

    // Rest of validation remains the same
    if (!courseDuration) {
      newErrors.courseDuration = "Course duration is required"
    } else if (isNaN(Number(courseDuration)) || Number(courseDuration) <= 0) {
      newErrors.courseDuration = "Must be a positive number"
    }

    if (!numberOfTotalSessions) {
      newErrors.numberOfTotalSessions = "Total sessions is required"
    } else if (isNaN(Number(numberOfTotalSessions)) || Number(numberOfTotalSessions) <= 0) {
      newErrors.numberOfTotalSessions = "Must be a positive number"
    }

    if (!level) newErrors.level = "Level is required"

    if (!price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = "Must be a non-negative number"
    }

    // Validate schedule items
    const hasValidSchedule = scheduleItems.some((item) => item.day && item.startTime && item.endTime)
    if (!hasValidSchedule) {
      newErrors.schedule = "At least one complete schedule is required"
    }

    if (!studyFrequency) {
      newErrors.studyFrequency = "Study frequency is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Reset state when modal opens/closes
  const handleClose = () => {
    // Only allow closing if explicitly requested
    if (!allowCloseRef.current && isSubmitting) {
      console.log("Preventing modal close during submission")
      return
    }

    // Clear any pending close timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      setCloseTimeout(null)
    }

    // Reset error state
    setErrors({})
    setError(null)
    setSuccess(null)
    setIsSubmitting(false)
    setApiDebugInfo(null)

    // Reset the close flag
    allowCloseRef.current = false

    // Call the parent's onClose
    onClose()
  }

  // Schedule item handlers
  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, { day: "", startTime: "", endTime: "" }])
  }

  const removeScheduleItem = (index: number) => {
    if (scheduleItems.length > 1) {
      setScheduleItems(scheduleItems.filter((_, i) => i !== index))
    }
  }

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    const newItems = [...scheduleItems]
    newItems[index][field] = value
    setScheduleItems(newItems)
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPoolImage = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (PNG, JPG, JPEG, GIF)")
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        // Compress the image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        }

        const compressedFile = await imageCompression(file, options)

        // Create a preview URL
        const imageUrl = URL.createObjectURL(compressedFile)

        if (isPoolImage) {
          setPoolImagePreview(imageUrl)
        } else {
          setImagePreview(imageUrl)
        }

        // Convert to base64 for API submission
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          if (isPoolImage) {
            setPoolImage(base64String)
          } else {
            setImage(base64String)
          }
        }
        reader.readAsDataURL(compressedFile)
      } else {
        // Create a preview URL
        const imageUrl = URL.createObjectURL(file)

        if (isPoolImage) {
          setPoolImagePreview(imageUrl)
        } else {
          setImagePreview(imageUrl)
        }

        // Convert to base64 for API submission
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          if (isPoolImage) {
            setPoolImage(base64String)
          } else {
            setImage(base64String)
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (err) {
      console.error("Error processing image:", err)
      setError("Failed to process image. Please try another one.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault()
    e.stopPropagation()

    console.log("Form submission started - preventing modal close")

    // Set flag to prevent closing
    allowCloseRef.current = false

    if (!validateForm()) {
      // Find the first section with an error and expand it
      if (errors.courseName || errors.poolType || errors.location || errors.description) {
        setExpandedSections((prev) => ({ ...prev, basicInfo: true }))
      } else if (errors.courseDuration || errors.studyFrequency || errors.numberOfTotalSessions || errors.schedule) {
        setExpandedSections((prev) => ({ ...prev, scheduleDetails: true }))
      } else if (errors.price) {
        setExpandedSections((prev) => ({ ...prev, enrollment: true }))
      }
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    setApiDebugInfo(null)

    try {
      // Get user ID directly from Auth context
      if (!user || (!user.user_id && !user.id)) {
        throw new Error("User ID not found. Please login again.")
      }

      const userId = user.user_id || user.id
      console.log("Updating course with user ID:", userId)

      // Format schedule from schedule items as an array
      const formattedSchedule = scheduleItems
        .filter((item) => item.day && item.startTime && item.endTime)
        .map((item) => `${item.day} ${item.startTime}-${item.endTime}`)

      // Create the database-style object
      const dbData: CourseApiData = {
        course_name: courseName,
        pool_type: poolType, // Use the pool_type directly, no conversion needed
        location: poolType === "students_pool" ? "Student's Pool" : location,
        description,
        course_duration: Number(courseDuration),
        study_frequency: studyFrequency, // Keep as string, don't convert to number
        days_study: Number(dayStudy),
        number_of_total_sessions: Number(numberOfTotalSessions),
        course_image: image, // Make sure this is course_image, not image
        level,
        max_students: Number(maxStudents),
        price: Number(price),
        schedule: JSON.stringify(formattedSchedule), // Convert array to JSON string
        instructor_id: userId,
      }

      // Add location coordinates if available
      if (locationCoords && poolType !== "students_pool") {
        // Store coordinates in the location field
        dbData.location = `${location} (Lat: ${locationCoords.lat.toFixed(6)}, Lng: ${locationCoords.lng.toFixed(6)})`
      }

      console.log("Submitting course update data:", dbData)

      // Call the API with the database-style object
      const response = await updateCourse(courseId.toString(), dbData)
      console.log("API Response:", response)

      // Store debug info
      setApiDebugInfo({
        requestData: dbData,
        responseData: response,
      })

      // Call the parent component's onSubmit with the data
      // We'll wrap this in a try/catch to prevent it from closing the modal
      try {
        // Create a copy of the data to prevent any reference issues
        const dataCopy = JSON.parse(JSON.stringify(dbData))

        // Call onSubmit but don't let it close our modal
        setTimeout(() => {
          onSubmit(dataCopy)
        }, 0)
      } catch (submitErr) {
        console.error("Error in onSubmit callback:", submitErr)
      }

      setSuccess("Course updated successfully!")

      // Call the onSuccess callback if provided to refresh parent data
      if (onSuccess) {
        console.log("Calling onSuccess to refresh parent data")
        onSuccess()
      }

      // Expand debug section to show response
      setExpandedSections((prev) => ({ ...prev, debug: true }))

      // NEVER close the modal automatically - removed auto-close code
    } catch (err: any) {
      // Error handling code
      console.error("Error updating course:", err)

      // Store debug info
      setApiDebugInfo({
        error: {
          message: err.message,
          name: err.name,
          code: err.code,
          response: err.response
            ? {
                status: err.response.status,
                statusText: err.response.statusText,
                data: err.response.data,
              }
            : null,
        },
        user,
      })

      // Set user-friendly error message
      let errorMessage = "Failed to update course. Please try again."

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = "Invalid course data. Please check your inputs."
        } else if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "You don't have permission to update this course."
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later."
        }

        // Add more specific error message if available
        if (err.response.data && err.response.data.message) {
          errorMessage += ` (${err.response.data.message})`
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection."
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)

      // Expand debug section on error
      setExpandedSections((prev) => ({ ...prev, debug: true }))
    } finally {
      setIsSubmitting(false)
    }

    return false // Ensure no default form submission
  }

  // Force the modal to stay open
  const handleModalClose = (e: React.MouseEvent) => {
    if (!allowCloseRef.current && (isSubmitting || success)) {
      e.preventDefault()
      e.stopPropagation()
      console.log("Preventing modal close")
      return false
    }
    return true
  }

  // Explicitly allow closing
  const handleExplicitClose = () => {
    allowCloseRef.current = true
    handleClose()
  }

  // Styling
  const sectionClasses = `mb-6 rounded-xl overflow-hidden ${
    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100 shadow-sm"
  }`

  const sectionHeaderClasses = `flex items-center justify-between p-4 cursor-pointer ${
    isDarkMode ? "bg-slate-700" : "bg-gray-50"
  }`

  const inputClasses = `w-full rounded-lg p-3 focus:ring-2 text-base ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
      : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500"
  }`

  const labelClasses = `block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`

  const errorClasses = "text-xs text-red-500 mt-1"

  if (!isOpen || !course) return null

  return (
    <Modal isOpen={isOpen} onClose={handleExplicitClose} title="Edit Course" className="max-w-5xl">
      <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
        {/* Alert Messages */}
        {error && (
          <div className="mb-4">
            <AlertResponse message={error} type={AlertType.ERROR} />
          </div>
        )}
        {success && (
          <div className="mb-4">
            <AlertResponse message={success} type={AlertType.SUCCESS} />
          </div>
        )}

        {/* User Info */}
        {user ? (
          <div
            className={`mb-4 p-3 rounded-lg ${isDarkMode ? "bg-green-800/20" : "bg-green-50"} border ${isDarkMode ? "border-green-800" : "border-green-200"}`}
          >
            <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
              Editing course as: <strong>{user.name}</strong> (ID: {user.user_id || user.id})
            </p>
          </div>
        ) : (
          <div
            className={`mb-4 p-3 rounded-lg ${isDarkMode ? "bg-amber-800/20" : "bg-amber-50"} border ${isDarkMode ? "border-amber-800" : "border-amber-200"}`}
          >
            <p className={`text-sm ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}>
              <strong>Warning:</strong> User information not found. Please refresh the page or log in again.
            </p>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div
            className={`mb-4 p-3 rounded-lg ${isDarkMode ? "bg-slate-800/80" : "bg-gray-100"} border ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
          >
            <details>
              <summary
                className={`text-sm font-medium cursor-pointer ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Debug Information (click to expand)
              </summary>
              <div className="mt-2 text-xs space-y-1">
                <p>
                  <strong>Course ID:</strong> {courseId}
                </p>
                <p>
                  <strong>Pool Type:</strong> {poolType} (Original: {course?.pool_type || course?.courseType})
                </p>
                <p>
                  <strong>Course Duration:</strong> {courseDuration} (Original:{" "}
                  {course?.duration || course?.course_duration})
                </p>
                <p>
                  <strong>Study Frequency:</strong> {studyFrequency}
                </p>
                <p>
                  <strong>Level:</strong> {level}
                </p>
                <p>
                  <strong>Schedule Items:</strong> {scheduleItems.length}
                </p>
              </div>
            </details>
          </div>
        )}

        {/* Course Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          <div className={sectionClasses}>
            <div className={sectionHeaderClasses} onClick={() => toggleSection("basicInfo")}>
              <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <FaInfoCircle className="inline mr-2 text-cyan-500" /> Basic Information
              </h3>
              {expandedSections.basicInfo ? (
                <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              ) : (
                <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.basicInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Course Name */}
                      <div>
                        <label htmlFor="courseName" className={labelClasses}>
                          Course Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="courseName"
                          className={inputClasses}
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                          placeholder="e.g., Advanced Freestyle Technique"
                        />
                        {errors.courseName && <p className={errorClasses}>{errors.courseName}</p>}
                      </div>

                      {/* Pool Type */}
                      <div>
                        <label htmlFor="poolType" className={labelClasses}>
                          Pool Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaSwimmingPool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="poolType"
                            className={`${inputClasses} pl-10`}
                            value={poolType}
                            onChange={(e) => setPoolType(e.target.value)}
                          >
                            <option value="">Select Pool Type</option>
                            <option value="students_pool">Students Pool</option>
                            <option value="instructor_pool">Instructor Pool</option>
                            <option value="public_pool">Public Pool</option>
                          </select>
                        </div>
                        {errors.poolType && <p className={errorClasses}>{errors.poolType}</p>}
                        {poolType && (
                          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Selected:{" "}
                            {poolType === "students_pool"
                              ? "Students Pool"
                              : poolType === "instructor_pool"
                                ? "Instructor Pool"
                                : poolType === "public_pool"
                                  ? "Public Pool"
                                  : poolType}
                          </p>
                        )}
                      </div>

                      {/* Level */}
                      <div>
                        <label htmlFor="level" className={labelClasses}>
                          Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="level"
                          className={inputClasses}
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                        >
                          <option value="">Select Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        {errors.level && <p className={errorClasses}>{errors.level}</p>}
                      </div>

                      {/* Instructor */}
                      <div>
                        <label htmlFor="instructorId" className={labelClasses}>
                          Instructor
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="instructorId"
                            className={`${inputClasses} pl-10`}
                            value={user?.user_id || user?.id || "Loading..."}
                            placeholder="Instructor ID"
                            readOnly={true}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Course will be updated by: {user?.name || "Loading..."}
                        </p>
                      </div>
                    </div>

                    {/* Location - only show if not students pool */}
                    {poolType !== "students_pool" && (
                      <div className="mt-4">
                        <label htmlFor="location" className={labelClasses}>
                          <FaMapMarkedAlt className="inline mr-2 text-cyan-500" /> Location{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mb-2">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="location"
                            className={`${inputClasses} pl-10`}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Aquatic Center, Bangkok"
                          />
                        </div>
                        {errors.location && <p className={errorClasses}>{errors.location}</p>}

                        <div className="mt-2 mb-4">
                          <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Select location on the map:
                          </p>
                          <div className="rounded-lg overflow-hidden border border-gray-300">
                            <OSMMapSelector
                              onLocationSelect={handleLocationSelect}
                              center={locationCoords || { lat: 13.7563, lng: 100.5018 }} // Default: Bangkok
                            />
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Click on the map to set the location or drag the marker to adjust.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className={labelClasses}>
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        className={inputClasses}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide a detailed description of the course..."
                      />
                      {errors.description && <p className={errorClasses}>{errors.description}</p>}
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Include key information about what students will learn and the benefits of your course.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Schedule Details Section */}
          <div className={sectionClasses}>
            <div className={sectionHeaderClasses} onClick={() => toggleSection("scheduleDetails")}>
              <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <FaCalendarAlt className="inline mr-2 text-cyan-500" /> Schedule Details
              </h3>
              {expandedSections.scheduleDetails ? (
                <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              ) : (
                <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.scheduleDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Course Duration */}
                      <div>
                        <label htmlFor="courseDuration" className={labelClasses}>
                          Course Duration (months) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="courseDuration"
                            className={`${inputClasses} pl-10`}
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            placeholder="e.g., 3"
                            min="1"
                          />
                        </div>
                        {errors.courseDuration && <p className={errorClasses}>{errors.courseDuration}</p>}
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Current value: {courseDuration || "Not set"} {courseDuration ? "months" : ""}
                        </p>
                      </div>

                      {/* Study Frequency */}
                      <div>
                        <label htmlFor="studyFrequency" className={labelClasses}>
                          Study Frequency <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="studyFrequency"
                          className={inputClasses}
                          value={studyFrequency}
                          onChange={(e) => setStudyFrequency(e.target.value)}
                        >
                          <option value="">Select Frequency</option>
                          <option value="1 time per week">1 time per week</option>
                          <option value="1-2 times per week">1-2 times per week</option>
                          <option value="2-3 times per week">2-3 times per week</option>
                          <option value="3-4 times per week">3-4 times per week</option>
                          <option value="4-5 times per week">4-5 times per week</option>
                          <option value="5+ times per week">5+ times per week</option>
                        </select>
                        {errors.studyFrequency && <p className={errorClasses}>{errors.studyFrequency}</p>}
                      </div>

                      {/* Days Study */}
                      <div>
                        <label htmlFor="dayStudy" className={labelClasses}>
                          Days of Study <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="dayStudy"
                            className={`${inputClasses} pl-10`}
                            value={dayStudy}
                            onChange={(e) => setDayStudy(e.target.value)}
                            placeholder="e.g., 2"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Number of Total Sessions */}
                      <div>
                        <label htmlFor="numberOfTotalSessions" className={labelClasses}>
                          Total Sessions <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="numberOfTotalSessions"
                            className={`${inputClasses} pl-10`}
                            value={numberOfTotalSessions}
                            onChange={(e) => setNumberOfTotalSessions(e.target.value)}
                            placeholder="e.g., 24"
                            min="1"
                          />
                        </div>
                        {errors.numberOfTotalSessions && <p className={errorClasses}>{errors.numberOfTotalSessions}</p>}
                      </div>

                      {/* Schedule */}
                      <div className="col-span-2">
                        <label htmlFor="schedule" className={labelClasses}>
                          Schedule <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {scheduleItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="flex-1">
                                <select
                                  className={`${inputClasses} mb-1`}
                                  value={item.day}
                                  onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                                >
                                  <option value="">Select Day</option>
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                                  <option value="Saturday">Saturday</option>
                                  <option value="Sunday">Sunday</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="time"
                                  className={inputClasses}
                                  value={item.startTime}
                                  onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                                />
                              </div>
                              <div className="flex items-center justify-center">
                                <span className={isDarkMode ? "text-white" : "text-gray-700"}>to</span>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="time"
                                  className={inputClasses}
                                  value={item.endTime}
                                  onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeScheduleItem(index)}
                                className={`p-2 rounded-full ${
                                  isDarkMode
                                    ? "bg-red-900 text-red-300 hover:bg-red-800"
                                    : "bg-red-100 text-red-500 hover:bg-red-200"
                                }}`}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addScheduleItem}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              isDarkMode
                                ? "bg-slate-700 text-cyan-400 hover:bg-slate-600"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            }`}
                          >
                            <FaPlus size={12} /> Add Schedule
                          </button>
                        </div>
                        {errors.schedule && <p className={errorClasses}>{errors.schedule}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Section */}
          <div className={sectionClasses}>
            <div className={sectionHeaderClasses} onClick={() => toggleSection("enrollment")}>
              <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <FaMoneyBillWave className="inline mr-2 text-cyan-500" /> Pricing
              </h3>
              {expandedSections.enrollment ? (
                <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              ) : (
                <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.enrollment && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Price */}
                      <div>
                        <label htmlFor="price" className={labelClasses}>
                          Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="price"
                            className={`${inputClasses} pl-10`}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                          />
                        </div>
                        {errors.price && <p className={errorClasses}>{errors.price}</p>}
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Set the price for your course in your local currency
                        </p>
                      </div>

                      {/* Max Students */}
                      <div>
                        <label htmlFor="maxStudents" className={labelClasses}>
                          Max Students <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="maxStudents"
                            className={`${inputClasses} pl-10`}
                            value={maxStudents}
                            onChange={(e) => setMaxStudents(e.target.value)}
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Media Section */}
          <div className={sectionClasses}>
            <div className={sectionHeaderClasses} onClick={() => toggleSection("media")}>
              <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <FaImage className="inline mr-2 text-cyan-500" /> Media
              </h3>
              {expandedSections.media ? (
                <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              ) : (
                <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.media && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {/* Course Image Upload */}
                    <div>
                      <label htmlFor="courseImageUpload" className={labelClasses}>
                        Course Image
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                              isDarkMode
                                ? "border-slate-600 hover:border-cyan-500 bg-slate-700/30"
                                : "border-gray-300 hover:border-sky-500 bg-gray-50"
                            }`}
                            onClick={() => document.getElementById("courseImageUpload")?.click()}
                          >
                            <input
                              type="file"
                              id="courseImageUpload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false)}
                            />
                            <FaUpload
                              className={`mx-auto text-2xl mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                            />
                            <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                              Click to upload course image
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              JPG, PNG or GIF, max 5MB
                            </p>
                          </div>

                          {/* Alternative URL input */}
                          <div className="mt-2">
                            <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Or enter image URL:
                            </p>
                            <div className="relative">
                              <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                id="imageUrl"
                                className={`${inputClasses} pl-10`}
                                value={typeof image === "string" && !image.startsWith("data:") ? image : ""}
                                onChange={(e) => {
                                  setImage(e.target.value)
                                  setImagePreview(e.target.value)
                                }}
                                placeholder="e.g., https://example.com/image.jpg"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Preview */}
                        <div>
                          <div
                            className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
                          >
                            {imagePreview ? (
                              <div className="relative">
                                <img
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="Course preview"
                                  className="w-full h-48 object-cover"
                                  onError={() => {
                                    // If image fails to load, set a default
                                    setImagePreview(`/placeholder.svg?height=200&width=400&query=swimming`)
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImagePreview("")
                                    setImage("")
                                  }}
                                  className={`absolute top-2 right-2 p-2 rounded-full ${
                                    isDarkMode
                                      ? "bg-slate-800/80 text-red-400 hover:bg-slate-700"
                                      : "bg-white/80 text-red-500 hover:bg-gray-100"
                                  }`}
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`h-48 flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
                              >
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  No image selected
                                </p>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Preview of your course image
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pool Image Upload */}
                    <div>
                      <label htmlFor="poolImageUpload" className={labelClasses}>
                        <FaWater className="inline mr-2" /> Pool Image (Optional)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div
                            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                              isDarkMode
                                ? "border-slate-600 hover:border-cyan-500 bg-slate-700/30"
                                : "border-gray-300 hover:border-sky-500 bg-gray-50"
                            }`}
                            onClick={() => document.getElementById("poolImageUpload")?.click()}
                          >
                            <input
                              type="file"
                              id="poolImageUpload"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                            />
                            <FaUpload
                              className={`mx-auto text-2xl mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                            />
                            <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Click to upload pool image</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              JPG, PNG or GIF, max 5MB
                            </p>
                          </div>

                          {/* Alternative URL input */}
                          <div className="mt-2">
                            <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Or enter image URL:
                            </p>
                            <div className="relative">
                              <FaWater className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                id="poolImageUrl"
                                className={`${inputClasses} pl-10`}
                                value={typeof poolImage === "string" && !poolImage.startsWith("data:") ? poolImage : ""}
                                onChange={(e) => {
                                  setPoolImage(e.target.value)
                                  setPoolImagePreview(e.target.value)
                                }}
                                placeholder="e.g., https://example.com/pool.jpg"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Pool Image Preview */}
                        <div>
                          <div
                            className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
                          >
                            {poolImagePreview ? (
                              <div className="relative">
                                <img
                                  src={poolImagePreview || "/placeholder.svg"}
                                  alt="Pool preview"
                                  className="w-full h-48 object-cover"
                                  onError={() => {
                                    // If image fails to load, set a default
                                    setPoolImagePreview(`/placeholder.svg?height=200&width=400&query=swimming+pool`)
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPoolImagePreview("")
                                    setPoolImage("")
                                  }}
                                  className={`absolute top-2 right-2 p-2 rounded-full ${
                                    isDarkMode
                                      ? "bg-slate-800/80 text-red-400 hover:bg-slate-700"
                                      : "bg-white/80 text-red-500 hover:bg-gray-100"
                                  }`}
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`h-48 flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
                              >
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  No pool image selected
                                </p>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Preview of your pool image (not yet supported by database)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Debug Information Section */}
          {apiDebugInfo && (
            <div className={`${sectionClasses} border-amber-500`}>
              <div
                className={`${sectionHeaderClasses} ${isDarkMode ? "bg-amber-800" : "bg-amber-100"}`}
                onClick={() => toggleSection("debug")}
              >
                <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  <FaInfoCircle className="inline mr-2 text-amber-500" /> Debug Information
                </h3>
                {expandedSections.debug ? (
                  <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                ) : (
                  <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.debug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      <div
                        className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-900" : "bg-gray-100"} overflow-auto max-h-60`}
                      >
                        <pre className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {JSON.stringify(apiDebugInfo, null, 2)}
                        </pre>
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className={`text-xs px-3 py-1 rounded ${
                            isDarkMode ? "bg-slate-700 text-gray-300" : "bg-gray-200 text-gray-700"
                          }`}
                          onClick={() => {
                            console.log("API Debug Info:", apiDebugInfo)
                          }}
                        >
                          Log to Console
                        </button>
                        <button
                          type="button"
                          className={`text-xs px-3 py-1 rounded ${
                            isDarkMode ? "bg-slate-700 text-gray-300" : "bg-gray-200 text-gray-700"
                          }`}
                          onClick={() => {
                            setApiDebugInfo(null)
                            setExpandedSections((prev) => ({ ...prev, debug: false }))
                          }}
                        >
                          Clear Debug Info
                        </button>
                      </div>

                      {/* Add this new button for closing the modal */}
                      {success && (
                        <div className="flex justify-center mt-4">
                          <button
                            type="button"
                            className={`px-4 py-2 rounded-lg font-medium ${
                              isDarkMode
                                ? "bg-green-700 text-white hover:bg-green-600"
                                : "bg-green-600 text-white hover:bg-green-500"
                            }`}
                            onClick={handleExplicitClose}
                          >
                            Close Modal
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant={isDarkMode ? "outline" : "outline"}
              onClick={handleExplicitClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isDarkMode ? "gradient" : "primary"}
              disabled={isSubmitting}
              onClick={(e) => {
                // Prevent default button behavior
                e.preventDefault()
                // Call our submit handler
                handleSubmit(e)
                // Prevent event propagation
                return false
              }}
            >
              {isSubmitting ? "Updating Course..." : "Update Course"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
