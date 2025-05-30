import { APIEndpoints } from "@/constants/apiEndpoints"
import type { Instructor, Course, InstructorAdmin } from "@/types"
import apiClient from "@/api/api_client"

export async function fetchInstructors(): Promise<Instructor[]> {
  try {
    // Add error handling and fallback for unauthenticated requests
    const res = await apiClient.get(APIEndpoints.INSTRUCTOR.RETRIEVE.ALL)
    const data = res.data

    return data.map((instructor: any) => ({
      id: instructor.user_id,
      name: instructor.name,
      email: instructor.email,
      profile_img: instructor.profile_img,
      description: instructor.description,
    }))
  } catch (error) {
    console.error("Error fetching instructors:", error)
    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}

export async function fetchInstructorsAdmin(): Promise<InstructorAdmin[]> {
  try {
    const res = await apiClient.get(APIEndpoints.INSTRUCTOR.RETRIEVE.ALL)
    const data = res.data

    return data.map((instructor: any) => ({
      id: instructor.user_id,
      firebase_uid: instructor.firebase_uid,
      email: instructor.email,
      name: instructor.name,
      gender: instructor.gender,
      address: instructor.address,
      phone_number: instructor.phone_number,
      profile_img: instructor.profile_img,
      user_type: instructor.user_type,
      description: instructor.description,
      created_at: instructor.created_at,
      updated_at: instructor.updated_at,
    }))
  } catch (error) {
    console.error("Error fetching admin instructors:", error)
    return []
  }
}

export async function fetchCourses(instructorId?: string): Promise<Course[]> {
  try {
    // Use the same endpoint as the dashboard
    const res = await apiClient.get(APIEndpoints.COURSE.RETRIEVE.ALL)

    // If instructorId is provided, filter courses by instructor
    if (instructorId) {
      return res.data.filter((course: any) => {
        // Check various ways the instructor might be associated with the course
        return (
          course.instructor_id === instructorId ||
          course.instructor === instructorId ||
          (course.instructor && typeof course.instructor === "object" && course.instructor.id === instructorId) ||
          course.user_id === instructorId
        )
      })
    }

    return res.data
  } catch (error) {
    console.error("Error fetching courses:", error)
    // Return empty array instead of throwing to prevent cascading errors
    return []
  }
}
