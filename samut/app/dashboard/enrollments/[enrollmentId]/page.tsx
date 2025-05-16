"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, User, Calendar, BarChart2, Settings, CheckCircle, XCircle, Clock } from "lucide-react"
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
import type { EnrollmentWithDetails } from "@/types/enrollment"
import type { SessionProgress } from "@/types/progress"
import SessionProgressModal from "@/components/StudentProgress/SessionProgressModal"
import ProgressTracker, { type SkillAssessment } from "@/components/StudentProgress/ProgressTracker"
import { Toast } from "@/components/Responseback/Toast"

// Mock attendance data
const MOCK_ATTENDANCE = [
  { date: "2023-05-01", status: "present", notes: "Arrived on time" },
  { date: "2023-05-08", status: "present", notes: "Participated actively" },
  { date: "2023-05-15", status: "absent", notes: "Sick leave" },
  { date: "2023-05-22", status: "present", notes: "Arrived 5 minutes late" },
  { date: "2023-05-29", status: "late", notes: "Arrived 15 minutes late" },
  { date: "2023-06-05", status: "present", notes: "Excellent participation" },
  { date: "2023-06-12", status: "present", notes: "Completed all exercises" },
  { date: "2023-06-19", status: "upcoming", notes: "" },
  { date: "2023-06-26", status: "upcoming", notes: "" },
]

