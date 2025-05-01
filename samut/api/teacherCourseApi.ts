import { APIEndpoints } from "@/constants/apiEndpoints"
import { Teacher, Course } from "@/types"
import apiClient from "@/api/api_client" // เปลี่ยนตาม path ที่คุณวางไว้

export async function fetchTeachers(): Promise<Teacher[]> {
  const res = await apiClient.get(APIEndpoints.TEACHER.RETRIEVE.ALL)
  const data = res.data

  return data.map((teacher: any) => ({
    id: teacher.user_id,
    name: teacher.name,
    email: teacher.email,
    profile_img: teacher.profile_img,
    description: teacher.description, // ✅ ไม่ flatten
  }))
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await apiClient.get(APIEndpoints.COURSE.RETRIEVE.ALL)
  return res.data
}