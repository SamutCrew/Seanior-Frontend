"use client"

import type React from "react"
import { motion } from "framer-motion"

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
  description?: string
}

export const SectionTitle = ({ children, className = "", description }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`text-center mb-8 ${className}`}
    >
      <div className="flex items-center w-full">
        {/* Left Line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex-grow h-[3px] bg-gray-400 dark:bg-gray-600"
        ></motion.div>

        {/* Title */}
        <div className="px-6 mx-4 text-3xl font-bold whitespace-nowrap bg-white dark:bg-gray-900">{children}</div>

        {/* Right Line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex-grow h-[3px] bg-gray-400 dark:bg-gray-600"
        ></motion.div>
      </div>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-2 text-lg text-gray-600 dark:text-gray-400"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
