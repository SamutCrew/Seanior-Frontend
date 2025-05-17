import apiClient from "./api_client"
import type { SessionProgress, ProgressMilestone, SkillAssessment } from "@/types/progress"

// Get all session progress records for an enrollment
export const getEnrollmentProgress = async (enrollmentId: string): Promise<SessionProgress[]> => {
  try {
    const response = await apiClient.get(`/enrollments/${enrollmentId}/session-progress`)
    return response.data || []
  } catch (error) {
    console.error(`Error fetching progress for enrollment ${enrollmentId}:`, error)
    // Return empty array instead of throwing to prevent UI from breaking
    return []
  }
}

// Create a new session progress record
export const createSessionProgress = async (
  enrollmentId: string,
  data: {
    sessionNumber: number
    topicCovered: string
    performanceNotes: string
    dateSession: string
  },
): Promise<SessionProgress> => {
  try {
    console.log("Creating session progress with data:", data)
    const response = await apiClient.post(`/enrollments/${enrollmentId}/session-progress`, data)
    return response.data
  } catch (error) {
    console.error("Error creating session progress:", error)
    throw error
  }
}

// Update an existing session progress record
export const updateSessionProgress = async (
  sessionProgressId: string,
  data: {
    sessionNumber?: number
    topicCovered?: string
    performanceNotes?: string
    dateSession?: string
  },
): Promise<SessionProgress> => {
  try {
    console.log("Updating session progress with data:", data)
    const response = await apiClient.put(`/session-progress/${sessionProgressId}`, data)
    return response.data
  } catch (error) {
    console.error(`Error updating session progress ${sessionProgressId}:`, error)
    throw error
  }
}

// Delete a session progress record
export const deleteSessionProgress = async (sessionProgressId: string): Promise<void> => {
  try {
    await apiClient.delete(`/session-progress/${sessionProgressId}`)
  } catch (error) {
    console.error(`Error deleting session progress ${sessionProgressId}:`, error)
    throw error
  }
}

// Get all milestones for an enrollment
export const getEnrollmentMilestones = async (enrollmentId: string): Promise<ProgressMilestone[]> => {
  try {
    const response = await apiClient.get(`/enrollments/${enrollmentId}/milestones`)
    return response.data || []
  } catch (error) {
    console.error(`Error fetching milestones for enrollment ${enrollmentId}:`, error)
    // Return empty array instead of throwing
    return []
  }
}

// Get all skill assessments for an enrollment
export const getEnrollmentSkills = async (enrollmentId: string): Promise<SkillAssessment[]> => {
  try {
    const response = await apiClient.get(`/enrollments/${enrollmentId}/skills`)
    return response.data || []
  } catch (error) {
    console.error(`Error fetching skills for enrollment ${enrollmentId}:`, error)
    // Return empty array instead of throwing
    return []
  }
}
