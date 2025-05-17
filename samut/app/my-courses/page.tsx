"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Book,
  Filter,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  DollarSign,
  ClockIcon,
  AlertCircle,
  MapPin,
  Calendar,
  User,
} from "lucide-react"
import { useAppSelector } from "@/app/redux"
import { Button } from "@/components/Common/Button"
import { SectionTitle } from "@/components/Common/SectionTitle"
import LoadingPage from "@/components/Common/LoadingPage"
import CourseCard from "@/components/Course/CourseCard"
import { getStudentEnrollments } from "@/api/enrollment_api"
import { getMyRequests } from "@/api/course_request_api"
import { createCheckoutSession } from "@/api/payment_api"
import type { Course } from "@/types/course"
import type { EnrollmentWithDetails, RequestedSlot } from "@/types/enrollment"
import type { CourseRequest } from "@/types/request"

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
        course_id: enrollment.request.course_id,
        title: enrollment.request.Course.course_name,
        course_name: enrollment.request.Course.course_name,
        focus: "Swimming techniques", // Default focus if not available
        level: "Intermediate", // Default level if not available
        duration: `${enrollment.target_sessions_to_complete || 8} sessions`,
        course_duration: enrollment.target_sessions_to_complete || 8,
        schedule: enrollment.request.requestedSlots
          ? formatRequestedSlotsToSchedule(enrollment.request.requestedSlots)
          : "Schedule not available",
        instructor_id: enrollment.request.Course.instructor_id || "",
        instructor: enrollment.request.Course.instructor_name || "Instructor",
        instructorImage: enrollment.request.Course.instructor_image || "/swimming-instructor-portrait.png",
        rating: 4.5, // Default rating if not available
        students: 10, // Default number of students if not available
        price: enrollment.request.request_price,
        location: {
          address: enrollment.request.request_location || "Location not specified",
        },
        courseType: "public-pool", // Default course type if not available
        pool_type: "public-pool",
        description: enrollment.request.Course.description || "No description available",
        study_frequency: 3,
        days_study: 3,
        number_of_total_sessions: enrollment.target_sessions_to_complete || 8,
        status: enrollment.status === "completed" ? "completed" : "in-progress",
        image: enrollment.request.Course.course_image || "/swimming-course.png",
        course_image: enrollment.request.Course.course_image || "/swimming-course.png",
        pool_image: enrollment.request.Course.pool_image || "/outdoor-swimming-pool.png",
        created_at: enrollment.created_at,
        updated_at: enrollment.updated_at,
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

