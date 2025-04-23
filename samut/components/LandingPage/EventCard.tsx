"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { useAppSelector } from "@/app/redux"

type Event = {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  imageUrl: string
}

interface EventCardProps {
  event: Event
  index: number
}

const EventCard = ({ event, index }: EventCardProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.15,
          },
        },
      }}
      className={`${
        isDarkMode
          ? "bg-slate-800/70 hover:bg-slate-800 border border-slate-700"
          : "bg-white hover:bg-gray-50 border border-gray-100"
      } rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isDarkMode ? "shadow-md shadow-black/10" : "shadow-md"
      } group h-full`}
    >
      <motion.div
        className="relative h-36 sm:h-48 w-full overflow-hidden"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4 }}
      >
        <Image
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-t from-slate-900/80 to-transparent"
              : "bg-gradient-to-t from-black/60 to-transparent"
          }`}
        />
        <motion.div
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 ${
            isDarkMode ? "bg-cyan-600" : "bg-cyan-600"
          } text-white text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md`}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
        >
          {event.category}
        </motion.div>
      </motion.div>

      <div className="p-3 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <motion.div
            className={`flex items-center ${
              isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-gray-100 text-gray-600"
            } px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
          >
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
            <span className="text-[10px] sm:text-xs">{event.date}</span>
          </motion.div>
          <motion.div
            className={`flex items-center ${
              isDarkMode ? "bg-slate-700/50 text-slate-300" : "bg-gray-100 text-gray-600"
            } px-2.5 py-1 rounded-full text-xs`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          >
            <Clock className="w-3 h-3 mr-1.5" />
            <span>{event.time}</span>
          </motion.div>
        </div>

        <motion.h3
          className={`text-base sm:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-1 sm:mb-2 leading-tight`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
        >
          {event.title}
        </motion.h3>

        <motion.p
          className={`${isDarkMode ? "text-slate-300" : "text-gray-600"} mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
        >
          {event.description}
        </motion.p>

        <motion.div
          className={`flex justify-between items-center pt-2 sm:pt-3 ${
            isDarkMode ? "border-t border-slate-700" : "border-t border-gray-100"
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
        >
          <div className="flex items-center text-[10px] sm:text-xs">
            <MapPin
              className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}
            />
            <span className={isDarkMode ? "text-slate-400" : "text-gray-600"}>{event.location}</span>
          </div>
          <motion.button
            className={`flex items-center ${
              isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-700"
            } font-medium text-[10px] sm:text-xs transition-colors duration-300 group`}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <span>Register</span>
            <ArrowRight className="ml-1 sm:ml-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EventCard
