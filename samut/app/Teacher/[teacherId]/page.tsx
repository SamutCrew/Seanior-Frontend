"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProfileHeader from "@/components/PageTeacherProfile/ProfileHeader"
import ProfileTabs from "@/components/PageTeacherProfile/ProfileTabs"
import AboutSection from "@/components/PageTeacherProfile/AboutSection"
import CertificationsSection from "@/components/PageTeacherProfile/CertificationsSection"
import TestimonialsSection from "@/components/PageTeacherProfile/TestimonialsSection"
import ScheduleSection from "@/components/PageTeacherProfile/ScheduleSection"
import ContactSection from "@/components/PageTeacherProfile/ContactSection"
import CoursesSection from "@/components/PageTeacherProfile/CourseSection"
import { getTeacherById } from "./data/teacher-service"
import type { Teacher } from "@/types/instructor"
import type { Course } from "@/types/course"
import LoadingPage from "@/components/Common/LoadingPage"
import { useAppSelector } from "@/app/redux"
import { motion } from "framer-motion"

// Sample courses data - in a real app, this would come from an API
const sampleCourses: Course[] = [
  {
    id: 1,
    title: "Freestyle Mastery",
    focus: "Perfect your freestyle technique with Olympic-level instruction",
    level: "Intermediate",
    duration: "8 weeks",
    schedule: "Mon/Wed 5-6pm",
    instructor: "Michael Phelps",
    rating: 4.8,
    students: 24,
    price: 299,
    location: {
      address: "Aquatic Center, Los Angeles, CA",
    },
    courseType: "public-pool",
  },
  {
    id: 2,
    title: "Beginner Swimming",
    focus: "Learn the fundamentals of swimming in a supportive environment",
    level: "Beginner",
    duration: "6 weeks",
    schedule: "Tue/Thu 4-5pm",
    instructor: "Michael Phelps",
    rating: 4.9,
    students: 18,
    price: 249,
    location: {
      address: "Aquatic Center, Los Angeles, CA",
    },
    courseType: "teacher-pool",
  },
  {
    id: 3,
    title: "Competition Prep",
    focus: "Advanced training for competitive swimmers",
    level: "Advanced",
    duration: "10 weeks",
    schedule: "Mon/Wed/Fri 7-8:30pm",
    instructor: "Michael Phelps",
    rating: 4.7,
    students: 12,
    price: 399,
    location: {
      address: "Olympic Training Pool, Los Angeles, CA",
    },
    courseType: "private-location",
  },
]

export default function TeacherProfilePage() {
  const { id } = useParams()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // In a real app, this would be an API call
        const teacherData = await getTeacherById(id as string)
        setTeacher(teacherData)
      } catch (error) {
        console.error("Failed to fetch teacher data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacher()
  }, [id])

  if (loading) {
    return <LoadingPage />
  }

  if (!teacher) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900 text-white" : "bg-blue-50 text-gray-800"}`}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Teacher Not Found</h1>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            The teacher profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "about":
        return <AboutSection teacher={teacher} />
      case "courses":
        return <CoursesSection courses={sampleCourses} />
      case "certifications":
        return <CertificationsSection certifications={teacher.certifications} />
      case "testimonials":
        return <TestimonialsSection testimonials={teacher.testimonials} />
      case "schedule":
        return <ScheduleSection availability={teacher.availability} />
      case "contact":
        return <ContactSection teacher={teacher} courses={sampleCourses} />
      default:
        return <AboutSection teacher={teacher} />
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-b from-blue-50 via-white to-white text-gray-900"
      }`}
    >
      <ProfileHeader teacher={teacher} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div
              className={`rounded-xl shadow-sm p-4 sm:p-6 mt-4 ${
                isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
              }`}
            >
              {renderActiveTab()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <ContactSection teacher={teacher} courses={sampleCourses} />
            <ScheduleSection availability={teacher.availability} compact />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