// Helper function to format status labels for display
function formatStatusLabel(status: string): string {
  if (!status || status === "all") return "All Requests"

  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

type ActiveTab = "courses" | "requests"

export default function MyCoursesPage() {
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [loading, setLoading] = useState(true)
  const [currentCourses, setCurrentCourses] = useState<Course[]>([])
  const [pastCourses, setPastCourses] = useState<Course[]>([])
  const [courseRequests, setCourseRequests] = useState<CourseRequest[]>([])
  const [filterStatus, setFilterStatus] = useState<"all" | "in-progress" | "completed">("all")
  const [requestFilter, setRequestFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<ActiveTab>("courses")
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<{ id: string; message: string } | null>(null)

  // Pagination for requests
  const [currentPage, setCurrentPage] = useState(1)
  const requestsPerPage = 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch both enrollments and course requests in parallel
        const [coursesResult, requestsResult] = await Promise.all([getMyCourses(), getMyRequests()])

        setCurrentCourses(coursesResult.currentCourses)
        setPastCourses(coursesResult.pastCourses)
        setCourseRequests(requestsResult)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const navigateToCourseDetail = (courseId: string) => {
    router.push(`/my-courses/${courseId}`)
  }

  const handleMakePayment = async (requestId: string) => {
    try {
      setProcessingPaymentId(requestId)
      setPaymentError(null)

      // Call the payment API to create a checkout session
      const checkoutSession = await createCheckoutSession(requestId)

      // Redirect to the Stripe checkout URL
      window.location.href = checkoutSession.url
    } catch (error: any) {
      console.error("Payment error:", error)
      setPaymentError({
        id: requestId,
        message:
          "Unable to process payment at this time. Our payment system is currently undergoing maintenance. Please try again later.",
      })
    } finally {
      setProcessingPaymentId(null)
    }
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

  // Filter and search requests
  const filteredRequests = courseRequests.filter((request) => {
    // Status filter
    if (requestFilter !== "all" && request.status !== requestFilter) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        request.Course.course_name.toLowerCase().includes(query) ||
        (request.Course.instructor?.name || "").toLowerCase().includes(query) ||
        request.request_location.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest)
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage)

  // Get unique status values for filter
  const statusOptions = ["all", ...new Set(courseRequests.map((request) => request.status))]

  const hasFilteredCourses = filteredCurrentCourses.length > 0 || filteredPastCourses.length > 0
  const hasPendingRequests = courseRequests.length > 0

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex flex-col">
            <SectionTitle className="mb-2">My Courses</SectionTitle>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Track your progress and continue learning
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`mb-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("courses")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "courses"
                  ? isDarkMode
                    ? "border-blue-400 text-blue-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Current Courses
              {currentCourses.length > 0 && (
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === "courses"
                      ? isDarkMode
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-600"
                      : isDarkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {currentCourses.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "requests"
                  ? isDarkMode
                    ? "border-blue-400 text-blue-400"
                    : "border-blue-600 text-blue-600"
                  : isDarkMode
                    ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Course Requests
              {courseRequests.length > 0 && (
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === "requests"
                      ? isDarkMode
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-600"
                      : isDarkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {courseRequests.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Course Requests View */}
        {activeTab === "requests" && (
          <div className="mb-10">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className={`flex-1 relative rounded-md shadow-sm ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1) // Reset to first page on new search
                  }}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="Search by course name, instructor, or location"
                />
              </div>

              <div
                className={`flex items-center gap-2 p-2 rounded-md ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
              >
                <Filter className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                <select
                  value={requestFilter}
                  onChange={(e) => {
                    setRequestFilter(e.target.value)
                    setCurrentPage(1) // Reset to first page on filter change
                  }}
                  className={`text-sm font-medium bg-transparent border-none focus:ring-0 focus:outline-none ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <option value="all">All Statuses</option>
                  {statusOptions
                    .filter((status) => status !== "all")
                    .map((status) => (
                      <option key={status} value={status}>
                        {formatStatusLabel(status)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Request Cards */}
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {currentRequests.map((request) => (
                  <RequestCard
                    key={request.request_id}
                    request={request}
                    isDarkMode={isDarkMode}
                    onMakePayment={handleMakePayment}
                    isProcessingPayment={processingPaymentId === request.request_id}
                    paymentError={paymentError?.id === request.request_id ? paymentError.message : null}
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    className="flex items-center justify-between border-t pt-4 mt-6 
                    border-gray-700"
                  >
                    <div className="flex-1 flex justify-between sm:hidden">
                      <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant={isDarkMode ? "outline" : "secondary"}
                        size="sm"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant={isDarkMode ? "outline" : "secondary"}
                        size="sm"
                      >
                        Next
                      </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                          Showing <span className="font-medium">{indexOfFirstRequest + 1}</span> to{" "}
                          <span className="font-medium">{Math.min(indexOfLastRequest, filteredRequests.length)}</span>{" "}
                          of <span className="font-medium">{filteredRequests.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                              isDarkMode
                                ? "border-gray-700 bg-slate-800 text-gray-400 hover:bg-slate-700"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            } ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" />
                          </button>

                          {/* Page numbers */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === page
                                  ? isDarkMode
                                    ? "bg-slate-700 border-gray-700 text-white"
                                    : "bg-blue-50 border-blue-500 text-blue-600"
                                  : isDarkMode
                                    ? "border-gray-700 bg-slate-800 text-gray-400 hover:bg-slate-700"
                                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                              isDarkMode
                                ? "border-gray-700 bg-slate-800 text-gray-400 hover:bg-slate-700"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            } ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`rounded-lg p-8 text-center ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
                <div className="flex flex-col items-center justify-center">
                  <div className={`p-4 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-blue-50"} mb-4`}>
                    <AlertCircle className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    No requests found
                  </h3>
                  <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {searchQuery
                      ? "No requests match your search criteria"
                      : requestFilter !== "all"
                        ? `No requests with status: ${formatStatusLabel(requestFilter)}`
                        : "You haven't made any course requests yet"}
                  </p>
                  <Button variant={isDarkMode ? "gradient" : "primary"}>Browse Available Courses</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Courses View */}
        {activeTab === "courses" && (
          <>
            <div className="flex justify-end mb-4">
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
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Current Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCurrentCourses.map((course) => (
                    <EnhancedCourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigateToCourseDetail(course.course_id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredPastCourses.length > 0 && (
              <div>
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Past Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPastCourses.map((course) => (
                    <EnhancedCourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigateToCourseDetail(course.course_id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
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

function EnhancedCourseCard({ course, onClick, isDarkMode }: CourseCardProps) {
  // Format schedule for display
  const formatSchedule = (schedule: any) => {
    if (typeof schedule === "string") {
      try {
        schedule = JSON.parse(schedule)
      } catch (e) {
        return { days: [], times: [] }
      }
    }

    // Extract days and times from schedule
    const days: string[] = []
    const times: { day: string; ranges: { start: string; end: string }[] }[] = []

    if (schedule && typeof schedule === "object") {
      Object.entries(schedule).forEach(([day, value]: [string, any]) => {
        if (value.selected) {
          days.push(day.charAt(0).toUpperCase() + day.slice(1))

          if (value.ranges && Array.isArray(value.ranges)) {
            times.push({
              day: day.charAt(0).toUpperCase() + day.slice(1),
              ranges: value.ranges,
            })
          }
        }
      })
    }

    return { days, times }
  }

  const { days, times } = formatSchedule(course.schedule)

  return (
    <div
      onClick={onClick}
      className={`rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-[1.02] ${
        isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <Image
          src={course.course_image || `/placeholder.svg?height=300&width=400&query=swimming course ${course.course_id}`}
          alt={course.title || course.course_name}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform hover:scale-110 duration-500"
        />

        {/* Level Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isDarkMode ? "bg-amber-700 text-amber-100" : "bg-amber-100 text-amber-800"
            }`}
          >
            {course.level || "Intermediate"}
          </span>
        </div>

        {/* Status Tag */}
        <div className="absolute top-3 right-3 z-20">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              course.status === "in-progress"
                ? isDarkMode
                  ? "bg-blue-700 text-blue-100"
                  : "bg-blue-100 text-blue-800"
                : isDarkMode
                  ? "bg-green-700 text-green-100"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {course.status === "in-progress" ? "in-progress" : "completed"}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {course.title || course.course_name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(course.rating || 4.5) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className={`ml-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {course.rating || 4.5}
          </span>
          <span className={`mx-2 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>•</span>
          <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            ฿{course.price?.toLocaleString()}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-2">
          <MapPin className={`w-4 h-4 mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            {typeof course.location === "object" && course.location?.address
              ? typeof course.location.address === "string"
                ? course.location.address
                : JSON.stringify(course.location.address) === "[object Object]"
                  ? "Location not specified"
                  : typeof course.location.address === "object"
                    ? `${course.location.address.address || ""}, ${course.location.address.city || ""}`
                    : JSON.stringify(course.location.address)
              : typeof course.location === "string"
                ? course.location
                : "Location not specified"}
          </p>
        </div>

        {/* Schedule */}
        <div className="flex items-start gap-2 mb-2">
          <Calendar className={`w-4 h-4 mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          <div>
            <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {times.map((time, index) => (
                <div key={index} className="mb-1">
                  <span className="font-medium">{time.day}:</span>
                  {time.ranges.map((range, i) => (
                    <span key={i} className="ml-1">
                      {range.start} - {range.end}
                      {i < time.ranges.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Course duration: {course.course_duration || 8} sessions
            </div>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {course.instructorImage ? (
              <Image
                src={course.instructorImage || "/placeholder.svg"}
                alt={typeof course.instructor === "string" ? course.instructor : "Instructor"}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <User className="w-4 h-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
            )}
          </div>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>Instructor</p>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {typeof course.instructor === "string" ? course.instructor : "Instructor"}
            </p>
          </div>
        </div>

        {/* Progress Bar for in-progress courses */}
        {course.status === "in-progress" && course.progress && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Progress</span>
              <span className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {course.progress.overallCompletion}%
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${course.progress.overallCompletion}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface RequestCardProps {
  request: CourseRequest
  isDarkMode: boolean
  onMakePayment?: (requestId: string) => void
  isProcessingPayment?: boolean
  paymentError?: string | null
}

function RequestCard({ request, isDarkMode, onMakePayment, isProcessingPayment, paymentError }: RequestCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get status info (color, icon, and display text)
  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase()

    if (statusLower.includes("paid_and_enrolled")) {
      return {
        color: isDarkMode ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        text: "Enrolled",
        description: "You are enrolled in this course",
      }
    } else if (statusLower.includes("rejected")) {
      return {
        color: isDarkMode ? "bg-red-800 text-red-200" : "bg-red-100 text-red-800",
        icon: <X className="w-4 h-4" />,
        text: "Rejected",
        description: "Your request was rejected by the instructor",
      }
    } else if (statusLower.includes("approved_pending_payment")) {
      return {
        color: isDarkMode ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800",
        icon: <DollarSign className="w-4 h-4" />,
        text: "Payment Required",
        description: "Approved - Waiting for payment",
      }
    } else if (statusLower.includes("pending_approval")) {
      return {
        color: isDarkMode ? "bg-yellow-800 text-yellow-200" : "bg-yellow-100 text-yellow-800",
        icon: <ClockIcon className="w-4 h-4" />,
        text: "Pending",
        description: "Waiting for instructor approval",
      }
    } else {
      return {
        color: isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800",
        icon: <AlertCircle className="w-4 h-4" />,
        text: formatStatusLabel(status),
        description: "Request status",
      }
    }
  }

  const statusInfo = getStatusInfo(request.status)

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
      <div className={`px-4 py-3 ${statusInfo.color} flex items-center gap-2`}>
        {statusInfo.icon}
        <div>
          <span className="font-semibold">{statusInfo.text}</span>
          <span className="text-xs ml-2 opacity-90">{statusInfo.description}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {request.Course.course_name}
            </h3>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <User className={`w-3 h-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Instructor:</span> {request.Course.instructor?.name || "Instructor"}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <MapPin className={`w-3 h-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Location:</span> {request.request_location}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <DollarSign className={`w-3 h-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Price:</span> ฿{request.request_price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                >
                  <Clock className={`w-3 h-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </span>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  <span className="font-medium">Schedule:</span>{" "}
                  {request.requestedSlots
                    ?.map((slot) => `${slot.dayOfWeek}, ${slot.startTime} - ${slot.endTime}`)
                    .join("; ") || "Schedule not available"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 md:mt-0 md:text-right">
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Requested on {formatDate(request.created_at)}
            </div>

            {request.status === "APPROVED_PENDING_PAYMENT" && (
              <div className="flex flex-col">
                <Button
                  variant={isDarkMode ? "gradient" : "primary"}
                  size="sm"
                  className="mt-2"
                  onClick={() => onMakePayment && onMakePayment(request.request_id)}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Make Payment
                    </div>
                  )}
                </Button>

                {paymentError && (
                  <div
                    className={`text-sm mt-2 p-2 rounded ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-50 text-red-600"}`}
                  >
                    {paymentError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
