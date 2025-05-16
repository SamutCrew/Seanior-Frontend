export interface RequestedSlot {
  id: string
  requestId: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface CourseInRequest {
  course_id: string
  course_name: string
}

export interface StudentInRequest {
  user_id: string
  name: string
  email: string
  profile_img?: string
}

export interface CourseRequest {
  request_id: string
  course_id: string
  student_id: string
  request_price: number
  request_location: string
  status: string
  request_date: string
  start_date_for_first_week: string
  notes?: string
  created_at: string
  updated_at: string
  Course?: CourseInRequest
  student?: StudentInRequest
  requestedSlots?: RequestedSlot[]
}

export interface EnrollmentWithDetails {
  enrollment_id: string
  request_id: string
  start_date: string
  end_date: string | null
  status: string
  request_date: string
  target_sessions_to_complete: number
  max_sessions_allowed: number
  actual_sessions_attended: number
  created_at: string
  updated_at: string
  request?: CourseRequest
}
