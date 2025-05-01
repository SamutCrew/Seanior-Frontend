import { APIEndpoints } from "@/constants/apiEndpoints"
import { Teacher, Course } from "@/components/Searchpage/types"

export async function fetchTeachers(): Promise<Teacher[]> {
  const res = await fetch(APIEndpoints.TEACHER.RETRIEVE.ALL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch teachers")
  }

  const data = await res.json()

  const transformed: Teacher[] = data.map((teacher: any) => ({
    id: teacher.user_id,
    name: teacher.name,
    email: teacher.email,
    profile_img: teacher.profile_img,
    specialty: teacher.description?.specialty || "",
    styles: teacher.description?.styles || [],
    levels: teacher.description?.levels || [],
    lessonType: teacher.description?.lessonType || "",
    certification: teacher.description?.certification || [],
    rating: teacher.description?.rating || 0,
    price: 0, // ใช้ 0 ไปก่อน ถ้า backend ยังไม่มี
    location: {
      lat: teacher.description?.location?.lat || 0,
      lng: teacher.description?.location?.lng || 0,
      address: teacher.description?.location?.address || "",
    },
  }))

  return transformed
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch(APIEndpoints.COURSE.RETRIEVE.ALL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch courses")
  }

  return res.json()
}