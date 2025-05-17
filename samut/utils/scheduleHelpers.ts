import type { RequestedSlot } from "@/types/enrollment"

/**
 * Format a time string to AM/PM format
 */
export const formatTime = (time: string): string => {
  if (!time) return "N/A"
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}

/**
 * Convert requested slots to a formatted schedule object
 */
export const formatScheduleFromSlots = (slots: RequestedSlot[]): { day: string; times: string[] }[] => {
  // Group slots by day
  const dayMap: Record<string, string[]> = {}

  slots.forEach((slot) => {
    const day = slot.dayOfWeek
    const timeRange = `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`

    if (!dayMap[day]) {
      dayMap[day] = []
    }

    dayMap[day].push(timeRange)
  })

  // Convert to array format
  const result: { day: string; times: string[] }[] = []

  // Define day order for consistent display
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Sort days according to the defined order
  daysOrder.forEach((day) => {
    if (dayMap[day]) {
      result.push({
        day,
        times: dayMap[day],
      })
    }
  })

  return result
}

/**
 * Format schedule object into structured data
 */
export const formatScheduleObject = (scheduleObj: any): { day: string; times: string[] }[] => {
  try {
    if (!scheduleObj) return []

    // Define day order for consistent display
    const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

    // Format each day with its time slots
    return daysOrder
      .filter((day) => {
        const dayData = scheduleObj[day]
        return dayData && dayData.selected === true
      })
      .map((day) => {
        const dayData = scheduleObj[day]
        const dayName = day.charAt(0).toUpperCase() + day.slice(1)
        const ranges = dayData.ranges || []

        // Format all time ranges for this day
        const timeSlots = ranges.map((range: any) => `${formatTime(range.start)} - ${formatTime(range.end)}`)

        return {
          day: dayName,
          times: timeSlots,
        }
      })
  } catch (error) {
    console.error("Error formatting schedule object:", error)
    return []
  }
}

/**
 * Safely parse and format schedule data
 */
export const safeFormatSchedule = (schedule: any): { day: string; times: string[] }[] => {
  // If schedule is a string that looks like JSON, try to parse it
  if (typeof schedule === "string") {
    try {
      const parsed = JSON.parse(schedule)
      return formatScheduleObject(parsed)
    } catch (error) {
      console.log("Schedule string couldn't be parsed as JSON:", error)
      return []
    }
  }

  // If it's an object, format it
  if (schedule && typeof schedule === "object") {
    return formatScheduleObject(schedule)
  }

  return []
}
