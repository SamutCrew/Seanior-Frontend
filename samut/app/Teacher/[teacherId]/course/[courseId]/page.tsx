"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  FaStar,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaHome,
  FaBuilding,
  FaSwimmingPool,
  FaChartLine,
  FaBookOpen,
  FaCheck,
} from "react-icons/fa"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"
import type { Course } from "@/types/course"

// Define course types
type CourseType = "private-location" | "public-pool" | "teacher-pool"

// Sample courses data
const sampleCourses: Course[] = [
  {
    id: 1,
    title: "Freestyle Mastery",
    focus: "Perfect your freestyle technique with Olympic-level instruction",
    level: "Intermediate",
    duration: "8 weeks",
    schedule: "Mon/Wed 5-6pm",
    instructor: "Michael Phelps",
    instructorId: "1",
    rating: 4.8,
    students: 24,
    maxStudents: 30,
    price: 299,
    courseType: "public-pool",
    location: {
      address: "Aquatic Center, Los Angeles, CA",
    },
    description:
      "This comprehensive course focuses on perfecting your freestyle technique through detailed instruction and practice. You'll learn advanced breathing techniques, efficient arm movements, and proper body positioning to maximize your speed and endurance in the water. Suitable for intermediate swimmers who want to take their freestyle to the next level.",
    curriculum: [
      "Week 1-2: Body positioning and balance",
      "Week 3-4: Arm stroke mechanics and efficiency",
      "Week 5-6: Breathing techniques and timing",
      "Week 7-8: Speed development and endurance training",
    ],
    requirements: [
      "Ability to swim 100m freestyle without stopping",
      "Basic understanding of freestyle technique",
      "Own swimming equipment (goggles, swim cap)",
      "Commitment to attend at least 80% of sessions",
    ],
    image: "/focused-freestyle.png",
    progress: {
      overallCompletion: 65,
      modules: [
        {
          id: 1,
          title: "Body positioning and balance",
          completion: 100,
          topics: [
            { id: 101, title: "Horizontal body position", completed: true },
            { id: 102, title: "Core engagement", completed: true },
            { id: 103, title: "Head position in water", completed: true },
          ],
        },
        {
          id: 2,
          title: "Arm stroke mechanics",
          completion: 75,
          topics: [
            { id: 201, title: "Entry and catch phase", completed: true },
            { id: 202, title: "Pull phase technique", completed: true },
            { id: 203, title: "Recovery phase", completed: true },
            { id: 204, title: "Hand position optimization", completed: false },
          ],
        },
        {
          id: 3,
          title: "Breathing techniques",
          completion: 33,
          topics: [
            { id: 301, title: "Bilateral breathing", completed: true },
            { id: 302, title: "Breath timing", completed: false },
            { id: 303, title: "Breath control exercises", completed: false },
          ],
        },
        {
          id: 4,
          title: "Speed development",
          completion: 0,
          topics: [
            { id: 401, title: "Interval training", completed: false },
            { id: 402, title: "Sprint technique", completed: false },
            { id: 403, title: "Race pace training", completed: false },
          ],
        },
      ],
      lastUpdated: "2023-05-15T14:30:00Z",
      sessionDetails: [
        {
          id: "session-1",
          date: "2023-05-10",
          title: "Body Position Fundamentals",
          description:
            "Focused on horizontal body alignment and core engagement. Students practiced floating exercises and basic streamline position.",
          images: ["/placeholder.svg?key=tla5q"],
          moduleId: 1,
          topicId: 101,
        },
      ],
    },
  },
  {
    id: 2,
    title: "Beginner Swimming",
    focus: "Learn the fundamentals of swimming in a supportive environment",
    level: "Beginner",
    duration: "6 weeks",
    schedule: "Tue/Thu 4-5pm",
    instructor: "Michael Phelps",
    instructorId: "1",
    rating: 4.9,
    students: 18,
    maxStudents: 20,
    price: 249,
    courseType: "teacher-pool",
    location: {
      address: "Instructor's Private Pool, Beverly Hills, CA",
    },
    description:
      "Start your swimming journey with confidence in this beginner-friendly course. You'll learn water safety, basic floating techniques, and the fundamentals of all four swimming strokes. Our small class size ensures personalized attention in a comfortable, private pool setting.",
    curriculum: [
      "Week 1: Water comfort and basic floating",
      "Week 2: Breath control and submersion",
      "Week 3-4: Introduction to freestyle and backstroke",
      "Week 5-6: Introduction to breaststroke and water safety",
    ],
    requirements: [
      "No prior swimming experience necessary",
      "Comfort being around water",
      "Swimsuit and towel",
      "Positive attitude and willingness to learn",
    ],
    image: "/swimmer-in-motion.png",
    progress: {
      overallCompletion: 25,
      modules: [
        {
          id: 1,
          title: "Water comfort and safety",
          completion: 100,
          topics: [
            { id: 101, title: "Pool safety rules", completed: true },
            { id: 102, title: "Water entry techniques", completed: true },
            { id: 103, title: "Basic floating", completed: true },
          ],
        },
        {
          id: 2,
          title: "Breath control",
          completion: 0,
          topics: [
            { id: 201, title: "Submersion exercises", completed: false },
            { id: 202, title: "Rhythmic breathing", completed: false },
            { id: 203, title: "Breath holding techniques", completed: false },
          ],
        },
        {
          id: 3,
          title: "Basic strokes",
          completion: 0,
          topics: [
            { id: 301, title: "Freestyle introduction", completed: false },
            { id: 302, title: "Backstroke basics", completed: false },
            { id: 303, title: "Kick techniques", completed: false },
          ],
        },
      ],
      lastUpdated: "2023-05-10T09:15:00Z",
    },
  },
  {
    id: 3,
    title: "Competition Prep",
    focus: "Advanced training for competitive swimmers",
    level: "Advanced",
    duration: "10 weeks",
    schedule: "Mon/Wed/Fri 7-8:30pm",
    instructor: "Michael Phelps",
    instructorId: "1",
    rating: 4.7,
    students: 12,
    maxStudents: 15,
    price: 399,
    courseType: "private-location",
    location: {
      address: "Your pool or facility",
    },
    description:
      "Designed for serious swimmers preparing for competition, this intensive course focuses on race strategy, advanced techniques in all four strokes, and competition-specific training. The instructor will come to your pool, allowing for customized training in your familiar environment.",
    curriculum: [
      "Week 1-2: Stroke analysis and technique refinement",
      "Week 3-4: Start and turn optimization",
      "Week 5-6: Race pace training and strategy",
      "Week 7-8: Tapering and competition preparation",
      "Week 9-10: Mental preparation and race simulation",
    ],
    requirements: [
      "Competitive swimming experience",
      "Access to a suitable swimming pool",
      "Complete set of training equipment",
      "Commitment to rigorous training schedule",
    ],
    image: "/swimmer-in-motion.png",
  },
]

