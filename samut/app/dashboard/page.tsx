"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronDown,
  Star,
  Edit,
  Info,
  Calendar,
  BarChart2,
  User,
  Settings,
  Plus,
  ArrowLeft,
  BookOpen,
  Camera,
  X,
  Save,
} from "lucide-react"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"
import ProgressTracker from "@/components/StudentProgress/ProgressTracker"
import MilestonesList, { type Milestone } from "@/components/StudentProgress/MilestonesList"
import WeeklyProgressList, { type WeeklyProgressItem } from "@/components/StudentProgress/WeeklyProgressList"
import StudentProgressCard from "@/components/StudentProgress/StudentProgressCard"
import ImageGalleryModal from "@/components/StudentProgress/ImageGalleryModal"
import CourseProgressOverview from "@/components/StudentProgress/CourseProgressOverview"
import type { CourseModule } from "@/types/course"

// Mock data for demonstration
const mockCourses = [
  {
    id: 1,
    title: "Freestyle Mastery",
    level: "Intermediate",
    schedule: "Mon/Wed 5-6pm",
    progress: 65,
    rating: 4.8,
    student: {
      id: 101,
      name: "Emma Johnson",
      image: "/diverse-female-student.png",
    },
    image: "/freestyle-swimming.png",
  },
  {
    id: 2,
    title: "Backstroke Fundamentals",
    level: "Beginner",
    schedule: "Tue/Thu 4-5pm",
    progress: 42,
    rating: 4.5,
    student: {
      id: 102,
      name: "Michael Chen",
      image: "/asian-male-student-portrait.png",
    },
    image: "/backstroke-swimming.png",
  },
  {
    id: 3,
    title: "Advanced Butterfly",
    level: "Advanced",
    schedule: "Fri 6-7:30pm",
    progress: 78,
    rating: 4.9,
    student: {
      id: 103,
      name: "Sophia Rodriguez",
      image: "/latina-student-portrait.png",
    },
    image: "/butterfly-swimming.png",
  },
  {
    id: 4,
    title: "Breaststroke Technique",
    level: "Intermediate",
    schedule: "Sat 10-11am",
    progress: 30,
    rating: 4.6,
    student: {
      id: 104,
      name: "James Wilson",
      image: "/african-american-student-portrait.png",
    },
    image: "/breaststroke-swimming.png",
  },
  {
    id: 5,
    title: "Water Safety & Basics",
    level: "Beginner",
    schedule: "Sun 9-10am",
    progress: 15,
    rating: 4.7,
    student: {
      id: 105,
      name: "Aisha Patel",
      image: "/indian-female-student-portrait.png",
    },
    image: "/water-safety-swimming.png",
  },
]

// Course modules data
const courseModules: CourseModule[] = [
  {
    id: 1,
    title: "Introduction & Water Safety",
    completion: 100,
    topics: [
      { id: 101, title: "Pool Safety Rules", completed: true },
      { id: 102, title: "Basic Water Comfort", completed: true },
      { id: 103, title: "Equipment Introduction", completed: true },
    ],
  },
  {
    id: 2,
    title: "Fundamental Techniques",
    completion: 75,
    topics: [
      { id: 201, title: "Proper Breathing", completed: true },
      { id: 202, title: "Body Position", completed: true },
      { id: 203, title: "Basic Arm Movement", completed: true },
      { id: 204, title: "Leg Kick Technique", completed: false },
    ],
  },
  {
    id: 3,
    title: "Stroke Development",
    completion: 33,
    topics: [
      { id: 301, title: "Freestyle Basics", completed: true },
      { id: 302, title: "Backstroke Introduction", completed: false },
      { id: 303, title: "Coordination Drills", completed: false },
    ],
  },
  {
    id: 4,
    title: "Advanced Techniques",
    completion: 0,
    topics: [
      { id: 401, title: "Stroke Refinement", completed: false },
      { id: 402, title: "Speed & Efficiency", completed: false },
      { id: 403, title: "Competitive Techniques", completed: false },
    ],
  },
]

