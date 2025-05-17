export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"

export interface AttendanceRecord {
  attendance_id: string
  enrollment_id: string
  session_number: number
  status: AttendanceStatus
  reason_for_absence: string
  date_attendance: string
  created_at: string
  updated_at: string
}

export const statusColors = {
  PRESENT: "green",
  ABSENT: "red",
  LATE: "yellow",
  EXCUSED: "blue",
}

export const statusLabels = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  EXCUSED: "Excused",
}
