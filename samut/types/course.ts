export type CourseType = "private-location" | "public-pool" | "teacher-pool"

export interface Course {
  id: number
  title: string
  focus: string
  level: string
  duration: string
  schedule: string
  instructor: string
  instructorId?: string
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
  progress?: CourseProgress
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