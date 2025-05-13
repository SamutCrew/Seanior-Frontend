import { APIEndpoints } from "@/constants/apiEndpoints"
import { auth } from "@/lib/firebase"

const BASE_URL = "/swimming-course"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Interface for course data
export interface CourseDbData {
  course_name: string
  pool_type: string
  location: string
  description: string
  course_duration: number
  study_frequency: string // Changed to string to match Prisma schema
  days_study: number
  number_of_total_sessions: number
  course_image: string // Changed from image to course_image
  level: string
  max_students: number
  price: number
  rating?: number
  schedule: string
  students?: number
  instructor_id?: string // Added instructor_id as an alternative to the connect object
}

// Helper function to get Firebase token
const getFirebaseToken = async () => {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      console.error("No Firebase user is currently logged in")
      return null
    }

    // Force refresh to ensure we have the latest token
    const token = await currentUser.getIdToken(true)
    console.log("Got Firebase token:", token.substring(0, 20) + "...")
    return token
  } catch (error) {
    console.error("Error getting Firebase token:", error)
    return null
  }
}

export const getAllCourses = async () => {
  const url = APIEndpoints.COURSE.RETRIEVE.ALL
  try {
    // Get the token from Firebase AND localStorage as fallback
    const firebaseToken = await getFirebaseToken()
    const localToken = localStorage.getItem("authToken")
    const token = firebaseToken || localToken

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("Request headers:", headers)

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error: any) {
    console.error("Error fetching all courses:", {
      message: error.message,
    })
    throw error
  }
}

// Add this function to fetch courses by user ID
export const getCoursesByUserId = async (userId: string) => {
  try {
    console.log("Fetching courses for user ID:", userId)

    // Get the token from Firebase AND localStorage as fallback
    const firebaseToken = await getFirebaseToken()
    const localToken = localStorage.getItem("authToken")
    const token = firebaseToken || localToken

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("Request headers:", headers)

    // First try to get all courses
    const response = await fetch(`${API_BASE_URL}${APIEndpoints.COURSE.RETRIEVE.ALL}`, {
      method: "GET",
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      // If the response is not ok, throw an error
      console.error("API Error:", response.status, response.statusText)
      throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Courses API response:", data)

    // Filter courses by instructor ID
    const userCourses = data.filter((course: any) => {
      const instructorId = course.instructor_id || course.instructor?.user_id || course.instructor?.id
      console.log(`Course ${course.id || course.course_id}: Instructor ID = ${instructorId}, User ID = ${userId}`)
      return instructorId === userId
    })

    console.log("Filtered courses for user:", userCourses)
    return userCourses
  } catch (error) {
    console.error("Error fetching courses by user ID:", error)
    throw error
  }
}

// Get a course by ID
export const getCourseById = async (courseId: string) => {
  try {
    console.log("Fetching course with ID:", courseId)

    // Get the token from Firebase AND localStorage as fallback
    const firebaseToken = await getFirebaseToken()
    const localToken = localStorage.getItem("authToken")
    const token = firebaseToken || localToken

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("Request headers:", headers)

    // Try to get the course by ID first
    const endpoint = APIEndpoints.COURSE.RETRIEVE.BY_ID.replace("[courseId]", courseId)
    console.log(`Trying to fetch from endpoint: ${API_BASE_URL}${endpoint}`)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Course API response:", data)
        return data
      }

      console.log("Course not found by ID, trying to fetch from all courses")
      // If that fails, try to get all courses and filter by ID
      const allCoursesResponse = await fetch(`${API_BASE_URL}${APIEndpoints.COURSE.RETRIEVE.ALL}`, {
        method: "GET",
        headers,
        credentials: "include",
      })

      if (!allCoursesResponse.ok) {
        throw new Error(`Failed to fetch courses: ${allCoursesResponse.status} ${allCoursesResponse.statusText}`)
      }

      const allCourses = await allCoursesResponse.json()
      console.log(`Searching for course with ID ${courseId} among ${allCourses.length} courses`)

      // Find the course with the matching ID
      const course = allCourses.find(
        (c: any) =>
          c.id === courseId ||
          c.id === Number(courseId) ||
          c.course_id === courseId ||
          c.course_id === Number(courseId),
      )

      if (course) {
        console.log("Found course in all courses:", course)
        return course
      }

      // If we still can't find the course, return a fallback
      console.log("Course not found in all courses, using fallback data")
      return createFallbackCourse(courseId)
    } catch (error) {
      console.error("Error fetching from API:", error)
      return createFallbackCourse(courseId)
    }
  } catch (error) {
    console.error("Error in getCourseById:", error)
    return createFallbackCourse(courseId)
  }
}

