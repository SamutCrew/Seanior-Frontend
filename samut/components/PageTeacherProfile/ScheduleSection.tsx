"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaClock, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import type { Availability, AvailabilitySlot } from "@/types/teacher"
import { useAppSelector } from "@/app/redux"

interface ScheduleSectionProps {
  availability: Availability
  compact?: boolean
}

export default function ScheduleSection({ availability, compact = false }: ScheduleSectionProps) {
  const [selectedDay, setSelectedDay] = useState<string>(Object.keys(availability)[0] || "monday")
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const renderTimeSlots = (slots: AvailabilitySlot[]) => {
    if (!slots.length) {
      return <p className={`text-center py-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Not available</p>
    }

    return (
      <div className="space-y-2">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-blue-50"}`}
          >
            <FaClock className={isDarkMode ? "text-cyan-400" : "text-blue-500"} />
            <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
              {slot.startTime} - {slot.endTime}
            </span>
            {slot.location && (
              <>
                <FaMapMarkerAlt className={isDarkMode ? "text-cyan-400 ml-2" : "text-blue-500 ml-2"} />
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700"}>{slot.location}</span>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className={`rounded-xl shadow-sm p-6 ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-blue-500"} /> Availability
          </h3>
        </div>

        <div className="space-y-3">
          {Object.entries(availability).map(([day, slots]) => (
            <div
              key={day}
              className={`border-b pb-2 last:border-0 ${isDarkMode ? "border-slate-700" : "border-gray-100"}`}
            >
              <p className={`font-medium capitalize mb-1 ${isDarkMode ? "text-white" : "text-gray-700"}`}>{day}</p>
              {slots.length ? (
                <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {slots.map((slot, i) => (
                    <span key={i} className="block">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              ) : (
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Not available</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Weekly Schedule</h2>

      <div
        className={`rounded-xl border overflow-hidden ${
          isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Day selector */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {Object.entries(availability).map(([day, slots]) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 py-3 px-4 text-center font-medium capitalize transition-colors
                ${
                  selectedDay === day
                    ? isDarkMode
                      ? "bg-cyan-600 text-white"
                      : "bg-blue-600 text-white"
                    : isDarkMode
                      ? "hover:bg-slate-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-700"
                }
                ${slots.length === 0 ? "opacity-60" : ""}
              `}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Time slots */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold capitalize ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {selectedDay}
            </h3>
            <div className={`text-sm flex items-center gap-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
              <FaCalendarAlt />
              <span>Available Time Slots</span>
            </div>
          </div>

          {renderTimeSlots(availability[selectedDay] || [])}
        </motion.div>
      </div>

      <div className={`mt-6 rounded-lg p-4 ${isDarkMode ? "bg-slate-700" : "bg-blue-50"}`}>
        <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Booking Information</h3>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Lessons must be booked at least 24 hours in advance. Cancellations within 12 hours of the scheduled time are
          subject to a fee.
        </p>
      </div>
    </div>
  )
}
