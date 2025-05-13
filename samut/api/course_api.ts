
import apiClient from "@/api/api_client";

import { Course } from '@/types/course';

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


// Existing functions...
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


export const updateCourse = async (courseId: string, updatedData: Partial<Course>) => {
  const url = APIEndpoints.COURSE.UPDATE.replace("[courseId]", courseId)

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


export const deleteCourse = async (courseId: string) => {
  const url = APIEndpoints.COURSE.DELETE.replace("[courseId]", courseId);
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting course:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};

// New functions for image uploads
export const uploadCourseImage = async (courseId: string, file: File) => {
  const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_COURSE_IMAGE.replace("[courseId]", courseId);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading course image:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};

export const uploadPoolImage = async (courseId: string, file: File) => {
  const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_POOL_IMAGE.replace("[courseId]", courseId);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading pool image:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    });
    throw error;
  }
};
  

