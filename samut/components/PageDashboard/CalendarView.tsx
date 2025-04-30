"use client"

import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import type { ScheduleItem } from "@/types/schedule"
import { useAppSelector } from "@/app/redux"

interface CalendarViewProps {
  selectedDate: Date | null
  setSelectedDate: (date: Date) => void
  filteredSchedule: ScheduleItem[]
}

export default function CalendarView({ selectedDate, setSelectedDate, filteredSchedule }: CalendarViewProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div
      className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"} rounded-lg shadow-sm lg:col-span-2`}
    >
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-b"}`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center gap-2`}>
          <FaCalendarAlt className={`h-5 w-5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} /> Calendar View
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              className={`rounded-md border ${isDarkMode ? "dark" : ""}`}
            />
          </div>
          <div className="flex-1">
            <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-slate-800"} mb-3`}>
              {selectedDate?.toDateString()}
            </h3>

            {filteredSchedule.find((day) => new Date(day.date).toDateString() === selectedDate?.toDateString()) ? (
              <div className="space-y-3">
                {filteredSchedule
                  .find((day) => new Date(day.date).toDateString() === selectedDate?.toDateString())
                  ?.courses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-3 border rounded-lg ${
                        isDarkMode ? "border-slate-700 hover:bg-slate-700" : "hover:bg-slate-50"
                      }`}
                    >
                      <h4 className={`font-medium ${isDarkMode ? "text-white" : ""}`}>{course.title}</h4>
                      <div
                        className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-1`}
                      >
                        <FaClock className="h-3 w-3" /> {course.schedule}
                      </div>
                      <div
                        className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"} mt-1`}
                      >
                        <FaMapMarkerAlt className="h-3 w-3" /> {course.location}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                className={`${
                  isDarkMode ? "text-gray-400 border-slate-700" : "text-slate-500"
                } text-center py-8 border rounded-lg`}
              >
                No classes scheduled for this day
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
