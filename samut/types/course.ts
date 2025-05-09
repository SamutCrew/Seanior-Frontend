export type CourseType = "private-location" | "public-pool" | "teacher-pool"
export type CourseStatus = "open" | "in-progress" | "completed"

export interface Course {
  course_id: string;
  course_name: string;
  instructor_id: string;
  price: number;
  pool_type: string;
  location: string;
  description: string;
  course_duration: number;
  study_frequency: number;
  days_study: number;
  number_of_total_sessions: number;
  level: string;
  schedule: string;
  rating: number;
  students: number;
  max_students: number;
  image: string;
  created_at: string;
  updated_at: string;
  instructor: {
    user_id: string;
    firebase_uid: string;
    email: string;
    name: string;
    password: string | null;
    gender: string | null;
    address: string | null;
    phone_number: string | null;
    profile_img: string | null;
    user_type: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
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
