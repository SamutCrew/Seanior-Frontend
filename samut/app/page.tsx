"use client"
import { useRef } from "react"

import { SectionTitle } from "@/components/Common/SectionTitle"
import HeroSection from "@/components/LandingPage/HeroSection"
import EventSection from "@/components/LandingPage/EventsSection"
import { TeachersSection} from "@/components/LandingPage/TeachersSection"
import CTASection from "@/components/LandingPage/CTASection"
import { FunctionCards } from "@/components/LandingPage/FunctionCards"

export default function Home() {
  const nextSectionRef = useRef<HTMLDivElement | null>(null)

  const scrollToNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const teachers = [
    {
      id: 1,
      name: "Michael Phelps",
      specialty: "Competitive Swimming",
      styles: ["Freestyle", "Butterfly"],
      levels: ["Intermediate", "Advanced"],
      certification: ["ASCA", "RedCross"],
      rating: 4.9,
      experience: 15,
      image: "/teacher1.jpg",
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
      image: "/teacher2.jpg",
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
      image: "/teacher3.jpg",
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
      image: "/teacher4.jpg",
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

      {/* Functions Section */}
      <FunctionCards />

      {/* Events Section */}
      <section ref={nextSectionRef} className="px-4 max-w-6xl mx-auto mt-10">
        <SectionTitle description="Join our community events to learn, network, and grow with industry experts.">
          Events Available
        </SectionTitle>
        <EventSection />
      </section>

      {/* Teachers Section */}
      <TeachersSection teachers={teachers} />

      <CTASection
        title="Ready to Dive In?"
        description="Join hundreds of students improving their swimming skills today"
        buttonText="Find Your Instructor"
        onButtonClick={() => console.log("CTA clicked")}
      />
    </div>
  )
}
