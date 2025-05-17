"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"
import { getStudentEnrollments, getEnrollmentById } from "@/api/enrollment_api"
import { getEnrollmentProgress } from "@/api/progress_api"
import { getEnrollmentAttendance } from "@/api/attendance_api"
import type { EnrollmentWithDetails } from "@/types/enrollment"
import type { SessionProgress } from "@/types/progress"
import type { AttendanceRecord } from "@/types/attendance"
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  MapPin,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart2,
  ChevronRight,
  FileText,
  MessageCircle,
  Star,
} from "lucide-react"

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [enrollment, setEnrollment] = useState<EnrollmentWithDetails | null>(null)
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("overview")

  // Fetch enrollment and related data
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return

      setIsLoading(true)
      setError(null)

      try {
        // Get all student enrollments
        const enrollments = await getStudentEnrollments()

        // Find the enrollment for this course
        const courseEnrollment = enrollments.find((e) => e.request?.Course?.course_id === courseId)

        if (!courseEnrollment) {
          setError("Enrollment not found for this course")
          setIsLoading(false)
          return
        }

        // Once we have the enrollment ID, we can fetch the detailed enrollment data
        try {
          const detailedEnrollment = await getEnrollmentById(courseEnrollment.enrollment_id)
          setEnrollment(detailedEnrollment)
        } catch (enrollmentError) {
          console.error("Error fetching detailed enrollment:", enrollmentError)
          // Fall back to the basic enrollment data if detailed fetch fails
          setEnrollment(courseEnrollment)
        }

        // Fetch session progress for this enrollment
        try {
          const progressData = await getEnrollmentProgress(courseEnrollment.enrollment_id)
          setSessionProgress(progressData)
        } catch (progressError) {
          console.error("Error fetching session progress:", progressError)
          setSessionProgress([])
        }

        // Fetch attendance records
        try {
          const attendanceData = await getEnrollmentAttendance(courseEnrollment.enrollment_id)
          setAttendanceRecords(attendanceData)
        } catch (attendanceError) {
          console.error("Error fetching attendance records:", attendanceError)
          setAttendanceRecords([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load course details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format short date
  const formatShortDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!enrollment) return 0
    return Math.min(
      100,
      Math.round((enrollment.actual_sessions_attended / enrollment.target_sessions_to_complete) * 100),
    )
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-800"
      case "completed":
        return "bg-blue-900/30 text-blue-300 border-blue-800"
      case "paused":
        return "bg-amber-900/30 text-amber-300 border-amber-800"
      case "cancelled":
        return "bg-red-900/30 text-red-300 border-red-800"
      default:
        return "bg-slate-900/30 text-slate-300 border-slate-800"
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400">Loading course details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !enrollment) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-xl bg-slate-800 shadow text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-amber-500 flex items-center justify-center rounded-full bg-amber-900/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{error || "Course Not Found"}</h2>
            <p className="mb-6 text-gray-400">
              {error
                ? "We encountered an error while loading your course data. Please try again later."
                : "We couldn't find the course you're looking for. It may have been removed or you don't have access to it."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = calculateProgress()
  const course = enrollment.request?.Course

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80">
        <Image
          src={course?.course_image || "/placeholder.svg?height=320&width=1200&query=swimming pool"}
          alt={course?.course_name || "Course"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full uppercase border ${getStatusColor(enrollment.status)}`}
                  >
                    {enrollment.status}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full uppercase bg-slate-800 text-gray-300 border border-slate-700">
                    {course?.level || "Beginner"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{course?.course_name || "Unnamed Course"}</h1>
                <p className="text-gray-300">{course?.description || "No description available"}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <Star className="w-5 h-5 text-gray-600" />
                  <span className="ml-2 text-white font-medium">4.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-700">
                    <Image
                      src={course?.instructor?.profile_img || "/placeholder.svg?height=32&width=32&query=instructor"}
                      alt="Instructor"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-gray-300">
                    Instructor:{" "}
                    {typeof course?.instructor === "object"
                      ? course?.instructor?.name
                      : course?.instructor || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeSection === "overview"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("progress")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeSection === "progress"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              My Progress
            </button>
            <button
              onClick={() => setActiveSection("schedule")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeSection === "schedule"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveSection("materials")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeSection === "materials"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Materials
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* Progress Summary */}
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4">Your Progress</h3>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Overall Completion</span>
                      <span className="font-bold text-cyan-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-700">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-300">Sessions Completed</span>
                      </div>
                      <p className="text-xl font-bold">
                        {enrollment.actual_sessions_attended} / {enrollment.target_sessions_to_complete}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-300">Next Session</span>
                      </div>
                      <p className="text-lg font-medium">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {sessionProgress.slice(0, 3).map((session, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-cyan-900/60 flex items-center justify-center text-cyan-400 font-bold flex-shrink-0">
                          {session.session_number}
                        </div>
                        <div>
                          <p className="font-medium">{session.topic_covered || `Session ${session.session_number}`}</p>
                          <p className="text-sm text-gray-400">{formatShortDate(session.date_session)}</p>
                        </div>
                      </div>
                    ))}
                    {sessionProgress.length === 0 && (
                      <div className="p-3 bg-slate-700/50 rounded-lg text-center">
                        <p className="text-gray-400">No recent activity recorded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Course Information */}
              <div className="col-span-2 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-lg font-bold">Course Information</h3>
                </div>
                <div className="p-6">
                  <div className="prose prose-invert max-w-none">
                    <p>{course?.description || "No description available for this course."}</p>

                    <h4 className="text-lg font-medium mt-6 mb-3">What You'll Learn</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Proper swimming techniques and form</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Water safety and survival skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Different swimming strokes and their applications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Breathing techniques and endurance training</span>
                      </li>
                    </ul>

                    <h4 className="text-lg font-medium mt-6 mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Swimming attire (swimsuit, goggles, swim cap)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Towel and personal hygiene items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span>Basic comfort in water (for intermediate levels)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Course Details Sidebar */}
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold">Course Details</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">START DATE</p>
                          <p className="text-sm">{formatDate(enrollment.start_date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">DURATION</p>
                          <p className="text-sm">{course?.course_duration || 8} weeks</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">LOCATION</p>
                          <p className="text-sm">
                            {typeof course?.location === "object"
                              ? course?.location?.address
                              : course?.location || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">LEVEL</p>
                          <p className="text-sm">{course?.level || "Beginner"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">INSTRUCTOR</p>
                          <p className="text-sm">
                            {typeof course?.instructor === "object"
                              ? course?.instructor?.name
                              : course?.instructor || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold">Contact</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-700">
                        <Image
                          src={
                            typeof course?.instructor === "object"
                              ? course?.instructor?.profile_img ||
                                "/placeholder.svg?height=48&width=48&query=instructor"
                              : "/placeholder.svg?height=48&width=48&query=instructor"
                          }
                          alt="Instructor"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {typeof course?.instructor === "object"
                            ? course?.instructor?.name
                            : course?.instructor || "Your Instructor"}
                        </p>
                        <p className="text-sm text-gray-400">Swimming Coach</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm">Message</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm">Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        {activeSection === "progress" && (
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold">Progress Overview</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">Overall Completion</h4>
                    <span className="font-bold text-cyan-400">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-700">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-gray-400">Last updated: {formatDate(enrollment.updated_at)}</p>
                </div>

                {/* Skill Progress */}
                <div>
                  <h4 className="font-medium text-white mb-4">Skill Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Technique</span>
                        <span className="text-sm font-medium text-cyan-400">80%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "80%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Endurance</span>
                        <span className="text-sm font-medium text-cyan-400">65%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Speed</span>
                        <span className="text-sm font-medium text-cyan-400">50%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-300">Form</span>
                        <span className="text-sm font-medium text-cyan-400">70%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700">
                        <div className="h-2 rounded-full bg-cyan-500" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Records */}
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold">Session Records</h3>
              </div>
              <div className="p-4">
                {sessionProgress.length > 0 ? (
                  <div className="space-y-4">
                    {sessionProgress.map((session, index) => (
                      <div key={session.session_progress_id} className="bg-slate-700/50 p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-900/60 flex items-center justify-center text-cyan-400 font-bold">
                              {session.session_number}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">
                                {session.topic_covered || `Session ${session.session_number}`}
                              </h4>
                              <p className="text-xs text-gray-400">{formatDate(session.date_session)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 text-xs rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-800">
                              {session.skill_area || "General"}
                            </div>
                            <div className="px-2 py-1 text-xs rounded-full bg-purple-900/30 text-purple-300 border border-purple-800">
                              Level {session.proficiency_level || "3"}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">
                          {session.performance_notes ||
                            session.instructor_notes ||
                            "No notes recorded for this session."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart2 className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                    <h4 className="text-lg font-medium text-gray-400 mb-1">No Session Records</h4>
                    <p className="text-sm text-gray-500">No progress records have been added yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold">Attendance Summary</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Present</p>
                        <p className="text-2xl font-bold text-white">
                          {attendanceRecords.filter((a) => a.status === "PRESENT").length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500 opacity-80" />
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Late</p>
                        <p className="text-2xl font-bold text-white">
                          {attendanceRecords.filter((a) => a.status === "LATE").length}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-yellow-500 opacity-80" />
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Absent</p>
                        <p className="text-2xl font-bold text-white">
                          {attendanceRecords.filter((a) => a.status === "ABSENT").length}
                        </p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-500 opacity-80" />
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Attendance Rate</p>
                        <p className="text-2xl font-bold text-white">
                          {attendanceRecords.length > 0
                            ? Math.round(
                                (attendanceRecords.filter((a) => a.status === "PRESENT").length /
                                  attendanceRecords.length) *
                                  100,
                              )
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                        <div
                          className="w-6 h-6 rounded-full border-3 border-green-500"
                          style={{
                            borderRightColor: "transparent",
                            transform: `rotate(${
                              attendanceRecords.length > 0
                                ? (
                                    attendanceRecords.filter((a) => a.status === "PRESENT").length /
                                      attendanceRecords.length
                                  ) * 360
                                : 0
                            }deg)`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {attendanceRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-700">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Session #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {attendanceRecords.map((record) => (
                          <tr key={record.attendance_id} className="hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {record.session_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {formatDate(record.date_attendance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {record.status === "PRESENT" && (
                                  <>
                                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                                    <span className="text-sm">Present</span>
                                  </>
                                )}
                                {record.status === "ABSENT" && (
                                  <>
                                    <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                                    <span className="text-sm">Absent</span>
                                  </>
                                )}
                                {record.status === "LATE" && (
                                  <>
                                    <div className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></div>
                                    <span className="text-sm">Late</span>
                                  </>
                                )}
                                {record.status === "EXCUSED" && (
                                  <>
                                    <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                                    <span className="text-sm">Excused</span>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400">No attendance records available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Section */}
        {activeSection === "schedule" && (
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold">Course Schedule</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-medium text-white mb-4">Weekly Schedule</h4>
                  {enrollment.request?.requestedSlots && enrollment.request.requestedSlots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrollment.request.requestedSlots.map((slot, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-white capitalize">{slot.dayOfWeek.toLowerCase()}</p>
                              <p className="text-sm text-gray-400">
                                {slot.startTime} - {slot.endTime}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Location:{" "}
                                {typeof course?.location === "object"
                                  ? course?.location?.address
                                  : course?.location || "Not specified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-700/50 p-4 rounded-lg text-center">
                      <p className="text-gray-400">No schedule information available</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-white mb-4">Course Timeline</h4>
                  <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:h-full before:w-[2px] before:bg-slate-700 before:left-3">
                    <div className="relative">
                      <div className="absolute -left-8 w-6 h-6 rounded-full bg-cyan-900 border-2 border-cyan-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="font-medium text-white">Course Start</p>
                        <p className="text-sm text-gray-400">{formatDate(enrollment.start_date)}</p>
                        <p className="text-sm text-gray-300 mt-2">Introduction to course materials and objectives</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="font-medium text-white">Mid-Course Assessment</p>
                        <p className="text-sm text-gray-400">
                          {formatShortDate(
                            new Date(
                              new Date(enrollment.start_date).getTime() +
                                ((enrollment.course_duration || 8) * 7 * 24 * 60 * 60 * 1000) / 2,
                            ),
                          )}
                        </p>
                        <p className="text-sm text-gray-300 mt-2">Evaluation of progress and skill development</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                      </div>
                      <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="font-medium text-white">Course Completion</p>
                        <p className="text-sm text-gray-400">
                          {enrollment.end_date ? formatDate(enrollment.end_date) : "TBD"}
                        </p>
                        <p className="text-sm text-gray-300 mt-2">Final assessment and certification</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Materials Section */}
        {activeSection === "materials" && (
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-sm">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-bold">Course Materials</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-medium text-white mb-4">Required Equipment</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Swimming Goggles</p>
                        <p className="text-sm text-gray-400">Recommended: Anti-fog, UV protection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Swimsuit</p>
                        <p className="text-sm text-gray-400">Comfortable, athletic style recommended</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Swim Cap</p>
                        <p className="text-sm text-gray-400">Silicone or latex cap to keep hair dry</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Towel</p>
                        <p className="text-sm text-gray-400">Quick-dry towel recommended</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-4">Learning Resources</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileText className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Swimming Technique Guide</p>
                        <p className="text-sm text-gray-400">PDF document with detailed instructions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileText className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Water Safety Manual</p>
                        <p className="text-sm text-gray-400">Essential safety guidelines and procedures</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                      <FileText className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Training Schedule</p>
                        <p className="text-sm text-gray-400">Weekly progression plan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
