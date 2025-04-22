export interface Course {
    id: number
    title: string
    level: string
    schedule: string
    students: number
    maxStudents: number
    location: string
  }
  
  export interface ScheduleItem {
    id: number
    date: string
    day: string
    courses: Course[]
  }
  
  export interface Request {
    id: number
    name: string
    type: string
    date: string
  }
  