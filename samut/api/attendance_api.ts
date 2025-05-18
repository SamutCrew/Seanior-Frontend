// API functions for attendance management
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance"
import { auth } from "@/lib/firebase"
import { getAuthToken } from "@/context/authToken"

// Map API response to our internal format
const mapApiResponseToAttendanceRecord = (item: any): AttendanceRecord => ({
  attendance_id: item.attendance_id,
  enrollment_id: item.enrollment_id,
  session_number: item.session_number || item.sessionNumber,
  status: item.status || "PRESENT", // Preserve the exact case but provide a default
  reason_for_absence: item.reason_for_absence || item.reasonForAbsence || "",
  date_attendance: item.date_attendance || item.dateAttendance,
  created_at: item.created_at,
  updated_at: item.updated_at,
})

// Get the Firebase auth token
const getFirebaseToken = async (): Promise<string | null> => {
  try {
    // First try to get token from the authToken utility
    const token = await getAuthToken()
    if (token) {
      console.log("Got token from getAuthToken utility")
      return token
    }

    // Fallback to getting token directly from Firebase
    const user = auth.currentUser
    if (user) {
      const idToken = await user.getIdToken(true)
      console.log("Got fresh token from Firebase")
      return idToken
    }

    console.error("No authenticated user found")
    return null
  } catch (error) {
    console.error("Error getting Firebase token:", error)
    return null
  }
}

// Get attendance history for an enrollment using the exact API endpoint
export const getEnrollmentAttendance = async (enrollmentId: string): Promise<AttendanceRecord[]> => {
  console.log(`Fetching attendance for enrollment ID: ${enrollmentId}`)

  try {
    // Get the Firebase token
    const token = await getFirebaseToken()
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.")
    }

    // Use the exact API endpoint from the documentation
    const url = process.env.NEXT_PUBLIC_API_URL
    const endpoint = `${url}/enrollments/${enrollmentId}/attendances`

    console.log(`Sending request to: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to fetch attendance. Status: ${response.status}`, errorText)
      throw new Error(`Failed to fetch attendance: ${response.status} ${errorText.substring(0, 100)}`)
    }

    const data = await response.json()
    console.log("Attendance data received:", data)

    // Map the API response to our AttendanceRecord type
    return Array.isArray(data) ? data.map(mapApiResponseToAttendanceRecord) : []
  } catch (error) {
    console.error("Error fetching attendance:", error)
    throw error
  }
}

// Record new attendance using the exact API endpoint and format
export const recordAttendance = async (
  enrollmentId: string,
  data: {
    sessionNumber: number
    status: AttendanceStatus
    reasonForAbsence?: string
    dateAttendance: string
  },
): Promise<AttendanceRecord> => {
  // Format the request body to match the API specification exactly
  const requestBody = {
    sessionNumber: data.sessionNumber,
    status: data.status, // Send the status exactly as is
    reasonForAbsence: data.reasonForAbsence || "",
    dateAttendance: data.dateAttendance,
  }

  console.log(`Recording attendance for enrollment ID: ${enrollmentId}`, requestBody)

  try {
    // Get the Firebase token
    const token = await getFirebaseToken()
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.")
    }

    // Use the exact endpoint from the API documentation
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://seanior-backend.onrender.com"
    const endpoint = `${baseUrl}/enrollments/${enrollmentId}/attendances`

    console.log(`Sending request to: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to record attendance. Status: ${response.status}`, errorText)
      throw new Error(`Failed to record attendance: ${response.status} ${errorText.substring(0, 100)}`)
    }

    const responseData = await response.json()
    console.log("Attendance record created:", responseData)

    return mapApiResponseToAttendanceRecord(responseData)
  } catch (error) {
    console.error("Error recording attendance:", error)
    throw error
  }
}

// Update existing attendance
export const updateAttendance = async (
  enrollmentId: string,
  attendanceId: string,
  data: {
    sessionNumber?: number
    status?: AttendanceStatus
    reasonForAbsence?: string
    dateAttendance?: string
  },
): Promise<AttendanceRecord> => {
  // Format the request body to match the API specification
  const requestBody = {
    sessionNumber: data.sessionNumber,
    status: data.status,
    reasonForAbsence: data.reasonForAbsence || "",
    dateAttendance: data.dateAttendance,
  }

  console.log(`Updating attendance ID: ${attendanceId} for enrollment ID: ${enrollmentId}`, requestBody)

  try {
    // Get the Firebase token
    const token = await getFirebaseToken()
    if (!token) {
      throw new Error("Authentication token is missing. Please log in again.")
    }

    // Use the endpoint format consistent with the API documentation
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://seanior-backend.onrender.com"
    const endpoint = `${baseUrl}/enrollments/${enrollmentId}/attendances/${attendanceId}`

    console.log(`Sending request to: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to update attendance. Status: ${response.status}`, errorText)
      throw new Error(`Failed to update attendance: ${response.status} ${errorText.substring(0, 100)}`)
    }

    const responseData = await response.json()
    console.log("Attendance record updated:", responseData)

    return mapApiResponseToAttendanceRecord(responseData)
  } catch (error) {
    console.error("Error updating attendance:", error)
    throw error
  }
}
