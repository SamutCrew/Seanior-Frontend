import apiClient from "./api_client"
import { APIEndpoints } from "@/constants/apiEndpoints"

// Get all courses
export const getAllCourses = async () => {
  try {
    const response = await apiClient.get(APIEndpoints.COURSE.RETRIEVE.ALL)
    console.log("API Response for all courses:", response)
    return response.data
  } catch (error: any) {
    console.error("Error fetching all courses:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })

    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}

// Get course by ID
export const getCourseById = async (courseId: string) => {
  const url = `${APIEndpoints.COURSE.RETRIEVE.BY_ID}/${courseId}`
  try {
    const response = await apiClient.get(url)
    console.log("API Response for course details:", response)
    return response.data
  } catch (error: any) {
    console.error("Error fetching course details:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })

    // Return null instead of throwing to prevent cascading errors
    return null
  }
}

// Get courses by instructor ID
export const getCoursesByInstructorId = async (instructorId: string) => {
  const url = `${APIEndpoints.COURSE.RETRIEVE.BY_INSTRUCTOR}/${instructorId}`
  try {
    const response = await apiClient.get(url)
    console.log("API Response for instructor courses:", response)
    return response.data
  } catch (error: any) {
    console.error("Error fetching instructor courses:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })

    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}

// Create a new course
export const createCourse = async (courseData: any) => {
  try {
    const response = await apiClient.post(APIEndpoints.COURSE.CREATE, courseData)
    console.log("API Response for create course:", response)
    return response.data
  } catch (error: any) {
    console.error("Error creating course:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}

// Update a course
export const updateCourse = async (courseId: string, courseData: any) => {
  const url = `${APIEndpoints.COURSE.UPDATE}/${courseId}`
  try {
    const response = await apiClient.put(url, courseData)
    console.log("API Response for update course:", response)
    return response.data
  } catch (error: any) {
    console.error("Error updating course:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}

// Delete a course
export const deleteCourse = async (courseId: string) => {
  const url = `${APIEndpoints.COURSE.DELETE}/${courseId}`
  try {
    const response = await apiClient.delete(url)
    console.log("API Response for delete course:", response)
    return response.data
  } catch (error: any) {
    console.error("Error deleting course:", {
      message: error.message,
      response: error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : null,
    })
    throw error
  }
}
