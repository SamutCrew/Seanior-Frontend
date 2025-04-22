"use client"

import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import type { ScheduleItem } from "@/app/types/schedule"

interface CalendarViewProps {
  selectedDate: Date | null
  setSelectedDate: (date: Date) => void
  filteredSchedule: ScheduleItem[]
}

export default function CalendarView({ selectedDate, setSelectedDate, filteredSchedule }: CalendarViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FaCalendarAlt className="h-5 w-5 text-cyan-600" /> Calendar View
        </h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-800 mb-3">{selectedDate?.toDateString()}</h3>

            {filteredSchedule.find((day) => new Date(day.date).toDateString() === selectedDate?.toDateString()) ? (
              <div className="space-y-3">
                {filteredSchedule
                  .find((day) => new Date(day.date).toDateString() === selectedDate?.toDateString())
                  ?.courses.map((course) => (
                    <div key={course.id} className="p-3 border rounded-lg hover:bg-slate-50">
                      <h4 className="font-medium">{course.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <FaClock className="h-3 w-3" /> {course.schedule}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <FaMapMarkerAlt className="h-3 w-3" /> {course.location}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-8 border rounded-lg">No classes scheduled for this day</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
