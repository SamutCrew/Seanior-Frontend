"use client"

import type React from "react"

import { useState } from "react"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"
import { createCourse } from "@/api/course_api"
import { AlertType } from "@/types/AlertTypes"
import AlertResponse from "@/components/Responseback/AlertResponse"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaInfoCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserFriends,
  FaBook,
  FaSwimmingPool,
  FaMoneyBillWave,
  FaStar,
  FaImage,
  FaChevronDown,
  FaChevronUp,
  FaUser,
} from "react-icons/fa"
import { Button } from "@/components/Common/Button"

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Course>) => void
  stats: {
    totalCourses: number
    totalStudents: number
    avgRating: string
    totalRevenue: number
  }
}

// Define a type for the database-style course data
interface CourseDbData {
  course_name: string
  pool_type: string
  location: string
  description: string
  course_duration: number
  study_frequency: number
  days_study: number
  number_of_total_sessions: number
  image: string
  level: string
  max_students: number
  price: number
  rating: number
  schedule: string
  students: number
  created_at: string
  updated_at: string
  instructor: {
    connect: {
      user_id: string // Changed from id to user_id
    }
  }
}

export default function CreateCourseModal({ isOpen, onClose, onSubmit, stats }: CreateCourseModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null)

  // Mock user data - replace with actual user context in production
  const currentUser = {
    user_id: "cmagf1kfm0000ta6gwb80i9xv", // Using user_id instead of id
    name: "John Doe",
    role: "instructor",
  }

  // Form state
  const [courseName, setCourseName] = useState("")
  const [poolType, setPoolType] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [studyFrequency, setStudyFrequency] = useState("")
  const [daysStudy, setDaysStudy] = useState("")
  const [numberOfTotalSessions, setNumberOfTotalSessions] = useState("")
  const [image, setImage] = useState("default.jpg")
  const [level, setLevel] = useState("")
  const [maxStudents, setMaxStudents] = useState("")
  const [price, setPrice] = useState("")
  const [rating, setRating] = useState("4.0")
  const [schedule, setSchedule] = useState("")
  const [students, setStudents] = useState("0")

  // Form section expansion state
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    scheduleDetails: true,
    enrollment: true,
    media: false,
    debug: false,
  })

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!courseName.trim()) newErrors.courseName = "Course name is required"
    if (!poolType) newErrors.poolType = "Pool type is required"
    if (!location.trim()) newErrors.location = "Location is required"
    if (!description.trim()) newErrors.description = "Description is required"

    if (!courseDuration) {
      newErrors.courseDuration = "Course duration is required"
    } else if (isNaN(Number(courseDuration)) || Number(courseDuration) <= 0) {
      newErrors.courseDuration = "Must be a positive number"
    }

    if (!studyFrequency) {
      newErrors.studyFrequency = "Study frequency is required"
    } else if (isNaN(Number(studyFrequency)) || Number(studyFrequency) <= 0) {
      newErrors.studyFrequency = "Must be a positive number"
    }

    if (!daysStudy) {
      newErrors.daysStudy = "Days of study is required"
    } else if (isNaN(Number(daysStudy)) || Number(daysStudy) <= 0) {
      newErrors.daysStudy = "Must be a positive number"
    }

    if (!numberOfTotalSessions) {
      newErrors.numberOfTotalSessions = "Total sessions is required"
    } else if (isNaN(Number(numberOfTotalSessions)) || Number(numberOfTotalSessions) <= 0) {
      newErrors.numberOfTotalSessions = "Must be a positive number"
    }

    if (!level) newErrors.level = "Level is required"
    if (!schedule.trim()) newErrors.schedule = "Schedule is required"

    if (!maxStudents) {
      newErrors.maxStudents = "Maximum students is required"
    } else if (isNaN(Number(maxStudents)) || Number(maxStudents) <= 0) {
      newErrors.maxStudents = "Must be a positive number"
    }

    if (!price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = "Must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Reset state when modal opens/closes
  const handleClose = () => {
    // Reset form state
    setCourseName("")
    setPoolType("")
    setLocation("")
    setDescription("")
    setCourseDuration("")
    setStudyFrequency("")
    setDaysStudy("")
    setNumberOfTotalSessions("")
    setImage("default.jpg")
    setLevel("")
    setMaxStudents("")
    setPrice("")
    setRating("4.0")
    setSchedule("")
    setStudents("0")

    // Reset other state
    setErrors({})
    setError(null)
    setSuccess(null)
    setIsSubmitting(false)
    setApiDebugInfo(null)

    // Close modal
    onClose()
  }

  // Helper function to convert database-style object to Course type
  const mapDbDataToCourse = (dbData: CourseDbData): Partial<Course> => {
    return {
      id: 0, // This will be assigned by the database
      title: dbData.course_name,
      focus: dbData.description.substring(0, 50) + (dbData.description.length > 50 ? "..." : ""),
      level: dbData.level,
      duration: dbData.course_duration.toString(),
      schedule: dbData.schedule,
      instructor: currentUser?.name || "Current Instructor",
      instructorId: currentUser.user_id, // Using user_id instead of id
      rating: dbData.rating,
      students: dbData.students,
      price: dbData.price,
      location: {
        address: dbData.location,
      },
      courseType:
        dbData.pool_type === "Online"
          ? "private-location"
          : dbData.pool_type === "Offline"
            ? "public-pool"
            : "teacher-pool",
      status: "open",
      description: dbData.description,
      maxStudents: dbData.max_students,
      image: dbData.image,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Find the first section with an error and expand it
      if (errors.courseName || errors.poolType || errors.location || errors.description) {
        setExpandedSections((prev) => ({ ...prev, basicInfo: true }))
      } else if (
        errors.courseDuration ||
        errors.studyFrequency ||
        errors.daysStudy ||
        errors.numberOfTotalSessions ||
        errors.schedule
      ) {
        setExpandedSections((prev) => ({ ...prev, scheduleDetails: true }))
      } else if (errors.maxStudents || errors.price || errors.level) {
        setExpandedSections((prev) => ({ ...prev, enrollment: true }))
      }
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)
    setApiDebugInfo(null)

    try {
      // Create the database-style object with instructor connection
      const dbData: CourseDbData = {
        course_name: courseName,
        pool_type: poolType,
        location,
        description,
        course_duration: Number(courseDuration),
        study_frequency: Number(studyFrequency),
        days_study: Number(daysStudy),
        number_of_total_sessions: Number(numberOfTotalSessions),
        image,
        level,
        max_students: Number(maxStudents),
        price: Number(price),
        rating: Number(rating),
        schedule,
        students: Number(students),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        instructor: {
          connect: {
            user_id: currentUser.user_id, // Using user_id instead of id
          },
        },
      }

      console.log("Submitting course data:", dbData)

      // Call the API with the database-style object
      const response = await createCourse(dbData)
      console.log("API Response:", response)

      // Store debug info
      setApiDebugInfo({
        requestData: dbData,
        responseData: response,
      })

      // Map to Course type for the parent component
      const courseData = mapDbDataToCourse(dbData)

      // Call the parent component's onSubmit with the mapped data
      onSubmit(courseData)

      setSuccess("Course created successfully!")

      // Close the modal after a short delay
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err: any) {
      console.error("Error creating course:", err)

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
      })

      // Set user-friendly error message
      let errorMessage = "Failed to create course. Please try again."

      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = "Invalid course data. Please check your inputs."
        } else if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "You don't have permission to create courses."
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later."
        }

        // Add more specific error message if available
        if (err.response.data && err.response.data.message) {
          errorMessage += ` (${err.response.data.message})`
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection."
      }

      setError(errorMessage)

      // Expand debug section on error
      setExpandedSections((prev) => ({ ...prev, debug: true }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Styling
  const sectionClasses = `mb-4 rounded-xl overflow-hidden ${
    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-100 shadow-sm"
  }`

  const sectionHeaderClasses = `flex items-center justify-between p-3 cursor-pointer ${
    isDarkMode ? "bg-slate-700" : "bg-gray-50"
  }`

  const inputClasses = `w-full rounded-lg p-2.5 focus:ring-2 ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
      : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500"
  }`

  const labelClasses = `block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`

  const errorClasses = "text-xs text-red-500 mt-1"

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Course">
      <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto">
        {/* Stats in Create Modal */}
        <div className={`${isDarkMode ? "bg-slate-700" : "bg-sky-50"} rounded-xl p-4 mb-5 transition-all duration-200`}>
          <h3 className={`font-medium ${isDarkMode ? "text-cyan-400" : "text-sky-700"} mb-2`}>Your Current Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-3 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Courses</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{stats.totalCourses}</p>
            </div>
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-3 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Students</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {stats.totalStudents}
              </p>
            </div>
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-3 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Avg Rating</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{stats.avgRating}</p>
            </div>
            <div
              className={`${isDarkMode ? "bg-slate-800" : "bg-white"} p-3 rounded-lg hover:shadow-sm transition-all duration-200`}
            >
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Revenue</p>
              <p className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div
          className={`mb-5 p-3 rounded-lg border ${
            isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-blue-50 border-blue-100"
          }`}
        >
          <div className="flex items-start">
            <FaInfoCircle className={`mt-1 mr-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
            <div>
              <h4 className={`font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Tips for Creating Effective Courses
              </h4>
              <ul className={`text-sm space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <li>• Use clear, descriptive course names</li>
                <li>• Provide detailed information about what students will learn</li>
                <li>• Set realistic expectations for course duration and schedule</li>
                <li>• Choose an appropriate price point for your target audience</li>
              </ul>
            </div>
          </div>
        </div>

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

        {/* Course Creation Form */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                        {errors.poolType && <p className={errorClasses}>{errors.poolType}</p>}
                      </div>

                      {/* Location */}
                      <div>
                        <label htmlFor="location" className={labelClasses}>
                          Location <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
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
                            value={currentUser.user_id}
                            placeholder="Instructor ID"
                            readOnly={true}
                          />
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Course will be created by: {currentUser.name}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className={labelClasses}>
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        rows={3}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Course Duration */}
                      <div>
                        <label htmlFor="courseDuration" className={labelClasses}>
                          Course Duration (days) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="courseDuration"
                            className={`${inputClasses} pl-10`}
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                            placeholder="e.g., 30"
                            min="1"
                          />
                        </div>
                        {errors.courseDuration && <p className={errorClasses}>{errors.courseDuration}</p>}
                      </div>

                      {/* Study Frequency */}
                      <div>
                        <label htmlFor="studyFrequency" className={labelClasses}>
                          Study Frequency (per week) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="studyFrequency"
                          className={inputClasses}
                          value={studyFrequency}
                          onChange={(e) => setStudyFrequency(e.target.value)}
                          placeholder="e.g., 3"
                          min="1"
                        />
                        {errors.studyFrequency && <p className={errorClasses}>{errors.studyFrequency}</p>}
                      </div>

                      {/* Days Study */}
                      <div>
                        <label htmlFor="daysStudy" className={labelClasses}>
                          Days of Study <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="daysStudy"
                          className={inputClasses}
                          value={daysStudy}
                          onChange={(e) => setDaysStudy(e.target.value)}
                          placeholder="e.g., 10"
                          min="1"
                        />
                        {errors.daysStudy && <p className={errorClasses}>{errors.daysStudy}</p>}
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
                            placeholder="e.g., 100"
                            min="1"
                          />
                        </div>
                        {errors.numberOfTotalSessions && <p className={errorClasses}>{errors.numberOfTotalSessions}</p>}
                      </div>

                      {/* Schedule */}
                      <div>
                        <label htmlFor="schedule" className={labelClasses}>
                          Schedule <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="schedule"
                            className={`${inputClasses} pl-10`}
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            placeholder="e.g., MWF 10:00-11:30 AM"
                          />
                        </div>
                        {errors.schedule && <p className={errorClasses}>{errors.schedule}</p>}
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Specify days and times (e.g., MWF 10:00-11:30 AM)
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enrollment & Pricing Section */}
          <div className={sectionClasses}>
            <div className={sectionHeaderClasses} onClick={() => toggleSection("enrollment")}>
              <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                <FaUserFriends className="inline mr-2 text-cyan-500" /> Enrollment & Pricing
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Max Students */}
                      <div>
                        <label htmlFor="maxStudents" className={labelClasses}>
                          Maximum Students <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="maxStudents"
                            className={`${inputClasses} pl-10`}
                            value={maxStudents}
                            onChange={(e) => setMaxStudents(e.target.value)}
                            min="1"
                          />
                        </div>
                        {errors.maxStudents && <p className={errorClasses}>{errors.maxStudents}</p>}
                      </div>

                      {/* Current Students */}
                      <div>
                        <label htmlFor="students" className={labelClasses}>
                          Current Students
                        </label>
                        <input
                          type="number"
                          id="students"
                          className={inputClasses}
                          value={students}
                          onChange={(e) => setStudents(e.target.value)}
                          min="0"
                        />
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          For new courses, leave at 0
                        </p>
                      </div>

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
                      </div>

                      {/* Rating */}
                      <div>
                        <label htmlFor="rating" className={labelClasses}>
                          Rating
                        </label>
                        <div className="relative">
                          <FaStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            id="rating"
                            className={`${inputClasses} pl-10`}
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            step="0.1"
                            min="0"
                            max="5"
                          />
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          For new courses, default rating is 4.0
                        </p>
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
                    {/* Image */}
                    <div>
                      <label htmlFor="image" className={labelClasses}>
                        Course Image
                      </label>
                      <div className="relative">
                        <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="image"
                          className={`${inputClasses} pl-10`}
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="e.g., swimming-course.jpg"
                        />
                      </div>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Enter image filename or URL. Default is "default.jpg"
                      </p>
                    </div>

                    {/* Future: Image upload component */}
                    <div
                      className={`p-4 border border-dashed rounded-lg text-center ${
                        isDarkMode ? "border-gray-600 bg-slate-700/50" : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <FaImage className={`mx-auto text-3xl mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                        Image upload functionality coming soon
                      </p>
                      <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        For now, please enter the image filename
                      </p>
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
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant={isDarkMode ? "gradient" : "primary"} disabled={isSubmitting}>
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
