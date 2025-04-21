import { FaChalkboardTeacher, FaPlus, FaMapMarkerAlt } from "react-icons/fa"
import type { Course } from "@/app/types/schedule"
import { getLevelColor } from "@/app/utils/courseHelpers"

interface AvailableCoursesProps {
  availableCourses: Course[]
}

export default function AvailableCourses({ availableCourses }: AvailableCoursesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaChalkboardTeacher className="h-5 w-5 text-cyan-600" /> Available Courses
          </h2>
          <p className="text-sm text-slate-500 mt-1">Courses ready to be scheduled</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus className="h-4 w-4" /> Add Course
        </button>
      </div>
      <div className="p-4">
        {availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCourses.map((course) => (
              <div key={course.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg text-slate-800">{course.title}</h4>
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  <span className={`text-sm px-2 py-1 rounded ${getLevelColor(course.level)}`}>{course.level}</span>
                  <span className="text-sm bg-slate-100 text-slate-800 px-2 py-1 rounded flex items-center gap-1">
                    <FaMapMarkerAlt className="h-3 w-3" /> {course.location}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-slate-500">Not scheduled</span>
                  <button className="bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-sm">Schedule Class</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">No available courses. Add a new course to get started.</div>
        )}
      </div>
    </div>
  )
}
