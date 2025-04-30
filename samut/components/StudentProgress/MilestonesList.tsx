"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock } from 'lucide-react'
import { useAppSelector } from "@/app/redux"

export interface Milestone {
  name: string
  completed: boolean
  date: string
}

interface MilestonesListProps {
  milestones: Milestone[]
  isStudentView?: boolean
}

export default function MilestonesList({ milestones, isStudentView = false }: MilestonesListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        {isStudentView ? "Your Milestones" : "Milestones"}
      </h3>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`flex items-center p-3 rounded-lg ${
              isDarkMode
                ? milestone.completed
                  ? "bg-green-900/20"
                  : "bg-slate-700"
                : milestone.completed
                  ? "bg-green-50"
                  : "bg-gray-50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                milestone.completed
                  ? isDarkMode
                    ? "bg-green-500 text-white"
                    : "bg-green-500 text-white"
                  : isDarkMode
                    ? "bg-slate-600 text-gray-300"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {milestone.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className="flex-grow">
              <div
                className={`font-medium ${
                  milestone.completed
                    ? isDarkMode
                      ? "text-green-300"
                      : "text-green-700"
                    : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                }`}
              >
                {milestone.name}
              </div>
              <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {milestone.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