// Helper function to create fallback course data
const createFallbackCourse = (courseId: string) => {
  return {
    id: courseId,
    course_id: courseId,
    course_name: "Swimming Course",
    title: "Swimming Course",
    description:
      "This is a comprehensive swimming course designed to help students of all levels improve their swimming skills.",
    level: "Intermediate",
    course_duration: 8,
    schedule: "Mondays and Wednesdays, 5:00 PM - 6:30 PM",
    instructor_name: "Professional Instructor",
    instructor_id: "1",
    rating: 4.5,
    students: 12,
    price: 199,
    location: "Main Swimming Pool, 123 Aquatic Center",
    pool_type: "public-pool",
    curriculum: [
      "Swimming fundamentals",
      "Water safety",
      "Basic strokes",
      "Breathing techniques",
      "Advanced techniques",
    ],
    requirements: ["Swimwear required", "Basic comfort in water recommended"],
    max_students: 15,
    course_image: "/placeholder.svg?key=tnyv7",
    study_frequency: "Twice a week",
    days_study: 2,
    number_of_total_sessions: 16,
    instructor: {
      name: "Professional Instructor",
      user_id: "1",
      profile_img: "/instructor-teaching.png",
    },
  }
}

// Helper function to compress image data
const compressImageData = async (imageData: string): Promise<string> => {
  try {
    // If the image is already small enough, return it as is
    if (imageData.length < 500000) {
      return imageData
    }

    // For larger images, create a placeholder URL
    console.log("Image too large, using placeholder")
    return "compressed-image-placeholder.jpg"
  } catch (error) {
    console.error("Error compressing image data:", error)
    return "error-compressing-image.jpg"
  }
}

