"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"
import { createCourse } from "@/api/course_api"
import { AlertType } from "@/types/AlertTypes"
import AlertResponse from "@/components/Responseback/AlertResponse"
import { motion, AnimatePresence } from "framer-motion"
import OSMMapSelector from "@/components/Searchpage/OSMMAPSelector"
import { uploadProfileImage } from "@/api/resource_api"
import { useAuth } from "@/context/AuthContext"
import {
  Calendar,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  MapPin,
  PocketIcon as Pool,
  Upload,
  Trash2,
  Plus,
  X,
  Info,
  User,
  Map,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Save,
  ImageIcon as ImageIcon2,
  Loader2,
  Eye,
  XCircle,
  FileImage,
  UploadCloud,
  Pencil,
  RefreshCw,
} from "lucide-react"

// Define a utility function for conditional class names
// This replaces the need for the cn function from @/lib/utils
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Course>) => void
  stats: {
    totalCourses: number
    totalStudents: number
    avgRating: string
    totalRevenue: number
  }
}

// Define a type for the database-style course data
interface CourseDbData {
  course_name: string
  pool_type: string
  location: string
  description: string
  course_duration: number
  study_frequency: string
  days_study: number
  number_of_total_sessions: number
  course_image: string
  course_gallery?: string[] // For multiple images
  level: string
  max_students: number
  price: number
  rating: number
  schedule: string
  students: number
  created_at: string
  updated_at: string
  instructor: {
    connect: {
      user_id: string
    }
  }
}

// Define a type for schedule items
interface ScheduleItem {
  day: string
  startTime: string
  endTime: string
}

// Define a type for image data
interface ImageData {
  id: string
  file: File | null
  preview: string
  name: string
  size: number
  type: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
  isDefault?: boolean
}

// Default images for courses
const DEFAULT_COURSE_IMAGES = ["swimming-course-1.jpg", "swimming-course-2.jpg", "swimming-course-3.jpg", "default.jpg"]

// Define steps for the wizard
type Step = "basicInfo" | "schedule" | "pricing" | "media"

