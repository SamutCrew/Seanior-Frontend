"use client"

import { Button } from "../Common/Button"
import { motion } from "framer-motion"
import { useAppSelector } from "@/app/redux"
import { Waves } from "lucide-react"

interface CTASectionProps {
  title: string
  description: string
  buttonText: string
  onButtonClick?: () => void
}

export const CTASection = ({ title, description, buttonText, onButtonClick }: CTASectionProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic background based on dark mode */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900"
            : "bg-gradient-to-br from-blue-600 to-cyan-600"
        }`}
      >
        {/* Animated wave patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <motion.path
              fill="rgba(255, 255, 255, 0.3)"
              fillOpacity="1"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              animate={{
                d: [
                  "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,240C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                  "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                ],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white opacity-10"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30 backdrop-blur-sm"
            style={{
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6"
        >
          <Waves className="mr-2 h-4 w-4" />
          <span>Join our swimming community</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-6 text-white"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-10 text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="gradient" size="lg" onClick={onButtonClick} showArrow className="group">
            {buttonText}
          </Button>

          <Button variant="outline" size="lg" className="backdrop-blur-sm">
            Learn More
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8"
        >
          <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white font-bold">800+</span>
            </div>
            <span className="text-white text-sm">Happy Students</span>
          </div>

          <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white font-bold">50+</span>
            </div>
            <span className="text-white text-sm">Expert Instructors</span>
          </div>

          <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <span className="text-white font-bold">15+</span>
            </div>
            <span className="text-white text-sm">Pool Locations</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
