"use client"

import { FaMapMarkerAlt } from "react-icons/fa"
import { motion } from "framer-motion"
import type { InstructorCardProps } from "@/types"

export const InstructorCard = ({ instructor, userLocation, isDarkMode = false }: InstructorCardProps) => {
  console.log("RENDERING INSTRUCTOR CARD:", {
    id: instructor.id,
    name: instructor.name,
    hasProfileImg: !!instructor.profile_img,
    hasDescription: !!instructor.description,
    hasLocation: instructor.description?.location ? true : false,
  })

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const deg2rad = (deg: number) => deg * (Math.PI / 180)

  const instructorLocation = instructor.description?.location
  const distance =
    userLocation && instructorLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, instructorLocation.lat, instructorLocation.lng)
      : null

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
      className={`${
        isDarkMode
          ? "bg-slate-800 border border-slate-700 hover:shadow-xl hover:shadow-slate-900/30"
          : "bg-white hover:shadow-xl"
      } rounded-xl shadow-lg overflow-hidden transition-all duration-300 group h-full flex flex-col`}
    >
      {/* instructor Image */}
      <div className="relative h-64 overflow-hidden">
        {/* Use regular img tag instead of Image component to avoid potential issues */}
        <img
          src={instructor.profile_img || "/placeholder.svg?height=400&width=600&query=swimming instructor"}
          alt={instructor.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode ? "from-slate-900/80 to-transparent" : "from-black/30 to-transparent"
          }`}
        ></div>

        {/* Experience Badge */}
        {instructor.description?.experience !== undefined && (
          <div
            className={`absolute bottom-4 left-4 ${
              isDarkMode ? "bg-cyan-600" : "bg-blue-600"
            } text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md`}
          >
            {instructor.description.experience}+ years
          </div>
        )}

        {/* Certification Badges - Moved to top left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {instructor.description?.certification?.slice(0, 2).map((cert, index) => (
            <span
              key={index}
              className={`${
                isDarkMode ? "bg-slate-800/80 text-cyan-400 border border-slate-700/50" : "bg-white/80 text-blue-800"
              } backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium shadow-sm`}
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className={`p-6 flex flex-col flex-grow ${isDarkMode ? "border-t border-slate-700" : ""}`}>
        <div className="flex items-start mb-4">
          <div className="flex-1">
            <h3 className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-gray-800"}`}>{instructor.name}</h3>
            <p className={isDarkMode ? "text-cyan-400 font-medium" : "text-blue-600 font-medium"}>
              {instructor.description?.specialty || "No specialty provided"}
            </p>
          </div>
        </div>

        <div className="mb-4 flex items-center text-sm">
          <FaMapMarkerAlt className={isDarkMode ? "text-cyan-500 mr-2" : "text-red-500 mr-2"} />
          <div>
            <p className={`font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              {instructorLocation?.address || "Location not specified"}
            </p>
            {distance !== null && (
              <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-gray-500"}>
                {Math.round(distance)} km away from you
              </p>
            )}
          </div>
        </div>

        <p className={`mb-6 line-clamp-3 flex-grow ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          {instructor.description?.bio || "Passionate swimming instructor with a focus on technique and confidence."}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {instructor.description?.styles?.map((style, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode ? "bg-slate-700 text-cyan-300 border border-slate-600" : "bg-blue-50 text-blue-700"
              }`}
            >
              {style}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            }`}
          >
            View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
