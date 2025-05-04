"use client"

import type { InstructorFilters } from "../../types/instructor"
import { useAppSelector } from "@/app/redux"

interface InstructorFiltersProps {
  filters: InstructorFilters
  setFilters: (filters: InstructorFilters) => void
}

export const InstructorFiltersComponent = ({ filters, setFilters }: InstructorFiltersProps) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Swimming Style
        </label>
        <select
          className={`w-full border rounded-md p-2 ${
            isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white text-black border-gray-300"
          }`}
          value={filters.style}
          onChange={(e) => setFilters({ ...filters, style: e.target.value })}
        >
          <option value="">All Styles</option>
          <option value="Freestyle">Freestyle</option>
          <option value="Breaststroke">Breaststroke</option>
          <option value="Backstroke">Backstroke</option>
          <option value="Butterfly">Butterfly</option>
          <option value="Medley">Medley</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Teaches Level
        </label>
        <select
          className={`w-full border rounded-md p-2 ${
            isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white text-black border-gray-300"
          }`}
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Lesson Type
        </label>
        <select
          className={`w-full border rounded-md p-2 ${
            isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white text-black border-gray-300"
          }`}
          value={filters.lessonType}
          onChange={(e) => setFilters({ ...filters, lessonType: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="Private">Private Lessons</option>
          <option value="Group">Group Lessons</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Certification
        </label>
        <select
          className={`w-full border rounded-md p-2 ${
            isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white text-black border-gray-300"
          }`}
          value={filters.certification}
          onChange={(e) => setFilters({ ...filters, certification: e.target.value })}
        >
          <option value="">Any Certification</option>
          <option value="ASCA">ASCA Certified</option>
          <option value="RedCross">Red Cross Certified</option>
          <option value="USMS">USMS Certified</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Min Rating
        </label>
        <select
          className={`w-full border rounded-md p-2 ${
            isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white text-black border-gray-300"
          }`}
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
        >
          <option value="0">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Price Range
        </label>
        <select
          className={`w-full border rounded-md p-2 ${
            isDarkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white text-black border-gray-300"
          }`}
          value={filters.priceRange}
          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
        >
          <option value="">Any Price</option>
          <option value="0-50">$0-$50/hr</option>
          <option value="50-80">$50-$80/hr</option>
          <option value="80-120">$80-$120/hr</option>
          <option value="120-">$120+/hr</option>
        </select>
      </div>
    </div>
  )
}
