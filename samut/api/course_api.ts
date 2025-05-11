// src/api/course_api.ts

import apiClient from "@/api/api_client"
import { APIEndpoints } from "@/constants/apiEndpoints"
import type { Course } from "@/types/course"

export const getAllCourses = async () => {
  const url = APIEndpoints.COURSE.RETRIEVE.ALL
  try {
    const response = await apiClient.get(url)
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
    throw error
  }
}

export const createCourse = async (courseData: any) => {
  const url = APIEndpoints.COURSE.CREATE
  try {
    // Log the complete request details
    console.log("API Request - Creating course:", {
      url,
      method: "POST",
      data: courseData,
      headers: apiClient.defaults.headers,
    })

    // Make sure the instructor connection uses user_id instead of id
    if (courseData.instructor && courseData.instructor.connect) {
      // If id was used, convert it to user_id
      if (courseData.instructor.connect.id && !courseData.instructor.connect.user_id) {
        courseData.instructor.connect.user_id = courseData.instructor.connect.id
        delete courseData.instructor.connect.id
      }
    }

    console.log("Formatted data for API:", courseData)

    const response = await apiClient.post(url, courseData)
    console.log("API Response - Course created successfully:", response.data)
    return response.data
  } catch (error: any) {
    // Enhanced error logging
    console.error("Error creating course:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      response: error.response
        ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
          }
        : "No response data",
      request: error.request ? "Request was made but no response received" : "Request setup failed",
      config: error.config
        ? {
            url: error.config.url,
            method: error.config.method,
            headers: error.config.headers,
            data: error.config.data,
          }
        : "No config data",
    })

    // Rethrow with more context
    throw error
  }
}

export const updateCourse = async (courseId: string, updatedData: Partial<Course>) => {
  const url = `${APIEndpoints.COURSE.UPDATE}/${courseId}`
  try {
    const response = await apiClient.put(url, updatedData)
    return response.data
  } catch (error: any) {
    console.error("Error updating course:", error)
    throw error
  }
}

export const deleteCourse = async (courseId: string) => {
  const url = `${APIEndpoints.COURSE.DELETE}/${courseId}`
  try {
    const response = await apiClient.delete(url)
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
