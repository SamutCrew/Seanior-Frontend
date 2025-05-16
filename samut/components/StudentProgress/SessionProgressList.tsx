"use client"

import { useState } from "react"
import { Button } from "@/components/Common/Button"
import { Plus, Edit2, Trash2, FileText, CalendarIcon } from "lucide-react"
import { useAppSelector } from "@/app/redux"
import type { SessionProgress } from "@/types/progress"
import { format } from "date-fns"

interface SessionProgressListProps {
  sessions: SessionProgress[]
  onEditSession: (session: SessionProgress) => void
  onDeleteSession: (sessionId: string) => void
  enrollmentId: string
}

export default function SessionProgressList({
  sessions,
  onEditSession,
  onDeleteSession,
  enrollmentId,
}: SessionProgressListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date_session).getTime()
    const dateB = new Date(b.date_session).getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-white">Session Records</h3>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="ml-2 p-1 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
        <Button
          variant="gradient"
          size="sm"
          onClick={() => onEditSession({ session_progress_id: "", enrollment_id: enrollmentId } as SessionProgress)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </Button>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
          <FileText className="w-12 h-12 mx-auto text-gray-500 mb-3" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Sessions Recorded</h3>
          <p className="text-gray-400 mb-4">Start tracking progress by adding a session record.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditSession({ session_progress_id: "", enrollment_id: enrollmentId } as SessionProgress)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Session
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <div
              key={session.session_progress_id}
              className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50"} hover:bg-slate-600 transition-colors`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-white">Session {session.session_number}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-900/30 text-blue-300">
                      {session.topic_covered}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-400 text-sm">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(session.date_session)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditSession(session)}
                    className="p-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.session_progress_id)}
                    className="p-1.5 rounded-md bg-red-900/30 hover:bg-red-900/50 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {session.performance_notes && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <p className="text-sm text-gray-300">{session.performance_notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
