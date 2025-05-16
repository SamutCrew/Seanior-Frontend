"use client"
import { useState } from "react"
import { FaCalendarAlt, FaClock, FaChevronDown, FaChevronUp, FaCog, FaUserGraduate } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import type { EnrollmentWithDetails } from "@/types/enrollment"
import { useAppSelector } from "@/app/redux"

interface EnrollmentsListProps {
  enrollments?: EnrollmentWithDetails[]
}

// Update the component to only handle enrollments
export default function EnrollmentsList({ enrollments = [] }: EnrollmentsListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [expandedEnrollment, setExpandedEnrollment] = useState<string | null>(null)

  const toggleExpandEnrollment = (enrollmentId: string) => {
    setExpandedEnrollment(expandedEnrollment === enrollmentId ? null : enrollmentId)
  }

  // Get active enrollments
  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "ACTIVE" && enrollment.request?.Course?.course_id,
  )

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Parse location JSON string to object
  const parseLocation = (locationStr: string) => {
    try {
      const location = JSON.parse(locationStr)
      return location.address || "No address provided"
    } catch (e) {
      return locationStr || "No location provided"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Student Enrollments</h2>
        <Link
          href="/dashboard/courses"
          className={`${
            isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
        >
          View All Courses
        </Link>
      </div>

      {activeEnrollments.length === 0 ? (
        <div
          className={`p-8 text-center rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
          }`}
        >
          <p>No active enrollments at the moment.</p>
          <Link
            href="/dashboard/courses/create"
            className={`inline-block mt-4 ${
              isDarkMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-sky-600 hover:bg-sky-700"
            } text-white px-4 py-2 rounded-md font-medium`}
          >
            Create New Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active Enrollments Section */}
          <div className="space-y-4">
            {activeEnrollments.map((enrollment) => (
              <div
                key={enrollment.enrollment_id}
                className={`${
                  isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                } rounded-xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex">
                  {/* Student Image */}
                  <div className="relative w-24 h-auto flex-shrink-0 border-r border-slate-700">
                    {enrollment.request?.student?.profile_img ? (
                      <div className="relative h-full min-h-[120px]">
                        <Image
                          src={enrollment.request.student.profile_img || "/placeholder.svg"}
                          alt={enrollment.request.student.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-full min-h-[120px] bg-gradient-to-b from-blue-500 to-cyan-400 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {enrollment.request?.student?.name?.charAt(0) || "S"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enrollment Content */}
                  <div className="p-4 md:p-5 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-2 md:mb-0">
                        <div className="flex items-center">
                          <h3 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                            {enrollment.request?.student?.name || "Unknown Student"}
                          </h3>
                          <div className="ml-3 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {enrollment.status}
                          </div>
                        </div>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {enrollment.request?.Course?.course_name || "Unknown Course"}
                        </p>

                        {/* Progress bar */}
                        <div className="mt-2 mb-3">
                          <div className={`w-full h-1.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} rounded-full`}>
                            <div
                              className={`${isDarkMode ? "bg-cyan-500" : "bg-blue-500"} rounded-full h-1.5`}
                              style={{
                                width: `${Math.min(
                                  (enrollment.actual_sessions_attended / enrollment.target_sessions_to_complete) * 100,
                                  100,
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/dashboard/enrollments/${enrollment.enrollment_id}`}
                          className={`px-4 py-2 rounded-lg ${
                            isDarkMode
                              ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                              : "bg-sky-600 hover:bg-sky-700 text-white"
                          } transition-colors duration-200 font-medium text-sm flex items-center gap-2`}
                        >
                          <FaCog size={14} /> Manage
                        </Link>
                        <button
                          onClick={() => toggleExpandEnrollment(enrollment.enrollment_id)}
                          className={`p-2 rounded-full ${
                            isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-100"
                          } transition-colors`}
                        >
                          {expandedEnrollment === enrollment.enrollment_id ? (
                            <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                          ) : (
                            <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Enrollment Stats - Always visible */}
                    <div className="mt-3 grid grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className={isDarkMode ? "text-cyan-400" : "text-sky-600"} size={14} />
                        <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Started: {formatDate(enrollment.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaUserGraduate className={isDarkMode ? "text-cyan-400" : "text-sky-600"} size={14} />
                        <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {enrollment.actual_sessions_attended}/{enrollment.target_sessions_to_complete} Sessions
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className={isDarkMode ? "text-cyan-400" : "text-sky-600"} size={14} />
                        <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {enrollment.request?.requestedSlots && enrollment.request.requestedSlots.length > 0
                            ? `${enrollment.request.requestedSlots[0].dayOfWeek}: ${enrollment.request.requestedSlots[0].startTime}-${enrollment.request.requestedSlots[0].endTime}`
                            : "No schedule"}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedEnrollment === enrollment.enrollment_id && (
                      <div className={`mt-4 pt-4 border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Email
                            </p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                              {enrollment.request?.student?.email || "No email provided"}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Location
                            </p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                              {enrollment.request?.request_location
                                ? parseLocation(enrollment.request.request_location)
                                : "No location provided"}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Price
                            </p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                              ${enrollment.request?.request_price || 0}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              First Week Start
                            </p>
                            <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                              {enrollment.request?.start_date_for_first_week
                                ? formatDate(enrollment.request.start_date_for_first_week)
                                : "Not specified"}
                            </p>
                          </div>
                          {enrollment.request?.notes && (
                            <div className="md:col-span-2">
                              <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Notes
                              </p>
                              <p className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                                {enrollment.request.notes}
                              </p>
                            </div>
                          )}
                          {enrollment.request?.requestedSlots && enrollment.request.requestedSlots.length > 0 && (
                            <div className="md:col-span-2">
                              <p className={`text-xs font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                Requested Schedule
                              </p>
                              <div className="mt-2 space-y-2">
                                {enrollment.request.requestedSlots.map((slot) => (
                                  <div
                                    key={slot.id}
                                    className={`px-3 py-2 rounded-md ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
                                  >
                                    <p className={`text-sm capitalize ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                      {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
