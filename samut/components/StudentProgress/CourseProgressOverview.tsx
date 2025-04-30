"use client"

import { motion } from "framer-motion"
import { useAppSelector } from "@/app/redux"
import { CheckCircle, Circle, AlertCircle } from "lucide-react"
import type { CourseModule } from "@/types/course"

interface CourseProgressOverviewProps {
  courseName: string
  studentName: string
  overallProgress: number
  modules: CourseModule[]
  lastUpdated?: string
}

export default function CourseProgressOverview({
  courseName,
  studentName,
  overallProgress,
  modules,
  lastUpdated,
}: CourseProgressOverviewProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Calculate module statistics
  const totalModules = modules.length
  const completedModules = modules.filter((module) => module.completion === 100).length
  const inProgressModules = modules.filter((module) => module.completion > 0 && module.completion < 100).length
  const notStartedModules = modules.filter((module) => module.completion === 0).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Course Progress Overview
          </h2>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {studentName}'s progress in {courseName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <CheckCircle className={`w-4 h-4 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {completedModules} Completed
              </span>
            </div>
          </div>
          <div className="h-6 border-r border-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Circle className={`w-4 h-4 ${isDarkMode ? "text-amber-400" : "text-amber-500"}`} />
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {inProgressModules} In Progress
              </span>
            </div>
          </div>
          <div className="h-6 border-r border-gray-300 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <AlertCircle className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {notStartedModules} Not Started
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Overall Completion</h3>
          <span className={`font-bold ${isDarkMode ? "text-cyan-400" : "text-sky-600"}`}>{overallProgress}%</span>
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

      {/* Modules Progress */}
      <div className="space-y-4">
        <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Module Progress</h3>

        {modules.map((module, index) => (
          <div key={module.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {module.completion === 100 ? (
                  <CheckCircle className={`w-5 h-5 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
                ) : module.completion > 0 ? (
                  <Circle className={`w-5 h-5 ${isDarkMode ? "text-amber-400" : "text-amber-500"}`} />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                )}
                <span className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Module {index + 1}: {module.title}
                </span>
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? "text-cyan-400" : "text-sky-600"}`}>
                {module.completion}%
              </span>
            </div>
            <div className={`w-full h-2 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
              <div
                className={`h-2 rounded-full ${
                  module.completion === 100
                    ? isDarkMode
                      ? "bg-green-500"
                      : "bg-green-600"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600"
                }`}
                style={{ width: `${module.completion}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
