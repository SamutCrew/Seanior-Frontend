"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/app/redux"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Award, ChevronRight, Star, DollarSign } from "lucide-react"
import type { Course } from "@/types/course"
import LoadingPage from "@/components/Common/LoadingPage"
import { getCourseById } from "@/api/course_api"
import Image from "next/image"
import { FaSwimmer } from "react-icons/fa"

// Define a type for the schedule object
type ScheduleObject = {
  [key: string]: string | null | undefined
}

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  // Get courseId from unwrapped params
  const courseId = unwrappedParams.courseId

  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Format schedule to handle object or string
  const formatSchedule = (schedule: unknown): string => {
    if (!schedule) return "Schedule not available"

    // If it's already a string, return it
    if (typeof schedule === "string") return schedule

    // If it's an object, format it
    if (typeof schedule === "object" && schedule !== null) {
      try {
        // Try to convert from JSON string if needed
        const scheduleObj: ScheduleObject = schedule as ScheduleObject

        // Format the object into a readable string
        return Object.entries(scheduleObj)
          .filter(([_, value]) => value) // Only include days that have values
          .map(([day, time]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
          .join(", ")
      } catch (e) {
        console.error("Error formatting schedule:", e)
        return "Schedule available upon request"
      }
    }

    return "Schedule not available"
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setImageError(false)

        console.log(`Fetching course details for ID: ${courseId}`)

        const data = await getCourseById(courseId)
        console.log("Course data:", data)

        // Format the schedule properly
        let formattedSchedule = "Schedule not available"
        if (data.schedule) {
          if (typeof data.schedule === "string") {
            formattedSchedule = data.schedule
          } else if (typeof data.schedule === "object") {
            formattedSchedule = Object.entries(data.schedule)
              .filter(([_, value]) => value)
              .map(([day, time]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}`)
              .join(", ")
          }
        }

        // Map API data to the Course type
        const mappedCourse: Course = {
          id: data.course_id ? Number.parseInt(data.course_id, 10) || data.course_id : Number.parseInt(courseId, 10),
          title: data.course_name || "Swimming Course",
          focus: data.description?.substring(0, 100) || "Learn professional swimming techniques",
          level: data.level || "Beginner",
          duration: `${data.course_duration || 8} weeks`,
          schedule: formattedSchedule,
          instructor: data.instructor?.name || "Professional Instructor",
          instructorId: data.instructor?.user_id || data.instructor_id || "1",
          instructorImage: data.instructor?.profile_img || "/swimming-instructor.png",
          rating: data.rating || 4.5,
          students: data.students || 0,
          price: data.price || 199,
          location: {
            address: data.location || "Main Swimming Pool",
          },
          courseType: data.pool_type || "public-pool",
          description: data.description || "This is a comprehensive swimming course.",
          curriculum: Array.isArray(data.curriculum)
            ? data.curriculum
            : ["Swimming fundamentals", "Water safety", "Basic strokes", "Breathing techniques", "Advanced techniques"],
          requirements: Array.isArray(data.requirements)
            ? data.requirements
            : ["Swimwear required", "Basic comfort in water recommended"],
          maxStudents: data.max_students || 15,
          image: data.course_image || "/placeholder.svg?key=9qy8b",
          study_frequency: data.study_frequency || "Twice a week",
          days_study: data.days_study || 2,
          number_of_total_sessions: data.number_of_total_sessions || 16,
          course_image: data.course_image || "/placeholder.svg?key=kuamv",
          originalData: data,
        }

        setCourse(mappedCourse)
        setIsLoading(false)
      } catch (err: any) {
        console.error("Error fetching course:", err)
        setError(err.message || "Failed to load course details. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

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
            <p className="text-xl">{error || "Course not found"}</p>
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

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}`}>
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden ${
          isDarkMode ? "bg-gradient-to-r from-blue-900 to-cyan-900" : "bg-gradient-to-r from-blue-600 to-cyan-500"
        }`}
      >
        <div className="absolute inset-0 bg-[url('/patterns/wave-pattern.svg')] bg-repeat opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-block mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? "bg-slate-800/50 text-cyan-300" : "bg-white/20 text-white"
                    } backdrop-blur-sm`}
                  >
                    {course.level} Level
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-4">{course.focus}</p>
                <div className="flex items-center gap-3 text-white/90 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating.toFixed(1)}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/40"></div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-cyan-300 mr-1" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/40"></div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-cyan-300 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={isDarkMode ? "gradient" : "primary"}
                    size="lg"
                    className={`${!isDarkMode && "bg-blue-600 text-white hover:bg-blue-700"}`}
                  >
                    Enroll Now
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Contact Instructor
                  </Button>
                </div>
              </div>
              <div className="hidden md:block relative mt-8 md:mt-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-xl"></div>
                <div className="relative w-[400px] h-[300px]">
                  <Image
                    src={
                      imageError
                        ? "/placeholder.svg?height=400&width=600&query=swimming+course"
                        : course.image ||
                          course.course_image ||
                          "/placeholder.svg?height=400&width=600&query=swimming+course"
                    }
                    alt={course.title}
                    className="rounded-xl shadow-lg object-cover"
                    fill
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                </div>
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold">
                  ${course.price.toLocaleString()}
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

      {/* Course Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-8 rounded-xl shadow-lg mb-8 ${
                isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
              }`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Course Description
              </h2>
              <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.description}</p>

              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                What You'll Learn
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {course.curriculum?.map((item, index) => (
                  <li key={index} className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <ChevronRight
                      className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {course.requirements && (
                <>
                  <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    Requirements
                  </h3>
                  <ul className="mb-6">
                    {course.requirements.map((item, index) => (
                      <li
                        key={index}
                        className={`flex items-start mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        <ChevronRight
                          className={`w-5 h-5 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <Button
                variant={isDarkMode ? "gradient" : "primary"}
                className={`w-full ${!isDarkMode && "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Enroll in This Course
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`p-8 rounded-xl shadow-lg ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                About the Instructor
              </h2>
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={course.instructorImage || "/instructor-teaching.png"}
                    alt={course.instructor}
                    className="object-cover"
                    fill
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {course.instructor}
                  </h3>
                  <p className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>Swimming Instructor</p>
                </div>
              </div>
              <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Professional swimming instructor with expertise in teaching students of all levels. Specialized in{" "}
                {course.level.toLowerCase()} level swimming techniques and water safety.
              </p>
              <Button
                variant="outline"
                className={isDarkMode ? "border-slate-700 text-white" : ""}
                onClick={() => router.push(`/allinstructor/${course.instructorId}`)}
              >
                View Instructor Profile
              </Button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-xl shadow-lg sticky top-24 ${
                isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
              }`}
            >
              <div className="md:hidden mb-6">
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      imageError
                        ? "/placeholder.svg?height=400&width=600&query=swimming+course"
                        : course.image ||
                          course.course_image ||
                          "/placeholder.svg?height=400&width=600&query=swimming+course"
                    }
                    alt={course.title}
                    className="object-cover rounded-lg"
                    fill
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-lg font-bold">
                    ${course.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Course Details
              </h3>

              <div className="space-y-4 mb-6">
                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Calendar
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <div>
                    <p className="font-medium">Schedule</p>
                    <p>{course.schedule}</p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Clock className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p>
                      {course.duration} ({course.number_of_total_sessions} sessions)
                    </p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <MapPin className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Location</p>
                    <p>{course.location.address}</p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Users className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Class Size</p>
                    <p>
                      {course.students} enrolled (max {course.maxStudents})
                    </p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Award className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Level</p>
                    <p>{course.level}</p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <DollarSign
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-lg font-bold">${course.price}</p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Clock className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <p className="font-medium">Frequency</p>
                    <p>
                      {course.study_frequency} ({course.days_study} days per week)
                    </p>
                  </div>
                </div>

                <div className={`flex items-start ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <FaSwimmer
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                  />
                  <div>
                    <p className="font-medium">Pool Type</p>
                    <p>{course.courseType}</p>
                  </div>
                </div>
              </div>

              <Button
                variant={isDarkMode ? "gradient" : "primary"}
                className={`w-full mb-3 ${!isDarkMode && "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Enroll Now
              </Button>

              <Button variant="outline" className={`w-full ${isDarkMode ? "border-slate-700 text-white" : ""}`}>
                Add to Wishlist
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-16">
          <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Similar Courses You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated with actual related courses */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="cursor-pointer"
                onClick={() => router.push(`/allcourse/${Number(courseId) + i}`)}
              >
                <div
                  className={`rounded-xl overflow-hidden shadow-md ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                  }`}
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={`/placeholder.svg?key=gb1oa&key=8yh7w&key=i1x6p&key=nr1j8&height=400&width=600&query=swimming+${
                        i === 1 ? "beginner" : i === 2 ? "intermediate" : "advanced"
                      }`}
                      alt="Related Course"
                      className="object-cover"
                      fill
                      unoptimized
                    />
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
                        isDarkMode ? "bg-slate-900/80 text-white" : "bg-white/80 text-blue-800"
                      } backdrop-blur-sm`}
                    >
                      {i === 1 ? "Beginner" : i === 2 ? "Intermediate" : "Advanced"}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {i === 1
                        ? "Beginner Swimming Fundamentals"
                        : i === 2
                          ? "Intermediate Stroke Development"
                          : "Competitive Swim Training"}
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                      {i === 1
                        ? "Learn basic swimming techniques"
                        : i === 2
                          ? "Refine all four competitive strokes"
                          : "Advanced training for competitions"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {(4.5 + i * 0.1).toFixed(1)}
                        </span>
                      </div>
                      <span className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        ${149 + i * 50}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
