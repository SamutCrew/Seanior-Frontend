"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { getUserData } from "@/api/user_api"
import { getCoursesByInstructorId } from "@/api/course_api" // Changed to use the same API as dashboard
import type { User } from "@/types/model/user"
import type { Course } from "@/types/course"
import type { InstructorDescription } from "@/types/instructor"
import { useAppSelector } from "@/app/redux"
import { useAuth } from "@/context/AuthContext"
import LoadingPage from "@/components/Common/LoadingPage"
import { Button } from "@/components/Common/Button"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaSwimmer,
  FaClock,
  FaCalendarAlt,
  FaChevronRight,
  FaChevronLeft,
  FaStar,
  FaCertificate,
  FaEdit,
  FaInfoCircle,
  FaQuoteLeft,
  FaExclamationTriangle,
} from "react-icons/fa"
import Link from "next/link"
import CourseCard from "@/components/Course/CourseCard"

// Sample testimonials data
const sampleTestimonials = [
  {
    id: "test1",
    name: "Sarah Johnson",
    avatar: "/woman-portrait.png",
    rating: 5,
    text: "Michael completely transformed my swimming. I went from barely being able to swim a lap to completing my first triathlon in just 6 months! His patience and technical expertise made all the difference.",
    course: "Adult Intermediate Swimming",
    date: "June 15, 2023",
  },
  {
    id: "test2",
    name: "David Chen",
    avatar: "/thoughtful-man-portrait.png",
    rating: 5,
    text: "My son has been taking lessons with Michael for a year, and the improvement is remarkable. He went from being afraid of the water to competing in local swim meets. Michael has a special way with kids that builds confidence.",
    course: "Youth Competition Prep",
    date: "March 22, 2023",
  },
  {
    id: "test3",
    name: "Emma Rodriguez",
    avatar: "/woman-portrait.png",
    rating: 4,
    text: "As an adult who never learned to swim properly, I was nervous about taking lessons. Michael created a comfortable environment where I could learn at my own pace. Now I'm swimming laps with confidence!",
    course: "Adult Beginner Swimming",
    date: "August 10, 2023",
  },
]

