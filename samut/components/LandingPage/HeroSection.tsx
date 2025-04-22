"use client"

import Image from "next/image"
import { FaFacebook, FaInstagram, FaTwitter, FaChalkboardTeacher, FaSwimmer, FaWater } from "react-icons/fa"
import { Button } from "../Common/Button"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import ScrollDownButton from "./ScrollDownButton"

interface ActionProps {
  text: string
  onClick: () => void
}

interface HeroSectionProps {
  title?: string
  subtitle?: string
  imageSrc?: string
  primaryAction?: ActionProps
  secondaryAction?: ActionProps
}

export const HeroSection = ({
  title = "Find Your Swimming Instructor",
  subtitle = "Connect with certified instructors for all ages and skill levels",
  imageSrc = "/SwimmimgLanding.jpg",
  primaryAction = {
    text: "Browse Instructors",
    onClick: () => console.log("Browse Instructors Clicked"),
  },
  secondaryAction = {
    text: "How It Works",
    onClick: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }),
  },
}: HeroSectionProps) => {
  const [isAtTop, setIsAtTop] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsAtTop(scrollPosition < 10)
      setScrollY(scrollPosition)

      // Add parallax effect to the background image
      if (heroRef.current) {
        const parallaxOffset = scrollPosition * 0.4 // Adjust the parallax speed
        const imageContainer = heroRef.current.querySelector(".bg-image-container") as HTMLElement
        if (imageContainer) {
          imageContainer.style.transform = `translateY(${parallaxOffset}px) scale(${1 + scrollPosition * 0.0005})`
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Water ripple animation variants
  const rippleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.5, 2],
      opacity: [0, 0.3, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1.5,
      },
    },
  }

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{
        marginTop: isAtTop ? "-80px" : "0", // Move hero up when at top to compensate for navbar height
        transition: "margin-top 0.3s ease-in-out",
      }}
    >
      {/* Background Container - increased height for more immersive experience */}
      <div className="relative h-[110vh]">
        <div className="bg-image-container absolute inset-0 transition-transform duration-300 ease-out">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt="Hero background"
            fill
            className="object-cover opacity-90"
            priority
            sizes="100vw"
          />

          {/* Water ripple animations */}
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-full bg-white/20"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.5,
            }}
          />

          <motion.div
            className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-white/20"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
          />

          <motion.div
            className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-white/20"
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 2 }}
          />
        </div>

        {/* Restored gradient with subtle appearance */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"
          style={{ height: "80px" }}
        />

        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content Container - positioned absolutely within the parent */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Left social icons - centered vertically with hover animations */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 text-white text-2xl z-10">
          <motion.a
            href="#"
            whileHover={{ y: -3, scale: 1.1, color: "#4267B2" }}
            className="hover:text-blue-400 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FaFacebook />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ y: -3, scale: 1.1, color: "#E1306C" }}
            className="hover:text-pink-500 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <FaInstagram />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ y: -3, scale: 1.1, color: "#1DA1F2" }}
            className="hover:text-blue-300 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FaTwitter />
          </motion.a>
        </div>

        {/* Main content - centered in the middle of the screen */}
        <div className="text-center max-w-4xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-lg"
            style={{
              textShadow: "0 4px 12px rgba(0,0,0,0.3)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl drop-shadow-md mx-auto"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="secondary" onClick={primaryAction.onClick} className="text-lg px-8 py-4 font-medium">
                {primaryAction.text}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" onClick={secondaryAction.onClick} className="text-lg px-8 py-4 font-medium">
                {secondaryAction.text}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature cards at bottom with staggered animations */}
        <div className="absolute bottom-12 left-0 right-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="w-full max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Find Instructors",
                description: "Certified swimming instructors near you",
                icon: <FaChalkboardTeacher className="text-2xl" />,
              },
              {
                title: "All Levels",
                description: "From beginners to advanced swimmers",
                icon: <FaSwimmer className="text-2xl" />,
              },
              {
                title: "Pool Locations",
                description: "Find lessons at convenient locations",
                icon: <FaWater className="text-2xl" />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 + i * 0.2 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="flex items-start gap-4 bg-white/15 backdrop-blur-md p-6 rounded-xl border border-white/30 text-white shadow-lg transition-all duration-300"
              >
                <div className="p-3 rounded-full bg-white/20 flex items-center justify-center">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-base text-white/90">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced scroll indicator - positioned to be visible */}
      <ScrollDownButton targetId="features" />

      {/* Floating particles effect */}
      <Particles />
    </div>
  )
}

// Floating particles component
const Particles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/30"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default HeroSection
