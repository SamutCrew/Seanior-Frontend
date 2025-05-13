"use client"

import type { Course } from "@/types/course"
import CourseForm from "../CourseForm"
import Modal from "@/components/UI/Modal"

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Course>) => void
  course: Course | null
}

export default function EditCourseModal({ isOpen, onClose, onSubmit, course }: EditCourseModalProps) {
  if (!isOpen || !course) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Course">
      <div className="p-6">
        <CourseForm initialData={course} onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </Modal>
  )
}
