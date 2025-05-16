import apiClient from "./api_client"
import { APIEndpoints } from "@/constants/apiEndpoints"

// Modify the getAllCourses function to better handle network errors
export const getAllCourses = async () => {
  try {
    console.log("Fetching all courses...")
    const response = await apiClient.get(APIEndpoints.COURSE.RETRIEVE.ALL)
    console.log("API Response for all courses:", response)
    return response.data
  } catch (error: any) {
    // More detailed error logging
    console.error("Error fetching all courses:", {
      message: error?.message || "Unknown error",
      status: error?.response?.status,
      data: error?.response?.data,
      stack: error?.stack,
    })

    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}

// Get course by ID
// Get course by ID
export const getCourseById = async (courseId: string) => {
  try {
    console.log(`Fetching course with ID: ${courseId}`)
    const response = await apiClient.get(`/courses/byCourse/${courseId}`)

    // Log the raw response for debugging
    console.log("Raw API response:", response)

    // Log the parsed course data
    console.log("Course data received:", response.data)

    return response.data
  } catch (error: any) {
    console.error("Error fetching course:", error)

    // Provide more detailed error information
    if (error.response) {
      console.error(`Server responded with status: ${error.response.status}`)
      console.error("Response data:", error.response.data)

      if (error.response.status === 404) {
        throw new Error("Course not found. It may have been removed or is unavailable.")
      }
    } else if (error.request) {
      console.error("No response received from server")
      throw new Error("No response from server. Please check your connection and try again.")
    }

    throw error
  }
}

// New function to get courses by instructor ID
export const getCoursesByInstructorId = async (instructorId: string) => {
  try {
    // Use the endpoint from the documentation
    const url = `/courses/byInstructor/${instructorId}`
    console.log(`Fetching courses for instructor ${instructorId} from: ${url}`)

    const response = await apiClient.get(url)
    console.log("API Response for instructor courses:", response)
    
    // Return the data array or an empty array if the response is invalid
    return response.data || []
  } catch (error: any) {
    // More detailed error logging
    console.error("Error fetching instructor courses:", {
      instructorId,
      message: error?.message || "Unknown error",
      status: error?.response?.status,
      data: error?.response?.data,
      stack: error?.stack,
    })

    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}


// Create a new course
export const createCourse = async (courseData: any) => {
  try {
    // Process schedule data if it exists
    const processedData = { ...courseData }

    if (processedData.schedule && typeof processedData.schedule === "object") {
      // Convert schedule to JSON string for API
      processedData.schedule = JSON.stringify(processedData.schedule)
      console.log("Schedule data converted to string for API:", processedData.schedule)
    }

    console.log("Creating course with data:", processedData)
    const response = await apiClient.post(APIEndpoints.COURSE.CREATE, processedData)
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
    // Create a deep copy of the data to avoid reference issues
    const processedData = JSON.parse(JSON.stringify(courseData))

    // Clean up the data before sending to API
    const cleanedData = Object.fromEntries(
      Object.entries(processedData).filter(([_, value]) => value !== undefined && value !== null),
    )

    // Ensure schedule is properly formatted if it exists
    if (cleanedData.schedule && typeof cleanedData.schedule === "object") {
      console.log("Schedule data in API before formatting:", cleanedData.schedule)

      // Log selected days for debugging
      const selectedDays = Object.keys(cleanedData.schedule)
        .filter((day) => cleanedData.schedule[day].selected)
        .join(", ")
      console.log("Selected days before API call:", selectedDays || "None")

      // Convert schedule to JSON string for API
      cleanedData.schedule = JSON.stringify(cleanedData.schedule)
      console.log("Schedule data in API after formatting (stringified):", cleanedData.schedule)
    }

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
        // Create a deep copy of the data again for PATCH request
        const processedData = JSON.parse(JSON.stringify(courseData))

        // Clean up the data
        const cleanedData = Object.fromEntries(
          Object.entries(processedData).filter(([_, value]) => value !== undefined && value !== null),
        )

        // Ensure schedule is properly formatted
        if (cleanedData.schedule && typeof cleanedData.schedule === "object") {
          // Log selected days for debugging
          const selectedDays = Object.keys(cleanedData.schedule)
            .filter((day) => cleanedData.schedule[day].selected)
            .join(", ")
          console.log("Selected days before PATCH API call:", selectedDays || "None")

          cleanedData.schedule = JSON.stringify(cleanedData.schedule)
        }

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

    // Validate file before uploading
    if (!imageFile) {
      console.error("No image file provided for course image upload")
      throw new Error("Image file is required")
    }

    console.log("Course image file details:", {
      name: imageFile.name,
      type: imageFile.type,
      size: `${(imageFile.size / 1024).toFixed(2)} KB`,
    })

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

    // Validate file before uploading
    if (!imageFile) {
      console.error("No image file provided for pool image upload")
      throw new Error("Image file is required")
    }

    console.log("Pool image file details:", {
      name: imageFile.name,
      type: imageFile.type,
      size: `${(imageFile.size / 1024).toFixed(2)} KB`,
    })

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

export const createCourseRequest = async (requestData: {
  courseId: string
  startDateForFirstWeek: string
  selectedSlots: Array<{
    dayOfWeek: string
    startTime: string
    endTime: string
  }>
  notes?: string
}) => {
  try {
    const response = await apiClient.post("/course-requests", requestData)
    return response.data
  } catch (error) {
    console.error("Error creating course request:", error)
    throw error
  }
}