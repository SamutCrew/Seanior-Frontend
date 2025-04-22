"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaClock, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"
import type { Availability, AvailabilitySlot } from "@/types/teacher"

interface ScheduleSectionProps {
  availability: Availability
  compact?: boolean
}

export default function ScheduleSection({ availability, compact = false }: ScheduleSectionProps) {
  const [selectedDay, setSelectedDay] = useState<string>(Object.keys(availability)[0] || "monday")

  const renderTimeSlots = (slots: AvailabilitySlot[]) => {
    if (!slots.length) {
      return <p className="text-gray-500 text-center py-2">Not available</p>
    }

    return (
      <div className="space-y-2">
        {slots.map((slot, index) => (
          <div key={index} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
            <FaClock className="text-blue-500" />
            <span className="text-gray-700">
              {slot.startTime} - {slot.endTime}
            </span>
            {slot.location && (
              <>
                <FaMapMarkerAlt className="text-blue-500 ml-2" />
                <span className="text-gray-700">{slot.location}</span>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Availability
          </h3>
        </div>

        <div className="space-y-3">
          {Object.entries(availability).map(([day, slots]) => (
            <div key={day} className="border-b border-gray-100 pb-2 last:border-0">
              <p className="font-medium text-gray-700 capitalize mb-1">{day}</p>
              {slots.length ? (
                <div className="text-sm text-gray-600">
                  {slots.map((slot, i) => (
                    <span key={i} className="block">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not available</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Schedule</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day selector */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {Object.entries(availability).map(([day, slots]) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 py-3 px-4 text-center font-medium capitalize transition-colors
                ${selectedDay === day ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}
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
            <h3 className="text-lg font-semibold text-gray-800 capitalize">{selectedDay}</h3>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <FaCalendarAlt />
              <span>Available Time Slots</span>
            </div>
          </div>

          {renderTimeSlots(availability[selectedDay] || [])}
        </motion.div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Booking Information</h3>
        <p className="text-gray-600 text-sm">
          Lessons must be booked at least 24 hours in advance. Cancellations within 12 hours of the scheduled time are
          subject to a fee.
        </p>
      </div>
    </div>
  )
}
