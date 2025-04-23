"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useAppSelector } from "@/app/redux"

const EventsBackground = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const containerRef = useRef(null)

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950"
            : "bg-gradient-to-b from-cyan-50/30 via-white to-white"
        }`}
      />

      {/* Ripple horizon effect */}
      <div className="absolute inset-0">
        {/* Horizontal ripple lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className={`absolute h-[1px] left-0 right-0 ${
                isDarkMode
                  ? "bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0"
                  : "bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0"
              }`}
              style={{
                top: `${15 + i * 10}%`,
                y: y1,
                opacity: 0.5 + (i % 3) * 0.1,
              }}
            />
          ))}
        </div>

        {/* Floating accent elements */}
        <motion.div className="absolute inset-0" style={{ opacity }}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`accent-${i}`}
              className={`absolute rounded-full ${isDarkMode ? "bg-cyan-500/5" : "bg-cyan-500/3"}`}
              style={{
                width: `${Math.random() * 8 + 4}rem`,
                height: `${Math.random() * 8 + 4}rem`,
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                opacity: Math.random() * 0.07 + 0.03,
              }}
              animate={{
                x: [0, Math.random() * 20 - 10],
                y: [0, Math.random() * 20 - 10],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Mesh grid pattern */}
        <div
          className={`absolute inset-0 mesh-grid ${isDarkMode ? "mesh-grid-dark" : "mesh-grid-light"}`}
          style={{ opacity: isDarkMode ? 0.07 : 0.04 }}
        />

        {/* Corner accents */}
        <motion.div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${
            isDarkMode
              ? "bg-gradient-to-br from-cyan-900/20 to-transparent"
              : "bg-gradient-to-br from-cyan-200/20 to-transparent"
          }`}
          style={{ y: y2 }}
        />
        <motion.div
          className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full ${
            isDarkMode
              ? "bg-gradient-to-tr from-blue-900/15 to-transparent"
              : "bg-gradient-to-tr from-blue-200/15 to-transparent"
          }`}
          style={{ y: y1 }}
        />

        {/* Water ripple animations */}
        <div className="absolute inset-0 water-ripples">
          {[...Array(5)].map((_, i) => (
            <div
              key={`ripple-container-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
              }}
            >
              <div className={`water-ripple delay-${i}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventsBackground
