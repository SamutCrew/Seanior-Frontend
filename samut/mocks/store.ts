// A tiny fake "database" that backs every api/*.ts function while the app is
// running in demo mode (see lib/demoMode.ts). It lives in memory and mirrors
// itself to localStorage so a demo doesn't lose state on refresh. There is no
// server, no network call, and nothing here ever leaves the browser.
import {
  seedUsers,
  seedCourses,
  seedCourseRequests,
  seedEnrollments,
  seedAttendance,
  seedSessionProgress,
  seedNotifications,
  seedInstructorRequests,
  seedResources,
} from "./seedData"

const STORAGE_KEY = "seanior_demo_db_v1"
const nowIso = () => new Date().toISOString()

function freshDB() {
  return {
    users: JSON.parse(JSON.stringify(seedUsers)),
    courses: JSON.parse(JSON.stringify(seedCourses)),
    courseRequests: JSON.parse(JSON.stringify(seedCourseRequests)),
    enrollments: JSON.parse(JSON.stringify(seedEnrollments)),
    attendance: JSON.parse(JSON.stringify(seedAttendance)),
    sessionProgress: JSON.parse(JSON.stringify(seedSessionProgress)),
    notifications: JSON.parse(JSON.stringify(seedNotifications)),
    instructorRequests: JSON.parse(JSON.stringify(seedInstructorRequests)),
    resources: JSON.parse(JSON.stringify(seedResources)),
  }
}

let db = freshDB()

function persist() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // storage unavailable (private mode / quota) - keep going in-memory
  }
}

function restore() {
  if (typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      db = JSON.parse(raw)
      return
    }
  } catch {
    // corrupt storage - fall back to the seed below
  }
  persist()
}

restore()

export function resetDemoData() {
  db = freshDB()
  persist()
}

let idCounter = 1000
function genId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

// ---------- users ----------

export function listUsers() {
  return db.users
}

export function getUserById(userId: string) {
  return db.users.find((u: any) => u.user_id === userId) || null
}

export function getUserByFirebaseUid(firebaseUid: string) {
  return db.users.find((u: any) => u.firebase_uid === firebaseUid) || null
}

export function updateUserById(userId: string, patch: any) {
  const user = getUserById(userId)
  if (!user) return null
  Object.assign(user, patch, { updated_at: nowIso() })
  persist()
  return user
}

