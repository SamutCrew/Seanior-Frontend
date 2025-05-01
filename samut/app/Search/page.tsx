"use client"

import { useState, useEffect } from "react"

import { SearchHeader } from "@/components/Searchpage/SearchHeader"
import { LocationFilter } from "@/components/Searchpage/LocationFilter"
import { ResultsSection } from "@/components/Searchpage/ResultsSection"
import { TeacherFiltersComponent } from "@/components/Searchpage/TeacherFilters"
import { CourseFiltersComponent } from "@/components/Searchpage/CourseFilters"
import type { Teacher, Course, TeacherFilters, CourseFilters, Location } from "@/types/teacher"
import { fetchTeachers, fetchCourses } from "@/api/teacherCourseApi"

// Dynamically import the Map component

// Helper function to calculate distance between two coordinates (in km)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

const SearchPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"teacher" | "course">("teacher")

  const [teacherFilters, setTeacherFilters] = useState<TeacherFilters>({
    style: "",
    level: "",
    lessonType: "",
    certification: "",
    minRating: 0,
    priceRange: "",
    maxDistance: 0,
  })

  const [courseFilters, setCourseFilters] = useState<CourseFilters>({
    focus: "",
    level: "",
    duration: "",
    schedule: "",
    minRating: 0,
    priceRange: "",
    maxDistance: 0,
  })

  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 })

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
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
        setUserLocation(location)
        setSelectedLocation(location)
        setMapCenter({ lat: location.lat, lng: location.lng })
        setIsLoadingLocation(false)
      },
      (error) => {
        setLocationError("Unable to retrieve your location")
        setIsLoadingLocation(false)
      },
    )
  }

  // Handle map click to select a new location
  const handleMapClick = (location: { lat: number; lng: number }) => {
    const newLocation = {
      lat: location.lat,
      lng: location.lng,
      address: "Selected location",
    };
    setSelectedLocation(newLocation);
    setUserLocation(newLocation);
    setMapCenter({ lat: location.lat, lng: location.lng });
  };

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap)
    if (!showMap && userLocation) {
      setMapCenter({ lat: userLocation.lat, lng: userLocation.lng })
    }
  }

  // Filter teachers based on search term and filters
  const filteredTeachers = teachers.filter((teacher) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = teacher.name.toLowerCase().includes(term) || teacher.description.specialty.toLowerCase().includes(term)

    const matchesStyle = teacherFilters.style === "" || teacher.description.styles.includes(teacherFilters.style)
    const matchesLevel = teacherFilters.level === "" || teacher.description.levels.includes(teacherFilters.level)
    const matchesLessonType = teacherFilters.lessonType === "" || teacher.description.lessonType === teacherFilters.lessonType
    const matchesCertification =
      teacherFilters.certification === "" || teacher.description.certification.includes(teacherFilters.certification)
    const matchesRating = teacher.description.rating >= teacherFilters.minRating

    // Price range filter
    let matchesPrice = true
    if (teacherFilters.priceRange) {
      const [min, max] = teacherFilters.priceRange.split("-").map(Number)
      matchesPrice = teacher.description.price >= min && (isNaN(max) || teacher.description.price <= max)
    }

    // Distance filter
    let matchesDistance = true
    if (teacherFilters.maxDistance > 0 && userLocation) {
      const distance = getDistance(userLocation.lat, userLocation.lng, teacher.description.location.lat, teacher.description.location.lng)
      matchesDistance = distance <= teacherFilters.maxDistance
    }

    return (
      matchesSearch &&
      matchesStyle &&
      matchesLevel &&
      matchesLessonType &&
      matchesCertification &&
      matchesRating &&
      matchesPrice &&
      matchesDistance
    )
  })

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = course.title.toLowerCase().includes(term) || course.focus.toLowerCase().includes(term)

    const matchesFocus = courseFilters.focus === "" || course.focus === courseFilters.focus
    const matchesLevel = courseFilters.level === "" || course.level === courseFilters.level
    const matchesDuration = courseFilters.duration === "" || course.duration === courseFilters.duration
    const matchesSchedule = courseFilters.schedule === "" || course.schedule.includes(courseFilters.schedule)
    const matchesRating = course.rating >= courseFilters.minRating

    // Price range filter
    let matchesPrice = true
    if (courseFilters.priceRange) {
      const [min, max] = courseFilters.priceRange.split("-").map(Number)
      matchesPrice = course.price >= min && (isNaN(max) || course.price <= max)
    }

    // Distance filter
    let matchesDistance = true
    if (courseFilters.maxDistance > 0 && userLocation) {
      const distance = getDistance(userLocation.lat, userLocation.lng, course.location.lat, course.location.lng)
      matchesDistance = distance <= courseFilters.maxDistance
    }

    return (
      matchesSearch &&
      matchesFocus &&
      matchesLevel &&
      matchesDuration &&
      matchesSchedule &&
      matchesRating &&
      matchesPrice &&
      matchesDistance
    )
  })

  const resultsCount = searchType === "teacher" ? filteredTeachers.length : filteredCourses.length
  const resultsText = searchType === "teacher" ? "Teachers" : "Courses"

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teacherData] = await Promise.all([
          fetchTeachers(),
          // fetchCourses(),
        ])
        setTeachers(teacherData)
        // setCourses(courseData)
      console.log("Teachers:", teacherData)
      } catch (err) {
        console.error("Error loading teachers or courses:", err)
      }
    }
  
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <br />
      <br />
      <br />
      <div className="max-w-7xl mx-auto mt-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Swimming Instructors & Courses</h1>
          <p className="text-lg text-gray-600">Discover the perfect swimming teacher or program for your needs</p>
        </div>

        <SearchHeader
          searchType={searchType}
          setSearchType={setSearchType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resultsCount={resultsCount}
          resultsText={resultsText}
        />

        {/* Filters Section */}
        <div className="mb-8 p-4 rounded-lg shadow-sm bg-white">
          <div className="flex items-center mb-4">
            <h3 className="font-medium text-gray-700">Filters</h3>
          </div>

          {searchType === "teacher" ? (
            <TeacherFiltersComponent filters={teacherFilters} setFilters={setTeacherFilters} />
          ) : (
            <CourseFiltersComponent filters={courseFilters} setFilters={setCourseFilters} />
          )}

          <LocationFilter
            isLoadingLocation={isLoadingLocation}
            locationError={locationError}
            userLocation={userLocation}
            selectedLocation={selectedLocation}
            showMap={showMap}
            maxDistance={searchType === "teacher" ? teacherFilters.maxDistance : courseFilters.maxDistance}
            searchType={searchType}
            getCurrentLocation={getCurrentLocation}
            toggleMap={toggleMap}
            handleMapClick={handleMapClick}
            mapCenter={mapCenter}
            setMaxDistance={(distance) => {
              searchType === "teacher"
                ? setTeacherFilters({ ...teacherFilters, maxDistance: distance })
                : setCourseFilters({ ...courseFilters, maxDistance: distance })
            }}
            teacherLocations={filteredTeachers.map(t => ({
              id: t.id,
              name: t.name,
              location: t.description.location,
            }))}
            courseLocations={filteredCourses.map(c => ({
              id: c.id,
              name: c.title,
              location: c.location,
            }))}
          />
        </div>

        <ResultsSection
          resultsCount={resultsCount}
          resultsText={resultsText}
          searchType={searchType}
          filteredTeachers={filteredTeachers}
          filteredCourses={filteredCourses}
        />
      </div>
    </div>
  )
}

export default SearchPage