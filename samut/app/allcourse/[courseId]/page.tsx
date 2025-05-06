"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/app/redux"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Award, ChevronRight, Star, DollarSign } from "lucide-react"
import type { Course } from "@/types/course"
import LoadingPage from "@/components/Common/LoadingPage"

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // In a real application, this would be an API call
        // For now, we'll simulate fetching the course by ID
        setTimeout(() => {
          // Mock course data
          const mockCourse: Course = {
            id: Number.parseInt(params.courseId),
            title: "Advanced Freestyle Technique",
            focus: "Perfect your freestyle stroke for competitive swimming",
            level: "Advanced",
            duration: "6 weeks",
            schedule: "Tue, Thu 6:30 PM - 8:00 PM",
            instructor: "Michael Chen",
            instructorId: "2",
            rating: 4.9,
            students: 8,
            price: 249,
            location: {
              address: "Olympic Pool, 456 Sports Ave",
            },
            courseType: "public-pool",
            description:
              "Take your freestyle to the next level with advanced techniques and drills. This course is designed for swimmers who already have a solid foundation in freestyle and want to improve their efficiency, speed, and endurance. Through video analysis, targeted drills, and personalized feedback, you'll refine your stroke mechanics and develop a more powerful, efficient freestyle technique.",
            curriculum: [
              "Stroke Analysis and Biomechanics",
              "Efficiency Drills and Technique Refinement",
              "Breathing Patterns and Rhythm",
              "Race Strategy and Pacing",
              "Advanced Turns and Underwater Work",
              "Sprint and Distance Variations",
            ],
            requirements: [
              "Comfortable swimming at least 200m freestyle without stopping",
              "Basic understanding of freestyle technique",
              "Ability to perform flip turns",
              "Own swimming equipment (fins, paddles, snorkel recommended)",
            ],
            maxStudents: 10,
          }

          setCourse(mockCourse)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Error fetching course:", err)
        setError("Failed to load course details. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.courseId])

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
                <img
                  src="/breaststroke-swimming.png"
                  alt={course.title}
                  className="rounded-xl shadow-lg w-[400px] h-[300px] object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold">
                  ${course.price}
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
                <img
                  src="/Teacher2.jpg"
                  alt={course.instructor}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {course.instructor}
                  </h3>
                  <p className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>Swimming Instructor</p>
                </div>
              </div>
              <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Professional swimming instructor with over 10 years of experience training competitive swimmers.
                Specialized in advanced technique development and race strategy.
              </p>
              <Button
                variant="outline"
                className={isDarkMode ? "border-slate-700 text-white" : ""}
                onClick={() => router.push(`/instructor/${course.instructorId}`)}
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
                <div className="relative">
                  <img
                    src="/placeholder.svg?key=gig3h"
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-lg font-bold">
                    ${course.price}
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
                    <p>{course.duration}</p>
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
                onClick={() => router.push(`/allcourse/${i}`)}
              >
                <div
                  className={`rounded-xl overflow-hidden shadow-md ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
                  }`}
                >
                  <div className="relative">
                    <img
                      src="/Teacher2.jpg"
                      alt="Related Course"
                      className="w-full h-48 object-cover"
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
                          {4.5 + (i * 0.1).toFixed(1)}
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
