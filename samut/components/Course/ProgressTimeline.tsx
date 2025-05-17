"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAppSelector } from "@/app/redux"
import { motion } from "framer-motion"
import { CheckCircle, Clock } from "lucide-react"

interface ProgressTimelineProps {
  progress?: {
    weeklyUpdates?: Array<{
      id: string
      weekNumber: number
      date: string
      title: string
      content: string
      achievements: string
      challenges: string
      nextSteps?: string
      images?: string[]
    }>
  }
  startDate: string
  endDate?: string
  currentProgress: number
  milestones?: Array<{
    title: string
    date?: string
    completed: boolean
  }>
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  progress,
  startDate,
  endDate,
  currentProgress,
  milestones = [],
}) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [timelineData, setTimelineData] = useState<
    Array<{
      date: string
      title: string
      type: "start" | "milestone" | "current" | "end"
      completed: boolean
    }>
  >([])

  useEffect(() => {
    // Create timeline data
    const timeline = [
      {
        date: startDate,
        title: "Course Start",
        type: "start" as const,
        completed: true,
      },
    ]

    // Add milestones
    if (milestones && milestones.length > 0) {
      milestones.forEach((milestone) => {
        if (milestone.date) {
          timeline.push({
            date: milestone.date,
            title: milestone.title,
            type: "milestone" as const,
            completed: milestone.completed,
          })
        }
      })
    }

    // Add current progress point if not at 100%
    if (currentProgress < 100) {
      const today = new Date().toISOString()
      timeline.push({
        date: today,
        title: "Current Progress",
        type: "current" as const,
        completed: false,
      })
    }

    // Add end date if provided
    if (endDate) {
      timeline.push({
        date: endDate,
        title: "Expected Completion",
        type: "end" as const,
        completed: currentProgress >= 100,
      })
    }

    // Sort by date
    timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setTimelineData(timeline)
  }, [startDate, endDate, currentProgress, milestones])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div
      className={`w-full ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"} rounded-xl p-6 shadow-sm`}
    >
      <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
        Course Timeline
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}></div>

        <div className="space-y-6">
          {timelineData.map((item, index) => (
            <motion.div
              key={`${item.type}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-2 top-1.5 w-5 h-5 rounded-full border-2 ${
                  item.completed
                    ? isDarkMode
                      ? "border-green-500 bg-green-900"
                      : "border-green-500 bg-green-100"
                    : item.type === "current"
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900"
                        : "border-blue-500 bg-blue-100"
                      : isDarkMode
                        ? "border-gray-600 bg-slate-800"
                        : "border-gray-300 bg-white"
                }`}
              >
                {item.completed && <CheckCircle className="w-3 h-3 text-green-500 absolute top-0.5 left-0.5" />}
                {item.type === "current" && <Clock className="w-3 h-3 text-blue-500 absolute top-0.5 left-0.5" />}
              </div>

              {/* Content */}
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{item.title}</h4>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {formatDate(item.date)}
                  </span>
                </div>

                {item.type === "current" && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Progress</span>
                      <span className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {currentProgress}%
                      </span>
                    </div>
                    <div className={`w-full h-1.5 ${isDarkMode ? "bg-slate-600" : "bg-gray-200"} rounded-full`}>
                      <div
                        className={`h-1.5 rounded-full ${isDarkMode ? "bg-cyan-500" : "bg-blue-500"}`}
                        style={{ width: `${currentProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressTimeline
