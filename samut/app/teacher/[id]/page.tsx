"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProfileHeader from "@/components/TeacherProfile/profile-header"
import ProfileTabs from "@/components/TeacherProfile/profile-tabs"
import AboutSection from "@/components/TeacherProfile/about-section"
import CertificationsSection from "@/components/TeacherProfile/certifications-section"
import TestimonialsSection from "@/components/TeacherProfile/testimonials-section"
import ScheduleSection from "@/components/TeacherProfile/schedule-section"
import ContactSection from "@/components/TeacherProfile/contact-section"
import { getTeacherById } from "./data/teacher-service"
import type { Teacher } from "@/types/teacher"
import LoadingPage from "@/components/Common/LoadingPage"

export default function TeacherProfilePage() {
  const { id } = useParams()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        // In a real app, this would be an API call
        const teacherData = await getTeacherById(id as string)
        setTeacher(teacherData)
      } catch (error) {
        console.error("Failed to fetch teacher data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacher()
  }, [id])

  if (loading) {
    return <LoadingPage />
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Teacher Not Found</h1>
          <p className="text-gray-600">The teacher profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "about":
        return <AboutSection teacher={teacher} />
      case "certifications":
        return <CertificationsSection certifications={teacher.certifications} />
      case "testimonials":
        return <TestimonialsSection testimonials={teacher.testimonials} />
      case "schedule":
        return <ScheduleSection availability={teacher.availability} />
      case "contact":
        return <ContactSection teacher={teacher} />
      default:
        return <AboutSection teacher={teacher} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ProfileHeader teacher={teacher} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">{renderActiveTab()}</div>
          </div>

          <div className="space-y-6">
            <ContactSection teacher={teacher} />
            <ScheduleSection availability={teacher.availability} compact />
          </div>
        </div>
      </div>
    </div>
  )
}
