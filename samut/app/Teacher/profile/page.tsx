"use client"

import type React from "react"

import { useState } from "react"
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt, FaSave } from "react-icons/fa"

export default function TeacherEditProfilePage() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    specialization: "Swimming Instructor",
    experience: "8 years",
    bio: "Certified swimming instructor with expertise in teaching all age groups. Specialized in competitive swimming techniques and water safety.",
    availability: "Weekdays 9AM-6PM, Weekends 10AM-2PM",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the profile data
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Profile</h1>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleChange}
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="availability"
                    value={profile.availability}
                    onChange={handleChange}
                    className="pl-10 w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
