import { FaSwimmer, FaUsers, FaStar, FaDollarSign } from "react-icons/fa"
import type { Course } from "@/app/types/course"

interface CourseStatsProps {
  courses: Course[]
}

export default function CourseStats({ courses }: CourseStatsProps) {
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const avgRating =
    courses.length > 0 ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1) : "0.0"
  const totalRevenue = courses.reduce((sum, course) => sum + course.price * course.students, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-5 border border-sky-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="bg-sky-100 p-3 rounded-full">
            <FaSwimmer className="text-sky-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-sky-800">{courses.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 border border-emerald-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <FaUsers className="text-emerald-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Students</p>
            <p className="text-2xl font-bold text-emerald-800">{totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 border border-amber-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <FaStar className="text-amber-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg Rating</p>
            <p className="text-2xl font-bold text-amber-800">{avgRating}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 border border-purple-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <FaDollarSign className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-800">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
