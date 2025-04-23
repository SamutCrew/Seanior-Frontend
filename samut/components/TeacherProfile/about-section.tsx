"use client"

import { motion } from "framer-motion"
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa"
import type { Teacher } from "@/types/teacher"

interface AboutSectionProps {
  teacher: Teacher
}

export default function AboutSection({ teacher }: AboutSectionProps) {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
        <div className="prose max-w-none text-gray-600">
          <p>{teacher.bio}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Teaching Philosophy</h2>
        <div className="bg-blue-50 rounded-xl p-6 relative">
          <FaQuoteLeft className="absolute top-4 left-4 text-blue-200 text-xl" />
          <p className="text-gray-700 italic px-6">{teacher.teachingPhilosophy}</p>
          <FaQuoteRight className="absolute bottom-4 right-4 text-blue-200 text-xl" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Specializations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teacher.specializations.map((specialization, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{specialization.title}</h3>
              <p className="text-gray-600 text-sm">{specialization.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
