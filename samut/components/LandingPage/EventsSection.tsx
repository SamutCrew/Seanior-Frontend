"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa"
import Image from "next/image"

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

// Enhanced EventCard component with animations
const EventCard = ({ event, index }: { event: Event; index: number }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            delay: index * 0.2,
          },
        },
      }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
    >
      <motion.div
        className="relative h-60 w-full overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={event.imageUrl || "/placeholder.svg"}
          alt={event.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <motion.div
          className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
        >
          {event.category}
        </motion.div>
      </motion.div>

      <div className="p-6">
        <div className="flex flex-wrap items-center text-gray-500 text-sm mb-3 gap-2">
          <motion.div
            className="flex items-center bg-blue-50 px-3 py-1 rounded-full"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
          >
            <FaCalendarAlt className="w-3 h-3 mr-2 text-blue-600" />
            <span>{event.date}</span>
          </motion.div>
          <motion.div
            className="flex items-center bg-blue-50 px-3 py-1 rounded-full"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
          >
            <FaClock className="w-3 h-3 mr-2 text-blue-600" />
            <span>{event.time}</span>
          </motion.div>
        </div>

        <motion.h3
          className="text-xl font-bold text-gray-800 mb-3 leading-tight"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
        >
          {event.title}
        </motion.h3>

        <motion.p
          className="text-gray-600 mb-5 line-clamp-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 + index * 0.2, duration: 0.5 }}
        >
          {event.description}
        </motion.p>

        <motion.div
          className="flex justify-between items-center pt-3 border-t border-gray-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
        >
          <div className="flex items-center text-sm">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-600">{event.location}</span>
          </div>
          <motion.button
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            Register <FaArrowRight className="ml-2 w-3 h-3" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Enhanced EventsCarousel component
const EventsCarousel = () => {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const carouselRef = useRef(null)
  const isInView = useInView(carouselRef, { once: true, margin: "-100px" })
  const controls = useAnimation()

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
      className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden my-16 shadow-2xl"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200 z-30">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Slides Container */}
      <div className="relative h-[600px] overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${carouselEvents[index].image})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white">
              <div className="max-w-4xl mx-auto">
                <motion.span
                  className="bg-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-3 inline-block"
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
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    <span className="text-sm">{carouselEvents[index].date}</span>
                  </div>
                </motion.div>
                <motion.h2
                  className="text-4xl font-bold leading-tight mb-4"
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
                  <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-300" />
                  <span className="text-blue-100">{carouselEvents[index].location}</span>
                </motion.div>

                <motion.button
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register Now <FaArrowRight />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <FaChevronLeft className="text-white text-xl" />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <FaChevronRight className="text-white text-xl" />
      </motion.button>

      {/* Slider Bar with Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 w-3/4">
        <div className="flex justify-between items-center h-2">
          {carouselEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i)
                setProgress(0)
              }}
              className={`flex-1 h-1.5 mx-1 rounded-full transition-all duration-300 ${
                i === index ? "bg-white h-2.5" : "bg-white/50 hover:bg-white/70"
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

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-4 relative z-10">
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
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block text-blue-600 font-medium mb-4 tracking-wider"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            UPCOMING EVENTS
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            Discover Our <span className="text-blue-600">Exciting Events</span>
          </motion.h2>
          <motion.div
            className="flex items-center justify-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
            }}
          >
            <motion.div
              className="w-16 h-1 bg-blue-400 mx-4"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Join our community for unforgettable experiences and networking opportunities
            </p>
            <motion.div
              className="w-16 h-1 bg-blue-400 mx-4"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>
        </motion.div>

        {/* Featured Carousel */}
        <EventsCarousel />

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
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
          className="text-center mt-16"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Events
            <FaArrowRight className="ml-3 w-4 h-4 inline-block" />
          </motion.button>
        </motion.div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <motion.path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
            className="text-blue-50"
            opacity="0.25"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.25 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="currentColor"
            className="text-blue-100"
            opacity="0.5"
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 0.5 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
          />
          <motion.path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
            className="text-blue-100"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
          />
        </svg>
      </div>
    </section>
  )
}

export default EventSection
