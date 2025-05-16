"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/Common/Button"
import { X } from "lucide-react"
import { useAppSelector } from "@/app/redux"
import type { SessionProgress } from "@/types/progress"

interface SessionProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sessionData: Partial<SessionProgress>) => void
  session: SessionProgress | null
}

export default function SessionProgressModal({ isOpen, onClose, onSave, session }: SessionProgressModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [sessionNumber, setSessionNumber] = useState(1)
  const [topicCovered, setTopicCovered] = useState("")
  const [performanceNotes, setPerformanceNotes] = useState("")
  const [sessionDate, setSessionDate] = useState("")

  useEffect(() => {
    if (session) {
      setSessionNumber(session.session_number || 1)
      setTopicCovered(session.topic_covered || "")
      setPerformanceNotes(session.performance_notes || "")

      // Format date for input
      if (session.date_session) {
        const date = new Date(session.date_session)
        setSessionDate(date.toISOString().split("T")[0])
      } else {
        setSessionDate(new Date().toISOString().split("T")[0])
      }
    } else {
      // Default values for new session
      setSessionNumber(1)
      setTopicCovered("")
      setPerformanceNotes("")
      setSessionDate(new Date().toISOString().split("T")[0])
    }
  }, [session])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const sessionData: Partial<SessionProgress> = {
      session_progress_id: session?.session_progress_id,
      enrollment_id: session?.enrollment_id,
      session_number: sessionNumber,
      topic_covered: topicCovered,
      performance_notes: performanceNotes,
      date_session: new Date(sessionDate).toISOString(),
    }

    onSave(sessionData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-md p-6 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">
            {session?.session_progress_id ? "Edit Session" : "Add New Session"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Session Number</label>
              <input
                type="number"
                value={sessionNumber}
                onChange={(e) => setSessionNumber(Number.parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Topic Covered</label>
              <input
                type="text"
                value={topicCovered}
                onChange={(e) => setTopicCovered(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Performance Notes</label>
              <textarea
                value={performanceNotes}
                onChange={(e) => setPerformanceNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gradient" type="submit">
              {session?.session_progress_id ? "Update Session" : "Add Session"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
