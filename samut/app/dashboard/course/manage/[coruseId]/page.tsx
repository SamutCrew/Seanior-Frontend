"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaStar, FaUsers, FaArrowLeft, FaEdit, FaChartLine, FaChalkboardTeacher } from "react-icons/fa"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"
import CourseProgressTracker from "@/components/Course/CourseProgressTracker"
import type { Course, CourseProgress } from "@/types/course"

// Sample courses data - in a real app, this would come from an API
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
          images: ["/placeholder.svg?key=5rrj9"],
          moduleId: 1,
          topicId: 101,
        },
      ],
    },
  },
  // Other courses would be here
]

export default function CourseManagementPage() {
  const { courseId } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [activeTab, setActiveTab] = useState<"progress" | "students" | "settings">("progress")

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
    router.push("/dashboard")
  }

  // Handle progress update
  const handleProgressUpdate = (updatedProgress: CourseProgress) => {
    if (course) {
      setCourse({
        ...course,
        progress: updatedProgress,
      })

      // Here you would typically make an API call to update the progress on the server
      console.log("Progress updated:", updatedProgress)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}
      >
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className={isDarkMode ? "text-gray-300 mb-6" : "text-gray-600 mb-6"}>
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Course Header */}
      <div className={`${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className={`mr-4 p-2 rounded-full ${
                isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
              } transition-colors`}
            >
              <FaArrowLeft className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
              <span className="sr-only">Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold">Course Management</h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={course.image || "/placeholder.svg?height=200&width=200&query=swimming course"}
                alt={course.title}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
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
                  <FaStar className="h-3 w-3" />
                  <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
                </div>
              </div>
              <h2 className="text-xl font-bold">{course.title}</h2>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{course.focus}</p>
            </div>
            <div className="flex-shrink-0 flex gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.push(`/teacher/${course.instructorId}/course/${course.id}`)}
              >
                <FaChalkboardTeacher className="h-4 w-4" />
                <span>View Public Page</span>
              </Button>
              <Button variant="primary" className="flex items-center gap-2">
                <FaEdit className="h-4 w-4" />
                <span>Edit Course</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`border-b ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("progress")}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "progress"
                  ? isDarkMode
                    ? "border-cyan-500 text-cyan-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaChartLine className="inline-block mr-2 h-4 w-4" /> Progress Tracking
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "students"
                  ? isDarkMode
                    ? "border-cyan-500 text-cyan-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUsers className="inline-block mr-2 h-4 w-4" /> Students
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-6 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "settings"
                  ? isDarkMode
                    ? "border-cyan-500 text-cyan-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaEdit className="inline-block mr-2 h-4 w-4" /> Course Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "progress" && (
          <div className="max-w-4xl mx-auto">
            <CourseProgressTracker
              courseId={course.id}
              initialProgress={course.progress}
              onSave={handleProgressUpdate}
            />
          </div>
        )}

        {activeTab === "students" && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Student Management
              </h2>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                Currently {course.students} students enrolled in this course.
              </p>

              {/* Placeholder for student management UI */}
              <div
                className={`p-8 text-center rounded-lg border-2 border-dashed ${isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"}`}
              >
                Student management interface will be implemented here
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Course Settings
              </h2>

              {/* Placeholder for course settings UI */}
              <div
                className={`p-8 text-center rounded-lg border-2 border-dashed ${isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"}`}
              >
                Course settings interface will be implemented here
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
