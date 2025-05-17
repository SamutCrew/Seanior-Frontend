import apiClient from "./api_client"
import type { EnrollmentWithDetails } from "@/types/enrollment"
import { getUserData } from "@/api/user_api"
import { getCourseById } from "@/api/course_api"

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
    const enrollments = response.data

    // Enhance enrollments with course and instructor images
    const enhancedEnrollments = await Promise.all(
      enrollments.map(async (enrollment: EnrollmentWithDetails) => {
        if (!enrollment.request?.Course?.course_id) {
          return enrollment
        }

        try {
          // Get course details with images
          const courseWithImages = await getCourseWithImages(enrollment.request.Course.course_id)

          // Update the enrollment with the enhanced course data
          return {
            ...enrollment,
            request: {
              ...enrollment.request,
              Course: {
                ...enrollment.request.Course,
                course_image: courseWithImages.course_image,
                pool_image: courseWithImages.pool_image,
                instructor_image: courseWithImages.instructor_image,
              },
            },
          }
        } catch (error) {
          console.error(`Error enhancing enrollment ${enrollment.enrollment_id} with images:`, error)
          return enrollment
        }
      }),
    )

    return enhancedEnrollments
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

/**
 * Get course image by course ID
 * @param courseId The ID of the course
 * @returns URL of the course image
 */
export const getCourseImageById = async (courseId: string): Promise<string | null> => {
  try {
    // Get course data which should include the image URL
    const courseData = await getCourseById(courseId)
    return courseData?.course_image || null
  } catch (error) {
    console.error(`Error fetching course image for course ${courseId}:`, error)
    return null
  }
}

/**
 * Get pool image by course ID
 * @param courseId The ID of the course
 * @returns URL of the pool image
 */
export const getPoolImageById = async (courseId: string): Promise<string | null> => {
  try {
    // Get course data which should include the pool image URL
    const courseData = await getCourseById(courseId)
    return courseData?.pool_image || null
  } catch (error) {
    console.error(`Error fetching pool image for course ${courseId}:`, error)
    return null
  }
}

/**
 * Get instructor image by instructor ID
 * @param instructorId The ID of the instructor
 * @returns URL of the instructor image
 */
export const getInstructorImageById = async (instructorId: string): Promise<string | null> => {
  try {
    // Get user data which should include the profile image URL
    const userData = await getUserData(instructorId)

    // Check for different possible image field names
    return userData?.profile_image || userData?.avatar || userData?.image || userData?.profile?.image || null
  } catch (error) {
    console.error(`Error fetching instructor image for instructor ${instructorId}:`, error)
    return null
  }
}

/**
 * Fetch course details including images
 * @param courseId The ID of the course
 * @returns Course details with image URLs
 */
export const getCourseWithImages = async (courseId: string) => {
  try {
    // Get the course details
    const courseData = await getCourseById(courseId)

    if (!courseData) {
      throw new Error(`Course with ID ${courseId} not found`)
    }

    // Get instructor image if instructor_id exists
    let instructorImage = null
    if (courseData.instructor_id) {
      instructorImage = await getInstructorImageById(courseData.instructor_id).catch(() => null)
    }

    // Make sure we have valid image URLs or fallbacks
    const courseImage = courseData.course_image || courseData.image || null
    const poolImage = courseData.pool_image || null

    // Add the image URLs to the course data
    return {
      ...courseData,
      course_image: courseImage || `/placeholder.svg?height=300&width=400&query=swimming course ${courseId}`,
      pool_image: poolImage || `/placeholder.svg?height=300&width=400&query=swimming pool`,
      instructor_image: instructorImage || `/placeholder.svg?height=200&width=200&query=swimming instructor portrait`,
    }
  } catch (error) {
    console.error(`Error fetching course with images for course ${courseId}:`, error)
    throw error
  }
}
