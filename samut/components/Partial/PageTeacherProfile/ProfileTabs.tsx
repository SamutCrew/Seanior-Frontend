"use client"

import { motion } from "framer-motion"
import { FaUser, FaCertificate, FaStar, FaCalendarAlt, FaEnvelope, FaBook } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"

interface ProfileTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const tabs = [
    { id: "about", label: "About", icon: <FaUser /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "testimonials", label: "Testimonials", icon: <FaStar /> },
    { id: "schedule", label: "Schedule", icon: <FaCalendarAlt /> },

  ]

  return (
    <div className="flex overflow-x-auto scrollbar-hide">
      <div
        className={`flex rounded-xl shadow-sm p-1 w-full ${
          isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? isDarkMode
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                  : isDarkMode
                    ? "text-gray-300 hover:bg-slate-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Animated indicator for active tab on mobile */}
      <div className="sm:hidden mt-1 flex justify-center">
        <motion.div
          className={`font-medium ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={activeTab}
        >
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </motion.div>
      </div>
    </div>
  )
}
