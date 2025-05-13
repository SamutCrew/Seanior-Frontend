"use client"

import { useState, useEffect } from "react"
import type { Course } from "@/types/course"
import Modal from "@/components/UI/Modal"
import { useAppSelector } from "@/app/redux"
import { uploadCourseImage, uploadPoolImage } from "@/api/course_api"

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Course>) => void
  course: Course | null
}

export default function EditCourseModal({ isOpen, onClose, onSubmit, course }: EditCourseModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [updateFormData, setUpdateFormData] = useState<Partial<Course>>({})
  const [courseImageFile, setCourseImageFile] = useState<File | null>(null)
  const [poolImageFile, setPoolImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Initialize form data when course changes or modal opens
  useEffect(() => {
    console.log("Course data for edit modal:", course)
    if (course) {
      // Map UI course data back to API format
      setUpdateFormData({
        course_id: course.id || course.course_id,
        course_name: course.title || course.course_name || "",
        instructor_id: course.instructor_id || "",
        price: course.price || 0,
        pool_type: course.courseType || course.pool_type || "",
        location: typeof course.location === "object" ? course.location.address : course.location || "",
        description: course.description || "",
        course_duration:
          typeof course.duration === "string"
            ? Number.parseInt(course.duration.split(" ")[0])
            : course.course_duration || 8,
        level: course.level || "",
        schedule: course.schedule || "",
        max_students: course.maxStudents || course.max_students || 10,
        course_image: course.image || course.course_image || "",
        pool_image: course.poolImage || course.pool_image || "",
        rating: course.rating || 0,
        students: course.students || 0,
      })
    }
  }, [course, isOpen])

  if (!isOpen || !course) return null

  const handleUpdateFormChange = (field: string, value: any) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (type: "course" | "pool") => {
    if (!course?.id && !course?.course_id) return

    try {
      setUploadingImage(true)
      setUploadError(null)
      const courseId = course.id || course.course_id

      let result
      if (type === "course" && courseImageFile) {
        result = await uploadCourseImage(courseId, courseImageFile)
        setUpdateFormData((prev) => ({
          ...prev,
          course_image: result.resource_url,
        }))
      } else if (type === "pool" && poolImageFile) {
        result = await uploadPoolImage(courseId, poolImageFile)
        setUpdateFormData((prev) => ({
          ...prev,
          pool_image: result.resource_url,
        }))
      }
    } catch (err: any) {
      console.error(`Failed to upload ${type} image:`, err)
      setUploadError(`Failed to upload ${type} image: ${err.message || "Unknown error"}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = () => {
    console.log("Submitting form data:", updateFormData)
    onSubmit(updateFormData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Course">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Course Name</label>
            <input
              type="text"
              value={updateFormData.course_name || ""}
              onChange={(e) => handleUpdateFormChange("course_name", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Price</label>
            <input
              type="number"
              value={updateFormData.price || ""}
              onChange={(e) => handleUpdateFormChange("price", Number(e.target.value))}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Pool Type</label>
            <input
              type="text"
              value={updateFormData.pool_type || ""}
              onChange={(e) => handleUpdateFormChange("pool_type", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Location</label>
            <input
              type="text"
              value={typeof updateFormData.location === "string" ? updateFormData.location : ""}
              onChange={(e) => handleUpdateFormChange("location", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div className="col-span-full">
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Description</label>
            <textarea
              value={updateFormData.description || ""}
              onChange={(e) => handleUpdateFormChange("description", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
              rows={3}
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Duration (weeks)</label>
            <input
              type="number"
              value={updateFormData.course_duration || ""}
              onChange={(e) => handleUpdateFormChange("course_duration", Number(e.target.value))}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
              placeholder="e.g., 8"
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Level</label>
            <input
              type="text"
              value={updateFormData.level || ""}
              onChange={(e) => handleUpdateFormChange("level", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Schedule</label>
            <input
              type="text"
              value={typeof updateFormData.schedule === "string" ? updateFormData.schedule : ""}
              onChange={(e) => handleUpdateFormChange("schedule", e.target.value)}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Max Students</label>
            <input
              type="number"
              value={updateFormData.max_students || ""}
              onChange={(e) => handleUpdateFormChange("max_students", Number(e.target.value))}
              className={`w-full p-2 rounded border ${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div className="col-span-full">
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCourseImageFile(e.target.files?.[0] || null)}
              className={`mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
            />
            <button
              onClick={() => handleImageUpload("course")}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={!courseImageFile || uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "Upload Course Image"}
            </button>
            {updateFormData.course_image && (
              <img
                src={updateFormData.course_image || "/placeholder.svg"}
                alt={`${updateFormData.course_name} course image`}
                className="w-full max-w-xs rounded mt-2"
              />
            )}
          </div>

          <div className="col-span-full">
            <label className={`block mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Pool Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPoolImageFile(e.target.files?.[0] || null)}
              className={`mb-2 ${isDarkMode ? "text-white" : "text-gray-700"}`}
            />
            <button
              onClick={() => handleImageUpload("pool")}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={!poolImageFile || uploadingImage}
            >
              {uploadingImage ? "Uploading..." : "Upload Pool Image"}
            </button>
            {updateFormData.pool_image && (
              <img
                src={updateFormData.pool_image || "/placeholder.svg"}
                alt={`${updateFormData.course_name} pool image`}
                className="w-full max-w-xs rounded mt-2"
              />
            )}
          </div>
        </div>

        {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  )
}
