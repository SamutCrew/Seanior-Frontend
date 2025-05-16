"use client"

import { useState } from "react"
import { useAppSelector } from "@/app/redux"
import { format } from "date-fns"
import { Info, Edit2, Plus, Trash2, FileText, CalendarIcon } from "lucide-react"
import { Button } from "@/components/Common/Button"
import type { SessionProgress } from "@/types/progress"

export type SkillAssessment = {
  id?: string
  name: string
  progress: number
  description?: string
  lastUpdated?: string
}

interface ProgressTrackerProps {
  // Progress tracking props
  overallProgress?: number
  lastUpdated?: string
  skills?: SkillAssessment[]
  isEditable?: boolean
  onAddSkill?: () => void
  onEditSkill?: (skill: SkillAssessment) => void

  // Session tracking props
  sessions?: SessionProgress[]
  onEditSession?: (session: SessionProgress) => void
  onDeleteSession?: (sessionId: string) => void
  enrollmentId?: string

  // General props
  emptyStateMessage?: string
  activeTab?: "progress" | "sessions"
  onTabChange?: (tab: "progress" | "sessions") => void
}

export default function ProgressTracker({
  // Progress tracking props
  overallProgress,
  lastUpdated,
  skills = [],
  isEditable = false,
  onAddSkill,
  onEditSkill,

  // Session tracking props
  sessions = [],
  onEditSession,
  onDeleteSession,
  enrollmentId = "",

  // General props
  emptyStateMessage = "No data available yet.",
  activeTab = "progress",
  onTabChange,
}: ProgressTrackerProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Format the last updated date
  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return "Not updated yet"

    try {
      return format(new Date(dateString), "M/d/yyyy, h:mm:ss a")
    } catch (error) {
      return dateString
    }
  }

  // Format date for sessions
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  // Sort sessions by date
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.date_session).getTime()
    const dateB = new Date(b.date_session).getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  // Check if we have any data to display
  const hasProgressData = (overallProgress !== undefined && overallProgress >= 0) || skills.length > 0
  const hasSessionData = sessions.length > 0

  return (
    <div className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800/80" : "bg-white"} shadow-sm`}>
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 border-b border-slate-700 w-full">
          <button
            onClick={() => onTabChange && onTabChange("progress")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "progress"
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Progress Tracking
          </button>
          <button
            onClick={() => onTabChange && onTabChange("sessions")}
            className={`pb-2 px-4 font-medium ${
              activeTab === "sessions"
                ? "border-b-2 border-cyan-500 text-cyan-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Session Records
          </button>
        </div>
      </div>

      {/* Progress Tracking Tab */}
      {activeTab === "progress" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Progress Tracking</h2>

            {isEditable && onAddSkill && (
              <Button variant="outline" size="sm" onClick={onAddSkill}>
                <Plus className="w-4 h-4 mr-1" /> Add Skill
              </Button>
            )}
          </div>

          {!hasProgressData ? (
            <div className="py-8 text-center">
              <p className="text-gray-400">{emptyStateMessage}</p>
            </div>
          ) : (
            <>
              {/* Overall Progress - Only show if provided */}
              {overallProgress !== undefined && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-300">Overall Completion</h3>
                    <span className="font-bold text-cyan-400">{overallProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-700">
                    <div className="h-2 rounded-full bg-cyan-500" style={{ width: `${overallProgress}%` }}></div>
                  </div>
                  {lastUpdated && (
                    <p className="text-xs mt-2 text-gray-400">Last updated: {formatLastUpdated(lastUpdated)}</p>
                  )}
                </div>
              )}

              {/* Session Completion - Only show if provided */}
              {sessions && sessions.length > 0 && enrollmentId && (
                <div className="mb-6 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-300">Session Completion</h3>
                    <span className="text-sm text-gray-400">
                      {sessions.length} {sessions.length === 1 ? "session" : "sessions"} recorded
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-700/50 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Sessions Completed</span>
                      <span className="text-sm font-medium text-cyan-400">{sessions.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sessions.map((session, index) => (
                        <div
                          key={session.session_progress_id || index}
                          className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-xs text-white"
                          title={`Session ${session.session_number}: ${session.topic_covered}`}
                        >
                          {session.session_number}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Assessment */}
              {skills.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4">Skills Assessment</h3>

                  {skills.map((skill, index) => (
                    <div key={skill.id || index} className="relative">
                      <div className="flex justify-between mb-1 items-center">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          {skill.description && (
                            <div className="relative inline-block">
                              <button
                                className="ml-1"
                                onMouseEnter={() => setShowInfoTooltip(skill.id || `skill-${index}`)}
                                onMouseLeave={() => setShowInfoTooltip(null)}
                              >
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                              </button>

                              {showInfoTooltip === (skill.id || `skill-${index}`) && (
                                <div className="absolute z-10 w-48 p-2 mt-1 text-sm text-white bg-gray-800 rounded-md shadow-lg -left-20 top-6">
                                  {skill.description}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cyan-400">{skill.progress}%</span>
                          {isEditable && onEditSkill && (
                            <button
                              onClick={() => onEditSkill(skill)}
                              className="p-1 rounded-full hover:bg-slate-700 text-gray-400 hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                      </div>
                      {skill.lastUpdated && (
                        <p className="text-xs mt-1 text-gray-500">Updated: {formatLastUpdated(skill.lastUpdated)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Session Records Tab */}
      {activeTab === "sessions" && (
        <div>
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
            {onEditSession && enrollmentId && (
              <Button
                variant="gradient"
                size="sm"
                onClick={() =>
                  onEditSession({ session_progress_id: "", enrollment_id: enrollmentId } as SessionProgress)
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            )}
          </div>

          {!hasSessionData ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-gray-500 mb-3" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No Sessions Recorded</h3>
              <p className="text-gray-400 mb-4">Start tracking progress by adding a session record.</p>
              {onEditSession && enrollmentId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onEditSession({ session_progress_id: "", enrollment_id: enrollmentId } as SessionProgress)
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Session
                </Button>
              )}
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
                      {onEditSession && (
                        <button
                          onClick={() => onEditSession(session)}
                          className="p-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDeleteSession && (
                        <button
                          onClick={() => onDeleteSession(session.session_progress_id)}
                          className="p-1.5 rounded-md bg-red-900/30 hover:bg-red-900/50 text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
      )}
    </div>
  )
}
