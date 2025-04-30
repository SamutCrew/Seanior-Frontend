"use client"

import { useState } from "react"
import { FaPlus, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa"
import TeacherHeader from "@/components/PageDashboard/TeacherHeader"
import TeacherStats from "@/components/PageDashboard/TeacherStats"
import CalendarView from "@/components/PageDashboard/CalendarView"
import RequestsPanel from "@/components/PageDashboard/RequestsPanel"
import TeachingSchedule from "@/components/PageDashboard/TeachingSchedule"
import AvailableCourses from "@/components/PageDashboard/AvailableCourses"
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

export default function TeacherDashboard() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

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
      image: "/water-safety-swimming.png"
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
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Freestyle Mastery",
      focus: "Technique Improvement",
      level: "Intermediate",
      duration: "8 weeks",
      schedule: "Mon/Wed 5-6pm",
      instructor: "Alex Johnson",
      rating: 4.8,
      students: 24,
      price: 299,
      location: {
        address: "Skyline Aquatic Center, Pool 2",
      },
      courseType: "public-pool",
      description: "Master freestyle swimming techniques with professional guidance.",
      curriculum: ["Body positioning", "Breathing techniques", "Arm stroke mechanics", "Kick techniques"],
      requirements: ["Basic swimming ability", "Own swimming equipment"],
      maxStudents: 30,
    },
    {
      id: 2,
      title: "Beginner Swimming",
      focus: "Fundamentals",
      level: "Beginner",
      duration: "6 weeks",
      schedule: "Tue/Thu 4-5pm",
      instructor: "Sarah Miller",
      rating: 4.9,
      students: 18,
      price: 249,
      location: {
        address: "Skyline Aquatic Center, Pool 1",
      },
      courseType: "teacher-pool",
      description: "Learn the basics of swimming in a supportive environment.",
      curriculum: ["Water comfort", "Floating", "Basic strokes", "Water safety"],
      requirements: ["No previous experience needed"],
      maxStudents: 20,
    },
    {
      id: 3,
      title: "Advanced Techniques",
      focus: "Competition Prep",
      level: "Advanced",
      duration: "10 weeks",
      schedule: "Mon/Wed/Fri 7-8:30pm",
      instructor: "Alex Johnson",
      rating: 4.7,
      students: 12,
      price: 399,
      location: {
        address: "Olympic Training Pool",
      },
      courseType: "private-location",
      description: "Advanced training for competitive swimmers.",
      curriculum: ["Race strategies", "Advanced techniques", "Speed drills", "Competition preparation"],
      requirements: ["Competitive swimming experience", "Advanced swimming ability"],
      maxStudents: 15,
      image: "/swimmer-in-motion.png",
    },
  ])

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
      course.focus.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true
    return matchesSearch && matchesLevel
  })

  // Course CRUD operations
  const handleAddCourse = (newCourseData: Partial<Course>) => {
    const newCourse: Course = {
      id: Math.max(...courses.map((c) => c.id), 0) + 1,
      ...newCourseData,
      instructor: newCourseData.instructor || "Alex Johnson",
      rating: newCourseData.rating || 4.5,
      students: newCourseData.students || 0,
      courseType: newCourseData.courseType || "public-pool",
    } as Course
    setCourses([...courses, newCourse])
    setIsCreateModalOpen(false)
  }

  const handleEditCourse = (editedCourseData: Partial<Course>) => {
    setCourses(courses.map((course) => (course.id === currentCourse?.id ? { ...course, ...editedCourseData } : course)))
    setIsEditModalOpen(false)
  }

  const handleDeleteCourse = () => {
    if (currentCourse) {
      setCourses(courses.filter((course) => course.id !== currentCourse.id))
      setIsDeleteModalOpen(false)
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
