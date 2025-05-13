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
  try {
    // Replace the placeholder in the URL with the actual courseId
    const url = APIEndpoints.COURSE.RETRIEVE.BY_ID.replace("[courseId]", courseId)
    console.log(`Fetching course details from: ${url}`)

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

// Create a new course
export const createCourse = async (courseData: any) => {
  try {
    console.log("Creating course with data:", courseData)
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
  try {
    // Clean up the data before sending to API
    const cleanedData = Object.fromEntries(
      Object.entries(courseData).filter(([_, value]) => value !== undefined && value !== null),
    )

    console.log(`Updating course ${courseId} with data:`, cleanedData)

    // Correctly replace the placeholder in the URL with the actual courseId
    const url = APIEndpoints.COURSE.UPDATE.replace("[courseId]", courseId)
    console.log(`Sending PUT request to ${url}`)

    // Some APIs expect PUT, others PATCH - try PUT first
    const response = await apiClient.put(url, cleanedData)
    console.log("API Response for update course:", response)
    return response.data
  } catch (putError: any) {
    console.error("Error updating course with PUT:", {
      message: putError.message,
      response: putError.response
        ? {
            status: putError.response.status,
            data: putError.response.data,
          }
        : null,
    })

    // If PUT fails with 405 Method Not Allowed, try PATCH
    if (putError.response && putError.response.status === 405) {
      try {
        const url = APIEndpoints.COURSE.UPDATE.replace("[courseId]", courseId)
        console.log(`Trying PATCH request to ${url}`)
        const patchResponse = await apiClient.patch(url, cleanedData)
        console.log("API Response for update course with PATCH:", patchResponse)
        return patchResponse.data
      } catch (patchError: any) {
        console.error("Error updating course with PATCH:", {
          message: patchError.message,
          response: patchError.response
            ? {
                status: patchError.response.status,
                data: patchError.response.data,
              }
            : null,
        })
        throw patchError
      }
    }

    // If it's not a 405 error, throw the original error
    throw putError
  }
}

// Upload course image
export const uploadCourseImage = async (courseId: string, imageFile: File) => {
  try {
    const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_COURSE_IMAGE.replace("[courseId]", courseId)
    console.log(`Uploading course image to ${url}`)

    const formData = new FormData()
    formData.append("file", imageFile)
    formData.append("resource_type", "course_image")
    formData.append("resource_name", `course_${courseId}`)

    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("API Response for course image upload:", response)
    return response.data
  } catch (error: any) {
    console.error("Error uploading course image:", {
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

// Upload pool image
export const uploadPoolImage = async (courseId: string, imageFile: File) => {
  try {
    const url = APIEndpoints.RESOURCE.CREATE.UPLOAD_POOL_IMAGE.replace("[courseId]", courseId)
    console.log(`Uploading pool image to ${url}`)

    const formData = new FormData()
    formData.append("file", imageFile)
    formData.append("resource_type", "pool_image")
    formData.append("resource_name", `pool_${courseId}`)

    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("API Response for pool image upload:", response)
    return response.data
  } catch (error: any) {
    console.error("Error uploading pool image:", {
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
  try {
    // Replace the placeholder in the URL with the actual courseId
    const url = APIEndpoints.COURSE.DELETE.replace("[courseId]", courseId)
    console.log(`Deleting course from: ${url}`)

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
