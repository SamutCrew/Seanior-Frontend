"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  MapPin,
  Filter,
  X,
  ChevronDown,
  Star,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react"
import { InstructorCard } from "@/components/Searchpage/InstructorCard"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import { IconButton } from "@/components/Common/IconButton"
import { useAppSelector } from "@/app/redux"
import { LocationFilter } from "@/components/Searchpage/LocationFilter"
import { InstructorFiltersComponent } from "@/components/Searchpage/InstructorFilters"
import type { Instructor, InstructorFilters, Location } from "@/types/instructor"
import LoadingPage from "@/components/Common/LoadingPage"
import { motion, AnimatePresence } from "framer-motion"
import { API_BASE_URL } from "@/constants/apiEndpoints"



// Function to map API data to the format expected by the UI
const mapApiDataToInstructors = (apiData: any[]): Instructor[] => {
  if (!apiData || !Array.isArray(apiData)) return []

  return apiData.map((instructor) => ({
    id: instructor.user_id,
    name: instructor.name,
    profile_img: instructor.profile_img || "/swimming-instructor.png",
    description: {
      specialty: instructor.description?.specialty || "",
      bio: instructor.description?.bio || "",
      rating: 4.5, // Default rating since it's not in the API data
      experience: instructor.description?.experience ? Number.parseInt(instructor.description.experience) : 0,
      price: 75, // Default price since it's not in the API data
      styles: instructor.description?.styles
        ? typeof instructor.description.styles === "string"
          ? instructor.description.styles.split(", ")
          : [instructor.description.styles]
        : [],
      levels: ["Beginner", "Intermediate"], // Default levels since it's not in the API data
      lessonType: "Private", // Default lesson type since it's not in the API data
      certification: [instructor.description?.certification || ""],
      location: instructor.description?.location || {
        lat: 0,
        lng: 0,
        address: "Location not specified",
      },
    },
  }))
}

