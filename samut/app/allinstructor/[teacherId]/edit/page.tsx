"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarAlt,
  FaSave,
  FaImage,
  FaPlus,
  FaTrash,
  FaChevronLeft,
} from "react-icons/fa"
import { Button } from "@/components/Common/Button"
import Image from "next/image"
import { motion } from "framer-motion"
import { useAppSelector } from "@/app/redux"

export default function EditTeacherProfilePage() {
  const router = useRouter()
  const { id } = useParams()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [profile, setProfile] = useState({
    name: "Michael Phelps",
    email: "michael.phelps@example.com",
    phone: "(555) 123-4567",
    specialty: "Olympic Swimming Coach",
    experience: "15 years",
    bio: "As a former Olympic gold medalist, I bring over 15 years of competitive swimming experience to my teaching. I specialize in helping swimmers of all levels perfect their technique and achieve their personal goals, whether that's learning to swim for the first time or preparing for competitive events.",
    teachingPhilosophy:
      "I believe that every student has unique potential. My teaching approach focuses on building confidence in the water first, then developing proper technique through personalized instruction.",
    profileImage: "/confident-swim-coach.png",
    styles: ["Freestyle", "Butterfly", "Backstroke", "Breaststroke"],
    levels: ["Beginner", "Intermediate", "Advanced", "Competition"],
    price: "85",
    location: "Aquatic Center, Los Angeles, CA",
    contactHours: "Monday to Friday, 9AM - 5PM",
  })

  const [certifications, setCertifications] = useState([
    {
      name: "ASCA Level 5 Coach Certification",
      issuer: "American Swimming Coaches Association",
      issueDate: "2018-01-15",
      expiryDate: "2028-01-15",
      description: "Highest level of certification for swimming coaches",
    },
    {
      name: "Water Safety Instructor",
      issuer: "American Red Cross",
      issueDate: "2015-03-10",
      expiryDate: "2025-03-10",
      description: "Certification to teach swimming lessons and water safety courses",
    },
  ])

  const [specializations, setSpecializations] = useState([
    {
      title: "Competition Training",
      description: "Specialized coaching for competitive swimmers looking to improve race times and technique.",
    },
    {
      title: "Adult Learn-to-Swim",
      description: "Patient, supportive instruction for adults who want to overcome fear of water and learn to swim.",
    },
  ])

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    description: "",
  })

  const [newSpecialization, setNewSpecialization] = useState({
    title: "",
    description: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleStyleChange = (style: string) => {
    setProfile((prev) => ({
      ...prev,
      styles: prev.styles.includes(style) ? prev.styles.filter((s) => s !== style) : [...prev.styles, style],
    }))
  }

  const handleLevelChange = (level: string) => {
    setProfile((prev) => ({
      ...prev,
      levels: prev.levels.includes(level) ? prev.levels.filter((l) => l !== level) : [...prev.levels, level],
    }))
  }

  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewCertification((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewSpecialization((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const addCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      setCertifications([...certifications, newCertification])
      setNewCertification({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        description: "",
      })
    }
  }

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  const addSpecialization = () => {
    if (newSpecialization.title && newSpecialization.description) {
      setSpecializations([...specializations, newSpecialization])
      setNewSpecialization({
        title: "",
        description: "",
      })
    }
  }

  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the profile data to your backend
    console.log({ profile, certifications, specializations })

    // Show success message and redirect
    alert("Profile updated successfully!")
    router.push(`/teacher/${id}`) // Use the actual teacher ID from params
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-b from-blue-50 via-white to-white text-gray-900"
      }`}
    >
      {/* Header section with gradient background */}
      <div
        className={`relative ${
          isDarkMode
            ? "bg-gradient-to-r from-blue-900 to-cyan-900 text-white"
            : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
        } py-8`}
      >
        {/* Background water pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image src="/cerulean-flow.png" alt="Water pattern" fill className="object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Button variant="outline" className="mb-4" onClick={() => router.push(`/teacher/${id}`)}>
            <FaChevronLeft className="mr-2" /> Back to Profile
          </Button>
          <h1 className="text-3xl font-bold">Edit Your Profile</h1>
          <p className="text-blue-100 mt-2">Update your information and credentials</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white shadow-md"
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Profile Image</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
                  <Image
                    src={profile.profileImage || "/placeholder.svg"}
                    alt={profile.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  className={`absolute bottom-0 right-0 ${
                    isDarkMode ? "bg-cyan-600 hover:bg-cyan-700" : "bg-blue-600 hover:bg-blue-700"
                  } text-white p-2 rounded-full shadow-md transition-colors`}
                >
                  <FaImage />
                </button>
              </div>

              <div className="flex-1">
                <p className={isDarkMode ? "text-gray-300 mb-2" : "text-gray-700 mb-2"}>
                  Upload a professional photo of yourself that clearly shows your face.
                </p>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
                  Recommended: A high-quality image where you appear approachable and professional. Square format works
                  best.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={isDarkMode ? "outline" : "outline"}
                    className={isDarkMode ? "border-slate-600 text-white" : ""}
                  >
                    Upload New Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={
                      isDarkMode
                        ? "text-red-400 border-red-900/50 hover:bg-red-900/20"
                        : "text-red-600 border-red-200 hover:bg-red-50"
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white shadow-md"
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className={`pl-10 w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className={`pl-10 w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className={`pl-10 w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Specialty
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    type="text"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleProfileChange}
                    className={`pl-10 w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={profile.experience}
                  onChange={handleProfileChange}
                  className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Hourly Rate ($)
                </label>
                <input
                  type="text"
                  name="price"
                  value={profile.price}
                  onChange={handleProfileChange}
                  className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Contact Hours
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <input
                    type="text"
                    name="contactHours"
                    value={profile.contactHours}
                    onChange={handleProfileChange}
                    className={`pl-10 w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows={4}
                className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              ></textarea>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                Write a compelling bio that highlights your experience, qualifications, and teaching approach.
              </p>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Teaching Philosophy
              </label>
              <textarea
                name="teachingPhilosophy"
                value={profile.teachingPhilosophy}
                onChange={handleProfileChange}
                rows={3}
                className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                  isDarkMode
                    ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              ></textarea>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                Share your approach to teaching and what students can expect in your lessons.
              </p>
            </div>
          </motion.div>

          {/* Swimming Styles & Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white shadow-md"
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              Swimming Styles & Levels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Swimming Styles
                </label>
                <div className="space-y-2">
                  {["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Medley", "Open Water"].map((style) => (
                    <label key={style} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.styles.includes(style)}
                        onChange={() => handleStyleChange(style)}
                        className={`rounded ${
                          isDarkMode
                            ? "bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"
                            : "text-blue-600 focus:ring-blue-500"
                        } h-4 w-4 mr-2`}
                      />
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Teaching Levels
                </label>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced", "Competition", "Special Needs", "Rehabilitation"].map(
                    (level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.levels.includes(level)}
                          onChange={() => handleLevelChange(level)}
                          className={`rounded ${
                            isDarkMode
                              ? "bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-500"
                              : "text-blue-600 focus:ring-blue-500"
                          } h-4 w-4 mr-2`}
                        />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{level}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white shadow-md"
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Certifications</h2>

            <div className="space-y-4 mb-6">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"}`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{cert.name}</h3>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className={isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className={isDarkMode ? "text-gray-300 text-sm" : "text-gray-600 text-sm"}>{cert.issuer}</p>
                    <div className={`flex gap-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                      <span>Issued: {cert.issueDate}</span>
                      {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                    </div>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} mt-2`}>{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t pt-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Add New Certification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) => handleCertificationChange(e, "name")}
                    className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={newCertification.issuer}
                    onChange={(e) => handleCertificationChange(e, "issuer")}
                    className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={newCertification.issueDate}
                    onChange={(e) => handleCertificationChange(e, "issueDate")}
                    className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={newCertification.expiryDate}
                    onChange={(e) => handleCertificationChange(e, "expiryDate")}
                    className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Description
                </label>
                <textarea
                  value={newCertification.description}
                  onChange={(e) => handleCertificationChange(e, "description")}
                  rows={2}
                  className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                ></textarea>
              </div>

              <button
                type="button"
                onClick={addCertification}
                className={`flex items-center gap-2 ${
                  isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                <FaPlus /> Add Certification
              </button>
            </div>
          </motion.div>

          {/* Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`rounded-xl shadow-sm p-6 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white shadow-md"
            }`}
          >
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Specializations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {specializations.map((spec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg relative ${
                    isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className={`absolute top-2 right-2 ${
                      isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-700"
                    }`}
                  >
                    <FaTrash />
                  </button>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{spec.title}</h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{spec.description}</p>
                </div>
              ))}
            </div>

            <div className={`border-t pt-4 ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Add New Specialization
              </h3>
              <div className="space-y-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newSpecialization.title}
                    onChange={(e) => handleSpecializationChange(e, "title")}
                    className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    value={newSpecialization.description}
                    onChange={(e) => handleSpecializationChange(e, "description")}
                    rows={2}
                    className={`w-full rounded-lg p-2.5 focus:ring-2 ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  ></textarea>
                </div>
              </div>

              <button
                type="button"
                onClick={addSpecialization}
                className={`flex items-center gap-2 ${
                  isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                <FaPlus /> Add Specialization
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant={isDarkMode ? "gradient" : "gradient"}
              className="px-8 py-3 text-lg flex items-center gap-2"
            >
              <FaSave /> Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
