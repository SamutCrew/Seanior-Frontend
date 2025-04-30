import type { Course } from "@/types/course"
import CourseCard from "./CourseCard"

interface CourseGridProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

export default function CourseGrid({ courses, onEdit, onDelete }: CourseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
