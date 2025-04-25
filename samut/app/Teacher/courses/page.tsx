"use client"

import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import CourseStats from "@/components/Course/CourseStats"
import CourseFilters from "@/components/Course/CourseFilters"
import CourseGrid from "@/components/Course/CourseGrid"
import CourseList from "@/components/Course/CourseList"
import CourseEmptyState from "@/components/Course/CourseEmptyState"
import CreateCourseModal from "@/components/Course/Modals/CreateCourseModal"
import EditCourseModal from "@/components/Course/Modals/EditCourseModal"
import DeleteCourseModal from "@/components/Course/Modals/DeleteCourseModal"
import type { Course } from "@/types/course"

// Sample course data
const initialCourses: Course[] = [
  {
    id: 1,
    title: "Freestyle Mastery",
    focus: "Technique Improvement",
    level: "Intermediate",
    duration: "8 weeks",
    schedule: "Mon/Wed 5-6pm",
    instructor: "Alex Johnson",
    rating: 4.8,
    students: 124,
    price: 299,
    location: {
      address: "Skyline Aquatic Center, Pool 2",
    },
    courseType: "public-pool",
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
    students: 98,
    price: 249,
    location: {
      address: "Skyline Aquatic Center, Pool 1",
    },
    courseType: "public-pool",
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
    students: 56,
    price: 399,
    location: {
      address: "Olympic Training Pool",
    },
    courseType: "teacher-pool",
  },
]



export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  const handleAddCourse = (newCourseData: Partial<Course>) => {
    const newCourse: Course = {
      id: Math.max(...courses.map((c) => c.id), 0) + 1,
      ...newCourseData,
      instructor: newCourseData.instructor || "Alex Johnson",
      rating: newCourseData.rating || 4.5,
      students: newCourseData.students || 0,
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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.focus.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true
    return matchesSearch && matchesLevel
  })

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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sky-800 flex items-center gap-2">
              <span className="text-sky-600">🏊‍♂️</span> My Courses
            </h1>
            <p className="text-gray-600 mt-1">Manage your swimming courses and students</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow"
          >
            <FaPlus /> New Course
          </button>
        </div>

        {/* Stats Section */}
        <CourseStats courses={filteredCourses} />

        {/* Filters and Search */}
        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          view={view}
          setView={setView}
        />

        {/* Courses Grid/List View */}
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
          <CourseEmptyState hasAnyCourses={courses.length > 0} onCreateCourse={() => setIsCreateModalOpen(true)} />
        )}

        {/* Create Course Button (always visible) */}
        {filteredCourses.length > 0 && (
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow"
            >
              <FaPlus /> Create Course
            </button>
          </div>
        )}

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
    </div>
  )
}
