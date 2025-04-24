export type CourseType = "private-location" | "public-pool" | "teacher-pool"

export interface Course {
  id: number
  title: string
  focus: string
  level: string
  duration: string
  schedule: string
  instructor: string
  rating: number
  students: number
  price: number
  location: {
    address: string
  }
  courseType: CourseType
  description?: string
  curriculum?: string[]
  requirements?: string[]
  maxStudents?: number
  image?: string
}
