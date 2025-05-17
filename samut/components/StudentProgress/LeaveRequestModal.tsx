"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Calendar, FileText, AlertCircle, Loader2, Send } from "lucide-react"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"

interface LeaveRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { date: string; reason: string }) => void
  enrollmentId: string
}

export default function LeaveRequestModal({ isOpen, onClose, onSubmit, enrollmentId }: LeaveRequestModalProps) {
  const [date, setDate] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ date?: string; reason?: string }>({})
  const [characterCount, setCharacterCount] = useState(0)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDate("")
      setReason("")
      setErrors({})
    }
  }, [isOpen])

  // Update character count when reason changes
  useEffect(() => {
    setCharacterCount(reason.trim().length)
  }, [reason])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: { date?: string; reason?: string } = {}

    if (!date) {
      newErrors.date = "Please select a date"
    } else {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day for fair comparison

      if (selectedDate < today) {
        newErrors.date = "Cannot request leave for past dates"
      }
    }

    if (!reason || reason.trim().length < 10) {
      newErrors.reason = "Please provide a reason (minimum 10 characters)"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors
    setErrors({})
    setIsSubmitting(true)

    try {
      await onSubmit({ date, reason })
      // Reset form
      setDate("")
      setReason("")
      onClose()
    } catch (error) {
      console.error("Error submitting leave request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md mx-4 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`relative ${isDarkMode ? "bg-gradient-to-r from-blue-900 to-cyan-900" : "bg-gradient-to-r from-blue-500 to-cyan-500"}`}
        >
          <div className="absolute top-0 right-0 p-2">
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full ${
                isDarkMode
                  ? "bg-slate-800/30 hover:bg-slate-800/50 text-white"
                  : "bg-white/30 hover:bg-white/50 text-white"
              } transition-colors duration-200`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 pt-8">
            <h3 className="text-xl font-bold text-white mb-1">Request Leave</h3>
            <p className="text-blue-100 text-sm">Submit your absence request for instructor approval</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Date Field */}
            <div>
              <label
                htmlFor="leave-date"
                className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                <div className="flex items-center">
                  <Calendar className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                  Date of Absence
                </div>
              </label>
              <div className="relative">
                <input
                  id="leave-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-3 py-2.5 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-600"
                  } border ${
                    errors.date ? (isDarkMode ? "border-red-500" : "border-red-500") : ""
                  } focus:outline-none focus:ring-1 ${
                    isDarkMode ? "focus:ring-cyan-500" : "focus:ring-cyan-600"
                  } transition-colors duration-200`}
                />
                {errors.date && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.date && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.date}
                </p>
              )}
              {date && !errors.date && (
                <p className={`mt-1.5 text-sm ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>{formatDate(date)}</p>
              )}
            </div>

            {/* Reason Field */}
            <div>
              <label
                htmlFor="leave-reason"
                className={`block text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                <div className="flex items-center">
                  <FileText className={`w-4 h-4 mr-2 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} />
                  Reason for Absence
                </div>
              </label>
              <div className="relative">
                <textarea
                  id="leave-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Please explain why you need to be absent..."
                  className={`w-full px-3 py-2.5 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:border-cyan-500 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-600 placeholder-gray-500"
                  } border ${errors.reason ? "border-red-500" : ""} focus:outline-none focus:ring-1 ${
                    isDarkMode ? "focus:ring-cyan-500" : "focus:ring-cyan-600"
                  } transition-colors duration-200`}
                />
                {errors.reason && (
                  <div className="absolute top-2 right-2 pointer-events-none">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.reason && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1" />
                  {errors.reason}
                </p>
              )}
              <div className="mt-1.5 flex justify-between items-center">
                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Minimum 10 characters</div>
                <div
                  className={`text-xs ${
                    characterCount < 10 ? "text-red-500" : isDarkMode ? "text-cyan-400" : "text-cyan-600"
                  }`}
                >
                  {characterCount}/10+ characters
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div
              className={`flex items-start p-3 rounded-lg text-sm ${
                isDarkMode
                  ? "bg-slate-700/50 text-gray-300 border border-slate-600"
                  : "bg-blue-50 text-gray-700 border border-blue-100"
              }`}
            >
              <div className={`mt-0.5 mr-3 flex-shrink-0 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className={`font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Important Information
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>Your instructor will be notified of your request</li>
                  <li>Requests should be made at least 24 hours in advance</li>
                  <li>Excessive absences may affect your course progress</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className={isDarkMode ? "" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
