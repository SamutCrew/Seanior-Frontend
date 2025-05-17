"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/Common/Button"
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (attendanceData: Partial<AttendanceRecord>) => void
  attendance: AttendanceRecord | null
  enrollmentId: string
}

const AttendanceModal = ({ isOpen, onClose, onSave, attendance, enrollmentId }: AttendanceModalProps) => {
  const [sessionNumber, setSessionNumber] = useState(1)
  const [status, setStatus] = useState<AttendanceStatus>("PRESENT")
  const [reasonForAbsence, setReasonForAbsence] = useState("")
  const [dateAttendance, setDateAttendance] = useState(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Reset form when modal opens/closes or attendance changes
  useEffect(() => {
    if (isOpen && attendance) {
      setSessionNumber(attendance.session_number)
      setStatus(attendance.status)
      setReasonForAbsence(attendance.reason_for_absence || "")
      setDateAttendance(new Date(attendance.date_attendance).toISOString().split("T")[0])
      setValidationError(null)
    } else if (isOpen) {
      // Default values for new attendance
      setSessionNumber(1)
      setStatus("PRESENT")
      setReasonForAbsence("")
      setDateAttendance(new Date().toISOString().split("T")[0])
      setValidationError(null)
    }
  }, [isOpen, attendance])

  // Validate form before submission
  const validateForm = (): boolean => {
    if (!sessionNumber || sessionNumber < 1) {
      setValidationError("Session number must be at least 1")
      return false
    }

    if (!dateAttendance) {
      setValidationError("Date is required")
      return false
    }

    // If status is not PRESENT, reason might be required
    if ((status === "ABSENT" || status === "LATE" || status === "EXCUSED") && !reasonForAbsence.trim()) {
      setValidationError(`Please provide a reason for ${status.toLowerCase()} status`)
      return false
    }

    setValidationError(null)
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Format the attendance data to match the API specification exactly
      const attendanceData: Partial<AttendanceRecord> = {
        session_number: sessionNumber,
        status,
        reason_for_absence: reasonForAbsence,
        date_attendance: dateAttendance,
      }

      if (attendance?.attendance_id) {
        attendanceData.attendance_id = attendance.attendance_id
      }

      console.log("Submitting attendance data:", attendanceData)
      await onSave(attendanceData)
    } catch (error) {
      console.error("Error saving attendance:", error)
      setValidationError(`Error: ${error instanceof Error ? error.message : "Failed to save attendance"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="text-lg font-medium text-white">
            {attendance ? "Edit Attendance Record" : "Add Attendance Record"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {validationError && (
              <div className="p-3 rounded-md bg-red-900/30 border border-red-800 text-red-200 text-sm">
                {validationError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Session Number</label>
              <input
                type="number"
                value={sessionNumber}
                onChange={(e) => setSessionNumber(Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
            </div>

            {(status === "ABSENT" || status === "LATE" || status === "EXCUSED") && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Reason {status === "ABSENT" ? "(Required)" : ""}
                </label>
                <textarea
                  value={reasonForAbsence}
                  onChange={(e) => setReasonForAbsence(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  rows={3}
                  required={status === "ABSENT"}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Date</label>
              <input
                type="date"
                value={dateAttendance}
                onChange={(e) => setDateAttendance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end p-4 border-t border-slate-700 gap-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="gradient" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendanceModal
