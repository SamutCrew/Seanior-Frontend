"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAppSelector } from "@/app/redux"
import { SectionTitle } from "@/components/Common/SectionTitle"
import { Button } from "@/components/Common/Button"
import {
  Users,
  Award,
  Target,
  Clock,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react"

export default function AboutPage() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [activeTab, setActiveTab] = useState<"mission" | "story" | "team">("mission")

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
        <Image src="/swimming-lesson.png" alt="Swimming lessons" fill priority style={{ objectFit: "cover" }} />
        <div className="relative z-20 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            About <span className="text-blue-400">SwimThai</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
            Thailand's premier swimming education platform, connecting students with expert instructors since 2015.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <StatCard
            number="10,000+"
            label="Students Taught"
            icon={<Users className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />}
            isDarkMode={isDarkMode}
          />
          <StatCard
            number="500+"
            label="Certified Instructors"
            icon={<Award className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />}
            isDarkMode={isDarkMode}
          />
          <StatCard
            number="50+"
            label="Swimming Locations"
            icon={<MapPin className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />}
            isDarkMode={isDarkMode}
          />
          <StatCard
            number="8"
            label="Years of Excellence"
            icon={<Clock className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap border-b mb-8 space-x-8">
          <TabButton active={activeTab === "mission"} onClick={() => setActiveTab("mission")} isDarkMode={isDarkMode}>
            Our Mission
          </TabButton>
          <TabButton active={activeTab === "story"} onClick={() => setActiveTab("story")} isDarkMode={isDarkMode}>
            Our Story
          </TabButton>
          <TabButton active={activeTab === "team"} onClick={() => setActiveTab("team")} isDarkMode={isDarkMode}>
            Our Team
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === "mission" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Our Mission & Values
                </h2>
                <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  At SwimThai, our mission is to make swimming education accessible to everyone in Thailand, regardless
                  of age or ability. We believe that swimming is not just a sport but a life-saving skill that everyone
                  should have.
                </p>
                <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  We are committed to providing high-quality swimming instruction through our network of certified
                  instructors who are passionate about water safety and swimming education.
                </p>
                <div className="space-y-4 mt-8">
                  <ValueItem
                    title="Safety First"
                    description="We prioritize safety in all our lessons and training programs."
                    isDarkMode={isDarkMode}
                  />
                  <ValueItem
                    title="Excellence in Teaching"
                    description="Our instructors are certified and continuously trained in the latest techniques."
                    isDarkMode={isDarkMode}
                  />
                  <ValueItem
                    title="Inclusivity"
                    description="We welcome students of all ages, abilities, and backgrounds."
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/placeholder-clgfr.png"
                  alt="Swimming instructor teaching"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {activeTab === "story" && (
            <div className="space-y-8">
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Our Story</h2>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    How It All Began
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    SwimThai was founded in 2015 by former national swimming champion Somchai Jaidee, who recognized the
                    need for quality swimming education in Thailand. After retiring from competitive swimming, Somchai
                    dedicated his life to teaching others and preventing drowning accidents.
                  </p>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    What started as a small swimming school in Bangkok has grown into Thailand's largest network of
                    swimming instructors and facilities, serving thousands of students each year.
                  </p>
                </div>
                <div className="relative h-[300px] rounded-xl overflow-hidden order-1 md:order-2">
                  <Image
                    src="/thailand-pool.png"
                    alt="Our beginning"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
                <div className="relative h-[300px] rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder-r993f.png"
                    alt="SwimThai today"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    SwimThai Today
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Today, SwimThai is at the forefront of swimming education in Southeast Asia. Our innovative platform
                    connects students with the perfect instructor based on their needs, location, and skill level.
                  </p>
                  <p className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    We've embraced technology to enhance the learning experience, with our mobile app allowing students
                    to track progress, schedule lessons, and communicate with instructors seamlessly.
                  </p>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    In 2023, we launched our instructor certification program, ensuring that all SwimThai instructors
                    meet our rigorous standards for safety and teaching excellence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="text-center mb-12">
                <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Meet Our Leadership Team
                </h2>
                <p className={`max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Our diverse team of professionals is passionate about swimming education and committed to making
                  SwimThai the best platform for students and instructors alike.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TeamMember
                  name="Somchai Jaidee"
                  role="Founder & CEO"
                  bio="Former national swimming champion with 15+ years of coaching experience."
                  image="/placeholder.svg?height=400&width=400&query=professional Thai man in business attire"
                  isDarkMode={isDarkMode}
                />
                <TeamMember
                  name="Malai Wattana"
                  role="Chief Operations Officer"
                  bio="Olympic swimming coach with expertise in program development and instructor training."
                  image="/placeholder.svg?height=400&width=400&query=professional Thai woman in business attire"
                  isDarkMode={isDarkMode}
                />
                <TeamMember
                  name="Chai Saetang"
                  role="Chief Technology Officer"
                  bio="Tech entrepreneur with a passion for using technology to improve education."
                  image="/placeholder.svg?height=400&width=400&query=professional Thai man with glasses"
                  isDarkMode={isDarkMode}
                />
                <TeamMember
                  name="Pranee Sawat"
                  role="Head of Instructor Relations"
                  bio="Former swimming instructor with 10+ years of experience in talent management."
                  image="/placeholder.svg?height=400&width=400&query=professional Thai woman smiling"
                  isDarkMode={isDarkMode}
                />
                <TeamMember
                  name="Anong Ritthisak"
                  role="Marketing Director"
                  bio="Digital marketing expert specializing in education and sports industries."
                  image="/placeholder.svg?height=400&width=400&query=professional Thai woman with modern hairstyle"
                  isDarkMode={isDarkMode}
                />
                <TeamMember
                  name="Tawan Chaiyasit"
                  role="Head of Safety & Compliance"
                  bio="Water safety expert with background in international swimming regulations."
                  image="/placeholder.svg?height=400&width=400&query=professional Thai man in casual business attire"
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <SectionTitle className="mb-8">What Our Students Say</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Testimonial
              quote="SwimThai helped me overcome my fear of water at age 40. My instructor was patient and understanding, and now I can swim confidently with my children."
              name="Siriwan K."
              location="Bangkok"
              image="/placeholder.svg?height=100&width=100&query=Thai woman smiling"
              isDarkMode={isDarkMode}
            />
            <Testimonial
              quote="My son's swimming skills improved dramatically after just a few lessons with his SwimThai instructor. The platform made it easy to find the perfect teacher for his needs."
              name="Pichit T."
              location="Chiang Mai"
              image="/placeholder.svg?height=100&width=100&query=Thai man with glasses"
              isDarkMode={isDarkMode}
            />
            <Testimonial
              quote="As a competitive swimmer, I needed specialized coaching. SwimThai connected me with a former Olympic coach who has helped take my performance to the next level."
              name="Nattapong S."
              location="Phuket"
              image="/placeholder.svg?height=100&width=100&query=young Thai athlete"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`rounded-2xl p-8 md:p-12 ${isDarkMode ? "bg-gradient-to-br from-blue-900 to-slate-800" : "bg-gradient-to-br from-blue-50 to-blue-100"}`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Ready to Dive In?
              </h2>
              <p className={`mb-6 ${isDarkMode ? "text-blue-100" : "text-gray-700"}`}>
                Whether you're looking to learn how to swim, improve your technique, or find the perfect instructor for
                your child, SwimThai is here to help.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant={isDarkMode ? "gradient" : "primary"} size="lg">
                  Find an Instructor
                </Button>
                <Button variant={isDarkMode ? "outline" : "secondary"} size="lg">
                  Become an Instructor
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800&query=happy students learning to swim"
                alt="Happy swimming students"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className={`py-16 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contact Us</h2>
              <p className={`mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Have questions about SwimThai? We're here to help. Reach out to our team using the contact information
                below.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-white"} shadow-sm`}>
                    <MapPin className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      Headquarters
                    </h3>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      123 Sukhumvit Road, Watthana
                      <br />
                      Bangkok 10110, Thailand
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-white"} shadow-sm`}>
                    <Mail className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Email</h3>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      info@swimthai.com
                      <br />
                      support@swimthai.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-white"} shadow-sm`}>
                    <Phone className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Phone</h3>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      +66 2 123 4567
                      <br />
                      +66 8 9876 5432 (WhatsApp)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <SocialLink icon={<Facebook className="w-5 h-5" />} href="#" isDarkMode={isDarkMode} />
                  <SocialLink icon={<Instagram className="w-5 h-5" />} href="#" isDarkMode={isDarkMode} />
                  <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" isDarkMode={isDarkMode} />
                  <SocialLink icon={<Youtube className="w-5 h-5" />} href="#" isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>

            <div>
              <div className={`rounded-xl overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-white"} shadow-lg`}>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Send Us a Message
                  </h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className={`w-full px-3 py-2 border rounded-md ${
                            isDarkMode
                              ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className={`w-full px-3 py-2 border rounded-md ${
                            isDarkMode
                              ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className={`w-full px-3 py-2 border rounded-md ${
                          isDarkMode
                            ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        }`}
                        placeholder="Message subject"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md ${
                          isDarkMode
                            ? "bg-slate-600 border-slate-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                        }`}
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <Button variant={isDarkMode ? "gradient" : "primary"} className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for statistics cards
interface StatCardProps {
  number: string
  label: string
  icon: React.ReactNode
  isDarkMode: boolean
}

function StatCard({ number, label, icon, isDarkMode }: StatCardProps) {
  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className={`text-3xl font-bold mt-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{number}</h3>
        <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
      </div>
    </div>
  )
}

// Component for tab buttons
interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  isDarkMode: boolean
}

function TabButton({ active, onClick, children, isDarkMode }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
        active
          ? isDarkMode
            ? "border-blue-400 text-blue-400"
            : "border-blue-600 text-blue-600"
          : isDarkMode
            ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  )
}

// Component for value items
interface ValueItemProps {
  title: string
  description: string
  isDarkMode: boolean
}

function ValueItem({ title, description, isDarkMode }: ValueItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`p-1 mt-1 rounded-full ${isDarkMode ? "bg-blue-900" : "bg-blue-100"}`}>
        <Target className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
      </div>
      <div>
        <h4 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h4>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{description}</p>
      </div>
    </div>
  )
}

// Component for team members
interface TeamMemberProps {
  name: string
  role: string
  bio: string
  image: string
  isDarkMode: boolean
}

function TeamMember({ name, role, bio, image, isDarkMode }: TeamMemberProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
      <div className="relative h-64 w-full">
        <Image src={image || "/placeholder.svg"} alt={name} fill style={{ objectFit: "cover" }} />
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{name}</h3>
        <p className={`text-sm font-medium mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{role}</p>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{bio}</p>
        <Link
          href="#"
          className={`inline-flex items-center mt-4 text-sm font-medium ${
            isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
          }`}
        >
          Learn more <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}

// Component for testimonials
interface TestimonialProps {
  quote: string
  name: string
  location: string
  image: string
  isDarkMode: boolean
}

function Testimonial({ quote, name, location, image, isDarkMode }: TestimonialProps) {
  return (
    <div className={`p-6 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <svg width="45" height="36" className={`${isDarkMode ? "text-blue-400" : "text-blue-600"} opacity-30`}>
            <path
              d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className={`flex-1 italic mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>"{quote}"</p>
        <div className="flex items-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image src={image || "/placeholder.svg"} alt={name} fill style={{ objectFit: "cover" }} />
          </div>
          <div>
            <h4 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{name}</h4>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{location}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for social media links
interface SocialLinkProps {
  icon: React.ReactNode
  href: string
  isDarkMode: boolean
}

function SocialLink({ icon, href, isDarkMode }: SocialLinkProps) {
  return (
    <a
      href={href}
      className={`p-3 rounded-full ${
        isDarkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-white text-gray-700 hover:bg-gray-100"
      } shadow-sm transition-colors`}
    >
      {icon}
    </a>
  )
}
