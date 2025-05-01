"use client"

import { FaStar, FaMapMarkerAlt } from "react-icons/fa"
import Image from "next/image"
import { motion } from "framer-motion"
import { Location, TeacherDescription, Teacher, TeacherCardProps } from "@/types";

export const TeacherCard = ({ teacher, userLocation, isDarkMode = false }: TeacherCardProps) => {
  console.log("TeacherCard", teacher, userLocation, isDarkMode)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const deg2rad = (deg: number) => deg * (Math.PI / 180)

  const teacherLocation = teacher.description?.location
  const distance = userLocation && teacherLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, teacherLocation.lat, teacherLocation.lng)
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
      {/* Teacher Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={teacher.profile_img || "/placeholder.svg?height=400&width=600&query=swimming instructor"}
          alt={teacher.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode ? "from-slate-900/80 to-transparent" : "from-black/30 to-transparent"
          }`}
        ></div>

        {/* Experience Badge */}
        {teacher.description?.experience !== undefined && (
          <div
            className={`absolute bottom-4 left-4 ${
              isDarkMode ? "bg-cyan-600" : "bg-blue-600"
            } text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md`}
          >
            {teacher.description.experience}+ years
          </div>
        )}

        {/* Certification Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {teacher.description?.certification?.slice(0, 2).map((cert, index) => (
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
            <h3 className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-gray-800"}`}>{teacher.name}</h3>
            <p className={isDarkMode ? "text-cyan-400 font-medium" : "text-blue-600 font-medium"}>
              {teacher.description?.specialty || "No specialty provided"}
            </p>
          </div>
          {teacher.description?.rating !== undefined && (
            <div
              className={`flex items-center ${isDarkMode ? "bg-slate-700/50" : "bg-yellow-50"} px-2 py-1 rounded-full`}
            >
              <FaStar className="text-yellow-400 mr-1" />
              <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                {teacher.description.rating}
              </span>
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center text-sm">
          <FaMapMarkerAlt className={isDarkMode ? "text-cyan-500 mr-2" : "text-red-500 mr-2"} />
          <div>
            <p className={`font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              {teacherLocation?.address || "Location not specified"}
            </p>
            {distance !== null && (
              <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-gray-500"}>
                {Math.round(distance)} km away from you
              </p>
            )}
          </div>
        </div>

        <p className={`mb-6 line-clamp-3 flex-grow ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          Passionate swimming instructor with a focus on technique and confidence.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {teacher.description?.styles?.map((style, index) => (
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