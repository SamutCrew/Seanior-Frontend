import { APIEndpoints } from "@/constants/apiEndpoints"
import { Instructor, Course, InstructorAdmin } from "@/types"
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

export async function fetchInstructorsAdmin(): Promise<InstructorAdmin[]> {
  const res = await apiClient.get(APIEndpoints.INSTRUCTOR.RETRIEVE.ALL);
  const data = res.data;

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
  }));
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await apiClient.get(APIEndpoints.COURSE.RETRIEVE.ALL)
  return res.data
}