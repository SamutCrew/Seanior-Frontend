"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from "lucide-react"
import { useAppSelector } from "@/app/redux"
import EventCard from "./EventCard"
import EventsBackground from "./EventsBackground" // Import the new background component

// Define types for our events
interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  imageUrl: string
}

interface CarouselEvent {
  id: number
  image: string
  date: string
  title: string
  location: string
  tag: string
}

const carouselEvents: CarouselEvent[] = [
  {
    id: 1,
    image: "/Events/Event1.jpg",
    date: "24 Jan, 2024",
    title: "Siempre Son Flores Musica Cubana Salsa Jazz",
    location: "TK, at Atlas Event, New York",
    tag: "Featured Event",
  },
  {
    id: 2,
    image: "/Events/Event2.jpg",
    date: "10 Feb, 2024",
    title: "Tokyo International Jazz Night",
    location: "Tokyo Dome, Japan",
    tag: "Upcoming Event",
  },
  {
    id: 3,
    image: "/Events/3.jpeg",
    date: "15 Mar, 2024",
    title: "Paris Jazz Festival",
    location: "Champs de Mars, Paris",
    tag: "Featured Event",
  },
]

const events: Event[] = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description:
      "Join us for the biggest tech conference of the year with industry leaders and innovators sharing cutting-edge technologies.",
    date: "Oct 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Convention Center, San Francisco",
    category: "Conference",
    imageUrl: "/Events/1.jpeg",
  },
  {
    id: 2,
    title: "Web Development Masterclass",
    description:
      "Hands-on workshop covering the latest in web development technologies, frameworks, and best practices for modern applications.",
    date: "Nov 5, 2024",
    time: "10:00 AM - 2:00 PM",
    location: "Online Event",
    category: "Workshop",
    imageUrl: "/Events/2.jpg",
  },
  {
    id: 3,
    title: "Startup Networking Mixer",
    description:
      "Connect with fellow entrepreneurs, investors, and tech enthusiasts in a vibrant networking environment with drinks and appetizers.",
    date: "Dec 2, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Downtown Lounge, NYC",
    category: "Networking",
    imageUrl: "/Events/3.jpeg",
  },
]

// Enhanced EventsCarousel component
const EventsCarousel = () => {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const carouselRef = useRef(null)
  const isInView = useInView(carouselRef, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const nextSlide = () => {
    setIndex((prev) => (prev === carouselEvents.length - 1 ? 0 : prev + 1))
    setProgress(0)
  }

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? carouselEvents.length - 1 : prev - 1))
    setProgress(0)
  }

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + 0.5 // Slower progress for smoother animation
      })
    }, 50)

    return () => clearInterval(interval)
  }, [autoPlay])

  return (
    <motion.div
      ref={carouselRef}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
      }}
      className={`relative w-full max-w-7xl mx-auto rounded-xl overflow-hidden my-12 ${
        isDarkMode ? "shadow-lg shadow-slate-900/30" : "shadow-xl"
      }`}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Progress Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isDarkMode ? "bg-slate-800" : "bg-gray-200"} z-30`}>
        <motion.div
          className={`h-full ${isDarkMode ? "bg-cyan-500" : "bg-cyan-600"}`}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Slides Container */}
      <div className="relative h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${carouselEvents[index].image})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? "bg-gradient-to-t from-slate-900/95 via-slate-900/70 to-slate-900/30"
                  : "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
              } z-10`}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 z-20 text-white">
              <div className="max-w-4xl mx-auto">
                <motion.span
                  className={`${
                    isDarkMode ? "bg-cyan-600" : "bg-cyan-600"
                  } text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full mb-2 sm:mb-3 inline-block`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {carouselEvents[index].tag}
                </motion.span>
                <motion.div
                  className="flex items-center space-x-3 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div
                    className={`flex items-center ${
                      isDarkMode ? "bg-slate-800/70" : "bg-white/20"
                    } backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full`}
                  >
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{carouselEvents[index].date}</span>
                  </div>
                </motion.div>
                <motion.h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {carouselEvents[index].title}
                </motion.h2>
                <motion.div
                  className="flex items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2 text-cyan-300" />
                  <span className="text-xs sm:text-sm text-cyan-100">{carouselEvents[index].location}</span>
                </motion.div>

                <motion.button
                  className={`mt-4 sm:mt-6 ${
                    isDarkMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-cyan-600 hover:bg-cyan-700"
                  } text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 text-xs sm:text-sm`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2 ${
          isDarkMode ? "bg-slate-800/70 hover:bg-slate-700/70" : "bg-white/20 hover:bg-white/30"
        } backdrop-blur-sm rounded-full transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <ChevronLeft className="text-white text-base sm:text-lg" />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2 ${
          isDarkMode ? "bg-slate-800/70 hover:bg-slate-700/70" : "bg-white/20 hover:bg-white/30"
        } backdrop-blur-sm rounded-full transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <ChevronRight className="text-white text-base sm:text-lg" />
      </motion.button>

      {/* Slider Bar with Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-3/4">
        <div className="flex justify-between items-center h-2">
          {carouselEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i)
                setProgress(0)
              }}
              className={`flex-1 h-1 mx-1 rounded-full transition-all duration-300 ${
                i === index
                  ? isDarkMode
                    ? "bg-cyan-500 h-1.5"
                    : "bg-white h-1.5"
                  : isDarkMode
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Main EventSection component
const EventSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const controls = useAnimation()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section ref={sectionRef} className="py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Add the new background component */}
      <EventsBackground />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            className={`inline-block ${isDarkMode ? "text-cyan-400" : "text-cyan-600"} font-medium mb-2 sm:mb-4 tracking-wider text-xs sm:text-sm`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            UPCOMING EVENTS
          </motion.span>
          <motion.h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3 sm:mb-6`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            Discover Our <span className={isDarkMode ? "text-cyan-400" : "text-cyan-600"}>Exciting Events</span>
          </motion.h2>
          <motion.div
            className="flex items-center justify-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            <motion.div
              className={`w-12 sm:w-16 h-0.5 ${isDarkMode ? "bg-cyan-700" : "bg-cyan-400"} mx-3 sm:mx-4`}
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p
              className={`${isDarkMode ? "text-slate-300" : "text-gray-600"} max-w-2xl mx-auto text-sm sm:text-base md:text-lg`}
            >
              Join our community for unforgettable experiences and networking opportunities
            </p>
            <motion.div
              className={`w-12 sm:w-16 h-0.5 ${isDarkMode ? "bg-cyan-700" : "bg-cyan-400"} mx-3 sm:mx-4`}
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>

        {/* Featured Carousel */}
        <EventsCarousel />

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:mt-16"
        >
          <motion.button
            className={`px-4 py-2 sm:px-6 sm:py-3 ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                : "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
            } text-white rounded-lg text-sm sm:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View All Events</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default EventSection
