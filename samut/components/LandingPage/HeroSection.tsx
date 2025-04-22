"use client"

import Image from "next/image"
import { FaFacebook, FaInstagram, FaTwitter, FaChalkboardTeacher, FaSwimmer, FaWater } from "react-icons/fa"
import { Button } from "../Common/Button"
import { motion, useScroll, useTransform } from "framer-motion"
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
  const [isAtTop, setIsAtTop] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  // For parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    // Set initial window dimensions
    setWindowHeight(window.innerHeight)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsAtTop(scrollPosition < 10)
      setScrollY(scrollPosition)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => {
      window.removeEventListener("resize", handleResize)
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
    <motion.div
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{
        height: "100vh", // Full viewport height
        minHeight: "600px", // Minimum height for smaller screens
        marginTop: isAtTop ? "-80px" : "0", // Move hero up when at top to compensate for navbar height
        transition: "margin-top 0.3s ease-in-out",
      }}
    >
      {/* Background Container */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: backgroundY,
        }}
      >
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
      </motion.div>

      {/* Content Container - positioned absolutely within the parent */}
      <motion.div className="absolute inset-0 flex flex-col items-center z-20" style={{ opacity }}>
        {/* Left social icons - centered vertically with hover animations */}
        <div className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 text-white text-xl md:text-2xl z-10">
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
        <div className="flex flex-col justify-center h-full text-center max-w-4xl px-4 pt-16 md:pt-0 mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-lg"
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
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-10 max-w-2xl drop-shadow-md mx-auto"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="secondary"
                onClick={primaryAction.onClick}
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-medium"
              >
                {primaryAction.text}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 font-medium"
              >
                {secondaryAction.text}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature cards at bottom with staggered animations */}
        <div className="absolute bottom-16 sm:bottom-24 md:bottom-28 lg:bottom-32 left-0 right-0 px-4 z-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
          >
            {[
              {
                title: "Find Instructors",
                description: "Certified swimming instructors near you",
                icon: <FaChalkboardTeacher className="text-xl md:text-2xl" />,
              },
              {
                title: "All Levels",
                description: "From beginners to advanced swimmers",
                icon: <FaSwimmer className="text-xl md:text-2xl" />,
              },
              {
                title: "Pool Locations",
                description: "Find lessons at convenient locations",
                icon: <FaWater className="text-xl md:text-2xl" />,
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
                className="flex items-start gap-3 md:gap-4 bg-white/15 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/30 text-white shadow-lg transition-all duration-300"
              >
                <div className="p-2 md:p-3 rounded-full bg-white/20 flex items-center justify-center">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-white/90">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced scroll indicator - positioned to be visible */}
      <ScrollDownButton targetId="features" />

      {/* Floating particles effect */}
      <Particles />

      {/* Enhanced wave divider with multiple layers and gradients */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden h-[120px] sm:h-[150px] md:h-[180px]">
        {/* Gradient overlay for smoother transition */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/40 via-white/20 to-transparent z-5"></div>

        <svg
          className="relative block w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* First wave layer - more transparent */}
          <path
            fill="rgba(255, 255, 255, 0.3)"
            d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="20s"
              repeatCount="indefinite"
              values="
                M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z;
                M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,186.7C1120,181,1280,203,1360,213.3L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z;
                M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,197.3C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z
              "
            />
          </path>

          {/* Second wave layer - semi-transparent */}
          <path
            fill="rgba(255, 255, 255, 0.6)"
            d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="15s"
              repeatCount="indefinite"
              values="
                M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,176C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>

          {/* Main wave layer - solid white */}
          <path
            fill="white"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,256L48,261.3C96,267,192,277,288,277.3C384,277,480,267,576,245.3C672,224,768,192,864,181.3C960,171,1056,181,1152,192C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Enhanced gradient overlay for smoother transition */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/50 to-transparent z-5 backdrop-blur-[2px]"></div>

      {/* Water droplets animation for transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-[6]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400/30"
            style={{
              width: Math.random() * 12 + 8,
              height: Math.random() * 12 + 8,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 100],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeIn",
            }}
          />
        ))}
      </div>
    </motion.div>
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
