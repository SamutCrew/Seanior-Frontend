import  apiClient  from "./api_client"
import type { SessionProgress } from "@/types/progress"

// Get all session progress records for an enrollment
export const getEnrollmentProgress = async (enrollmentId: string): Promise<SessionProgress[]> => {
  try {
    const response = await apiClient.get(`/enrollments/${enrollmentId}/session-progress`)
    return response.data
  } catch (error) {
    console.error(`Error fetching progress for enrollment ${enrollmentId}:`, error)
    throw error
  }
}

// Create a new session progress record
export const createSessionProgress = async (
  enrollmentId: string,
  progressData: Omit<SessionProgress, "session_progress_id" | "enrollment_id" | "created_at" | "updated_at">,
): Promise<SessionProgress> => {
  try {
    const response = await apiClient.post(`/enrollments/${enrollmentId}/session-progress`, progressData)
    return response.data
  } catch (error) {
    console.error(`Error creating progress for enrollment ${enrollmentId}:`, error)
    throw error
  }
}

// Get a specific session progress record
export const getSessionProgress = async (progressId: string): Promise<SessionProgress> => {
  try {
    const response = await apiClient.get(`/session-progress/${progressId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching progress ${progressId}:`, error)
    throw error
  }
}

// Update a session progress record
export const updateSessionProgress = async (
  progressId: string,
  progressData: Partial<Omit<SessionProgress, "session_progress_id" | "enrollment_id" | "created_at" | "updated_at">>,
): Promise<SessionProgress> => {
  try {
    const response = await apiClient.put(`/session-progress/${progressId}`, progressData)
    return response.data
  } catch (error) {
    console.error(`Error updating progress ${progressId}:`, error)
    throw error
  }
}

// Delete a session progress record (this would need a custom endpoint on your backend)
export const deleteSessionProgress = async (progressId: string): Promise<void> => {
  try {
    await apiClient.delete(`/session-progress/${progressId}`)
  } catch (error) {
    console.error(`Error deleting progress ${progressId}:`, error)
    throw error
  }
}
