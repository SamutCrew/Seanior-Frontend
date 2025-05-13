export type CourseType = "private-location" | "public-pool" | "teacher-pool"
export type CourseStatus = "open" | "in-progress" | "completed"

export interface Course {
  course_id: string
  id?: string // Added for compatibility
  course_name: string
  title?: string // Added for compatibility
  instructor_id: string
  price: number
  pool_type: string
  courseType?: string // Added for compatibility
  location?: string | { address: string } // Updated to handle both string and object
  description: string
  focus?: string // Added for compatibility
  course_duration: number
  duration?: string // Added for compatibility
  study_frequency: number | string
  days_study: number
  number_of_total_sessions: number
  level: string
  schedule: string | object
  rating?: number
  students: number
  max_students?: number
  maxStudents?: number // Added for compatibility
  course_image?: string
  image?: string // Added for compatibility
  pool_image?: string
  poolImage?: string // Added for compatibility
  created_at: string
  updated_at: string
  instructor?:
    | {
        user_id: string
        firebase_uid: string
        email: string
        name: string
        password: string | null
        gender: string | null
        address: string | null
        phone_number: string | null
        profile_img: string | null
        user_type: string | null
        description: string | null
        created_at: string
        updated_at: string
      }
    | string // Updated to handle both object and string
  instructorImage?: string // Added for compatibility
  courseImageFile?: File // Added for file upload
  poolImageFile?: File // Added for file upload
}

export interface CourseProgress {
  overallCompletion: number
  modules: CourseModule[]
  lastUpdated: string
  sessionDetails?: StudySessionDetail[]
  weeklyUpdates?: WeeklyUpdate[]
}

export interface CourseModule {
  id: number
  title: string
  completion: number
  topics: CourseTopic[]
}

export interface CourseTopic {
  id: number
  title: string
  completed: boolean
}

export interface StudySessionDetail {
  id: string
  date: string
  title: string
  description: string
  images: string[]
  moduleId: number
  topicId: number
}

export interface WeeklyUpdate {
  id: string
  weekNumber: number
  date: string
  title: string
  content: string
  achievements: string
  challenges: string
  nextSteps: string
  images: string[]
}

export interface StudentProgress {
  studentId: string
  studentName: string
  attendance: number
  completedLessons: number
  totalLessons: number
  lastAttendance: string
  notes: string
}

export interface ImageUploadResponse {
  message: string;
  resource_url: string;
  resource_id: string;
}