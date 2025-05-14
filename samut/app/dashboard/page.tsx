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
import type { Course } from "@/types/course"
import { useAppSelector } from "@/app/redux"
import { useAuth } from "@/context/AuthContext"
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage,
  uploadPoolImage,
} from "@/api/course_api"
import { getUserResources } from "@/api/resource_api"
import LoadingPage from "@/components/Common/LoadingPage"
import AlertResponse from "@/components/Responseback/AlertResponse"

export default function TeacherDashboard() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const { user } = useAuth()

  // Data fetching state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resources, setResources] = useState<any[]>([])

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
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])

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

  // Fetch user resources
  useEffect(() => {
    const fetchUserResources = async () => {
      if (!user || !user.user_id) return

      try {
        const response = await getUserResources(user.user_id)
        console.log("User resources:", response)

        if (response && response.resources && Array.isArray(response.resources)) {
          setResources(response.resources)
        } else {
          console.warn("Unexpected resources response format:", response)
          setResources([])
        }
      } catch (err) {
        console.error("Error fetching user resources:", err)
        setResources([])
      }
    }

    if (user?.user_id) {
      fetchUserResources()
    }
  }, [user])

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || !user.user_id) {
        setError("User not authenticated")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Get all courses
        console.log("Fetching all courses for user:", user.user_id)
        const allCoursesResponse = await getAllCourses()

        // Safety check for API response
        if (!allCoursesResponse) {
          console.warn("API returned null or undefined response")
          setCourses([])
          setAvailableCourses([])
          setIsLoading(false)
          return
        }

        console.log("All courses response:", allCoursesResponse)

        // Filter courses by instructor ID - handle different API response formats
        let instructorCourses = []

        if (Array.isArray(allCoursesResponse)) {
          instructorCourses = allCoursesResponse.filter(
            (course) =>
              course &&
              (course.instructor_id === user.user_id ||
                (course.instructor && course.instructor.user_id === user.user_id)),
          )
        } else if (allCoursesResponse && Array.isArray(allCoursesResponse.data)) {
          instructorCourses = allCoursesResponse.data.filter(
            (course) =>
              course &&
              (course.instructor_id === user.user_id ||
                (course.instructor && course.instructor.user_id === user.user_id)),
          )
        } else {
          console.warn("Unexpected response format from courses API:", allCoursesResponse)
          instructorCourses = []
        }

        console.log("Filtered instructor courses:", instructorCourses)

        // Map API data to the format expected by the UI components
        const mappedCourses = instructorCourses
          .filter((course) => course) // Filter out any null/undefined courses
          .map((course) => {
            // Find matching images for this course
            const courseImage = resources.find(
              (img) =>
                img &&
                img.resource_type?.includes("image") &&
                img.resource_name?.includes(course.id || course.course_id),
            )

            return mapApiCourseToUiCourse(course, courseImage)
          })

        setCourses(mappedCourses)

        // Set available courses (courses with no students yet)
        const availableMappedCourses = mappedCourses.filter((course) => course.students === 0)
        setAvailableCourses(availableMappedCourses)
      } catch (err: any) {
        console.error("Error in fetchCourses:", err)
        setError(`Failed to fetch courses: ${err?.message || "Unknown error"}`)

        // Set empty arrays on error to prevent UI issues
        setCourses([])
        setAvailableCourses([])
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch courses if user is authenticated
    if (user?.user_id) {
      fetchCourses()
    }
  }, [user, resources])

  // Helper function to map API course data to UI course format
  const mapApiCourseToUiCourse = (apiCourse: any, courseImage?: any): Course => {
    try {
      // Format schedule if it's an object
      let scheduleStr = apiCourse.schedule || "Flexible schedule"
      if (typeof apiCourse.schedule === "object" && apiCourse.schedule !== null) {
        // Convert schedule object to string (e.g., "Monday, Wednesday, Friday")
        scheduleStr = Object.keys(apiCourse.schedule)
          .filter((day) => apiCourse.schedule[day])
          .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(", ")

        if (scheduleStr === "") {
          scheduleStr = "Flexible schedule"
        }
      }

      // Extract course ID - handle different API formats
      const courseId = apiCourse.course_id || apiCourse.id || "unknown"

      // Extract course name - handle different API formats
      const courseName = apiCourse.course_name || apiCourse.title || apiCourse.name || "Untitled Course"

      // Extract instructor information - handle different API formats
      let instructorName = "Unknown Instructor"
      let instructorId = apiCourse.instructor_id || ""

      if (apiCourse.instructor) {
        if (typeof apiCourse.instructor === "string") {
          instructorName = apiCourse.instructor
        } else if (typeof apiCourse.instructor === "object") {
          instructorName = apiCourse.instructor.name || apiCourse.instructor.user_name || "Unknown"
          instructorId = apiCourse.instructor.user_id || apiCourse.instructor.id || instructorId
        }
      }

      // Use resource URL if available
      const courseImageUrl = courseImage
        ? courseImage.resource_url
        : apiCourse.course_image || apiCourse.image || "/person-swimming.png"
      const poolImageUrl = apiCourse.pool_image || null

      // Create a course object that works with both the API and UI
      return {
        course_id: courseId,
        id: courseId, // Keep both for compatibility
        course_name: courseName,
        title: courseName, // Keep both for compatibility
        instructor_id: instructorId,
        focus: apiCourse.description?.substring(0, 30) || "Swimming techniques",
        price: apiCourse.price || 0,
        pool_type: apiCourse.pool_type || "public-pool",
        courseType: apiCourse.pool_type || "public-pool", // Keep both for compatibility
        location: apiCourse.location || "TBD",
        description: apiCourse.description || "",
        course_duration: apiCourse.course_duration || 8,
        duration: `${apiCourse.course_duration || 8} weeks`, // Keep both for compatibility
        study_frequency: apiCourse.study_frequency || 0,
        days_study: apiCourse.days_study || 0,
        number_of_total_sessions: apiCourse.number_of_total_sessions || 0,
        level: apiCourse.level || "Beginner",
        schedule: scheduleStr,
        rating: apiCourse.rating || 4.5,
        students: apiCourse.students || 0,
        max_students: apiCourse.max_students || 10,
        maxStudents: apiCourse.max_students || 10, // Keep both for compatibility
        course_image: courseImageUrl,
        image: courseImageUrl, // Keep both for compatibility
        pool_image: poolImageUrl,
        poolImage: poolImageUrl, // Keep both for compatibility
        instructor: instructorName,
        created_at: apiCourse.created_at || new Date().toISOString(),
        updated_at: apiCourse.updated_at || new Date().toISOString(),
      }
    } catch (err) {
      console.error("Error mapping course data:", err)
      // Return a fallback object with minimal required properties
      return {
        course_id: apiCourse.course_id || apiCourse.id || "unknown",
        id: apiCourse.course_id || apiCourse.id || "unknown",
        course_name: apiCourse.course_name || apiCourse.title || "Untitled Course",
        title: apiCourse.course_name || apiCourse.title || "Untitled Course",
        instructor_id: apiCourse.instructor_id || "",
        focus: "Swimming techniques",
        price: apiCourse.price || 0,
        pool_type: apiCourse.pool_type || "public-pool",
        courseType: apiCourse.pool_type || "public-pool",
        location: apiCourse.location || "TBD",
        description: apiCourse.description || "",
        course_duration: apiCourse.course_duration || 8,
        duration: `${apiCourse.course_duration || 8} weeks`,
        level: apiCourse.level || "Beginner",
        schedule: apiCourse.schedule || "Flexible schedule",
        rating: apiCourse.rating || 4.5,
        students: apiCourse.students || 0,
        max_students: apiCourse.max_students || 10,
        maxStudents: apiCourse.max_students || 10,
        course_image: apiCourse.course_image || apiCourse.image || "/person-swimming.png",
        image: apiCourse.course_image || apiCourse.image || "/person-swimming.png",
        instructor: "Unknown",
      }
    }
  }

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
    const courseTitle = course.title || course.course_name || ""
    const courseFocus = course.focus || course.description || ""

    const matchesSearch =
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseFocus.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = selectedLevel ? course.level === selectedLevel : true
    return matchesSearch && matchesLevel
  })

  // Course CRUD operations
  const handleAddCourse = async (newCourseData: Partial<Course>) => {
    try {
      setIsLoading(true)
      setError(null)

      // Extract image files from the form data
      const courseImageFile = newCourseData.courseImageFile as File | undefined
      const poolImageFile = newCourseData.poolImageFile as File | undefined

      // Remove file objects from the data before sending to API
      const apiCourseData = { ...newCourseData }
      delete apiCourseData.courseImageFile
      delete apiCourseData.poolImageFile

      // Format the data for the API
      const formattedData = {
        course_name: apiCourseData.course_name || "New Course",
        instructor_id: user?.user_id || "",
        price: apiCourseData.price || 0,
        pool_type: apiCourseData.pool_type || "public-pool",
        location: apiCourseData.location || "",
        description: apiCourseData.description || "",
        course_duration: apiCourseData.course_duration || 8,
        study_frequency: apiCourseData.study_frequency || "1",
        days_study: apiCourseData.days_study || 0,
        number_of_total_sessions: apiCourseData.number_of_total_sessions || 8,
        level: apiCourseData.level || "Beginner",
        schedule: apiCourseData.schedule || {},
        max_students: apiCourseData.max_students || 10,
      }

      console.log("Creating course with data:", formattedData)
      const response = await createCourse(formattedData)
      console.log("Create course response:", response)

      // Get the new course ID
      const newCourseId = response.course_id || response.id

      if (!newCourseId) {
        throw new Error("Failed to get course ID from response")
      }

      // Upload course image if provided
      let courseImageUrl = ""
      if (courseImageFile) {
        const imageResponse = await uploadCourseImage(newCourseId, courseImageFile)
        courseImageUrl = imageResponse.resource_url
      }

      // Upload pool image if provided
      let poolImageUrl = ""
      if (poolImageFile) {
        const imageResponse = await uploadPoolImage(newCourseId, poolImageFile)
        poolImageUrl = imageResponse.resource_url
      }

      // Map the new course to UI format with image URLs
      const newCourse = mapApiCourseToUiCourse({
        ...response,
        course_image: courseImageUrl,
        pool_image: poolImageUrl,
      })

      setCourses([newCourse, ...courses])

      // If the course has no students, add it to available courses
      if (newCourse.students === 0) {
        setAvailableCourses([newCourse, ...availableCourses])
      }

      setIsCreateModalOpen(false)

      // Show success message
      setSuccess("Course created successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("Error creating course:", err)
      setError(`Failed to create course: ${err.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCourse = async (editedCourseData: Partial<Course>) => {
    if (!currentCourse) {
      setError("No course selected for editing")
      return
    }

    const courseId = currentCourse.course_id || currentCourse.id
    if (!courseId) {
      setError("Course ID is missing")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Extract image files from the form data
      const courseImageFile = editedCourseData.courseImageFile as File | undefined
      const poolImageFile = editedCourseData.poolImageFile as File | undefined

      // Remove file objects from the data before sending to API
      const apiCourseData: Record<string, any> = { ...editedCourseData }
      delete apiCourseData.courseImageFile
      delete apiCourseData.poolImageFile

      console.log("Editing course with data:", apiCourseData)

      // Only include fields that have been changed
      const cleanedData: Record<string, any> = {}

      if (apiCourseData.course_name !== undefined) {
        cleanedData.course_name = apiCourseData.course_name
      }

      if (apiCourseData.price !== undefined) {
        cleanedData.price = apiCourseData.price
      }

      if (apiCourseData.pool_type !== undefined) {
        cleanedData.pool_type = apiCourseData.pool_type
      }

      if (apiCourseData.location !== undefined) {
        cleanedData.location = apiCourseData.location
      }

      if (apiCourseData.description !== undefined) {
        cleanedData.description = apiCourseData.description
      }

      if (apiCourseData.course_duration !== undefined) {
        cleanedData.course_duration = apiCourseData.course_duration
      }

      if (apiCourseData.study_frequency !== undefined) {
        cleanedData.study_frequency = apiCourseData.study_frequency
      }

      if (apiCourseData.days_study !== undefined) {
        cleanedData.days_study = apiCourseData.days_study
      }

      if (apiCourseData.number_of_total_sessions !== undefined) {
        cleanedData.number_of_total_sessions = apiCourseData.number_of_total_sessions
      }

      if (apiCourseData.level !== undefined) {
        cleanedData.level = apiCourseData.level
      }

      if (apiCourseData.schedule !== undefined) {
        cleanedData.schedule = apiCourseData.schedule
      }

      if (apiCourseData.max_students !== undefined) {
        cleanedData.max_students = apiCourseData.max_students
      }

      console.log("Sending API data:", cleanedData)
      const response = await updateCourse(courseId, cleanedData)
      console.log("Update course response:", response)

      // Upload course image if provided
      let courseImageUrl = currentCourse.course_image || currentCourse.image
      if (courseImageFile) {
        const imageResponse = await uploadCourseImage(courseId, courseImageFile)
        courseImageUrl = imageResponse.resource_url
      }

      // Upload pool image if provided
      let poolImageUrl = currentCourse.pool_image || currentCourse.poolImage
      if (poolImageFile) {
        const imageResponse = await uploadPoolImage(courseId, poolImageFile)
        poolImageUrl = imageResponse.resource_url
      }

      // Map the updated course to UI format
      const updatedCourse = mapApiCourseToUiCourse({
        ...currentCourse,
        ...response,
        instructor: currentCourse.instructor, // Preserve instructor info if not in response
        course_image: courseImageUrl,
        image: courseImageUrl,
        pool_image: poolImageUrl,
        poolImage: poolImageUrl,
      })

      // Update the course in the courses state
      setCourses(
        courses.map((course) => (course.course_id === courseId || course.id === courseId ? updatedCourse : course)),
      )

      // Update the course in available courses if needed
      setAvailableCourses(
        availableCourses.map((course) =>
          course.course_id === courseId || course.id === courseId ? updatedCourse : course,
        ),
      )

      setIsEditModalOpen(false)
      setError(null) // Clear any previous errors

      // Show success message
      setSuccess("Course updated successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("Error updating course:", err)
      setError(`Failed to update course: ${err.response?.data?.message || err.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCourse = async () => {
    if (!currentCourse) {
      setError("No course selected for deletion")
      return
    }

    const courseId = currentCourse.course_id || currentCourse.id
    if (!courseId) {
      setError("Course ID is missing")
      return
    }

    try {
      setIsLoading(true)

      await deleteCourse(courseId)

      // Remove the course from the courses state
      setCourses(courses.filter((course) => course.course_id !== courseId && course.id !== courseId))

      // Remove the course from available courses if needed
      setAvailableCourses(availableCourses.filter((course) => course.course_id !== courseId && course.id !== courseId))

      setIsDeleteModalOpen(false)

      // Show success message
      setSuccess("Course deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("Error deleting course:", err)
      setError(`Failed to delete course: ${err.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate stats for the create course modal
  const courseStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + (course.students || 0), 0),
    avgRating:
      courses.length > 0
        ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
        : "0.0",
    totalRevenue: courses.reduce((sum, course) => sum + (course.price || 0) * (course.students || 0), 0),
  }

  // Show loading state while fetching data
  if (isLoading && courses.length === 0) {
    return <LoadingPage />
  }

  return (
    <div className={`p-6 ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Error message */}
        {error && <AlertResponse type="error" message={error} onClose={() => setError(null)} />}

        {/* Success message */}
        {success && <AlertResponse type="success" message={success} onClose={() => setSuccess(null)} />}

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
                  <FaPlus /> Create New Course
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

              {isLoading && <div className="text-center py-8">Loading courses...</div>}

              {!isLoading && filteredCourses.length > 0 ? (
                view === "grid" ? (
                  <CourseGrid
                    courses={filteredCourses}
                    onEdit={(course) => {
                      console.log("Setting current course for edit:", course)
                      setCurrentCourse(course)
                      setIsEditModalOpen(true)
                    }}
                    onDelete={(course) => {
                      setCurrentCourse(course)
                      setIsDeleteModalOpen(true)
                    }}
                  />
                ) : (
                  <CourseList
                    courses={filteredCourses}
                    onEdit={(course) => {
                      console.log("Setting current course for edit:", course)
                      setCurrentCourse(course)
                      setIsEditModalOpen(true)
                    }}
                    onDelete={(course) => {
                      setCurrentCourse(course)
                      setIsDeleteModalOpen(true)
                    }}
                  />
                )
              ) : (
                !isLoading && (
                  <CourseEmptyState
                    hasAnyCourses={courses.length > 0}
                    onCreateCourse={() => setIsCreateModalOpen(true)}
                  />
                )
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
        course={currentCourse}
      />

      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCourse}
        course={currentCourse}
      />
    </div>
  )
}
