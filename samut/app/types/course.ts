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
}
