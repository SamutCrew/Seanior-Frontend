"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { SectionTitle } from "@/components/Common/SectionTitle"
import HeroSection from "@/components/PageLanding/HeroSection"
import EventSection from "@/components/PageLanding/EventsSection"
import { InstructorsSection } from "@/components/PageLanding/TeachersSection"
import CTASection from "@/components/PageLanding/CTASection"
import { FunctionCards } from "@/components/PageLanding/FunctionCards"

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null)
  const eventsRef = useRef<HTMLDivElement>(null)
  const instructorsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Scroll animations for features section
  const { scrollYProgress: featuresScrollProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"],
  })
  const featuresOpacity = useTransform(featuresScrollProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const featuresY = useTransform(featuresScrollProgress, [0, 0.15, 0.85, 1], [100, 0, 0, -100])

  // Scroll animations for events section
  const { scrollYProgress: eventsScrollProgress } = useScroll({
    target: eventsRef,
    offset: ["start end", "end start"],
  })
  const eventsOpacity = useTransform(eventsScrollProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const eventsY = useTransform(eventsScrollProgress, [0, 0.15, 0.85, 1], [100, 0, 0, -100])

  // Scroll animations for instructors section
  const { scrollYProgress: instructorsScrollProgress } = useScroll({
    target: instructorsRef,
    offset: ["start end", "end start"],
  })
  const instructorsOpacity = useTransform(instructorsScrollProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const instructorsY = useTransform(instructorsScrollProgress, [0, 0.15, 0.85, 1], [100, 0, 0, -100])

  // Scroll animations for CTA section
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  })
  const ctaOpacity = useTransform(ctaScrollProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const ctaY = useTransform(ctaScrollProgress, [0, 0.15, 0.85, 1], [100, 0, 0, -100])

  const scrollToNextSection = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const instructors = [
    {
      id: 1,
      name: "Michael Phelps",
      specialty: "Competitive Swimming",
      styles: ["Freestyle", "Butterfly"],
      levels: ["Intermediate", "Advanced"],
      certification: ["ASCA", "RedCross"],
      rating: 4.9,
      experience: 15,
      image: "/instructor1.jpg",
      bio: "Olympic gold medalist specializing in competitive swimming techniques",
      lessonType: "Private",
      price: 80,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
    {
      id: 2,
      name: "Katie Ledecky",
      specialty: "Freestyle Technique",
      styles: ["Freestyle"],
      levels: ["Beginner", "Intermediate", "Advanced"],
      certification: ["USMS", "RedCross"],
      rating: 4.8,
      experience: 12,
      image: "/instructor2.jpg",
      bio: "World record holder focusing on freestyle technique and endurance",
      lessonType: "Private",
      price: 75,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
    {
      id: 3,
      name: "Ryan Murphy",
      specialty: "Backstroke",
      styles: ["Backstroke", "Freestyle"],
      levels: ["Intermediate", "Advanced"],
      certification: ["ASCA", "RedCross"],
      rating: 4.7,
      experience: 10,
      image: "/instructor3.jpg",
      bio: "Olympic gold medalist specializing in backstroke techniques",
      lessonType: "Group",
      price: 70,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
    {
      id: 4,
      name: "Simone Manuel",
      specialty: "Sprint Freestyle",
      styles: ["Freestyle", "Butterfly"],
      levels: ["Beginner", "Intermediate"],
      certification: ["ASCA", "RedCross"],
      rating: 4.9,
      experience: 8,
      image: "/instructor4.jpg",
      bio: "Olympic gold medalist focusing on sprint techniques and fundamentals",
      lessonType: "Private",
      price: 85,
      location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    },
  ]

  return (
    <div>
      <HeroSection
        title="Find Your Swimming Instructor"
        subtitle="Connect with certified instructors for all ages and skill levels"
        imageSrc="/SwimmimgLanding.jpg"
        primaryAction={{
          text: "Browse Instructors",
          onClick: () => console.log("Browse Instructors Clicked"),
        }}
        secondaryAction={{
          text: "How It Works",
          onClick: scrollToNextSection,
        }}
      />

      {/* Functions Section with scroll animations */}
      <motion.div
        ref={featuresRef}
        id="features"
        style={{ opacity: featuresOpacity, y: featuresY }}
        className="relative z-10 transition-all duration-1000 ease-out"
      >
        <FunctionCards />
      </motion.div>

      {/* Events Section with scroll animations */}
      <motion.section
        ref={eventsRef}
        style={{ opacity: eventsOpacity, y: eventsY }}
        className="px-4 max-w-6xl mx-auto mt-10 relative z-10 transition-all duration-1000 ease-out"
      >
        <EventSection />
      </motion.section>

      {/* Instructors Section with scroll animations */}
      <motion.div
        ref={instructorsRef}
        style={{ opacity: instructorsOpacity, y: instructorsY }}
        className="relative z-10 transition-all duration-1000 ease-out"
      >
        <InstructorsSection instructors={instructors} />
      </motion.div>

      {/* CTA Section with scroll animations */}
      <motion.div
        ref={ctaRef}
        style={{ opacity: ctaOpacity, y: ctaY }}
        className="relative z-10 transition-all duration-1000 ease-out"
      >
        <CTASection
          title="Ready to Dive In?"
          description="Join hundreds of students improving their swimming skills today"
          buttonText="Find Your Instructor"
          onButtonClick={() => console.log("CTA clicked")}
        />
      </motion.div>
    </div>
  )
}
