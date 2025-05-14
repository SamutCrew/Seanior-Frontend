"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaTrash, FaTimes, FaCheck, FaBug } from "react-icons/fa"

interface ScheduleSelectorProps {
  value: any
  onChange: (schedule: any) => void
  isDarkMode: boolean
}

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export default function ScheduleSelector({ value, onChange, isDarkMode }: ScheduleSelectorProps) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const [activeDay, setActiveDay] = useState("monday")

  // Default schedule structure
  const defaultSchedule = {
    monday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    tuesday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    wednesday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    thursday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    friday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    saturday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    sunday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
  }

  const [schedule, setSchedule] = useState<Record<string, any>>(defaultSchedule)
  const [initialized, setInitialized] = useState(false)

  // Initialize from value prop
  useEffect(() => {
    // Skip if no value or already initialized
    if (!value || Object.keys(value).length === 0) {
      console.log("No schedule value provided or empty object, using default schedule")
      setSchedule(defaultSchedule)
      setInitialized(true)
      return
    }

    if (initialized) {
      console.log("Schedule already initialized, skipping")
      return
    }

    console.log("Schedule value received in ScheduleSelector:", value)

    // Create a new schedule based on the default structure
    const newSchedule = { ...defaultSchedule }

    // Only process if value is an object and not null
    if (value && typeof value === "object" && value !== null) {
      // Process each day from the value prop
      days.forEach((day) => {
        if (value[day]) {
          if (typeof value[day] === "boolean") {
            // Simple boolean format
            newSchedule[day] = {
              selected: value[day],
              ranges: [{ start: "10:00", end: "12:00" }],
            }
          } else if (typeof value[day] === "object" && value[day] !== null) {
            // Object format
            if (value[day].selected !== undefined) {
              // Object with selected property
              newSchedule[day] = {
                selected: Boolean(value[day].selected),
                ranges:
                  Array.isArray(value[day].ranges) && value[day].ranges.length > 0
                    ? value[day].ranges
                    : [{ start: "10:00", end: "12:00" }],
              }
            } else if (Array.isArray(value[day])) {
              // Array format (legacy)
              newSchedule[day] = {
                selected: true,
                ranges: value[day].map((time: string) => {
                  const [hours, minutes] = time.split(":").map(Number)
                  const endHours = (hours + 2) % 24
                  const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
                  return { start: time, end: endTime }
                }),
              }
            } else if (value[day].time) {
              // Single time format (legacy)
              const time = value[day].time
              const [hours, minutes] = time.split(":").map(Number)
              const endHours = (hours + 2) % 24
              const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

              newSchedule[day] = {
                selected: true,
                ranges: [{ start: time, end: endTime }],
              }
            }
          }
        }
      })
    }

    console.log("Processed schedule in ScheduleSelector:", newSchedule)

    // Find the first selected day to set as active
    const firstSelectedDay = days.find((day) => newSchedule[day].selected) || "monday"
    setActiveDay(firstSelectedDay)

    setSchedule(newSchedule)
    setInitialized(true)
  }, [value, initialized, days, defaultSchedule])

  // Handle clicking on a day tab
  const handleDayClick = (day: string) => {
    console.log(`Clicked on day tab: ${day}`)
    setActiveDay(day)
  }

  // Handle toggling a day on/off
  const handleDayToggle = (day: string) => {
    console.log(`Toggling day ${day} from ${schedule[day].selected} to ${!schedule[day].selected}`)

    // Create a deep copy of the schedule to avoid reference issues
    const newSchedule = JSON.parse(JSON.stringify(schedule))

    // Update the selected state for the specific day
    newSchedule[day].selected = !newSchedule[day].selected

    console.log(`New schedule after toggling ${day}:`, newSchedule)

    // Update the state and call onChange
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const handleTimeChangeForDay = (day: string, index: number, field: "start" | "end", time: string) => {
    console.log(`Changing ${field} time for ${day} range ${index} to ${time}`)

    // Create a deep copy of the schedule
    const newSchedule = JSON.parse(JSON.stringify(schedule))

    // Update the specific time field
    newSchedule[day].ranges[index][field] = time

    console.log(`New schedule after time change:`, newSchedule)

    // Update the state and call onChange
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const addTimeRangeToDay = (day: string) => {
    console.log(`Adding time range to ${day}`)

    // Get the last range and add 2 hours to it for the new range
    const lastRange = schedule[day].ranges[schedule[day].ranges.length - 1]
    let newStart = "10:00"
    let newEnd = "12:00"

    if (lastRange) {
      const [hours, minutes] = lastRange.end.split(":").map(Number)
      const newStartHours = hours % 24
      newStart = `${newStartHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

      const newEndHours = (newStartHours + 2) % 24
      newEnd = `${newEndHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    // Create a deep copy of the schedule
    const newSchedule = JSON.parse(JSON.stringify(schedule))

    // Add the new time range
    newSchedule[day].ranges.push({ start: newStart, end: newEnd })

    // Ensure the day is selected
    newSchedule[day].selected = true

    console.log(`New schedule after adding time range:`, newSchedule)

    // Update the state and call onChange
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const removeTimeRangeFromDay = (day: string, index: number) => {
    if (schedule[day].ranges.length <= 1) return // Keep at least one time range

    console.log(`Removing time range ${index} from ${day}`)

    // Create a deep copy of the schedule
    const newSchedule = JSON.parse(JSON.stringify(schedule))

    // Remove the time range
    newSchedule[day].ranges.splice(index, 1)

    console.log(`New schedule after removing time range:`, newSchedule)

    // Update the state and call onChange
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const clearDaySchedule = (day: string) => {
    console.log(`Clearing schedule for ${day}`)

    // Create a deep copy of the schedule
    const newSchedule = JSON.parse(JSON.stringify(schedule))

    // Reset the day's schedule
    newSchedule[day] = {
      selected: false,
      ranges: [{ start: "10:00", end: "12:00" }],
    }

    console.log(`New schedule after clearing day:`, newSchedule)

    // Update the state and call onChange
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  // Format time to display AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Get color for day button based on state
  const getDayButtonColor = (day: string) => {
    if (schedule[day].selected) {
      if (activeDay === day) {
        return isDarkMode
          ? "bg-gradient-to-r from-cyan-800 to-blue-900 text-white border border-cyan-700"
          : "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
      }
      return isDarkMode ? "bg-cyan-900 text-white border border-cyan-800" : "bg-sky-400 text-white"
    }

    if (activeDay === day) {
      return isDarkMode ? "bg-slate-700 text-white border border-slate-600" : "bg-gray-300 text-gray-800"
    }

    return isDarkMode
      ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }

  // Debug function to show current schedule state
  const showCurrentSchedule = () => {
    console.log("Current schedule state:", schedule)
    console.log("Schedule as JSON string:", JSON.stringify(schedule))

    // Create a readable summary of selected days
    const selectedDays = days
      .filter((day) => schedule[day].selected)
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))

    const summary = selectedDays.length > 0 ? `Selected days: ${selectedDays.join(", ")}` : "No days selected"

    alert(`${summary}\n\nFull schedule data logged to console`)
  }

  // Debug function to test different schedule formats
  const testScheduleFormat = () => {
    // Create a test schedule with different formats
    const testSchedule = {
      monday: { selected: true, ranges: [{ start: "09:00", end: "11:00" }] },
      tuesday: {
        selected: true,
        ranges: [
          { start: "10:00", end: "12:00" },
          { start: "14:00", end: "16:00" },
        ],
      },
      wednesday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
      thursday: { selected: true, ranges: [{ start: "13:00", end: "15:00" }] },
      friday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
      saturday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
      sunday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
    }

    setSchedule(testSchedule)
    onChange(testSchedule)

    // Log different formats
    console.log("Test schedule object:", testSchedule)
    console.log("Test schedule JSON string:", JSON.stringify(testSchedule))

    alert("Test schedule applied and logged to console")
  }

  // Reset all days to not selected
  const resetAllDays = () => {
    console.log("Resetting all days to not selected")

    // Create a deep copy of the default schedule
    const resetSchedule = JSON.parse(JSON.stringify(defaultSchedule))

    console.log("Reset schedule:", resetSchedule)

    // Update the state and call onChange
    setSchedule(resetSchedule)
    onChange(resetSchedule)

    alert("All days have been reset to not selected")
  }

  const [dayRanges, setDayRanges] = useState([{ start: "10:00", end: "12:00" }])
  const [isDaySelected, setIsDaySelected] = useState(false)

  useEffect(() => {
    // Update dayRanges when activeDay changes
    setDayRanges(schedule[activeDay]?.ranges || [{ start: "10:00", end: "12:00" }])
    setIsDaySelected(schedule[activeDay]?.selected || false)
  }, [activeDay, schedule])

  const handleRangeTimeChange = (index: number, field: "start" | "end", time: string) => {
    const newDayRanges = [...dayRanges]
    newDayRanges[index][field] = time
    setDayRanges(newDayRanges)

    // Update the schedule with the new time ranges
    const newSchedule = { ...schedule }
    newSchedule[activeDay].ranges = newDayRanges
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const addRangeTime = () => {
    const newDayRanges = [...dayRanges, { start: "10:00", end: "12:00" }]
    setDayRanges(newDayRanges)

    // Update the schedule with the new time ranges
    const newSchedule = { ...schedule }
    newSchedule[activeDay].ranges = newDayRanges
    newSchedule[activeDay].selected = true // Ensure the day is selected
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const removeRangeTime = (index: number) => {
    const newDayRanges = [...dayRanges]
    newDayRanges.splice(index, 1)
    setDayRanges(newDayRanges)

    // Update the schedule with the new time ranges
    const newSchedule = { ...schedule }
    newSchedule[activeDay].ranges = newDayRanges
    setSchedule(newSchedule)
    onChange(newSchedule)
  }

  const toggleDaySelection = () => {
    const newSchedule = { ...schedule }
    newSchedule[activeDay].selected = !isDaySelected
    setSchedule(newSchedule)
    onChange(newSchedule)
    setIsDaySelected(!isDaySelected)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap mb-4 gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeDay === day
                ? isDarkMode
                  ? "bg-cyan-700 text-white"
                  : "bg-sky-500 text-white"
                : isDarkMode
                  ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
            {schedule[day]?.selected && (
              <span
                className={`ml-1 inline-block w-2 h-2 rounded-full ${isDarkMode ? "bg-cyan-300" : "bg-sky-300"}`}
              ></span>
            )}
          </button>
        ))}
      </div>

      <div
        className={`rounded-lg overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-gray-50"} border ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <h3 className="font-medium capitalize">{activeDay}</h3>
            {schedule[activeDay].selected && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isDarkMode ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800"}`}
              >
                Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/*{schedule[activeDay].selected && (*/}
            {/*  <button*/}
            {/*    type="button"*/}
            {/*    className={`p-2 rounded-full ${*/}
            {/*      isDarkMode ? "bg-red-900 text-red-200 hover:bg-red-800" : "bg-red-100 text-red-700 hover:bg-red-200"*/}
            {/*    }`}*/}
            {/*    onClick={() => clearDaySchedule(activeDay)}*/}
            {/*    title="Clear day schedule"*/}
            {/*  >*/}
            {/*    <FaTimes size={14} />*/}
            {/*  </button>*/}
            {/*)}*/}
            {/*{schedule[activeDay].selected && (*/}
            {/*  <button*/}
            {/*    type="button"*/}
            {/*    className={`p-2 rounded-full ${*/}
            {/*      isDarkMode*/}
            {/*        ? "bg-cyan-900 text-cyan-200 hover:bg-cyan-800"*/}
            {/*        : "bg-sky-100 text-sky-700 hover:bg-sky-200"*/}
            {/*    }`}*/}
            {/*    onClick={() => addTimeRange(activeDay)}*/}
            {/*    title="Add time range"*/}
            {/*  >*/}
            {/*    <FaPlus size={14} />*/}
            {/*  </button>*/}
            {/*)}*/}
            {/*<button*/}
            {/*  type="button"*/}
            {/*  className={`p-2 rounded-full ${*/}
            {/*    schedule[activeDay].selected*/}
            {/*      ? isDarkMode*/}
            {/*        ? "bg-red-900 text-red-200 hover:bg-red-800"*/}
            {/*        : "bg-red-100 text-red-700 hover:bg-red-200"*/}
            {/*      : isDarkMode*/}
            {/*        ? "bg-green-900 text-green-200 hover:bg-green-800"*/}
            {/*        : "bg-green-100 text-green-700 hover:bg-green-200"*/}
            {/*  }`}*/}
            {/*  onClick={() => handleDayToggle(activeDay)}*/}
            {/*  title={schedule[activeDay].selected ? "Disable day" : "Enable day"}*/}
            {/*>*/}
            {/*  {schedule[activeDay].selected ? <FaTimes size={14} /> : <FaCheck size={14} />}*/}
            {/*</button>*/}
          </div>
        </div>

        <div className="p-4">
          {schedule[activeDay].selected ? (
            <>
              <div className="space-y-4 mt-4">
                {dayRanges.map((range, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label
                        className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => handleRangeTimeChange(index, "start", e.target.value)}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                            : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        End Time
                      </label>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => handleRangeTimeChange(index, "end", e.target.value)}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 focus:ring-cyan-500"
                            : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                        }`}
                      />
                    </div>
                    <div className="pt-7">
                      <button
                        type="button"
                        onClick={() => removeRangeTime(index)}
                        className={`p-2 rounded-full ${
                          isDarkMode
                            ? "bg-red-900 text-white hover:bg-red-800"
                            : "bg-red-100 text-red-500 hover:bg-red-200"
                        }`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <div>
                  <button
                    type="button"
                    onClick={addRangeTime}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isDarkMode
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FaPlus className="inline mr-1" size={12} /> Add Time Slot
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={toggleDaySelection}
                    className={`px-3 py-2 rounded-md text-sm font-medium mr-2 ${
                      isDaySelected
                        ? isDarkMode
                          ? "bg-red-900 text-white hover:bg-red-800"
                          : "bg-red-100 text-red-500 hover:bg-red-200"
                        : isDarkMode
                          ? "bg-cyan-700 text-white hover:bg-cyan-600"
                          : "bg-sky-100 text-sky-500 hover:bg-sky-200"
                    }`}
                  >
                    {isDaySelected ? (
                      <>
                        <FaTimes className="inline mr-1" size={12} /> Disable {activeDay}
                      </>
                    ) : (
                      <>
                        <FaCheck className="inline mr-1" size={12} /> Enable {activeDay}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`text-center py-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className="mb-2">This day is not scheduled</div>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500"
                }`}
                onClick={() => handleDayToggle(activeDay)}
              >
                Enable {activeDay}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        Select the days when classes will be held and set the time ranges for each day. You can add multiple time ranges
        per day.
      </div>

      {/* Debug tools */}
      <div className="mt-4 p-3 border border-dashed border-gray-300 rounded bg-gray-50">
        <h4 className="text-sm font-medium mb-2">Debug Tools</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={showCurrentSchedule}
            className={`px-3 py-1 text-xs rounded flex items-center ${
              isDarkMode
                ? "bg-slate-700 text-gray-300 hover:bg-slate-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <FaBug className="mr-1" /> Show Current Schedule
          </button>

          <button
            type="button"
            onClick={testScheduleFormat}
            className={`px-3 py-1 text-xs rounded flex items-center ${
              isDarkMode ? "bg-blue-800 text-gray-200 hover:bg-blue-700" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            <FaCheck className="mr-1" /> Test Schedule Format
          </button>

          <button
            type="button"
            onClick={resetAllDays}
            className={`px-3 py-1 text-xs rounded flex items-center ${
              isDarkMode ? "bg-red-800 text-gray-200 hover:bg-red-700" : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            <FaTimes className="mr-1" /> Reset All Days
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          <p>
            Selected days:{" "}
            {days
              .filter((day) => schedule[day].selected)
              .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
              .join(", ") || "None"}
          </p>
          <p>Active day: {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}</p>
        </div>
      </div>
    </div>
  )
}
