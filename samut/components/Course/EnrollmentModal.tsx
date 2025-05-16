"use client"

import { useState, useEffect } from "react"
import Modal from "@/components/UI/Modal"
import { Button } from "@/components/Common/Button"
import { Calendar, Clock, CalendarDays, FileText, Check, AlertCircle, Loader2, Info, X } from "lucide-react"
import { createCourseRequest } from "@/api/course_api"
import { useAppSelector } from "@/app/redux"
import { format, addDays, startOfWeek } from "date-fns"

interface TimeSlot {
  dayOfWeek: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface DaySlot {
  day: string
  slots: Array<{
    start: string
    end: string
    isAvailable: boolean
    capacity?: number
    enrolled?: number
  }>
}

interface EnrollmentModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseName: string
  schedule: any
}

export default function EnrollmentModal({ isOpen, onClose, courseId, courseName, schedule }: EnrollmentModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [startDate, setStartDate] = useState<string>("")
  const [selectedSlots, setSelectedSlots] = useState<Array<TimeSlot>>([])
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [availableSlots, setAvailableSlots] = useState<Array<DaySlot>>([])
  const [selectionLimitReached, setSelectionLimitReached] = useState<boolean>(false)
  const [selectionFeedback, setSelectionFeedback] = useState<string | null>(null)

  // Maximum slots a user can select
  const MAX_TOTAL_SLOTS = 4
  // Maximum slots per day
  const MAX_SLOTS_PER_DAY = 2

  // Parse the schedule to get available slots
  useEffect(() => {
    if (schedule && typeof schedule === "object") {
      const slots: Array<DaySlot> = []

      Object.keys(schedule).forEach((day) => {
        if (schedule[day]?.selected && Array.isArray(schedule[day]?.ranges)) {
          slots.push({
            day,
            slots: schedule[day].ranges.map((range: any) => ({
              start: range.start,
              end: range.end,
              isAvailable: true,
              capacity: range.capacity || 10,
              enrolled: range.enrolled || Math.floor(Math.random() * 8), // Simulated data
            })),
          })
        }
      })

      setAvailableSlots(slots)

      // Set default start date to next Monday
      const now = new Date()
      const nextMonday = startOfWeek(addDays(now, 7), { weekStartsOn: 1 })
      setStartDate(format(nextMonday, "yyyy-MM-dd"))
    }
  }, [schedule])

  // Check if selection limit is reached
  useEffect(() => {
    setSelectionLimitReached(selectedSlots.length >= MAX_TOTAL_SLOTS)

    if (selectedSlots.length > 0) {
      setSelectionFeedback(`${selectedSlots.length} of ${MAX_TOTAL_SLOTS} slots selected`)
    } else {
      setSelectionFeedback(null)
    }
  }, [selectedSlots])

  // Toggle a slot selection
  const toggleSlot = (day: string, start: string, end: string, isAvailable: boolean) => {
    if (!isAvailable) return // Don't allow selection of unavailable slots

    const slotIndex = selectedSlots.findIndex(
      (slot) => slot.dayOfWeek === day && slot.startTime === start && slot.endTime === end,
    )

    if (slotIndex >= 0) {
      // Remove slot if already selected
      setSelectedSlots((prev) => prev.filter((_, i) => i !== slotIndex))
      setError(null)
    } else {
      // Check if we've reached the maximum total slots
      if (selectedSlots.length >= MAX_TOTAL_SLOTS) {
        setError(`You can select a maximum of ${MAX_TOTAL_SLOTS} time slots in total.`)
        return
      }

      // Check if we've reached the maximum slots for this day
      const slotsForThisDay = selectedSlots.filter((slot) => slot.dayOfWeek === day).length
      if (slotsForThisDay >= MAX_SLOTS_PER_DAY) {
        setError(`You can select a maximum of ${MAX_SLOTS_PER_DAY} time slots per day.`)
        return
      }

      // Add slot if not selected and within limits
      setSelectedSlots((prev) => [...prev, { dayOfWeek: day, startTime: start, endTime: end, isAvailable }])
      setError(null)
    }
  }

  // Check if a slot is selected
  const isSlotSelected = (day: string, start: string, end: string) => {
    return selectedSlots.some((slot) => slot.dayOfWeek === day && slot.startTime === start && slot.endTime === end)
  }

  // Get count of selected slots for a specific day
  const getSelectedSlotsCountForDay = (day: string) => {
    return selectedSlots.filter((slot) => slot.dayOfWeek === day).length
  }

  // Format time for display (24h to 12h)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Format day name
  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  // Get slot availability status text and color
  const getSlotStatusInfo = (slot: { capacity?: number; enrolled?: number }) => {
    if (!slot.capacity || !slot.enrolled) return { text: "Available", color: "green" }

    const availableSpots = slot.capacity - slot.enrolled
    const percentFull = (slot.enrolled / slot.capacity) * 100

    if (availableSpots <= 0) return { text: "Full", color: "red" }
    if (percentFull >= 80) return { text: `${availableSpots} spots left`, color: "orange" }
    return { text: `${availableSpots} spots available`, color: "green" }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      setError("Please select at least one time slot")
      return
    }

    if (!startDate) {
      setError("Please select a start date")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Format the selected slots for the API
      const formattedSlots = selectedSlots.map(({ dayOfWeek, startTime, endTime }) => ({
        dayOfWeek,
        startTime,
        endTime,
      }))

      const requestData = {
        courseId,
        startDateForFirstWeek: startDate,
        selectedSlots: formattedSlots,
        notes: notes.trim() || undefined,
      }

      console.log("Submitting request:", requestData)

      const response = await createCourseRequest(requestData)
      console.log("Request created:", response)

      setSuccess(true)
      setIsLoading(false)

      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setSelectedSlots([])
        setNotes("")
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      console.error("Error creating request:", err)
      setError(err.message || "Failed to create enrollment request. Please try again.")
      setIsLoading(false)
    }
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  // Clear all selected slots
  const clearSelections = () => {
    setSelectedSlots([])
    setError(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enroll in Course" size="lg">
      {success ? (
        <div className="text-center py-8">
          <div
            className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
              isDarkMode ? "bg-green-900" : "bg-green-100"
            }`}
          >
            <Check className={`w-8 h-8 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Enrollment Request Submitted!
          </h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your request has been sent to the instructor. You'll be notified once it's approved.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {courseName}
            </h3>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Please select your preferred time slots and starting date for this course.
            </p>
          </div>

          {error && (
            <div
              className={`p-4 mb-6 rounded-lg flex items-start ${
                isDarkMode
                  ? "bg-red-900/30 text-red-200 border border-red-800"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Start Date Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                <div className="flex items-center mb-1">
                  <Calendar className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  Starting Date
                </div>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-md ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                min={format(new Date(), "yyyy-MM-dd")}
              />
              <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                This is the date when your first week of classes will begin.
              </p>
            </div>

            {/* Time Slots Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  <div className="flex items-center">
                    <CalendarDays className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                    Available Time Slots
                  </div>
                </label>

                <div className="flex items-center">
                  {selectionFeedback && (
                    <span
                      className={`text-xs mr-3 ${
                        selectionLimitReached
                          ? isDarkMode
                            ? "text-amber-400"
                            : "text-amber-600"
                          : isDarkMode
                            ? "text-cyan-400"
                            : "text-blue-600"
                      }`}
                    >
                      {selectionFeedback}
                    </span>
                  )}

                  {selectedSlots.length > 0 && (
                    <button
                      onClick={clearSelections}
                      className={`text-xs flex items-center px-2 py-1 rounded ${
                        isDarkMode
                          ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Selection info */}
              <div
                className={`flex items-center p-3 mb-4 rounded-md text-sm ${
                  isDarkMode ? "bg-slate-800 text-gray-300" : "bg-gray-50 text-gray-700"
                }`}
              >
                <Info className={`w-4 h-4 mr-2 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                <p>
                  You can select up to {MAX_SLOTS_PER_DAY} slots per day and {MAX_TOTAL_SLOTS} slots in total.
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded mr-1 ${
                      isDarkMode ? "bg-slate-700 border border-slate-600" : "bg-white border border-gray-200"
                    }`}
                  ></div>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Available</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded mr-1 ${
                      isDarkMode ? "bg-cyan-900 border border-cyan-700" : "bg-blue-100 border border-blue-200"
                    }`}
                  ></div>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Selected</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded mr-1 ${
                      isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-gray-100 border border-gray-200"
                    }`}
                  ></div>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Unavailable</span>
                </div>
              </div>

              {availableSlots.length > 0 ? (
                <div className="space-y-4">
                  {availableSlots.map((daySlot) => (
                    <div
                      key={daySlot.day}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                          {formatDayName(daySlot.day)}
                        </h4>

                        {getSelectedSlotsCountForDay(daySlot.day) > 0 && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              isDarkMode
                                ? "bg-cyan-900/50 text-cyan-300 border border-cyan-800"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}
                          >
                            {getSelectedSlotsCountForDay(daySlot.day)} selected
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {daySlot.slots.map((slot, index) => {
                          const isSelected = isSlotSelected(daySlot.day, slot.start, slot.end)
                          const statusInfo = getSlotStatusInfo(slot)
                          const isAvailable = statusInfo.text !== "Full"
                          const slotsForThisDay = getSelectedSlotsCountForDay(daySlot.day)
                          const isDisabled =
                            !isAvailable ||
                            (slotsForThisDay >= MAX_SLOTS_PER_DAY && !isSelected) ||
                            (selectedSlots.length >= MAX_TOTAL_SLOTS && !isSelected)

                          return (
                            <div
                              key={`${daySlot.day}-${index}`}
                              onClick={() => !isDisabled && toggleSlot(daySlot.day, slot.start, slot.end, isAvailable)}
                              className={`p-3 rounded-md transition-all ${
                                isDisabled && !isSelected
                                  ? isDarkMode
                                    ? "bg-slate-900 border border-slate-800 text-gray-500 cursor-not-allowed opacity-60"
                                    : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                                  : isSelected
                                    ? isDarkMode
                                      ? "bg-cyan-900 border border-cyan-700 text-white cursor-pointer shadow-md"
                                      : "bg-blue-100 border border-blue-200 text-blue-800 cursor-pointer shadow-sm"
                                    : isDarkMode
                                      ? "bg-slate-700 border border-slate-600 text-gray-300 hover:bg-slate-600 cursor-pointer"
                                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span>
                                    {formatTime(slot.start)} - {formatTime(slot.end)}
                                  </span>
                                </div>
                                {isSelected && (
                                  <Check
                                    className={`w-4 h-4 flex-shrink-0 ${
                                      isDarkMode ? "text-cyan-300" : "text-blue-600"
                                    }`}
                                  />
                                )}
                              </div>

                              <div
                                className={`text-xs mt-1 ${
                                  statusInfo.color === "red"
                                    ? isDarkMode
                                      ? "text-red-400"
                                      : "text-red-600"
                                    : statusInfo.color === "orange"
                                      ? isDarkMode
                                        ? "text-amber-400"
                                        : "text-amber-600"
                                      : isDarkMode
                                        ? "text-green-400"
                                        : "text-green-600"
                                }`}
                              >
                                {statusInfo.text}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`p-6 text-center rounded-lg ${
                    isDarkMode ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  No available time slots for this course.
                </div>
              )}

              <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Select up to {MAX_SLOTS_PER_DAY} time slots per day that work for your schedule.
              </p>
            </div>

            {/* Selected Slots Summary */}
            {selectedSlots.length > 0 && (
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Your Selected Time Slots
                </h4>
                <div className="space-y-2">
                  {selectedSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 rounded ${
                        isDarkMode ? "bg-slate-800" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`font-medium mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                          {formatDayName(slot.dayOfWeek)}:
                        </span>
                        <span>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSlot(slot.dayOfWeek, slot.startTime, slot.endTime, true)}
                        className={`p-1 rounded-full ${
                          isDarkMode
                            ? "text-gray-400 hover:bg-slate-700 hover:text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                <div className="flex items-center mb-1">
                  <FileText className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  Additional Notes (Optional)
                </div>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={`w-full rounded-md ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Any special requests or information for the instructor..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant={isDarkMode ? "gradient" : "primary"}
                className="flex-1"
                onClick={handleSubmit}
                disabled={isLoading || selectedSlots.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Enrollment Request"
                )}
              </Button>
              <Button
                variant="outline"
                className={`flex-1 ${isDarkMode ? "border-slate-700 text-white" : ""}`}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
