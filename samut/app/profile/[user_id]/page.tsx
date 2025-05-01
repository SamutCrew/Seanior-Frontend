// /profile/[user_id]/page.tsx
"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Input } from "@heroui/react"
import { getUserData, updateUserData } from "@/api/user_api"
import { uploadProfileImage } from "@/api"
import type { User } from "@/types/model/user"
import { motion } from "framer-motion"
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInfoCircle, FaEdit, FaSave, FaCheck } from "react-icons/fa"
import Image from "next/image"
import { useAppSelector } from "@/app/redux"

const Profile = () => {
  const { user, refreshUser } = useAuth()
  const { user_id } = useParams()
  const router = useRouter()

  const [userData, setUserData] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null) // For image preview
  const [selectedImage, setSelectedImage] = useState<File | null>(null) // For the selected image file
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const isOwnProfile = user?.user_id && user.user_id === user_id

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const data = await getUserData(user_id as string)
        setUserData(data)
        setFormData(data)
        setImagePreview(data.profile_img || null) // Set initial image preview
        setError(null)
      } catch (err: any) {
        if (err.response?.status === 404) {
          notFound()
        } else if (err.response?.status === 401) {
          setError("Please log in to view this profile")
          router.push("/auth/Login")
        } else {
          setError("Failed to load user profile")
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }

    if (!user_id) {
      notFound()
    } else {
      fetchUserData()
    }
  }, [user_id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setSelectedFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccessMessage(null)

      let updatedProfileImg = userData?.profile_img

      // Upload new profile image if selected
      if (selectedImage) {
        const uploadResult = await uploadProfileImage(user_id as string, selectedImage)
        updatedProfileImg = uploadResult.resource_url
      }

      // Update user profile with new data and profile image URL
      const updatedData = await updateUserData(user_id as string, {
        ...formData,
        profile_img: updatedProfileImg,
      })

      setUserData(updatedData)
      await refreshUser()
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setSelectedImage(null) // Reset selected image
      setSelectedFileName(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update profile")
      console.error(err)
    }
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
    setFormData(userData || {})
    setImagePreview(userData?.profile_img || null) // Reset image preview
    setSelectedImage(null) // Reset selected image
    setSelectedFileName(null)
    setError(null)
    setSuccessMessage(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p>{error || "The requested user profile could not be found."}</p>
        </div>
      </div>
    )
  }

  // Render edit form with conditional styling based on dark/light mode
  if (isEditing && isOwnProfile) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-[#1a2642] text-white" : "bg-white text-gray-800"} p-6 md:p-8`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaCheck className={isDarkMode ? "text-blue-400" : "text-blue-600"} /> Edit Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Profile Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className={`w-24 h-24 rounded-full overflow-hidden ${
                    isDarkMode ? "bg-[#2a3a5a] border border-[#3a4a6a]" : "bg-gray-100 border border-gray-200"
                  }`}
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile Preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-3xl`} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="profile-image-upload"
                    className={`inline-block px-4 py-2 ${
                      isDarkMode ? "bg-[#2a3a5a] hover:bg-[#3a4a6a]" : "bg-gray-100 hover:bg-gray-200"
                    } rounded-md cursor-pointer transition-colors`}
                  >
                    Choose File
                  </label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className={`ml-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedFileName ? selectedFileName : "No file chosen"}
                  </span>
                  <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Recommended: Square image, at least 300x300 pixels
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <Input
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  name="phone_number"
                  value={formData.phone_number || ""}
                  onChange={handleInputChange}
                  className={`w-full ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FaInfoCircle className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`pl-10 w-full ${
                      isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                    } rounded-md`}
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>
            </div>

            {error && (
              <div
                className={`${isDarkMode ? "bg-red-900/20 border-red-700" : "bg-red-50 border-red-500"} border-l-4 p-4`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className={`h-5 w-5 ${isDarkMode ? "text-red-400" : "text-red-500"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${isDarkMode ? "text-red-400" : "text-red-700"}`}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaSave /> Save Changes
              </button>
              <button
                type="button"
                onClick={toggleEditMode}
                className={`px-6 py-2 ${
                  isDarkMode
                    ? "bg-[#2a3a5a] text-white hover:bg-[#3a4a6a]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } rounded-md transition-colors`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Regular profile view - respects dark/light mode
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-gray-50"}`}>
      {/* Header Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        {/* Background water pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('/cerulean-flow.png')] bg-cover bg-center"></div>
        </div>

        {/* Animated water ripples */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: 100 + i * 30,
                height: 100 + i * 30,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 3],
                opacity: [0.3, 0.2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 1.3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src={imagePreview || "/placeholder.svg?height=200&width=200&query=user profile"}
                  alt={userData.name || "User Profile"}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{userData.name || "User Profile"}</h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-4">{userData.email}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {userData.gender && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaUser className="text-sm" />
                    <span className="text-sm">{userData.gender}</span>
                  </div>
                )}
                {userData.phone_number && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaPhone className="text-sm" />
                    <span className="text-sm">{userData.phone_number}</span>
                  </div>
                )}
                {userData.address && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{userData.address}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200"
                >
                  <FaEdit /> Edit Profile
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className={`${isDarkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-500"
              } border-l-4 p-4 mb-6`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className={`h-5 w-5 ${isDarkMode ? "text-green-400" : "text-green-500"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-700"}`}>{successMessage}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="p-6">
            <h2
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-6 flex items-center gap-2`}
            >
              <FaUser className="text-blue-500" /> Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}
                  >
                    <FaEnvelope className="text-blue-500" /> Email
                  </h3>
                  <p className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{userData.email}</p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}
                  >
                    <FaUser className="text-blue-500" /> Name
                  </h3>
                  <p className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userData.name || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}
                  >
                    <FaUser className="text-blue-500" /> Gender
                  </h3>
                  <p className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userData.gender || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}
                  >
                    <FaMapMarkerAlt className="text-blue-500" /> Address
                  </h3>
                  <p className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userData.address || "Not specified"}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}
                  >
                    <FaPhone className="text-blue-500" /> Phone Number
                  </h3>
                  <p className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    {userData.phone_number || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3
                  className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"} flex items-center gap-2`}
                >
                  <FaInfoCircle className="text-blue-500" /> Description
                </h3>
                <p className={`mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {userData.description || "No description provided."}
                </p>
              </div>
            </div>

            {isOwnProfile && (
              <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <button
                  onClick={toggleEditMode}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaEdit /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
