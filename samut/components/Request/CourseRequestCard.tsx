"use client"

import type React from "react"
import { formatDistanceToNow } from "date-fns"
import { Clock, Calendar, MapPin, DollarSign, AlertCircle } from "lucide-react"
import type { CourseRequest } from "@/types/request"
import { useAppSelector } from "@/app/redux"
import { formatDisplayPrice } from "@/utils/moneyUtils"

interface CourseRequestCardProps {
  request: CourseRequest
  onCancel: (requestId: string) => void
  isLoading?: boolean
}

const CourseRequestCard: React.FC<CourseRequestCardProps> = ({ request, onCancel, isLoading = false }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Format the date
  const formattedDate = new Date(request.created_at).toLocaleDateString()
  const timeAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return isDarkMode ? "text-yellow-400 bg-yellow-900/30" : "text-yellow-600 bg-yellow-100"
      case "approved":
        return isDarkMode ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-100"
      case "rejected":
        return isDarkMode ? "text-red-400 bg-red-900/30" : "text-red-600 bg-red-100"
      case "cancelled":
        return isDarkMode ? "text-gray-400 bg-gray-900/30" : "text-gray-600 bg-gray-100"
      default:
        return isDarkMode ? "text-blue-400 bg-blue-900/30" : "text-blue-600 bg-blue-100"
    }
  }

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            {request.Course.course_name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center mb-2">
          <div className={`w-8 h-8 rounded-full overflow-hidden mr-2 ${isDarkMode ? "bg-slate-700" : "bg-gray-100"}`}>
            {request.Course.instructor?.profile_img ? (
              <img
                src={request.Course.instructor.profile_img || "/placeholder.svg"}
                alt={request.Course.instructor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}
              >
                {request.Course.instructor?.name.charAt(0).toUpperCase() || "I"}
              </div>
            )}
          </div>
          <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Instructor: {request.Course.instructor?.name || "Not assigned"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center">
            <Calendar className={`w-4 h-4 mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {request.requestDayOfWeek}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className={`w-4 h-4 mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {request.requestTimeSlot}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className={`w-4 h-4 mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {request.request_location}
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className={`w-4 h-4 mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {formatDisplayPrice(request.request_price)}
            </span>
          </div>
        </div>

        <div className={`mt-4 pt-3 border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className={`w-4 h-4 mr-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Requested {timeAgo}</span>
            </div>

            {request.status.toLowerCase() === "pending" && (
              <button
                onClick={() => onCancel(request.request_id)}
                disabled={isLoading}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  isDarkMode
                    ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Cancelling..." : "Cancel Request"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseRequestCard
