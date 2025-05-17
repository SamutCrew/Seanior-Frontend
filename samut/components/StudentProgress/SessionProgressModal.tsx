"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/Common/Button"
import { X } from "lucide-react"
import type { SessionProgress } from "@/types/progress"

interface SessionProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sessionData: Partial<SessionProgress>) => void
  session: SessionProgress | null
}

const SessionProgressModal = ({ isOpen, onClose, onSave, session }: SessionProgressModalProps) => {
  const [sessionNumber, setSessionNumber] = useState<number>(1)
  const [topicCovered, setTopicCovered] = useState<string>("")
  const [performanceNotes, setPerformanceNotes] = useState<string>("")
  const [dateSession, setDateSession] = useState<string>(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (session) {
      setSessionNumber(session.session_number || 1)
      setTopicCovered(session.topic_covered || "")
      setPerformanceNotes(session.performance_notes || "")
      setDateSession(
        session.date_session
          ? new Date(session.date_session).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      )
    } else {
      // Reset form for new session
      setSessionNumber(1)
      setTopicCovered("")
      setPerformanceNotes("")
      setDateSession(new Date().toISOString().split("T")[0])
    }
    setIsSubmitting(false)
  }, [session, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      await onSave({
        session_progress_id: session?.session_progress_id,
        session_number: sessionNumber,
        topic_covered: topicCovered,
        performance_notes: performanceNotes,
        date_session: dateSession,
      })
    } catch (error) {
      console.error("Error saving session:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">{session ? "Edit Session Progress" : "Add New Session"}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-slate-700 hover:text-white"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-300">Session Number</label>
            <input
              type="number"
              value={sessionNumber}
              onChange={(e) => setSessionNumber(Number.parseInt(e.target.value) || 1)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              min="1"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-300">Topic Covered</label>
            <input
              type="text"
              value={topicCovered}
              onChange={(e) => setTopicCovered(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="e.g., Introduction to Freestyle Stroke"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-300">Performance Notes</label>
            <textarea
              value={performanceNotes}
              onChange={(e) => setPerformanceNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              rows={4}
              placeholder="Notes about student performance..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-300">Session Date</label>
            <input
              type="date"
              value={dateSession}
              onChange={(e) => setDateSession(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="gradient" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  {session ? "Updating..." : "Adding..."}
                </span>
              ) : session ? (
                "Update Session"
              ) : (
                "Add Session"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SessionProgressModal
