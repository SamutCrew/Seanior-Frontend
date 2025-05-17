import apiClient from "./api_client"
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
    const response = await apiClient.get("/enrollments/my?include=request.Course")
    return response.data
  } catch (error) {
    console.error("Error fetching student enrollments:", error)
    throw error
  }
}

// Get a specific enrollment by ID (can be used by both instructor and student views)
export const getEnrollmentById = async (enrollmentId: string): Promise<EnrollmentWithDetails> => {
  try {
    // First try to get from instructor enrollments
    const instructorEnrollments = await getInstructorEnrollments()
    const enrollment = instructorEnrollments.find((e) => e.enrollment_id === enrollmentId)

    if (enrollment) {
      return enrollment
    }

    // If not found in instructor enrollments, try student enrollments
    const studentEnrollments = await getStudentEnrollments()
    const studentEnrollment = studentEnrollments.find((e) => e.enrollment_id === enrollmentId)

    if (studentEnrollment) {
      return studentEnrollment
    }

    throw new Error(`Enrollment with ID ${enrollmentId} not found`)
  } catch (error) {
    console.error(`Error fetching enrollment ${enrollmentId}:`, error)
    throw error
  }
}

// Update enrollment status
export const updateEnrollmentStatus = async (enrollmentId: string, status: string): Promise<EnrollmentWithDetails> => {
  try {
    const response = await apiClient.patch(`/enrollments/${enrollmentId}`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating enrollment ${enrollmentId} status:`, error)
    throw error
  }
}

// Update enrollment details
export const updateEnrollment = async (
  enrollmentId: string,
  data: {
    status?: string
    target_sessions_to_complete?: number
    max_sessions_allowed?: number
    actual_sessions_attended?: number
    start_date?: string
    end_date?: string
    notes?: string
  },
): Promise<EnrollmentWithDetails> => {
  try {
    const response = await apiClient.patch(`/enrollments/${enrollmentId}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating enrollment ${enrollmentId}:`, error)
    throw error
  }
}

// Update attendance records
export const updateAttendance = async (
  enrollmentId: string,
  sessionsAttended: number,
): Promise<EnrollmentWithDetails> => {
  try {
    const response = await apiClient.patch(`/enrollments/${enrollmentId}/attendance`, {
      actual_sessions_attended: sessionsAttended,
    })
    return response.data
  } catch (error) {
    console.error("Error updating attendance:", error)
    throw error
  }
}
