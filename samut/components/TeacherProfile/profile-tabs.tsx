"use client"

import { motion } from "framer-motion"
import { FaUser, FaCertificate, FaStar, FaCalendarAlt, FaEnvelope } from "react-icons/fa"

interface ProfileTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs = [
    { id: "about", label: "About", icon: <FaUser /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "testimonials", label: "Testimonials", icon: <FaStar /> },
    { id: "schedule", label: "Schedule", icon: <FaCalendarAlt /> },
    { id: "contact", label: "Contact", icon: <FaEnvelope /> },
  ]

  return (
    <div className="flex overflow-x-auto scrollbar-hide">
      <div className="flex bg-white rounded-xl shadow-sm p-1 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 whitespace-nowrap
              ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Animated indicator for active tab on mobile */}
      <div className="sm:hidden mt-1 flex justify-center">
        <motion.div
          className="text-blue-600 font-medium"
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
