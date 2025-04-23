"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Droplets, Users, Award, ChevronRight } from "lucide-react"
import { useAppSelector } from "@/app/redux"

interface FunctionCard {
  title: string
  shortDescription: string
  image: string
  link: string
  icon: React.ReactNode
}

const cards: FunctionCard[] = [
  {
    title: "Find a Swimming Coach",
    shortDescription: "Connect with certified instructors",
    image: "/Feature1.jpg",
    link: "/find-coach",
    icon: <Award className="w-5 h-5" />,
  },
  {
    title: "Private Lessons",
    shortDescription: "1-on-1 personalized training",
    image: "/Feature2.jpg",
    link: "/private-lessons",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    title: "Group Classes",
    shortDescription: "Learn in a fun group setting",
    image: "/Feature3.jpg",
    link: "/group-classes",
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: "Competitive Training",
    shortDescription: "Advanced programs for athletes",
    image: "/Feature4.jpg",
    link: "/competitive-training",
    icon: <Award className="w-5 h-5 rotate-12" />,
  },
]

const stats = [
  {
    value: 1200,
    label: "Lessons Completed",
    color: "from-cyan-500 to-blue-600",
    darkColor: "from-cyan-400 to-blue-500",
  },
  {
    value: 50,
    label: "Certified Coaches",
    color: "from-blue-500 to-indigo-600",
    darkColor: "from-blue-400 to-indigo-500",
  },
  {
    value: 800,
    label: "Happy Swimmers",
    color: "from-indigo-500 to-purple-600",
    darkColor: "from-indigo-400 to-purple-500",
  },
  {
    value: 15,
    label: "Training Locations",
    color: "from-purple-500 to-pink-600",
    darkColor: "from-purple-400 to-pink-500",
  },
]

interface AnimatedNumberProps {
  value: number
  duration?: number
  color: string
  darkColor: string
}

export const AnimatedNumber = ({ value, duration = 2000, color, darkColor }: AnimatedNumberProps) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrameId: number

    const startAnimation = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      setCount(Math.floor(percentage * value))

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(startAnimation)
      }
    }

    animationFrameId = requestAnimationFrame(startAnimation)

    return () => cancelAnimationFrame(animationFrameId)
  }, [value, duration, isInView])

  return (
    <div
      ref={ref}
      className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${isDarkMode ? darkColor : color} bg-clip-text text-transparent mb-1`}
    >
      {count}+
    </div>
  )
}

export const FunctionCards = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div
      id="features"
      className={`relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-32 overflow-hidden ${
        isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
      } transition-all duration-1000`}
    >
      {/* Animated background elements - reduce complexity on mobile */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className={`absolute top-20 left-10 w-40 sm:w-64 h-40 sm:h-64 rounded-full ${
            isDarkMode ? "bg-blue-900/20" : "bg-blue-200/20"
          } blur-3xl`}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute bottom-20 right-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full ${
            isDarkMode ? "bg-cyan-900/20" : "bg-cyan-200/20"
          } blur-3xl`}
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Additional decorative elements - hide on small screens */}
        <svg
          className={`absolute top-1/4 right-1/4 w-40 sm:w-64 h-40 sm:h-64 ${
            isDarkMode ? "text-blue-900" : "text-blue-100"
          } opacity-20 hidden sm:block`}
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.4,81.4,26.8,73.6,38.2C65.8,49.5,55.9,58.9,44.2,64.2C32.4,69.5,18.8,70.8,4.7,74.1C-9.3,77.4,-23.8,82.7,-35.3,79.1C-46.9,75.5,-55.5,63,-63.3,50.4C-71.1,37.8,-78.1,25.1,-81.7,11.2C-85.3,-2.8,-85.5,-17.9,-80.5,-30.8C-75.4,-43.7,-65.2,-54.3,-52.8,-62.4C-40.3,-70.6,-25.7,-76.2,-10.8,-77.9C4.1,-79.6,30.5,-83.5,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      {/* Stats Section with enhanced animations and design */}
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-7xl mx-auto mb-10 sm:mb-16 md:mb-20 lg:mb-24 pt-6 sm:pt-8 md:pt-12 lg:pt-16 transition-all duration-700"
      >
        <motion.h2
          variants={itemVariants}
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} px-4`}
        >
          Our <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Impact</span>{" "}
          in Numbers
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8 sm:mb-16 rounded-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: [-8, -4][+(window.innerWidth < 640)], // Smaller hover lift on mobile
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className={`${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
              } p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border text-center transition-all duration-300 relative overflow-hidden group`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-${isDarkMode ? "10" : "5"} transition-opacity duration-500 -z-10`}
              />
              <AnimatedNumber value={stat.value} color={stat.color} darkColor={stat.darkColor} />
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm md:text-base font-medium`}>
                {stat.label}
              </p>

              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-10 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
          What We Offer
        </h2>

        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4">
          <motion.div
            className="w-8 sm:w-12 h-[3px] bg-gradient-to-r from-blue-600 to-cyan-500"
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
          <span className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} px-2`}>
            Discover our swimming services
          </span>
          <motion.div
            className="w-8 sm:w-12 h-[3px] bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            onHoverStart={() => setHoveredCard(index)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Link href={card.link} className="group block">
              <motion.div
                className={`relative h-[280px] sm:h-[320px] md:h-[350px] rounded-2xl overflow-hidden transition-all duration-500 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
                } border`}
                whileHover={{
                  y: [-10, -5][+(window.innerWidth < 640)], // Smaller hover lift on mobile
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Card top section with image */}
                <div className="h-[150px] sm:h-[180px] md:h-[200px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  <Image
                    src={card.image || "/placeholder.svg?height=400&width=600&query=swimming feature"}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Floating badge */}
                  <div
                    className={`absolute top-3 sm:top-4 left-3 sm:left-4 ${
                      isDarkMode ? "bg-gray-800/90 text-blue-400" : "bg-white/90 text-blue-600"
                    } backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-semibold z-20 flex items-center gap-1 sm:gap-1.5 shadow-sm`}
                  >
                    {card.icon}
                    <span>Featured</span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-4 sm:p-6 relative">
                  <h3
                    className={`text-lg sm:text-xl font-bold ${
                      isDarkMode ? "text-white group-hover:text-blue-400" : "text-gray-900 group-hover:text-blue-600"
                    } mb-1 sm:mb-2 transition-colors duration-300`}
                  >
                    {card.title}
                  </h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-xs sm:text-sm mb-3 sm:mb-4`}>
                    {card.shortDescription}
                  </p>

                  {/* Action button */}
                  <div
                    className={`flex items-center ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    } font-medium text-xs sm:text-sm`}
                  >
                    <span>Learn more</span>
                    <motion.div animate={{ x: hoveredCard === index ? 5 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </motion.div>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                    className={`absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tl ${
                      isDarkMode ? "from-blue-900" : "from-blue-100"
                    } to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>

                {/* Animated highlight line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: hoveredCard === index ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
