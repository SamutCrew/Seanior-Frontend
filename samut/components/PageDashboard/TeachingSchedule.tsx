import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa"
import type { ScheduleItem } from "@/types/schedule"
import { getLevelColor } from "@/utils/courseHelpers"
import { useAppSelector } from "@/app/redux"

interface TeachingScheduleProps {
  filteredSchedule: ScheduleItem[]
}

export default function TeachingSchedule({ filteredSchedule }: TeachingScheduleProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"} rounded-lg shadow-sm`}>
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-b"}`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center gap-2`}>
          <FaCalendarAlt className={`h-5 w-5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} /> Teaching Schedule
        </h2>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-1`}>
          Your upcoming classes and sessions
        </p>
      </div>
      <div className="p-4">
        {filteredSchedule.length > 0 ? (
          <div className="space-y-6">
            {filteredSchedule.map((day) => (
              <div key={day.id} className={`border rounded-lg overflow-hidden ${isDarkMode ? "border-slate-700" : ""}`}>
                <div
                  className={`${isDarkMode ? "bg-slate-700" : "bg-slate-50"} p-4 ${isDarkMode ? "border-slate-600" : "border-b"}`}
                >
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    {day.day}, {new Date(day.date).toLocaleDateString()}
                  </h3>
                </div>
                <div className={`divide-y ${isDarkMode ? "divide-slate-700" : ""}`}>
                  {day.courses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-5 ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-50"} transition-colors`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                            {course.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`text-sm px-2 py-1 rounded ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "bg-slate-700 text-gray-300" : "bg-slate-100 text-slate-800"
                              } px-2 py-1 rounded flex items-center gap-1`}
                            >
                              <FaClock className="h-3 w-3" /> {course.schedule}
                            </span>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "bg-slate-700 text-gray-300" : "bg-slate-100 text-slate-800"
                              } px-2 py-1 rounded flex items-center gap-1`}
                            >
                              <FaMapMarkerAlt className="h-3 w-3" /> {course.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>Students</div>
                            <div className={`font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                              {course.students}/{course.maxStudents}
                            </div>
                            <div
                              className={`w-24 ${isDarkMode ? "bg-slate-600" : "bg-slate-200"} rounded-full h-2 mt-1`}
                            >
                              <div
                                className={`${isDarkMode ? "bg-cyan-400" : "bg-cyan-500"} h-2 rounded-full`}
                                style={{ width: `${(course.students / course.maxStudents) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <button
                            className={`${
                              isDarkMode
                                ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
                                : "bg-cyan-600 hover:bg-cyan-700"
                            } text-white px-4 py-2 rounded-lg`}
                          >
                            View Students
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
            No scheduled classes found matching your search
          </div>
        )}
      </div>
    </div>
  )
}
