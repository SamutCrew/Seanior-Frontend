"use client"

import { FaStar, FaMapMarkerAlt } from "react-icons/fa"
import Image from "next/image"
import { motion } from "framer-motion"

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface Teacher {
  id: number
  name: string
  specialty: string
  styles: string[]
  levels: string[]
  certification: string[]
  rating: number
  experience: number
  image: string
  bio: string
  lessonType: string
  price: number
  location: Location
}

interface TeacherCardProps {
  teacher: Teacher
  userLocation?: Location | null
  isDarkMode?: boolean
}

export const TeacherCard = ({ teacher, userLocation, isDarkMode = false }: TeacherCardProps) => {
  // Calculate distance if user location is provided
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  const deg2rad = (deg: number) => deg * (Math.PI / 180)

  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, teacher.location.lat, teacher.location.lng)
    : null

  return (
    <motion.div
      whileHover={{ y: typeof window !== "undefined" && window.innerWidth < 640 ? -4 : -8 }}
      transition={{ duration: 0.5 }}
      className={`${
        isDarkMode
          ? "bg-slate-800 border border-slate-700 hover:shadow-xl hover:shadow-slate-900/30"
          : "bg-white hover:shadow-xl"
      } rounded-xl shadow-lg overflow-hidden transition-all duration-300 group h-full flex flex-col`}
    >
      {/* Teacher Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <Image
          src={teacher.image || "/placeholder.svg?height=400&width=600&query=swimming instructor"}
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
        <div
          className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 ${
            isDarkMode ? "bg-cyan-600" : "bg-blue-600"
          } text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md`}
        >
          {teacher.experience}+ years
        </div>

        {/* Certification Badges */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-1 sm:gap-2">
          {teacher.certification.slice(0, 2).map((cert, index) => (
            <span
              key={index}
              className={`${
                isDarkMode ? "bg-slate-800/80 text-cyan-400 border border-slate-700/50" : "bg-white/80 text-blue-800"
              } backdrop-blur-sm text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-medium shadow-sm`}
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className={`p-4 sm:p-5 md:p-6 flex flex-col flex-grow ${isDarkMode ? "border-t border-slate-700" : ""}`}>
        <div className="flex items-start mb-4">
          <div className="flex-1">
            <h3 className={`font-bold text-lg sm:text-xl ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {teacher.name}
            </h3>
            <p className={isDarkMode ? "text-cyan-400 font-medium" : "text-blue-600 font-medium"}>
              {teacher.specialty}
            </p>
          </div>
          {/* Rating */}
          <div
            className={`flex items-center ${isDarkMode ? "bg-slate-700/50" : "bg-yellow-50"} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm`}
          >
            <FaStar className="text-yellow-400 mr-1" />
            <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-700"}`}>{teacher.rating}</span>
          </div>
        </div>

        {/* Location Information */}
        <div className="mb-3 sm:mb-4 flex items-center text-xs sm:text-sm">
          <FaMapMarkerAlt className={isDarkMode ? "text-cyan-500 mr-2" : "text-red-500 mr-2"} />
          <div>
            <p className={`font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
              {teacher.location.address || "Location not specified"}
            </p>
            {distance !== null && (
              <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-gray-500"}>
                {Math.round(distance)} km away from you
              </p>
            )}
          </div>
        </div>

        <p
          className={`mb-4 sm:mb-6 line-clamp-3 flex-grow text-xs sm:text-sm ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}
        >
          {teacher.bio}
        </p>

        {/* Styles Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {teacher.styles.map((style, index) => (
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
            className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base ${
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
