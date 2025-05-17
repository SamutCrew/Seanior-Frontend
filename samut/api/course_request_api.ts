import apiClient from "./api_client"
import { APIEndpoints } from "@/constants/apiEndpoints"
import { getAuthToken } from "@/context/authToken"

// Get pending course requests for the instructor
export const getPendingCourseRequests = async () => {
  try {
    const response = await apiClient.get(APIEndpoints.COURSE_REQUESTS.INSTRUCTOR_PENDING)
    return response.data
  } catch (error) {
    console.error("Error fetching pending course requests:", error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

// Get all course requests for the logged-in student
export const getMyRequests = async () => {
  try {
    const token = await getAuthToken()
    if (!token) {
      console.error("No authentication token available")
      return []
    }

    const response = await apiClient.get(`${APIEndpoints.COURSE_REQUESTS.BASE}/my-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching student course requests:", error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

// Approve a course request
export const approveCourseRequest = async (requestId: string) => {
  try {
    const response = await apiClient.put(`${APIEndpoints.COURSE_REQUESTS.BASE}/${requestId}/approve`)
    return response.data
  } catch (error: any) {
    console.error("Error approving course request:", error)

    // Extract the detailed error message if available
    let errorMessage = "Failed to approve course request"
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    throw new Error(errorMessage)
  }
}

// Reject a course request
export const rejectCourseRequest = async (requestId: string) => {
  try {
    const response = await apiClient.put(`${APIEndpoints.COURSE_REQUESTS.BASE}/${requestId}/reject`)
    return response.data
  } catch (error: any) {
    console.error("Error rejecting course request:", error)

    // Extract the detailed error message if available
    let errorMessage = "Failed to reject course request"
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    throw new Error(errorMessage)
  }
}
