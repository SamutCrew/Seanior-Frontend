"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/app/redux"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import { motion } from "framer-motion"
import { use } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  DollarSign,
  AlertCircle,
  Share2,
  Info,
  BookOpen,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Star,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  Heart,
  CalendarDays,
  Waves,
  Timer,
  Clipboard,
  Shield,
} from "lucide-react"
import LoadingPage from "@/components/Common/LoadingPage"
import { getCourseById } from "@/api/course_api"
import EnrollmentModal from "@/components/Course/EnrollmentModal"
import { formatDbPrice } from "@/utils/moneyUtils"
import LoginRequiredButton from "@/components/Auth/LoginRequiredButton"
import { useAuth } from "@/context/AuthContext"

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  // Use React.use to unwrap the params Promise (for future Next.js compatibility)
  const unwrappedParams = use(params)
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const courseId = unwrappedParams.courseId
  const [parsedLocation, setParsedLocation] = useState<any>(null)
  const [parsedSchedule, setParsedSchedule] = useState<any>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log(`Fetching course with ID: ${courseId}`)
        const courseData = await getCourseById(courseId)

        if (!courseData) {
          setError("Course not found. It may have been removed or is unavailable.")
          setIsLoading(false)
          return
        }

        // Log the entire course data for debugging
        console.log("Course data received:", JSON.stringify(courseData, null, 2))

        setCourse(courseData)

        // Parse location JSON string if it exists
        if (courseData.location && typeof courseData.location === "string") {
          try {
            const locationObj = JSON.parse(courseData.location)
            console.log("Parsed location:", locationObj)
            setParsedLocation(locationObj)
          } catch (e) {
            console.error("Error parsing location:", e)
          }
        }

        // Parse schedule JSON string if it exists
        if (courseData.schedule && typeof courseData.schedule === "string") {
          try {
            const scheduleObj = JSON.parse(courseData.schedule)
            console.log("Parsed schedule:", scheduleObj)
            setParsedSchedule(scheduleObj)
          } catch (e) {
            console.error("Error parsing schedule:", e)
          }
        }

        setIsLoading(false)
      } catch (err: any) {
        console.error("Error fetching course:", err)
        setError(err.message || "Failed to load course details. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  // Format date to local date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format pool type for display
  const formatPoolType = (poolType: string) => {
    if (!poolType) return "Not specified"
    return poolType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get selected days from schedule
  const selectedDays = useMemo(() => {
    if (!parsedSchedule) return []
    return Object.keys(parsedSchedule).filter((day) => parsedSchedule[day].selected)
  }, [parsedSchedule])

  // Function to handle sharing the course
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: course?.course_name || "Swimming Course",
          text: `Check out this swimming course: ${course?.course_name}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Error copying link:", err))
    }
  }

  // Open enrollment modal
  const handleEnrollClick = () => {
    setIsEnrollModalOpen(true)
  }

  // Format price using the utility function
  const formattedPrice = course ? formatDbPrice(course.price) : "฿0.00"

  if (isLoading) {
    return <LoadingPage />
  }

  if (error || !course) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle className={`mb-8 ${isDarkMode ? "text-white" : ""}`}>Course Details</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-xl shadow-md ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-red-600"}`}
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl mb-4">{error || "Course not found"}</p>
            <Button
              variant={isDarkMode ? "gradient" : "primary"}
              className="mt-4"
              onClick={() => router.push("/allcourse")}
            >
              Back to Courses
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Create a custom button component that uses LoginRequiredButton
  const EnrollButton = ({ className = "", size = "default", children }: any) => {
    return (
      <LoginRequiredButton
        onClick={handleEnrollClick}
        className={`${
          isDarkMode
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-medium rounded-lg transition-all duration-200 ${
          size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
        } ${className}`}
        warningMessage="You need to be logged in to enroll in this course"
      >
        {children}
      </LoginRequiredButton>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}`}>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.push("/allcourse")}
          className={`flex items-center text-sm font-medium ${
            isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to All Courses
        </button>
      </div>

      {/* Hero Section */}
      <div
        className={`relative overflow-hidden mt-4 ${
          isDarkMode ? "bg-gradient-to-r from-blue-900 to-cyan-900" : "bg-gradient-to-r from-blue-600 to-cyan-500"
        }`}
      >
        <div className="absolute inset-0 bg-[url('/patterns/wave-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? "bg-slate-800/50 text-cyan-300" : "bg-white/20 text-white"
                    } backdrop-blur-sm`}
                  >
                    {course.level} Level
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? "bg-slate-800/50 text-emerald-300" : "bg-white/20 text-white"
                    } backdrop-blur-sm`}
                  >
                    {formatPoolType(course.pool_type)}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? "bg-slate-800/50 text-amber-300" : "bg-white/20 text-white"
                    } backdrop-blur-sm`}
                  >
                    {course.number_of_total_sessions} Sessions
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {course.course_name}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-6">
                  {course.description && course.description.length > 150 && !showFullDescription
                    ? `${course.description.substring(0, 150)}...`
                    : course.description}
                  {course.description && course.description.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="ml-2 text-cyan-300 hover:text-cyan-100 font-medium"
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
                <div className="flex items-center flex-wrap gap-4 text-white/90 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating > 0 ? course.rating.toFixed(1) : "New"}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-cyan-300 mr-1" />
                    <span>
                      {course.students || 0} / {course.max_students || "∞"} students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-cyan-300 mr-1" />
                    <span>
                      {course.course_duration} {course.course_duration === 1 ? "week" : "weeks"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="w-5 h-5 text-cyan-300 mr-1" />
                    <span>
                      {course.study_frequency} {Number.parseInt(course.study_frequency) === 1 ? "day" : "days"}/week
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <EnrollButton size="lg">Enroll Now</EnrollButton>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> You Need to Login to Enroll
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative mt-8 md:mt-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl"></div>
                <img
                  src={
                    course.course_image ||
                    course.pool_image ||
                    "/placeholder.svg?height=300&width=400&query=swimming course" ||
                    "/placeholder.svg"
                  }
                  alt={course.course_name}
                  className="rounded-xl shadow-lg w-[400px] h-[300px] object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold">
                  {formattedPrice}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className={`relative block w-full h-12 sm:h-16 ${isDarkMode ? "text-slate-900" : "text-blue-50"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      {/* Mobile Image (visible only on mobile) */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={
              course.course_image || course.pool_image || "/placeholder.svg?height=300&width=600&query=swimming course"
            }
            alt={course.course_name}
            className="w-full h-48 sm:h-64 object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold">
            {formattedPrice}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div
          className={`flex overflow-x-auto space-x-4 pb-2 ${
            isDarkMode ? "border-b border-slate-700" : "border-b border-gray-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "overview"
                ? isDarkMode
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-blue-600 border-b-2 border-blue-600"
                : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "schedule"
                ? isDarkMode
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-blue-600 border-b-2 border-blue-600"
                : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "location"
                ? isDarkMode
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-blue-600 border-b-2 border-blue-600"
                : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Location
          </button>
          <button
            onClick={() => setActiveTab("instructor")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "instructor"
                ? isDarkMode
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-blue-600 border-b-2 border-blue-600"
                : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Instructor
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === "details"
                ? isDarkMode
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-blue-600 border-b-2 border-blue-600"
                : isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl shadow-lg mb-8 ${
                  isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                }`}
              >
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Course Overview
                </h2>
                <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {course.description || "No description available"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <Clock className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      Course Duration
                    </h3>
                    <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <li className="flex items-start">
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <span>
                          {course.course_duration} {course.course_duration === 1 ? "week" : "weeks"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <span>
                          {course.number_of_total_sessions} total{" "}
                          {course.number_of_total_sessions === 1 ? "session" : "sessions"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <span>
                          {course.study_frequency} {Number.parseInt(course.study_frequency) === 1 ? "day" : "days"} per
                          week
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <Waves className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      Pool Information
                    </h3>
                    <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <li className="flex items-start">
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <span>Type: {formatPoolType(course.pool_type)}</span>
                      </li>
                      {parsedLocation && (
                        <li className="flex items-start">
                          <ChevronRight
                            className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                          />
                          <span>Location: {parsedLocation.address}</span>
                        </li>
                      )}
                      {course.pool_image && (
                        <li className="flex items-start">
                          <ChevronRight
                            className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                          />
                          <span>Pool image available</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <Info className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Course Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <p className="flex items-center mb-2">
                        <Users className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        <span className="font-medium mr-2">Students:</span> {course.students || 0} enrolled
                      </p>
                      <p className="flex items-center mb-2">
                        <Users className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        <span className="font-medium mr-2">Max Students:</span> {course.max_students || "Unlimited"}
                      </p>
                      <p className="flex items-center mb-2">
                        <Award className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        <span className="font-medium mr-2">Level:</span> {course.level || "Not specified"}
                      </p>
                    </div>
                    <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <p className="flex items-center mb-2">
                        <Shield className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        <span className="font-medium mr-2">Allowed Absences:</span>{" "}
                        {course.allowed_absence_buffer || "Not specified"}
                      </p>
                      <p className="flex items-center mb-2">
                        <DollarSign className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        <span className="font-medium mr-2">Price:</span> {formattedPrice}
                      </p>
                      <p className="flex items-center mb-2">
                        <Star className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        <span className="font-medium mr-2">Rating:</span>{" "}
                        {course.rating > 0 ? course.rating.toFixed(1) : "New"}
                      </p>
                    </div>
                  </div>
                </div>

                <EnrollButton className="w-full">Enroll in This Course</EnrollButton>
              </motion.div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl shadow-lg mb-8 ${
                  isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                }`}
              >
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Course Schedule
                </h2>

                <div className="mb-6">
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-3 flex items-center ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      <Calendar className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      Weekly Schedule
                    </h3>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                        const dayLower = day.toLowerCase()
                        const isSelected = parsedSchedule && parsedSchedule[dayLower]?.selected

                        return (
                          <div
                            key={day}
                            className={`text-center p-2 rounded-lg ${
                              isSelected
                                ? isDarkMode
                                  ? "bg-cyan-900/50 border border-cyan-800"
                                  : "bg-blue-100 border border-blue-200"
                                : isDarkMode
                                  ? "bg-slate-700/30 border border-slate-700"
                                  : "bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <p
                              className={`text-sm font-medium ${
                                isSelected
                                  ? isDarkMode
                                    ? "text-cyan-300"
                                    : "text-blue-700"
                                  : isDarkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                              }`}
                            >
                              {day.substring(0, 3)}
                            </p>
                            <div className="mt-1">
                              {isSelected ? (
                                <CheckCircle
                                  className={`w-5 h-5 mx-auto ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}
                                />
                              ) : (
                                <XCircle
                                  className={`w-5 h-5 mx-auto ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                                />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <h4 className={`text-md font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      Class Times
                    </h4>
                    <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {selectedDays.length > 0 ? (
                        selectedDays.map((day) => {
                          const ranges = parsedSchedule[day].ranges || []
                          return (
                            <li key={day} className="flex items-start">
                              <ChevronRight
                                className={`w-5 h-5 mr-2 flex-shrink-0 ${
                                  isDarkMode ? "text-cyan-400" : "text-blue-500"
                                }`}
                              />
                              <div>
                                <span className="font-medium capitalize">{day}: </span>
                                {ranges.map((range, index) => (
                                  <span key={index}>
                                    {range.start} - {range.end}
                                    {index < ranges.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            </li>
                          )
                        })
                      ) : (
                        <li className="text-center italic">No scheduled days available</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <Timer className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Course Timeline
                  </h3>
                  <ul className={`space-y-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Total Duration: </span>
                        {course.course_duration} {course.course_duration === 1 ? "week" : "weeks"}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Total Sessions: </span>
                        {course.number_of_total_sessions}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Sessions Per Week: </span>
                        {course.study_frequency}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Allowed Absences: </span>
                        {course.allowed_absence_buffer}
                      </div>
                    </li>
                  </ul>
                </div>

                <EnrollButton className="w-full">Enroll in This Course</EnrollButton>
              </motion.div>
            )}

            {/* Location Tab */}
            {activeTab === "location" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl shadow-lg mb-8 ${
                  isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                }`}
              >
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Course Location
                </h2>

                {parsedLocation ? (
                  <div className="mb-6">
                    <div
                      className={`p-4 rounded-lg mb-6 ${
                        isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-3 flex items-center ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <MapPin className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        Address
                      </h3>
                      <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {parsedLocation.address}
                      </p>

                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                        {/* Map placeholder - in a real app, you would use a map component here */}
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <div className="text-center p-4">
                            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                            <p className="text-gray-600">
                              Map would be displayed here with coordinates: {parsedLocation.lat}, {parsedLocation.lng}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg mb-6 ${
                        isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-3 flex items-center ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        <Waves className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                        Pool Information
                      </h3>
                      <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Pool Type: </span>
                        {formatPoolType(course.pool_type)}
                      </p>

                      {course.pool_image ? (
                        <img
                          src={course.pool_image || "/placeholder.svg"}
                          alt="Pool"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">No pool image available</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-8 rounded-lg text-center ${
                      isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-gray-100"
                    }`}
                  >
                    <MapPin className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Location information not available
                    </p>
                  </div>
                )}

                <EnrollButton className="w-full">Enroll in This Course</EnrollButton>
              </motion.div>
            )}

            {/* Instructor Tab */}
            {activeTab === "instructor" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl shadow-lg mb-8 ${
                  isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                }`}
              >
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  About the Instructor
                </h2>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                  <img
                    src={
                      course.instructor?.profile_img ||
                      "/placeholder.svg?height=128&width=128&query=swimming instructor" ||
                      "/placeholder.svg"
                    }
                    alt={course.instructor?.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {course.instructor?.name || "Instructor information not available"}
                    </h3>
                    <p className={`mb-2 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>Swimming Instructor</p>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode ? "bg-slate-700 text-cyan-300" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {course.instructor?.user_type || "Instructor"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode ? "bg-slate-700 text-emerald-300" : "bg-green-100 text-green-800"
                        }`}
                      >
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <User className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Instructor Bio
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {course.instructor?.description ||
                      "No instructor biography available. This instructor has not provided a bio yet."}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <Mail className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Contact Information
                  </h3>
                  <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {course.instructor?.email && (
                      <li className="flex items-start">
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <div>
                          <span className="font-medium">Email: </span>
                          {course.instructor.email}
                        </div>
                      </li>
                    )}
                    {course.instructor?.phone_number && (
                      <li className="flex items-start">
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <div>
                          <span className="font-medium">Phone: </span>
                          {course.instructor.phone_number}
                        </div>
                      </li>
                    )}
                    {!course.instructor?.email && !course.instructor?.phone_number && (
                      <li className="text-center italic">No contact information available</li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <EnrollButton className="flex-1">Enroll in This Course</EnrollButton>
                  <Button
                    variant="outline"
                    className={`flex-1 ${isDarkMode ? "border-slate-700 text-white" : ""}`}
                    onClick={() => router.push(`/allinstructor/${course.instructor_id}`)}
                  >
                    View Instructor Profile
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl shadow-lg mb-8 ${
                  isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                }`}
              >
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Course Details
                </h2>

                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <Clipboard className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Course Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Course ID: </span>
                        {course.course_id}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Course Name: </span>
                        {course.course_name}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Level: </span>
                        {course.level}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Pool Type: </span>
                        {formatPoolType(course.pool_type)}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Price: </span>
                        {formattedPrice}
                      </p>
                    </div>
                    <div>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Created: </span>
                        {formatDate(course.created_at)}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Last Updated: </span>
                        {formatDate(course.updated_at)}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Instructor ID: </span>
                        {course.instructor_id}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Rating: </span>
                        {course.rating > 0 ? course.rating.toFixed(1) : "New"}
                      </p>
                      <p className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <span className="font-medium">Students: </span>
                        {course.students} / {course.max_students}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-3 flex items-center ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <BookOpen className={`w-5 h-5 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Course Structure
                  </h3>
                  <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Duration: </span>
                        {course.course_duration} {course.course_duration === 1 ? "week" : "weeks"}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Study Frequency: </span>
                        {course.study_frequency} {Number.parseInt(course.study_frequency) === 1 ? "day" : "days"} per
                        week
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Days of Study: </span>
                        {course.days_study} {course.days_study === 1 ? "day" : "days"}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Total Sessions: </span>
                        {course.number_of_total_sessions}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight
                        className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                      />
                      <div>
                        <span className="font-medium">Allowed Absences: </span>
                        {course.allowed_absence_buffer}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <EnrollButton className="flex-1">Enroll in This Course</EnrollButton>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-xl shadow-lg sticky top-24 ${
                isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Course Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <DollarSign
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-lg font-bold">{formattedPrice}</p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Calendar
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p>
                      {selectedDays.length > 0
                        ? selectedDays.map((day) => day.charAt(0).toUpperCase() + day.slice(1)).join(", ")
                        : "No scheduled days"}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Clock className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p>
                      {course.course_duration} {course.course_duration === 1 ? "week" : "weeks"} (
                      {course.number_of_total_sessions} sessions)
                    </p>
                  </div>
                </div>

                {parsedLocation && (
                  <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <MapPin
                      className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                    />
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{parsedLocation.address}</p>
                    </div>
                  </div>
                )}

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Users className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Class Size</p>
                    <p>
                      {course.students || 0} enrolled {course.max_students ? `(max ${course.max_students})` : ""}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Award className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Level</p>
                    <p>{course.level || "All levels"}</p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <User className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p>{course.instructor?.name || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <EnrollButton className="w-full mb-3">Enroll Now</EnrollButton>

              <LoginRequiredButton
                className={`w-full ${isDarkMode ? "border-slate-700 text-white" : ""}`}
                onClick={() => {}}
                warningMessage="You need to be logged in to save this course"
              >
                <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
              </LoginRequiredButton>

              <div className="mt-6">
                <LoginRequiredButton
                  className={`w-full flex items-center justify-center py-2 px-4 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  } transition-colors`}
                  warningMessage="You need to be logged in to contact the instructor"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Contact Instructor
                </LoginRequiredButton>
              </div>
            </motion.div>
          </div>
        </div>


      </div>

      {/* Enrollment Modal */}
      {isAuthenticated && (
        <EnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          courseId={courseId}
          courseName={course.course_name}
          schedule={parsedSchedule}
        />
      )}
    </div>
  )
}
