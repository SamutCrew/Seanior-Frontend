"use client"

import { motion } from "framer-motion"

interface ScrollDownButtonProps {
  targetId: string
  isDarkMode?: boolean
}

const ScrollDownButton = ({ targetId, isDarkMode = false }: ScrollDownButtonProps) => {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center justify-center ${
        isDarkMode ? "text-blue-300" : "text-white"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      whileHover={{ scale: 1.1 }}
    >
      <span className="text-sm font-medium mb-2">Scroll Down</span>
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
        className={`w-8 h-8 rounded-full ${
          isDarkMode ? "bg-blue-600/30" : "bg-white/30"
        } flex items-center justify-center backdrop-blur-sm`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </motion.button>
  )
}

export default ScrollDownButton
