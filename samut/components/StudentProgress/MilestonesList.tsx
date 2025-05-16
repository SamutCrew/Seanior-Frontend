"use client"

import { CheckCircle, Clock } from "lucide-react"
import { useAppSelector } from "@/app/redux"

export interface Milestone {
  name: string
  completed: boolean
  date: string
}

interface MilestonesListProps {
  milestones: Milestone[]
}

export default function MilestonesList({ milestones }: MilestonesListProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800/80" : "bg-white"} shadow-sm`}>
      <h3 className="text-lg font-bold mb-4 text-white">Milestones</h3>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No milestones have been set for this course.</p>
        ) : (
          milestones.map((milestone, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg ${milestone.completed ? "bg-green-900/20" : "bg-slate-700"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  milestone.completed ? "bg-green-500 text-white" : "bg-slate-600 text-gray-300"
                }`}
              >
                {milestone.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </div>
              <div className="flex-grow">
                <div className={`font-medium ${milestone.completed ? "text-green-300" : "text-gray-200"}`}>
                  {milestone.name}
                </div>
                <div className="text-xs text-gray-400">{milestone.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
