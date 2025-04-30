"use client"

import type React from "react"
import type { CourseProgress } from "@/types/course"

interface ProgressTimelineProps {
  progress: CourseProgress
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ progress }) => {
  const isDarkMode = false // Replace with your actual dark mode state

  // Format date to a more readable format
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
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
        Course Timeline
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}></div>

        <div className="space-y-6">
          {progress.weeklyUpdates?.map((update, index) => (
            <div key={update.id} className="relative pl-12">
              {/* Timeline dot */}
              <div
                className={`absolute left-2 top-1.5 w-5 h-5 rounded-full border-2 ${
                  isDarkMode ? "border-cyan-500 bg-slate-800" : "border-blue-500 bg-white"
                }`}
              ></div>

              {/* Content */}
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                    Week {update.weekNumber}: {update.title}
                  </h4>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                </div>

                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{update.content}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {update.achievements.split(" ").slice(0, 3).join(" ")}...
                  </span>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isDarkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {update.challenges.split(" ").slice(0, 3).join(" ")}...
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressTimeline
