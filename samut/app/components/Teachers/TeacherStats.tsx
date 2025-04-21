import { FaCalendarAlt, FaUsers, FaChalkboardTeacher } from "react-icons/fa"
import type { ScheduleItem, Course } from "@/app/types/schedule"

interface TeacherStatsProps {
  schedule: ScheduleItem[]
  availableCourses: Course[]
}

export default function TeacherStats({ schedule, availableCourses }: TeacherStatsProps) {
  const totalScheduledClasses = schedule.reduce((sum, day) => sum + day.courses.length, 0)
  const totalStudents = schedule.reduce(
    (sum, day) => sum + day.courses.reduce((courseSum, course) => courseSum + course.students, 0),
    0,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-100 p-3 rounded-full">
            <FaCalendarAlt className="text-cyan-600 h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Scheduled Classes</p>
            <p className="text-2xl font-bold text-slate-800">{totalScheduledClasses}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <FaUsers className="text-green-600 h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Students</p>
            <p className="text-2xl font-bold text-slate-800">{totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <FaChalkboardTeacher className="text-yellow-600 h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Available Courses</p>
            <p className="text-2xl font-bold text-slate-800">{availableCourses.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
