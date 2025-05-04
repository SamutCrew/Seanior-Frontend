"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useAppSelector } from "@/app/redux"
import { Input } from "@heroui/react"
import { Button } from "@/components/Common/Button"
import { SectionTitle } from "@/components/Common/SectionTitle"
import {
  Upload,
  Calendar,
  School,
  Phone,
  MapPin,
  FileText,
  User,
  Instagram,
  Facebook,
  MessageCircle,
  Award,
  History,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
} from "lucide-react"
import {
  submitInstructorRequest,
  updateInstructorRequest,
  getInstructorRequestByUserId,
} from "@/api/instructor_request_api"
import { uploadProfileImage, uploadIdCard, uploadSwimmingLicense } from "@/api/resource_api"
import  LoadingPage  from "@/components/Common/LoadingPage"

// Define validation error types
type ValidationErrors = {
  full_name?: string
  phone_number?: string
  address?: string
  profile_image?: string
  date_of_birth?: string
  education_record?: string
  id_card_url?: string
  swimming_instructor_license?: string
  contact_channels?: {
    line?: string
    facebook?: string
    instagram?: string
  }
}

const InstructorRequestPage = () => {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    profile_image: "",
    date_of_birth: "",
    education_record: "",
    id_card_url: "",
    contact_channels: { line: "", facebook: "", instagram: "" },
    swimming_instructor_license: "",
    teaching_history: "",
    additional_skills: "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
  const [licensePreview, setLicensePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedIdCard, setSelectedIdCard] = useState<File | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [existingRequest, setExistingRequest] = useState<any>(null)
  const [activeSection, setActiveSection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) {
      router.push("/auth/Login")
      return
    }

    // Prefill form with user data
    setFormData((prev) => ({
      ...prev,
      full_name: user.name || "",
      phone_number: user.phone_number || "",
      address: user.address || "",
      profile_image: user.profile_img || "",
    }))

    setImagePreview(user.profile_img || null)

    const fetchExistingRequest = async () => {
      try {
        setLoading(true)
        const response = await getInstructorRequestByUserId(user.user_id)
        const request = response.request
        setExistingRequest(request)

        if (request) {
          setFormData({
            full_name: request.full_name || user.name || "",
            phone_number: request.phone_number || user.phone_number || "",
            address: request.address || user.address || "",
            profile_image: request.profile_image || user.profile_img || "",
            date_of_birth: new Date(request.date_of_birth).toISOString().split("T")[0],
            education_record: request.education_record,
            id_card_url: request.id_card_url || "",
            contact_channels: request.contact_channels || { line: "", facebook: "", instagram: "" },
            swimming_instructor_license: request.swimming_instructor_license || "",
            teaching_history: request.teaching_history || "",
            additional_skills: request.additional_skills || "",
          })
          setImagePreview(request.profile_image || user.profile_img || null)
          setIdCardPreview(request.id_card_url || null)
          setLicensePreview(request.swimming_instructor_license || null)
        }
      } catch (err) {
        console.error("Error fetching existing request:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExistingRequest()
  }, [user, router])

  // Validate form data
  const validateForm = (section?: number) => {
    const errors: ValidationErrors = {}

    // Section 1 validation
    if (section === 1 || section === undefined) {
      if (!formData.full_name.trim()) {
        errors.full_name = "Full name is required"
      }

      if (!formData.phone_number.trim()) {
        errors.phone_number = "Phone number is required"
      } else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.phone_number.trim())) {
        errors.phone_number = "Please enter a valid phone number"
      }

      if (!formData.address.trim()) {
        errors.address = "Address is required"
      }

      if (!formData.date_of_birth) {
        errors.date_of_birth = "Date of birth is required"
      } else {
        const birthDate = new Date(formData.date_of_birth)
        const today = new Date()
        const minAge = 18
        const maxAge = 100

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }

        if (age < minAge) {
          errors.date_of_birth = "You must be at least 18 years old"
        } else if (age > maxAge) {
          errors.date_of_birth = "Please enter a valid date of birth"
        }
      }

      if (!formData.education_record.trim()) {
        errors.education_record = "Education record is required"
      }

      if (!formData.profile_image && !selectedImage) {
        errors.profile_image = "Profile image is required"
      }
    }

    // Section 2 validation
    if (section === 2 || section === undefined) {
      // ID card validation
      if (!formData.id_card_url && !selectedIdCard) {
        errors.id_card_url = "ID card is required"
      }

      // Contact channels validation - optional but if provided, validate format
      const contactErrors: { line?: string; facebook?: string; instagram?: string } = {}

      if (formData.contact_channels.facebook && !formData.contact_channels.facebook.includes("facebook.com")) {
        contactErrors.facebook = "Please enter a valid Facebook profile URL"
      }

      if (formData.contact_channels.instagram && !formData.contact_channels.instagram.includes("instagram.com")) {
        contactErrors.instagram = "Please enter a valid Instagram profile URL"
      }

      if (Object.keys(contactErrors).length > 0) {
        errors.contact_channels = contactErrors
      }
    }

    // Section 3 validation
    if (section === 3 || section === undefined) {
      if (!formData.swimming_instructor_license && !selectedLicense) {
        errors.swimming_instructor_license = "Swimming instructor license is required"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear validation error when user types
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
    validateForm()
  }

  const handleContactChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      contact_channels: { ...prev.contact_channels, [name]: value },
    }))

    // Clear validation error when user types
    if (
      validationErrors.contact_channels &&
      validationErrors.contact_channels[name as keyof typeof validationErrors.contact_channels]
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        contact_channels: {
          ...prev.contact_channels,
          [name]: undefined,
        },
      }))
    }
  }

  const handleContactChannelBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouchedFields((prev) => ({ ...prev, [`contact_channels.${name}`]: true }))
    validateForm()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "idCard" | "license") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "profile" && !file.type.startsWith("image/")) {
        setValidationErrors((prev) => ({ ...prev, profile_image: "Profile image must be an image file" }))
        return
      }
      if (
        (type === "idCard" || type === "license") &&
        !["image/", "application/pdf"].some((t) => file.type.startsWith(t))
      ) {
        const fieldName = type === "idCard" ? "id_card_url" : "swimming_instructor_license"
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: `${type === "idCard" ? "ID card" : "Swimming instructor license"} must be an image or PDF file`,
        }))
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "profile") {
          setImagePreview(reader.result as string)
          setSelectedImage(file)
          setValidationErrors((prev) => ({ ...prev, profile_image: undefined }))
        } else if (type === "idCard") {
          setIdCardPreview(reader.result as string)
          setSelectedIdCard(file)
          setValidationErrors((prev) => ({ ...prev, id_card_url: undefined }))
        } else {
          setLicensePreview(reader.result as string)
          setSelectedLicense(file)
          setValidationErrors((prev) => ({ ...prev, swimming_instructor_license: undefined }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Mark all fields as touched
    const allFields = [
      "full_name",
      "phone_number",
      "address",
      "profile_image",
      "date_of_birth",
      "education_record",
      "id_card_url",
      "swimming_instructor_license",
      "contact_channels.line",
      "contact_channels.facebook",
      "contact_channels.instagram",
    ]
    const touchedState = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    setTouchedFields(touchedState)

    // Validate all form sections
    const isValid = validateForm()

    if (!isValid) {
      setError("Please fix the validation errors before submitting")
      return
    }

    setIsSubmitting(true)

    try {
      // Initialize with existing values or empty strings as fallback
      let profileImageUrl = formData.profile_image || ""
      let idCardUrl = formData.id_card_url || ""
      let licenseUrl = formData.swimming_instructor_license || ""

      // Upload profile image if changed
      if (selectedImage) {
        const uploadResult = await uploadProfileImage(user.user_id, selectedImage)
        profileImageUrl = uploadResult.resource_url
      }

      // Upload ID card if changed
      if (selectedIdCard) {
        const uploadResult = await uploadIdCard(user.user_id, selectedIdCard)
        idCardUrl = uploadResult.resource_url
      }

      // Upload swimming instructor license if changed
      if (selectedLicense) {
        const uploadResult = await uploadSwimmingLicense(user.user_id, selectedLicense)
        licenseUrl = uploadResult.resource_url
      }

      const requestData = {
        ...formData,
        profile_image: profileImageUrl,
        id_card_url: idCardUrl,
        swimming_instructor_license: licenseUrl,
      }

      if (existingRequest && existingRequest.status === "rejected") {
        await updateInstructorRequest(existingRequest.request_id, requestData)
        setSuccessMessage("Instructor request updated and resubmitted successfully! Waiting for admin approval.")
      } else if (!existingRequest) {
        await submitInstructorRequest(user.user_id, requestData)
        setSuccessMessage("Instructor request submitted successfully! Waiting for admin approval.")
      } else {
        setError("You already have an Instructor request. Please wait for admin review or edit if rejected.")
        setIsSubmitting(false)
        return
      }

      await refreshUser()
      const response = await getInstructorRequestByUserId(user.user_id)
      setExistingRequest(response.request)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit Instructor request")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextSection = () => {
    // Validate current section before proceeding
    const isValid = validateForm(activeSection)

    // Mark fields in current section as touched
    let sectionFields: string[] = []

    if (activeSection === 1) {
      sectionFields = ["full_name", "phone_number", "address", "profile_image", "date_of_birth", "education_record"]
    } else if (activeSection === 2) {
      sectionFields = [
        "id_card_url",
        "contact_channels.line",
        "contact_channels.facebook",
        "contact_channels.instagram",
      ]
    } else if (activeSection === 3) {
      sectionFields = ["swimming_instructor_license"]
    }

    const newTouchedFields = sectionFields.reduce((acc, field) => ({ ...acc, [field]: true }), { ...touchedFields })
    setTouchedFields(newTouchedFields)

    if (isValid && activeSection < 3) {
      setActiveSection(activeSection + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1)
      window.scrollTo(0, 0)
    }
  }

  // Helper function to determine if a field has an error and should show it
  const showError = (fieldName: string) => {
    const nestedFields = fieldName.split(".")

    if (nestedFields.length > 1) {
      // Handle nested fields like contact_channels.line
      const [parent, child] = nestedFields
      return (
        touchedFields[fieldName] &&
        validationErrors[parent as keyof ValidationErrors] &&
        (validationErrors[parent as keyof ValidationErrors] as any)[child]
      )
    }

    return touchedFields[fieldName] && validationErrors[fieldName as keyof ValidationErrors]
  }

  // Helper function to get error message for a field
  const getErrorMessage = (fieldName: string) => {
    const nestedFields = fieldName.split(".")

    if (nestedFields.length > 1) {
      // Handle nested fields like contact_channels.line
      const [parent, child] = nestedFields
      return (
        validationErrors[parent as keyof ValidationErrors] &&
        (validationErrors[parent as keyof ValidationErrors] as any)[child]
      )
    }

    return validationErrors[fieldName as keyof ValidationErrors]
  }

  if (loading) {
    return <LoadingPage />
  }

  if (existingRequest && existingRequest.status !== "rejected") {
    return (
      <div className="p-4 max-w-5xl mx-auto my-6">
        <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6 animate-fadeIn`}>
          <SectionTitle description={`Your application is currently ${existingRequest.status}`}>
            Instructor Application Status
          </SectionTitle>

          <div className="mt-5 flex flex-col items-center justify-center text-center">
            {existingRequest.status === "pending" && (
              <>
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-20 h-20 rounded-full ${isDarkMode ? "bg-blue-900" : "bg-blue-50"} flex items-center justify-center`}
                  >
                    <Clock className={`h-10 w-10 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                    Application Under Review
                  </h3>
                </div>
                <div>
                  <div className={`${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"} p-4 rounded-lg`}>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Your instructor application is currently being reviewed by our team. We'll notify you once a
                      decision has been made.
                    </p>
                    <div className={`mt-3 flex items-center text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Submitted on {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {existingRequest.status === "approved" && (
              <>
                <div className="flex flex-col items-center space-y-3">
                  <div
                    className={`w-20 h-20 rounded-full ${isDarkMode ? "bg-green-900" : "bg-green-50"} flex items-center justify-center`}
                  >
                    <CheckCircle className={`h-10 w-10 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                    Application Approved!
                  </h3>
                </div>
                <div>
                  <div className={`${isDarkMode ? "bg-green-900/30" : "bg-green-50"} p-4 rounded-lg`}>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Congratulations! Your instructor application has been approved. You can now access the instructor
                      dashboard and start creating courses.
                    </p>
                    <div className="mt-3">
                      <Button variant="primary" onClick={() => router.push("/teacher")}>
                        Go to Instructor Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-5xl mx-auto my-6">
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6 animate-fadeIn`}>
        <SectionTitle
          description={
            existingRequest ? "Update your rejected application" : "Share your expertise and teach swimming courses"
          }
        >
          {existingRequest ? "Edit Instructor Application" : "Become an Instructor"}
        </SectionTitle>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <div className="w-full flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection >= 1
                  ? "bg-blue-600 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 flex-1 ${
                activeSection >= 2 ? "bg-blue-600" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection >= 2
                  ? "bg-blue-600 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`h-1 flex-1 ${
                activeSection >= 3 ? "bg-blue-600" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeSection >= 3
                  ? "bg-blue-600 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md animate-fadeIn dark:bg-green-900/30 dark:border-green-400">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 dark:text-green-400" />
              <p className="text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-fadeIn dark:bg-red-900/30 dark:border-red-400">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {existingRequest && existingRequest.status === "rejected" && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md animate-fadeIn dark:bg-amber-900/30 dark:border-amber-400">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 dark:text-amber-400" />
              <div>
                <p className="text-amber-700 font-medium dark:text-amber-300">Your application was rejected</p>
                <p className="text-amber-600 mt-1 dark:text-amber-300/90">Reason: {existingRequest.rejection_reason}</p>
                <p className="text-amber-600 mt-1 dark:text-amber-300/90">
                  Please update your information and resubmit.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Information */}
          {activeSection === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3
                className={`text-lg font-semibold ${isDarkMode ? "text-gray-100 border-gray-700" : "text-gray-800 border-gray-200"} border-b pb-1.5 mb-3`}
              >
                Personal Information
              </h3>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="space-y-3">
                    <div>
                      <label
                        className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                      >
                        <User className="inline-block w-4 h-4 mr-1" /> Full Name
                      </label>
                      <Input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        } ${showError("full_name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        required
                      />
                      {showError("full_name") && (
                        <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{getErrorMessage("full_name")}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                      >
                        <Phone className="inline-block w-4 h-4 mr-1" /> Phone Number
                      </label>
                      <Input
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        } ${showError("phone_number") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        required
                      />
                      {showError("phone_number") && (
                        <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{getErrorMessage("phone_number")}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                      >
                        <MapPin className="inline-block w-4 h-4 mr-1" /> Address
                      </label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        } ${showError("address") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        required
                      />
                      {showError("address") && (
                        <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{getErrorMessage("address")}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                      >
                        <Calendar className="inline-block w-4 h-4 mr-1" /> Date of Birth
                      </label>
                      <Input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        } ${
                          showError("date_of_birth") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        required
                      />
                      {showError("date_of_birth") && (
                        <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{getErrorMessage("date_of_birth")}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                      >
                        <School className="inline-block w-4 h-4 mr-1" /> Education Record
                      </label>
                      <Input
                        name="education_record"
                        value={formData.education_record}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full rounded-md ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                            : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        } ${
                          showError("education_record") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                        required
                      />
                      {showError("education_record") && (
                        <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{getErrorMessage("education_record")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-start md:pl-4">
                  <label
                    className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-3 self-start`}
                  >
                    <Upload className="inline-block w-4 h-4 mr-1" /> Profile Image
                  </label>

                  <div
                    className={`w-40 h-40 border-2 ${
                      showError("profile_image")
                        ? "border-red-500"
                        : isDarkMode
                          ? "border-dashed border-gray-600"
                          : "border-dashed border-gray-300"
                    } rounded-full flex flex-col items-center justify-center overflow-hidden ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-50 hover:bg-gray-100"
                    } transition-colors mb-3`}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload
                          className={`mx-auto h-10 w-10 ${
                            showError("profile_image") ? "text-red-400" : isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`mt-2 text-sm ${
                            showError("profile_image")
                              ? "text-red-500 dark:text-red-400"
                              : isDarkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                          }`}
                        >
                          Upload profile photo
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile")}
                    className={`w-full text-sm ${
                      showError("profile_image")
                        ? "text-red-500 dark:text-red-400"
                        : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                    }
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      ${
                        showError("profile_image")
                          ? "file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-400 dark:hover:file:bg-red-900/50"
                          : isDarkMode
                            ? "file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50"
                            : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      }`}
                    required={!formData.profile_image}
                  />
                  {showError("profile_image") && (
                    <div className="text-red-500 text-sm mt-1 flex items-start self-start dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{getErrorMessage("profile_image")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Contact & Credentials */}
          {activeSection === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h3
                className={`text-lg font-semibold ${isDarkMode ? "text-gray-100 border-gray-700" : "text-gray-800 border-gray-200"} border-b pb-1.5 mb-3`}
              >
                Contact Channels & Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Contact Channels</h4>

                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      <MessageCircle className="inline-block w-4 h-4 mr-1" /> Line ID
                    </label>
                    <Input
                      name="line"
                      placeholder="Your Line ID"
                      value={formData.contact_channels.line}
                      onChange={handleContactChannelChange}
                      onBlur={handleContactChannelBlur}
                      className={`w-full rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                          : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      } ${
                        showError("contact_channels.line")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {showError("contact_channels.line") && (
                      <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{getErrorMessage("contact_channels.line")}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      <Facebook className="inline-block w-4 h-4 mr-1" /> Facebook
                    </label>
                    <Input
                      name="facebook"
                      placeholder="Your Facebook profile"
                      value={formData.contact_channels.facebook}
                      onChange={handleContactChannelChange}
                      onBlur={handleContactChannelBlur}
                      className={`w-full rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                          : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      } ${
                        showError("contact_channels.facebook")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {showError("contact_channels.facebook") && (
                      <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{getErrorMessage("contact_channels.facebook")}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      <Instagram className="inline-block w-4 h-4 mr-1" /> Instagram
                    </label>
                    <Input
                      name="instagram"
                      placeholder="Your Instagram handle"
                      value={formData.contact_channels.instagram}
                      onChange={handleContactChannelChange}
                      onBlur={handleContactChannelBlur}
                      className={`w-full rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                          : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      } ${
                        showError("contact_channels.instagram")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {showError("contact_channels.instagram") && (
                      <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{getErrorMessage("contact_channels.instagram")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>ID Verification</h4>

                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      <FileText className="inline-block w-4 h-4 mr-1" /> ID Card (PDF or Image)
                    </label>

                    <div
                      className={`mt-1 flex justify-center px-4 pt-4 pb-4 border-2 ${
                        showError("id_card_url")
                          ? "border-red-500"
                          : isDarkMode
                            ? "border-dashed border-gray-600"
                            : "border-dashed border-gray-300"
                      } rounded-md ${isDarkMode ? "hover:bg-gray-700/70" : "hover:bg-gray-50"} transition-colors`}
                    >
                      <div className="space-y-1 text-center">
                        {idCardPreview && idCardPreview.startsWith("data:image/") ? (
                          <img
                            src={idCardPreview || "/placeholder.svg"}
                            alt="ID Card Preview"
                            className="mx-auto h-28 object-contain"
                          />
                        ) : (
                          <>
                            <FileText
                              className={`mx-auto h-12 w-12 ${
                                showError("id_card_url")
                                  ? "text-red-400"
                                  : isDarkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              }`}
                            />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label
                                className={`relative cursor-pointer rounded-md font-medium ${
                                  showError("id_card_url")
                                    ? "text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                                    : isDarkMode
                                      ? "text-blue-400 hover:text-blue-300"
                                      : "text-blue-600 hover:text-blue-500"
                                }`}
                              >
                                <span>{idCardPreview ? "ID card uploaded" : "Upload ID card"}</span>
                              </label>
                            </div>
                            <p
                              className={`text-xs ${
                                showError("id_card_url")
                                  ? "text-red-500 dark:text-red-400"
                                  : isDarkMode
                                    ? "text-gray-400"
                                    : "text-gray-500"
                              }`}
                            >
                              PNG, JPG, or PDF up to 10MB
                            </p>
                          </>
                        )}

                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange(e, "idCard")}
                          className={`w-full text-sm ${
                            showError("id_card_url")
                              ? "text-red-500 dark:text-red-400"
                              : isDarkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                          }
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            ${
                              showError("id_card_url")
                                ? "file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-400 dark:hover:file:bg-red-900/50"
                                : isDarkMode
                                  ? "file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50"
                                  : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            }`}
                          required={!formData.id_card_url}
                        />
                      </div>
                    </div>
                    {showError("id_card_url") && (
                      <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{getErrorMessage("id_card_url")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Professional Information */}
          {activeSection === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h3
                className={`text-lg font-semibold ${isDarkMode ? "text-gray-100 border-gray-700" : "text-gray-800 border-gray-200"} border-b pb-1.5 mb-3`}
              >
                Professional Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    <Award className="inline-block w-4 h-4 mr-1" /> Swimming Instructor License (PDF or Image)
                  </label>

                  <div
                    className={`mt-1 flex justify-center px-4 pt-4 pb-4 border-2 ${
                      showError("swimming_instructor_license")
                        ? "border-red-500"
                        : isDarkMode
                          ? "border-dashed border-gray-600"
                          : "border-dashed border-gray-300"
                    } rounded-md ${isDarkMode ? "hover:bg-gray-700/70" : "hover:bg-gray-50"} transition-colors`}
                  >
                    <div className="space-y-1 text-center">
                      {licensePreview && licensePreview.startsWith("data:image/") ? (
                        <img
                          src={licensePreview || "/placeholder.svg"}
                          alt="License Preview"
                          className="mx-auto h-28 object-contain"
                        />
                      ) : (
                        <>
                          <Award
                            className={`mx-auto h-12 w-12 ${
                              showError("swimming_instructor_license")
                                ? "text-red-400"
                                : isDarkMode
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            }`}
                          />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              className={`relative cursor-pointer rounded-md font-medium ${
                                showError("swimming_instructor_license")
                                  ? "text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                                  : isDarkMode
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-500"
                              }`}
                            >
                              <span>{licensePreview ? "License uploaded" : "Upload license"}</span>
                            </label>
                          </div>
                          <p
                            className={`text-xs ${
                              showError("swimming_instructor_license")
                                ? "text-red-500 dark:text-red-400"
                                : isDarkMode
                                  ? "text-gray-400"
                                  : "text-gray-500"
                            }`}
                          >
                            PNG, JPG, or PDF up to 10MB
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, "license")}
                        className={`w-full text-sm ${
                          showError("swimming_instructor_license")
                            ? "text-red-500 dark:text-red-400"
                            : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                        }
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          ${
                            showError("swimming_instructor_license")
                              ? "file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/30 dark:file:text-red-400 dark:hover:file:bg-red-900/50"
                              : isDarkMode
                                ? "file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50"
                                : "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          }`}
                        required={!formData.swimming_instructor_license}
                      />
                    </div>
                  </div>
                  {showError("swimming_instructor_license") && (
                    <div className="text-red-500 text-sm mt-1 flex items-start dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{getErrorMessage("swimming_instructor_license")}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      <History className="inline-block w-4 h-4 mr-1" /> Teaching History (Optional)
                    </label>
                    <textarea
                      name="teaching_history"
                      value={formData.teaching_history}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                          : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Share your previous teaching experience..."
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      <Sparkles className="inline-block w-4 h-4 mr-1" /> Additional Skills (Optional)
                    </label>
                    <textarea
                      name="additional_skills"
                      value={formData.additional_skills}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                          : "border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      placeholder="Languages, special skills, certifications..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`flex justify-between pt-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"} border-t`}>
            <Button
              type="button"
              variant={isDarkMode ? "outline" : "secondary"}
              onClick={prevSection}
              disabled={activeSection === 1}
              className={activeSection === 1 ? "opacity-50 cursor-not-allowed" : ""}
            >
              Previous
            </Button>

            <div>
              {activeSection < 3 ? (
                <Button type="button" variant="primary" onClick={nextSection}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="gradient" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : existingRequest ? (
                    "Resubmit Application"
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InstructorRequestPage
