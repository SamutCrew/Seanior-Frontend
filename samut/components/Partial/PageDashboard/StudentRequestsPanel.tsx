"use client"

import { useState } from "react"
import {
  FaUserGraduate,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBookOpen,
} from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import type { CourseRequest } from "@/types/request"
import Image from "next/image"
import { motion } from "framer-motion"
import { Toast } from "@/components/Responseback/Toast"

interface StudentRequestsPanelProps {
  requests: CourseRequest[]
  onRequestAction: (requestId: string, action: "approve" | "reject") => Promise<void>
  isLoading: boolean
}

export default function StudentRequestsPanel({ requests, onRequestAction, isLoading }: StudentRequestsPanelProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [processingRequests, setProcessingRequests] = useState<Record<string, boolean>>({})
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

  // At the beginning of the component function, add this safety check
  if (!requests || !Array.isArray(requests)) {
    console.error("Invalid requests data provided to StudentRequestsPanel:", requests)
    return (
      <div
        className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} rounded-lg shadow-lg overflow-hidden`}
      >
        <div className={`p-5 ${isDarkMode ? "bg-slate-700" : "bg-gradient-to-r from-cyan-500 to-blue-600"}`}>
          <h2 className={`text-xl font-bold text-white flex items-center gap-2`}>
            <FaUserGraduate className="h-5 w-5 text-white" />
            Student Course Requests
          </h2>
        </div>
        <div className="p-4 text-center">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            Unable to load student requests. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    // Check if the request is in a valid state for the action
    const request = requests.find((req) => req.request_id === requestId)
    if (!request) {
      Toast.error("Request not found")
      return
    }

    // Check if the request is in a valid state for the action
    const status = request.status?.toLowerCase() || ""
    if (status !== "pending" && status !== "pending_approval") {
      Toast.error(`Cannot ${action} request. Current status: ${capitalizeFirstLetter(status)}`)
      return
    }

    setProcessingRequests((prev) => ({ ...prev, [requestId]: true }))
    try {
      await onRequestAction(requestId, action)
    } catch (error) {
      // Error will be handled by the parent component
    } finally {
      setProcessingRequests((prev) => ({ ...prev, [requestId]: false }))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A"
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes || "00"} ${ampm}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Update the capitalizeFirstLetter function to handle undefined values
  const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) return "" // Return empty string if input is null or undefined
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Add a safety check for the formatLocation function
  const formatLocation = (location: string | undefined) => {
    if (!location) return "No location specified"

    // Check if location is a JSON string and try to parse it
    try {
      if (location.startsWith("{") && location.includes("address")) {
        const locationObj = JSON.parse(location)
        return locationObj.address || location
      }
    } catch (e) {
      // If parsing fails, return the original string
    }
    return location
  }

  const getStatusColor = (status: string) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
      cancelled: "bg-gray-100 text-gray-800 border-gray-300",
      pending_approval: "bg-amber-100 text-amber-800 border-amber-300",
    }

    const normalizedStatus = status?.toLowerCase().replace(/\s+/g, "_") || "pending"
    return statusMap[normalizedStatus] || statusMap.pending
  }

  const toggleExpand = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId)
  }

  // Add this function to check if a request can be actioned
  const canActionRequest = (status: string | undefined) => {
    if (!status) return true
    const normalizedStatus = status.toLowerCase()
    return normalizedStatus === "pending" || normalizedStatus === "pending_approval"
  }

  return (
    <div
      className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"} rounded-lg shadow-lg overflow-hidden`}
    >
      <div className={`p-5 ${isDarkMode ? "bg-slate-700" : "bg-gradient-to-r from-cyan-500 to-blue-600"}`}>
        <h2 className={`text-xl font-bold text-white flex items-center gap-2`}>
          <FaUserGraduate className="h-5 w-5 text-white" />
          Student Course Requests
        </h2>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className={`space-y-4`}>
            {requests.map((request) => (
              <motion.div
                key={request.request_id}
                className={`rounded-lg overflow-hidden ${
                  isDarkMode
                    ? "bg-slate-700 border border-slate-600 hover:border-cyan-500"
                    : "bg-white border border-gray-200 hover:border-cyan-500"
                } shadow-md transition-all duration-200 ease-in-out`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className={`p-4 cursor-pointer ${isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-50"}`}
                  onClick={() => toggleExpand(request.request_id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <Image
                          src={
                            request.student.profile_img || "/placeholder.svg?height=56&width=56&query=student profile"
                          }
                          alt={request.student.name}
                          width={56}
                          height={56}
                          className="rounded-full object-cover border-2 border-cyan-500"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                            isDarkMode ? "bg-slate-700" : "bg-white"
                          }`}
                        >
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                            {request.student.name}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-500"}`}>
                            {request.student.email}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              request?.status || "pending_approval",
                            )}`}
                          >
                            {capitalizeFirstLetter(request?.status || "Pending Approval").replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div
                          className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-2`}
                        >
                          <div className={`p-1.5 rounded-full ${isDarkMode ? "bg-slate-600" : "bg-cyan-100"}`}>
                            <FaCalendarAlt
                              className={`h-3.5 w-3.5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}
                            />
                          </div>
                          <span>{formatDate(request.request_date)}</span>
                        </div>
                        <div
                          className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-2`}
                        >
                          <div className={`p-1.5 rounded-full ${isDarkMode ? "bg-slate-600" : "bg-cyan-100"}`}>
                            <FaMoneyBillWave
                              className={`h-3.5 w-3.5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}
                            />
                          </div>
                          <span>{formatPrice(request.request_price)}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div
                          className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-slate-700"} flex items-center gap-2`}
                        >
                          <span className={`p-1.5 rounded-full ${isDarkMode ? "bg-slate-600" : "bg-cyan-100"}`}>
                            <FaBookOpen className={`h-3.5 w-3.5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                          </span>
                          <span>
                            Course: <span className="font-semibold">{request.Course.course_name}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {expandedRequest === request.request_id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {expandedRequest === request.request_id && (
                  <motion.div
                    className={`px-4 pb-4 pt-0 ${isDarkMode ? "border-t border-slate-600" : "border-t border-gray-200"}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Schedule Details
                        </h4>
                        <div className={`rounded-lg p-3 ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                          <div
                            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-2 mb-2`}
                          >
                            <span className="inline-block">
                              <FaClock className="h-3.5 w-3.5" />
                            </span>
                            <span>
                              {request.requestDayOfWeek ? capitalizeFirstLetter(request.requestDayOfWeek) : "N/A"}
                              {request.requestDayOfWeek && request.requestTimeSlot ? ", " : ""}
                              {request.requestTimeSlot ? formatTime(request.requestTimeSlot) : ""}
                            </span>
                          </div>
                          <div
                            className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-2`}
                          >
                            <span className="inline-block">
                              <FaMapMarkerAlt className="h-3.5 w-3.5" />
                            </span>
                            <span>{formatLocation(request.request_location)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Additional Information
                        </h4>
                        <div className={`rounded-lg p-3 ${isDarkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                          <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
                            {request.request_message || "No additional information provided."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3 justify-end">
                      <button
                        onClick={() => handleAction(request.request_id, "reject")}
                        disabled={processingRequests[request.request_id] || !canActionRequest(request.status)}
                        className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${
                          isDarkMode
                            ? "bg-red-700 hover:bg-red-600 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}
                      >
                        <FaTimes className="h-3.5 w-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(request.request_id, "approve")}
                        disabled={processingRequests[request.request_id] || !canActionRequest(request.status)}
                        className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 ${
                          isDarkMode
                            ? "bg-green-700 hover:bg-green-600 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm`}
                      >
                        <FaCheck className="h-3.5 w-3.5" />
                        Approve
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
            <div
              className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}
            >
              <FaUserGraduate className="h-10 w-10 opacity-30" />
            </div>
            <h3 className="text-lg font-medium mb-2">No pending course requests</h3>
            <p className="text-sm max-w-md mx-auto">
              When students request to join your courses, they will appear here for your approval
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