export default function InstructorsDirectoryPage() {
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType] = useState<"instructor" | "course">("instructor")
  const [searchFocused, setSearchFocused] = useState(false)

  // Filter state
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)
  const [instructorFilters, setInstructorFilters] = useState<InstructorFilters>({
    style: "",
    level: "",
    lessonType: "",
    certification: "",
    minRating: 0,
    priceRange: "",
    maxDistance: 0,
  })

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("all")

  // Location state
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 34.0522, lng: -118.2437 })

  // Instructors data
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([])
  const [featuredInstructors, setFeaturedInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("relevance")

  // Fetch instructors data directly from the API
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Fetching instructors from API:", API_BASE_URL)
        const response = await fetch(API_BASE_URL)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data)

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("No instructor data received or invalid data format")
          setError("No instructor data available. Please try again later.")
          setInstructors([])
          setFilteredInstructors([])
          setFeaturedInstructors([])
          setIsLoading(false)
          return
        }

        // Map API data to the format expected by the UI
        const mappedInstructors = mapApiDataToInstructors(data)
        console.log("Mapped instructors:", mappedInstructors)

        setInstructors(mappedInstructors)
        setFilteredInstructors(mappedInstructors)

        // Set featured instructors (top 3 by experience)
        const featured = [...mappedInstructors]
          .sort((a, b) => (b.description?.experience || 0) - (a.description?.experience || 0))
          .slice(0, 3)
        setFeaturedInstructors(featured)
      } catch (err) {
        console.error("Error fetching instructors:", err)
        setError("Failed to load instructors. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  // Update active filter count
  useEffect(() => {
    let count = 0
    if (instructorFilters.style) count++
    if (instructorFilters.level) count++
    if (instructorFilters.lessonType) count++
    if (instructorFilters.certification) count++
    if (instructorFilters.minRating > 0) count++
    if (instructorFilters.priceRange) count++
    if (instructorFilters.maxDistance > 0) count++
    setActiveFilterCount(count)
  }, [instructorFilters])

  // Get user's current location
  const getCurrentLocation = () => {
    console.log("GETTING CURRENT LOCATION")
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      console.log("GEOLOCATION NOT SUPPORTED")
      setLocationError("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Your current location",
        }
        console.log("CURRENT LOCATION OBTAINED:", location)
        setUserLocation(location)
        setSelectedLocation(location)
        setMapCenter({ lat: location.lat, lng: location.lng })
        setIsLoadingLocation(false)
      },
      (error) => {
        console.log("GEOLOCATION ERROR:", error)
        setLocationError("Unable to retrieve your location")
        setIsLoadingLocation(false)
      },
    )
  }

  // Handle map click to select a new location
  const handleMapClick = (location: { lat: number; lng: number }) => {
    console.log("MAP CLICKED:", location)
    const newLocation = {
      lat: location.lat,
      lng: location.lng,
      address: "Selected location",
    }
    setSelectedLocation(newLocation)
    setMapCenter({ lat: location.lat, lng: location.lng })
  }

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap)
    if (!showMap && userLocation) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng })
    }
  }

  // Helper function to calculate distance between two coordinates (in km)
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // For debugging specific problematic coordinates
    if (!lat1 || !lon1 || !lat2 || !lon2) {
      console.warn("INVALID COORDINATES IN getDistance:", { lat1, lon1, lat2, lon2 })
      return Number.POSITIVE_INFINITY // Return a large value to exclude this result
    }

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km

    return distance
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  // Apply filters and search
  useEffect(() => {
    console.log("APPLYING FILTERS - Current state:", {
      searchTerm,
      activeCategory,
      instructorFilters,
      userLocation,
      selectedLocation,
    })

    let results = instructors
    console.log("INITIAL RESULTS COUNT:", results.length)

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (instructor) =>
          // Add null checks to prevent errors when properties are undefined
          instructor.name?.toLowerCase().includes(term) ||
          false ||
          instructor.description?.specialty?.toLowerCase().includes(term) ||
          false ||
          instructor.description?.bio?.toLowerCase().includes(term) ||
          false,
      )
      console.log("AFTER SEARCH TERM FILTER:", results.length)
    }

    // Apply category filter
    if (activeCategory !== "all") {
      if (activeCategory === "beginner") {
        results = results.filter((instructor) => instructor.description?.levels?.includes("Beginner") || false)
      } else if (activeCategory === "intermediate") {
        results = results.filter((instructor) => instructor.description?.levels?.includes("Intermediate") || false)
      } else if (activeCategory === "advanced") {
        results = results.filter((instructor) => instructor.description?.levels?.includes("Advanced") || false)
      }
      console.log("AFTER CATEGORY FILTER:", results.length)
    }

    // Apply style filter
    if (instructorFilters.style) {
      results = results.filter(
        (instructor) => instructor.description?.styles?.includes(instructorFilters.style) || false,
      )
    }

    // Apply level filter
    if (instructorFilters.level) {
      results = results.filter(
        (instructor) => instructor.description?.levels?.includes(instructorFilters.level) || false,
      )
    }

    // Apply lesson type filter
    if (instructorFilters.lessonType) {
      results = results.filter(
        (instructor) => instructor.description?.lessonType === instructorFilters.lessonType || false,
      )
    }

    // Apply certification filter
    if (instructorFilters.certification) {
      results = results.filter(
        (instructor) => instructor.description?.certification?.includes(instructorFilters.certification) || false,
      )
    }

    // Apply rating filter
    if (instructorFilters.minRating > 0) {
      results = results.filter((instructor) => (instructor.description?.rating || 0) >= instructorFilters.minRating)
    }

    // Apply price range filter
    if (instructorFilters.priceRange) {
      const [min, max] = instructorFilters.priceRange.split("-").map(Number)
      results = results.filter((instructor) => {
        const price = instructor.description?.price || 0
        return price >= min && (isNaN(max) || price <= max)
      })
    }

    // Apply distance filter
    if (instructorFilters.maxDistance > 0 && (userLocation || selectedLocation)) {
      const referenceLocation = selectedLocation || userLocation
      if (referenceLocation) {
        console.log("APPLYING DISTANCE FILTER:", {
          maxDistance: instructorFilters.maxDistance,
          referenceLocation,
        })

        const beforeCount = results.length
        results = results.filter((instructor) => {
          // Ensure instructor has location data with valid coordinates
          if (!instructor.description?.location?.lat || !instructor.description?.location?.lng) {
            return false
          }

          const distance = getDistance(
            referenceLocation.lat,
            referenceLocation.lng,
            instructor.description.location.lat,
            instructor.description.location.lng,
          )
          return distance <= instructorFilters.maxDistance
        })
        console.log("AFTER DISTANCE FILTER:", {
          before: beforeCount,
          after: results.length,
          filtered: beforeCount - results.length,
        })
      }
    }

    // Apply sorting
    console.log("APPLYING SORT:", sortOption)
    results = sortInstructors(results, sortOption)

    console.log("FINAL FILTERED RESULTS:", results.length)
    if (results.length > 0) {
      console.log("SAMPLE RESULT:", results[0])
    }

    setFilteredInstructors(results)
  }, [searchTerm, instructorFilters, instructors, userLocation, selectedLocation, sortOption, activeCategory])

  // Sort Instructors based on selected option
  const sortInstructors = (instructorList: Instructor[], option: string) => {
    console.log("SORTING INSTRUCTORS:", {
      count: instructorList.length,
      option,
    })

    const sorted = [...instructorList]

    switch (option) {
      case "rating":
        return sorted.sort((a, b) => (b.description?.rating || 0) - (a.description?.rating || 0))
      case "price_low":
        return sorted.sort((a, b) => (a.description?.price || 0) - (b.description?.price || 0))
      case "price_high":
        return sorted.sort((a, b) => (b.description?.price || 0) - (a.description?.price || 0))
      case "distance":
        if (userLocation || selectedLocation) {
          const referenceLocation = selectedLocation || userLocation
          if (referenceLocation) {
            console.log("SORTING BY DISTANCE:", referenceLocation)
            return sorted.sort((a, b) => {
              if (
                !a.description?.location?.lat ||
                !a.description?.location?.lng ||
                !b.description?.location?.lat ||
                !b.description?.location?.lng
              ) {
                return 0
              }

              const distanceA = getDistance(
                referenceLocation.lat,
                referenceLocation.lng,
                a.description.location.lat,
                a.description.location.lng,
              )
              const distanceB = getDistance(
                referenceLocation.lat,
                referenceLocation.lng,
                b.description.location.lat,
                b.description.location.lng,
              )
              return distanceA - distanceB
            })
          }
        }
        return sorted
      case "experience":
        return sorted.sort((a, b) => (b.description?.experience || 0) - (a.description?.experience || 0))
      case "relevance":
      default:
        return sorted
    }
  }

  const viewInstructorProfile = (id: number | string) => {
    console.log("NAVIGATING TO INSTRUCTOR PROFILE:", id)
    if (id) {
      router.push(`/allinstructor/${id}`)
    } else {
      console.error("Invalid instructor ID")
      // Optionally show an error message to the user
    }
  }

  // Check if any filters are active
  const hasActiveFilters = () => {
    return activeFilterCount > 0
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setInstructorFilters({
      style: "",
      level: "",
      lessonType: "",
      certification: "",
      minRating: 0,
      priceRange: "",
      maxDistance: 0,
    })
    setSelectedLocation(null)
    setShowMap(false)
    setActiveCategory("all")
  }

  // Scroll to results
  const scrollToResults = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const resultsCount = filteredInstructors.length

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle className={`mb-8 ${isDarkMode ? "text-white" : ""}`}>Find Swimming Instructors</SectionTitle>
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

  console.log("RENDERING INSTRUCTOR PAGE WITH:", {
    filteredInstructorsCount: filteredInstructors.length,
    viewMode,
    isDarkMode,
  })

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gradient-to-b from-blue-50 to-white"}`}>
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden ${
          isDarkMode ? "bg-gradient-to-r from-cyan-900 to-blue-900" : "bg-gradient-to-r from-cyan-600 to-blue-600"
        }`}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/wave-pattern.svg')] bg-repeat opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent"></div>

          {/* Floating Icons */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
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
              {i % 4 === 0 ? (
                <GraduationCap className="text-white/20 w-8 h-8 md:w-12 md:h-12" />
              ) : i % 4 === 1 ? (
                <Briefcase className="text-white/20 w-6 h-6 md:w-10 md:h-10" />
              ) : i % 4 === 2 ? (
                <Award className="text-white/20 w-8 h-8 md:w-14 md:h-14" />
              ) : (
                <Heart className="text-white/20 w-7 h-7 md:w-12 md:h-12" />
              )}
            </motion.div>
          ))}

          {/* Animated Bubbles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i + 100}
              className={`absolute rounded-full bg-white/20 backdrop-blur-sm`}
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ y: 100, opacity: 0 }}
              animate={{
                y: -100,
                opacity: [0, 0.5, 0],
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: Math.random() * 10 + 10,
                  delay: Math.random() * 5,
                },
              }}
            />
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
                <Award className="w-4 h-4 mr-2" /> Find Expert Swimming Instructors
              </motion.div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Discover Your Perfect <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10">Swimming Instructor</span>
                <motion.span
                  className="absolute bottom-2 left-0 w-full h-3 bg-cyan-400/30 rounded-lg -z-0"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                ></motion.span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              Connect with experienced instructors who can help you master swimming techniques, build water confidence,
              and achieve your aquatic goals.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <motion.div
                className={`relative ${searchFocused ? "ring-4 ring-cyan-300/30" : ""} transition-all duration-300 rounded-full shadow-lg`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or technique..."
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
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>

              {/* Active Filters Display */}
              <AnimatePresence>
                {hasActiveFilters() && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex flex-wrap items-center gap-2 justify-center"
                  >
                    <span className="text-white/70 text-sm">Active filters:</span>
                    {instructorFilters.style && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-cyan-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Style: {instructorFilters.style}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setInstructorFilters({ ...instructorFilters, style: "" })}
                        />
                      </motion.span>
                    )}
                    {instructorFilters.level && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-cyan-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Level: {instructorFilters.level}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setInstructorFilters({ ...instructorFilters, level: "" })}
                        />
                      </motion.span>
                    )}
                    {instructorFilters.lessonType && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-cyan-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Type: {instructorFilters.lessonType}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setInstructorFilters({ ...instructorFilters, lessonType: "" })}
                        />
                      </motion.span>
                    )}
                    {instructorFilters.minRating > 0 && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-cyan-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Rating: {instructorFilters.minRating}+
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setInstructorFilters({ ...instructorFilters, minRating: 0 })}
                        />
                      </motion.span>
                    )}
                    {instructorFilters.maxDistance > 0 && (
                      <motion.span
                        className="px-3 py-1 rounded-full text-xs bg-cyan-600/80 backdrop-blur-sm text-white flex items-center gap-1"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        Distance: {instructorFilters.maxDistance}km
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setInstructorFilters({ ...instructorFilters, maxDistance: 0 })}
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

            {/* Quick Filter Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  setInstructorFilters({ ...instructorFilters, level: "Beginner" })
                  scrollToResults()
                }}
              >
                <Users className="w-4 h-4 mr-2" /> Beginner Friendly
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  setInstructorFilters({ ...instructorFilters, minRating: 4.5 })
                  scrollToResults()
                }}
              >
                <Star className="w-4 h-4 mr-2" /> Top Rated
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  setInstructorFilters({ ...instructorFilters, style: "Freestyle" })
                  scrollToResults()
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" /> Freestyle Experts
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className={`relative block w-full h-12 sm:h-16 ${isDarkMode ? "text-slate-900" : "text-blue-50"}`}
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
              className={`rounded-full ${activeCategory === "all" ? "bg-cyan-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("all")}
            >
              <Users className="w-4 h-4 mr-2" /> All Instructors
            </div>
            <div
              className={`rounded-full ${activeCategory === "beginner" ? "bg-cyan-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("beginner")}
            >
              <Users className="mr-2" /> Beginner
            </div>
            <div
              className={`rounded-full ${activeCategory === "intermediate" ? "bg-cyan-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("intermediate")}
            >
              <Users className="mr-2" /> Intermediate
            </div>
            <div
              className={`rounded-full ${activeCategory === "advanced" ? "bg-cyan-600 text-white" : "bg-white text-gray-800 border border-gray-300"} px-4 py-2 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200`}
              onClick={() => setActiveCategory("advanced")}
            >
              <Users className="mr-2" /> Advanced
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
                    Filter Instructors
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
                        instructorFilters.minRating === 4.5
                          ? "bg-cyan-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setInstructorFilters({
                          ...instructorFilters,
                          minRating: instructorFilters.minRating === 4.5 ? 0 : 4.5,
                        })
                      }
                    >
                      <Star className="w-3 h-3 mr-1" /> Top Rated
                    </div>
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        instructorFilters.level === "Beginner"
                          ? "bg-cyan-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setInstructorFilters({
                          ...instructorFilters,
                          level: instructorFilters.level === "Beginner" ? "" : "Beginner",
                        })
                      }
                    >
                      <Users className="w-3 h-3 mr-1" /> Beginner Friendly
                    </div>
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        instructorFilters.lessonType === "Private"
                          ? "bg-cyan-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() =>
                        setInstructorFilters({
                          ...instructorFilters,
                          lessonType: instructorFilters.lessonType === "Private" ? "" : "Private",
                        })
                      }
                    >
                      Private Lessons
                    </div>
                    <div
                      className={`rounded-full px-3 py-1.5 text-sm font-medium flex items-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                        instructorFilters.maxDistance === 10
                          ? "bg-cyan-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-300 border border-slate-600"
                            : "bg-white text-gray-700 border border-gray-300"
                      }`}
                      onClick={() => {
                        if (instructorFilters.maxDistance === 10) {
                          setInstructorFilters({ ...instructorFilters, maxDistance: 0 })
                        } else {
                          getCurrentLocation()
                          setInstructorFilters({ ...instructorFilters, maxDistance: 10 })
                        }
                      }}
                    >
                      <MapPin className="w-3 h-3 mr-1" /> Nearby
                    </div>
                  </div>
                </div>

                <InstructorFiltersComponent filters={instructorFilters} setFilters={setInstructorFilters} />

                <div className={`mt-6 pt-6 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
                  <h4 className={`text-base font-medium mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                  </h4>
                  <LocationFilter
                    isLoadingLocation={isLoadingLocation}
                    locationError={locationError}
                    userLocation={userLocation}
                    selectedLocation={selectedLocation}
                    showMap={showMap}
                    maxDistance={instructorFilters.maxDistance}
                    searchType="instructor"
                    getCurrentLocation={getCurrentLocation}
                    toggleMap={toggleMap}
                    handleMapClick={handleMapClick}
                    mapCenter={mapCenter}
                    setMaxDistance={(distance) => {
                      setInstructorFilters({ ...instructorFilters, maxDistance: distance })
                    }}
                    instructorLocations={filteredInstructors
                      .filter((inst) => inst.description?.location?.lat && inst.description?.location?.lng)
                      .map((t) => ({
                        id: t.id,
                        name: t.name,
                        location: t.description?.location,
                      }))}
                  />
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
                {resultsCount} Instructors Found
              </h2>
              {searchTerm && (
                <span
                  className={`ml-3 px-3 py-1 rounded-full text-sm ${
                    isDarkMode ? "bg-slate-700 text-cyan-400" : "bg-blue-100 text-blue-800"
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
                        ? "bg-cyan-900 text-white"
                        : "bg-blue-50 text-blue-600"
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
                        ? "bg-cyan-900 text-white"
                        : "bg-blue-50 text-blue-600"
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
                  <option value="experience">Sort by: Experience</option>
                  {(userLocation || selectedLocation) && <option value="distance">Sort by: Distance</option>}
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
                    isDarkMode ? "bg-slate-700" : "bg-blue-50"
                  }`}
                >
                  <Search className={`h-10 w-10 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  No instructors found
                </h3>
                <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  We couldn't find any instructors matching your search criteria. Try adjusting your filters or search
                  term.
                </p>
                <Button variant={isDarkMode ? "gradient" : "primary"} onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </div>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                  onClick={() => viewInstructorProfile(instructor.id)}
                >
                  <InstructorCard
                    instructor={instructor}
                    isDarkMode={isDarkMode}
                    userLocation={userLocation || selectedLocation}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-12">
              {filteredInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md ${
                    isDarkMode ? "bg-slate-800 hover:bg-slate-750" : "bg-white hover:bg-gray-50"
                  } transition-all duration-300`}
                  onClick={() => viewInstructorProfile(instructor.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/4 h-48 md:h-auto">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20"></div>
                      <img
                        src={
                          instructor.profile_img || "/placeholder.svg?height=400&width=600&query=swimming instructor"
                        }
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
                          isDarkMode ? "bg-slate-900/80 text-white" : "bg-white/80 text-blue-800"
                        } backdrop-blur-sm`}
                      >
                        {instructor.description?.experience}+ years
                      </div>
                    </div>
                    <div className="p-5 md:w-3/4 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            {instructor.name}
                          </h3>
                          <p className={isDarkMode ? "text-cyan-400 font-medium" : "text-blue-600 font-medium"}>
                            {instructor.description?.specialty}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isDarkMode ? "bg-slate-700 text-green-400" : "bg-green-50 text-green-700"
                          }`}
                        >
                          ${instructor.description?.price}/hr
                        </div>
                      </div>

                      <p className={`mb-4 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {instructor.description?.bio ||
                          "Passionate swimming instructor with a focus on technique and confidence."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {instructor.description?.styles?.map((style, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? "bg-slate-700 text-cyan-300" : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {style}
                          </span>
                        ))}
                        {instructor.description?.lessonType && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode ? "bg-slate-700 text-purple-300" : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {instructor.description.lessonType} Lessons
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <MapPin className={isDarkMode ? "text-cyan-500 mr-2 h-4 w-4" : "text-red-500 mr-2 h-4 w-4"} />
                          <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                            {instructor.description?.location?.address || "Location not specified"}
                            {userLocation || selectedLocation ? (
                              <span className={isDarkMode ? "text-gray-400 ml-1" : "text-gray-500 ml-1"}>
                                {instructor.description?.location?.lat && instructor.description?.location?.lng ? (
                                  <>
                                    (
                                    {Math.round(
                                      getDistance(
                                        (userLocation || selectedLocation)!.lat,
                                        (userLocation || selectedLocation)!.lng,
                                        instructor.description.location.lat,
                                        instructor.description.location.lng,
                                      ),
                                    )}{" "}
                                    km away)
                                  </>
                                ) : null}
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <Button
                          variant={isDarkMode ? "outline" : "secondary"}
                          size="sm"
                          className={isDarkMode ? "border-slate-700" : ""}
                        >
                          View Profile
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
        {filteredInstructors.length > 0 && (
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

      {/* CSS for decorative elements */}
      <style jsx>{`
        .water-ripple {
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          animation: ripple 8s infinite;
          transform: scale(0);
        }
        
        .delay-0 { animation-delay: 0s; }
        .delay-1 { animation-delay: 2s; }
        .delay-2 { animation-delay: 4s; }
        .delay-3 { animation-delay: 6s; }
        .delay-4 { animation-delay: 8s; }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(6); opacity: 0; }
        }
        
        .mesh-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  )
}