export default function EnrollmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const enrollmentId = params.enrollmentId as string
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [activeTab, setActiveTab] = useState("progress")
  const [currentEnrollment, setCurrentEnrollment] = useState<EnrollmentWithDetails | null>(null)
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([])
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<SessionProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [skills, setSkills] = useState<SkillAssessment[]>([])
  const [progressTrackerTab, setProgressTrackerTab] = useState<"progress" | "sessions">("progress")
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE)
  const [editingAttendanceIndex, setEditingAttendanceIndex] = useState<number | null>(null)
  const [attendanceNote, setAttendanceNote] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "late" | "upcoming">("present")

  // Fetch enrollment and session progress data
  useEffect(() => {
    const fetchData = async () => {
      if (!enrollmentId) return

      setIsLoading(true)
      try {
        // Fetch all enrollments for the instructor
        const enrollmentsData = await getInstructorEnrollments()

        // Find the specific enrollment by ID
        const enrollment = enrollmentsData.find((e) => e.enrollment_id === enrollmentId)

        if (!enrollment) {
          console.log("No enrollment found with ID:", enrollmentId)
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
      } catch (error) {
        console.error("Error fetching data:", error)
        Toast.error("Failed to load enrollment data")
        setCurrentEnrollment(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [enrollmentId])

  // Handle session edit
  const handleEditSession = (session: SessionProgress) => {
    setCurrentSession(session)
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
          session_number: sessionData.session_number,
          topic_covered: sessionData.topic_covered,
          performance_notes: sessionData.performance_notes,
          date_session: sessionData.date_session,
        })

        // Update the session in the list
        setSessionProgress((prevSessions) =>
          prevSessions.map((session) =>
            session.session_progress_id === updatedSession.session_progress_id ? updatedSession : session,
          ),
        )
      } else {
        // Create new session
        updatedSession = await createSessionProgress(enrollmentId, {
          session_number: sessionData.session_number || 1,
          topic_covered: sessionData.topic_covered || "",
          performance_notes: sessionData.performance_notes || "",
          date_session: sessionData.date_session || new Date().toISOString(),
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
      }

      setIsSessionModalOpen(false)
      setCurrentSession(null)
      Toast.success("Session saved successfully")
    } catch (error) {
      console.error("Error saving session:", error)
      Toast.error("Failed to save session")
    }
  }

  // Handle attendance edit
  const handleEditAttendance = (index: number) => {
    setEditingAttendanceIndex(index)
    setAttendanceStatus(attendance[index].status as any)
    setAttendanceNote(attendance[index].notes)
  }

  // Handle attendance save
  const handleSaveAttendance = () => {
    if (editingAttendanceIndex === null) return

    const updatedAttendance = [...attendance]
    updatedAttendance[editingAttendanceIndex] = {
      ...updatedAttendance[editingAttendanceIndex],
      status: attendanceStatus,
      notes: attendanceNote,
    }

    setAttendance(updatedAttendance)
    setEditingAttendanceIndex(null)
    setAttendanceNote("")
    Toast.success("Attendance updated successfully")
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If no enrollment found, show empty state
  if (!currentEnrollment) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/dashboard")} className="p-2 rounded-full hover:bg-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold ml-2">Enrollment Management</h1>
        </div>

        <div className="p-8 text-center rounded-lg border-2 border-dashed border-slate-700 text-gray-400">
          <p className="text-lg mb-4">No enrollment found with ID: {enrollmentId}</p>
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
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Back button and page title */}
      <div className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.push("/dashboard")} className="p-2 rounded-full hover:bg-slate-800">
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
              onClick={() => setActiveTab("student")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "student"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Student Details
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "settings"
                  ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
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
        <div className="mb-6 p-6 rounded-xl bg-slate-800/80 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                {currentEnrollment.request?.Course?.course_name || "Unnamed Course"}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-xs rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-800">
                  {currentEnrollment.status}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(currentEnrollment.start_date).toLocaleDateString()}
              </p>
              {currentEnrollment.end_date && (
                <p className="text-sm text-gray-400">
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(currentEnrollment.end_date).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Sessions Completed:</span>
                  <span className="font-bold text-white">
                    {currentEnrollment.actual_sessions_attended} / {currentEnrollment.target_sessions_to_complete}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400">Maximum Sessions:</span>
                  <span className="font-bold text-white">{currentEnrollment.max_sessions_allowed}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-400">Overall Progress:</span>
                  <span className="font-bold text-cyan-400">{overallProgress}%</span>
                </div>
                <div className="w-full md:w-64 h-2 rounded-full bg-slate-700">
                  <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "progress" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Progress Tracking</h2>
            </div>

            {/* Use the ProgressTracker component */}
            <ProgressTracker
              overallProgress={overallProgress}
              lastUpdated={new Date().toISOString()}
              skills={skills}
              isEditable={true}
              sessions={sessionProgress}
              onEditSession={handleEditSession}
              onDeleteSession={handleDeleteSession}
              enrollmentId={enrollmentId}
              activeTab={progressTrackerTab}
              onTabChange={setProgressTrackerTab}
            />
          </div>
        )}

        {activeTab === "attendance" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Attendance Records</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-400">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-xs text-gray-400">Late</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs text-gray-400">Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                  <span className="text-xs text-gray-400">Upcoming</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {attendance.map((record, index) => (
                      <tr key={index} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(record.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingAttendanceIndex === index ? (
                            <select
                              value={attendanceStatus}
                              onChange={(e) => setAttendanceStatus(e.target.value as any)}
                              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                            >
                              <option value="present">Present</option>
                              <option value="late">Late</option>
                              <option value="absent">Absent</option>
                              <option value="upcoming">Upcoming</option>
                            </select>
                          ) : (
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${
                                  record.status === "present"
                                    ? "bg-green-500"
                                    : record.status === "late"
                                      ? "bg-yellow-500"
                                      : record.status === "absent"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                }`}
                              ></div>
                              <span className="text-sm capitalize">{record.status}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {editingAttendanceIndex === index ? (
                            <input
                              type="text"
                              value={attendanceNote}
                              onChange={(e) => setAttendanceNote(e.target.value)}
                              className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                              placeholder="Add notes..."
                            />
                          ) : (
                            record.notes || "-"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingAttendanceIndex === index ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setEditingAttendanceIndex(null)}
                                className="text-gray-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button onClick={handleSaveAttendance} className="text-cyan-400 hover:text-cyan-300">
                                Save
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditAttendance(index)}
                              className="text-cyan-400 hover:text-cyan-300"
                              disabled={record.status === "upcoming"}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Present</p>
                    <p className="text-2xl font-bold text-white">
                      {attendance.filter((a) => a.status === "present").length}
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
                      {attendance.filter((a) => a.status === "late").length}
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
                      {attendance.filter((a) => a.status === "absent").length}
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
                      {Math.round(
                        (attendance.filter((a) => a.status === "present").length /
                          attendance.filter((a) => a.status !== "upcoming").length) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <div
                      className="w-8 h-8 rounded-full border-4 border-green-500"
                      style={{
                        borderRightColor: "transparent",
                        transform: `rotate(${
                          (attendance.filter((a) => a.status === "present").length /
                            attendance.filter((a) => a.status !== "upcoming").length) *
                          360
                        }deg)`,
                        transition: "transform 1s ease-in-out",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Progress Visualization */}
            <div className="mt-6 p-6 rounded-xl bg-slate-800 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-white">Session Progress</h3>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Sessions Completed</span>
                  <span className="text-sm font-medium text-white">
                    {currentEnrollment.actual_sessions_attended} of {currentEnrollment.target_sessions_to_complete}
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{
                      width: `${(currentEnrollment.actual_sessions_attended / currentEnrollment.target_sessions_to_complete) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Maximum Sessions</span>
                  <span className="text-sm font-medium text-white">
                    {currentEnrollment.actual_sessions_attended} of {currentEnrollment.max_sessions_allowed}
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{
                      width: `${(currentEnrollment.actual_sessions_attended / currentEnrollment.max_sessions_allowed) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-10 gap-2 mt-6">
                {Array.from({ length: currentEnrollment.target_sessions_to_complete }).map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                      index < currentEnrollment.actual_sessions_attended
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "student" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Student Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Profile Card */}
              <div className="p-6 rounded-xl bg-slate-800 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
                    <Image
                      src={
                        currentEnrollment.request?.student?.profile_img ||
                        "/placeholder.svg?height=128&width=128&query=student profile" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={currentEnrollment.request?.student?.name || "Student"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {currentEnrollment.request?.student?.name || "Unknown Student"}
                  </h3>

                  <p className="text-sm text-gray-400 mb-4">
                    {currentEnrollment.request?.student?.email || "No email provided"}
                  </p>

                  <div className="w-full p-4 rounded-lg bg-slate-700 mb-4">
                    <h4 className="font-medium mb-2 text-gray-200">Enrollment Info</h4>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Status:</span> {currentEnrollment.status}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Sessions Attended:</span>{" "}
                      {currentEnrollment.actual_sessions_attended} of {currentEnrollment.target_sessions_to_complete}
                    </p>
                    <p className="text-sm text-gray-300">
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
                <div className="p-6 rounded-xl bg-slate-800 shadow-sm mb-6">
                  <h3 className="text-lg font-bold mb-4 text-white">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Email</p>
                      <p className="text-white">{currentEnrollment.request?.student?.email || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Phone</p>
                      <p className="text-white">+66 98 765 4321</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Address</p>
                      <p className="text-white">123 Main Street, Bangkok, Thailand</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Emergency Contact</p>
                      <p className="text-white">+66 91 234 5678 (Parent)</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-800 shadow-sm">
                  <h3 className="text-lg font-bold mb-4 text-white">Course History</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-700">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-white">Introduction to Swimming</p>
                          <p className="text-sm text-gray-400">Jan 2023 - Mar 2023</p>
                        </div>
                        <span className="px-2 py-1 h-fit text-xs rounded-full bg-green-900/30 text-green-300 border border-green-800">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-700">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-white">Intermediate Swimming Techniques</p>
                          <p className="text-sm text-gray-400">Apr 2023 - Present</p>
                        </div>
                        <span className="px-2 py-1 h-fit text-xs rounded-full bg-cyan-900/30 text-cyan-300 border border-cyan-800">
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
              <h2 className="text-xl font-bold text-white">Enrollment Settings</h2>
              <Button variant="gradient" size="sm">
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-white">Enrollment Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
                    <select
                      defaultValue={currentEnrollment.status}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Target Sessions to Complete</label>
                    <input
                      type="number"
                      defaultValue={currentEnrollment.target_sessions_to_complete}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Maximum Sessions Allowed</label>
                    <input
                      type="number"
                      defaultValue={currentEnrollment.max_sessions_allowed}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Actual Sessions Attended</label>
                    <input
                      type="number"
                      defaultValue={currentEnrollment.actual_sessions_attended}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-white">Dates and Schedule</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Start Date</label>
                    <input
                      type="date"
                      defaultValue={new Date(currentEnrollment.start_date).toISOString().split("T")[0]}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">End Date</label>
                    <input
                      type="date"
                      defaultValue={
                        currentEnrollment.end_date
                          ? new Date(currentEnrollment.end_date).toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Notes</label>
                    <textarea
                      defaultValue={currentEnrollment.request?.notes || ""}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
    </div>
  )
}
