"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Book, Clock, CheckCircle, ChevronRight, Filter } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"
import { Button } from "@/components/Common/Button"
import { SectionTitle } from "@/components/Common/SectionTitle"
import LoadingPage from "@/components/Common/LoadingPage"
import type { Course } from "@/types/course"

// Mock data - replace with actual API call
const getMyCourses = async (): Promise<{
  currentCourses: Course[]
  pastCourses: Course[]
}> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    currentCourses: [
      {
        id: 1,
        title: "Advanced Swimming Techniques",
        focus: "Freestyle & Butterfly",
        level: "Intermediate",
        duration: "12 weeks",
        schedule: "Mon, Wed 5:00 PM",
        instructor: "Sarah Johnson",
        instructorImage: "/female-swim-instructor.png",
        rating: 4.8,
        students: 12,
        price: 450,
        location: {
          address: "Aquatic Center, 123 Pool St",
        },
        courseType: "public-pool",
        status: "in-progress",
        image: "/placeholder.svg?key=d2476",
        progress: {
          overallCompletion: 65,
          modules: [
            { id: 1, title: "Freestyle Fundamentals", completion: 100, topics: [] },
            { id: 2, title: "Breathing Techniques", completion: 80, topics: [] },
            { id: 3, title: "Butterfly Stroke", completion: 40, topics: [] },
            { id: 4, title: "Advanced Turns", completion: 0, topics: [] },
          ],
          lastUpdated: new Date().toISOString(),
        },
      },
      {
        id: 2,
        title: "Water Safety & Rescue",
        focus: "Safety Techniques",
        level: "Beginner",
        duration: "8 weeks",
        schedule: "Tue, Thu 6:30 PM",
        instructor: "Michael Chen",
        instructorImage: "/male-swim-instructor.png",
        rating: 4.6,
        students: 15,
        price: 350,
        location: {
          address: "Community Pool, 456 Swim Ave",
        },
        courseType: "public-pool",
        status: "in-progress",
        image: "/water-safety-class.png",
        progress: {
          overallCompletion: 30,
          modules: [
            { id: 1, title: "Basic Water Safety", completion: 100, topics: [] },
            { id: 2, title: "Rescue Techniques", completion: 50, topics: [] },
            { id: 3, title: "CPR Basics", completion: 0, topics: [] },
            { id: 4, title: "Emergency Response", completion: 0, topics: [] },
          ],
          lastUpdated: new Date().toISOString(),
        },
      },
    ],
    pastCourses: [
      {
        id: 3,
        title: "Swimming Fundamentals",
        focus: "Basics & Confidence",
        level: "Beginner",
        duration: "10 weeks",
        schedule: "Completed",
        instructor: "David Wilson",
        instructorImage: "/swim-coach.png",
        rating: 4.9,
        students: 10,
        price: 300,
        location: {
          address: "Sunshine Pool, 789 Water Ln",
        },
        courseType: "public-pool",
        status: "completed",
        image: "/beginner-swimming-class.png",
        progress: {
          overallCompletion: 100,
          modules: [
            { id: 1, title: "Water Confidence", completion: 100, topics: [] },
            { id: 2, title: "Basic Strokes", completion: 100, topics: [] },
            { id: 3, title: "Floating Techniques", completion: 100, topics: [] },
            { id: 4, title: "Basic Diving", completion: 100, topics: [] },
          ],
          lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    ],
  }
}

export default function MyCoursesPage() {
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [loading, setLoading] = useState(true)
  const [currentCourses, setCurrentCourses] = useState<Course[]>([])
  const [pastCourses, setPastCourses] = useState<Course[]>([])
  const [filterStatus, setFilterStatus] = useState<"all" | "in-progress" | "completed">("all")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { currentCourses, pastCourses } = await getMyCourses()
        setCurrentCourses(currentCourses)
        setPastCourses(pastCourses)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const navigateToCourseDetail = (courseId: number) => {
    router.push(`/my-courses/${courseId}`)
  }

  if (loading) {
    return <LoadingPage />
  }

  const filteredCurrentCourses =
    filterStatus === "all"
      ? currentCourses
      : currentCourses.filter((course) =>
          filterStatus === "in-progress" ? course.status === "in-progress" : course.status === "completed",
        )

  const filteredPastCourses =
    filterStatus === "all"
      ? pastCourses
      : pastCourses.filter((course) =>
          filterStatus === "completed" ? course.status === "completed" : course.status === "in-progress",
        )

  const hasFilteredCourses = filteredCurrentCourses.length > 0 || filteredPastCourses.length > 0

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex flex-col">
            <SectionTitle className="mb-2">My Courses</SectionTitle>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Track your progress and continue learning
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-opacity-10 bg-blue-500">
            <Filter className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className={`text-sm font-medium bg-transparent border-none focus:ring-0 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <option value="all">All Courses</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {!hasFilteredCourses && (
          <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
            <div className="flex flex-col items-center justify-center">
              <div className={`p-4 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-blue-50"} mb-4`}>
                <Book className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                No courses found
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {filterStatus === "all"
                  ? "You haven't enrolled in any courses yet."
                  : `You don't have any ${filterStatus === "in-progress" ? "in-progress" : "completed"} courses.`}
              </p>
              <Button variant={isDarkMode ? "gradient" : "primary"}>Browse Available Courses</Button>
            </div>
          </div>
        )}

        {filteredCurrentCourses.length > 0 && (
          <div className="mb-10">
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Current Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCurrentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigateToCourseDetail(course.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        )}

        {filteredPastCourses.length > 0 && (
          <div>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Past Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPastCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigateToCourseDetail(course.id)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CourseCardProps {
  course: Course
  onClick: () => void
  isDarkMode: boolean
}

function CourseCard({ course, onClick, isDarkMode }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDarkMode ? "bg-slate-800 hover:bg-slate-750" : "bg-white hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={course.image || "/placeholder.svg?query=swimming lesson"}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-medium">{course.level}</div>
            {course.status === "in-progress" ? (
              <div className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> In Progress
              </div>
            ) : (
              <div className="px-2 py-1 rounded-full bg-green-600 text-white text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Completed
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold text-white">{course.title}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={course.instructorImage || "/placeholder.svg?query=swim instructor"}
              alt={course.instructor}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{course.instructor}</p>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Instructor</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Progress</span>
            <span className={`text-sm font-medium ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
              {course.progress?.overallCompletion || 0}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
            <div
              className={`h-2 rounded-full ${
                course.progress?.overallCompletion === 100
                  ? isDarkMode
                    ? "bg-green-500"
                    : "bg-green-600"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600"
              }`}
              style={{ width: `${course.progress?.overallCompletion || 0}%` }}
            ></div>
          </div>
        </div>

        <div className={`flex items-center justify-between ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span>{course.schedule}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${
              isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            } transition-colors`}
          >
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
