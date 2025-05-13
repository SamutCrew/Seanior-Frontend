"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa"
import TeacherHeader from "@/components/Partial/PageDashboard/TeacherHeader"
import TeacherStats from "@/components/Partial/PageDashboard/TeacherStats"
import CalendarView from "@/components/Partial/PageDashboard/CalendarView"
import RequestsPanel from "@/components/Partial/PageDashboard/RequestsPanel"
import TeachingSchedule from "@/components/Partial/PageDashboard/TeachingSchedule"
import AvailableCourses from "@/components/Partial/PageDashboard/AvailableCourses"
import CourseGrid from "@/components/Course/CourseGrid"
import CourseList from "@/components/Course/CourseList"
import CourseFilters from "@/components/Course/CourseFilters"
import CourseEmptyState from "@/components/Course/CourseEmptyState"
import CreateCourseModal from "@/components/Course/Modals/CreateCourseModal"
import EditCourseModal from "@/components/Course/Modals/EditCourseModal"
import DeleteCourseModal from "@/components/Course/Modals/DeleteCourseModal"
import type { ScheduleItem } from "@/types/schedule"
import type { Course, CourseType } from "@/types/course"
import { useAppSelector } from "@/app/redux"
import { getCoursesByUserId } from "@/api/course_api"
import { createCourse, updateCourse, deleteCourse } from "@/api/course_api"
import { useAuth } from "@/context/AuthContext"

