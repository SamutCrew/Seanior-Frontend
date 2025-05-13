"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAppSelector } from "@/app/redux"
import type { Course } from "@/types/course"
import ImageUploader from "./ImageUploader"
import ScheduleSelector from "./ScheduleSelector"
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaSwimmer,
  FaMoneyBillWave,
  FaUsers,
  FaChalkboardTeacher,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaTimes,
  FaKeyboard,
} from "react-icons/fa"

interface EnhancedCourseFormProps {
  initialData?: Partial<Course>
  onSubmit: (data: Partial<Course>) => void
  onCancel: () => void
  isSubmitting?: boolean
  isEditing?: boolean
}

export default function EnhancedCourseForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEditing = false,
}: EnhancedCourseFormProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  // Form state
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(() => {
    // Log the initial data for debugging
    console.log("EnhancedCourseForm initialData:", initialData)

    // Process schedule data for proper initialization
    let scheduleData = initialData?.schedule || {}

    // Ensure schedule is properly formatted
    if (typeof scheduleData === "string") {
      try {
        scheduleData = JSON.parse(scheduleData)
      } catch (e) {
        console.error("Failed to parse schedule string in EnhancedCourseForm:", e)
        scheduleData = {}
      }
    }

    console.log("Processed schedule data in EnhancedCourseForm:", scheduleData)

    return {
      course_name: initialData?.course_name || "",
      price: initialData?.price || 0,
      pool_type: initialData?.pool_type || "public-pool",
      location: initialData?.location || "",
      description: initialData?.description || "",
      course_duration: initialData?.course_duration || 8,
      study_frequency: initialData?.study_frequency || "1",
      days_study: initialData?.days_study || 1,
      number_of_total_sessions: initialData?.number_of_total_sessions || 8,
      level: initialData?.level || "Beginner",
      schedule: scheduleData,
      max_students: initialData?.max_students || 10,
      courseImageFile: null as File | null,
      poolImageFile: null as File | null,
    }
  })

  // Refs for keyboard navigation
  const courseNameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const poolTypeRef = useRef<HTMLSelectElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Styling
  const inputClasses = `mt-1 block w-full rounded-md text-base py-3 ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
      : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
  } shadow-sm`

  const labelClasses = `block text-base font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`

  const buttonClasses = {
    primary: `${
      isDarkMode
        ? "bg-gradient-to-r from-cyan-800 to-blue-900 hover:from-cyan-700 hover:to-blue-800 border border-cyan-700"
        : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500"
    } text-white px-5 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-base`,
    secondary: `${
      isDarkMode
        ? "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
    } px-5 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-base`,
    icon: `${
      isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
    } p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500`,
  }

  const sectionClasses = `${
    isDarkMode ? "bg-slate-800 border-slate-700 shadow-lg shadow-slate-900/50" : "bg-white border-gray-200 shadow-sm"
  } p-6 rounded-lg border mb-6`

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process if not in an input field
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return
      }

      // Alt + arrow keys for navigation
      if (e.altKey) {
        if (e.key === "ArrowRight" && currentStep < 3) {
          e.preventDefault()
          handleNextStep(new MouseEvent("click") as any)
        } else if (e.key === "ArrowLeft" && currentStep > 1) {
          e.preventDefault()
          handlePrevStep(new MouseEvent("click") as any)
        }
      }

      // Show keyboard shortcuts with Alt+K
      if (e.altKey && e.key === "k") {
        e.preventDefault()
        setShowKeyboardShortcuts((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep])

  // Focus first field when step changes
  useEffect(() => {
    if (currentStep === 1 && courseNameRef.current) {
      courseNameRef.current.focus()
    }
  }, [currentStep])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Handle schedule changes
  const handleScheduleChange = (scheduleData: any) => {
    console.log("Schedule changed in EnhancedCourseForm:", scheduleData)

    setFormData((prevData) => {
      const newData = {
        ...prevData,
        schedule: scheduleData,
      }
      console.log("Updated form data with new schedule:", newData)
      return newData
    })

    // Clear error
    if (errors.schedule) {
      setErrors({
        ...errors,
        schedule: "",
      })
    }
  }

  // Handle image uploads
  const handleCourseImageChange = (file: File | null) => {
    setFormData({
      ...formData,
      courseImageFile: file,
    })
  }

  const handlePoolImageChange = (file: File | null) => {
    setFormData({
      ...formData,
      poolImageFile: file,
    })
  }

  // Calculate total sessions based on duration and frequency
  useEffect(() => {
    const frequency = Number.parseInt(formData.study_frequency) || 1
    const duration = formData.course_duration || 8
    const calculatedSessions = frequency * duration

    setFormData((prev) => ({
      ...prev,
      number_of_total_sessions: calculatedSessions,
    }))
  }, [formData.study_frequency, formData.course_duration])

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Step 1 validation
    if (currentStep === 1) {
      if (!formData.course_name.trim()) {
        newErrors.course_name = "Course name is required"
      }

      if (formData.price <= 0) {
        newErrors.price = "Price must be greater than 0"
      }

      if (!formData.location.trim()) {
        newErrors.location = "Location is required"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      }
    }

    // Step 2 validation
    if (currentStep === 2) {
      if (formData.course_duration <= 0) {
        newErrors.course_duration = "Duration must be greater than 0"
      }

      if (Number.parseInt(formData.study_frequency) <= 0) {
        newErrors.study_frequency = "Study frequency must be greater than 0"
      }

      if (formData.days_study < 0) {
        newErrors.days_study = "Days of study cannot be negative"
      }

      if (formData.number_of_total_sessions <= 0) {
        newErrors.number_of_total_sessions = "Total sessions must be greater than 0"
      }

      if (!formData.level) {
        newErrors.level = "Level is required"
      }

      // Check if any day is selected in the schedule
      let anyDaySelected = false
      if (typeof formData.schedule === "object" && formData.schedule !== null) {
        Object.keys(formData.schedule).forEach((day) => {
          if (formData.schedule[day]?.selected) {
            anyDaySelected = true
          }
        })
      }

      if (!anyDaySelected) {
        newErrors.schedule = "Please select at least one day for the schedule"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    if (validateForm()) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle previous step
  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    setCurrentStep(currentStep - 1)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log("Submitting form data:", formData)

      // Create a copy of the form data for submission
      const submissionData = { ...formData }

      // Ensure schedule is properly formatted for submission
      if (submissionData.schedule && typeof submissionData.schedule === "object") {
        // Convert schedule to string if needed by your API
        // Some APIs expect JSON strings rather than objects
        console.log("Schedule data before submission:", submissionData.schedule)

        // Keep the schedule as an object but ensure it's properly structured
        const cleanedSchedule = { ...submissionData.schedule }

        // Log the final schedule data
        console.log("Final schedule data for submission:", cleanedSchedule)
        submissionData.schedule = cleanedSchedule
      }

      // Submit the form data
      console.log("Final submission data:", submissionData)
      onSubmit(submissionData)
    }
  }

  // Get step title with appropriate styling
  const getStepTitle = (step: number, title: string) => {
    return (
      <div className="flex items-center">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
            isDarkMode
              ? currentStep === step
                ? "bg-cyan-600 text-white"
                : "bg-slate-700 text-gray-300"
              : currentStep === step
                ? "bg-sky-500 text-white"
                : "bg-gray-200 text-gray-700"
          }`}
        >
          {step}
        </span>
        <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
      </div>
    )
  }

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Keyboard shortcuts help */}
      {showKeyboardShortcuts && (
        <div
          className={`${isDarkMode ? "bg-slate-700" : "bg-gray-100"} p-4 rounded-lg mb-4 border ${isDarkMode ? "border-slate-600" : "border-gray-200"}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Keyboard Shortcuts</h3>
            <button type="button" className={buttonClasses.icon} onClick={() => setShowKeyboardShortcuts(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 rounded ${isDarkMode ? "bg-slate-800" : "bg-white border"}`}>Alt + →</kbd>
              <span>Next step</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 rounded ${isDarkMode ? "bg-slate-800" : "bg-white border"}`}>Alt + ←</kbd>
              <span>Previous step</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 rounded ${isDarkMode ? "bg-slate-800" : "bg-white border"}`}>Alt + K</kbd>
              <span>Toggle shortcuts</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className={`px-2 py-1 rounded ${isDarkMode ? "bg-slate-800" : "bg-white border"}`}>Tab</kbd>
              <span>Next field</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div
            className={`flex-1 h-3 rounded-full ${
              currentStep >= 1
                ? isDarkMode
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700"
                  : "bg-gradient-to-r from-sky-500 to-blue-600"
                : isDarkMode
                  ? "bg-slate-700"
                  : "bg-gray-200"
            }`}
          />
          <div className="mx-2" />
          <div
            className={`flex-1 h-3 rounded-full ${
              currentStep >= 2
                ? isDarkMode
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700"
                  : "bg-gradient-to-r from-sky-500 to-blue-600"
                : isDarkMode
                  ? "bg-slate-700"
                  : "bg-gray-200"
            }`}
          />
          <div className="mx-2" />
          <div
            className={`flex-1 h-3 rounded-full ${
              currentStep >= 3
                ? isDarkMode
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700"
                  : "bg-gradient-to-r from-sky-500 to-blue-600"
                : isDarkMode
                  ? "bg-slate-700"
                  : "bg-gray-200"
            }`}
          />
        </div>
        <div className="flex justify-between mt-2 text-base">
          <span
            className={`flex items-center ${currentStep === 1 ? (isDarkMode ? "text-cyan-400" : "text-sky-600") : ""}`}
          >
            {currentStep === 1 && (
              <span className={`w-2 h-2 rounded-full mr-1 ${isDarkMode ? "bg-cyan-400" : "bg-sky-600"}`}></span>
            )}
            Basic Info
          </span>
          <span
            className={`flex items-center ${currentStep === 2 ? (isDarkMode ? "text-cyan-400" : "text-sky-600") : ""}`}
          >
            {currentStep === 2 && (
              <span className={`w-2 h-2 rounded-full mr-1 ${isDarkMode ? "bg-cyan-400" : "bg-sky-600"}`}></span>
            )}
            Schedule & Details
          </span>
          <span
            className={`flex items-center ${currentStep === 3 ? (isDarkMode ? "text-cyan-400" : "text-sky-600") : ""}`}
          >
            {currentStep === 3 && (
              <span className={`w-2 h-2 rounded-full mr-1 ${isDarkMode ? "bg-cyan-400" : "bg-sky-600"}`}></span>
            )}
            Images & Review
          </span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div
          className={`${sectionClasses} ${isDarkMode ? "bg-gradient-to-br from-slate-800 to-slate-900" : "bg-gradient-to-br from-white to-gray-50"}`}
        >
          <div className="flex justify-between items-center mb-6">
            {getStepTitle(1, "Basic Course Information")}
            <button
              type="button"
              className={`${buttonClasses.icon} ${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-full p-2`}
              onClick={() => setShowKeyboardShortcuts(true)}
              title="Keyboard shortcuts"
            >
              <FaKeyboard />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="course_name" className={labelClasses}>
                Course Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaChalkboardTeacher
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`}
                  size={18}
                />
                <input
                  type="text"
                  id="course_name"
                  name="course_name"
                  className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-cyan-500 focus:ring-cyan-500" : "focus:border-sky-500 focus:ring-sky-500"}`}
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="e.g., Advanced Swimming Techniques"
                  ref={courseNameRef}
                />
              </div>
              {errors.course_name && <p className="mt-1 text-sm text-red-500">{errors.course_name}</p>}
            </div>

            <div>
              <label htmlFor="price" className={labelClasses}>
                Price (in currency) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMoneyBillWave
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-green-400" : "text-green-500"}`}
                  size={18}
                />
                <input
                  type="number"
                  id="price"
                  name="price"
                  className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-green-500 focus:ring-green-500" : "focus:border-green-500 focus:ring-green-500"}`}
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  ref={priceRef}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="pool_type" className={labelClasses}>
                Pool Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaSwimmer
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}
                  size={18}
                />
                <select
                  id="pool_type"
                  name="pool_type"
                  className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-blue-500 focus:ring-blue-500" : "focus:border-blue-500 focus:ring-blue-500"}`}
                  value={formData.pool_type}
                  onChange={handleChange}
                  ref={poolTypeRef}
                >
                  <option value="public-pool">Public Pool</option>
                  <option value="private-location">Private Location</option>
                  <option value="teacher-pool">Teacher's Pool</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="location" className={labelClasses}>
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMapMarkerAlt
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
                  size={18}
                />
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-red-500 focus:ring-red-500" : "focus:border-red-500 focus:ring-red-500"}`}
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Aquatic Center, Los Angeles, CA"
                  ref={locationRef}
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="description" className={labelClasses}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className={inputClasses}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
                ref={descriptionRef}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Schedule & Details */}
      {currentStep === 2 && (
        <div
          className={`${sectionClasses} ${isDarkMode ? "bg-gradient-to-br from-slate-800 to-slate-900" : "bg-gradient-to-br from-white to-gray-50"}`}
        >
          <div className="flex justify-between items-center mb-6">
            {getStepTitle(2, "Schedule & Course Details")}
            <button
              type="button"
              className={`${buttonClasses.icon} ${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-full p-2`}
              onClick={() => setShowKeyboardShortcuts(true)}
              title="Keyboard shortcuts"
            >
              <FaKeyboard />
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="course_duration" className={labelClasses}>
                  Course Duration (weeks) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-purple-400" : "text-purple-500"}`}
                    size={18}
                  />
                  <input
                    type="number"
                    id="course_duration"
                    name="course_duration"
                    className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-purple-500 focus:ring-purple-500" : "focus:border-purple-500 focus:ring-purple-500"}`}
                    value={formData.course_duration}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
                {errors.course_duration && <p className="mt-1 text-sm text-red-500">{errors.course_duration}</p>}
              </div>

              <div>
                <label htmlFor="study_frequency" className={labelClasses}>
                  Classes per Week <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaClock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-cyan-400" : "text-sky-500"}`}
                    size={18}
                  />
                  <select
                    id="study_frequency"
                    name="study_frequency"
                    className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-cyan-500 focus:ring-cyan-500" : "focus:border-sky-500 focus:ring-sky-500"}`}
                    value={formData.study_frequency}
                    onChange={handleChange}
                  >
                    <option value="1">1 class per week</option>
                    <option value="2">2 classes per week</option>
                    <option value="3">3 classes per week</option>
                    <option value="4">4 classes per week</option>
                    <option value="5">5 classes per week</option>
                  </select>
                </div>
                {errors.study_frequency && <p className="mt-1 text-sm text-red-500">{errors.study_frequency}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="days_study" className={labelClasses}>
                  Days of Study (optional)
                </label>
                <input
                  type="number"
                  id="days_study"
                  name="days_study"
                  className={inputClasses}
                  value={formData.days_study}
                  onChange={handleChange}
                  min="0"
                />
                {errors.days_study && <p className="mt-1 text-sm text-red-500">{errors.days_study}</p>}
              </div>

              <div>
                <label htmlFor="number_of_total_sessions" className={labelClasses}>
                  Total Number of Sessions <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="number_of_total_sessions"
                  name="number_of_total_sessions"
                  className={inputClasses}
                  value={formData.number_of_total_sessions}
                  onChange={handleChange}
                  min="1"
                />
                <p className="mt-1 text-sm text-gray-500">Auto-calculated based on duration and frequency</p>
                {errors.number_of_total_sessions && (
                  <p className="mt-1 text-sm text-red-500">{errors.number_of_total_sessions}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="level" className={labelClasses}>
                  Skill Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  className={`${inputClasses} ${isDarkMode ? "focus:border-amber-500 focus:ring-amber-500" : "focus:border-amber-500 focus:ring-amber-500"}`}
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                  <option value="All Levels">All Levels</option>
                </select>
                {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
              </div>

              <div>
                <label htmlFor="max_students" className={labelClasses}>
                  Maximum Students <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUsers
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-orange-400" : "text-orange-500"}`}
                    size={18}
                  />
                  <input
                    type="number"
                    id="max_students"
                    name="max_students"
                    className={`${inputClasses} pl-10 ${isDarkMode ? "focus:border-orange-500 focus:ring-orange-500" : "focus:border-orange-500 focus:ring-orange-500"}`}
                    value={formData.max_students}
                    onChange={handleChange}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={`${labelClasses} mb-2 block`}>
                Weekly Schedule <span className="text-red-500">*</span>
              </label>
              <div
                className={`${isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-gray-200"} rounded-lg p-4`}
              >
                <ScheduleSelector value={formData.schedule} onChange={handleScheduleChange} isDarkMode={isDarkMode} />
              </div>
              {errors.schedule && <p className="mt-1 text-sm text-red-500">{errors.schedule}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Images & Review */}
      {currentStep === 3 && (
        <div
          className={`${sectionClasses} ${isDarkMode ? "bg-gradient-to-br from-slate-800 to-slate-900" : "bg-gradient-to-br from-white to-gray-50"}`}
        >
          <div className="flex justify-between items-center mb-6">
            {getStepTitle(3, "Course Images & Final Review")}
            <button
              type="button"
              className={`${buttonClasses.icon} ${isDarkMode ? "bg-slate-700" : "bg-gray-100"} rounded-full p-2`}
              onClick={() => setShowKeyboardShortcuts(true)}
              title="Keyboard shortcuts"
            >
              <FaKeyboard />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Course Image</label>
                <ImageUploader
                  onFileChange={handleCourseImageChange}
                  initialImage={initialData?.course_image}
                  isDarkMode={isDarkMode}
                  label="Upload Course Image"
                  description="This image will be displayed as the main course image"
                />
              </div>

              <div>
                <label className={labelClasses}>Pool/Location Image</label>
                <ImageUploader
                  onFileChange={handlePoolImageChange}
                  initialImage={initialData?.pool_image}
                  isDarkMode={isDarkMode}
                  label="Upload Pool Image"
                  description="This image will show the pool or location where the course takes place"
                />
              </div>
            </div>

            <div
              className={`${isDarkMode ? "bg-slate-700 border border-slate-600" : "bg-gray-50 border border-gray-200"} p-5 rounded-lg`}
            >
              <h4 className={`font-medium mb-3 text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Course Summary
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Course Name:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.course_name}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Price:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-green-400" : "text-green-500"}`}>
                    {formData.price}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Pool Type:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.pool_type}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.location}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.course_duration} weeks
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Classes per Week:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.study_frequency}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Sessions:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.number_of_total_sessions}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Level:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.level}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Max Students:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.max_students}
                  </div>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Description:</span>
                <p className={`text-base mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {formData.description}
                </p>
              </div>

              <div className={`mt-4 p-3 rounded ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Schedule:</span>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.keys(formData.schedule).map((day) => {
                    if (formData.schedule[day]?.selected) {
                      const ranges = formData.schedule[day].ranges || []
                      return (
                        <div
                          key={day}
                          className={`p-2 rounded ${
                            isDarkMode ? "bg-slate-700 border border-slate-600" : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span className={`font-medium ${isDarkMode ? "text-cyan-300" : "text-sky-600"}`}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}:
                          </span>
                          <div className="mt-1">
                            {ranges.map((range: any, index: number) => (
                              <div key={`${day}-range-${index}`} className="text-sm">
                                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                                  {formatTime(range.start)} - {formatTime(range.end)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        {currentStep > 1 ? (
          <button type="button" onClick={handlePrevStep} className={buttonClasses.secondary} disabled={isSubmitting}>
            <FaArrowLeft /> Previous
          </button>
        ) : (
          <button type="button" onClick={onCancel} className={buttonClasses.secondary} disabled={isSubmitting}>
            <FaTimes /> Cancel
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className={buttonClasses.primary}
            disabled={isSubmitting}
            ref={nextButtonRef}
          >
            Next <FaArrowRight />
          </button>
        ) : (
          <button type="submit" className={buttonClasses.primary} disabled={isSubmitting}>
            {isSubmitting ? (
              isEditing ? (
                <>Updating Course...</>
              ) : (
                <>Creating Course...</>
              )
            ) : isEditing ? (
              <>
                <FaSave /> Save Changes
              </>
            ) : (
              <>
                <FaSave /> Create Course
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}
