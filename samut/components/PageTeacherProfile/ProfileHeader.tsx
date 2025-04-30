"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FaStar, FaMapMarkerAlt, FaSwimmer, FaAward, FaCalendarCheck, FaEdit } from "react-icons/fa"
import type { Teacher } from "@/types/teacher"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"
import Link from "next/link"

interface ProfileHeaderProps {
  teacher: Teacher
}

export default function ProfileHeader({ teacher }: ProfileHeaderProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div
      className={`relative ${
        isDarkMode
          ? "bg-gradient-to-r from-blue-900 to-cyan-900 text-white"
          : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
      }`}
    >
      {/* Background water pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image src="/cerulean-flow.png" alt="Water pattern" fill className="object-cover" />
      </div>

      {/* Animated water ripples */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 100 + i * 30,
              height: 100 + i * 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 2, 3],
              opacity: [0.3, 0.2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={teacher.profileImage || "/placeholder.svg?height=200&width=200&query=swimming instructor portrait"}
                alt={teacher.name}
                width={200}
                height={200}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-blue-900 rounded-full p-2 shadow-lg">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-600" />
                <span className="font-bold">{teacher.rating.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{teacher.name}</h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-4">{teacher.specialty}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaMapMarkerAlt className="text-sm" />
                <span className="text-sm">{teacher.location.address}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaSwimmer className="text-sm" />
                <span className="text-sm">{teacher.experience} years experience</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaAward className="text-sm" />
                <span className="text-sm">{teacher.certifications.length} certifications</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaCalendarCheck className="text-sm" />
                <span className="text-sm">{teacher.lessonType}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <FaMapMarkerAlt className="text-xs" />
                <span className="text-xs">{teacher.location.address}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <FaSwimmer className="text-xs" />
                <span className="text-xs">{teacher.experience} years experience</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <FaAward className="text-xs" />
                <span className="text-xs">{teacher.certifications.length} certifications</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <FaCalendarCheck className="text-xs" />
                <span className="text-xs">{teacher.lessonType}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {teacher.styles.map((style, index) => (
                <span key={index} className="bg-blue-700/70 text-white px-2 py-0.5 text-xs rounded-full">
                  {style}
                </span>
              ))}
              {teacher.levels.map((level, index) => (
                <span key={index} className="bg-cyan-700/70 text-white px-2 py-0.5 text-xs rounded-full">
                  {level}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col items-center">
              <Button variant="secondary" className="whitespace-nowrap px-6 py-3 text-lg font-semibold w-full">
                Book a Lesson
              </Button>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-2 w-full">
                <p className="text-sm text-blue-100">Starting from</p>
                <p className="text-2xl font-bold">${teacher.price}/hr</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Profile Button - Bottom Right */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8">
          <Link href={`/teacher/${teacher.id}/edit`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
            >
              <FaEdit className="text-blue-600" />
              <span>Edit Profile</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  )
}