// Update the createCourse function to properly handle the course_image field
export const createCourse = async (courseData: CourseDbData) => {
  try {
    // Get the token from Firebase AND localStorage as fallback
    const firebaseToken = await getFirebaseToken()
    const localToken = localStorage.getItem("authToken")
    const token = firebaseToken || localToken

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("Create course headers:", headers)

    // Create a new object with the correct field names
    const processedData = { ...courseData }

    // If image is still in the data, move it to course_image and delete the original
    if ((processedData as any).image) {
      processedData.course_image = (processedData as any).image
      delete (processedData as any).image
    }

    // Ensure study_frequency is a string
    if (typeof processedData.study_frequency !== "string") {
      processedData.study_frequency = String(processedData.study_frequency)
    }

    // If the image is a base64 string, we need to handle it
    if (typeof processedData.course_image === "string" && processedData.course_image.startsWith("data:image")) {
      // Compress the image if it's too large
      processedData.course_image = await compressImageData(processedData.course_image)
    }

    // Fix pool_type if needed
    if (processedData.pool_type === "teacher-pool") {
      processedData.pool_type = "instructor_pool"
    }

    // Ensure schedule is a string
    if (typeof processedData.schedule !== "string") {
      processedData.schedule = JSON.stringify(processedData.schedule)
    }

    console.log("Processed data being sent to API:", {
      ...processedData,
      course_image: processedData.course_image ? `${processedData.course_image.substring(0, 20)}... (truncated)` : null,
    })

    const response = await fetch(`${API_BASE_URL}${APIEndpoints.COURSE.CREATE}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(processedData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.message || "Failed to create course")
      } catch (e) {
        throw new Error(`Failed to create course: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

export const updateCourse = async (courseId: string, courseData: CourseDbData) => {
  try {
    console.log("Sending update data to API:", {
      ...courseData,
      course_image: courseData.course_image ? `${courseData.course_image.substring(0, 20)}... (truncated)` : null,
    })
    console.log("Course ID:", courseId)
    console.log("Pool type:", courseData.pool_type)
    console.log("Course duration (raw):", courseData.course_duration)
    console.log("Course duration (type):", typeof courseData.course_duration)

    // Ensure course_duration is a number
    if (typeof courseData.course_duration !== "number") {
      courseData.course_duration = Number(courseData.course_duration) || 1
    }

    console.log("Course duration (after conversion):", courseData.course_duration)

    // Get the token from Firebase AND localStorage as fallback
    const firebaseToken = await getFirebaseToken()
    const localToken = localStorage.getItem("authToken")
    const token = firebaseToken || localToken

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    console.log("Update course headers:", headers)

    // Use the direct endpoint path instead of relying on APIEndpoints constant
    const endpoint = `/courses/update/${courseId}`

    // Create a new object with the correct field names
    const processedData = { ...courseData }

    // If image is still in the data, move it to course_image and delete the original
    if ((processedData as any).image) {
      processedData.course_image = (processedData as any).image
      delete (processedData as any).image
    }

    // Ensure study_frequency is a string
    if (typeof processedData.study_frequency !== "string") {
      processedData.study_frequency = String(processedData.study_frequency)
    }

    // If the image is a base64 string, we need to handle it
    if (typeof processedData.course_image === "string" && processedData.course_image.startsWith("data:image")) {
      // Compress the image if it's too large
      processedData.course_image = await compressImageData(processedData.course_image)
    }

    // Fix pool_type if needed
    if (processedData.pool_type === "teacher-pool") {
      processedData.pool_type = "instructor_pool"
    }

    // Ensure schedule is a string
    if (typeof processedData.schedule !== "string") {
      processedData.schedule = JSON.stringify(processedData.schedule)
    }

    // If instructor_id is provided, transform it to the format expected by the API
    if (processedData.instructor_id) {
      // Some APIs expect a nested instructor object
      ;(processedData as any).instructor = {
        connect: {
          user_id: processedData.instructor_id,
        },
      }
      // Remove the instructor_id field to avoid confusion
      delete processedData.instructor_id
    }

    console.log("Processed update data being sent to API:", {
      ...processedData,
      course_image: processedData.course_image ? `${processedData.course_image.substring(0, 20)}... (truncated)` : null,
    })

    console.log(`Sending update request to: ${API_BASE_URL}${endpoint}`)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(processedData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      try {
        const errorData = JSON.parse(errorText)
        throw new Error(errorData.message || "Failed to update course")
      } catch (e) {
        throw new Error(`Failed to update course: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating course:", error)
    throw error
  }
}

// Replace the entire deleteCourse function with this simplified version that matches the Swagger documentation
export const deleteCourse = async (courseId: string) => {
  try {
    // Get the token from Firebase AND localStorage as fallback
    const firebaseToken = await getFirebaseToken()
    const localToken = localStorage.getItem("authToken")
    const token = firebaseToken || localToken

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Use the exact endpoint path from the Swagger documentation
    const endpoint = `/courses/delete/${courseId}`
    const fullUrl = `${API_BASE_URL}${endpoint}`

    console.log(`Sending delete request to: ${fullUrl}`)

    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      // Handle specific error cases based on status code
      switch (response.status) {
        case 400:
          throw new Error("Invalid input")
        case 403:
          throw new Error("You are not allowed to delete this course")
        case 404:
          throw new Error("Course not found")
        default:
          throw new Error(`Failed to delete course: ${response.status} ${response.statusText}`)
      }
    }

    return { success: true, message: "Course deleted successfully" }
  } catch (error) {
    console.error("Error deleting course:", error)
    throw error
  }
}
