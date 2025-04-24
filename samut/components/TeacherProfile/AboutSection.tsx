"use client"

import { motion } from "framer-motion"
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"
import type { Teacher } from "@/types/teacher"
import { useAppSelector } from "@/app/redux"

interface AboutSectionProps {
  teacher: Teacher
}

export default function AboutSection({ teacher }: AboutSectionProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>About Me</h2>
        <div className={`prose max-w-none ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <p>{teacher.bio}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Teaching Philosophy
        </h2>
        <div className={`rounded-xl p-6 relative ${isDarkMode ? "bg-slate-700/50" : "bg-blue-50"}`}>
          <FaQuoteLeft className={`absolute top-4 left-4 text-xl ${isDarkMode ? "text-blue-400" : "text-blue-200"}`} />
          <p className={`italic px-6 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            {teacher.teachingPhilosophy}
          </p>
          <FaQuoteRight
            className={`absolute bottom-4 right-4 text-xl ${isDarkMode ? "text-blue-400" : "text-blue-200"}`}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Specializations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teacher.specializations.map((specialization, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                isDarkMode ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700" : "bg-white border-gray-200"
              }`}
            >
              <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {specialization.title}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {specialization.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