export default function TeacherDashboard() {
  // Get user from Auth context - same as profile page
  const { user, refreshUser } = useAuth()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Schedule data
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: 1,
      date: "2023-06-01",
      day: "Monday",
      courses: [
        {
          id: 101,
          title: "Beginner Swimming",
          level: "Beginner",
          schedule: "9:00 AM - 10:30 AM",
          students: 8,
          maxStudents: 12,
          location: "Main Pool",
        },
        {
          id: 102,
          title: "Advanced Techniques",
          level: "Advanced",
          schedule: "4:00 PM - 5:30 PM",
          students: 6,
          maxStudents: 10,
          location: "Olympic Pool",
        },
      ],
    },
    {
      id: 2,
      date: "2023-06-02",
      day: "Tuesday",
      courses: [
        {
          id: 103,
          title: "Intermediate Stroke",
          level: "Intermediate",
          schedule: "10:00 AM - 11:30 AM",
          students: 10,
          maxStudents: 12,
          location: "Main Pool",
        },
      ],
    },
    {
      id: 3,
      date: "2023-06-03",
      day: "Wednesday",
      courses: [
        {
          id: 104,
          title: "Kids Swimming",
          level: "Beginner",
          schedule: "3:00 PM - 4:00 PM",
          students: 12,
          maxStudents: 15,
          location: "Kids Pool",
        },
      ],
    },
  ])

  // Available courses (not yet scheduled) - Added images
  const [availableCourses, setAvailableCourses] = useState<Course[]>([
    {
      id: 201,
      title: "Freestyle Mastery",
      focus: "Technique Improvement",
      level: "Intermediate",
      duration: "8 weeks",
      schedule: "Not Scheduled",
      instructor: "Emma Johnson",
      rating: 4.8,
      students: 0,
      price: 299,
      location: {
        address: "TBD",
      },
      courseType: "public-pool" as CourseType,
      maxStudents: 12,
      image: "/freestyle-swimming.png",
    },
    {
      id: 202,
      title: "Water Safety",
      focus: "Safety Fundamentals",
      level: "Beginner",
      duration: "6 weeks",
      schedule: "Not Scheduled",
      instructor: "Michael Chen",
      rating: 4.5,
      students: 0,
      price: 249,
      location: {
        address: "TBD",
      },
      courseType: "public-pool" as CourseType,
      maxStudents: 15,
      image: "/water-safety-swimming.png",
    },
    {
      id: 203,
      title: "Advanced Butterfly",
      focus: "Technique Mastery",
      level: "Advanced",
      duration: "10 weeks",
      schedule: "Not Scheduled",
      instructor: "Sophia Rodriguez",
      rating: 4.9,
      students: 0,
      price: 349,
      location: {
        address: "TBD",
      },
      courseType: "private-location" as CourseType,
      maxStudents: 8,
      image: "/butterfly-swimming.png",
    },
    {
      id: 204,
      title: "Breaststroke Technique",
      focus: "Stroke Improvement",
      level: "Intermediate",
      duration: "8 weeks",
      schedule: "Not Scheduled",
      instructor: "James Wilson",
      rating: 4.6,
      students: 0,
      price: 299,
      location: {
        address: "TBD",
      },
      courseType: "teacher-pool" as CourseType,
      maxStudents: 10,
      image: "/breaststroke-swimming.png",
    },
  ])

  // Course management data
  const [courses, setCourses] = useState<Course[]>([])

  // UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState("courses")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)

  // Simulated requests
  const [requests, setRequests] = useState([
    { id: 1, name: "John Doe", type: "Join Beginner Swimming", date: "2023-06-01" },
    { id: 2, name: "Jane Smith", type: "Schedule Change Request", date: "2023-06-02" },
  ])

  // Fetch courses when component mounts or user changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if user is available from Auth context
        if (!user || !user.user_id) {
          console.error("User not found in Auth context")
          setError("User not found. Please log in again.")
          setIsLoading(false)
          return
        }

        console.log("Fetching courses for user ID:", user.user_id)

        // Fetch courses with the user ID from Auth context
        const fetchedCourses = await getCoursesByUserId(user.user_id)

        if (!fetchedCourses || fetchedCourses.length === 0) {
          console.log("No courses found for user ID:", user.user_id)
          setCourses([])
          setIsLoading(false)
          return
        }

        console.log("Courses fetched successfully:", fetchedCourses)

        // Transform API data to match our Course type
        const formattedCourses: Course[] = fetchedCourses.map((course: any) => ({
          id: course.id || course.course_id,
          title: course.title || course.course_name,
          focus: course.focus || course.description?.substring(0, 30) || "Swimming Technique",
          level: course.level || "Beginner",
          duration: course.duration || `${course.course_duration || 8} weeks`,
          schedule: course.schedule || "TBD",
          instructor: course.instructor_name || user.name || "Instructor",
          instructorId: course.instructor_id || user.user_id,
          rating: course.rating || 4.5,
          students: course.students || course.enrolled_students || 0,
          price: course.price || 299,
          location: {
            address: course.location?.address || course.location || "Main Pool",
          },
          courseType: course.courseType || course.pool_type || "public-pool",
          description: course.description || "",
          curriculum: course.curriculum || [],
          requirements: course.requirements || [],
          maxStudents: course.maxStudents || course.max_students || 10,
          image: course.image || course.course_image || "/placeholder-course.png",
          // Add the missing fields from the API
          study_frequency: course.study_frequency || "2",
          days_study: course.days_study || 2,
          number_of_total_sessions: course.number_of_total_sessions || 16,
          course_image: course.course_image || course.image || "/placeholder-course.png",
        }))

        setCourses(formattedCourses)
        setIsLoading(false)
      } catch (err: any) {
        console.error("Failed to fetch courses:", err)
        setError(err.message || "Failed to fetch courses. Please try again.")
        setIsLoading(false)
      }
    }

    // Only fetch courses if user is available
    if (user) {
      fetchCourses()
    }
  }, [user])

  // Filter schedule items based on search term
  const filteredSchedule = schedule
    .map((day) => ({
      ...day,
      courses: day.courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.location.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((day) => day.courses.length > 0)

  // Filter courses based on search term and level
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.focus && course.focus.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true
    return matchesSearch && matchesLevel
  })

  // Course CRUD operations
  const handleAddCourse = async (newCourseData: Partial<Course>) => {
    try {
      // Get user ID from Auth context
      if (!user || !user.user_id) {
        throw new Error("User ID not found. Please login again.")
      }

      // Format the data for the API
      const courseDbData = {
        course_name: newCourseData.title,
        pool_type: newCourseData.courseType,
        location: newCourseData.location?.address,
        description: newCourseData.description,
        course_duration: Number.parseInt(newCourseData.duration?.split(" ")[0] || "8"),
        study_frequency: "2", // Default value as string
        days_study: 2, // Default value
        number_of_total_sessions: 16, // Default value
        image: newCourseData.image,
        level: newCourseData.level,
        max_students: newCourseData.maxStudents,
        price: newCourseData.price,
        rating: newCourseData.rating || 4.5,
        schedule: newCourseData.schedule,
        students: newCourseData.students || 0,
        instructor: {
          connect: {
            user_id: user.user_id,
          },
        },
      }

      // Call the API to create the course
      const response = await createCourse(courseDbData)

      // Format the response to match our Course type
      const newCourse: Course = {
        id: response.id || response.course_id,
        title: response.title || response.course_name,
        focus: response.focus || response.description?.substring(0, 30) || "Swimming Technique",
        level: response.level || "Beginner",
        duration: response.duration || `${response.course_duration || 8} weeks`,
        schedule: response.schedule || "TBD",
        instructor: response.instructor_name || user.name || "Instructor",
        instructorId: response.instructor_id || user.user_id,
        rating: response.rating || 4.5,
        students: response.students || 0,
        price: response.price || 299,
        location: {
          address: response.location?.address || response.location || "Main Pool",
        },
        courseType: response.courseType || response.pool_type || "public-pool",
        description: response.description || "",
        curriculum: response.curriculum || [],
        requirements: response.requirements || [],
        maxStudents: response.maxStudents || response.max_students || 10,
        image: response.image || response.course_image || "/placeholder-course.png",
        study_frequency: response.study_frequency || "2",
        days_study: response.days_study || 2,
        number_of_total_sessions: response.number_of_total_sessions || 16,
        course_image: response.course_image || response.image || "/placeholder-course.png",
      }

      setCourses([...courses, newCourse])
      setIsCreateModalOpen(false)
    } catch (error: any) {
      console.error("Error creating course:", error)
      alert(`Failed to create course: ${error.message}`)
    }
  }

  // Update the handleEditCourse function to properly format the data for the API
  const handleEditCourse = async (editedCourseData: Partial<Course>) => {
    try {
      if (!currentCourse) return

      // Get user ID from Auth context
      if (!user || !user.user_id) {
        throw new Error("User ID not found. Please login again.")
      }

      // Format the data for the API
      const courseDbData = {
        course_name: editedCourseData.title,
        pool_type: editedCourseData.courseType,
        location: editedCourseData.location?.address,
        description: editedCourseData.description,
        course_duration: Number.parseInt(editedCourseData.duration?.split(" ")[0] || "8"),
        study_frequency: typeof editedCourseData.study_frequency === "string" ? editedCourseData.study_frequency : "2", // Default value as string
        days_study: editedCourseData.days_study || 2,
        number_of_total_sessions: editedCourseData.number_of_total_sessions || 16,
        course_image: editedCourseData.course_image || editedCourseData.image,
        level: editedCourseData.level,
        max_students: editedCourseData.maxStudents,
        price: editedCourseData.price,
        rating: editedCourseData.rating || 4.5,
        schedule: editedCourseData.schedule,
        students: editedCourseData.students || 0,
        instructor: {
          connect: {
            user_id: user.user_id,
          },
        },
      }

      console.log("Sending update data to API:", courseDbData)

      // Call the API to update the course
      await updateCourse(currentCourse.id.toString(), courseDbData)

      // Update the local state immediately with the edited course data
      setCourses(
        courses.map((course) => {
          if (course.id === currentCourse.id) {
            // Create a merged object with both the original course and the edited data
            return {
              ...course,
              ...editedCourseData,
              // Make sure these specific fields are properly mapped
              title: editedCourseData.title || editedCourseData.course_name,
              courseType: editedCourseData.courseType || editedCourseData.pool_type,
              maxStudents: editedCourseData.maxStudents || editedCourseData.max_students,
              image: editedCourseData.image || editedCourseData.course_image,
            }
          }
          return course
        }),
      )

      // Add a success message
      console.log("Course updated successfully:", currentCourse.id)

      setIsEditModalOpen(false)
    } catch (error: any) {
      console.error("Error updating course:", error)
      alert(`Failed to update course: ${error.message}`)
    }
  }

  // Function to refresh courses data from the API
  const refreshCourses = async () => {
    try {
      setIsLoading(true)

      // Check if user is available from Auth context
      if (!user || !user.user_id) {
        console.error("User not found in Auth context")
        setError("User not found. Please log in again.")
        setIsLoading(false)
        return
      }

      console.log("Refreshing courses for user ID:", user.user_id)

      // Fetch courses with the user ID from Auth context
      const fetchedCourses = await getCoursesByUserId(user.user_id)

      if (!fetchedCourses || fetchedCourses.length === 0) {
        console.log("No courses found for user ID:", user.user_id)
        setCourses([])
        setIsLoading(false)
        return
      }

      console.log("Courses refreshed successfully:", fetchedCourses)

      // Transform API data to match our Course type
      const formattedCourses: Course[] = fetchedCourses.map((course: any) => ({
        id: course.id || course.course_id,
        title: course.title || course.course_name,
        focus: course.focus || course.description?.substring(0, 30) || "Swimming Technique",
        level: course.level || "Beginner",
        duration: course.duration || `${course.course_duration || 8} weeks`,
        schedule: course.schedule || "TBD",
        instructor: course.instructor_name || user.name || "Instructor",
        instructorId: course.instructor_id || user.user_id,
        rating: course.rating || 4.5,
        students: course.students || course.enrolled_students || 0,
        price: course.price || 299,
        location: {
          address: course.location?.address || course.location || "Main Pool",
        },
        courseType: course.courseType || course.pool_type || "public-pool",
        description: course.description || "",
        curriculum: course.curriculum || [],
        requirements: course.requirements || [],
        maxStudents: course.maxStudents || course.max_students || 10,
        image: course.image || course.course_image || "/placeholder-course.png",
        // Add the missing fields from the API
        study_frequency: course.study_frequency || "2",
        days_study: course.days_study || 2,
        number_of_total_sessions: course.number_of_total_sessions || 16,
        course_image: course.course_image || course.image || "/placeholder-course.png",
      }))

      setCourses(formattedCourses)
    } catch (err: any) {
      console.error("Failed to refresh courses:", err)
      setError(err.message || "Failed to refresh courses. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Updated handleDeleteCourse function to work with the backend API
  const handleDeleteCourse = async () => {
    try {
      if (!currentCourse) return

      // Reset any previous delete errors
      setDeleteError(null)

      // Show loading state
      setIsDeleting(true)

      console.log("Deleting course with ID:", currentCourse.id)

      // Call the API to delete the course
      await deleteCourse(currentCourse.id.toString())

      // Update the local state to remove the deleted course
      setCourses(courses.filter((course) => course.id !== currentCourse.id))

      // Close the modal
      setIsDeleteModalOpen(false)

      // Show success message
      alert("Course deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting course:", error)

      // Set the error message from the API
      setDeleteError(error.message || "Failed to delete course. Please try again.")

      // Check for specific error types to provide more helpful messages
      if (
        error.message.includes("Foreign key constraint violated") ||
        error.message.includes("bookings") ||
        error.message.includes("active bookings")
      ) {
        setDeleteError("This course has active bookings. Please cancel all bookings for this course first.")
      } else if (error.message.includes("not authorized") || error.message.includes("not allowed")) {
        setDeleteError("You don't have permission to delete this course.")
      } else if (error.message.includes("not found")) {
        setDeleteError("This course no longer exists.")
      }
    } finally {
      setIsDeleting(false)
    }
  }

  // Calculate stats for the create course modal
  const courseStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    avgRating:
      courses.length > 0
        ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
        : "0.0",
    totalRevenue: courses.reduce((sum, course) => sum + course.price * course.students, 0),
  }

  // Loading state
  if (isLoading && !isDeleting) {
    return (
      <div
        className={`p-6 ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50"} min-h-screen flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-lg font-medium">Loading your courses...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !isDeleting) {
    return (
      <div
        className={`p-6 ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50"} min-h-screen flex items-center justify-center`}
      >
        <div className="text-center max-w-md mx-auto">
          <div className="text-amber-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Courses</h2>
          <p className="mb-4">{error}</p>

          {/* Debug information */}
          <div className="mb-4 text-left p-4 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs overflow-auto max-h-40">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className={`${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
                  : "bg-sky-600 hover:bg-sky-700"
              } text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow`}
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/auth/Login")}
              className={`${
                isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300"
              } px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow`}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TeacherHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Stats Cards */}
        <TeacherStats schedule={schedule} availableCourses={availableCourses} />

        {/* Main Content Tabs */}
        <div className="mb-8">
          <div className={`flex border-b mb-6 ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === "courses"
                  ? isDarkMode
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-cyan-600 border-b-2 border-cyan-600"
                  : isDarkMode
                    ? "text-gray-400"
                    : "text-slate-600"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              <FaChalkboardTeacher /> My Courses
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === "schedule"
                  ? isDarkMode
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-cyan-600 border-b-2 border-cyan-600"
                  : isDarkMode
                    ? "text-gray-400"
                    : "text-slate-600"
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              <FaCalendarAlt /> Teaching Schedule
            </button>
            <button
              className={`px-4 py-2 font-medium flex items-center gap-2 ${
                activeTab === "available"
                  ? isDarkMode
                    ? "text-cyan-400 border-b-2 border-cyan-400"
                    : "text-cyan-600 border-b-2 border-cyan-600"
                  : isDarkMode
                    ? "text-gray-400"
                    : "text-slate-600"
              }`}
              onClick={() => setActiveTab("available")}
            >
              <FaPlus /> Available Courses
            </button>
          </div>

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
                      : "bg-sky-600 hover:bg-sky-700"
                  } text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow`}
                >
                  <FaPlus /> New Course
                </button>

                <div className="flex gap-4 w-full md:w-auto">
                  <CourseFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                    view={view}
                    setView={setView}
                  />
                </div>
              </div>

              {filteredCourses.length > 0 ? (
                view === "grid" ? (
                  <CourseGrid
                    courses={filteredCourses}
                    onEdit={(course) => {
                      setCurrentCourse(course)
                      setIsEditModalOpen(true)
                    }}
                    onDelete={(course) => {
                      setCurrentCourse(course)
                      setDeleteError(null)
                      setIsDeleteModalOpen(true)
                    }}
                  />
                ) : (
                  <CourseList
                    courses={filteredCourses}
                    onEdit={(course) => {
                      setCurrentCourse(course)
                      setIsEditModalOpen(true)
                    }}
                    onDelete={(course) => {
                      setCurrentCourse(course)
                      setDeleteError(null)
                      setIsDeleteModalOpen(true)
                    }}
                  />
                )
              ) : (
                <CourseEmptyState
                  hasAnyCourses={courses.length > 0}
                  onCreateCourse={() => setIsCreateModalOpen(true)}
                />
              )}
            </div>
          )}

          {/* Teaching Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Calendar View */}
              <CalendarView
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                filteredSchedule={filteredSchedule}
              />

              {/* Incoming Requests */}
              <RequestsPanel requests={requests} />

              {/* Teaching Schedule */}
              <div className="lg:col-span-3">
                <TeachingSchedule filteredSchedule={filteredSchedule} />
              </div>
            </div>
          )}

          {/* Available Courses Tab */}
          {activeTab === "available" && <AvailableCourses availableCourses={availableCourses} />}
        </div>
      </div>

      {/* Modals */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddCourse}
        stats={courseStats}
      />

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCourse}
        onSuccess={refreshCourses}
        course={currentCourse}
      />

      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCourse}
        course={currentCourse}
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  )
}
