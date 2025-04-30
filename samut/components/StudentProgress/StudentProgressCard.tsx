"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"

interface StudentProgressCardProps {
  studentName: string
  studentImage: string
  studentId: string
  attendance: number
  progress: number
  onViewFullProfile?: () => void
}

export default function StudentProgressCard({
  studentName,
  studentImage,
  studentId,
  attendance,
  progress,
  onViewFullProfile
}: StudentProgressCardProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`col-span-1 ${
        isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"
      } rounded-lg shadow-sm overflow-hidden`}
    >
      <div className="relative h-40">
        <Image src="/swimming-pool-water.png" alt="Background" fill className="object-cover" />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode ? "from-slate-900 to-transparent" : "from-black/60 to-transparent"
          }`}
        ></div>

        {/* Student Image - Prominently displayed */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
            <Image
              src={studentImage || "/placeholder.svg"}
              alt={studentName}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-16 pb-6 px-6 text-center">
        {/* Student Name - Made Outstanding */}
        <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>
          {studentName}
        </h3>
        <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Student ID: #{studentId}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}>
            <div className="text-sm text-gray-500">Attendance</div>
            <div className="text-lg font-bold">{attendance}%</div>
          </div>
          <div className={`p-3 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-gray-50"}`}>
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-lg font-bold">{progress}%</div>
          </div>
        </div>

        {onViewFullProfile && (
          <Button variant={isDarkMode ? "gradient" : "primary"} className="w-full" size="sm" onClick={onViewFullProfile}>
            View Full Profile
          </Button>
        )}
      </div>
    </motion.div>
  )
}