// Weekly updates with progress information
const weeklyUpdates: WeeklyProgressItem[] = [
  {
    id: 1,
    week: 1,
    title: "Introduction to Freestyle",
    date: "5/10/2023",
    content: "Covered basic body positioning and water comfort. Students practiced floating and basic arm movements.",
    achievements: ["All students can float independently", "Some students struggling with breathing technique"],
    images: ["/swim-lesson-1-1.jpg", "/swim-lesson-1-2.png", "/swim-lesson-1-3.png"],
    progress: 100, // Completed
    progressItems: [
      { name: "Water Comfort", completed: true },
      { name: "Floating", completed: true },
      { name: "Basic Arm Movements", completed: true },
      { name: "Breathing Technique", completed: false },
    ],
  },
  {
    id: 2,
    week: 2,
    title: "Arm Movements & Breathing",
    date: "5/17/2023",
    content: "Focused on proper arm stroke technique and side breathing. Practiced with kickboards for stability.",
    achievements: ["Improved arm movement coordination", "Need more work on breathing rhythm"],
    images: ["/swim-lesson-2-1.png", "/swim-lesson-2-2.png"],
    progress: 75, // In progress
    progressItems: [
      { name: "Arm Stroke Technique", completed: true },
      { name: "Side Breathing", completed: true },
      { name: "Breathing Rhythm", completed: false },
      { name: "Full Stroke Coordination", completed: false },
    ],
  },
  {
    id: 3,
    week: 3,
    title: "Full Stroke Coordination",
    date: "5/24/2023",
    content: "Working on coordinating arm movements with breathing and kicking. Focus on timing and rhythm.",
    achievements: ["Good progress with full stroke sequence", "Working on increasing distance"],
    images: [],
    progress: 40, // Just started
    progressItems: [
      { name: "Arm-Breathing Coordination", completed: true },
      { name: "Kick-Arm Coordination", completed: false },
      { name: "Full Stroke Timing", completed: false },
      { name: "Distance Swimming", completed: false },
    ],
  },
]

// Skills assessment data
const skillsData = [
  { name: "Technique", progress: 70 },
  { name: "Endurance", progress: 65 },
  { name: "Speed", progress: 55 },
  { name: "Form", progress: 80 },
]

// Milestones data
const milestonesData: Milestone[] = [
  { name: "Basic Floating", completed: true, date: "May 3, 2023" },
  { name: "Kicking with Board", completed: true, date: "May 10, 2023" },
  { name: "Arm Stroke Technique", completed: true, date: "May 17, 2023" },
  { name: "Side Breathing", completed: false, date: "Upcoming" },
  { name: "Full Freestyle", completed: false, date: "Upcoming" },
]

