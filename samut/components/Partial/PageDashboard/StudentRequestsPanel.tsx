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
} from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import type { CourseRequest } from "@/types/request"
import Image from "next/image"

interface StudentRequestsPanelProps {
  requests: CourseRequest[]
  onRequestAction: (requestId: string, action: "approve" | "reject") => Promise<void>
  isLoading: boolean
}

export default function StudentRequestsPanel({ requests, onRequestAction, isLoading }: StudentRequestsPanelProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [processingRequests, setProcessingRequests] = useState<Record<string, boolean>>({})

  const handleAction = async (requestId: string, action: "approve" | "reject") => {
    setProcessingRequests((prev) => ({ ...prev, [requestId]: true }))
    try {
      await onRequestAction(requestId, action)
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

  const capitalizeFirstLetter = (string) => {
    if (!string) return "" // Return empty string if input is null or undefined
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"} rounded-lg shadow-sm`}>
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-b"}`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center gap-2`}>
          <FaUserGraduate className={`h-5 w-5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
          Student Course Requests
        </h2>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-gray-200"}`}>
            {requests.map((request) => (
              <div key={request.request_id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={request.student.profile_img || "/placeholder.svg?height=40&width=40&query=user"}
                      alt={request.student.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                          {request.student.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-500"}`}>
                          {request.student.email}
                        </p>
                      </div>
                      <div className="mt-1 sm:mt-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {capitalizeFirstLetter(request?.status || "").replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-1`}
                      >
                        <FaCalendarAlt className="h-3.5 w-3.5" />
                        <span>{formatDate(request.request_date)}</span>
                      </div>
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-1`}
                      >
                        <FaClock className="h-3.5 w-3.5" />
                        <span>
                          {request.requestDayOfWeek ? capitalizeFirstLetter(request.requestDayOfWeek) : "N/A"}
                          {request.requestDayOfWeek && request.requestTimeSlot ? ", " : ""}
                          {request.requestTimeSlot ? formatTime(request.requestTimeSlot) : ""}
                        </span>
                      </div>
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-1`}
                      >
                        <FaMapMarkerAlt className="h-3.5 w-3.5" />
                        <span>{request.request_location}</span>
                      </div>
                      <div
                        className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"} flex items-center gap-1`}
                      >
                        <FaMoneyBillWave className="h-3.5 w-3.5" />
                        <span>{formatPrice(request.request_price)}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-slate-700"}`}>
                        Course: {request.Course.course_name}
                      </p>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleAction(request.request_id, "approve")}
                        disabled={processingRequests[request.request_id]}
                        className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 ${
                          isDarkMode
                            ? "bg-green-700 hover:bg-green-600 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <FaCheck className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request.request_id, "reject")}
                        disabled={processingRequests[request.request_id]}
                        className={`px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 ${
                          isDarkMode
                            ? "bg-red-700 hover:bg-red-600 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <FaTimes className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-slate-500"}`}>
            <FaUserGraduate className="mx-auto h-10 w-10 mb-3 opacity-30" />
            <p>No pending course requests</p>
            <p className="text-sm mt-1">When students request to join your courses, they will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
