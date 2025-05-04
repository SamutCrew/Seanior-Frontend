"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { InstructorCard } from "../Searchpage/InstructorCard"
import { useAppSelector } from "@/app/redux"
import type { Instructor } from "@/types/instructor"

interface InstructorsSectionProps {
  instructors?: Instructor[]
}

export const InstructorsSection = ({ instructors = [] }: InstructorsSectionProps) => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Default instructors if none provided
  const defaultInstructors = [
    {
      id: 1,
      name: "Michael Phelps",
      specialty: "Competitive Swimming",
      styles: ["Freestyle", "Butterfly"],
      levels: ["Intermediate", "Advanced"],
      certification: ["ASCA", "RedCross"],
      rating: 4.9,
      experience: 15,
      image: "/placeholder.svg?key=xy5k6",
      bio: "Olympic gold medalist specializing in competitive swimming techniques",
      lessonType: "Private",
      price: 80,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
    {
      id: 2,
      name: "Katie Ledecky",
      specialty: "Freestyle Technique",
      styles: ["Freestyle"],
      levels: ["Beginner", "Intermediate", "Advanced"],
      certification: ["USMS", "RedCross"],
      rating: 4.8,
      experience: 12,
      image: "/placeholder.svg?key=n5lb9",
      bio: "World record holder focusing on freestyle technique and endurance",
      lessonType: "Private",
      price: 75,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
    {
      id: 3,
      name: "Ryan Murphy",
      specialty: "Backstroke",
      styles: ["Backstroke", "Freestyle"],
      levels: ["Intermediate", "Advanced"],
      certification: ["ASCA", "RedCross"],
      rating: 4.7,
      experience: 10,
      image: "/placeholder.svg?key=0oxfg",
      bio: "Olympic gold medalist specializing in backstroke techniques",
      lessonType: "Group",
      price: 70,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
    {
      id: 4,
      name: "Simone Manuel",
      specialty: "Sprint Freestyle",
      styles: ["Freestyle", "Butterfly"],
      levels: ["Beginner", "Intermediate"],
      certification: ["ASCA", "RedCross"],
      rating: 4.9,
      experience: 8,
      image: "/placeholder.svg?key=r5yvd",
      bio: "Olympic gold medalist focusing on sprint techniques and fundamentals",
      lessonType: "Private",
      price: 85,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
  ]

  const displayInstructors = instructors.length > 0 ? instructors : defaultInstructors

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-4 relative overflow-hidden ${
        isDarkMode ? "bg-gradient-to-b from-slate-900 to-slate-950" : "bg-gradient-to-b from-blue-50 to-white"
      } transition-colors duration-700`}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Dynamic wave pattern */}
        <svg className="absolute w-full h-full opacity-10" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <motion.path
            d="M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,186.7C672,181,768,203,864,197.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="currentColor"
            className={isDarkMode ? "text-cyan-700" : "text-cyan-300"}
            animate={{
              d: [
                "M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,186.7C672,181,768,203,864,197.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,176C960,192,1056,256,1152,240C1248,224,1344,128,1392,80L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,192L48,202.7C96,213,192,235,288,229.3C384,224,480,192,576,186.7C672,181,768,203,864,197.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 20,
              ease: "easeInOut",
            }}
          />
        </svg>

        {/* Animated gradient blobs */}
        <motion.div
          className={`absolute top-20 left-10 w-64 h-64 rounded-full ${
            isDarkMode ? "bg-cyan-900/20" : "bg-blue-200/30"
          } blur-3xl`}
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
          className={`absolute bottom-20 right-10 w-80 h-80 rounded-full ${
            isDarkMode ? "bg-blue-900/20" : "bg-cyan-200/30"
          } blur-3xl`}
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

        {/* Grid pattern overlay */}
        <div
          className={`absolute inset-0 ${
            isDarkMode ? "bg-grid-dark" : "bg-grid-light"
          } bg-[length:30px_30px] opacity-[0.03]`}
        ></div>

        {/* Water ripple effects */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${isDarkMode ? "bg-cyan-400/10" : "bg-blue-400/10"}`}
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 10,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className={`inline-block ${
              isDarkMode ? "text-cyan-400" : "text-blue-600"
            } font-medium mb-4 tracking-wider text-sm`}
          >
            EXPERT INSTRUCTORS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-4xl md:text-5xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
          >
            Meet Our <span className={isDarkMode ? "text-cyan-400" : "text-blue-600"}>Swimming Experts</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center mb-8"
          >
            <motion.div
              className={`w-16 h-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-300"}`}
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            <p className={`px-6 ${isDarkMode ? "text-slate-300" : "text-gray-600"} max-w-2xl`}>
              Learn from industry professionals with years of teaching experience and real-world expertise.
            </p>
            <motion.div
              className={`w-16 h-0.5 ${isDarkMode ? "bg-slate-700" : "bg-gray-300"}`}
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </motion.div>

          {/* Instructor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
            {displayInstructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              >
                <InstructorCard instructor={instructor} isDarkMode={isDarkMode} />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <Link
              href="/instructors"
              className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              } transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1`}
            >
              Browse All Instructors
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default InstructorsSection
