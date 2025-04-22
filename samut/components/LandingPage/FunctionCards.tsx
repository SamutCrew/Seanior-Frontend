"use client"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

interface FunctionCard {
  title: string
  shortDescription: string
  image: string
  link: string
}

const cards: FunctionCard[] = [
  {
    title: "Find a Swimming Coach",
    shortDescription: "Connect with certified instructors",
    image: "/Feature1.jpg",
    link: "/find-coach",
  },
  {
    title: "Private Lessons",
    shortDescription: "1-on-1 personalized training",
    image: "/Feature2.jpg",
    link: "/private-lessons",
  },
  {
    title: "Group Classes",
    shortDescription: "Learn in a fun group setting",
    image: "/Feature3.jpg",
    link: "/group-classes",
  },
  {
    title: "Competitive Training",
    shortDescription: "Advanced programs for athletes",
    image: "/Feature4.jpg",
    link: "/competitive-training",
  },
]

const stats = [
  { value: 1200, label: "Lessons Completed" },
  { value: 50, label: "Certified Coaches" },
  { value: 800, label: "Happy Swimmers" },
  { value: 15, label: "Training Locations" },
]

interface AnimatedNumberProps {
  value: number
  duration?: number
}

export const AnimatedNumber = ({ value, duration = 2000 }: AnimatedNumberProps) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
      {count}+
    </div>
  )
}

export const FunctionCards = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

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
    <div id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 xl:px-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-white -z-10"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-cyan-200/20 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Stats Section with enhanced animations */}
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-7xl mx-auto mb-20"
      >
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center mb-16">
          Our <span className="text-blue-600">Impact</span> in Numbers
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300"
            >
              <AnimatedNumber value={stat.value} />
              <p className="text-gray-600 text-sm md:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What We Offer</h2>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              className="w-12 h-[3px] bg-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
            <span className="text-lg text-gray-600">Discover our comprehensive swimming services</span>
            <motion.div
              className="w-12 h-[3px] bg-blue-500"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Link href={card.link} className="group block h-card">
                <motion.div
                  className="relative h-[400px] rounded-2xl shadow-xl overflow-hidden transition-all duration-500"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10" />
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={card.image || "/placeholder.svg?height=400&width=600&query=swimming feature"}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                    <motion.h3
                      className="text-2xl font-bold mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      className="text-white/90 text-base"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {card.shortDescription}
                    </motion.p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