export default function CourseDetailPage() {
  const { id: teacherId, courseId } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [activeTab, setActiveTab] = useState<"details" | "curriculum">("details")

  useEffect(() => {
    // Simulate API call to fetch course data
    const fetchCourse = async () => {
      try {
        // Find the course with the matching ID
        const foundCourse = sampleCourses.find((c) => c.id.toString() === courseId)

        if (foundCourse) {
          setCourse(foundCourse)
        }
      } catch (error) {
        console.error("Failed to fetch course data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  const handleBack = () => {
    router.back()
  }

  // Function to get course type icon and color
  const getCourseTypeInfo = (type: CourseType) => {
    switch (type) {
      case "private-location":
        return {
          icon: <FaHome className="mr-2" />,
          label: "Private Location",
          description: "Instructor comes to your pool",
          color: isDarkMode
            ? "bg-purple-900/30 text-purple-400 border-purple-800/50"
            : "bg-purple-100 text-purple-800 border border-purple-200",
        }
      case "public-pool":
        return {
          icon: <FaBuilding className="mr-2" />,
          label: "Public Pool",
          description: "Lessons at a public swimming facility",
          color: isDarkMode
            ? "bg-blue-900/30 text-blue-400 border-blue-800/50"
            : "bg-blue-100 text-blue-800 border border-blue-200",
        }
      case "teacher-pool":
        return {
          icon: <FaSwimmingPool className="mr-2" />,
          label: "Teacher's Pool",
          description: "Lessons at the instructor's private pool",
          color: isDarkMode
            ? "bg-green-900/30 text-green-400 border-green-800/50"
            : "bg-green-100 text-green-800 border border-green-200",
        }
      default:
        return {
          icon: <FaSwimmingPool className="mr-2" />,
          label: "Standard",
          description: "Regular swimming lessons",
          color: isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800",
        }
    }
  }

  // Navigate to the course management page in the dashboard
  const handleManageCourse = () => {
    router.push(`/dashboard/courses/manage/${courseId}`)
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-blue-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900 text-white" : "bg-blue-50 text-gray-800"}`}
      >
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className={isDarkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}>
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft className="mr-2" /> Go Back
          </Button>
        </div>
      </div>
    )
  }

  const courseTypeInfo = getCourseTypeInfo(course.courseType)

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-blue-50 text-gray-900"}`}>
      {/* Course Header */}
      <div className={`relative ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-md`}>
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDarkMode
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
            } transition-colors`}
          >
            <FaArrowLeft /> <span>Back</span>
          </button>
        </div>

        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <Image
            src={course.image || "/placeholder.svg?height=600&width=1200&query=swimming course"}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div
            className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" : "bg-gradient-to-t from-black/70 via-black/40 to-transparent"}`}
          ></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    course.level === "Beginner"
                      ? isDarkMode
                        ? "bg-green-900/30 text-green-400 border border-green-800/50"
                        : "bg-green-100 text-green-800 border border-green-200"
                      : course.level === "Intermediate"
                        ? isDarkMode
                          ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                        : isDarkMode
                          ? "bg-purple-900/30 text-purple-400 border border-purple-800/50"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                  }`}
                >
                  {course.level}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  <FaStar />
                  <span className="font-medium">{course.rating.toFixed(1)}</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg text-gray-200 mb-4">{course.focus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`border-b ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-6 font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? isDarkMode
                    ? "border-cyan-500 text-cyan-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Course Details
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`py-4 px-6 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "curriculum"
                  ? isDarkMode
                    ? "border-cyan-500 text-cyan-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaBookOpen className="h-4 w-4" /> Curriculum
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "details" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Type Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
              >
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Course Type</h2>

                <div className={`flex items-center p-4 rounded-lg ${courseTypeInfo.color}`}>
                  <div className="text-2xl mr-4">{courseTypeInfo.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{courseTypeInfo.label}</h3>
                    <p>{courseTypeInfo.description}</p>
                  </div>
                </div>

                <div className="mt-4">
                  {course.courseType === "private-location" && (
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                      This course is taught at your location. The instructor will travel to your pool or facility,
                      allowing for personalized instruction in a familiar environment.
                    </p>
                  )}
                  {course.courseType === "public-pool" && (
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                      This course takes place at a public swimming facility. You'll join other students in a
                      professional environment with all necessary amenities.
                    </p>
                  )}
                  {course.courseType === "teacher-pool" && (
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                      This course is held at the instructor's private pool. You'll benefit from a controlled environment
                      specifically designed for optimal learning.
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Course Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
              >
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Course Description
                </h2>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{course.description}</p>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
              >
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {course.requirements?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div
                        className={`min-w-5 h-5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-blue-100"} flex items-center justify-center mr-3 mt-0.5`}
                      >
                        <span className={`text-xs font-bold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                          {index + 1}
                        </span>
                      </div>
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Price</span>
                    <span className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      ${course.price}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaCalendarAlt className={`mr-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration</p>
                        <p className={isDarkMode ? "text-white" : "text-gray-800"}>{course.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaClock className={`mr-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Schedule</p>
                        <p className={isDarkMode ? "text-white" : "text-gray-800"}>{course.schedule}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaMapMarkerAlt className={`mr-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Location</p>
                        <p className={isDarkMode ? "text-white" : "text-gray-800"}>{course.location.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <FaUsers className={`mr-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Enrollment</p>
                        <p className={isDarkMode ? "text-white" : "text-gray-800"}>
                          {course.students}/{course.maxStudents || course.students} students
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(course.students / (course.maxStudents || course.students)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* For teachers only - link to dashboard */}
                  <Button
                    variant={isDarkMode ? "gradient" : "primary"}
                    className="w-full mt-4 py-3"
                    onClick={handleManageCourse}
                  >
                    <FaChartLine className="mr-2" /> Manage in Dashboard
                  </Button>
                </div>
              </motion.div>

              {/* Instructor Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
              >
                <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  About the Instructor
                </h3>

                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src="/confident-swim-coach.png"
                      alt={course.instructor}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {course.instructor}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Swimming Coach</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/teacher/${course.instructorId}`)}
                >
                  View Profile
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          // Curriculum Tab
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Course Curriculum
              </h2>

              <div className="space-y-6">
                {course.progress?.modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className={`rounded-lg border ${
                      isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                          {moduleIndex + 1}. {module.title}
                        </h3>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            module.completion === 100
                              ? isDarkMode
                                ? "bg-green-900/30 text-green-400"
                                : "bg-green-100 text-green-800"
                              : isDarkMode
                                ? "bg-slate-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {module.completion}% Complete
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 mb-4">
                        <div
                          className={`h-1.5 rounded-full ${
                            module.completion === 100 ? "bg-green-500" : "bg-gradient-to-r from-cyan-500 to-blue-600"
                          }`}
                          style={{ width: `${module.completion}%` }}
                        ></div>
                      </div>

                      <ul className="space-y-2 mt-3">
                        {module.topics.map((topic) => {
                          // Check if there are session details for this topic
                          const hasSessionDetails = course.progress?.sessionDetails?.some(
                            (detail) => detail.moduleId === module.id && detail.topicId === topic.id,
                          )

                          return (
                            <li key={topic.id} className="flex items-center justify-between py-1">
                              <div className="flex items-center">
                                {topic.completed ? (
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                      isDarkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"
                                    } mr-3`}
                                  >
                                    <FaCheck className="h-3 w-3" />
                                  </div>
                                ) : (
                                  <div
                                    className={`w-5 h-5 rounded-full border ${
                                      isDarkMode ? "border-gray-600" : "border-gray-300"
                                    } mr-3`}
                                  ></div>
                                )}
                                <span
                                  className={`${
                                    topic.completed
                                      ? isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                      : isDarkMode
                                        ? "text-gray-200"
                                        : "text-gray-700"
                                  }`}
                                >
                                  {topic.title}
                                </span>

                                {/* Show indicator if this topic has session details */}
                                {hasSessionDetails && (
                                  <span
                                    className={`ml-2 text-xs px-2 py-0.5 rounded ${
                                      isDarkMode
                                        ? "bg-cyan-900/30 text-cyan-400 border border-cyan-800/50"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    Notes
                                  </span>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
