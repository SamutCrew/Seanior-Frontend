import  apiClient  from "./api_client"
import type { EnrollmentWithDetails } from "@/types/enrollment"

// Get all enrollments for the logged-in instructor
export const getInstructorEnrollments = async (): Promise<EnrollmentWithDetails[]> => {
  try {
    const response = await apiClient.get("/enrollments/instructor")
    return response.data
  } catch (error) {
    console.error("Error fetching instructor enrollments:", error)
    throw error
  }
}

// Get all enrollments for the logged-in student
export const getStudentEnrollments = async (): Promise<EnrollmentWithDetails[]> => {
  try {
    const response = await apiClient.get("/enrollments/my")
    return response.data
  } catch (error) {
    console.error("Error fetching student enrollments:", error)
    throw error
  }
}

// Update enrollment status (this would need a custom endpoint on your backend)
export const updateEnrollmentStatus = async (enrollmentId: string, status: string): Promise<EnrollmentWithDetails> => {
  try {
    const response = await apiClient.patch(`/enrollments/${enrollmentId}`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating enrollment ${enrollmentId} status:`, error)
    throw error
  }
}

// Update attendance records (this would need a custom endpoint on your backend)
export const updateAttendance = async (
  enrollmentId: string,
  sessionsAttended: number,
): Promise<EnrollmentWithDetails> => {
  try {
    // This would be a real API call in your implementation
    // For now, we'll just return a mock response
    return {
      enrollment_id: enrollmentId,
      actual_sessions_attended: sessionsAttended,
      // Other fields would be included here
    } as EnrollmentWithDetails
  } catch (error) {
    console.error("Error updating attendance:", error)
    throw error
  }
}
