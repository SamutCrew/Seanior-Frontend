"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, X, ChevronDown, BookOpen, Bookmark, Layers } from "lucide-react"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import { IconButton } from "@/components/Common/IconButton"
import { useAppSelector } from "@/app/redux"
import CourseCard from "@/components/Course/CourseCard"
import { motion, AnimatePresence } from "framer-motion"
import type { Course } from "@/types/course"
import LoadingPage from "@/components/Common/LoadingPage"
import { HiAcademicCap, HiOutlineAcademicCap } from "react-icons/hi"
import { FaSwimmer } from "react-icons/fa"
import { getAllCourses } from "@/api/course_api"

export default function AllCoursesPage() {
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [courseFilters, setCourseFilters] = useState({
    level: "",
    priceRange: "",
    duration: "",
    location: "",
    instructor: "",
  })

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("relevance")
  const [activeCategory, setActiveCategory] = useState("all")

  // Courses data
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch courses from API
        const response = await getAllCourses()
        console.log("API Response:", response) // Debug log

        if (response && Array.isArray(response)) {
          // Create properly formatted course objects that match CourseCard expectations
          const formattedCourses = response.map((course) => {
            // Extract instructor name from instructor object if needed
            let instructorName = "Unknown Instructor"
            if (typeof course.instructor === "object" && course.instructor !== null) {
              instructorName = course.instructor.name || "Unknown Instructor"
            } else if (typeof course.instructor === "string") {
              instructorName = course.instructor
            }

            // Create a location object if it doesn't exist
            let locationObj = { address: "No location specified" }
            if (typeof course.location === "object" && course.location !== null) {
              locationObj = course.location
            } else if (typeof course.location === "string") {
              locationObj = { address: course.location }
            }

            // Format schedule if it's an object
            let scheduleStr = "Flexible schedule"
            if (typeof course.schedule === "object" && course.schedule !== null) {
              // Convert schedule object to string (e.g., "Monday, Wednesday, Friday")
              scheduleStr = Object.keys(course.schedule)
                .filter((day) => course.schedule[day])
                .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
                .join(", ")

              if (scheduleStr === "") {
                scheduleStr = "Flexible schedule"
              }
            } else if (typeof course.schedule === "string") {
              scheduleStr = course.schedule
            }

            // Return a properly formatted course object
            return {
              id: course.course_id || course.id || String(Math.random()),
              title: course.course_name || course.title || "Untitled Course",
              focus: course.description || course.focus || "",
              level: course.level || "Beginner",
              duration: course.course_duration ? `${course.course_duration} weeks` : "8 weeks",
              schedule: scheduleStr,
              instructor: instructorName,
              instructorId: course.instructor_id || "",
              instructorImage: course.instructor?.profile_img || "/instructor-teaching.png",
              rating: course.rating || 4.5,
              students: course.students || 0,
              price: course.price || 0,
              location: locationObj,
              courseType: course.pool_type || "public-pool",
              description: course.description || "",
              curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
              maxStudents: course.max_students || 10,
              image: course.course_image || course.pool_image || "/outdoor-swimming-pool.png",
            }
          })

          console.log("Formatted Courses:", formattedCourses) // Debug log

          setCourses(formattedCourses)
          setFilteredCourses(formattedCourses)

          // Set featured courses (top 3 by rating)
          const featured = [...formattedCourses].sort((a, b) => b.rating - a.rating).slice(0, 3)
          setFeaturedCourses(featured)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error loading courses:", err)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  // Update active filter count
  useEffect(() => {
    let count = 0
    if (courseFilters.level) count++
    if (courseFilters.priceRange) count++
    if (courseFilters.duration) count++
    if (courseFilters.location) count++
    if (courseFilters.instructor) count++
    setActiveFilterCount(count)
  }, [courseFilters])

  // Apply filters and search
  useEffect(() => {
    if (!courses.length) return

    let results = [...courses]

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (course) =>
          (course.title && course.title.toLowerCase().includes(term)) ||
          (course.focus && course.focus.toLowerCase().includes(term)) ||
          (course.instructor && course.instructor.toLowerCase().includes(term)) ||
          (course.level && course.level.toLowerCase().includes(term)),
      )
    }

    // Apply category filter
    if (activeCategory !== "all") {
      if (activeCategory === "beginner") {
        results = results.filter((course) => course.level === "Beginner")
      } else if (activeCategory === "intermediate") {
        results = results.filter((course) => course.level === "Intermediate")
      } else if (activeCategory === "advanced") {
        results = results.filter((course) => course.level === "Advanced")
      }
    }

    // Apply level filter
    if (courseFilters.level) {
      results = results.filter((course) => course.level === courseFilters.level)
    }

    // Apply price range filter
    if (courseFilters.priceRange) {
      const [min, max] = courseFilters.priceRange.split("-").map(Number)
      results = results.filter((course) => {
        return course.price >= min && (isNaN(max) || course.price <= max)
      })
    }

    // Apply duration filter
    if (courseFilters.duration && results.length > 0) {
      results = results.filter((course) => course.duration && course.duration.includes(courseFilters.duration))
    }

    // Apply location filter
    if (courseFilters.location) {
      results = results.filter(
        (course) =>
          course.location && course.location.address && course.location.address.includes(courseFilters.location),
      )
    }

    // Apply instructor filter
    if (courseFilters.instructor) {
      results = results.filter(
        (course) =>
          course.instructor && course.instructor.toLowerCase().includes(courseFilters.instructor.toLowerCase()),
      )
    }

    // Apply sorting
    results = sortCourses(results, sortOption)

    setFilteredCourses(results)
  }, [searchTerm, courseFilters, courses, sortOption, activeCategory])

  // Sort Courses based on selected option
  const sortCourses = (courseList: Course[], option: string) => {
    const sorted = [...courseList]

    switch (option) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "price_low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price_high":
        return sorted.sort((a, b) => b.price - a.price)
      case "students":
        return sorted.sort((a, b) => b.students - a.students)
      case "relevance":
      default:
        return sorted
    }
  }

  const viewCourseDetails = (id: number | string) => {
    router.push(`/allcourse/${id}`)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setCourseFilters({
      level: "",
      priceRange: "",
      duration: "",
      location: "",
      instructor: "",
    })
    setActiveCategory("all")
  }

  // Scroll to results
  const scrollToResults = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const resultsCount = filteredCourses.length

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-indigo-50 to-white"} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle className={`mb-8 ${isDarkMode ? "text-white" : ""}`}>Swimming Course Catalog</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-xl shadow-md ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-red-600"}`}
          >
            <p className="text-xl">{error}</p>
            <Button
              variant={isDarkMode ? "gradient" : "primary"}
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-indigo-50 to-white"}`}>
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-900 to-violet-900"
            : "bg-gradient-to-r from-indigo-600 to-violet-500"
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/wave-pattern.svg')] bg-repeat opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

          {/* Floating Book Icons */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`floating-icon-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ y: 20, opacity: 0, rotate: Math.random() * 20 - 10 }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.7, 1, 0.7],
                rotate: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5 + Math.random() * 5,
                  delay: Math.random() * 2,
                },
              }}
            >
              {i % 3 === 0 ? (
                <BookOpen className="text-white/20 w-8 h-8 md:w-12 md:h-12" />
              ) : i % 3 === 1 ? (
                <Bookmark className="text-white/20 w-6 h-6 md:w-10 md:h-10" />
              ) : (
                <HiOutlineAcademicCap className="text-white/20 w-8 h-8 md:w-14 md:h-14" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-block mb-4">
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <HiAcademicCap className="w-4 h-4 mr-2" /> Course Catalog
              </motion.div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Discover Your Perfect <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10">Swimming Course</span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-indigo-400/30 rounded-lg -z-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                ></motion.span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              Browse our comprehensive catalog of swimming courses designed for all ages and skill levels. Find the
              perfect class to help you achieve your aquatic goals.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <motion.div
                className={`relative ${searchFocused ? "ring-4 ring-indigo-300/30" : ""} transition-all duration-300 rounded-full shadow-lg`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for courses by name, level, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full pl-14 pr-36 py-5 rounded-full focus:outline-none text-base ${
                    isDarkMode
                      ? "bg-slate-800/90 border border-slate-700/50 text-white backdrop-blur-md"
                      : "bg-white/95 text-gray-800 backdrop-blur-md"
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {searchTerm && (
                    <IconButton
                      icon={<X className="h-4 w-4 text-gray-500" />}
                      onClick={() => setSearchTerm("")}
                      className={`hover:bg-gray-100 dark:hover:bg-slate-700`}
                    />
                  )}
                  <Button
                    variant={isDarkMode ? "outline" : "secondary"}
                    onClick={() => {
                      setShowFilters(!showFilters)
                      if (!showFilters) {
                        setTimeout(() => {
                          scrollToResults()
                        }, 100)
                      }
                    }}
                    className="flex items-center gap-2 relative"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Active Filters Display */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex flex-wrap items-center gap-2 justify-center"
                  >
                    <span className="text-white/70 text-sm">Active filters:</span>
                    {courseFilters.level && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-indigo-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Level: {courseFilters.level}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setCourseFilters({ ...courseFilters, level: "" })}
                        />
                      </motion.span>
                    )}
                    {courseFilters.priceRange && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-indigo-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Price: {courseFilters.priceRange}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setCourseFilters({ ...courseFilters, priceRange: "" })}
                        />
                      </motion.span>
                    )}
                    {courseFilters.duration && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-indigo-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Duration: {courseFilters.duration}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setCourseFilters({ ...courseFilters, duration: "" })}
                        />
                      </motion.span>
                    )}
                    {courseFilters.location && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-indigo-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Location: {courseFilters.location}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setCourseFilters({ ...courseFilters, location: "" })}
                        />
                      </motion.span>
                    )}
                    {courseFilters.instructor && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-indigo-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Instructor: {courseFilters.instructor}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setCourseFilters({ ...courseFilters, instructor: "" })}
                        />
                      </motion.span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="text-xs border-white/30 text-white/80 hover:bg-white/10"
                    >
                      Clear All
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className={`relative block w-full h-12 sm:h-16 ${isDarkMode ? "text-slate-900" : "text-indigo-50"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            <div
              className={`rounded-full ${activeCategory === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("all")}
            >
              <Layers className="w-4 h-4 mr-2" /> All Courses
            </div>
            <div
              className={`rounded-full ${activeCategory === "beginner" ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("beginner")}
            >
              <FaSwimmer className="mr-2" /> Beginner
            </div>
            <div
              className={`rounded-full ${activeCategory === "intermediate" ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("intermediate")}
            >
              <FaSwimmer className="mr-2" /> Intermediate
            </div>
            <div
              className={`rounded-full ${activeCategory === "advanced" ? "bg-indigo-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("advanced")}
            >
              <FaSwimmer className="mr-2" /> Advanced
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div ref={scrollRef}></div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-8 overflow-hidden rounded-xl shadow-lg ${
                isDarkMode ? "bg-slate-800/95 border border-slate-700 backdrop-blur-md" : "bg-white/95 backdrop-blur-md"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-lg font-semibold flex items-center ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    <Filter className="h-5 w-5 mr-2" />
                    Refine Course Search
                  </h3>
                  <IconButton
                    icon={<X className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />}
                    onClick={() => setShowFilters(false)}
                    className={`rounded-full ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                  />
                </div>

                {/* Quick Filter Presets */}
                <div className={`mb-6 pb-6 border-b ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
                  <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Quick Filters
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        courseFilters.level === "Beginner"
                          ? "bg-indigo-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setCourseFilters({
                          ...courseFilters,
                          level: courseFilters.level === "Beginner" ? "" : "Beginner",
                        })
                      }
                    >
                      <HiOutlineAcademicCap className="w-3 h-3 mr-1" /> Beginner
                    </div>
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        courseFilters.level === "Intermediate"
                          ? "bg-indigo-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setCourseFilters({
                          ...courseFilters,
                          level: courseFilters.level === "Intermediate" ? "" : "Intermediate",
                        })
                      }
                    >
                      Intermediate
                    </div>
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        courseFilters.level === "Advanced"
                          ? "bg-indigo-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setCourseFilters({
                          ...courseFilters,
                          level: courseFilters.level === "Advanced" ? "" : "Advanced",
                        })
                      }
                    >
                      Advanced
                    </div>
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        courseFilters.priceRange === "0-200"
                          ? "bg-indigo-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setCourseFilters({
                          ...courseFilters,
                          priceRange: courseFilters.priceRange === "0-200" ? "" : "0-200",
                        })
                      }
                    >
                      Under $200
                    </div>
                  </div>
                </div>

                {/* Detailed Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Level Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      Course Level
                    </h4>
                    <select
                      value={courseFilters.level}
                      onChange={(e) => setCourseFilters({ ...courseFilters, level: e.target.value })}
                      className={`w-full rounded-md border p-2 ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      Price Range
                    </h4>
                    <select
                      value={courseFilters.priceRange}
                      onChange={(e) => setCourseFilters({ ...courseFilters, priceRange: e.target.value })}
                      className={`w-full rounded-md border p-2 ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                    >
                      <option value="">Any Price</option>
                      <option value="0-150">Under $150</option>
                      <option value="0-200">Under $200</option>
                      <option value="200-300">$200 - $300</option>
                      <option value="300-1000">$300+</option>
                    </select>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      Duration
                    </h4>
                    <select
                      value={courseFilters.duration}
                      onChange={(e) => setCourseFilters({ ...courseFilters, duration: e.target.value })}
                      className={`w-full rounded-md border p-2 ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white"
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                    >
                      <option value="">Any Duration</option>
                      <option value="4 weeks">4 Weeks</option>
                      <option value="6 weeks">6 Weeks</option>
                      <option value="8 weeks">8 Weeks</option>
                      <option value="10 weeks">10+ Weeks</option>
                      <option value="Ongoing">Ongoing</option>
                    </select>
                  </div>

                  {/* Location Type Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      Location
                    </h4>
                    <input
                      type="text"
                      placeholder="Search by location..."
                      value={courseFilters.location}
                      onChange={(e) => setCourseFilters({ ...courseFilters, location: e.target.value })}
                      className={`w-full rounded-md border p-2 ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  {/* Instructor Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      Instructor
                    </h4>
                    <input
                      type="text"
                      placeholder="Search by instructor name..."
                      value={courseFilters.instructor}
                      onChange={(e) => setCourseFilters({ ...courseFilters, instructor: e.target.value })}
                      className={`w-full rounded-md border p-2 ${
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-700 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-dashed gap-3">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className={isDarkMode ? "border-slate-700 text-white" : ""}
                  >
                    Reset All
                  </Button>
                  <Button variant="primary" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">
              <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {resultsCount} Courses Found
              </h2>
              {searchTerm && (
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-sm ${
                    isDarkMode ? "bg-slate-700 text-indigo-400" : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  "{searchTerm}"
                </span>
              )}
            </motion.div>

            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <div className="flex items-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-l-md border ${isDarkMode ? "border-slate-700" : "border-gray-300"} ${
                    viewMode === "grid"
                      ? isDarkMode
                        ? "bg-indigo-900 text-white"
                        : "bg-indigo-50 text-indigo-600"
                      : isDarkMode
                        ? "bg-slate-800 text-gray-400"
                        : "bg-white text-gray-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-r-md border-t border-r border-b ${
                    isDarkMode ? "border-slate-700" : "border-gray-300"
                  } ${
                    viewMode === "list"
                      ? isDarkMode
                        ? "bg-indigo-900 text-white"
                        : "bg-indigo-50 text-indigo-600"
                      : isDarkMode
                        ? "bg-slate-800 text-gray-400"
                        : "bg-white text-gray-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <div className={`relative ${isDarkMode ? "text-white" : ""}`}>
                <select
                  className={`appearance-none rounded-md border pl-3 pr-10 py-2 text-sm ${
                    isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-700"
                  }`}
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="rating">Sort by: Rating</option>
                  <option value="price_low">Sort by: Price (Low to High)</option>
                  <option value="price_high">Sort by: Price (High to Low)</option>
                  <option value="students">Sort by: Popularity</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {resultsCount === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-16 rounded-xl shadow-lg ${
                isDarkMode ? "bg-slate-800/90 border border-slate-700" : "bg-white"
              }`}
            >
              <div className="max-w-md mx-auto">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDarkMode ? "bg-slate-700" : "bg-indigo-50"
                  }`}
                >
                  <Search className={`h-10 w-10 ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  No courses found
                </h3>
                <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  We couldn't find any courses matching your search criteria. Try adjusting your filters or search term.
                </p>
                <Button variant={isDarkMode ? "gradient" : "primary"} onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </div>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={`course-grid-${course.id || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                  onClick={() => viewCourseDetails(course.id)}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-12">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={`course-list-${course.id || index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md ${
                    isDarkMode ? "bg-slate-800 hover:bg-slate-750" : "bg-white hover:bg-gray-50"
                  } transition-all duration-300`}
                  onClick={() => viewCourseDetails(course.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/4 h-48 md:h-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-500 opacity-20"></div>
                      <img
                        src={course.image || "/placeholder.svg?key=25f2a"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
                          isDarkMode ? "bg-slate-900/80 text-white" : "bg-indigo-800/90 text-white"
                        } backdrop-blur-sm`}
                      >
                        {course.level}
                      </div>
                    </div>
                    <div className="p-5 md:w-3/4 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            {course.title}
                          </h3>
                          <p className={isDarkMode ? "text-indigo-400 font-medium" : "text-indigo-600 font-medium"}>
                            {course.focus}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDarkMode ? "bg-slate-700 text-green-400" : "bg-green-50 text-green-700"
                          }`}
                        >
                          ${course.price}
                        </div>
                      </div>

                      <p className={`mb-4 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {course.description || "Learn swimming techniques in a supportive environment."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? "bg-slate-700 text-indigo-300" : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {course.duration}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? "bg-slate-700 text-purple-300" : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {course.courseType === "public-pool"
                            ? "Public Pool"
                            : course.courseType === "private-location"
                              ? "Private Location"
                              : "Teacher's Pool"}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? "bg-slate-700 text-amber-300" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {course.students} Students
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                            <img
                              src={course.instructorImage || "/placeholder.svg"}
                              alt={`Instructor ${course.instructor}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            {course.instructor}
                          </span>
                        </div>
                        <Button
                          variant={isDarkMode ? "outline" : "secondary"}
                          size="sm"
                          className={isDarkMode ? "border-slate-700" : ""}
                        >
                          <HiAcademicCap className="mr-1" /> Enroll Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCourses.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-lg overflow-hidden">
              <Button
                variant={isDarkMode ? "outline" : "secondary"}
                className={`rounded-none border-r-0 ${isDarkMode ? "border-slate-700 text-white" : "border-gray-300"}`}
              >
                Previous
              </Button>
              <Button variant="primary" className="rounded-none border-r-0">
                1
              </Button>
              <Button
                variant={isDarkMode ? "outline" : "secondary"}
                className={`rounded-none border-r-0 ${isDarkMode ? "border-slate-700 text-white" : "border-gray-300"}`}
              >
                2
              </Button>
              <Button
                variant={isDarkMode ? "outline" : "secondary"}
                className={`rounded-none ${isDarkMode ? "border-slate-700 text-white" : "border-gray-300"}`}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
