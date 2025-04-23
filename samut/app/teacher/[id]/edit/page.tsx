"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
} from "react-icons/fa"
import { Button } from "@/components/Common/Button"
import { SectionTitle } from "@/components/Common/SectionTitle"
import Image from "next/image"

export default function EditTeacherProfilePage() {
  const router = useRouter()

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
    router.push(`/teacher/${123}`) // Replace with actual teacher ID
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-8">Edit Your Teacher Profile</SectionTitle>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Image</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200">
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
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                >
                  <FaImage />
                </button>
              </div>

              <div className="flex-1">
                <p className="text-gray-700 mb-2">
                  Upload a professional photo of yourself that clearly shows your face.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Recommended: A high-quality image where you appear approachable and professional. Square format works
                  best.
                </p>
                <div className="flex gap-3">
                  <Button type="button" variant="outline">
                    Upload New Photo
                  </Button>
                  <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="specialty"
                    value={profile.specialty}
                    onChange={handleProfileChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={profile.experience}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="text"
                  name="price"
                  value={profile.price}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Hours</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="contactHours"
                    value={profile.contactHours}
                    onChange={handleProfileChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Write a compelling bio that highlights your experience, qualifications, and teaching approach.
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Teaching Philosophy</label>
              <textarea
                name="teachingPhilosophy"
                value={profile.teachingPhilosophy}
                onChange={handleProfileChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                Share your approach to teaching and what students can expect in your lessons.
              </p>
            </div>
          </div>

          {/* Swimming Styles & Levels */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Swimming Styles & Levels</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Swimming Styles</label>
                <div className="space-y-2">
                  {["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Medley", "Open Water"].map((style) => (
                    <label key={style} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.styles.includes(style)}
                        onChange={() => handleStyleChange(style)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                      />
                      {style}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Levels</label>
                <div className="space-y-2">
                  {["Beginner", "Intermediate", "Advanced", "Competition", "Special Needs", "Rehabilitation"].map(
                    (level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.levels.includes(level)}
                          onChange={() => handleLevelChange(level)}
                          className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                        />
                        {level}
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Certifications</h2>

            <div className="space-y-4 mb-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span>Issued: {cert.issueDate}</span>
                      {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                    </div>
                    <p className="text-gray-700 mt-2">{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Certification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={newCertification.name}
                    onChange={(e) => handleCertificationChange(e, "name")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    value={newCertification.issuer}
                    onChange={(e) => handleCertificationChange(e, "issuer")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newCertification.issueDate}
                    onChange={(e) => handleCertificationChange(e, "issueDate")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={newCertification.expiryDate}
                    onChange={(e) => handleCertificationChange(e, "expiryDate")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCertification.description}
                  onChange={(e) => handleCertificationChange(e, "description")}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={addCertification}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FaPlus /> Add Certification
              </button>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Specializations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {specializations.map((spec, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                  <h3 className="font-semibold text-gray-800 mb-2">{spec.title}</h3>
                  <p className="text-gray-600 text-sm">{spec.description}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Add New Specialization</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newSpecialization.title}
                    onChange={(e) => handleSpecializationChange(e, "title")}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newSpecialization.description}
                    onChange={(e) => handleSpecializationChange(e, "description")}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>

              <button
                type="button"
                onClick={addSpecialization}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <FaPlus /> Add Specialization
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="px-8 py-3 text-lg flex items-center gap-2">
              <FaSave /> Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
