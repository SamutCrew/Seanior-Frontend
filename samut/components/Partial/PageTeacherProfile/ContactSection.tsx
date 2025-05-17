"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaPaperPlane, FaBook, FaHome, FaSwimmer, FaWarehouse } from "react-icons/fa"
import type { Teacher } from "@/types/instructor"
import type { Course, CourseType } from "@/types/course"
import { Button } from "@/components/Common/Button"
import { useAppSelector } from "@/app/redux"

interface ContactSectionProps {
  teacher: Teacher
  courses?: Course[]
}

export default function ContactSection({ teacher, courses = [] }: ContactSectionProps) {
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const getCourseTypeIcon = (courseType: CourseType) => {
    switch (courseType) {
      case "private-location":
        return <FaHome className={isDarkMode ? "text-purple-400" : "text-purple-600"} />
      case "public-pool":
        return <FaSwimmer className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
      case "teacher-pool":
        return <FaWarehouse className={isDarkMode ? "text-green-400" : "text-green-600"} />
      default:
        return <FaBook className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message to the backend
    console.log({ name, email, subject, selectedCourse, message })
    setSubmitted(true)
    // Reset form
    setName("")
    setEmail("")
    setSubject("")
    setSelectedCourse("")
    setMessage("")

    // Reset submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className={`rounded-xl shadow-sm p-6 ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"}`}>
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Send a Message</h3>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${isDarkMode ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-800"}`}
          >
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm mt-1">We'll forward your message to {teacher.name}.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500"
                    : "border border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500"
                    : "border border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
            </div>

            {courses && courses.length > 0 && (
              <div>
                <label
                  htmlFor="course"
                  className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  <div className="flex items-center gap-2">
                    <FaBook className={isDarkMode ? "text-cyan-400" : "text-blue-600"} />
                    <span>Select Course</span>
                  </div>
                </label>
                <select
                  id="course"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500"
                      : "border border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select a course (optional)</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.title} - ${course.price} -{" "}
                      {course.courseType === "private-location"
                        ? "Private Location"
                        : course.courseType === "public-pool"
                          ? "Public Pool"
                          : "Teacher's Pool"}
                    </option>
                  ))}
                </select>

                {selectedCourse && (
                  <div
                    className="mt-2 p-2 rounded-md text-sm flex items-center gap-2 bg-opacity-20 border border-opacity-30"
                    style={{
                      backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(219, 234, 254, 0.8)",
                      borderColor: isDarkMode ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {getCourseTypeIcon(
                      courses.find((c) => c.id.toString() === selectedCourse)?.courseType || "public-pool",
                    )}
                    <span className={isDarkMode ? "text-blue-300" : "text-blue-700"}>
                      {courses.find((c) => c.id.toString() === selectedCourse)?.courseType === "private-location"
                        ? "Teacher will come to your location"
                        : courses.find((c) => c.id.toString() === selectedCourse)?.courseType === "public-pool"
                          ? "Lessons at a public swimming facility"
                          : "Lessons at the teacher's private pool"}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="subject"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500"
                    : "border border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500"
                    : "border border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
            </div>

            <Button
              type="submit"
              variant={isDarkMode ? "gradient" : "primary"}
              className="w-full flex items-center justify-center gap-2"
            >
              <FaPaperPlane /> Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
