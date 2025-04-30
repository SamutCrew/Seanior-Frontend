"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaSearch, FaFilter, FaMapMarkerAlt } from "react-icons/fa"
import { TeacherCard } from "@/components/PageDashboard/TeacherCard"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"

// Sample data for teachers
const sampleTeachers = [
  {
    id: 1,
    name: "Michael Phelps",
    specialty: "Competitive Swimming",
    styles: ["Freestyle", "Butterfly"],
    levels: ["Intermediate", "Advanced"],
    certification: ["ASCA", "RedCross"],
    rating: 4.9,
    experience: 15,
    image: "/placeholder.svg?key=wqdzw",
    bio: "Olympic gold medalist specializing in competitive swimming techniques",
    lessonType: "Private",
    price: 80,
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  },
  {
    id: 2,
    name: "Katie Ledecky",
    specialty: "Freestyle Technique",
    styles: ["Freestyle"],
    levels: ["Beginner", "Intermediate", "Advanced"],
    certification: ["USMS", "RedCross"],
    rating: 4.8,
    experience: 12,
    image: "/placeholder.svg?key=5xd6c",
    bio: "World record holder focusing on freestyle technique and endurance",
    lessonType: "Private",
    price: 75,
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  },
  {
    id: 3,
    name: "Ryan Murphy",
    specialty: "Backstroke",
    styles: ["Backstroke", "Freestyle"],
    levels: ["Intermediate", "Advanced"],
    certification: ["ASCA", "RedCross"],
    rating: 4.7,
    experience: 10,
    image: "/placeholder.svg?key=nq5bj",
    bio: "Olympic gold medalist specializing in backstroke techniques",
    lessonType: "Group",
    price: 70,
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  },
  {
    id: 4,
    name: "Simone Manuel",
    specialty: "Sprint Freestyle",
    styles: ["Freestyle", "Butterfly"],
    levels: ["Beginner", "Intermediate"],
    certification: ["ASCA", "RedCross"],
    rating: 4.9,
    experience: 8,
    image: "/placeholder.svg?key=xurfu",
    bio: "Olympic gold medalist focusing on sprint techniques and fundamentals",
    lessonType: "Private",
    price: 85,
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
  },
]

export default function TeachersDirectoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    style: "",
    level: "",
    lessonType: "",
    minRating: 0,
    maxPrice: 1000,
  })

  const [teachers, setTeachers] = useState(sampleTeachers)
  const [filteredTeachers, setFilteredTeachers] = useState(sampleTeachers)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Apply filters and search
  useEffect(() => {
    let results = teachers

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(term) ||
          teacher.specialty.toLowerCase().includes(term) ||
          teacher.bio.toLowerCase().includes(term),
      )
    }

    // Apply filters
    if (filters.style) {
      results = results.filter((teacher) => teacher.styles.includes(filters.style))
    }

    if (filters.level) {
      results = results.filter((teacher) => teacher.levels.includes(filters.level))
    }

    if (filters.lessonType) {
      results = results.filter((teacher) => teacher.lessonType === filters.lessonType)
    }

    if (filters.minRating > 0) {
      results = results.filter((teacher) => teacher.rating >= filters.minRating)
    }

    if (filters.maxPrice < 1000) {
      results = results.filter((teacher) => teacher.price <= filters.maxPrice)
    }

    setFilteredTeachers(results)
  }, [searchTerm, filters, teachers])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, maxPrice: Number.parseInt(e.target.value) }))
  }

  const viewTeacherProfile = (id: number) => {
    router.push(`/teacher/${id}`)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle className={`mb-8 ${isDarkMode ? "text-white" : ""}`}>Find Swimming Instructors</SectionTitle>

        {/* Search and Filter Bar */}
        <div
          className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"} rounded-xl shadow-sm p-6 mb-8`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className={`absolute left-3 top-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search by name, specialty, or keyword..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                    : "border border-gray-300 focus:border-blue-500"
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 ${
                isDarkMode ? "border-slate-600 text-white hover:bg-slate-700" : ""
              }`}
            >
              <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Swimming Style
                </label>
                <select
                  name="style"
                  value={filters.style}
                  onChange={handleFilterChange}
                  className={`w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "border border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="">All Styles</option>
                  <option value="Freestyle">Freestyle</option>
                  <option value="Backstroke">Backstroke</option>
                  <option value="Breaststroke">Breaststroke</option>
                  <option value="Butterfly">Butterfly</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Level
                </label>
                <select
                  name="level"
                  value={filters.level}
                  onChange={handleFilterChange}
                  className={`w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "border border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Lesson Type
                </label>
                <select
                  name="lessonType"
                  value={filters.lessonType}
                  onChange={handleFilterChange}
                  className={`w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "border border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="">All Types</option>
                  <option value="Private">Private</option>
                  <option value="Group">Group</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Minimum Rating
                </label>
                <select
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  className={`w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "border border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="0">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Maximum Price: ${filters.maxPrice}
                </label>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={filters.maxPrice}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            {filteredTeachers.length} Instructors Found
          </h2>

          <div className={`flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <FaMapMarkerAlt className="mr-2" />
            <span>Los Angeles, CA</span>
          </div>
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="cursor-pointer" onClick={() => viewTeacherProfile(teacher.id)}>
                <TeacherCard teacher={teacher} isDarkMode={isDarkMode} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"} rounded-xl shadow-sm p-8 text-center`}
          >
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              No Instructors Found
            </h3>
            <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Try adjusting your search filters to find more instructors.
            </p>
            <Button
              variant={isDarkMode ? "gradient" : "primary"}
              onClick={() => {
                setSearchTerm("")
                setFilters({
                  style: "",
                  level: "",
                  lessonType: "",
                  minRating: 0,
                  maxPrice: 1000,
                })
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredTeachers.length > 0 && (
          <div className="flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a
                href="#"
                className={`px-4 py-2 rounded-l-md border ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </a>
              <a
                href="#"
                className={`px-4 py-2 border-t border-b ${
                  isDarkMode ? "border-slate-600" : "border-gray-300"
                } bg-blue-600 text-white`}
              >
                1
              </a>
              <a
                href="#"
                className={`px-4 py-2 border-t border-b ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                2
              </a>
              <a
                href="#"
                className={`px-4 py-2 border-t border-b ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                3
              </a>
              <a
                href="#"
                className={`px-4 py-2 rounded-r-md border ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
