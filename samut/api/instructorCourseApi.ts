import { APIEndpoints } from "@/constants/apiEndpoints"
import { Instructor, Course } from "@/types"
import apiClient from "@/api/api_client" // เปลี่ยนตาม path ที่คุณวางไว้

export async function fetchInstructors(): Promise<Instructor[]> {
  const res = await apiClient.get(APIEndpoints.INSTRUCTOR.RETRIEVE.ALL)
  const data = res.data

  return data.map((instructor: any) => ({
    id: instructor.user_id,
    name: instructor.name,
    email: instructor.email,
    profile_img: instructor.profile_img,
    description: instructor.description, // ✅ ไม่ flatten
  }))
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await apiClient.get(APIEndpoints.COURSE.RETRIEVE.ALL)
  return res.data
}