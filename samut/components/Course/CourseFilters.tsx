"use client"

import { FaSearch, FaFilter } from "react-icons/fa"

interface CourseFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedLevel: string
  setSelectedLevel: (level: string) => void
  view: "grid" | "list"
  setView: (view: "grid" | "list") => void
}

export default function CourseFilters({
  searchTerm,
  setSearchTerm,
  selectedLevel,
  setSelectedLevel,
  view,
  setView,
}: CourseFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-white w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="bg-white border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors duration-200 w-full md:w-auto"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-lg border transition-colors duration-200">
            <FaFilter /> Filters
          </button>
          <div className="hidden md:flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 ${view === "grid" ? "bg-sky-100 text-sky-700" : "bg-white text-gray-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 ${view === "list" ? "bg-sky-100 text-sky-700" : "bg-white text-gray-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
