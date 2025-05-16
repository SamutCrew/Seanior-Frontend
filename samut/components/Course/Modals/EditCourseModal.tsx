"use client"

import { useState, useEffect } from "react"
import { useAppSelector } from "@/app/redux"
import Modal from "@/components/UI/Modal"
import EnhancedCourseForm from "../EnhancedCourseForm"
import { updateCourse, uploadCourseImage, uploadPoolImage } from "@/api/course_api"
import type { Course } from "@/types/course"
import AlertResponse from "@/components/Responseback/AlertResponse"

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: Partial<Course>) => void
  course: Course | null
  onCourseUpdated?: () => void
}

export default function EditCourseModal({ isOpen, onClose, onSubmit, course, onCourseUpdated }: EditCourseModalProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertState, setAlertState] = useState<{
    show: boolean
    message: string
    type: "success" | "error" | "info"
  }>({
    show: false,
    message: "",
    type: "info",
  })

  // Reset form state when modal opens with a new course
  useEffect(() => {
    if (isOpen && course) {
      setIsSubmitting(false)
      setAlertState({ show: false, message: "", type: "info" })
    }
  }, [isOpen, course])

  const handleSubmit = async (formData: Partial<Course>) => {
    if (!course?.course_id) {
      setAlertState({
        show: true,
        message: "Course ID is missing. Cannot update course.",
        type: "error",
      })
      return
    }

    setIsSubmitting(true)
    setAlertState({ show: false, message: "", type: "info" })

    try {
      console.log("Submitting course update for:", course.course_id)
      console.log("Form data:", formData)

      // Extract image files from form data
      const courseImageFile = formData.courseImageFile
      const poolImageFile = formData.poolImageFile

      // Remove image files from data sent to update API
      const { courseImageFile: _, poolImageFile: __, ...updateData } = formData

      // Update course data
      const updatedCourse = await updateCourse(course.course_id, updateData)
      console.log("Course updated successfully:", updatedCourse)

      // If onSubmit prop is provided, call it
      if (typeof onSubmit === "function") {
        await onSubmit(updateData)
      }

      // Upload course image if provided
      if (courseImageFile) {
        try {
          console.log("Uploading course image...")
          await uploadCourseImage(course.course_id, courseImageFile)
          console.log("Course image uploaded successfully")
        } catch (imageError: any) {
          console.error("Error uploading course image:", imageError)
          setAlertState({
            show: true,
            message: `Course updated but course image upload failed: ${imageError.message}`,
            type: "error",
          })
        }
      }

      // Upload pool image if provided
      if (poolImageFile) {
        try {
          console.log("Uploading pool image...")
          await uploadPoolImage(course.course_id, poolImageFile)
          console.log("Pool image uploaded successfully")
        } catch (imageError: any) {
          console.error("Error uploading pool image:", imageError)
          setAlertState({
            show: true,
            message: `Course updated but pool image upload failed: ${imageError.message}`,
            type: "error",
          })
          // Continue execution - we still want to show success for the course update
        }
      }

      // If we got here without setting an error alert, show success
      if (!alertState.show) {
        setAlertState({
          show: true,
          message: "Course updated successfully!",
          type: "success",
        })
      }

      // Notify parent component that course was updated
      if (typeof onCourseUpdated === "function") {
        onCourseUpdated()
      }

      // Close modal after a short delay to show the success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error: any) {
      console.error("Error updating course:", error)
      setAlertState({
        show: true,
        message: `Failed to update course: ${error.message}`,
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Course: ${course?.course_name || ""}`}
      size="2xl"
      isDarkMode={isDarkMode}
    >
      {alertState.show && (
        <div className="mb-4">
          <AlertResponse
            message={alertState.message}
            type={alertState.type}
            onClose={() => setAlertState({ ...alertState, show: false })}
          />
        </div>
      )}

      {/* คำแนะนำการแก้ไขข้อมูล */}
      <div
        className={`mb-6 p-4 rounded-lg ${isDarkMode ? "bg-slate-700/50 border border-slate-600" : "bg-blue-50 border border-blue-100"}`}
      >
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          คำแนะนำการแก้ไขข้อมูล
        </h3>
        <ul className={`list-disc pl-5 space-y-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <li>แก้ไขข้อมูลเฉพาะส่วนที่ต้องการเปลี่ยนแปลง</li>
          <li>ราคาให้กรอกเป็นบาท เช่น 10.00 สำหรับ 10 บาท (ระบบจะแปลงเป็นสตางค์อัตโนมัติ)</li>
          <li>หากต้องการอัพโหลดรูปภาพใหม่ ให้เลือกไฟล์รูปภาพที่ต้องการ</li>
        </ul>
      </div>

      {course && (
        <EnhancedCourseForm
          initialData={course}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      )}
    </Modal>
  )
}