export function createUserEntry(data: any) {
  const user = {
    user_id: genId("user"),
    gender: null,
    address: null,
    phone_number: null,
    description: null,
    ...data,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.users.push(user)
  persist()
  return user
}

// ---------- courses ----------

function withInstructor(course: any) {
  return { ...course, instructor: getUserById(course.instructor_id) }
}

export function listCourses() {
  return db.courses.map(withInstructor)
}

export function getCourseById(courseId: string) {
  const course = db.courses.find((c: any) => c.course_id === courseId)
  return course ? withInstructor(course) : null
}

export function listCoursesByInstructor(instructorId: string) {
  return db.courses.filter((c: any) => c.instructor_id === instructorId).map(withInstructor)
}

export function createCourseEntry(data: any) {
  const course = {
    rating: 0,
    students: 0,
    ...data,
    course_id: genId("course"),
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.courses.push(course)
  persist()
  return withInstructor(course)
}

export function updateCourseById(courseId: string, patch: any) {
  const course = db.courses.find((c: any) => c.course_id === courseId)
  if (!course) return null
  Object.assign(course, patch, { updated_at: nowIso() })
  persist()
  return withInstructor(course)
}

export function deleteCourseById(courseId: string) {
  db.courses = db.courses.filter((c: any) => c.course_id !== courseId)
  persist()
}

// ---------- course requests ----------

function detailedRequest(request: any) {
  const course = db.courses.find((c: any) => c.course_id === request.course_id)
  const instructor = course ? getUserById(course.instructor_id) : null
  const student = getUserById(request.student_id)
  return {
    ...request,
    requestDayOfWeek: request.requestDayOfWeek || "",
    requestTimeSlot: request.requestTimeSlot || "",
    Course: course
      ? {
          course_id: course.course_id,
          course_name: course.course_name,
          course_image: course.course_image,
          pool_image: course.pool_image,
          instructor_name: instructor?.name,
          instructor: instructor ? { user_id: instructor.user_id, name: instructor.name } : undefined,
        }
      : undefined,
    student: student
      ? {
          user_id: student.user_id,
          name: student.name,
          email: student.email,
          profile_img: student.profile_img,
        }
      : undefined,
  }
}

export function listPendingCourseRequestsForInstructor(instructorId: string) {
  return db.courseRequests
    .filter((r: any) => {
      const course = db.courses.find((c: any) => c.course_id === r.course_id)
      return course?.instructor_id === instructorId && r.status === "pending"
    })
    .map(detailedRequest)
}

export function listCourseRequestsForStudent(studentId: string) {
  return db.courseRequests.filter((r: any) => r.student_id === studentId).map(detailedRequest)
}

export function getCourseRequestById(requestId: string) {
  const request = db.courseRequests.find((r: any) => r.request_id === requestId)
  return request ? detailedRequest(request) : null
}

export function createCourseRequestEntry(data: any) {
  const request = {
    status: "pending",
    request_date: nowIso(),
    ...data,
    request_id: genId("req"),
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.courseRequests.push(request)
  persist()
  return detailedRequest(request)
}

export function setCourseRequestStatus(requestId: string, status: string, extra: any = {}) {
  const request = db.courseRequests.find((r: any) => r.request_id === requestId)
  if (!request) return null
  Object.assign(request, { status, ...extra, updated_at: nowIso() })
  persist()
  return detailedRequest(request)
}

// ---------- enrollments ----------

function detailedEnrollment(enrollment: any) {
  const course = db.courses.find((c: any) => c.course_id === enrollment.course_id)
  const instructor = course ? getUserById(course.instructor_id) : null
  const student = getUserById(enrollment.student_id)
  return {
    ...enrollment,
    request: {
      request_id: enrollment.request_id,
      course_id: enrollment.course_id,
      student_id: enrollment.student_id,
      request_price: course?.price,
      request_location: course?.location,
      status: "approved",
      request_date: enrollment.request_date,
      start_date_for_first_week: enrollment.start_date,
      notes: "",
      created_at: enrollment.created_at,
      updated_at: enrollment.updated_at,
      Course: course
        ? {
            course_id: course.course_id,
            course_name: course.course_name,
            course_image: course.course_image,
            pool_image: course.pool_image,
            description: course.description,
            level: course.level,
            schedule: course.schedule,
            pool_type: course.pool_type,
            price: course.price,
            instructor_id: course.instructor_id,
            instructor_name: instructor?.name,
            instructor: instructor
              ? { user_id: instructor.user_id, name: instructor.name, profile_img: instructor.profile_img }
              : undefined,
          }
        : undefined,
      student: student
        ? { user_id: student.user_id, name: student.name, email: student.email, profile_img: student.profile_img }
        : undefined,
    },
  }
}

export function listInstructorEnrollments(instructorId: string) {
  return db.enrollments
    .filter((e: any) => {
      const course = db.courses.find((c: any) => c.course_id === e.course_id)
      return course?.instructor_id === instructorId
    })
    .map(detailedEnrollment)
}

export function listStudentEnrollments(studentId: string) {
  return db.enrollments.filter((e: any) => e.student_id === studentId).map(detailedEnrollment)
}

export function getEnrollmentById(enrollmentId: string) {
  const enrollment = db.enrollments.find((e: any) => e.enrollment_id === enrollmentId)
  return enrollment ? detailedEnrollment(enrollment) : null
}

export function updateEnrollmentById(enrollmentId: string, patch: any) {
  const enrollment = db.enrollments.find((e: any) => e.enrollment_id === enrollmentId)
  if (!enrollment) return null
  Object.assign(enrollment, patch, { updated_at: nowIso() })
  persist()
  return detailedEnrollment(enrollment)
}

export function createEnrollmentFromRequest(requestId: string) {
  const request = db.courseRequests.find((r: any) => r.request_id === requestId)
  if (!request) return null
  const course = db.courses.find((c: any) => c.course_id === request.course_id)
  const enrollment = {
    enrollment_id: genId("enroll"),
    request_id: request.request_id,
    course_id: request.course_id,
    student_id: request.student_id,
    start_date: nowIso(),
    end_date: null,
    status: "active",
    request_date: request.request_date,
    target_sessions_to_complete: course?.number_of_total_sessions || 8,
    max_sessions_allowed: course?.number_of_total_sessions || 8,
    actual_sessions_attended: 0,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.enrollments.push(enrollment)
  request.status = "completed"
  request.updated_at = nowIso()
  persist()
  return detailedEnrollment(enrollment)
}

// ---------- attendance ----------

export function listAttendanceForEnrollment(enrollmentId: string) {
  return db.attendance.filter((a: any) => a.enrollment_id === enrollmentId)
}

export function addAttendanceRecord(enrollmentId: string, data: any) {
  const record = {
    attendance_id: genId("att"),
    enrollment_id: enrollmentId,
    session_number: data.sessionNumber,
    status: data.status,
    reason_for_absence: data.reasonForAbsence || "",
    date_attendance: data.dateAttendance,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.attendance.push(record)
  persist()
  return record
}

export function updateAttendanceRecord(attendanceId: string, data: any) {
  const record = db.attendance.find((a: any) => a.attendance_id === attendanceId)
  if (!record) return null
  if (data.sessionNumber !== undefined) record.session_number = data.sessionNumber
  if (data.status !== undefined) record.status = data.status
  if (data.reasonForAbsence !== undefined) record.reason_for_absence = data.reasonForAbsence
  if (data.dateAttendance !== undefined) record.date_attendance = data.dateAttendance
  record.updated_at = nowIso()
  persist()
  return record
}

// ---------- session progress ----------

export function listSessionProgressForEnrollment(enrollmentId: string) {
  return db.sessionProgress.filter((p: any) => p.enrollment_id === enrollmentId)
}

export function addSessionProgressRecord(enrollmentId: string, data: any) {
  const record = {
    session_progress_id: genId("prog"),
    enrollment_id: enrollmentId,
    session_number: data.sessionNumber,
    topic_covered: data.topicCovered,
    performance_notes: data.performanceNotes,
    date_session: data.dateSession,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.sessionProgress.push(record)
  persist()
  return record
}

export function updateSessionProgressRecord(sessionProgressId: string, data: any) {
  const record = db.sessionProgress.find((p: any) => p.session_progress_id === sessionProgressId)
  if (!record) return null
  if (data.sessionNumber !== undefined) record.session_number = data.sessionNumber
  if (data.topicCovered !== undefined) record.topic_covered = data.topicCovered
  if (data.performanceNotes !== undefined) record.performance_notes = data.performanceNotes
  if (data.dateSession !== undefined) record.date_session = data.dateSession
  record.updated_at = nowIso()
  persist()
  return record
}

export function deleteSessionProgressRecord(sessionProgressId: string) {
  db.sessionProgress = db.sessionProgress.filter((p: any) => p.session_progress_id !== sessionProgressId)
  persist()
}

// ---------- notifications ----------

export function listNotificationsForUser(userId: string) {
  return db.notifications.filter((n: any) => n.user_id === userId)
}

export function markNotificationReadById(notificationId: string) {
  const notif = db.notifications.find((n: any) => n.notification_id === notificationId)
  if (!notif) return
  notif.is_read = true
  persist()
}

// ---------- instructor requests ----------

export function listInstructorRequests() {
  return db.instructorRequests.map((r: any) => ({ ...r, user: getUserById(r.user_id) }))
}

export function getInstructorRequestById(requestId: string) {
  const request = db.instructorRequests.find((r: any) => r.request_id === requestId)
  return request ? { ...request, user: getUserById(request.user_id) } : null
}

export function getInstructorRequestByUserId(userId: string) {
  const request = db.instructorRequests.find((r: any) => r.user_id === userId)
  return request ? { ...request, user: getUserById(request.user_id) } : null
}

export function submitInstructorRequestEntry(userId: string, data: any) {
  const request = {
    ...data,
    request_id: genId("ireq"),
    user_id: userId,
    status: "pending",
    rejection_reason: null,
    created_at: nowIso(),
    updated_at: nowIso(),
  }
  db.instructorRequests.push(request)
  persist()
  return { ...request, user: getUserById(userId) }
}

export function updateInstructorRequestEntry(requestId: string, data: any) {
  const request = db.instructorRequests.find((r: any) => r.request_id === requestId)
  if (!request) return null
  Object.assign(request, data, { updated_at: nowIso() })
  persist()
  return { ...request, user: getUserById(request.user_id) }
}

export function approveInstructorRequestById(requestId: string) {
  const request = db.instructorRequests.find((r: any) => r.request_id === requestId)
  if (!request) return null
  request.status = "approved"
  request.updated_at = nowIso()
  updateUserById(request.user_id, { user_type: "instructor" })
  persist()
  return { ...request, user: getUserById(request.user_id) }
}

export function rejectInstructorRequestById(requestId: string, reason: string) {
  const request = db.instructorRequests.find((r: any) => r.request_id === requestId)
  if (!request) return null
  request.status = "rejected"
  request.rejection_reason = reason
  request.updated_at = nowIso()
  persist()
  return { ...request, user: getUserById(request.user_id) }
}

// ---------- resources ----------

export function listAllResources() {
  return db.resources
}

export function listResourcesForUser(userId: string) {
  return db.resources.filter((r: any) => r.user_id === userId)
}

export function addResourceEntry(userId: string, file: File, resourceType: string) {
  const resource = {
    resource_id: genId("res"),
    user_id: userId,
    resource_name: file.name,
    resource_size: file.size,
    resource_type: resourceType,
    resource_url: typeof URL !== "undefined" ? URL.createObjectURL(file) : "/placeholder.svg",
    create_at: nowIso(),
    update_at: nowIso(),
  }
  db.resources.push(resource)
  persist()
  return resource
}

export function deleteResourceEntry(resourceId: string) {
  db.resources = db.resources.filter((r: any) => r.resource_id !== resourceId)
  persist()
}

// ---------- payments ----------

export function completeDemoPayment(requestId: string) {
  return createEnrollmentFromRequest(requestId)
}
