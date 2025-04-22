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
}

export const TeacherCard = ({ teacher, userLocation }: TeacherCardProps) => {
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
    >
      {/* Teacher Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={teacher.image || "/placeholder.svg?height=400&width=600&query=swimming instructor"}
          alt={teacher.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Experience Badge */}
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {teacher.experience}+ years
        </div>

        {/* Certification Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {teacher.certification.slice(0, 2).map((cert, index) => (
            <span
              key={index}
              className="bg-white/80 backdrop-blur-sm text-blue-800 text-xs px-2 py-1 rounded-md font-medium"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-gray-800">{teacher.name}</h3>
            <p className="text-blue-600 font-medium">{teacher.specialty}</p>
          </div>
          {/* Rating */}
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-700">{teacher.rating}</span>
          </div>
        </div>

        {/* Location Information */}
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <div>
            <p className="font-medium">{teacher.location.address || "Location not specified"}</p>
            {distance !== null && <p className="text-xs text-gray-500">{Math.round(distance)} km away from you</p>}
          </div>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">{teacher.bio}</p>

        {/* Styles Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {teacher.styles.map((style, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
              {style}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
