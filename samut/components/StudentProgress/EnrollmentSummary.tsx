import { Calendar, Clock, BookOpen } from "lucide-react"
import type { EnrollmentWithDetails } from "@/types/enrollment"
import { useAppSelector } from "@/app/redux"
import Image from "next/image"
import { format } from "date-fns"

interface EnrollmentSummaryProps {
  enrollment: EnrollmentWithDetails
}

export default function EnrollmentSummary({ enrollment }: EnrollmentSummaryProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Calculate progress percentage
  const progressPercentage =
    enrollment.target_sessions_to_complete > 0
      ? Math.min(100, Math.round((enrollment.actual_sessions_attended / enrollment.target_sessions_to_complete) * 100))
      : 0

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Get schedule information
  const getScheduleInfo = () => {
    if (enrollment.request?.requestedSlots && enrollment.request.requestedSlots.length > 0) {
      const slot = enrollment.request.requestedSlots[0]
      return `${slot.dayOfWeek.toLowerCase()}: ${slot.startTime}-${slot.endTime}`
    }
    return "No schedule information"
  }

  return (
    <div className={`rounded-xl overflow-hidden ${isDarkMode ? "bg-slate-800/80" : "bg-white"} shadow-sm`}>
      <div className="flex flex-col">
        <div className="relative w-full h-[180px]">
          <Image
            src={
              enrollment.request?.student?.profile_img ||
              enrollment.request?.Course?.course_image ||
              "/placeholder.svg?height=180&width=800&query=course background" ||
              "/placeholder.svg"
            }
            alt={enrollment.request?.Course?.course_name || "Course"}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90"></div>

          <div className="absolute bottom-0 left-0 p-5 w-full">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{enrollment.request?.student?.name || "Unknown Student"}</h2>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full uppercase ${
                  enrollment.status === "active"
                    ? "bg-green-600 text-white"
                    : enrollment.status === "completed"
                      ? "bg-blue-600 text-white"
                      : enrollment.status === "paused"
                        ? "bg-amber-600 text-white"
                        : "bg-red-600 text-white"
                }`}
              >
                {enrollment.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-3">{enrollment.request?.Course?.course_name || "Unknown Course"}</p>

            <div className="grid grid-cols-3 gap-4 text-white">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-cyan-400" />
                <div>
                  <p className="text-xs font-medium text-gray-400">Started</p>
                  <p className="text-sm">{formatDate(enrollment.start_date)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
                <div>
                  <p className="text-xs font-medium text-gray-400">Sessions</p>
                  <p className="text-sm">
                    {enrollment.actual_sessions_attended}/{enrollment.target_sessions_to_complete} Sessions
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-cyan-400" />
                <div>
                  <p className="text-xs font-medium text-gray-400">Schedule</p>
                  <p className="text-sm">{getScheduleInfo()}</p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-300">Progress</span>
                <span className="text-sm font-medium text-cyan-400">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
