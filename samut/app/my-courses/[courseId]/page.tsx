"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  BarChart2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LogIn,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"
import Image from "next/image"
import { getStudentEnrollments } from "@/api/enrollment_api"
import { getEnrollmentProgress } from "@/api/progress_api"
import { getEnrollmentAttendance } from "@/api/attendance_api"
import type { EnrollmentWithDetails } from "@/types/enrollment"
import type { SessionProgress } from "@/types/progress"
import type { AttendanceRecord } from "@/types/attendance"
import type { SkillAssessment } from "@/components/StudentProgress/ProgressTracker"
import { Toast } from "@/components/Responseback/Toast"
import { auth } from "@/lib/firebase"
import LeaveRequestModal from "@/components/StudentProgress/LeaveRequestModal"
import EnrollmentSummary from "@/components/StudentProgress/EnrollmentSummary"

export default function StudentEnrollmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [activeTab, setActiveTab] = useState("progress")
  const [currentEnrollment, setCurrentEnrollment] = useState<EnrollmentWithDetails | null>(null)
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false)
  const [skills, setSkills] = useState<SkillAssessment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [attendanceError, setAttendanceError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (!user) {
        setError("You must be logged in to view this page")
      }
    })

    return () => unsubscribe()
  }, [])

  // Fetch enrollment and session progress data
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !isAuthenticated) return

      setIsLoading(true)
      setError(null)
      setAttendanceError(null)

      try {
        // Get all student enrollments
        const enrollments = await getStudentEnrollments()

        // Find the enrollment for this course
        const enrollment = enrollments.find((e) => e.request?.Course?.course_id === courseId)

        if (!enrollment) {
          console.log("No enrollment found for course:", courseId)
          setError(`No enrollment found for this course. You may not be enrolled yet.`)
          setIsLoading(false)
          return
        }

        setCurrentEnrollment(enrollment)
        const enrollmentId = enrollment.enrollment_id

        // Generate skills based on the course type or other data
        // This would ideally come from your API, but we're generating it here for demonstration
        const courseType = enrollment.request?.Course?.course_type || "general"

        if (courseType.includes("swim")) {
          setSkills([
            { id: "skill-1", name: "Technique", progress: 70, description: "Overall swimming technique" },
            { id: "skill-2", name: "Endurance", progress: 65, description: "Ability to swim for extended periods" },
            { id: "skill-3", name: "Speed", progress: 55, description: "Swimming speed and pace" },
            { id: "skill-4", name: "Form", progress: 80, description: "Proper body position and movement" },
          ])
        } else if (courseType.includes("language")) {
          setSkills([
            { id: "skill-1", name: "Speaking", progress: 65, description: "Verbal communication skills" },
            { id: "skill-2", name: "Listening", progress: 70, description: "Comprehension of spoken language" },
            { id: "skill-3", name: "Reading", progress: 80, description: "Comprehension of written language" },
            { id: "skill-4", name: "Writing", progress: 60, description: "Written expression skills" },
          ])
        } else {
          setSkills([
            { id: "skill-1", name: "Knowledge", progress: 75, description: "Understanding of course material" },
            { id: "skill-2", name: "Application", progress: 60, description: "Ability to apply concepts" },
            { id: "skill-3", name: "Participation", progress: 85, description: "Engagement in class activities" },
            { id: "skill-4", name: "Homework", progress: 70, description: "Completion and quality of assignments" },
          ])
        }

        // Fetch session progress for this enrollment
        try {
          const progressData = await getEnrollmentProgress(enrollmentId)
          setSessionProgress(progressData)
        } catch (progressError) {
          console.error("Error fetching session progress:", progressError)
          Toast.error("Failed to load session progress data")
          setSessionProgress([])
        }

        // Fetch attendance records
        setIsLoadingAttendance(true)
        try {
          const attendanceData = await getEnrollmentAttendance(enrollmentId)
          console.log("Attendance data received:", attendanceData)
          setAttendanceRecords(attendanceData)
        } catch (attendanceError) {
          console.error("Error fetching attendance records:", attendanceError)
          setAttendanceError(
            `Failed to load attendance data: ${
              attendanceError instanceof Error ? attendanceError.message : "Unknown error"
            }`,
          )
          setAttendanceRecords([])
        } finally {
          setIsLoadingAttendance(false)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        Toast.error("Failed to load enrollment data")
        setError(`Failed to load enrollment data: ${error instanceof Error ? error.message : "Unknown error"}`)
        setCurrentEnrollment(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId, isAuthenticated])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle login redirect
  const handleLogin = () => {
    router.push("/auth/Login?redirect=" + encodeURIComponent(window.location.pathname))
  }

  // Handle leave request submission
  const handleLeaveRequest = async (data: { date: string; reason: string }) => {
    try {
      // This would normally call an API to submit the leave request
      console.log("Submitting leave request:", data)

      // Mock API call success
      Toast.success("Leave request submitted successfully")
      setIsLeaveModalOpen(false)
    } catch (error) {
      console.error("Error submitting leave request:", error)
      Toast.error("Failed to submit leave request")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push(`/my-courses/${courseId}`)}
            className="p-2 rounded-full hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold ml-2">Authentication Required</h1>
        </div>

        <div className="p-8 text-center rounded-lg border-2 border-dashed border-slate-700 text-gray-400">
          <p className="text-lg mb-4">You must be logged in to view enrollment details</p>
          <Button variant="gradient" onClick={handleLogin}>
            <LogIn className="w-4 h-4 mr-2" />
            Log In
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If error or no enrollment found, show empty state
  if (error || !currentEnrollment) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push(`/my-courses/${courseId}`)}
            className="p-2 rounded-full hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold ml-2">Enrollment Details</h1>
        </div>

        <div className="p-8 text-center rounded-lg border-2 border-dashed border-slate-700 text-gray-400">
          <p className="text-lg mb-4">{error || `No enrollment found for this course`}</p>
          <Button variant="gradient" onClick={() => router.push(`/my-courses/${courseId}`)}>
            Return to Course
          </Button>
        </div>
      </div>
    )
  }

  // Calculate overall progress
  const overallProgress =
    currentEnrollment.target_sessions_to_complete > 0
      ? Math.min(
          100,
          Math.round(
            (currentEnrollment.actual_sessions_attended / currentEnrollment.target_sessions_to_complete) * 100,
          ),
        )
      : 0

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Back button and page title */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/my-courses/${courseId}`)}
              className="p-2 rounded-full hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">My Enrollment Details</h1>
          </div>

          {/* Request Leave button */}
          <Button variant="gradient" size="sm" onClick={() => setIsLeaveModalOpen(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Request Leave
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-14 z-20 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "progress"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Progress Tracking
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "attendance"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </button>
            <button
              onClick={() => setActiveTab("course")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "course"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Course Details
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "contact"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Instructor
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Enrollment Summary - Always visible */}
        <EnrollmentSummary enrollment={currentEnrollment} />

        {activeTab === "progress" && (
          <div>
            <div className="flex justify-between items-center mb-6 mt-6">
              <h2 className="text-xl font-bold text-white">Progress Tracking</h2>
            </div>

            {sessionProgress.length > 0 ? (
              <div className="mb-6 rounded-xl bg-slate-800 overflow-hidden">
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
                          Topic
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {sessionProgress.map((session) => (
                        <tr key={session.session_progress_id} className="hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {session.session_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(session.date_session)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{session.topic_covered}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {session.performance_notes?.length > 50
                              ? `${session.performance_notes.substring(0, 50)}...`
                              : session.performance_notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-lg border-2 border-dashed border-slate-700 text-gray-400 mb-6">
                <p className="text-lg mb-4">No session progress records found yet</p>
                <p>Your instructor will update your progress after each session</p>
              </div>
            )}

            {/* Skills section */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4 text-white">Skills Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">{skill.name}</h4>
                      <span className="text-cyan-400 font-medium">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-400">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div>
            <div className="flex justify-between items-center mb-6 mt-6">
              <h2 className="text-xl font-bold text-white">Attendance Records</h2>
            </div>

            {/* API error message */}
            {attendanceError && (
              <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-200">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Error loading attendance data</p>
                    <p className="text-sm mt-1">{attendanceError}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoadingAttendance ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : attendanceRecords.length > 0 ? (
              <div className="rounded-xl bg-slate-800/80 shadow-sm overflow-hidden">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {attendanceRecords.map((record) => (
                        <tr key={record.attendance_id} className="hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{record.session_number}</td>
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
                          <td className="px-6 py-4 text-sm text-gray-300">{record.reason_for_absence || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-lg border-2 border-dashed border-slate-700 text-gray-400">
                <p className="text-lg mb-4">No attendance records found yet</p>
                <p>Your attendance will be recorded after each session</p>
              </div>
            )}

            {/* Attendance Summary */}
            {attendanceRecords.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Present</p>
                      <p className="text-2xl font-bold text-white">
                        {attendanceRecords.filter((a) => a.status === "PRESENT").length}
                      </p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Late</p>
                      <p className="text-2xl font-bold text-white">
                        {attendanceRecords.filter((a) => a.status === "LATE").length}
                      </p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-500 opacity-80" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Absent</p>
                      <p className="text-2xl font-bold text-white">
                        {attendanceRecords.filter((a) => a.status === "ABSENT").length}
                      </p>
                    </div>
                    <XCircle className="w-10 h-10 text-red-500 opacity-80" />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
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
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <div
                        className="w-8 h-8 rounded-full border-4 border-green-500"
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
                          transition: "transform 1s ease-in-out",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "course" && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-white mb-6">Course Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-white">Course Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Course Name</p>
                    <p className="text-white">{currentEnrollment.request?.Course?.course_name || "Unnamed Course"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Instructor</p>
                    <p className="text-white">{currentEnrollment.request?.Course?.instructor_name || "Not Assigned"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location</p>
                    <p className="text-white">{currentEnrollment.request?.request_location || "Not Specified"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Schedule</p>
                    <div className="space-y-2">
                      {currentEnrollment.request?.requestedSlots?.map((slot, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-white capitalize">{slot.dayOfWeek.toLowerCase()}: </span>
                          <span className="text-white ml-2">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      )) || <p className="text-white">No schedule information</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-white">Enrollment Information</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <p className="text-white capitalize">{currentEnrollment.status}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Start Date</p>
                    <p className="text-white">{formatDate(currentEnrollment.start_date)}</p>
                  </div>

                  {currentEnrollment.end_date && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">End Date</p>
                      <p className="text-white">{formatDate(currentEnrollment.end_date)}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Sessions</p>
                    <p className="text-white">
                      {currentEnrollment.actual_sessions_attended} of {currentEnrollment.target_sessions_to_complete}{" "}
                      completed (Maximum: {currentEnrollment.max_sessions_allowed})
                    </p>
                  </div>

                  {currentEnrollment.request?.request_price && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Course Price</p>
                      <p className="text-white">฿{currentEnrollment.request.request_price.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes section */}
            {currentEnrollment.request?.notes && (
              <div className="mt-6 p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-white">Notes</h3>
                <p className="text-gray-300 whitespace-pre-line">{currentEnrollment.request.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "contact" && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-white mb-6">Send Absense</h2>

            <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-sm">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500">
                  <Image
                    src={"/Teacher3.jpg"}
                    alt={currentEnrollment.request?.Course?.instructor_name || "Instructor"}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Max tenison
                  </h3>

                  <p className="text-gray-400 mb-4">
                    Send a message to your instructor about any questions or concerns regarding your course.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Subject</label>
                      <select className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                        <option value="question">Question about course</option>
                        <option value="reschedule">Request to reschedule</option>
                        <option value="materials">Course materials</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">Message</label>
                      <textarea
                        rows={4}
                        placeholder="Type your message here..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      ></textarea>
                    </div>

                    <Button variant="gradient">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveRequest}
        enrollmentId={currentEnrollment.enrollment_id}
      />
    </div>
  )
}
