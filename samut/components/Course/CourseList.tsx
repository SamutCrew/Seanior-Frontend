"use client"
import { useState } from "react"
import { FaPlus, FaSearch, FaThLarge, FaList } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import type { Course } from "@/types/course"
import CourseListItem from "./CourseListItem"
import CourseGrid from "./CourseGrid"

interface CourseListProps {
  courses: Course[]
  onCreateCourse?: () => void
  onEditCourse?: (course: Course) => void
  onDeleteCourse?: (course: Course) => void
}

export default function CourseList({ courses, onCreateCourse, onEditCourse, onDeleteCourse }: CourseListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("All Levels")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // Filter courses based on search term and level filter
  const filteredCourses = courses.filter((course) => {
    const title = course.title || course.course_name || ""
    const matchesSearch = searchTerm === "" || title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = levelFilter === "All Levels" || course.level?.toLowerCase() === levelFilter.toLowerCase()

    return matchesSearch && matchesLevel
  })

  return (
    <div className={`${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Course Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {onCreateCourse && (
            <button
              onClick={onCreateCourse}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <FaPlus /> Create New Course
            </button>
          )}

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg w-full md:w-64 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-gray-900"
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>

            <div
              className={`flex rounded-lg overflow-hidden border ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? isDarkMode
                      ? "bg-slate-700 text-white"
                      : "bg-gray-200 text-gray-800"
                    : isDarkMode
                      ? "bg-slate-800 text-gray-400"
                      : "bg-white text-gray-500"
                }`}
              >
                <FaList />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? isDarkMode
                      ? "bg-slate-700 text-white"
                      : "bg-gray-200 text-gray-800"
                    : isDarkMode
                      ? "bg-slate-800 text-gray-400"
                      : "bg-white text-gray-500"
                }`}
              >
                <FaThLarge />
              </button>
            </div>
          </div>
        </div>

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No courses found. Try adjusting your filters or create a new course.
          </div>
        ) : viewMode === "list" ? (
          <div>
            {filteredCourses.map((course) => (
              <CourseListItem
                key={course.id || course.course_id}
                course={course}
                onEdit={onEditCourse}
                onDelete={onDeleteCourse}
              />
            ))}
          </div>
        ) : (
          <CourseGrid courses={filteredCourses} onEdit={onEditCourse} onDelete={onDeleteCourse} />
        )}
      </div>
    </div>
  )
}
