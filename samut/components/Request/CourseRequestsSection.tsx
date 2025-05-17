"use client"

import type React from "react"
import { useState } from "react"
import { useAppSelector } from "@/app/redux"
import { AlertCircle } from "lucide-react"
import CourseRequestCard from "./CourseRequestCard"
import type { CourseRequest } from "@/types/request"

import { Toast } from "@/components/Responseback/Toast"
interface CourseRequestsSectionProps {
  requests: CourseRequest[]
  onRequestCancelled: () => void
}

const CourseRequestsSection: React.FC<CourseRequestsSectionProps> = ({ requests, onRequestCancelled }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Filter requests by status
  const pendingRequests = requests.filter((req) => req.status.toLowerCase() === "pending")
  const otherRequests = requests.filter((req) => req.status.toLowerCase() !== "pending")



  if (requests.length === 0) {
    return (
      <div className={`rounded-xl p-6 text-center ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm mb-8`}>
        <div className="flex flex-col items-center justify-center">
          <div className={`p-3 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-blue-50"} mb-3`}>
            <AlertCircle className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            No Course Requests
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            You haven't made any course requests yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {pendingRequests.length > 0 && (
        <>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Pending Requests</h2>

        </>
      )}

      {otherRequests.length > 0 && (
        <>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Past Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherRequests.map((request) => (
              <CourseRequestCard key={request.request_id} request={request}  />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CourseRequestsSection
