"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, ChevronDown, CheckCircle, XCircle, Plus } from "lucide-react"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"

export interface WeeklyProgressItem {
  id: number
  week: number
  title: string
  date: string
  content: string
  achievements: string[]
  images: string[]
  progress: number
  progressItems: {
    name: string
    completed: boolean
  }[]
  // New field to track session/lesson number
  session?: number
}

interface WeeklyProgressListProps {
  updates: WeeklyProgressItem[]
  isStudentView?: boolean
  onViewImage?: (update: WeeklyProgressItem, index: number) => void
  onAddUpdate?: () => void
  // New prop to specify total number of sessions/lessons
  totalSessions?: number
}

export default function WeeklyProgressList({
  updates,
  isStudentView = false,
  onViewImage,
  onAddUpdate,
  totalSessions = 0, // Default to 0 if not provided
}: WeeklyProgressListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [expandedIds, setExpandedIds] = useState<number[]>([])
  // Create refs for each update card
  const updateRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Initialize refs array when updates change
  useEffect(() => {
    updateRefs.current = updateRefs.current.slice(0, updates.length)
  }, [updates])

  // Calculate the actual number of sessions to display in the progress bar
  const actualTotalSessions = totalSessions > 0 ? totalSessions : updates.length

  // Generate session circles for the progress bar
  const sessionCircles = Array.from({ length: actualTotalSessions }, (_, i) => {
    // Find the update that corresponds to this session, if any
    const sessionUpdate = updates.find(
      (update) => update.session === i + 1 || (!update.session && update.week === i + 1),
    )

    // Determine completion status
    const isCompleted = sessionUpdate ? sessionUpdate.progress === 100 : false
    const isActive = sessionUpdate ? sessionUpdate.progress > 0 && sessionUpdate.progress < 100 : false

    return {
      session: i + 1,
      isCompleted,
      isActive,
      updateIndex: sessionUpdate ? updates.indexOf(sessionUpdate) : -1,
    }
  })

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) {
      return isDarkMode ? "bg-green-500" : "bg-green-600"
    } else if (progress > 60) {
      return isDarkMode ? "bg-cyan-500" : "bg-blue-600"
    } else {
      return isDarkMode ? "bg-amber-500" : "bg-amber-600"
    }
  }

  // Find the current active session (the first incomplete one)
  const currentSessionIndex = sessionCircles.findIndex((session) => session.isActive)
  const activeSession =
    currentSessionIndex >= 0 ? currentSessionIndex : sessionCircles.findIndex((session) => !session.isCompleted)

  // If all sessions are complete, set the last one as active
  const activeSessionIndex = activeSession >= 0 ? activeSession : sessionCircles.length - 1

  // Function to scroll to a specific update card
  const scrollToSession = (sessionNum: number, updateIndex: number) => {
    // If there's no corresponding update, do nothing
    if (updateIndex < 0) return

    // Expand the card if it's not already expanded
    const updateId = updates[updateIndex]?.id
    if (updateId && !expandedIds.includes(updateId)) {
      setExpandedIds((prev) => [...prev, updateId])
    }

    // Scroll to the card with smooth behavior
    if (updateRefs.current[updateIndex]) {
      updateRefs.current[updateIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Ref callback function that properly sets the ref without returning anything
  const setUpdateRef = (el: HTMLDivElement | null, index: number) => {
    updateRefs.current[index] = el
  }

  return (
    <div className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-900" : "bg-white"} shadow-sm`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Lesson Updates</h2>

      </div>

      {/* Multi-step Progress Bar */}
      {sessionCircles.length > 0 && (
        <div className="mb-8 px-4 overflow-x-auto" ref={progressBarRef}>
          <div className={`relative ${sessionCircles.length > 5 ? "min-w-[600px]" : ""}`}>
            {/* Background bar */}
            <div className={`absolute top-5 left-0 right-0 h-1 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}></div>

            {/* Completed bar */}
            <div
              className={`absolute top-5 left-0 h-1 ${isDarkMode ? "bg-cyan-500" : "bg-blue-500"}`}
              style={{
                width: `${Math.max(0, (activeSessionIndex / (sessionCircles.length - 1)) * 100)}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>

            {/* Step circles */}
            <div className="flex justify-between relative">
              {sessionCircles.map((session, index) => {
                // Set colors based on status
                let circleColor = ""
                let textColor = ""
                let hoverEffect = ""

                if (session.isCompleted) {
                  circleColor = isDarkMode ? "bg-cyan-500 border-cyan-500" : "bg-blue-500 border-blue-500"
                  textColor = isDarkMode ? "text-white" : "text-white"
                  hoverEffect = isDarkMode ? "hover:bg-cyan-600" : "hover:bg-blue-600"
                } else if (session.isActive || index === activeSessionIndex) {
                  circleColor = isDarkMode ? "bg-green-500 border-green-500" : "bg-green-600 border-green-600"
                  textColor = isDarkMode ? "text-white" : "text-white"
                  hoverEffect = isDarkMode ? "hover:bg-green-600" : "hover:bg-green-700"
                } else {
                  circleColor = isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-200 border-gray-300"
                  textColor = isDarkMode ? "text-gray-400" : "text-gray-500"
                  hoverEffect = isDarkMode ? "hover:bg-slate-600" : "hover:bg-gray-300"
                }

                return (
                  <div key={`session-${session.session}`} className="flex flex-col items-center">
                    <button
                      onClick={() => scrollToSession(session.session, session.updateIndex)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${circleColor} ${hoverEffect} transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${session.updateIndex < 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                      aria-label={`Go to Session ${session.session}`}
                      disabled={session.updateIndex < 0}
                    >
                      <span className={`text-sm font-medium ${textColor}`}>{session.session}</span>
                    </button>
                    <span
                      className={`text-xs mt-2 text-center ${
                        session.isCompleted || session.isActive
                          ? isDarkMode
                            ? "text-cyan-400"
                            : "text-blue-600"
                          : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                      }`}
                    >
                      {session.updateIndex >= 0 ? `Session ${session.session}` : `--`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {updates.length === 0 ? (
        <div
          className={`p-8 text-center rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-slate-700 text-gray-400" : "border-gray-200 text-gray-500"
          }`}
        >
          <p>No updates available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              ref={(el) => setUpdateRef(el, index)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg overflow-hidden ${
                isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
              } transition-colors duration-200`}
              id={`session-${update.session || update.week}`}
            >
              {/* Update Header - Always visible */}
              <div
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  isDarkMode ? "hover:bg-slate-750" : "hover:bg-gray-50"
                }`}
                onClick={() => toggleExpand(update.id)}
              >
                <div className="flex items-center">
                  <Calendar className={`w-5 h-5 mr-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`} />
                  <div>
                    <h4 className="font-medium">
                      Session {update.session || update.week}: {update.title}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {update.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Progress</span>
                    <span className={`text-xs font-medium ml-2 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                      {update.progress}%
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedIds.includes(update.id) ? "transform rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Progress bar - Always visible */}
              <div className={`w-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} h-1.5`}>
                <div
                  className={`h-1.5 ${getProgressColor(update.progress)}`}
                  style={{ width: `${update.progress}%` }}
                ></div>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedIds.includes(update.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-100 dark:border-slate-700">
                      {/* Lesson Images */}
                      {update.images && update.images.length > 0 && (
                        <div className="mb-4">
                          <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Lesson Images
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {update.images.map((image: string, index: number) => (
                              <div
                                key={index}
                                className="relative aspect-video rounded-md overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
                                onClick={() => onViewImage && onViewImage(update, index)}
                              >
                                <Image
                                  src={image || "/placeholder.svg?query=swim lesson"}
                                  alt={`Session ${update.session || update.week} image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lesson Content */}
                      <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{update.content}</p>

                      {/* Achievements */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {update.achievements.map((achievement: string, i: number) => (
                          <div
                            key={i}
                            className={`text-xs px-3 py-1 rounded-full flex items-center ${
                              achievement.includes("struggling")
                                ? isDarkMode
                                  ? "bg-red-900/30 text-red-300"
                                  : "bg-red-50 text-red-700"
                                : isDarkMode
                                  ? "bg-green-900/30 text-green-300"
                                  : "bg-green-50 text-green-700"
                            }`}
                          >
                            {achievement.includes("struggling") ? (
                              <XCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
