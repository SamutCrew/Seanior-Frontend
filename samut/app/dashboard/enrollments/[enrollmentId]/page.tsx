"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  User,
  Calendar,
  BarChart2,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  AlertTriangle,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"
import Image from "next/image"
import { getInstructorEnrollments } from "@/api/enrollment_api"
import {
  getEnrollmentProgress,
  createSessionProgress,
  updateSessionProgress,
  deleteSessionProgress,
} from "@/api/progress_api"
import { getEnrollmentAttendance, recordAttendance, updateAttendance } from "@/api/attendance_api"
import type { EnrollmentWithDetails } from "@/types/enrollment"
import type { SessionProgress } from "@/types/progress"
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance"
import SessionProgressModal from "@/components/StudentProgress/SessionProgressModal"
import AttendanceModal from "@/components/StudentProgress/AttendanceModal"
import type { SkillAssessment } from "@/components/StudentProgress/ProgressTracker"
import { Toast } from "@/components/Responseback/Toast"
import { auth } from "@/lib/firebase"

export default function EnrollmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.enrollmentId as string
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [activeTab, setActiveTab] = useState("progress")
  const [currentEnrollment, setCurrentEnrollment] = useState<EnrollmentWithDetails | null>(null)
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<SessionProgress | null>(null)
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false)
  const [skills, setSkills] = useState<SkillAssessment[]>([])
  const [progressTrackerTab, setProgressTrackerTab] = useState<"progress" | "sessions">("progress")
  const [error, setError] = useState<string | null>(null)
  const [attendanceError, setAttendanceError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      if (!enrollmentId || !isAuthenticated) return

      setIsLoading(true)
      setError(null)
      setAttendanceError(null)

      try {
        // First try to get all instructor enrollments
        const enrollments = await getInstructorEnrollments()

        // Find the specific enrollment by ID
        const enrollment = enrollments.find((e) => e.enrollment_id === enrollmentId)

        if (!enrollment) {
          console.log("No enrollment found with ID:", enrollmentId)
          setError(`No enrollment found with ID: ${enrollmentId}`)
          setIsLoading(false)
          return
        }

        setCurrentEnrollment(enrollment)

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
  }, [enrollmentId, isAuthenticated])

  // Handle session edit
  const handleEditSession = (session: SessionProgress) => {
    setCurrentSession(session)
    setIsSessionModalOpen(true)
  }

  // Handle add new session
  const handleAddSession = () => {
    setCurrentSession(null)
    setIsSessionModalOpen(true)
  }

  // Handle session delete
  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSessionProgress(sessionId)

        // Update the session progress list
        setSessionProgress((prevSessions) =>
          prevSessions.filter((session) => session.session_progress_id !== sessionId),
        )

        Toast.success("Session deleted successfully")
      } catch (error) {
        console.error("Error deleting session:", error)
        Toast.error("Failed to delete session")
      }
    }
  }

  // Handle session save
  const handleSaveSession = async (sessionData: Partial<SessionProgress>) => {
    try {
      if (!currentEnrollment) {
        Toast.error("No enrollment selected")
        return
      }

      let updatedSession: SessionProgress

      if (sessionData.session_progress_id) {
        // Update existing session
        updatedSession = await updateSessionProgress(sessionData.session_progress_id, {
          sessionNumber: sessionData.session_number,
          topicCovered: sessionData.topic_covered,
          performanceNotes: sessionData.performance_notes,
          dateSession: sessionData.date_session,
        })

        // Update the session in the list
        setSessionProgress((prevSessions) =>
          prevSessions.map((session) =>
            session.session_progress_id === updatedSession.session_progress_id ? updatedSession : session,
          ),
        )

        Toast.success("Session updated successfully")
      } else {
        // Create new session
        updatedSession = await createSessionProgress(enrollmentId, {
          sessionNumber: sessionData.session_number || 1,
          topicCovered: sessionData.topic_covered || "",
          performanceNotes: sessionData.performance_notes || "",
          dateSession: sessionData.date_session || new Date().toISOString(),
        })

        // Add the new session to the list
        setSessionProgress((prevSessions) => [...prevSessions, updatedSession])

        // Update attendance count in the UI
        if (currentEnrollment) {
          const newAttendanceCount = currentEnrollment.actual_sessions_attended + 1

          // Update the current enrollment in the UI
          setCurrentEnrollment({
            ...currentEnrollment,
            actual_sessions_attended: newAttendanceCount,
          })
        }

        Toast.success("Session added successfully")
      }

      setIsSessionModalOpen(false)
      setCurrentSession(null)
    } catch (error) {
      console.error("Error saving session:", error)
      Toast.error("Failed to save session")
    }
  }

  // Handle attendance edit
  const handleEditAttendance = (attendance: AttendanceRecord) => {
    setCurrentAttendance(attendance)
    setIsAttendanceModalOpen(true)
  }

  // Handle add new attendance
  const handleAddAttendance = () => {
    setCurrentAttendance(null)
    setIsAttendanceModalOpen(true)
  }

  // Handle attendance delete
  const handleDeleteAttendance = async (attendanceId: string) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      setIsSubmitting(true)
      try {
        // Update the attendance list
        setAttendanceRecords((prevRecords) => prevRecords.filter((record) => record.attendance_id !== attendanceId))

        Toast.success("Attendance record deleted successfully")
      } catch (error) {
        console.error("Error deleting attendance record:", error)
        Toast.error("Failed to delete attendance record")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Handle attendance save
  const handleSaveAttendance = async (attendanceData: Partial<AttendanceRecord>) => {
    setIsSubmitting(true)
    try {
      if (!currentEnrollment) {
        Toast.error("No enrollment selected")
        return
      }

      let updatedAttendance: AttendanceRecord

      if (attendanceData.attendance_id) {
        // Update existing attendance
        updatedAttendance = await updateAttendance(enrollmentId, attendanceData.attendance_id, {
          sessionNumber: attendanceData.session_number,
          status: attendanceData.status as AttendanceStatus,
          reasonForAbsence: attendanceData.reason_for_absence || "",
          dateAttendance: attendanceData.date_attendance,
        })

        // Update the attendance in the list
        setAttendanceRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.attendance_id === updatedAttendance.attendance_id ? updatedAttendance : record,
          ),
        )

        Toast.success("Attendance record updated successfully")
      } else {
        // Create new attendance - format exactly as the API expects
        console.log("Creating new attendance with data:", {
          sessionNumber: attendanceData.session_number || 1,
          status: (attendanceData.status as AttendanceStatus) || "PRESENT",
          reasonForAbsence: attendanceData.reason_for_absence || "",
          dateAttendance: attendanceData.date_attendance || new Date().toISOString().split("T")[0],
        })

        updatedAttendance = await recordAttendance(enrollmentId, {
          sessionNumber: attendanceData.session_number || 1,
          status: (attendanceData.status as AttendanceStatus) || "PRESENT",
          reasonForAbsence: attendanceData.reason_for_absence || "",
          dateAttendance: attendanceData.date_attendance || new Date().toISOString().split("T")[0],
        })

        // Add the new attendance to the list
        setAttendanceRecords((prevRecords) => [...prevRecords, updatedAttendance])

        Toast.success("Attendance record added successfully")
      }

      setIsAttendanceModalOpen(false)
      setCurrentAttendance(null)
    } catch (error) {
      console.error("Error saving attendance:", error)
      Toast.error(`Failed to save attendance record: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"} p-6`}>
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold ml-2">Authentication Required</h1>
        </div>

        <div
          className={`p-8 text-center rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
          }`}
        >
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
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If error or no enrollment found, show empty state
  if (error || !currentEnrollment) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"} p-6`}>
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className={`p-2 rounded-full ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold ml-2">Enrollment Management</h1>
        </div>

        <div
          className={`p-8 text-center rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
          }`}
        >
          <p className="text-lg mb-4">{error || `No enrollment found with ID: ${enrollmentId}`}</p>
          <Button variant="gradient" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
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
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
      {/* Back button and page title */}
      <div
        className={`sticky top-0 z-30 ${
          isDarkMode ? "bg-slate-900 border-b border-slate-800" : "bg-white border-b border-gray-200"
        } shadow-sm`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Enrollment Details</h1>
          </div>

          {/* Manage button */}
          <Button variant="gradient" size="sm" onClick={() => setActiveTab("settings")}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Enrollment
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        className={`sticky top-14 z-20 ${
          isDarkMode ? "bg-slate-900 border-b border-slate-800" : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "progress"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-cyan-600 text-cyan-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Progress Tracking
            </button>
            <button
              onClick={() => setActiveTab("attendance")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "attendance"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-cyan-600 text-cyan-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "student"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-cyan-600 text-cyan-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Student Details
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "settings"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-cyan-600 text-cyan-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Enrollment Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Enrollment Summary - Always visible */}
        <div
          className={`mb-6 p-6 rounded-xl ${
            isDarkMode ? "bg-slate-800/80 shadow-sm" : "bg-gray-50 shadow-sm border border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"} mb-2`}>
                {currentEnrollment.request?.Course?.course_name || "Unnamed Course"}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    isDarkMode
                      ? "bg-cyan-900/30 text-cyan-300 border border-cyan-800"
                      : "bg-cyan-100 text-cyan-800 border border-cyan-200"
                  }`}
                >
                  {currentEnrollment.status}
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(currentEnrollment.start_date).toLocaleDateString()}
              </p>
              {currentEnrollment.end_date && (
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(currentEnrollment.end_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Sessions Completed:
                  </span>
                  <span className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {currentEnrollment.actual_sessions_attended} / {currentEnrollment.target_sessions_to_complete}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Maximum Sessions:
                  </span>
                  <span className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {currentEnrollment.max_sessions_allowed}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Overall Progress:
                  </span>
                  <span className={`font-bold ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                    {overallProgress}%
                  </span>
                </div>
                <div className={`w-full md:w-64 h-2 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                  <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "progress" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Progress Tracking</h2>
              <Button variant="gradient" size="sm" onClick={handleAddSession}>
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </div>

            {sessionProgress.length > 0 ? (
              <div
                className={`mb-6 rounded-xl ${
                  isDarkMode ? "bg-slate-800 overflow-hidden" : "bg-white border border-gray-200 overflow-hidden"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={isDarkMode ? "bg-slate-700" : "bg-gray-50"}>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Session #
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Date
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Topic
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Notes
                        </th>
                        <th
                          className={`px-6 py-3 text-right text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-gray-200"}`}>
                      {sessionProgress.map((session) => (
                        <tr
                          key={session.session_progress_id}
                          className={isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {session.session_number}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {formatDate(session.date_session)}
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {session.topic_covered}
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {session.performance_notes?.length > 50
                              ? `${session.performance_notes.substring(0, 50)}...`
                              : session.performance_notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditSession(session)}
                                className={
                                  isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-500"
                                }
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSession(session.session_progress_id)}
                                className={
                                  isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-500"
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className={`p-8 text-center rounded-lg border-2 border-dashed ${
                  isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
                } mb-6`}
              >
                <p className="text-lg mb-4">No session progress records found</p>
                <Button variant="gradient" onClick={handleAddSession}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Session
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "attendance" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Attendance Records
              </h2>
              <Button variant="gradient" size="sm" onClick={handleAddAttendance} disabled={isSubmitting}>
                <Plus className="w-4 h-4 mr-2" />
                Add Attendance
              </Button>
            </div>

            {/* API error message */}
            {attendanceError && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-red-900/30 border border-red-800 text-red-200"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
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
              <div
                className={`rounded-xl ${
                  isDarkMode
                    ? "bg-slate-800/80 shadow-sm overflow-hidden"
                    : "bg-white border border-gray-200 shadow-sm overflow-hidden"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={isDarkMode ? "bg-slate-700" : "bg-gray-50"}>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Session #
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Date
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Status
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Reason
                        </th>
                        <th
                          className={`px-6 py-3 text-right text-xs font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          } uppercase tracking-wider`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-gray-200"}`}>
                      {attendanceRecords.map((record) => (
                        <tr
                          key={record.attendance_id}
                          className={isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-gray-50"}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {record.session_number}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
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
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {record.reason_for_absence || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEditAttendance(record)}
                                className={
                                  isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-500"
                                }
                                disabled={isSubmitting}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteAttendance(record.attendance_id)}
                                className={
                                  isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-500"
                                }
                                disabled={isSubmitting}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div
                className={`p-8 text-center rounded-lg border-2 border-dashed ${
                  isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
                }`}
              >
                <p className="text-lg mb-4">No attendance records found</p>
                <Button variant="gradient" onClick={handleAddAttendance} disabled={isSubmitting}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Attendance Record
                </Button>
              </div>
            )}

            {/* Attendance Summary */}
            {attendanceRecords.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Present</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {attendanceRecords.filter((a) => a.status === "PRESENT").length}
                      </p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-green-500 opacity-80" />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Late</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {attendanceRecords.filter((a) => a.status === "LATE").length}
                      </p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-500 opacity-80" />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Absent</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {attendanceRecords.filter((a) => a.status === "ABSENT").length}
                      </p>
                    </div>
                    <XCircle className="w-10 h-10 text-red-500 opacity-80" />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Attendance Rate</p>
                      <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
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
                    <div
                      className={`w-10 h-10 rounded-full ${
                        isDarkMode ? "bg-slate-700" : "bg-gray-100"
                      } flex items-center justify-center`}
                    >
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

        {activeTab === "student" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Student Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Profile Card */}
              <div
                className={`p-6 rounded-xl ${
                  isDarkMode ? "bg-slate-800 shadow-sm" : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
                    <Image
                      src={
                        currentEnrollment.request?.student?.profile_img ||
                        "/placeholder.svg?height=128&width=128&query=student profile" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={currentEnrollment.request?.student?.name || "Student"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {currentEnrollment.request?.student?.name || "Unknown Student"}
                  </h3>

                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
                    {currentEnrollment.request?.student?.email || "No email provided"}
                  </p>

                  <div
                    className={`w-full p-4 rounded-lg ${
                      isDarkMode ? "bg-slate-700" : "bg-gray-50 border border-gray-200"
                    } mb-4`}
                  >
                    <h4 className={`font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Enrollment Info
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <span className="font-medium">Status:</span> {currentEnrollment.status}
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <span className="font-medium">Sessions Attended:</span>{" "}
                      {currentEnrollment.actual_sessions_attended} of {currentEnrollment.target_sessions_to_complete}
                    </p>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      <span className="font-medium">Max Sessions:</span> {currentEnrollment.max_sessions_allowed}
                    </p>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    View Full Profile
                  </Button>
                </div>
              </div>

              {/* Student Details */}
              <div className="col-span-2">
                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode ? "bg-slate-800 shadow-sm" : "bg-white border border-gray-200 shadow-sm"
                  } mb-6`}
                >
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Email</p>
                      <p className={isDarkMode ? "text-white" : "text-slate-900"}>
                        {currentEnrollment.request?.student?.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Phone</p>
                      <p className={isDarkMode ? "text-white" : "text-slate-900"}>+66 98 765 4321</p>
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>Address</p>
                      <p className={isDarkMode ? "text-white" : "text-slate-900"}>123 Main Street, Bangkok, Thailand</p>
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-1`}>
                        Emergency Contact
                      </p>
                      <p className={isDarkMode ? "text-white" : "text-slate-900"}>+66 91 234 5678 (Parent)</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl ${
                    isDarkMode ? "bg-slate-800 shadow-sm" : "bg-white border border-gray-200 shadow-sm"
                  }`}
                >
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Course History
                  </h3>
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50 border border-gray-200"}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className={`font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Introduction to Swimming
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Jan 2023 - Mar 2023
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 h-fit text-xs rounded-full ${
                            isDarkMode
                              ? "bg-green-900/30 text-green-300 border border-green-800"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          Completed
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50 border border-gray-200"}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className={`font-medium ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Intermediate Swimming Techniques
                          </p>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Apr 2023 - Present
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 h-fit text-xs rounded-full ${
                            isDarkMode
                              ? "bg-cyan-900/30 text-cyan-300 border border-cyan-800"
                              : "bg-cyan-100 text-cyan-800 border border-cyan-200"
                          }`}
                        >
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Enrollment Settings
              </h2>
              <Button variant="gradient" size="sm">
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-lg ${
                  isDarkMode
                    ? "bg-slate-800 border border-slate-700 shadow-sm"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Enrollment Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Status
                    </label>
                    <select
                      defaultValue={currentEnrollment.status}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Target Sessions to Complete
                    </label>
                    <input
                      type="number"
                      defaultValue={currentEnrollment.target_sessions_to_complete}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Maximum Sessions Allowed
                    </label>
                    <input
                      type="number"
                      defaultValue={currentEnrollment.max_sessions_allowed}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Actual Sessions Attended
                    </label>
                    <input
                      type="number"
                      defaultValue={currentEnrollment.actual_sessions_attended}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`p-6 rounded-lg ${
                  isDarkMode
                    ? "bg-slate-800 border border-slate-700 shadow-sm"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Dates and Schedule
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      defaultValue={new Date(currentEnrollment.start_date).toISOString().split("T")[0]}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      defaultValue={
                        currentEnrollment.end_date
                          ? new Date(currentEnrollment.end_date).toISOString().split("T")[0]
                          : ""
                      }
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Notes
                    </label>
                    <textarea
                      defaultValue={currentEnrollment.request?.notes || ""}
                      rows={4}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-slate-900 focus:border-cyan-600"
                      } focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Session Progress Modal */}
      <SessionProgressModal
        isOpen={isSessionModalOpen}
        onClose={() => {
          setIsSessionModalOpen(false)
          setCurrentSession(null)
        }}
        onSave={handleSaveSession}
        session={currentSession}
      />

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          setIsAttendanceModalOpen(false)
          setCurrentAttendance(null)
        }}
        onSave={handleSaveAttendance}
        attendance={currentAttendance}
        enrollmentId={enrollmentId}
      />
    </div>
  )
}
