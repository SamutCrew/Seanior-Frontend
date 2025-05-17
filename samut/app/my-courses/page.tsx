"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Book, Filter } from "lucide-react"
import { useAppSelector } from "@/app/redux"
import { Button } from "@/components/Common/Button"
import { SectionTitle } from "@/components/Common/SectionTitle"
import LoadingPage from "@/components/Common/LoadingPage"
import CourseCard from "@/components/Course/CourseCard"
import { getStudentEnrollments } from "@/api/enrollment_api"
import type { Course } from "@/types/course"
import type { EnrollmentWithDetails, RequestedSlot } from "@/types/enrollment"

// Real API call to get user's enrollments
const getMyCourses = async (): Promise<{
  currentCourses: Course[]
  pastCourses: Course[]
}> => {
  try {
    // Fetch enrollments from the API
    const enrollments = await getStudentEnrollments()

    // Transform enrollments into course data
    const currentCourses: Course[] = []
    const pastCourses: Course[] = []

    enrollments.forEach((enrollment) => {
      if (!enrollment.request?.Course) return

      const course: Course = {
        id: enrollment.request.course_id,
        title: enrollment.request.Course.course_name,
        focus: "Swimming techniques", // Default focus if not available
        level: "Intermediate", // Default level if not available
        duration: `${enrollment.target_sessions_to_complete || 8} sessions`,
        schedule: enrollment.request.requestedSlots
          ? formatRequestedSlotsToSchedule(enrollment.request.requestedSlots)
          : "Schedule not available",
        instructor: enrollment.request.Course.instructor_name || "Instructor",
        instructorImage: "/placeholder-8oza2.png",
        rating: 4.5, // Default rating if not available
        students: 10, // Default number of students if not available
        price: enrollment.request.request_price,
        location: {
          address: enrollment.request.request_location || "Location not specified",
        },
        courseType: "public-pool", // Default course type if not available
        status: enrollment.status === "completed" ? "completed" : "in-progress",
        image: "/swimming-lesson.png",
        progress: {
          overallCompletion: calculateProgress(enrollment),
          modules: [],
          lastUpdated: enrollment.updated_at,
        },
      }

      if (enrollment.status === "completed") {
        pastCourses.push(course)
      } else {
        currentCourses.push(course)
      }
    })

    return { currentCourses, pastCourses }
  } catch (error) {
    console.error("Failed to fetch enrollments:", error)
    // Return empty arrays if there's an error
    return { currentCourses: [], pastCourses: [] }
  }
}

// Helper function to calculate progress percentage
const calculateProgress = (enrollment: EnrollmentWithDetails): number => {
  if (enrollment.target_sessions_to_complete === 0) return 0

  const progress = Math.round((enrollment.actual_sessions_attended / enrollment.target_sessions_to_complete) * 100)

  return Math.min(progress, 100) // Cap at 100%
}

// Helper function to format requested slots into a schedule object
const formatRequestedSlotsToSchedule = (slots: RequestedSlot[]): any => {
  const schedule: Record<string, any> = {}

  slots.forEach((slot) => {
    const day = slot.dayOfWeek.toLowerCase()
    if (!schedule[day]) {
      schedule[day] = {
        selected: true,
        ranges: [],
      }
    }

    schedule[day].ranges.push({
      start: slot.startTime,
      end: slot.endTime,
    })
  })

  return schedule
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
                <CourseCardItem
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
                <CourseCardItem
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

function CourseCardItem({ course, onClick, isDarkMode }: CourseCardProps) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <CourseCard course={course} variant="standard" />
    </div>
  )
}
