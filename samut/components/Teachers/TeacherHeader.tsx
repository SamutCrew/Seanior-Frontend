"use client"

import type React from "react"
import { FaChalkboardTeacher, FaSearch } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"

interface TeacherHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export default function TeacherHeader({ searchTerm, setSearchTerm }: TeacherHeaderProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center gap-3`}>
          <FaChalkboardTeacher className="text-cyan-600" />
          Teacher Management Dashboard
        </h1>
        <p className={`${isDarkMode ? "text-slate-300" : "text-slate-500"} mt-1`}>
          Manage your teaching schedule and courses
        </p>
      </div>
      <div className="relative w-full md:w-auto">
        <FaSearch className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search courses..."
          className={`w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
            isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300"
          }`}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
