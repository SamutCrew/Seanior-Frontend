"use client"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { TeacherCard, type Teacher } from "../TeachersManage/TeacherCard"

interface TeachersSectionProps {
  teachers?: Teacher[]
}

export const TeachersSection = ({ teachers = [] }: TeachersSectionProps) => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  // Default teachers if none provided
  const defaultTeachers = [
    {
      id: 1,
      name: "Michael Phelps",
      specialty: "Competitive Swimming",
      styles: ["Freestyle", "Butterfly"],
      levels: ["Intermediate", "Advanced"],
      certification: ["ASCA", "RedCross"],
      rating: 4.9,
      experience: 15,
      image: "/teacher1.jpg",
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
      image: "/teacher2.jpg",
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
      image: "/teacher3.jpg",
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
      image: "/teacher4.jpg",
      bio: "Olympic gold medalist focusing on sprint techniques and fundamentals",
      lessonType: "Private",
      price: 85,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
  ]

  const displayTeachers = teachers.length > 0 ? teachers : defaultTeachers

  return (
    <section ref={sectionRef} className="py-24 px-4 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100/30 blur-3xl"
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
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-cyan-100/30 blur-3xl"
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

      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="inline-block text-blue-600 font-medium mb-4 tracking-wider"
        >
          EXPERT INSTRUCTORS
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Meet Our <span className="text-blue-600">Swimming Experts</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
          <p className="text-gray-600 max-w-2xl">
            Learn from industry professionals with years of teaching experience and real-world expertise.
          </p>
          <div className="w-16 h-1 bg-gray-300 mx-4"></div>
        </motion.div>

        {/* Teacher Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {displayTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            >
              <TeacherCard teacher={teacher} />
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
            href="/teachers"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Browse All Instructors
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default TeachersSection
