"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import type { Testimonial } from "@/types/instructor"
import { useAppSelector } from "@/app/redux"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  if (!testimonials.length) {
    return (
      <div className="text-center py-12">
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>No testimonials yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Student Testimonials</h2>

      <div className="relative">
        {/* Featured testimonial */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-6 md:p-8 relative ${
            isDarkMode ? "bg-gradient-to-br from-slate-700 to-slate-800" : "bg-gradient-to-br from-blue-50 to-cyan-50"
          }`}
        >
          <FaQuoteLeft
            className={`absolute top-6 left-6 text-3xl ${isDarkMode ? "text-blue-500/30" : "text-blue-200"}`}
          />

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={
                    testimonials[activeIndex].avatar || "/placeholder.svg?height=100&width=100&query=person portrait"
                  }
                  alt={testimonials[activeIndex].name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < testimonials[activeIndex].rating ? "text-yellow-400" : "text-gray-300"}
                    size={20}
                  />
                ))}
              </div>

              <p className={`italic mb-4 text-lg ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                {testimonials[activeIndex].text}
              </p>

              <div>
                <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {testimonials[activeIndex].name}
                </p>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>{testimonials[activeIndex].course}</p>
                <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`}>
                  {testimonials[activeIndex].date}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={prevTestimonial}
              className={`p-2 rounded-full shadow-sm ${
                isDarkMode
                  ? "bg-slate-600 text-white hover:bg-cyan-600"
                  : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
              } transition-colors`}
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextTestimonial}
              className={`p-2 rounded-full shadow-sm ${
                isDarkMode
                  ? "bg-slate-600 text-white hover:bg-cyan-600"
                  : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
              } transition-colors`}
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
          </div>
        </motion.div>

        {/* Testimonial indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex
                  ? isDarkMode
                    ? "bg-cyan-500"
                    : "bg-blue-600"
                  : isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Testimonial list */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              index === activeIndex
                ? isDarkMode
                  ? "border-cyan-600 bg-slate-700"
                  : "border-blue-300 bg-blue-50"
                : isDarkMode
                  ? "border-slate-600 bg-slate-800 hover:border-cyan-800 hover:bg-slate-700"
                  : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg?height=40&width=40&query=person portrait"}
                    alt={testimonial.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{testimonial.name}</p>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {testimonial.rating}
                    </span>
                  </div>
                </div>

                <p className={`text-sm line-clamp-2 mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                  {testimonial.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
