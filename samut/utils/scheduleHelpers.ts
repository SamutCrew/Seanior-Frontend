/**
 * Helper functions for working with schedule data
 */

/**
 * Formats a schedule object into a human-readable string
 * @param schedule The schedule object or string to format
 * @returns A formatted string representation of the schedule
 */
export const formatScheduleForDisplay = (schedule: any): string => {
  if (!schedule) return "No schedule available"

  try {
    // Parse schedule if it's a string
    const scheduleObj = typeof schedule === "string" ? JSON.parse(schedule) : schedule

    // Get selected days
    const selectedDays = Object.keys(scheduleObj)
      .filter((day) => scheduleObj[day]?.selected)
      .map((day) => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1)
        const ranges = scheduleObj[day].ranges || []
        const times = ranges
          .map((range) => {
            // Format time to AM/PM
            const formatTime = (time: string) => {
              const [hours, minutes] = time.split(":").map(Number)
              const period = hours >= 12 ? "PM" : "AM"
              const displayHours = hours % 12 || 12
              return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
            }

            return `${formatTime(range.start)} - ${formatTime(range.end)}`
          })
          .join(", ")

        return `${dayName}: ${times}`
      })

    return selectedDays.length > 0 ? selectedDays.join(" • ") : "No days selected"
  } catch (error) {
    console.error("Error formatting schedule:", error)
    return "Schedule format error"
  }
}

/**
 * Checks if a schedule has any selected days
 * @param schedule The schedule object or string to check
 * @returns True if any days are selected, false otherwise
 */
export const hasSelectedDays = (schedule: any): boolean => {
  if (!schedule) return false

  try {
    const scheduleObj = typeof schedule === "string" ? JSON.parse(schedule) : schedule

    return Object.keys(scheduleObj).some((day) => scheduleObj[day]?.selected)
  } catch (error) {
    console.error("Error checking selected days:", error)
    return false
  }
}

/**
 * Gets an array of selected day names from a schedule
 * @param schedule The schedule object or string to check
 * @returns An array of selected day names
 */
export const getSelectedDays = (schedule: any): string[] => {
  if (!schedule) return []

  try {
    const scheduleObj = typeof schedule === "string" ? JSON.parse(schedule) : schedule

    return Object.keys(scheduleObj)
      .filter((day) => scheduleObj[day]?.selected)
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
  } catch (error) {
    console.error("Error getting selected days:", error)
    return []
  }
}
