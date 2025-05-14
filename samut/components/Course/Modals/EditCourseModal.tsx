"use client"
import { useState, useEffect } from "react"
import EnhancedCourseForm from "../EnhancedCourseForm"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Course>) => void
  course: Course | null
}

export default function EditCourseModal({ isOpen, onClose, onSubmit, course }: EditCourseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processedCourse, setProcessedCourse] = useState<Course | null>(null)

  // Process the course data when it changes
  useEffect(() => {
    if (course) {
      // Create a deep copy of the course to avoid reference issues
      const courseCopy = JSON.parse(JSON.stringify(course))

      console.log("Original course data:", course)

      // Create a default schedule structure
      const defaultSchedule = {
        monday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
        tuesday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
        wednesday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
        thursday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
        friday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
        saturday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
        sunday: { selected: false, ranges: [{ start: "10:00", end: "12:00" }] },
      }

      // Process schedule data
      if (typeof courseCopy.schedule === "string") {
        try {
          // Try to parse as JSON
          courseCopy.schedule = JSON.parse(courseCopy.schedule)
          console.log("Successfully parsed schedule string as JSON:", courseCopy.schedule)
        } catch (e) {
          console.error("Failed to parse schedule string as JSON:", e)

          // If it's not valid JSON, try to parse it as a comma-separated list of days
          try {
            const scheduleStr = courseCopy.schedule as string
            console.log("Trying to parse schedule string:", scheduleStr)

            // Create a new schedule object
            const newSchedule = { ...defaultSchedule }

            // Check if it contains day names
            const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            const dayAbbreviations = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

            days.forEach((day, index) => {
              // Check for full day name or abbreviation (case insensitive)
              const dayLower = day.toLowerCase()
              const abbr = dayAbbreviations[index].toLowerCase()
              const scheduleStrLower = scheduleStr.toLowerCase()

              if (scheduleStrLower.includes(dayLower) || scheduleStrLower.includes(abbr)) {
                newSchedule[day].selected = true

                // Try to extract time if in format "Day: HH:MM"
                const timeRegex = new RegExp(`${dayLower}[^\\d]*(\\d{1,2}:\\d{2})`, "i")
                const abbrTimeRegex = new RegExp(`${abbr}[^\\d]*(\\d{1,2}:\\d{2})`, "i")

                const timeMatch = scheduleStrLower.match(timeRegex) || scheduleStrLower.match(abbrTimeRegex)
                if (timeMatch && timeMatch[1]) {
                  const timeStr = timeMatch[1]
                  const [hours, minutes] = timeStr.split(":").map(Number)
                  const startTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
                  const endHours = (hours + 2) % 24
                  const endTime = `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

                  newSchedule[day].ranges = [{ start: startTime, end: endTime }]
                }
              }
            })

            courseCopy.schedule = newSchedule
            console.log("Parsed schedule from string:", newSchedule)
          } catch (parseError) {
            console.error("Failed to parse schedule as day list:", parseError)
            courseCopy.schedule = defaultSchedule
          }
        }
      } else if (!courseCopy.schedule || typeof courseCopy.schedule !== "object") {
        console.log("Schedule is not an object, using default schedule")
        courseCopy.schedule = defaultSchedule
      }

      // Ensure schedule has the correct structure
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      days.forEach((day) => {
        if (!courseCopy.schedule[day]) {
          courseCopy.schedule[day] = {
            selected: false,
            ranges: [{ start: "10:00", end: "12:00" }],
          }
        } else if (typeof courseCopy.schedule[day] === "boolean") {
          // Handle old format where day was just a boolean
          const isSelected = courseCopy.schedule[day]
          courseCopy.schedule[day] = {
            selected: isSelected,
            ranges: [{ start: "10:00", end: "12:00" }],
          }
        } else if (courseCopy.schedule[day] && !courseCopy.schedule[day].ranges) {
          // Handle case where ranges are missing
          courseCopy.schedule[day].ranges = [{ start: "10:00", end: "12:00" }]
        }
      })

      console.log("Processed course for editing:", courseCopy)
      setProcessedCourse(courseCopy)
    }
  }, [course])

  if (!isOpen || !course) return null

  const handleSubmit = async (data: Partial<Course>) => {
    try {
      setIsSubmitting(true)
      console.log("Submitting course data from modal:", data)

      // Make sure number_of_total_sessions is included
      if (!data.number_of_total_sessions) {
        data.number_of_total_sessions = course.number_of_total_sessions || 8
      }

      // Create a submission copy to avoid reference issues
      const submissionData = JSON.parse(JSON.stringify(data))

      // Log the schedule data specifically
      if (submissionData.schedule) {
        console.log("Schedule data before submission:", submissionData.schedule)
      }

      // Submit the data
      await onSubmit(submissionData)
    } catch (error) {
      console.error("Error submitting course data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Course: ${course.course_name}`} size="xl">
      <div className="p-6">
        {processedCourse && (
          <EnhancedCourseForm
            initialData={processedCourse}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            isEditing={true}
          />
        )}
      </div>
    </Modal>
  )
}