export default function InstructorProfilePage() {
  const { teacherId } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const isOwnProfile = user?.user_id === teacherId

  const [userData, setUserData] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [coursesError, setCoursesError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("about")
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getUserData(teacherId as string)
        setUserData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching instructor data:", err)
        setError("Failed to load instructor profile")
      } finally {
        setLoading(false)
      }
    }

    if (teacherId) {
      fetchData()
    }
  }, [teacherId])

  // Fetch courses using the same API as dashboard
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      if (!teacherId) return

      try {
        setCoursesLoading(true)

        // Use the same API function as the dashboard
        const coursesResponse = await getCoursesByInstructorId(teacherId as string)

        console.log("Courses response:", coursesResponse)

        // Process the courses data
        let instructorCourses = []

        if (Array.isArray(coursesResponse)) {
          instructorCourses = coursesResponse
        } else if (coursesResponse && Array.isArray(coursesResponse.data)) {
          instructorCourses = coursesResponse.data
        } else {
          console.warn("Unexpected response format from courses API:", coursesResponse)
          instructorCourses = []
        }

        // Map API data to the format expected by the UI components
        const mappedCourses = instructorCourses
          .filter((course) => course) // Filter out any null/undefined courses
          .map((course) => mapApiCourseToUiCourse(course))

        // Ensure we have exactly 3 courses to display
        let displayCourses: Course[] = []

        if (mappedCourses.length >= 3) {
          // If we have 3 or more courses, take the first 3
          displayCourses = mappedCourses.slice(0, 3)
        } else {
          // If we have fewer than 3 courses, use what we have
          displayCourses = mappedCourses
        }

        setCourses(displayCourses)
        setCoursesError(null)
      } catch (err) {
        console.error("Error fetching instructor courses:", err)
        setCoursesError("Failed to load instructor courses")
      } finally {
        setCoursesLoading(false)
      }
    }

    if (teacherId) {
      fetchInstructorCourses()
    }
  }, [teacherId])

  // Helper function to map API course data to UI course format - same as dashboard
  const mapApiCourseToUiCourse = (apiCourse: any): Course => {
    try {
      // Format schedule if it's an object
      let scheduleStr = apiCourse.schedule || "Flexible schedule"
      if (typeof apiCourse.schedule === "object" && apiCourse.schedule !== null) {
        // Convert schedule object to string representation
        if (Array.isArray(Object.keys(apiCourse.schedule))) {
          // Handle the new schedule format: { "monday": ["19:00-20:00"], "wednesday": ["19:00-20:00"] }
          const days = Object.keys(apiCourse.schedule).filter(
            (day) => Array.isArray(apiCourse.schedule[day]) && apiCourse.schedule[day].length > 0,
          )

          if (days.length > 0) {
            scheduleStr = days
              .map((day) => {
                const times = apiCourse.schedule[day].join(", ")
                return `${day.charAt(0).toUpperCase() + day.slice(1)}: ${times}`
              })
              .join(" | ")
          }
        } else {
          // Fallback for other schedule formats
          scheduleStr = Object.keys(apiCourse.schedule)
            .filter((day) => apiCourse.schedule[day])
            .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
            .join(", ")
        }

        if (scheduleStr === "") {
          scheduleStr = "Flexible schedule"
        }
      }

      // Extract course ID - handle different API formats
      const courseId = apiCourse.course_id || apiCourse.id || "unknown"

      // Extract course name - handle different API formats
      const courseName = apiCourse.course_name || apiCourse.title || apiCourse.name || "Untitled Course"

      // Extract instructor information - handle different API formats
      let instructorName = "Unknown Instructor"
      let instructorId = apiCourse.instructor_id || ""

      if (apiCourse.instructor) {
        if (typeof apiCourse.instructor === "string") {
          instructorName = apiCourse.instructor
        } else if (typeof apiCourse.instructor === "object") {
          instructorName = apiCourse.instructor.name || apiCourse.instructor.user_name || "Unknown"
          instructorId = apiCourse.instructor.user_id || apiCourse.instructor.id || instructorId
        }
      }

      // Use resource URL if available
      const courseImageUrl = apiCourse.course_image || apiCourse.image || "/person-swimming.png"
      const poolImageUrl = apiCourse.pool_image || null

      // Create a course object that works with both the API and UI
      return {
        course_id: courseId,
        id: courseId, // Keep both for compatibility
        course_name: courseName,
        title: courseName, // Keep both for compatibility
        instructor_id: instructorId,
        focus: apiCourse.description?.substring(0, 30) || "Swimming techniques",
        price: apiCourse.price || 0,
        pool_type: apiCourse.pool_type || "public-pool",
        courseType: apiCourse.pool_type || "public-pool", // Keep both for compatibility
        location: apiCourse.location || { address: "Location not specified" },
        description: apiCourse.description || "",
        course_duration: apiCourse.course_duration || 8,
        duration: `${apiCourse.course_duration || 8} weeks`, // Keep both for compatibility
        study_frequency: apiCourse.study_frequency || 0,
        days_study: apiCourse.days_study || 0,
        number_of_total_sessions: apiCourse.number_of_total_sessions || 0,
        level: apiCourse.level || "Beginner",
        schedule: scheduleStr,
        rating: apiCourse.rating || 4.5,
        students: apiCourse.students || 0,
        max_students: apiCourse.max_students || 10,
        maxStudents: apiCourse.max_students || 10, // Keep both for compatibility
        course_image: courseImageUrl,
        image: courseImageUrl, // Keep both for compatibility
        pool_image: poolImageUrl,
        poolImage: poolImageUrl, // Keep both for compatibility
        instructor: instructorName,
        created_at: apiCourse.created_at || new Date().toISOString(),
        updated_at: apiCourse.updated_at || new Date().toISOString(),
      }
    } catch (err) {
      console.error("Error mapping course data:", err)
      // Return a fallback object with minimal required properties
      return {
        course_id: apiCourse.course_id || apiCourse.id || "unknown",
        id: apiCourse.course_id || apiCourse.id || "unknown",
        course_name: apiCourse.course_name || apiCourse.title || "Untitled Course",
        title: apiCourse.course_name || apiCourse.title || "Untitled Course",
        instructor_id: apiCourse.instructor_id || "",
        focus: "Swimming techniques",
        price: apiCourse.price || 0,
        pool_type: apiCourse.pool_type || "public-pool",
        courseType: apiCourse.pool_type || "public-pool",
        location: apiCourse.location || { address: "Location not specified" },
        description: apiCourse.description || "",
        course_duration: apiCourse.course_duration || 8,
        duration: `${apiCourse.course_duration || 8} weeks`,
        level: apiCourse.level || "Beginner",
        schedule: apiCourse.schedule || "Flexible schedule",
        rating: apiCourse.rating || 4.5,
        students: apiCourse.students || 0,
        max_students: apiCourse.max_students || 10,
        maxStudents: apiCourse.max_students || 10,
        course_image: apiCourse.course_image || apiCourse.image || "/person-swimming.png",
        image: apiCourse.course_image || apiCourse.image || "/person-swimming.png",
        instructor: "Unknown",
      }
    }
  }

  // Testimonial navigation
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === sampleTestimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? sampleTestimonials.length - 1 : prev - 1))
  }

  if (loading) {
    return <LoadingPage />
  }

  if (error || !userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
        <div
          className={`max-w-md w-full p-8 rounded-xl shadow-lg ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"}`}
        >
          <FaInfoCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-4">Instructor Not Found</h2>
          <p className="text-center mb-6">{error || "The requested instructor profile could not be found."}</p>
          <Button
            variant={isDarkMode ? "primary" : "primary"}
            className="w-full"
            onClick={() => router.push("/allinstructor")}
          >
            Back to Instructors
          </Button>
        </div>
      </div>
    )
  }

  const instructorDescription =
    typeof userData.description === "object" ? (userData.description as InstructorDescription) : null

  // Tabs configuration
  const tabs = [
    { id: "about", label: "About", icon: <FaInfoCircle className="mr-2" /> },
    { id: "courses", label: "Courses", icon: <FaSwimmer className="mr-2" /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate className="mr-2" /> },
    { id: "testimonials", label: "Testimonials", icon: <FaStar className="mr-2" /> },
    { id: "schedule", label: "Schedule", icon: <FaCalendarAlt className="mr-2" /> },
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header Section */}
      <div
        className={`relative ${isDarkMode ? "bg-gradient-to-r from-blue-900 to-slate-900" : "bg-gradient-to-r from-blue-600 to-cyan-500"}`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-water-pattern.png')] bg-cover bg-center opacity-10"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`water-ripple delay-${i} absolute`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            ></div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {userData.profile_img ? (
                  <Image
                    src={userData.profile_img || "/placeholder.svg"}
                    alt={userData.name || "Instructor"}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <FaUser className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>

              {instructorDescription?.experience && (
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  {instructorDescription.experience}+ yrs
                </div>
              )}
            </motion.div>

            {/* Instructor Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 text-center md:text-left text-white"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{userData.name || "Instructor"}</h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-4">
                {instructorDescription?.specialty || "Swimming Instructor"}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                {instructorDescription?.styles && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaSwimmer className="text-sm" />
                    <span className="text-sm">
                      {typeof instructorDescription.styles === "string"
                        ? instructorDescription.styles
                        : "Various Styles"}
                    </span>
                  </div>
                )}

                {userData.address && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{userData.address}</span>
                  </div>
                )}

                {instructorDescription?.contactHours && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaClock className="text-sm" />
                    <span className="text-sm">{instructorDescription.contactHours}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {userData.email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-blue-200" />
                    <span>{userData.email}</span>
                  </div>
                )}

                {userData.phone_number && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-200" />
                    <span>{userData.phone_number}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <Button variant="secondary" className="whitespace-nowrap" showArrow>
                Book a Session
              </Button>

              {isOwnProfile && (
                <Link href={`/profile/${teacherId}`}>
                  <Button variant="outline" className="whitespace-nowrap" icon={<FaEdit />}>
                    Edit Profile
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? isDarkMode
                    ? "bg-blue-900 text-blue-100 border border-blue-800"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                  : isDarkMode
                    ? "text-gray-300 hover:bg-slate-800"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl shadow-md overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"}`}
            >
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="p-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-6`}>
                    About {userData.name}
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-3`}>
                        Bio
                      </h3>
                      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {instructorDescription?.bio ||
                          "I am a passionate swimming instructor dedicated to helping students of all ages develop confidence and skill in the water. With years of experience and a patient, methodical approach, I specialize in creating personalized learning experiences that address each student's unique needs and goals."}
                      </p>
                    </div>

                    {instructorDescription?.styles && (
                      <div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-3`}>
                          Swimming Styles
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {typeof instructorDescription.styles === "string" ? (
                            instructorDescription.styles.split(",").map((style, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm ${
                                  isDarkMode
                                    ? "bg-blue-900/30 text-blue-300 border border-blue-800/50"
                                    : "bg-blue-100 text-blue-700 border border-blue-200"
                                }`}
                              >
                                {style.trim()}
                              </span>
                            ))
                          ) : (
                            <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              No swimming styles specified.
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-3`}>
                          Experience
                        </h3>
                        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {instructorDescription?.experience
                            ? `${instructorDescription.experience} years of teaching experience`
                            : "Experience information not provided."}
                        </p>
                      </div>

                      <div>
                        <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-3`}>
                          Contact Hours
                        </h3>
                        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {instructorDescription?.contactHours || "Contact hours not specified."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === "courses" && (
                <div className="p-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-6`}>
                    Courses by {userData.name}
                  </h2>

                  {coursesLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : coursesError ? (
                    <div className={`rounded-lg p-6 text-center ${isDarkMode ? "bg-slate-700" : "bg-red-50"}`}>
                      <FaExclamationTriangle
                        className={`mx-auto mb-4 text-3xl ${isDarkMode ? "text-red-400" : "text-red-500"}`}
                      />
                      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Error Loading Courses
                      </h3>
                      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{coursesError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className={`mt-4 px-4 py-2 rounded-lg font-medium ${
                          isDarkMode
                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        Retry
                      </button>
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="space-y-6">
                      {courses.map((course) => (
                        <CourseCard key={course.id || course.course_id} course={course} />
                      ))}

                      {courses.length > 0 && (
                        <div className="text-center mt-8">
                          <Link href={`/allinstructor/${teacherId}/courses`}>
                            <Button variant="secondary" showArrow>
                              View All Courses
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <p>No courses available from this instructor at the moment.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Certifications Tab */}
              {activeTab === "certifications" && (
                <div className="p-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-6`}>
                    Certifications & Qualifications
                  </h2>

                  {instructorDescription?.certification ? (
                    <div className="space-y-4">
                      {typeof instructorDescription.certification === "string" ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className={`flex flex-col md:flex-row gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow ${
                            isDarkMode
                              ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 md:w-20 md:h-20 relative flex items-center justify-center">
                              <FaCertificate className={`text-5xl ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                  {instructorDescription.certification}
                                </h3>
                                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                                  Professional Certification
                                </p>
                              </div>
                            </div>

                            <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                              This certification validates the instructor's expertise and qualifications in swimming
                              instruction.
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        Array.isArray(instructorDescription.certification) &&
                        instructorDescription.certification.map((cert, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row gap-4 border rounded-lg p-4 hover:shadow-md transition-shadow ${
                              isDarkMode
                                ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 md:w-20 md:h-20 relative flex items-center justify-center">
                                <FaCertificate
                                  className={`text-5xl ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}
                                />
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                    {cert}
                                  </h3>
                                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                                    Professional Certification
                                  </p>
                                </div>
                              </div>

                              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                This certification validates the instructor's expertise and qualifications in swimming
                                instruction.
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <p>No certification information available for this instructor.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === "testimonials" && (
                <div className="p-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-6`}>
                    Student Testimonials
                  </h2>

                  <div className="relative">
                    {/* Featured testimonial */}
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className={`rounded-xl p-6 md:p-8 relative ${
                        isDarkMode
                          ? "bg-gradient-to-br from-slate-700 to-slate-800"
                          : "bg-gradient-to-br from-blue-50 to-cyan-50"
                      }`}
                    >
                      <FaQuoteLeft
                        className={`absolute top-6 left-6 text-3xl ${isDarkMode ? "text-blue-500/30" : "text-blue-200"}`}
                      />

                      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <Image
                              src={sampleTestimonials[activeTestimonial].avatar || "/placeholder.svg"}
                              alt={sampleTestimonials[activeTestimonial].name}
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start mb-3">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < sampleTestimonials[activeTestimonial].rating ? "text-yellow-400" : "text-gray-300"
                                }
                                size={20}
                              />
                            ))}
                          </div>

                          <p className={`italic mb-4 text-lg ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                            {sampleTestimonials[activeTestimonial].text}
                          </p>

                          <div>
                            <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                              {sampleTestimonials[activeTestimonial].name}
                            </p>
                            <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                              {sampleTestimonials[activeTestimonial].course}
                            </p>
                            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}>
                              {sampleTestimonials[activeTestimonial].date}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Navigation buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={prevTestimonial}
                          className={`p-2 rounded-full shadow-sm ${
                            isDarkMode
                              ? "bg-slate-600 text-white hover:bg-cyan-600"
                              : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
                          } transition-colors`}
                          aria-label="Previous testimonial"
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          onClick={nextTestimonial}
                          className={`p-2 rounded-full shadow-sm ${
                            isDarkMode
                              ? "bg-slate-600 text-white hover:bg-cyan-600"
                              : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
                          } transition-colors`}
                          aria-label="Next testimonial"
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </motion.div>

                    {/* Testimonial indicators */}
                    <div className="flex justify-center mt-4 gap-2">
                      {sampleTestimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === activeTestimonial
                              ? isDarkMode
                                ? "bg-cyan-500"
                                : "bg-blue-600"
                              : isDarkMode
                                ? "bg-gray-600 hover:bg-gray-500"
                                : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Go to testimonial ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial list */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sampleTestimonials.map((testimonial, index) => (
                      <motion.div
                        key={testimonial.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          index === activeTestimonial
                            ? isDarkMode
                              ? "border-cyan-600 bg-slate-700"
                              : "border-blue-300 bg-blue-50"
                            : isDarkMode
                              ? "border-slate-600 bg-slate-800 hover:border-cyan-800 hover:bg-slate-700"
                              : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50"
                        }`}
                        onClick={() => setActiveTestimonial(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={testimonial.avatar || "/placeholder.svg"}
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                {testimonial.name}
                              </p>
                              <div className="flex items-center">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                  {testimonial.rating}
                                </span>
                              </div>
                            </div>

                            <p
                              className={`text-sm line-clamp-2 mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
                            >
                              {testimonial.text}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="p-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-6`}>
                    Weekly Schedule
                  </h2>

                  {instructorDescription?.schedule ? (
                    <div
                      className={`rounded-xl border overflow-hidden ${
                        isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="p-6">
                        <div className="space-y-3">
                          {Object.entries(instructorDescription.schedule).map(([day, slots]) => (
                            <div
                              key={day}
                              className={`border-b pb-2 last:border-0 ${isDarkMode ? "border-slate-700" : "border-gray-100"}`}
                            >
                              <p
                                className={`font-medium capitalize mb-1 ${isDarkMode ? "text-white" : "text-gray-700"}`}
                              >
                                {day}
                              </p>
                              {slots && slots.length > 0 ? (
                                <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                  {slots.map((slot, i) => (
                                    <div key={i} className="flex items-center gap-2 mb-1">
                                      <FaClock className={isDarkMode ? "text-cyan-400" : "text-blue-500"} size={12} />
                                      <span>
                                        {slot.startTime} - {slot.endTime}
                                      </span>
                                      {slot.location && (
                                        <>
                                          <FaMapMarkerAlt
                                            className={isDarkMode ? "text-cyan-400 ml-2" : "text-blue-500 ml-2"}
                                            size={12}
                                          />
                                          <span>{slot.location}</span>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Not available
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className={`mt-6 rounded-lg p-4 ${isDarkMode ? "bg-slate-700" : "bg-blue-50"}`}>
                          <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            Booking Information
                          </h3>
                          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Lessons must be booked at least 24 hours in advance. Cancellations within 12 hours of the
                            scheduled time are subject to a fee.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <p>No schedule information available for this instructor.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">


            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`rounded-xl shadow-md overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"}`}
            >
              <div
                className={`px-6 py-4 ${isDarkMode ? "bg-gradient-to-r from-blue-900 to-slate-800" : "bg-gradient-to-r from-blue-600 to-cyan-600"} text-white`}
              >
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>

              <div className="p-6 space-y-3">
                <Button variant={isDarkMode ? "gradient" : "primary"} className="w-full" icon={<FaCalendarAlt />}>
                  Book a Session
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  icon={<FaSwimmer />}
                  onClick={() => setActiveTab("courses")}
                >
                  View All Courses
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  icon={<FaCalendarAlt />}
                  onClick={() => setActiveTab("schedule")}
                >
                  Check Availability
                </Button>
              </div>
            </motion.div>

            {/* Availability Summary */}
            {instructorDescription?.schedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`rounded-xl shadow-md overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"}`}
              >
                <div
                  className={`px-6 py-4 ${isDarkMode ? "bg-gradient-to-r from-blue-900 to-slate-800" : "bg-gradient-to-r from-blue-600 to-cyan-600"} text-white`}
                >
                  <h2 className="text-xl font-bold">Weekly Availability</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-2">
                    {Object.entries(instructorDescription.schedule).map(([day, slots]) => (
                      <div
                        key={day}
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-50"
                        } transition-colors`}
                      >
                        <span className={`capitalize font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                          {day}
                        </span>
                        <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                          {slots && slots.length > 0 ? `${slots[0].startTime} - ${slots[0].endTime}` : "Not available"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full mt-4"
                    onClick={() => setActiveTab("schedule")}
                    showArrow
                  >
                    View Full Schedule
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
