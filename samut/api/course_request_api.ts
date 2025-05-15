import  apiClient  from "./api_client"

// Get pending course requests for the instructor
export const getPendingCourseRequests = async () => {
  try {
    const response = await apiClient.get("/course-requests/instructor/pending-request")
    return response.data
  } catch (error) {
    console.error("Error fetching pending course requests:", error)
    throw error
  }
}

// Approve a course request
export const approveCourseRequest = async (requestId: string) => {
  try {
    const response = await apiClient.put(`/course-requests/${requestId}/approve`)
    return response.data
  } catch (error) {
    console.error("Error approving course request:", error)
    throw error
  }
}

// Reject a course request
export const rejectCourseRequest = async (requestId: string) => {
  try {
    const response = await apiClient.put(`/course-requests/${requestId}/reject`)
    return response.data
  } catch (error) {
    console.error("Error rejecting course request:", error)
    throw error
  }
}