export default function CourseManagementPage({ params }: { params: { courseId: string } }) {
  // Use the params directly since TypeScript doesn't recognize it as a Promise
  const courseId = Number.parseInt(params.courseId)
  const [activeTab, setActiveTab] = useState("progress") // Changed default tab to progress
  const [currentCourse, setCurrentCourse] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCourses, setFilteredCourses] = useState(mockCourses)
  const [updates, setUpdates] = useState(weeklyUpdates)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedUpdateForImages, setSelectedUpdateForImages] = useState<WeeklyProgressItem | null>(null)
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Form state for new update
  const [formData, setFormData] = useState<{
    week: number
    title: string
    date: string
    content: string
    achievements: string[]
    images: string[]
    progress: number
    progressItems: { name: string; completed: boolean }[]
  }>({
    week: weeklyUpdates.length > 0 ? weeklyUpdates[weeklyUpdates.length - 1].week + 1 : 1,
    title: "",
    date: new Date().toISOString().split("T")[0],
    content: "",
    achievements: ["", ""],
    images: [],
    progress: 0,
    progressItems: [
      { name: "", completed: false },
      { name: "", completed: false },
      { name: "", completed: false },
      { name: "", completed: false },
    ],
  })

  // Handle image preview and upload
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Find the current course based on the URL parameter
    const course = mockCourses.find((c) => c.id === courseId)
    if (course) {
      setCurrentCourse(course)
    } else if (mockCourses.length > 0 && !isNaN(courseId)) {
      // Only redirect if courseId is a valid number
      router.push(`/dashboard/courses/manage/${mockCourses[0].id}`)
    }
  }, [courseId, router])

  useEffect(() => {
    // Filter courses based on search query
    if (searchQuery.trim() === "") {
      setFilteredCourses(mockCourses)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredCourses(
        mockCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(query) ||
            course.student.name.toLowerCase().includes(query) ||
            course.level.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements]
    newAchievements[index] = value
    setFormData((prev) => ({
      ...prev,
      achievements: newAchievements,
    }))
  }

  const addAchievementField = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }))
  }

  const removeAchievementField = (index: number) => {
    const newAchievements = [...formData.achievements]
    newAchievements.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      achievements: newAchievements,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newPreviewImages: string[] = []
    const newImages: string[] = [...formData.images]

    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          newPreviewImages.push(reader.result)
          // In a real app, you'd upload to a server and get a URL
          // For demo, we'll just use the data URL
          newImages.push(reader.result)
          setPreviewImages([...previewImages, ...newPreviewImages])
          setFormData((prev) => ({
            ...prev,
            images: newImages,
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)

    const newPreviews = [...previewImages]
    newPreviews.splice(index, 1)

    setPreviewImages(newPreviews)
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  const handleProgressChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      progress: value,
    }))
  }

  const handleProgressItemNameChange = (index: number, value: string) => {
    const newProgressItems = [...formData.progressItems]
    newProgressItems[index] = { ...newProgressItems[index], name: value }
    setFormData((prev) => ({
      ...prev,
      progressItems: newProgressItems,
    }))
  }

  const handleProgressItemCompletedChange = (index: number, value: boolean) => {
    const newProgressItems = [...formData.progressItems]
    newProgressItems[index] = { ...newProgressItems[index], completed: value }

    // Calculate new progress percentage based on completed items
    const completedCount = newProgressItems.filter((item) => item.completed && item.name.trim() !== "").length
    const totalCount = newProgressItems.filter((item) => item.name.trim() !== "").length
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    setFormData((prev) => ({
      ...prev,
      progressItems: newProgressItems,
      progress: newProgress,
    }))
  }

  const addProgressItemField = () => {
    setFormData((prev) => ({
      ...prev,
      progressItems: [...prev.progressItems, { name: "", completed: false }],
    }))
  }

  const removeProgressItemField = (index: number) => {
    const newProgressItems = [...formData.progressItems]
    newProgressItems.splice(index, 1)

    // Recalculate progress
    const completedCount = newProgressItems.filter((item) => item.completed && item.name.trim() !== "").length
    const totalCount = newProgressItems.filter((item) => item.name.trim() !== "").length
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    setFormData((prev) => ({
      ...prev,
      progressItems: newProgressItems,
      progress: newProgress,
    }))
  }

  const submitForm = () => {
    // Filter out empty progress items
    const filteredProgressItems = formData.progressItems.filter((item) => item.name.trim() !== "")

    // Calculate final progress percentage
    const completedCount = filteredProgressItems.filter((item) => item.completed).length
    const finalProgress =
      filteredProgressItems.length > 0 ? Math.round((completedCount / filteredProgressItems.length) * 100) : 0

    const newUpdate: WeeklyProgressItem = {
      id: updates.length > 0 ? Math.max(...updates.map((u) => u.id)) + 1 : 1,
      week: formData.week,
      title: formData.title,
      date: formData.date,
      content: formData.content,
      achievements: formData.achievements.filter((a) => a.trim() !== ""),
      images: formData.images,
      progress: finalProgress,
      progressItems: filteredProgressItems,
    }

    setUpdates([...updates, newUpdate])

    // Reset form
    setFormData({
      week: newUpdate.week + 1,
      title: "",
      date: new Date().toISOString().split("T")[0],
      content: "",
      achievements: ["", ""],
      images: [],
      progress: 0,
      progressItems: [
        { name: "", completed: false },
        { name: "", completed: false },
        { name: "", completed: false },
        { name: "", completed: false },
      ],
    })
    setPreviewImages([])
    setIsModalOpen(false)
  }

  const openImageGallery = (update: WeeklyProgressItem, index: number) => {
    setSelectedUpdateForImages(update)
    setSelectedImageIndex(index)
  }

  const closeImageGallery = () => {
    setSelectedUpdateForImages(null)
    setSelectedImageIndex(null)
  }

  const navToNextImage = () => {
    if (selectedUpdateForImages && selectedImageIndex !== null) {
      const nextIndex = (selectedImageIndex + 1) % selectedUpdateForImages.images.length
      setSelectedImageIndex(nextIndex)
    }
  }

  const navToPrevImage = () => {
    if (selectedUpdateForImages && selectedImageIndex !== null) {
      const prevIndex =
        (selectedImageIndex - 1 + selectedUpdateForImages.images.length) % selectedUpdateForImages.images.length
      setSelectedImageIndex(prevIndex)
    }
  }

  // Add a fallback for invalid courseId
  if (isNaN(courseId)) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}
      >
        <div className="text-xl font-bold mb-4">Invalid Course ID</div>
        <p className="mb-6">The course ID provided is not valid.</p>
        <Button
          variant={isDarkMode ? "gradient" : "primary"}
          onClick={() => router.push("/dashboard")}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Dashboard
        </Button>
      </div>
    )
  }

  // Loading state
  if (!currentCourse) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      {/* Back button and page title */}
      <div
        className={`sticky top-0 z-30 ${isDarkMode ? "bg-slate-900 border-b border-slate-800" : "bg-white border-b border-gray-200"} shadow-sm`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Course Management</h1>
          </div>

          {/* Course Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                  : "bg-white hover:bg-gray-50 border border-gray-200 shadow-sm"
              }`}
            >
              <span>Switch Course</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-96 rounded-lg shadow-lg z-50 overflow-hidden ${
                  isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
                }`}
              >
                <div className={`p-3 ${isDarkMode ? "border-b border-slate-700" : "border-b border-gray-200"}`}>
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                  >
                    <Search className="w-4 h-4 mr-2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search courses or students..."
                      className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder:text-gray-400" : "text-gray-800 placeholder:text-gray-500"}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-gray-500 hover:text-gray-700">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No courses found</div>
                  ) : (
                    filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => {
                          router.push(`/dashboard/courses/manage/${course.id}`)
                          setIsDropdownOpen(false)
                        }}
                        className={`flex items-center p-3 cursor-pointer ${
                          course.id === currentCourse.id
                            ? isDarkMode
                              ? "bg-slate-700"
                              : "bg-blue-50"
                            : isDarkMode
                              ? "hover:bg-slate-700"
                              : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Student Image - Prominently displayed */}
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                          <Image
                            src={course.student.image || "/placeholder.svg"}
                            alt={course.student.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="ml-3 flex-grow">
                          {/* Student Name - Made Outstanding */}
                          <h3 className={`font-bold text-lg ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                            {course.student.name}
                          </h3>

                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {course.title} • {course.level}
                            </span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-xs">{course.rating}</span>
                            </div>
                          </div>

                          <div className="w-full mt-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div
                  className={`p-3 ${isDarkMode ? "border-t border-slate-700 bg-slate-800" : "border-t border-gray-200 bg-gray-50"}`}
                >
                  <button
                    className={`w-full py-2 rounded-lg flex items-center justify-center ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span>Add New Course</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Header with Student Focus */}
      <div className={`${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-md`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Student Image - Prominently displayed */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-blue-500 flex-shrink-0 shadow-lg">
              <Image
                src={currentCourse.student.image || "/placeholder.svg"}
                alt={currentCourse.student.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-grow">
              {/* Student Name - Made Outstanding */}
              <h2 className={`text-2xl md:text-3xl font-bold mb-1 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                {currentCourse.student.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                <h3 className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {currentCourse.title}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-slate-700 text-cyan-300" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {currentCourse.level}
                </span>
                <span className={`flex items-center text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <Calendar className="w-4 h-4 mr-1" />
                  {currentCourse.schedule}
                </span>
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{currentCourse.rating}</span>
                </span>
              </div>

              <div className="w-full mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Course Progress
                  </span>
                  <span className={`text-sm font-medium ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                    {currentCourse.progress}%
                  </span>
                </div>
                <div className={`w-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} rounded-full h-2.5`}>
                  <div
                    className={`${isDarkMode ? "bg-cyan-500" : "bg-blue-600"} h-2.5 rounded-full`}
                    style={{ width: `${currentCourse.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Course Image - Added as requested */}
            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden shadow-md border-2 border-gray-200">
              <Image
                src={currentCourse.image || "/placeholder.svg"}
                alt={currentCourse.title}
                fill
                className="object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isDarkMode ? "from-slate-900/80 to-transparent" : "from-black/30 to-transparent"
                }`}
              ></div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant={isDarkMode ? "outline" : "secondary"} size="sm" icon={<Info className="w-4 h-4" />}>
                Details
              </Button>
              <Button variant={isDarkMode ? "gradient" : "primary"} size="sm" icon={<Edit className="w-4 h-4" />}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        className={`sticky top-14 z-20 ${isDarkMode ? "bg-slate-900 border-b border-slate-800" : "bg-gray-50 border-b border-gray-200"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "progress"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Progress Tracking
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "weekly"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Weekly Updates
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "student"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Student Details
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 flex items-center whitespace-nowrap ${
                activeTab === "settings"
                  ? isDarkMode
                    ? "border-b-2 border-cyan-500 text-cyan-400 font-medium"
                    : "border-b-2 border-blue-600 text-blue-600 font-medium"
                  : isDarkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Course Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === "progress" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Progress Tracking</h2>
            </div>

            {/* Course Progress Overview - New Component */}
            <CourseProgressOverview
              courseName={currentCourse.title}
              studentName={currentCourse.student.name}
              overallProgress={currentCourse.progress}
              modules={courseModules}
              lastUpdated={new Date().toISOString()}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <ProgressTracker
                skills={skillsData}
                overallProgress={currentCourse.progress}
                lastUpdated={new Date().toISOString()}
              />

              <MilestonesList milestones={milestonesData} />
            </div>
          </div>
        )}

        {activeTab === "weekly" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Weekly Lesson Updates
              </h2>
              <Button
                variant={isDarkMode ? "gradient" : "primary"}
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Weekly Update
              </Button>
            </div>

            <WeeklyProgressList updates={updates} onViewImage={openImageGallery} />
          </div>
        )}

        {activeTab === "student" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Student Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Profile Card */}
              <StudentProgressCard
                studentName={currentCourse.student.name}
                studentImage={currentCourse.student.image}
                studentId={currentCourse.student.id.toString()}
                attendance={92}
                progress={currentCourse.progress}
                onViewFullProfile={() => console.log("View full profile")}
              />

              {/* Progress Summary */}
              <div className="col-span-2">
                <ProgressTracker
                  skills={skillsData}
                  overallProgress={currentCourse.progress}
                  lastUpdated={new Date().toISOString()}
                />
              </div>

              {/* Recent Notes */}
              <div
                className={`col-span-1 ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} rounded-lg shadow-sm p-6`}
              >
                <h3
                  className={`text-lg font-bold mb-4 flex items-center ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Notes
                </h3>

                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Breathing Technique</span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>May 17, 2023</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Emma is making good progress with side breathing but needs more practice with timing.
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Arm Stroke</span>
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>May 10, 2023</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Excellent improvement in arm movement coordination. Recovery phase is now much smoother.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant={isDarkMode ? "outline" : "secondary"}
                    className="w-full"
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add New Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Course Settings</h2>
              <Button variant={isDarkMode ? "gradient" : "primary"} size="sm" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-lg ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} shadow-sm`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Course Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={currentCourse.title}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Level
                    </label>
                    <select
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    >
                      <option>Beginner</option>
                      <option selected>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Schedule
                    </label>
                    <input
                      type="text"
                      value={currentCourse.schedule}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Course Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={currentCourse.image || "/placeholder.svg"}
                          alt={currentCourse.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button variant={isDarkMode ? "outline" : "secondary"} size="sm">
                        Change Image
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-6 rounded-lg ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} shadow-sm`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Student Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={currentCourse.student.name}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Student Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                        <Image
                          src={currentCourse.student.image || "/placeholder.svg"}
                          alt={currentCourse.student.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button variant={isDarkMode ? "outline" : "secondary"} size="sm">
                        Change Image
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Contact Information
                    </label>
                    <input
                      type="email"
                      placeholder="Email address"
                      className={`w-full px-3 py-2 rounded-lg mb-2 ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {selectedUpdateForImages && selectedImageIndex !== null && (
        <ImageGalleryModal
          images={selectedUpdateForImages.images}
          currentIndex={selectedImageIndex}
          onClose={closeImageGallery}
          onNext={navToNextImage}
          onPrevious={navToPrevImage}
          title={`Week ${selectedUpdateForImages.week}: ${selectedUpdateForImages.title}`}
        />
      )}

      {/* Add Weekly Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div
            className={`relative z-10 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
            } rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Add Weekly Update
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-2 rounded-full ${
                    isDarkMode ? "hover:bg-slate-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Week Number
                    </label>
                    <input
                      type="number"
                      name="week"
                      value={formData.week}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Arm Movements & Breathing"
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Lesson Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe what was covered in this lesson..."
                    className={`w-full px-3 py-2 rounded-lg ${
                      isDarkMode
                        ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"}`}
                  ></textarea>
                </div>

                {/* Progress Items */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Progress Items
                    </label>
                    <button
                      type="button"
                      onClick={addProgressItemField}
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkMode
                          ? "bg-slate-700 hover:bg-slate-600 text-cyan-400"
                          : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                      }`}
                    >
                      + Add Item
                    </button>
                  </div>

                  {formData.progressItems.map((item, index) => (
                    <div key={index} className="flex items-center mb-2 gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => handleProgressItemCompletedChange(index, e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleProgressItemNameChange(index, e.target.value)}
                        placeholder="Progress item name..."
                        className={`flex-grow px-3 py-2 rounded-lg ${
                          isDarkMode
                            ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                            : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:outline-none focus:ring-1 ${
                          isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"
                        }`}
                      />
                      {formData.progressItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProgressItemField(index)}
                          className={`p-2 rounded-full ${
                            isDarkMode ? "hover:bg-slate-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center mt-2">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Overall Progress
                        </span>
                        <span className={`text-xs font-medium ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                          {formData.progress}%
                        </span>
                      </div>
                      <div className={`w-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} rounded-full h-1.5`}>
                        <div
                          className={`h-1.5 rounded-full ${
                            formData.progress === 100
                              ? isDarkMode
                                ? "bg-green-500"
                                : "bg-green-600"
                              : isDarkMode
                                ? "bg-cyan-500"
                                : "bg-blue-600"
                          }`}
                          style={{ width: `${formData.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Achievements & Challenges
                    </label>
                    <button
                      type="button"
                      onClick={addAchievementField}
                      className={`text-xs px-2 py-1 rounded ${
                        isDarkMode
                          ? "bg-slate-700 hover:bg-slate-600 text-cyan-400"
                          : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                      }`}
                    >
                      + Add
                    </button>
                  </div>

                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, e.target.value)}
                        placeholder={index % 2 === 0 ? "Achievement..." : "Challenge..."}
                        className={`flex-grow px-3 py-2 rounded-lg ${
                          isDarkMode
                            ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                            : "bg-white border border-gray-300 text-gray-900 focus:border-blue-500"
                        } focus:outline-none focus:ring-1 ${
                          isDarkMode ? "focus:ring-cyan-500" : "focus:ring-blue-500"
                        }`}
                      />
                      {formData.achievements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAchievementField(index)}
                          className={`ml-2 p-2 rounded-full ${
                            isDarkMode ? "hover:bg-slate-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                          }`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Add both achievements and challenges to track student progress
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Lesson Images
                  </label>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {previewImages.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden border dark:border-gray-700"
                      >
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Preview image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    <label
                      className={`aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer ${
                        isDarkMode
                          ? "border-gray-600 hover:border-gray-500 bg-slate-700/50"
                          : "border-gray-300 hover:border-gray-400 bg-gray-50"
                      } transition-colors duration-300`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Camera className={`text-2xl mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Add Images</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div
              className={`px-6 py-4 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"} flex justify-end`}
            >
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant={isDarkMode ? "gradient" : "primary"}
                  onClick={submitForm}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