export default function CreateCourseModal({ isOpen, onClose, onSubmit, stats }: CreateCourseModalProps) {
  // Get user from Auth context
  const { user } = useAuth()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiDebugInfo, setApiDebugInfo] = useState<any>(null)

  // Step wizard state
  const [currentStep, setCurrentStep] = useState<Step>("basicInfo")
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())

  // Steps configuration
  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "basicInfo", label: "Basic Info", icon: <Info className="h-4 w-4" /> },
    { id: "schedule", label: "Schedule", icon: <Calendar className="h-4 w-4" /> },
    { id: "pricing", label: "Pricing", icon: <DollarSign className="h-4 w-4" /> },
    { id: "media", label: "Media", icon: <Camera className="h-4 w-4" /> },
  ]

  // Get a random default image
  const getRandomImage = useCallback(() => {
    const randomImage = DEFAULT_COURSE_IMAGES[Math.floor(Math.random() * DEFAULT_COURSE_IMAGES.length)]
    return randomImage
  }, [])

  // Form state
  const [courseName, setCourseName] = useState("")
  const [poolType, setPoolType] = useState("")
  const [location, setLocation] = useState("")
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [description, setDescription] = useState("")
  const [courseDuration, setCourseDuration] = useState("")
  const [studyFrequency, setStudyFrequency] = useState("")
  const [numberOfTotalSessions, setNumberOfTotalSessions] = useState("")
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{ day: "", startTime: "", endTime: "" }])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Default values for removed fields
  const maxStudents = "10"
  const students = "0"
  const rating = "4.0"

  // Form section expansion state
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    scheduleDetails: true,
    enrollment: true,
    media: false,
    debug: false,
  })

  // New image upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const poolFileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPoolDragging, setIsPoolDragging] = useState(false)
  const [mainImage, setMainImage] = useState<ImageData | null>(null)
  const [poolImage, setPoolImage] = useState<ImageData | null>(null)
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([])
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [useDefaultImage, setUseDefaultImage] = useState(true)
  const [defaultImageUrl, setDefaultImageUrl] = useState(getRandomImage())
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // Add this ref near the other state declarations
  const initializedRef = useRef(false)

  // 1. Remove the automatic default image initialization effect
  // Find and remove this useEffect:
  // useEffect(() => {
  //   if (useDefaultImage && !mainImage) {
  //     const defaultImage: ImageData = {
  //       id: "default-" + Date.now(),
  //       file: null,
  //       preview: defaultImageUrl,
  //       name: "Default Image",
  //       size: 0,
  //       type: "image/jpeg",
  //       status: "success",
  //       progress: 100,
  //       isDefault: true,
  //     }
  //     setMainImage(defaultImage)
  //   }
  // }, [useDefaultImage, defaultImageUrl, mainImage])

  // 2. Replace it with a more controlled initialization that only runs once when the modal opens
  // Add this useEffect instead:
  useEffect(() => {
    // Only initialize default image when modal first opens
    if (isOpen && !mainImage && !initializedRef.current) {
      initializedRef.current = true
      if (useDefaultImage) {
        // Don't set the image yet, just prepare the URL
        setDefaultImageUrl(getRandomImage())
      }
    }
  }, [isOpen, mainImage, useDefaultImage, getRandomImage])

  // Auto-save functionality
  useEffect(() => {
    // Load saved draft if available
    const savedDraft = localStorage.getItem("courseFormDraft")
    if (savedDraft && isOpen) {
      try {
        const parsedDraft = JSON.parse(savedDraft)

        // Only restore if the form is empty (new course)
        if (!courseName && !description) {
          setCourseName(parsedDraft.courseName || "")
          setPoolType(parsedDraft.poolType || "")
          setLocation(parsedDraft.location || "")
          setDescription(parsedDraft.description || "")
          setCourseDuration(parsedDraft.courseDuration || "")
          setStudyFrequency(parsedDraft.studyFrequency || "")
          setNumberOfTotalSessions(parsedDraft.numberOfTotalSessions || "")
          setPrice(parsedDraft.price || "")
          setLevel(parsedDraft.level || "")

          if (parsedDraft.scheduleItems && parsedDraft.scheduleItems.length > 0) {
            setScheduleItems(parsedDraft.scheduleItems)
          }
        }
      } catch (e) {
        console.error("Error parsing saved draft:", e)
      }
    }

    // Set up auto-save interval
    const interval = setInterval(() => {
      if (courseName || description || poolType) {
        const formData = {
          courseName,
          poolType,
          location,
          description,
          courseDuration,
          studyFrequency,
          numberOfTotalSessions,
          price,
          level,
          scheduleItems,
        }
        localStorage.setItem("courseFormDraft", JSON.stringify(formData))
        console.log("Form draft auto-saved")
      }
    }, 30000) // Save every 30 seconds

    return () => clearInterval(interval)
  }, [
    isOpen,
    courseName,
    poolType,
    location,
    description,
    courseDuration,
    studyFrequency,
    numberOfTotalSessions,
    price,
    level,
    scheduleItems,
  ])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts if modal is open
      if (!isOpen) return

      // Next step: Ctrl+Right or Alt+Right
      if ((e.ctrlKey || e.altKey) && e.key === "ArrowRight") {
        e.preventDefault()
        if (currentStep !== "media") {
          goToNextStep()
        }
      }

      // Previous step: Ctrl+Left or Alt+Left
      if ((e.ctrlKey || e.altKey) && e.key === "ArrowLeft") {
        e.preventDefault()
        if (currentStep !== "basicInfo") {
          goToPreviousStep()
        }
      }

      // Submit form: Ctrl+Enter
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        if (!isSubmitting) {
          document.getElementById("submit-course-form")?.click()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentStep, isSubmitting])

  // Toggle section expansion
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  // Handle location selection from map
  const handleLocationSelect = useCallback((coords: { lat: number; lng: number }) => {
    setLocationCoords(coords)
    setLocation(`Latitude: ${coords.lat.toFixed(6)}, Longitude: ${coords.lng.toFixed(6)}`)
  }, [])

  // Form validation
  const validateBasicInfo = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!courseName.trim()) newErrors.courseName = "Course name is required"
    if (!poolType) newErrors.poolType = "Pool type is required"

    // Only validate location if not students pool
    if (poolType !== "students_pool" && !location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!description.trim()) newErrors.description = "Description is required"
    if (!level) newErrors.level = "Level is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [courseName, poolType, location, description, level])

  const validateSchedule = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!courseDuration) {
      newErrors.courseDuration = "Course duration is required"
    } else if (isNaN(Number(courseDuration)) || Number(courseDuration) <= 0) {
      newErrors.courseDuration = "Must be a positive number"
    }

    if (!numberOfTotalSessions) {
      newErrors.numberOfTotalSessions = "Total sessions is required"
    } else if (isNaN(Number(numberOfTotalSessions)) || Number(numberOfTotalSessions) <= 0) {
      newErrors.numberOfTotalSessions = "Must be a positive number"
    }

    // Validate schedule items
    const hasValidSchedule = scheduleItems.some((item) => item.day && item.startTime && item.endTime)
    if (!hasValidSchedule) {
      newErrors.schedule = "At least one complete schedule is required"
    }

    if (!studyFrequency) {
      newErrors.studyFrequency = "Study frequency is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [courseDuration, numberOfTotalSessions, scheduleItems, studyFrequency])

  const validatePricing = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!price) {
      newErrors.price = "Price is required"
    } else if (isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = "Must be a non-negative number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [price])

  const validateMedia = useCallback(() => {
    const newErrors: Record<string, string> = {}

    // Require at least one image (main image)
    if (!mainImage) {
      newErrors.mainImage = "A main course image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [mainImage])

  const validateForm = useCallback(() => {
    // Validate all sections
    const basicInfoValid = validateBasicInfo()
    const scheduleValid = validateSchedule()
    const pricingValid = validatePricing()
    const mediaValid = validateMedia()

    return basicInfoValid && scheduleValid && pricingValid && mediaValid
  }, [validateBasicInfo, validateSchedule, validatePricing, validateMedia])

  // Step navigation
  const goToNextStep = useCallback(() => {
    let isValid = false

    // Validate current step
    switch (currentStep) {
      case "basicInfo":
        isValid = validateBasicInfo()
        break
      case "schedule":
        isValid = validateSchedule()
        break
      case "pricing":
        isValid = validatePricing()
        break
      case "media":
        isValid = validateMedia()
        break
    }

    if (isValid) {
      // Mark current step as completed
      setCompletedSteps((prev) => {
        const updated = new Set(prev)
        updated.add(currentStep)
        return updated
      })

      // Move to next step
      const currentIndex = steps.findIndex((step) => step.id === currentStep)
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].id)
      }
    }
  }, [currentStep, validateBasicInfo, validateSchedule, validatePricing, validateMedia, steps])

  const goToPreviousStep = useCallback(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }, [currentStep, steps])

  // Also update the goToStep function to make navigation more intuitive
  const goToStep = useCallback(
    (step: Step) => {
      // Allow going to any step that is completed
      if (completedSteps.has(step)) {
        setCurrentStep(step)
        return
      }

      // Allow going to the next incomplete step if all previous steps are completed
      const stepIndex = steps.findIndex((s) => s.id === step)
      const previousSteps = steps.slice(0, stepIndex)
      const allPreviousCompleted = previousSteps.every((s) => completedSteps.has(s.id))

      if (allPreviousCompleted) {
        setCurrentStep(step)
      }
    },
    [completedSteps, steps],
  )

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    // Reset form state
    setCourseName("")
    setPoolType("")
    setLocation("")
    setLocationCoords(null)
    setDescription("")
    setCourseDuration("")
    setStudyFrequency("")
    setNumberOfTotalSessions("")
    setLevel("")
    setPrice("")
    setScheduleItems([{ day: "", startTime: "", endTime: "" }])

    // 5. Simplify the handleClose function to properly reset state
    // Find the handleClose function and update the image reset logic:
    // Reset image state
    setMainImage(null)
    setPoolImage(null)
    setGalleryImages([])
    setUseDefaultImage(true)
    setDefaultImageUrl(getRandomImage())
    initializedRef.current = false

    // Reset other state
    setErrors({})
    setError(null)
    setSuccess(null)
    setIsSubmitting(false)
    setApiDebugInfo(null)

    // Reset step wizard
    setCurrentStep("basicInfo")
    setCompletedSteps(new Set())

    // Clear auto-saved draft if form is successfully submitted
    if (success) {
      localStorage.removeItem("courseFormDraft")
    }

    // Close the modal
    onClose()
  }, [getRandomImage, onClose, success])

  // Helper function to convert database-style object to Course type
  const mapDbDataToCourse = useCallback(
    (dbData: CourseDbData): Partial<Course> => {
      // Parse the schedule JSON string back to an array for display
      let scheduleArray: string[] = []
      try {
        scheduleArray = JSON.parse(dbData.schedule)
      } catch (e) {
        console.error("Error parsing schedule JSON:", e)
        scheduleArray = []
      }

      return {
        id: 0, // This will be assigned by the database
        title: dbData.course_name,
        focus: dbData.description.substring(0, 50) + (dbData.description.length > 50 ? "..." : ""),
        level: dbData.level,
        duration: dbData.course_duration.toString(),
        schedule: scheduleArray.join(", "),
        instructor: user?.name || "Current Instructor",
        instructorId: user?.user_id,
        rating: dbData.rating,
        students: dbData.students,
        price: dbData.price,
        location: {
          address: dbData.pool_type === "students_pool" ? "Student's Pool" : dbData.location,
        },
        courseType:
          dbData.pool_type === "students_pool"
            ? "private-location"
            : dbData.pool_type === "instructor_pool"
              ? "teacher-pool"
              : "public-pool",
        status: "open",
        description: dbData.description,
        maxStudents: dbData.max_students,
        image: dbData.course_image,
      }
    },
    [user],
  )

  // Schedule item handlers
  const addScheduleItem = useCallback(() => {
    setScheduleItems((prev) => [...prev, { day: "", startTime: "", endTime: "" }])
  }, [])

  const removeScheduleItem = useCallback(
    (index: number) => {
      if (scheduleItems.length > 1) {
        setScheduleItems((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [scheduleItems.length],
  )

  const handleScheduleChange = useCallback((index: number, field: keyof ScheduleItem, value: string) => {
    setScheduleItems((prev) => {
      const newItems = [...prev]
      newItems[index][field] = value
      return newItems
    })
  }, [])

  // New Image Handling Functions
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "main" | "pool" | "gallery") => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Process each file
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(`File "${file.name}" is not an image. Please upload only image files.`)
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the 5MB size limit.`)
        return
      }

      // Create image data object
      const imageData: ImageData = {
        id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending",
        progress: 0,
      }

      // Add to appropriate state
      if (type === "main") {
        setMainImage(imageData)
        setUseDefaultImage(false)
      } else if (type === "pool") {
        setPoolImage(imageData)
      } else if (type === "gallery") {
        setGalleryImages((prev) => [...prev, imageData])
      }

      // Simulate upload progress
      simulateUploadProgress(imageData.id, type)
    })

    // Reset the file input
    e.target.value = ""
  }, [])

  const simulateUploadProgress = useCallback((imageId: string, type: "main" | "pool" | "gallery") => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5 // Random progress between 5-20%

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // Update status to success
        if (type === "main") {
          setMainImage((prev) => (prev && prev.id === imageId ? { ...prev, status: "success", progress } : prev))
        } else if (type === "pool") {
          setPoolImage((prev) => (prev && prev.id === imageId ? { ...prev, status: "success", progress } : prev))
        } else if (type === "gallery") {
          setGalleryImages((prev) =>
            prev.map((img) => (img.id === imageId ? { ...img, status: "success", progress } : img)),
          )
        }
      } else {
        // Update progress
        if (type === "main") {
          setMainImage((prev) => (prev && prev.id === imageId ? { ...prev, status: "uploading", progress } : prev))
        } else if (type === "pool") {
          setPoolImage((prev) => (prev && prev.id === imageId ? { ...prev, status: "uploading", progress } : prev))
        } else if (type === "gallery") {
          setGalleryImages((prev) =>
            prev.map((img) => (img.id === imageId ? { ...img, status: "uploading", progress } : img)),
          )
        }
      }
    }, 200)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, type: "main" | "pool") => {
    e.preventDefault()
    e.stopPropagation()
    if (type === "main") {
      setIsDragging(true)
    } else {
      setIsPoolDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>, type: "main" | "pool") => {
    e.preventDefault()
    e.stopPropagation()
    if (type === "main") {
      setIsDragging(false)
    } else {
      setIsPoolDragging(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, type: "main" | "pool" | "gallery") => {
      e.preventDefault()
      e.stopPropagation()

      // Reset dragging state
      setIsDragging(false)
      setIsPoolDragging(false)

      const files = e.dataTransfer.files
      if (!files || files.length === 0) return

      // Process each file
      Array.from(files).forEach((file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError(`File "${file.name}" is not an image. Please upload only image files.`)
          return
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          setError(`File "${file.name}" exceeds the 5MB size limit.`)
          return
        }

        // Create image data object
        const imageData: ImageData = {
          id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          status: "pending",
          progress: 0,
        }

        // Add to appropriate state
        if (type === "main") {
          setMainImage(imageData)
          setUseDefaultImage(false)
        } else if (type === "pool") {
          setPoolImage(imageData)
        } else if (type === "gallery") {
          setGalleryImages((prev) => [...prev, imageData])
        }

        // Simulate upload progress
        simulateUploadProgress(imageData.id, type)
      })
    },
    [simulateUploadProgress],
  )

  const removeImage = useCallback(
    (type: "main" | "pool" | "gallery", id?: string) => {
      if (type === "main") {
        if (mainImage?.preview && !mainImage.isDefault) {
          URL.revokeObjectURL(mainImage.preview)
        }
        setMainImage(null)
        // Optionally revert to default image
        if (useDefaultImage) {
          const defaultImage: ImageData = {
            id: "default-" + Date.now(),
            file: null,
            preview: defaultImageUrl,
            name: "Default Image",
            size: 0,
            type: "image/jpeg",
            status: "success",
            progress: 100,
            isDefault: true,
          }
          setMainImage(defaultImage)
        }
      } else if (type === "pool") {
        if (poolImage?.preview) {
          URL.revokeObjectURL(poolImage.preview)
        }
        setPoolImage(null)
      } else if (type === "gallery" && id) {
        const imageToRemove = galleryImages.find((img) => img.id === id)
        if (imageToRemove?.preview) {
          URL.revokeObjectURL(imageToRemove.preview)
        }
        setGalleryImages((prev) => prev.filter((img) => img.id !== id))
      }
    },
    [mainImage, poolImage, galleryImages, useDefaultImage, defaultImageUrl],
  )

  const openPreviewModal = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl)
    setPreviewModalOpen(true)
  }, [])

  const closePreviewModal = useCallback(() => {
    setPreviewModalOpen(false)
    setPreviewImage(null)
  }, [])

  const generateRandomImage = useCallback(() => {
    setIsGeneratingImage(true)

    // Simulate generating a new image
    setTimeout(() => {
      const newDefaultImage = getRandomImage()
      setDefaultImageUrl(newDefaultImage)

      // Create a new default image
      const defaultImage: ImageData = {
        id: "default-" + Date.now(),
        file: null,
        preview: newDefaultImage,
        name: "Default Image",
        size: 0,
        type: "image/jpeg",
        status: "success",
        progress: 100,
        isDefault: true,
      }

      setMainImage(defaultImage)
      setUseDefaultImage(true)
      setIsGeneratingImage(false)
    }, 1000)
  }, [getRandomImage])

  // Modify the handleSubmit function to prevent immediate submission after pricing step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If this is a "Next" button click (not on media step), just navigate
    if (currentStep !== "media") {
      goToNextStep()
      return
    }

    // If this is a direct form submission but not from the submit button on media step,
    // prevent it (this handles Enter key submissions)
    const submitter = (e.nativeEvent as any).submitter
    const isSubmitButton = submitter?.id === "submit-course-form"

    // Only proceed with actual submission if we're on the media step AND the submit button was clicked
    if (currentStep === "media" && isSubmitButton) {
      if (!validateForm()) {
        // Find the first section with an error and go to that step
        if (errors.courseName || errors.poolType || errors.location || errors.description || errors.level) {
          setCurrentStep("basicInfo")
        } else if (errors.courseDuration || errors.studyFrequency || errors.numberOfTotalSessions || errors.schedule) {
          setCurrentStep("schedule")
        } else if (errors.price) {
          setCurrentStep("pricing")
        } else if (errors.mainImage) {
          setError("Please upload or select a main course image")
        }
        return
      }

      setIsSubmitting(true)
      setError(null)
      setSuccess(null)
      setApiDebugInfo(null)

      try {
        if (!user || !user.user_id) {
          throw new Error("User ID not found. Please login again.")
        }

        // Format schedule from schedule items as an array
        const formattedSchedule = scheduleItems
          .filter((item) => item.day && item.startTime && item.endTime)
          .map((item) => `${item.day} ${item.startTime}-${item.endTime}`)

        // Initialize with existing values or empty strings as fallback
        let mainImageUrl = mainImage?.preview || ""
        let poolImageUrl = poolImage?.preview || ""
        let galleryImageUrls: string[] = galleryImages.map((img) => img.preview)

        // Upload main image if it's not a default image
        if (mainImage && mainImage.file && !mainImage.isDefault) {
          try {
            const uploadResult = await uploadProfileImage(user.user_id, mainImage.file)
            mainImageUrl = uploadResult.resource_url
          } catch (uploadErr) {
            console.error("Error uploading main course image:", uploadErr)
            throw new Error("Failed to upload main course image. Please try again.")
          }
        }

        // Upload pool image if provided
        if (poolImage && poolImage.file) {
          try {
            const uploadResult = await uploadProfileImage(user.user_id, poolImage.file)
            poolImageUrl = uploadResult.resource_url
          } catch (uploadErr) {
            console.error("Error uploading pool image:", uploadErr)
            throw new Error("Failed to upload pool image. Please try again.")
          }
        }

        // Upload gallery images if provided
        if (galleryImages.length > 0) {
          try {
            // Upload each gallery image
            const uploadPromises = galleryImages
              .filter((img) => img.file)
              .map(async (img) => {
                if (!img.file) return img.preview
                const uploadResult = await uploadProfileImage(user.user_id, img.file)
                return uploadResult.resource_url
              })

            galleryImageUrls = await Promise.all(uploadPromises)
          } catch (uploadErr) {
            console.error("Error uploading gallery images:", uploadErr)
            throw new Error("Failed to upload gallery images. Please try again.")
          }
        }

        const dbData: CourseDbData = {
          course_name: courseName,
          pool_type: poolType === "teacher-pool" ? "instructor_pool" : poolType,
          location: poolType === "students_pool" ? "Student's Pool" : location,
          description,
          course_duration: Number(courseDuration),
          study_frequency: studyFrequency,
          days_study: 0,
          number_of_total_sessions: Number(numberOfTotalSessions),
          course_image: mainImageUrl,
          course_gallery: galleryImageUrls.length > 0 ? galleryImageUrls : undefined,
          level,
          max_students: Number(maxStudents),
          price: Number(price),
          rating: Number(rating),
          schedule: JSON.stringify(formattedSchedule),
          students: Number(students),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          instructor: {
            connect: {
              user_id: user.user_id,
            },
          },
        }

        // Add location coordinates if available
        if (locationCoords && poolType !== "students_pool") {
          dbData.location = `${location} (Lat: ${locationCoords.lat.toFixed(6)}, Lng: ${locationCoords.lng.toFixed(6)})`
        }

        // Call the API with the database-style object
        const response = await createCourse(dbData)

        // Store debug info
        setApiDebugInfo({
          requestData: dbData,
          responseData: response,
        })

        // Map to Course type for the parent component
        const courseData = mapDbDataToCourse(dbData)

        // Call the parent component's onSubmit with the mapped data
        onSubmit(courseData)

        setSuccess("Course created successfully!")

        // Close the modal after a short delay
        setTimeout(() => {
          handleClose()
        }, 1500)
      } catch (err: any) {
        console.error("Error creating course:", err)

        // Store debug info
        setApiDebugInfo({
          error: {
            message: err.message,
            name: err.name,
            code: err.code,
            response: err.response
              ? {
                  status: err.response.status,
                  statusText: err.response.statusText,
                  data: err.response.data,
                }
              : null,
          },
          user,
        })

        // Set user-friendly error message
        let errorMessage = "Failed to create course. Please try again."

        if (err.response) {
          if (err.response.status === 400) {
            errorMessage = "Invalid course data. Please check your inputs."
          } else if (err.response.status === 401 || err.response.status === 403) {
            errorMessage = "You don't have permission to create courses."
          } else if (err.response.status === 500) {
            errorMessage = "Server error. Please try again later."
          }

          // Add more specific error message if available
          if (err.response.data && err.response.data.message) {
            errorMessage += ` (${err.response.data.message})`
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection."
        } else if (err.message) {
          errorMessage = err.message
        }

        setError(errorMessage)

        // Expand debug section on error
        setExpandedSections((prev) => ({ ...prev, debug: true }))
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // If we're on media step but not from submit button, just prevent default
      goToNextStep()
    }
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "basicInfo":
        return renderBasicInfoStep()
      case "schedule":
        return renderScheduleStep()
      case "pricing":
        return renderPricingStep()
      case "media":
        return renderMediaStep()
      default:
        return null
    }
  }

  // Render basic info step
  const renderBasicInfoStep = () => {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Name */}
          <div>
            <label
              htmlFor="courseName"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="courseName"
              className={cn(
                "w-full rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
              )}
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="e.g., Advanced Freestyle Technique"
            />
            {errors.courseName && <p className="text-xs text-red-500 mt-1">{errors.courseName}</p>}
          </div>

          {/* Pool Type */}
          <div>
            <label
              htmlFor="poolType"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Pool Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Pool className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                id="poolType"
                className={cn(
                  "w-full rounded-md pl-10 pr-3 py-2 text-base focus:ring-2 focus:ring-offset-0 appearance-none",
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                )}
                value={poolType}
                onChange={(e) => setPoolType(e.target.value)}
              >
                <option value="">Select Pool Type</option>
                <option value="students_pool">Students Pool</option>
                <option value="instructor_pool">Instructor Pool</option>
                <option value="สระสาธารณะ">สระสาธารณะ (Public Pool)</option>
              </select>
            </div>
            {errors.poolType && <p className="text-xs text-red-500 mt-1">{errors.poolType}</p>}
          </div>

          {/* Level */}
          <div>
            <label
              htmlFor="level"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Level <span className="text-red-500">*</span>
            </label>
            <select
              id="level"
              className={cn(
                "w-full rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-offset-0 appearance-none",
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
              )}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.level && <p className="text-xs text-red-500 mt-1">{errors.level}</p>}
          </div>

          {/* Instructor */}
          <div>
            <label
              htmlFor="instructorId"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Instructor
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="instructorId"
                className={cn(
                  "w-full rounded-md pl-10 pr-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
                  isDarkMode
                    ? "bg-slate-700/50 border-slate-600 text-gray-300"
                    : "bg-gray-100 border-gray-300 text-gray-500",
                )}
                value={user?.user_id || "Loading..."}
                placeholder="Instructor ID"
                readOnly={true}
              />
            </div>
            <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              Course will be created by: {user?.name || "Loading..."}
            </p>
          </div>
        </div>

        {/* Location - only show if not students pool */}
        {poolType !== "students_pool" && (
          <div className="mt-5">
            <label
              htmlFor="location"
              className={cn(
                "block text-sm font-medium mb-2 flex items-center gap-2",
                isDarkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Map className="h-4 w-4 text-cyan-500" />
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="location"
                className={cn(
                  "w-full rounded-md pl-10 pr-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                )}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Aquatic Center, Bangkok"
              />
            </div>
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}

            <div className="mt-3 mb-4">
              <p className={cn("text-sm mb-2", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                Select location on the map:
              </p>
              <div className="rounded-lg overflow-hidden border border-gray-300 h-[300px]">
                <OSMMapSelector
                  onLocationSelect={handleLocationSelect}
                  center={locationCoords || { lat: 13.7563, lng: 100.5018 }} // Default: Bangkok
                />
              </div>
              <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Click on the map to set the location or drag the marker to adjust.
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            className={cn(
              "w-full rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
            )}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of the course..."
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Include key information about what students will learn and the benefits of your course.
          </p>
        </div>
      </div>
    )
  }

  // Render schedule step
  const renderScheduleStep = () => {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Duration */}
          <div>
            <label
              htmlFor="courseDuration"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Course Duration (months) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                id="courseDuration"
                className={cn(
                  "w-full rounded-md pl-10 pr-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                )}
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                placeholder="e.g., 3"
                min="1"
              />
            </div>
            {errors.courseDuration && <p className="text-xs text-red-500 mt-1">{errors.courseDuration}</p>}
          </div>

          {/* Study Frequency */}
          <div>
            <label
              htmlFor="studyFrequency"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Study Frequency <span className="text-red-500">*</span>
            </label>
            <select
              id="studyFrequency"
              className={cn(
                "w-full rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-offset-0 appearance-none",
                isDarkMode
                  ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
              )}
              value={studyFrequency}
              onChange={(e) => setStudyFrequency(e.target.value)}
            >
              <option value="">Select Frequency</option>
              <option value="1 time per week">1 time per week</option>
              <option value="1-2 times per week">1-2 times per week</option>
              <option value="2-3 times per week">2-3 times per week</option>
              <option value="3-4 times per week">3-4 times per week</option>
              <option value="4-5 times per week">4-5 times per week</option>
              <option value="5+ times per week">5+ times per week</option>
            </select>
            {errors.studyFrequency && <p className="text-xs text-red-500 mt-1">{errors.studyFrequency}</p>}
          </div>

          {/* Number of Total Sessions */}
          <div>
            <label
              htmlFor="numberOfTotalSessions"
              className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Total Sessions <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                id="numberOfTotalSessions"
                className={cn(
                  "w-full rounded-md pl-10 pr-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                )}
                value={numberOfTotalSessions}
                onChange={(e) => setNumberOfTotalSessions(e.target.value)}
                placeholder="e.g., 24"
                min="1"
              />
            </div>
            {errors.numberOfTotalSessions && (
              <p className="text-xs text-red-500 mt-1">{errors.numberOfTotalSessions}</p>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-5">
          <label className={cn("block text-sm font-medium mb-3", isDarkMode ? "text-gray-300" : "text-gray-700")}>
            Schedule <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-wrap md:flex-nowrap items-center gap-2 p-3 rounded-lg",
                  isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                )}
              >
                <div className="w-full md:w-1/3">
                  <select
                    className={cn(
                      "w-full rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-offset-0 appearance-none",
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                    )}
                    value={item.day}
                    onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      className={cn(
                        "w-full rounded-md pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-offset-0",
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                          : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                      )}
                      value={item.startTime}
                      onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center px-2">
                  <span className={isDarkMode ? "text-white" : "text-gray-700"}>to</span>
                </div>
                <div className="w-full md:w-1/4">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      className={cn(
                        "w-full rounded-md pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-offset-0",
                        isDarkMode
                          ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                          : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
                      )}
                      value={item.endTime}
                      onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className={cn(
                    "p-2 rounded-full flex-shrink-0",
                    isDarkMode
                      ? "bg-red-900/50 text-red-300 hover:bg-red-800"
                      : "bg-red-100 text-red-500 hover:bg-red-200",
                  )}
                  aria-label="Remove schedule item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addScheduleItem}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isDarkMode
                  ? "bg-slate-700 text-cyan-400 hover:bg-slate-600"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100",
              )}
            >
              <Plus className="h-4 w-4" /> Add Schedule
            </button>

            {errors.schedule && <p className="text-xs text-red-500 mt-1">{errors.schedule}</p>}
          </div>
        </div>
      </div>
    )
  }

  // Render pricing step
  const renderPricingStep = () => {
    return (
      <div>
        <label
          htmlFor="price"
          className={cn("block text-sm font-medium mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}
        >
          Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="number"
            id="price"
            className={cn(
              "w-full rounded-md pl-10 pr-3 py-2 text-base focus:ring-2 focus:ring-offset-0",
              isDarkMode
                ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                : "border border-gray-300 focus:ring-sky-500 focus:border-sky-500",
            )}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            placeholder="Enter course price"
          />
        </div>
        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
        <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          Set the price for your course in your local currency
        </p>
      </div>
    )
  }

  // Render media step with the new design
  const renderMediaStep = () => {
    return (
      <div className="space-y-6">
        {/* Main Course Image Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="courseImageUpload"
              className={cn("block text-sm font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}
            >
              Main Course Image <span className="text-red-500">*</span>
            </label>

            {/* Default Image Toggle */}
            <div className="flex items-center gap-2">
              {/* 4. Modify the renderMediaStep function to explicitly handle default image selection */}
              {/* Find the section in renderMediaStep where the default image checkbox is handled and replace with: */}
              <label className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={useDefaultImage}
                  onChange={(e) => {
                    setUseDefaultImage(e.target.checked)
                    if (e.target.checked) {
                      // Only create default image when checkbox is checked
                      const defaultImage: ImageData = {
                        id: "default-" + Date.now(),
                        file: null,
                        preview: defaultImageUrl,
                        name: "Default Image",
                        size: 0,
                        type: "image/jpeg",
                        status: "success",
                        progress: 100,
                        isDefault: true,
                      }
                      setMainImage(defaultImage)
                    } else {
                      // Remove default image when unchecked
                      setMainImage(null)
                    }
                  }}
                />
                Use default image
              </label>

              {useDefaultImage && (
                <button
                  type="button"
                  onClick={generateRandomImage}
                  disabled={isGeneratingImage}
                  className={cn(
                    "text-xs p-1 rounded flex items-center gap-1",
                    isDarkMode
                      ? "bg-slate-700 text-cyan-400 hover:bg-slate-600"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100",
                  )}
                >
                  {isGeneratingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  <span>Randomize</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Image Upload Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Upload Area */}
            <div>
              {!mainImage || useDefaultImage ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
                    isDragging
                      ? isDarkMode
                        ? "border-cyan-500 bg-slate-700/50"
                        : "border-sky-500 bg-blue-50"
                      : isDarkMode
                        ? "border-slate-600 hover:border-cyan-500 bg-slate-700/30"
                        : "border-gray-300 hover:border-sky-500 bg-gray-50",
                  )}
                  onClick={() => !useDefaultImage && fileInputRef.current?.click()}
                  onDragOver={(e) => !useDefaultImage && handleDragOver(e, "main")}
                  onDragLeave={(e) => !useDefaultImage && handleDragLeave(e, "main")}
                  onDrop={(e) => !useDefaultImage && handleDrop(e, "main")}
                >
                  <input
                    type="file"
                    id="courseImageUpload"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "main")}
                    disabled={useDefaultImage}
                  />

                  {isDragging ? (
                    <div className="flex flex-col items-center">
                      <UploadCloud className={cn("h-12 w-12 mb-2", isDarkMode ? "text-cyan-400" : "text-sky-500")} />
                      <p className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Drop your image here
                      </p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className={cn("mb-3", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                      <p className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        {useDefaultImage ? "Using default image" : "Click to upload course image"}
                      </p>
                      <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {useDefaultImage
                          ? "Uncheck 'Use default image' to upload your own"
                          : "JPG, PNG or GIF, max 5MB"}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Image upload status */}
                  {mainImage.status === "uploading" && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                          Uploading: {mainImage.progress}%
                        </span>
                        <span className={isDarkMode ? "text-cyan-400" : "text-sky-500"}>
                          {Math.round(mainImage.size / 1024)} KB
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div
                          className={cn("h-1.5 rounded-full", isDarkMode ? "bg-cyan-500" : "bg-sky-500")}
                          style={{ width: `${mainImage.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Image actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                        isDarkMode
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                      )}
                    >
                      <Pencil className="h-3 w-3" />
                      Change Image
                    </button>

                    <button
                      type="button"
                      onClick={() => openPreviewModal(mainImage.preview)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                        isDarkMode
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                      )}
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage("main")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                        isDarkMode
                          ? "bg-red-900/50 text-red-300 hover:bg-red-800"
                          : "bg-red-100 text-red-500 hover:bg-red-200",
                      )}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "main")}
                  />
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div>
              <div
                className={cn(
                  "rounded-lg overflow-hidden border h-[200px] relative group",
                  isDarkMode ? "border-slate-600" : "border-gray-200",
                )}
              >
                {mainImage ? (
                  <div className="relative h-full">
                    <img
                      src={mainImage.preview || "/placeholder.svg"}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        // Handle image error
                        if (!mainImage.isDefault) {
                          removeImage("main")
                          setError("Failed to load image. Please try uploading again.")
                        }
                      }}
                    />

                    {/* Image overlay with actions on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openPreviewModal(mainImage.preview)}
                          className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {!mainImage.isDefault && (
                          <button
                            type="button"
                            onClick={() => removeImage("main")}
                            className="p-2 rounded-full bg-white text-red-500 hover:bg-gray-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Default image badge */}
                    {mainImage.isDefault && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md">
                        Default Image
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={cn(
                      "h-full flex items-center justify-center",
                      isDarkMode ? "bg-slate-800" : "bg-gray-100",
                    )}
                  >
                    <div className="text-center">
                      <FileImage
                        className={cn("h-10 w-10 mx-auto mb-2", isDarkMode ? "text-gray-600" : "text-gray-400")}
                      />
                      <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>No image selected</p>
                    </div>
                  </div>
                )}
              </div>

              <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                {mainImage?.isDefault
                  ? "Using a default image. Upload your own for better recognition."
                  : "This image will be the main visual for your course listing."}
              </p>

              {errors.mainImage && <p className="text-xs text-red-500 mt-1">{errors.mainImage}</p>}
            </div>
          </div>
        </div>

        {/* Pool Image Section */}
        <div>
          <label
            htmlFor="poolImageUpload"
            className={cn(
              "block text-sm font-medium mb-3 flex items-center gap-2",
              isDarkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            <Pool className="h-4 w-4" /> Pool Image (Optional)
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Upload Area */}
            <div>
              {!poolImage ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
                    isPoolDragging
                      ? isDarkMode
                        ? "border-cyan-500 bg-slate-700/50"
                        : "border-sky-500 bg-blue-50"
                      : isDarkMode
                        ? "border-slate-600 hover:border-cyan-500 bg-slate-700/30"
                        : "border-gray-300 hover:border-sky-500 bg-gray-50",
                  )}
                  onClick={() => poolFileInputRef.current?.click()}
                  onDragOver={(e) => handleDragOver(e, "pool")}
                  onDragLeave={(e) => handleDragLeave(e, "pool")}
                  onDrop={(e) => handleDrop(e, "pool")}
                >
                  <input
                    type="file"
                    id="poolImageUpload"
                    ref={poolFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "pool")}
                  />

                  {isPoolDragging ? (
                    <div className="flex flex-col items-center">
                      <UploadCloud className={cn("h-12 w-12 mb-2", isDarkMode ? "text-cyan-400" : "text-sky-500")} />
                      <p className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Drop your image here
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className={cn("mb-3", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                      <p className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                        Click to upload pool image
                      </p>
                      <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        JPG, PNG or GIF, max 5MB
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Image upload status */}
                  {poolImage.status === "uploading" && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                          Uploading: {poolImage.progress}%
                        </span>
                        <span className={isDarkMode ? "text-cyan-400" : "text-sky-500"}>
                          {Math.round(poolImage.size / 1024)} KB
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                        <div
                          className={cn("h-1.5 rounded-full", isDarkMode ? "bg-cyan-500" : "bg-sky-500")}
                          style={{ width: `${poolImage.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Image actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => poolFileInputRef.current?.click()}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                        isDarkMode
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                      )}
                    >
                      <Pencil className="h-3 w-3" />
                      Change Image
                    </button>

                    <button
                      type="button"
                      onClick={() => openPreviewModal(poolImage.preview)}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                        isDarkMode
                          ? "bg-slate-700 text-white hover:bg-slate-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                      )}
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage("pool")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5",
                        isDarkMode
                          ? "bg-red-900/50 text-red-300 hover:bg-red-800"
                          : "bg-red-100 text-red-500 hover:bg-red-200",
                      )}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={poolFileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "pool")}
                  />
                </div>
              )}
            </div>

            {/* Image Preview */}
            <div>
              <div
                className={cn(
                  "rounded-lg overflow-hidden border h-[200px] relative group",
                  isDarkMode ? "border-slate-600" : "border-gray-200",
                )}
              >
                {poolImage ? (
                  <div className="relative h-full">
                    <img
                      src={poolImage.preview || "/placeholder.svg"}
                      alt="Pool preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        removeImage("pool")
                        setError("Failed to load pool image. Please try uploading again.")
                      }}
                    />

                    {/* Image overlay with actions on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openPreviewModal(poolImage.preview)}
                          className="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage("pool")}
                          className="p-2 rounded-full bg-white text-red-500 hover:bg-gray-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "h-full flex items-center justify-center",
                      isDarkMode ? "bg-slate-800" : "bg-gray-100",
                    )}
                  >
                    <div className="text-center">
                      <Pool className={cn("h-10 w-10 mx-auto mb-2", isDarkMode ? "text-gray-600" : "text-gray-400")} />
                      <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        No pool image selected
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                Add an image of the pool where the course will take place.
              </p>
            </div>
          </div>
        </div>

        {/* Course Gallery Section */}
        <div>
          <label
            className={cn(
              "block text-sm font-medium mb-3 flex items-center gap-2",
              isDarkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            <ImageIcon2 className="h-4 w-4" /> Course Gallery (Optional)
          </label>

          {/* Gallery Upload Area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all mb-4",
              isDarkMode
                ? "border-slate-600 hover:border-cyan-500 bg-slate-700/30"
                : "border-gray-300 hover:border-sky-500 bg-gray-50",
            )}
            onClick={() => document.getElementById("galleryImageUpload")?.click()}
          >
            <input
              type="file"
              id="galleryImageUpload"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, "gallery")}
            />

            <Upload className={cn("mb-3", isDarkMode ? "text-gray-400" : "text-gray-500")} />
            <p className={cn("font-medium", isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Click to upload gallery images
            </p>
            <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              Add multiple images to showcase your course (max 5 images)
            </p>
          </div>

          {/* Gallery Preview */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative rounded-lg overflow-hidden border h-24 group",
                    isDarkMode ? "border-slate-600" : "border-gray-200",
                  )}
                >
                  <img
                    src={image.preview || "/placeholder.svg"}
                    alt="Gallery preview"
                    className="w-full h-full object-cover"
                  />

                  {/* Upload progress indicator */}
                  {image.status === "uploading" && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 text-white mb-1" />
                      <span className="text-white text-xs">{image.progress}%</span>
                    </div>
                  )}

                  {/* Image overlay with actions on hover */}
                  {image.status === "success" && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openPreviewModal(image.preview)}
                          className="p-1.5 rounded-full bg-white text-gray-800 hover:bg-gray-200"
                        >
                          <Eye className="h-3 w-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage("gallery", image.id)}
                          className="p-1.5 rounded-full bg-white text-red-500 hover:bg-gray-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add more button */}
              {galleryImages.length < 5 && (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer h-24",
                    isDarkMode
                      ? "border-slate-600 hover:border-cyan-500 bg-slate-700/30"
                      : "border-gray-300 hover:border-sky-500 bg-gray-50",
                  )}
                  onClick={() => document.getElementById("galleryImageUpload")?.click()}
                >
                  <Plus className={cn("h-5 w-5", isDarkMode ? "text-gray-400" : "text-gray-500")} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Image Preview Modal */}
        {previewModalOpen && previewImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
              <button
                type="button"
                onClick={closePreviewModal}
                className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 z-10"
              >
                <XCircle className="h-6 w-6" />
              </button>

              <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden flex-1 flex items-center justify-center">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Course" className="max-w-5xl">
      <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
        {/* Step Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id)
              const isCurrent = currentStep === step.id

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative cursor-pointer"
                  onClick={() => goToStep(step.id)}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                      isCompleted
                        ? isDarkMode
                          ? "bg-green-600 text-white"
                          : "bg-green-500 text-white"
                        : isCurrent
                          ? isDarkMode
                            ? "bg-cyan-600 text-white"
                            : "bg-sky-600 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-gray-400"
                            : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {isCompleted ? <CheckCircle2 /> : step.icon}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isCurrent
                        ? isDarkMode
                          ? "text-cyan-400"
                          : "text-sky-600"
                        : isCompleted
                          ? isDarkMode
                            ? "text-gray-300"
                            : "text-gray-600"
                          : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500",
                    )}
                  >
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-6 left-12 w-[calc(100%-3rem)] h-0.5",
                        isCompleted
                          ? isDarkMode
                            ? "bg-green-800"
                            : "bg-green-200"
                          : isDarkMode
                            ? "bg-slate-700"
                            : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Course Name Header */}
        {courseName && (
          <div
            className={cn(
              "mb-6 p-3 rounded-lg",
              isDarkMode ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-200",
            )}
          >
            <div className="flex items-center">
              <User className={cn("mr-2", isDarkMode ? "text-green-400" : "text-green-600")} />
              <p className={cn("text-sm", isDarkMode ? "text-green-400" : "text-green-700")}>
                Creating course as: <strong>{courseName}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        <div
          className={cn(
            "rounded-xl p-4 mb-6 transition-all duration-200",
            isDarkMode ? "bg-slate-800/60" : "bg-sky-50",
          )}
        >
          <h3
            className={cn(
              "font-medium mb-3 text-sm uppercase tracking-wide",
              isDarkMode ? "text-cyan-400" : "text-sky-700",
            )}
          >
            Your Teaching Stats
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Courses", value: stats.totalCourses },
              { label: "Total Students", value: stats.totalStudents },
              { label: "Avg Rating", value: stats.avgRating },
              { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
            ].map((stat, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg transition-all duration-200 flex flex-col",
                  isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-white hover:shadow-md",
                )}
              >
                <p className={cn("text-xs font-medium mb-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {stat.label}
                </p>
                <p className={cn("text-xl font-bold", isDarkMode ? "text-white" : "text-gray-800")}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Card */}
        <div
          className={cn(
            "mb-6 p-4 rounded-lg border",
            isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-blue-50 border-blue-100",
          )}
        >
          <div className="flex items-start gap-3">
            <Info className={cn("h-5 w-5 mt-0.5", isDarkMode ? "text-cyan-400" : "text-blue-500")} />
            <div>
              <h4 className={cn("font-medium mb-2", isDarkMode ? "text-white" : "text-gray-800")}>
                Tips for Creating Effective Courses
              </h4>
              <ul className={cn("text-sm space-y-1.5", isDarkMode ? "text-gray-300" : "text-gray-600")}>
                <li>• Use clear, descriptive course names</li>
                <li>• Provide detailed information about what students will learn</li>
                <li>• Set realistic expectations for course duration and schedule</li>
                <li>• Choose an appropriate price point for your target audience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4">
            <AlertResponse message={error} type={AlertType.ERROR} />
          </div>
        )}
        {success && (
          <div className="mb-4">
            <AlertResponse message={success} type={AlertType.SUCCESS} />
          </div>
        )}

        {/* User Info */}
        {user ? (
          <div
            className={cn(
              "mb-6 p-3 rounded-lg flex items-center gap-3",
              isDarkMode ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-200",
            )}
          >
            <CheckCircle2 className={cn("h-5 w-5", isDarkMode ? "text-green-400" : "text-green-600")} />
            <p className={cn("text-sm", isDarkMode ? "text-green-400" : "text-green-700")}>
              Creating course as: <strong>{user.name}</strong> (ID: {user.user_id})
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "mb-6 p-3 rounded-lg flex items-center gap-3",
              isDarkMode ? "bg-amber-900/20 border border-amber-800/30" : "bg-amber-50 border border-amber-200",
            )}
          >
            <AlertCircle className={cn("h-5 w-5", isDarkMode ? "text-amber-400" : "text-amber-600")} />
            <p className={cn("text-sm", isDarkMode ? "text-amber-400" : "text-amber-700")}>
              <strong>Warning:</strong> User information not found. Please refresh the page or log in again.
            </p>
          </div>
        )}

        {/* Draft Restoration */}
        {localStorage.getItem("courseFormDraft") && !courseName && (
          <div
            className={cn(
              "mb-6 p-3 rounded-lg flex items-center justify-between",
              isDarkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-200",
            )}
          >
            <div className="flex items-center gap-3">
              <Save className={cn("h-5 w-5", isDarkMode ? "text-blue-400" : "text-blue-600")} />
              <p className={cn("text-sm", isDarkMode ? "text-blue-400" : "text-blue-700")}>
                You have a saved draft. Would you like to restore it?
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const savedDraft = localStorage.getItem("courseFormDraft")
                if (savedDraft) {
                  try {
                    const parsedDraft = JSON.parse(savedDraft)
                    setCourseName(parsedDraft.courseName || "")
                    setPoolType(parsedDraft.poolType || "")
                    setLocation(parsedDraft.location || "")
                    setDescription(parsedDraft.description || "")
                    setCourseDuration(parsedDraft.courseDuration || "")
                    setStudyFrequency(parsedDraft.studyFrequency || "")
                    setNumberOfTotalSessions(parsedDraft.numberOfTotalSessions || "")
                    setPrice(parsedDraft.price || "")
                    setLevel(parsedDraft.level || "")

                    if (parsedDraft.scheduleItems && parsedDraft.scheduleItems.length > 0) {
                      setScheduleItems(parsedDraft.scheduleItems)
                    }
                  } catch (e) {
                    console.error("Error parsing saved draft:", e)
                  }
                }
              }}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium",
                isDarkMode ? "bg-blue-700 text-white hover:bg-blue-600" : "bg-blue-500 text-white hover:bg-blue-600",
              )}
            >
              Restore Draft
            </button>
          </div>
        )}

        {/* Course Creation Form */}
        <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Step Content */}
          <div
            className={cn(
              "rounded-xl overflow-hidden border p-5",
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200 shadow-sm",
            )}
          >
            {renderStepContent()}
          </div>

          {/* Debug Information Section */}
          {apiDebugInfo && (
            <div
              className={cn(
                "rounded-xl overflow-hidden border",
                isDarkMode ? "bg-slate-800 border-amber-800/50" : "bg-white border-amber-200",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer",
                  isDarkMode ? "bg-amber-900/30" : "bg-amber-50",
                )}
                onClick={() => toggleSection("debug")}
              >
                <h3
                  className={cn(
                    "text-base font-medium flex items-center gap-2",
                    isDarkMode ? "text-amber-400" : "text-amber-700",
                  )}
                >
                  <AlertCircle className={cn("h-4 w-4 text-amber-500")} />
                  Debug Information
                </h3>
                {expandedSections.debug ? (
                  <ChevronUp className={cn("h-4 w-4", isDarkMode ? "text-amber-400" : "text-amber-500")} />
                ) : (
                  <ChevronDown className={cn("h-4 w-4", isDarkMode ? "text-amber-400" : "text-amber-500")} />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.debug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 space-y-4">
                      <div
                        className={cn(
                          "p-4 rounded-lg overflow-auto max-h-60",
                          isDarkMode ? "bg-slate-900" : "bg-gray-100",
                        )}
                      >
                        <pre className={cn("text-xs", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                          {JSON.stringify(apiDebugInfo, null, 2)}
                        </pre>
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-md",
                            isDarkMode
                              ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                          )}
                          onClick={() => {
                            console.log("API Debug Info:", apiDebugInfo)
                          }}
                        >
                          Log to Console
                        </button>
                        <button
                          type="button"
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-md",
                            isDarkMode
                              ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300",
                          )}
                          onClick={() => {
                            setApiDebugInfo(null)
                            setExpandedSections((prev) => ({ ...prev, debug: false }))
                          }}
                        >
                          Clear Debug Info
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between gap-4 pt-2">
            <div>
              {currentStep !== "basicInfo" && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={isSubmitting}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isDarkMode
                      ? "bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
                  )}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  // Check if form has unsaved changes
                  const hasChanges =
                    courseName ||
                    poolType ||
                    location ||
                    description ||
                    courseDuration ||
                    studyFrequency ||
                    numberOfTotalSessions ||
                    price ||
                    scheduleItems.some((item) => item.day || item.startTime || item.endTime)

                  if (hasChanges) {
                    if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                      handleClose()
                    }
                  } else {
                    handleClose()
                  }
                }}
                disabled={isSubmitting}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isDarkMode
                    ? "bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
                )}
              >
                Cancel
              </button>

              {currentStep === "media" ? (
                <button
                  type="submit"
                  id="submit-course-form"
                  disabled={isSubmitting}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
                      : "bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 disabled:opacity-50",
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      Finish & Create Course <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={isSubmitting}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
                      : "bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 disabled:opacity-50",
                  )}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}
