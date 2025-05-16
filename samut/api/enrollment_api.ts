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

// Get enrollments for a specific course
export const getCourseEnrollments = async (courseId: string): Promise<EnrollmentWithDetails[]> => {
  try {
    const response = await apiClient.get(`/enrollments/course/${courseId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error)
    throw error
  }
}

