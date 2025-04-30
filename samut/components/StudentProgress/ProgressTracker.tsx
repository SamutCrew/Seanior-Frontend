"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/app/redux"

interface ProgressTrackerProps {
  skills: {
    name: string
    progress: number
  }[]
  overallProgress: number
  lastUpdated?: string
  isStudentView?: boolean
}

export default function ProgressTracker({ skills, overallProgress, lastUpdated, isStudentView = false }: ProgressTrackerProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          {isStudentView ? "Your Progress" : "Progress Tracking"}
        </h2>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Overall Completion</h3>
          <span className={`font-bold ${isDarkMode ? "text-cyan-400" : "text-sky-600"}`}>
            {overallProgress}%
          </span>
        </div>
        <div className={`w-full h-3 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
          <div
            className={`h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        {lastUpdated && (
          <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      {/* Skills Assessment */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Skills Assessment
        </h3>
        
        {skills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{skill.name}</span>
              <span className={`text-sm font-medium ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
                {skill.progress}%
              </span>
            </div>
            <div className={`w-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"} rounded-full h-2`}>
              <div
                className={`${isDarkMode ? "bg-cyan-500" : "bg-blue-600"} h-2 rounded-full`}
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
