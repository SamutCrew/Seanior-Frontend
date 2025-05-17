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
  FaCrosshairs,
  FaSync,
} from "react-icons/fa"
import { MdPublic, MdPool } from "react-icons/md"
import { HiHome } from "react-icons/hi"
import OSMMapSelector from "@/components/Map/OSMMAPSelector"

interface EnhancedCourseFormProps {
  initialData?: Partial<Course>
  onSubmit: (data: Partial<Course>) => void
  onCancel: () => void
  isSubmitting?: boolean
  isEditing?: boolean
}

// Add this function near the top of the file, with the other utility functions
function formatCurrency(value: number | string): string {
  // Convert to number if it's a string
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  // Return empty string if NaN
  if (isNaN(numValue)) return ""

  // Format with thousand separators
  return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Function to convert coordinates to address using Nominatim (OpenStreetMap)
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    // Use Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=th,en`,
    )

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`)
    }

    const data = await response.json()

    // Extract relevant address components
    // Prioritize Thai names when available
    const road = data.address.road || data.address.pedestrian || ""
    const suburb = data.address.suburb || ""
    const district = data.address.district || data.address.city_district || ""
    const city = data.address.city || data.address.town || data.address.village || ""

    // Construct a simplified address string
    let address = ""
    if (road) address += road
    if (suburb && suburb !== road) address += address ? `, ${suburb}` : suburb
    if (district && !address.includes(district)) address += address ? `, ${district}` : district
    if (city && !address.includes(city)) address += address ? `, ${city}` : city

    // If we couldn't construct a meaningful address, use the display_name
    if (!address.trim()) {
      address = data.display_name
    }

    return address
  } catch (error) {
    console.error("Error during reverse geocoding:", error)
    // Return coordinates as fallback
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

// Helper function to parse location data
function parseLocationData(locationData: any) {
  if (!locationData) {
    return { lat: 13.7563, lng: 100.5018, address: "" }
  }

  // If location is a string (from database), try to parse it
  if (typeof locationData === "string") {
    try {
      // First try to parse as JSON
      const parsedLocation = JSON.parse(locationData)
      console.log("Successfully parsed location string as JSON:", parsedLocation)
      return parsedLocation
    } catch (e) {
      console.log("Failed to parse as JSON, trying alternative format parsing")

      // If JSON parsing fails, try to extract coordinates from the string format
      // Format example: "Latitude: 13.758060, Longitude: 100.512886 (Lat: 13.758060, Lng: 100.512886)"
      try {
        // Extract latitude using regex
        const latMatch = locationData.match(/Latitude:\s*([\d.]+)/i) || locationData.match(/Lat:\s*([\d.]+)/i)

        // Extract longitude using regex
        const lngMatch = locationData.match(/Longitude:\s*([\d.]+)/i) || locationData.match(/Lng:\s*([\d.]+)/i)

        if (latMatch && lngMatch) {
          const lat = Number.parseFloat(latMatch[1])
          const lng = Number.parseFloat(lngMatch[1])

          console.log("Extracted coordinates from string:", { lat, lng })

          return {
            lat,
            lng,
            address: locationData, // Use the original string as address for now
          }
        }
      } catch (extractError) {
        console.error("Failed to extract coordinates from string:", extractError)
      }

      // If all parsing attempts fail, return default with the string as address
      console.error("Could not parse location data, using default coordinates")
      return { lat: 13.7563, lng: 100.5018, address: locationData }
    }
  }

  // If it's already an object, ensure it has all required fields
  return {
    lat: locationData.lat || 13.7563,
    lng: locationData.lng || 100.5018,
    address: locationData.address || "",
  }
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
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)

  // Process initial location data
  const processedLocationData = parseLocationData(initialData?.location)
  console.log("Initial location data:", initialData?.location)
  console.log("Processed location data:", processedLocationData)

  // Add this state for formatted price display
  const [formattedPrice, setFormattedPrice] = useState<string>(() => {
    return formatCurrency(initialData?.price || 0)
  })

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
      location: processedLocationData,
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

  // Map state
  const [mapCenter, setMapCenter] = useState({
    lat: processedLocationData?.lat || 13.7563,
    lng: processedLocationData?.lng || 100.5018,
  })
  const [showCoordinates, setShowCoordinates] = useState(false)

  // Update map center when location changes
  useEffect(() => {
    if (formData.location?.lat && formData.location?.lng) {
      setMapCenter({
        lat: formData.location.lat,
        lng: formData.location.lng,
      })
    }
  }, [formData.location?.lat, formData.location?.lng])

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
  const inputClasses = `mt-1 block w-full rounded-md text-base py-3 ${isDarkMode
      ? "bg-slate-800 border-slate-600 text-slate-100 focus:border-cyan-500 focus:ring-cyan-500 placeholder-slate-400"
      : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
    } shadow-sm`

  const labelClasses = `block text-base font-medium mb-2 ${isDarkMode ? "text-slate-200" : "text-gray-700"}`

  const buttonClasses = {
    primary: `${isDarkMode
        ? "bg-gradient-to-r from-cyan-800 to-blue-900 hover:from-cyan-700 hover:to-blue-800 border border-cyan-700"
        : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500"
      } text-white px-5 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-base`,
    secondary: `${isDarkMode
        ? "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
      } px-5 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-base`,
    icon: `${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
      } p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500`,
  }

  const sectionClasses = `${isDarkMode ? "bg-slate-800 border-slate-700 shadow-lg shadow-slate-900/50" : "bg-white border-gray-200 shadow-sm"
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

  // Handle address change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value

    // Update the location with the new address
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        address: newAddress,
      },
    }))

    // Clear error
    if (errors.location) {
      setErrors({
        ...errors,
        location: "",
      })
    }
  }

  // Handle location selection from map
  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    console.log("Location selected in EnhancedCourseForm:", location)

    // Format coordinates for display
    const formattedCoords = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`

    // Start geocoding process
    setIsGeocodingLoading(true)

    try {
      // Get address from coordinates
      const address = await reverseGeocode(location.lat, location.lng)

      // Create a new location object with all required fields
      const newLocation = {
        ...formData.location, // Keep any existing fields
        lat: location.lat,
        lng: location.lng,
        address: address, // Include the address in the location object
      }

      // Update form data with new location
      setFormData((prevData) => ({
        ...prevData,
        location: newLocation,
      }))

      // Update map center to match new location
      setMapCenter({
        lat: location.lat,
        lng: location.lng,
      })

      // Clear error
      if (errors.location) {
        setErrors({
          ...errors,
          location: "",
        })
      }

      console.log("Updated form data with new location:", newLocation)
    } catch (error) {
      console.error("Error getting address:", error)

      // Fallback to coordinates if geocoding fails
      const newLocation = {
        ...formData.location, // Keep any existing fields
        lat: location.lat,
        lng: location.lng,
        address: formattedCoords,
      }

      setFormData((prevData) => ({
        ...prevData,
        location: newLocation,
      }))
    } finally {
      setIsGeocodingLoading(false)
    }
  }

  // Toggle showing coordinates
  const toggleCoordinates = () => {
    setShowCoordinates(!showCoordinates)
  }

  // Use current location
  const useCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          // Format coordinates for display
          const formattedCoords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

          // Start geocoding process
          setIsGeocodingLoading(true)

          try {
            // Get address from coordinates
            const address = await reverseGeocode(latitude, longitude)

            // Update form data with current location
            const newLocation = {
              ...formData.location, // Keep any existing fields
              lat: latitude,
              lng: longitude,
              address: address,
            }

            setFormData((prevData) => ({
              ...prevData,
              location: newLocation,
            }))

            // Update map center
            setMapCenter({
              lat: latitude,
              lng: longitude,
            })

            console.log("Using current location with address:", newLocation)
          } catch (error) {
            console.error("Error getting address for current location:", error)

            // Fallback to coordinates if geocoding fails
            const newLocation = {
              ...formData.location, // Keep any existing fields
              lat: latitude,
              lng: longitude,
              address: formattedCoords,
            }

            setFormData((prevData) => ({
              ...prevData,
              location: newLocation,
            }))
          } finally {
            setIsGeocodingLoading(false)
          }
        },
        (error) => {
          console.error("Error getting current location:", error)
          alert("Unable to get your current location. Please check your browser permissions.")
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      alert("Geolocation is not supported by your browser")
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

      if (!formData.location?.address?.trim()) {
        newErrors.location = "Location address is required"
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

      // --- START: แปลงค่า price เป็นหน่วยสตางค์ ---
      // ตรวจสอบอีกครั้งเผื่อกรณีพิเศษ แต่ปกติควรจะเป็น number แล้ว
      if (typeof submissionData.price === 'number') {
        submissionData.price = submissionData.price * 100; // คูณ 100 เพื่อแปลงเป็นสตางค์
        console.log("Price converted to satang:", submissionData.price);
      } else {
        // กรณีนี้ไม่ควรเกิดขึ้นถ้า handleChange ทำงานถูกต้อง
        // แต่ถ้าเกิดขึ้น แสดงว่ามีบางอย่างผิดพลาดในการจัดการ State ของ price
        console.warn("Price is not a number during submission, attempting conversion:", submissionData.price);
        const numericPrice = Number.parseInt(String(submissionData.price).replace(/,/g, ""), 10); // Cast to String ก่อน replace
        if (!isNaN(numericPrice)) {
          submissionData.price = numericPrice * 100;
          console.log("Price (from non-number) converted to satang:", submissionData.price);
        } else {
          console.error("CRITICAL: Price could not be converted to a number for submission. Value:", submissionData.price);
          // คุณอาจจะต้องโยน Error หรือ Alert User ตรงนี้
          // submissionData.price = 0; // หรือตั้งค่า Default เพื่อป้องกัน Error ตอนส่ง
          // return; // หรือหยุดการ Submit ไปเลย
        }
      }
      // --- END: แปลงค่า price เป็นหน่วยสตางค์ ---

      // Convert location object to string for Prisma
      if (submissionData.location && typeof submissionData.location === "object") {
        // Stringify the location object for database storage
        submissionData.location = JSON.stringify(submissionData.location)
      }

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

  // Get pool type icon and label
  const getPoolTypeIcon = () => {
    switch (formData.pool_type) {
      case "public-pool":
        return <MdPublic className="text-blue-500" size={20} />
      case "private-location":
        return <HiHome className="text-amber-500" size={20} />
      case "teacher-pool":
        return <MdPool className="text-purple-500" size={20} />
      default:
        return <FaSwimmer className="text-blue-500" size={20} />
    }
  }

  const getPoolTypeLabel = () => {
    switch (formData.pool_type) {
      case "public-pool":
        return "Public Pool"
      case "private-location":
        return "Private Location"
      case "teacher-pool":
        return "Teacher's Pool"
      default:
        return formData.pool_type
    }
  }

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">
      {/* Progress indicator */}
      <div className="flex flex-col px-4 py-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`text-sm font-medium ${currentStep >= 1 ? (isDarkMode ? "text-cyan-400" : "text-sky-600") : isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            {currentStep === 1 ? "• " : ""}Basic Info
          </div>
          <div
            className={`text-sm font-medium ${currentStep >= 2 ? (isDarkMode ? "text-cyan-400" : "text-sky-600") : isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            {currentStep === 2 ? "• " : ""}Schedule & Details
          </div>
          <div
            className={`text-sm font-medium ${currentStep >= 3 ? (isDarkMode ? "text-cyan-400" : "text-sky-600") : isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            {currentStep === 3 ? "• " : ""}Images & Review
          </div>
        </div>
        <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${isDarkMode ? "bg-cyan-600" : "bg-sky-500"}`}
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      {showKeyboardShortcuts && (
        <div
          className={`${isDarkMode ? "bg-slate-700" : "bg-gray-100"} p-4 rounded-lg mb-4 border ${isDarkMode ? "border-slate-600" : "border-gray-200"} mx-6 mt-6`}
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

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className={`${isDarkMode ? "bg-slate-900" : "bg-white"} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${isDarkMode ? "bg-cyan-600 text-white" : "bg-sky-500 text-white"
                  }`}
              >
                1
              </span>
              <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Basic Course Information
              </h3>
            </div>
            <button
              type="button"
              className={`${buttonClasses.icon} ${isDarkMode ? "bg-slate-800" : "bg-gray-100"} rounded-full p-2`}
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
                Price (Bath) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaMoneyBillWave
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-green-400" : "text-green-500"}`}
                  size={18}
                />
                <input
                  type="text"
                  id="price"
                  name="price"
                  className={`${inputClasses} pl-10 pr-16 ${isDarkMode ? "focus:border-green-500 focus:ring-green-500" : "focus:border-green-500 focus:ring-green-500"}`}
                  value={formattedPrice}
                  onChange={(e) => {
                    // Allow only digits and commas
                    const value = e.target.value.replace(/[^\d,]/g, "")

                    // Update the formatted display
                    setFormattedPrice(value)

                    // Update the actual form data with numeric value (remove commas)
                    const numericValue = Number.parseInt(value.replace(/,/g, ""), 10) || 0
                    setFormData({
                      ...formData,
                      price: numericValue,
                    })

                    // Clear error when field is edited
                    if (errors.price) {
                      setErrors({
                        ...errors,
                        price: "",
                      })
                    }
                  }}
                  placeholder="0"
                  ref={priceRef}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                  <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>฿</span>
                </div>
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Enter the price in whole bath (e.g. 1,000). You can type directly with commas for better readability.
              </p>
            </div>

            <div>
              <label htmlFor="pool_type" className={labelClasses}>
                Pool Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{getPoolTypeIcon()}</div>
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
                  value={formData.location?.address || ""}
                  onChange={handleAddressChange}
                  placeholder="e.g., Aquatic Center, Los Angeles, CA"
                  ref={locationRef}
                  disabled={isGeocodingLoading}
                />
                {isGeocodingLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaSync className="animate-spin text-gray-400" size={16} />
                  </div>
                )}
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}

              {/* Map controls */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className={`text-sm flex items-center gap-1 ${isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-sky-600 hover:text-sky-700"
                    }`}
                  disabled={isGeocodingLoading}
                >
                  <FaCrosshairs size={14} />
                  Use Current Location
                </button>

                <button
                  type="button"
                  onClick={toggleCoordinates}
                  className={`text-sm flex items-center gap-1 ${isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-sky-600 hover:text-sky-700"
                    }`}
                >
                  <FaMapMarkerAlt size={14} />
                  {showCoordinates ? "Hide Coordinates" : "Show Coordinates"}
                </button>
              </div>

              {/* Location coordinates display */}
              {showCoordinates && formData.location?.lat && formData.location?.lng && (
                <div className={`mt-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                </div>
              )}

              {/* Map container */}
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-300 h-[300px]">
                <OSMMapSelector
                  center={mapCenter}
                  onLocationSelect={handleLocationSelect}
                  forceLightMode={true}
                  initialMarker={
                    formData.location?.lat && formData.location?.lng
                      ? {
                        lat: formData.location.lat,
                        lng: formData.location.lng,
                      }
                      : undefined
                  }
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelClasses}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className={`${inputClasses} px-4 py-4`}
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
        <div className={`${isDarkMode ? "bg-slate-900" : "bg-white"} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${isDarkMode ? "bg-cyan-600 text-white" : "bg-sky-500 text-white"
                  }`}
              >
                2
              </span>
              <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Schedule & Course Details
              </h3>
            </div>
            <button
              type="button"
              className={`${buttonClasses.icon} ${isDarkMode ? "bg-slate-800" : "bg-gray-100"} rounded-full p-2`}
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
                className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} rounded-lg p-4`}
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
        <div className={`${isDarkMode ? "bg-slate-900" : "bg-white"} p-6`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${isDarkMode ? "bg-cyan-600 text-white" : "bg-sky-500 text-white"
                  }`}
              >
                3
              </span>
              <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Course Images & Final Review
              </h3>
            </div>
            <button
              type="button"
              className={`${buttonClasses.icon} ${isDarkMode ? "bg-slate-800" : "bg-gray-100"} rounded-full p-2`}
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
              className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-gray-50 border border-gray-200"} p-5 rounded-lg`}
            >
              <h4 className={`font-medium mb-3 text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Course Summary
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Course Name:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.course_name}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Price:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-green-400" : "text-green-500"}`}>
                    {formData.price}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Pool Type:</span>
                  <div
                    className={`text-base font-medium mt-1 flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {getPoolTypeIcon()}
                    <span className="ml-2">{getPoolTypeLabel()}</span>
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.location?.address}
                    {showCoordinates && formData.location?.lat && formData.location?.lng && (
                      <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.course_duration} weeks
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Classes per Week:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.study_frequency}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total Sessions:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.number_of_total_sessions}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Level:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.level}
                  </div>
                </div>

                <div className={`p-2 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Max Students:</span>
                  <div className={`text-base font-medium mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {formData.max_students}
                  </div>
                </div>
              </div>

              <div className={`mt-4 p-3 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Description:</span>
                <p className={`text-base mt-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {formData.description}
                </p>
              </div>

              <div className={`mt-4 p-3 rounded ${isDarkMode ? "bg-slate-700" : "bg-white"}`}>
                <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Schedule:</span>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.keys(formData.schedule).map((day) => {
                    if (formData.schedule[day]?.selected) {
                      const ranges = formData.schedule[day].ranges || []
                      return (
                        <div
                          key={day}
                          className={`p-2 rounded ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-gray-50 border border-gray-200"
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
      <div className="flex justify-between p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
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
