export interface Location {
    lat: number
    lng: number
    address?: string
  }

export interface TeacherDescription {
  specialty?: string
  styles?: string[]
  levels?: string[]
  certification?: string[]
  rating?: number
  experience?: number
  lessonType?: string
  location?: Location
}

export interface Teacher {
  id: number
  name: string
  description?: TeacherDescription
  profile_img: string
}

export interface TeacherCardProps {
  teacher: Teacher
  userLocation?: Location | null
  isDarkMode?: boolean
}