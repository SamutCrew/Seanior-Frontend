"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { FaStar, FaMapMarkerAlt, FaSwimmer, FaAward, FaCalendarCheck } from "react-icons/fa"
import type { Teacher } from "@/types/teacher"
import { Button } from "@/components/Common/Button"

interface ProfileHeaderProps {
  teacher: Teacher
}

export default function ProfileHeader({ teacher }: ProfileHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
      {/* Background water pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image src="/cerulean-flow.png" alt="Water pattern" fill className="object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{teacher.name}</h1>
            <p className="text-xl text-blue-100 mb-4">{teacher.specialty}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaMapMarkerAlt />
                <span>{teacher.location.address}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaSwimmer />
                <span>{teacher.experience} years experience</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaAward />
                <span>{teacher.certifications.length} certifications</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <FaCalendarCheck />
                <span>{teacher.lessonType}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {teacher.styles.map((style, index) => (
                <span key={index} className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm">
                  {style}
                </span>
              ))}
              {teacher.levels.map((level, index) => (
                <span key={index} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm">
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
            <Button variant="secondary" className="whitespace-nowrap px-6 py-3 text-lg font-semibold">
              Book a Lesson
            </Button>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm text-blue-100">Starting from</p>
              <p className="text-2xl font-bold">${teacher.price}/hr</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
