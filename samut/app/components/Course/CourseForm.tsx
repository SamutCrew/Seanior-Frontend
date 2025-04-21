"use client"

import { useState } from "react"
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa"

interface CourseFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function CourseForm({ initialData, onSubmit, onCancel }: CourseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [focus, setFocus] = useState(initialData?.focus || "")
  const [level, setLevel] = useState(initialData?.level || "")
  const [duration, setDuration] = useState(initialData?.duration || "")
  const [schedule, setSchedule] = useState(initialData?.schedule || "")
  const [address, setAddress] = useState(initialData?.location?.address || "")
  const [price, setPrice] = useState(initialData?.price || "")
  const [students, setStudents] = useState(initialData?.students || "")

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit({
      title,
      focus,
      level,
      duration,
      schedule,
      location: { address },
      price,
      students,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="focus" className="block text-sm font-medium text-gray-700">
          Focus
        </label>
        <input
          type="text"
          id="focus"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
          Level
        </label>
        <select
          id="level"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Duration
        </label>
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="duration"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm pl-10"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 8 weeks"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
          Schedule
        </label>
        <div className="relative">
          <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="schedule"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm pl-10"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="e.g., Mon/Wed 5-6pm"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm pl-10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., Skyline Aquatic Center, Pool 2"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="students" className="block text-sm font-medium text-gray-700">
          Students
        </label>
        <input
          type="number"
          id="students"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          value={students}
          onChange={(e) => setStudents(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  )
}
