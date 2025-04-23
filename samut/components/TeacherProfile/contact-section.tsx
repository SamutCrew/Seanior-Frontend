"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaPaperPlane } from "react-icons/fa"
import type { Teacher } from "@/types/teacher"
import { Button } from "@/components/Common/Button"

interface ContactSectionProps {
  teacher: Teacher
}

export default function ContactSection({ teacher }: ContactSectionProps) {
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the message to the backend
    console.log({ name, email, subject, message })
    setSubmitted(true)
    // Reset form
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")

    // Reset submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaEnvelope className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800">{teacher.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaPhone className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-800">{teacher.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaMapMarkerAlt className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-gray-800">{teacher.location.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaCalendarAlt className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Preferred Contact Hours</p>
            <p className="text-gray-800">{teacher.contactHours}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Send a Message</h3>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-800 p-4 rounded-lg"
          >
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm mt-1">We'll forward your message to {teacher.name}.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <Button type="submit" className="w-full flex items-center justify-center gap-2">
              <FaPaperPlane /> Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
