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
import { uploadProfileImage } from "@/api/resource_api"
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
  FaCheck,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaGraduationCap,
  FaRegClock,
} from "react-icons/fa"
import { useAuth } from "@/context/AuthContext"
import { Tooltip } from "@/components/UI/Tooltip"

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
  const [activeStep, setActiveStep] = useState(0)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

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
    scheduleDetails: false,
    pricing: false,
    media: false,
    debug: false,
  })

  // New state variables for image upload
  const [imagePreview, setImagePreview] = useState<string>("")
  const [poolImagePreview, setPoolImagePreview] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedPoolImage, setSelectedPoolImage] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Update internal state when isOpen changes
  useEffect(() => {
    setInternalIsOpen(isOpen)
    if (isOpen) {
      // Reset active step when modal opens
      setActiveStep(0)
      setExpandedSections({
        basicInfo: true,
        scheduleDetails: false,
        pricing: false,
        media: false,
        debug: false,
      })
    }
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
      setMaxStudents(String(course.maxStudents || 10))
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
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const markAsTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const validateField = (field: string, value: any) => {
    let error = ""

    switch (field) {
      case "courseName":
        if (!value.trim()) error = "Course name is required"
        break
      case "poolType":
        if (!value) error = "Pool type is required"
        break
      case "location":
        if (poolType !== "students_pool" && !value.trim()) error = "Location is required"
        break
      case "description":
        if (!value.trim()) error = "Description is required"
        break
      case "courseDuration":
        if (!value) {
          error = "Course duration is required"
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = "Must be a positive number"
        }
        break
      case "numberOfTotalSessions":
        if (!value) {
          error = "Total sessions is required"
        } else if (isNaN(Number(value)) || Number(value) <= 0) {
          error = "Must be a positive number"
        }
        break
      case "level":
        if (!value) error = "Level is required"
        break
      case "price":
        if (!value) {
          error = "Price is required"
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = "Must be a non-negative number"
        }
        break
      case "studyFrequency":
        if (!value) error = "Study frequency is required"
        break
      case "schedule":
        const hasValidSchedule = scheduleItems.some((item) => item.day && item.startTime && item.endTime)
        if (!hasValidSchedule) error = "At least one complete schedule is required"
        break
      default:
        break
    }

    return error
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const fields = [
      "courseName",
      "poolType",
      "location",
      "description",
      "courseDuration",
      "numberOfTotalSessions",
      "level",
      "price",
      "studyFrequency",
      "schedule",
    ]

    fields.forEach((field) => {
      let value
      if (field === "schedule") {
        value = scheduleItems
      } else if (field === "location" && poolType === "students_pool") {
        // Skip location validation for students pool
        return
      } else {
        // @ts-ignore - dynamic access
        value = eval(field)
      }

      const error = validateField(field, value)
      if (error) {
        newErrors[field] = error
      }
    })

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
    setTouched({})
    setShowSuccessAnimation(false)

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
    markAsTouched("schedule")
  }

  // Handle file changes for image uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isPoolImage = false) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (PNG, JPG, JPEG, GIF)")
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        if (isPoolImage) {
          setPoolImagePreview(reader.result as string)
          setSelectedPoolImage(file)
        } else {
          setImagePreview(reader.result as string)
          setSelectedImage(file)
        }
      }
      reader.readAsDataURL(file)

      // Simulate upload progress
      setIsUploading(true)
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  // Navigate between steps
  const goToNextStep = () => {
    const steps = ["basicInfo", "scheduleDetails", "pricing", "media"] as const
    const currentStepIndex = steps.findIndex((step) => expandedSections[step])

    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1]
      setExpandedSections({
        basicInfo: nextStep === "basicInfo",
        scheduleDetails: nextStep === "scheduleDetails",
        pricing: nextStep === "pricing",
        media: nextStep === "media",
        debug: expandedSections.debug,
      })
      setActiveStep(currentStepIndex + 1)
    }
  }

  const goToPrevStep = () => {
    const steps = ["basicInfo", "scheduleDetails", "pricing", "media"] as const
    const currentStepIndex = steps.findIndex((step) => expandedSections[step])

    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1]
      setExpandedSections({
        ...Object.fromEntries(steps.map((step) => [step, false])),
        [prevStep]: true,
        debug: expandedSections.debug,
      })
      setActiveStep(currentStepIndex - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the default form submission
    e.preventDefault()
    e.stopPropagation()

    console.log("Form submission started - preventing modal close")

    // Set flag to prevent closing
    allowCloseRef.current = false

    // Mark all fields as touched for validation
    const allFields = [
      "courseName",
      "poolType",
      "location",
      "description",
      "courseDuration",
      "numberOfTotalSessions",
      "level",
      "price",
      "studyFrequency",
      "schedule",
    ]
    const touchedState = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    setTouched(touchedState)

    if (!validateForm()) {
      // Find the first section with an error and expand it
      if (errors.courseName || errors.poolType || errors.location || errors.description) {
        setExpandedSections((prev) => ({
          basicInfo: true,
          scheduleDetails: false,
          pricing: false,
          media: false,
          debug: prev.debug,
        }))
        setActiveStep(0)
      } else if (errors.courseDuration || errors.studyFrequency || errors.numberOfTotalSessions || errors.schedule) {
        setExpandedSections((prev) => ({
          basicInfo: false,
          scheduleDetails: true,
          pricing: false,
          media: false,
          debug: prev.debug,
        }))
        setActiveStep(1)
      } else if (errors.price) {
        setExpandedSections((prev) => ({
          basicInfo: false,
          scheduleDetails: false,
          pricing: true,
          media: false,
          debug: prev.debug,
        }))
        setActiveStep(2)
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

      // Initialize with existing values or empty strings as fallback
      let profileImageUrl = image || ""

      // Upload profile image if changed
      if (selectedImage) {
        try {
          // Simulate upload progress
          setIsUploading(true)
          setUploadProgress(0)

          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval)
                return 90
              }
              return prev + 10
            })
          }, 200)

          // Use the same API function as in the instructor request page
          const uploadResult = await uploadProfileImage(userId, selectedImage)
          profileImageUrl = uploadResult.resource_url

          // Complete the progress
          clearInterval(progressInterval)
          setUploadProgress(100)
          setTimeout(() => setIsUploading(false), 500)
        } catch (uploadErr) {
          console.error("Error uploading course image:", uploadErr)
          setIsUploading(false)
          throw new Error("Failed to upload course image. Please try again.")
        }
      }

      // Then update the dbData object to use profileImageUrl instead of formattedImage
      const dbData: CourseApiData = {
        course_name: courseName,
        pool_type: poolType,
        location: poolType === "students_pool" ? "Student's Pool" : location,
        description,
        course_duration: Number(courseDuration),
        study_frequency: studyFrequency,
        days_study: Number(dayStudy),
        number_of_total_sessions: Number(numberOfTotalSessions),
        course_image: profileImageUrl, // Use the uploaded image URL
        level,
        max_students: Number(maxStudents),
        price: Number(price),
        schedule: JSON.stringify(formattedSchedule),
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
      setShowSuccessAnimation(true)

      // Call the onSuccess callback if provided to refresh parent data
      if (onSuccess) {
        console.log("Calling onSuccess to refresh parent data")
        onSuccess()
      }
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
    } finally {
      setIsSubmitting(false)
    }

    return false // Ensure no default form submission
  }

  // Explicitly allow closing
  const handleExplicitClose = () => {
    allowCloseRef.current = true
    handleClose()
  }

  // Styling - Enhanced for better aesthetics
  const baseColors = isDarkMode
    ? {
        bg: "bg-slate-800",
        bgAlt: "bg-slate-700",
        bgHover: "hover:bg-slate-700",
        border: "border-slate-700",
        borderFocus: "focus:border-cyan-500",
        text: "text-white",
        textMuted: "text-gray-300",
        textDim: "text-gray-400",
        accent: "text-cyan-400",
        accentBg: "bg-cyan-500",
        accentHover: "hover:bg-cyan-600",
        success: "bg-emerald-600",
        error: "bg-red-600",
        warning: "bg-amber-600",
        info: "bg-blue-600",
      }
    : {
        bg: "bg-white",
        bgAlt: "bg-gray-50",
        bgHover: "hover:bg-gray-50",
        border: "border-gray-200",
        borderFocus: "focus:border-sky-500",
        text: "text-gray-800",
        textMuted: "text-gray-600",
        textDim: "text-gray-500",
        accent: "text-sky-600",
        accentBg: "bg-sky-500",
        accentHover: "hover:bg-sky-600",
        success: "bg-emerald-500",
        error: "bg-red-500",
        warning: "bg-amber-500",
        info: "bg-blue-500",
      }

  const sectionClasses = `mb-6 rounded-xl overflow-hidden shadow-sm ${baseColors.bg} border ${baseColors.border}`

  const sectionHeaderClasses = `flex items-center justify-between p-4 cursor-pointer ${baseColors.bgAlt}`

  const inputClasses = `w-full rounded-lg p-3 focus:ring-2 text-base transition-all duration-200 ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
      : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500"
  }`

  const labelClasses = `block text-base font-medium mb-2 ${baseColors.textMuted}`

  const errorClasses = "text-xs text-red-500 mt-1"

  const buttonClasses = {
    primary: `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isDarkMode
        ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white"
        : "bg-sky-600 hover:bg-sky-700 text-white"
    }`,
    secondary: `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
    }`,
    outline: `px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
      isDarkMode
        ? "border-slate-600 hover:bg-slate-700 text-gray-300"
        : "border-gray-300 hover:bg-gray-100 text-gray-700"
    }`,
    icon: `p-2 rounded-full transition-all duration-200 ${
      isDarkMode ? "hover:bg-slate-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
    }`,
  }

  // Progress indicator steps
  const steps = [
    { id: "basicInfo", label: "Basic Info", icon: <FaInfoCircle /> },
    { id: "scheduleDetails", label: "Schedule", icon: <FaCalendarAlt /> },
    { id: "pricing", label: "Pricing", icon: <FaMoneyBillWave /> },
    { id: "media", label: "Media", icon: <FaImage /> },
  ]

  if (!isOpen || !course) return null

  return (
    <Modal isOpen={isOpen} onClose={handleExplicitClose} title="Edit Course" className="max-w-5xl">
      <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
        {/* Success Animation Overlay */}
        {showSuccessAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`${baseColors.success} text-white p-8 rounded-full`}
            >
              <FaCheck className="text-6xl" />
            </motion.div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                <button
                  onClick={() => {
                    setExpandedSections({
                      basicInfo: step.id === "basicInfo",
                      scheduleDetails: step.id === "scheduleDetails",
                      pricing: step.id === "pricing",
                      media: step.id === "media",
                      debug: expandedSections.debug,
                    })
                    setActiveStep(index)
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    activeStep === index
                      ? isDarkMode
                        ? "bg-cyan-600 text-white"
                        : "bg-sky-600 text-white"
                      : activeStep > index
                        ? isDarkMode
                          ? "bg-cyan-800 text-white"
                          : "bg-sky-200 text-sky-800"
                        : isDarkMode
                          ? "bg-slate-700 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {activeStep > index ? <FaCheck /> : step.icon}
                </button>
                <span
                  className={`text-xs font-medium ${
                    activeStep === index
                      ? baseColors.accent
                      : activeStep > index
                        ? baseColors.textMuted
                        : baseColors.textDim
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-12 w-[calc(100%-3rem)] h-0.5 ${
                      activeStep > index
                        ? isDarkMode
                          ? "bg-cyan-800"
                          : "bg-sky-200"
                        : isDarkMode
                          ? "bg-slate-700"
                          : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <AlertResponse message={error} type={AlertType.ERROR} />
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <AlertResponse message={success} type={AlertType.SUCCESS} />
          </motion.div>
        )}

        {/* User Info */}
        {user ? (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isDarkMode ? "bg-green-800/20" : "bg-green-50"
            } border ${isDarkMode ? "border-green-800" : "border-green-200"}`}
          >
            <div className="flex items-center">
              <FaUser className={`mr-2 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
              <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                Editing course as: <strong>{user.name}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`mb-4 p-3 rounded-lg ${
              isDarkMode ? "bg-amber-800/20" : "bg-amber-50"
            } border ${isDarkMode ? "border-amber-800" : "border-amber-200"}`}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className={`mr-2 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`} />
              <p className={`text-sm ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}>
                <strong>Warning:</strong> User information not found. Please refresh the page or log in again.
              </p>
            </div>
          </div>
        )}

        {/* Course Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information Section */}
          <div className={sectionClasses}>
            <div
              className={`${sectionHeaderClasses} ${
                expandedSections.basicInfo ? (isDarkMode ? "bg-cyan-900/50" : "bg-sky-100") : ""
              }`}
              onClick={() => toggleSection("basicInfo")}
            >
              <h3 className={`text-base font-semibold flex items-center ${baseColors.text}`}>
                <FaInfoCircle className={`mr-2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`} />
                Basic Information
              </h3>
              {expandedSections.basicInfo ? (
                <FaChevronUp className={baseColors.textDim} />
              ) : (
                <FaChevronDown className={baseColors.textDim} />
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
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Course Name */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="courseName" className={labelClasses}>
                            Course Name <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Enter a descriptive name for your course">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <input
                          type="text"
                          id="courseName"
                          className={`${inputClasses} ${
                            touched.courseName && errors.courseName
                              ? isDarkMode
                                ? "border-red-500 bg-red-900/20"
                                : "border-red-500 bg-red-50"
                              : ""
                          }`}
                          value={courseName}
                          onChange={(e) => setCourseName(e.target.value)}
                          onBlur={() => markAsTouched("courseName")}
                          placeholder="e.g., Advanced Freestyle Technique"
                        />
                        {touched.courseName && errors.courseName && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.courseName}
                          </motion.p>
                        )}
                      </div>

                      {/* Pool Type */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="poolType" className={labelClasses}>
                            Pool Type <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Select where the swimming lessons will take place">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <FaSwimmingPool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="poolType"
                            className={`${inputClasses} pl-10 ${
                              touched.poolType && errors.poolType
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={poolType}
                            onChange={(e) => setPoolType(e.target.value)}
                            onBlur={() => markAsTouched("poolType")}
                          >
                            <option value="">Select Pool Type</option>
                            <option value="students_pool">Students Pool</option>
                            <option value="instructor_pool">Instructor Pool</option>
                            <option value="public_pool">Public Pool</option>
                          </select>
                        </div>
                        {touched.poolType && errors.poolType && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.poolType}
                          </motion.p>
                        )}
                        {poolType && (
                          <p className={`text-xs mt-1 ${baseColors.textDim}`}>
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
                        <div className="flex items-center justify-between">
                          <label htmlFor="level" className={labelClasses}>
                            Level <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Select the skill level required for this course">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="level"
                            className={`${inputClasses} pl-10 ${
                              touched.level && errors.level
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            onBlur={() => markAsTouched("level")}
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        {touched.level && errors.level && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.level}
                          </motion.p>
                        )}
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
                            value={user?.name || "Loading..."}
                            placeholder="Instructor Name"
                            readOnly={true}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${baseColors.textDim}`}>
                          ID: {user?.user_id || user?.id || "Loading..."}
                        </p>
                      </div>
                    </div>

                    {/* Location - only show if not students pool */}
                    {poolType !== "students_pool" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <label htmlFor="location" className={labelClasses}>
                            <FaMapMarkedAlt
                              className={`inline mr-2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`}
                            />
                            Location <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Enter the address or select a location on the map">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative mb-2">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="location"
                            className={`${inputClasses} pl-10 ${
                              touched.location && errors.location
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onBlur={() => markAsTouched("location")}
                            placeholder="e.g., Aquatic Center, Bangkok"
                          />
                        </div>
                        {touched.location && errors.location && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.location}
                          </motion.p>
                        )}

                        <div className="mt-4 mb-4">
                          <p className={`text-sm mb-2 ${baseColors.textMuted}`}>Select location on the map:</p>
                          <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                            <OSMMapSelector
                              onLocationSelect={handleLocationSelect}
                              center={locationCoords || { lat: 13.7563, lng: 100.5018 }} // Default: Bangkok
                              initialMarker={locationCoords}
                            />
                          </div>
                          <p className={`text-xs mt-2 ${baseColors.textDim}`}>
                            Click on the map to set the location or drag the marker to adjust.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="description" className={labelClasses}>
                          Description <span className="text-red-500">*</span>
                        </label>
                        <Tooltip content="Provide details about what students will learn in this course">
                          <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                        </Tooltip>
                      </div>
                      <textarea
                        id="description"
                        rows={4}
                        className={`${inputClasses} ${
                          touched.description && errors.description
                            ? isDarkMode
                              ? "border-red-500 bg-red-900/20"
                              : "border-red-500 bg-red-50"
                            : ""
                        }`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => markAsTouched("description")}
                        placeholder="Provide a detailed description of the course..."
                      />
                      {touched.description && errors.description && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={errorClasses}
                        >
                          {errors.description}
                        </motion.p>
                      )}
                      <p className={`text-xs mt-1 ${baseColors.textDim}`}>
                        Include key information about what students will learn and the benefits of your course.
                      </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end pt-4">
                      <button type="button" className={buttonClasses.primary} onClick={goToNextStep}>
                        Next: Schedule Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Schedule Details Section */}
          <div className={sectionClasses}>
            <div
              className={`${sectionHeaderClasses} ${
                expandedSections.scheduleDetails ? (isDarkMode ? "bg-cyan-900/50" : "bg-sky-100") : ""
              }`}
              onClick={() => toggleSection("scheduleDetails")}
            >
              <h3 className={`text-base font-semibold flex items-center ${baseColors.text}`}>
                <FaCalendarAlt className={`mr-2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`} />
                Schedule Details
              </h3>
              {expandedSections.scheduleDetails ? (
                <FaChevronUp className={baseColors.textDim} />
              ) : (
                <FaChevronDown className={baseColors.textDim} />
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
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Course Duration */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="courseDuration" className={labelClasses}>
                            Course Duration (months) <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Enter how many months the course will run">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="courseDuration"
                            className={`${inputClasses} pl-10 ${
                              touched.courseDuration && errors.courseDuration
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            onBlur={() => markAsTouched("courseDuration")}
                            placeholder="e.g., 3"
                            min="1"
                          />
                        </div>
                        {touched.courseDuration && errors.courseDuration && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.courseDuration}
                          </motion.p>
                        )}
                      </div>

                      {/* Study Frequency */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="studyFrequency" className={labelClasses}>
                            Study Frequency <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="How often will classes be held">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <FaRegClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <select
                            id="studyFrequency"
                            className={`${inputClasses} pl-10 ${
                              touched.studyFrequency && errors.studyFrequency
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={studyFrequency}
                            onChange={(e) => setStudyFrequency(e.target.value)}
                            onBlur={() => markAsTouched("studyFrequency")}
                          >
                            <option value="">Select Frequency</option>
                            <option value="1 time per week">1 time per week</option>
                            <option value="1-2 times per week">1-2 times per week</option>
                            <option value="2-3 times per week">2-3 times per week</option>
                            <option value="3-4 times per week">3-4 times per week</option>
                            <option value="4-5 times per week">4-5 times per week</option>
                            <option value="5+ times per week">5+ times per week</option>
                          </select>
                        </div>
                        {touched.studyFrequency && errors.studyFrequency && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.studyFrequency}
                          </motion.p>
                        )}
                      </div>

                      {/* Number of Total Sessions */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="numberOfTotalSessions" className={labelClasses}>
                            Total Sessions <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Total number of classes in the course">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <FaBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="numberOfTotalSessions"
                            className={`${inputClasses} pl-10 ${
                              touched.numberOfTotalSessions && errors.numberOfTotalSessions
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={numberOfTotalSessions}
                            onChange={(e) => setNumberOfTotalSessions(e.target.value)}
                            onBlur={() => markAsTouched("numberOfTotalSessions")}
                            placeholder="e.g., 24"
                            min="1"
                          />
                        </div>
                        {touched.numberOfTotalSessions && errors.numberOfTotalSessions && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.numberOfTotalSessions}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="schedule" className={labelClasses}>
                          Schedule <span className="text-red-500">*</span>
                        </label>
                        <Tooltip content="Set the days and times when classes will be held">
                          <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                        </Tooltip>
                      </div>
                      <div
                        className="space-y-3 bg-opacity-50 p-4 rounded-lg border border-dashed border-opacity-50 
                        ${isDarkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-300'}"
                      >
                        {scheduleItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              isDarkMode ? "bg-slate-700" : "bg-white"
                            } shadow-sm`}
                          >
                            <div className="flex-1">
                              <select
                                className={`${inputClasses} mb-0`}
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
                              <span className={baseColors.text}>to</span>
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
                                  ? "bg-red-900/50 text-red-300 hover:bg-red-800"
                                  : "bg-red-100 text-red-500 hover:bg-red-200"
                              }`}
                              aria-label="Remove schedule item"
                            >
                              <FaTimes />
                            </button>
                          </motion.div>
                        ))}
                        <button
                          type="button"
                          onClick={addScheduleItem}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg w-full justify-center transition-all duration-200 ${
                            isDarkMode
                              ? "bg-slate-700/50 text-cyan-400 hover:bg-slate-600"
                              : "bg-sky-50 text-sky-600 hover:bg-sky-100"
                          }`}
                        >
                          <FaPlus size={12} /> Add Schedule
                        </button>
                      </div>
                      {touched.schedule && errors.schedule && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={errorClasses}
                        >
                          {errors.schedule}
                        </motion.p>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <button type="button" className={buttonClasses.outline} onClick={goToPrevStep}>
                        Back: Basic Info
                      </button>
                      <button type="button" className={buttonClasses.primary} onClick={goToNextStep}>
                        Next: Pricing
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Section */}
          <div className={sectionClasses}>
            <div
              className={`${sectionHeaderClasses} ${
                expandedSections.pricing ? (isDarkMode ? "bg-cyan-900/50" : "bg-sky-100") : ""
              }`}
              onClick={() => toggleSection("pricing")}
            >
              <h3 className={`text-base font-semibold flex items-center ${baseColors.text}`}>
                <FaMoneyBillWave className={`mr-2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`} />
                Pricing
              </h3>
              {expandedSections.pricing ? (
                <FaChevronUp className={baseColors.textDim} />
              ) : (
                <FaChevronDown className={baseColors.textDim} />
              )}
            </div>

            <AnimatePresence>
              {expandedSections.pricing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Price */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="price" className={labelClasses}>
                            Price <span className="text-red-500">*</span>
                          </label>
                          <Tooltip content="Set the price for your course in your local currency">
                            <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="price"
                            className={`${inputClasses} pl-10 ${
                              touched.price && errors.price
                                ? isDarkMode
                                  ? "border-red-500 bg-red-900/20"
                                  : "border-red-500 bg-red-50"
                                : ""
                            }`}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            onBlur={() => markAsTouched("price")}
                            min="0"
                          />
                        </div>
                        {touched.price && errors.price && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={errorClasses}
                          >
                            {errors.price}
                          </motion.p>
                        )}
                        <p className={`text-xs mt-1 ${baseColors.textDim}`}>
                          Set the price for your course in your local currency
                        </p>
                      </div>
                    </div>

                    {/* Pricing Information Card */}
                    <div
                      className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"} border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
                    >
                      <h4 className={`text-sm font-medium mb-2 ${baseColors.textMuted}`}>Pricing Tips</h4>
                      <ul className={`text-xs space-y-2 ${baseColors.textDim}`}>
                        <li className="flex items-start">
                          <span className={`mr-2 mt-0.5 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`}>•</span>
                          Consider your target audience and their budget when setting prices
                        </li>
                        <li className="flex items-start">
                          <span className={`mr-2 mt-0.5 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`}>•</span>
                          Factor in your experience level, pool rental costs, and equipment
                        </li>
                        <li className="flex items-start">
                          <span className={`mr-2 mt-0.5 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`}>•</span>
                          Research competitor pricing in your area for similar courses
                        </li>
                      </ul>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <button type="button" className={buttonClasses.outline} onClick={goToPrevStep}>
                        Back: Schedule Details
                      </button>
                      <button type="button" className={buttonClasses.primary} onClick={goToNextStep}>
                        Next: Media
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Media Section */}
          <div className={sectionClasses}>
            <div
              className={`${sectionHeaderClasses} ${
                expandedSections.media ? (isDarkMode ? "bg-cyan-900/50" : "bg-sky-100") : ""
              }`}
              onClick={() => toggleSection("media")}
            >
              <h3 className={`text-base font-semibold flex items-center ${baseColors.text}`}>
                <FaImage className={`mr-2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`} />
                Media
              </h3>
              {expandedSections.media ? (
                <FaChevronUp className={baseColors.textDim} />
              ) : (
                <FaChevronDown className={baseColors.textDim} />
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
                  <div className="p-6 space-y-6">
                    {/* Course Image Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label htmlFor="courseImageUpload" className={labelClasses}>
                          Course Image
                        </label>
                        <Tooltip content="Upload an image that represents your course">
                          <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
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
                              onChange={(e) => handleFileChange(e, false)}
                            />
                            <FaUpload
                              className={`mx-auto text-3xl mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                            />
                            <p className={`${baseColors.textMuted} font-medium mb-1`}>Click to upload course image</p>
                            <p className={`text-xs ${baseColors.textDim}`}>JPG, PNG or GIF, max 5MB</p>
                          </div>

                          {/* Upload Progress */}
                          {isUploading && (
                            <div className="mt-2">
                              <p className={`text-xs mb-1 ${baseColors.textDim}`}>Uploading: {uploadProgress}%</p>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div
                                  className={`h-2.5 rounded-full ${isDarkMode ? "bg-cyan-500" : "bg-sky-500"}`}
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Alternative URL input */}
                          <div className="mt-4">
                            <p className={`text-xs mb-2 ${baseColors.textMuted}`}>Or enter image URL:</p>
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
                          <p className={`text-sm mb-2 ${baseColors.textMuted}`}>Preview:</p>
                          <div
                            className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-slate-600" : "border-gray-200"} shadow-sm`}
                          >
                            {imagePreview ? (
                              <div className="relative">
                                <img
                                  src={imagePreview || "/placeholder.svg"}
                                  alt="Course preview"
                                  className="w-full h-56 object-cover"
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
                                    setSelectedImage(null)
                                  }}
                                  className={`absolute top-2 right-2 p-2 rounded-full ${
                                    isDarkMode
                                      ? "bg-slate-800/80 text-red-400 hover:bg-slate-700"
                                      : "bg-white/80 text-red-500 hover:bg-gray-100"
                                  }`}
                                  aria-label="Remove image"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`h-56 flex flex-col items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
                              >
                                <FaImage className={`text-4xl mb-2 ${baseColors.textDim}`} />
                                <p className={`text-sm ${baseColors.textDim}`}>No image selected</p>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs mt-2 ${baseColors.textDim}`}>
                            A good course image helps attract students and conveys what your course is about
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pool Image Upload */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-3">
                        <label htmlFor="poolImageUpload" className={labelClasses}>
                          <FaWater className="inline mr-2" /> Pool Image (Optional)
                        </label>
                        <Tooltip content="Upload an image of the pool where lessons will take place">
                          <FaQuestionCircle className={`${baseColors.textDim} cursor-help`} />
                        </Tooltip>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
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
                              onChange={(e) => handleFileChange(e, true)}
                            />
                            <FaUpload
                              className={`mx-auto text-3xl mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                            />
                            <p className={`${baseColors.textMuted} font-medium mb-1`}>Click to upload pool image</p>
                            <p className={`text-xs ${baseColors.textDim}`}>JPG, PNG or GIF, max 5MB</p>
                          </div>

                          {/* Alternative URL input */}
                          <div className="mt-4">
                            <p className={`text-xs mb-2 ${baseColors.textMuted}`}>Or enter image URL:</p>
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
                          <p className={`text-sm mb-2 ${baseColors.textMuted}`}>Preview:</p>
                          <div
                            className={`rounded-lg overflow-hidden border ${isDarkMode ? "border-slate-600" : "border-gray-200"} shadow-sm`}
                          >
                            {poolImagePreview ? (
                              <div className="relative">
                                <img
                                  src={poolImagePreview || "/placeholder.svg"}
                                  alt="Pool preview"
                                  className="w-full h-56 object-cover"
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
                                    setSelectedPoolImage(null)
                                  }}
                                  className={`absolute top-2 right-2 p-2 rounded-full ${
                                    isDarkMode
                                      ? "bg-slate-800/80 text-red-400 hover:bg-slate-700"
                                      : "bg-white/80 text-red-500 hover:bg-gray-100"
                                  }`}
                                  aria-label="Remove image"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ) : (
                              <div
                                className={`h-56 flex flex-col items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}
                              >
                                <FaWater className={`text-4xl mb-2 ${baseColors.textDim}`} />
                                <p className={`text-sm ${baseColors.textDim}`}>No pool image selected</p>
                              </div>
                            )}
                          </div>
                          <p className={`text-xs mt-2 ${baseColors.textDim}`}>
                            Showing the pool helps students know what to expect (feature coming soon)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <button type="button" className={buttonClasses.outline} onClick={goToPrevStep}>
                        Back: Pricing
                      </button>
                      <button
                        type="submit"
                        className={`${buttonClasses.primary} flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Updating Course...
                          </>
                        ) : (
                          <>Update Course</>
                        )}
                      </button>
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
        </form>
      </div>
    </Modal>
  )
}
