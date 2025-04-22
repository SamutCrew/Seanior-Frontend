"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, useAnimation } from "framer-motion"

interface ScrollDownButtonProps {
  targetId?: string
}

export default function ScrollDownButton({ targetId = "features" }: ScrollDownButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      // Hide the button after scrolling down 100px
      if (window.scrollY > 100) {
        setIsVisible(false)
        controls.start({ opacity: 0, y: 20 })
      } else {
        setIsVisible(true)
        controls.start({ opacity: 1, y: 0 })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [controls])

  const scrollToTarget = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    } else {
      // If no target element found, just scroll down 100vh
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      })
    }
  }

  // Pulse animation for the circle
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.button
      onClick={scrollToTarget}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      style={{ opacity }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-30"
      aria-label="Scroll down"
    >
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2"
      >
        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </motion.div>
      </motion.div>
      <motion.span
        className="text-white text-xs sm:text-sm font-medium"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        Scroll Down
      </motion.span>
    </motion.button>
  )
}
