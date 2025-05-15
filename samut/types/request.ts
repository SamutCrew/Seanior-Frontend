export interface CourseRequest {
  request_id: string
  course_id: string
  student_id: string
  request_price: number
  request_location: string
  status: string
  request_date: string
  requestDayOfWeek: string
  requestTimeSlot: string
  created_at: string
  updated_at: string
  Course: {
    course_id: string
    course_name: string
    instructor: {
      user_id: string
      name: string
    }
  }
  student: {
    user_id: string
    name: string
    email: string
    profile_img: string
  }
}
