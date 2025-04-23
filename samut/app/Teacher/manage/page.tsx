"use client"

import { useState } from "react"
import TeacherHeader from "@/components/TeachersManage/TeacherHeader"
import TeacherStats from "@/components/TeachersManage/TeacherStats"
import CalendarView from "@/components/TeachersManage/CalendarView"
import RequestsPanel from "@/components/TeachersManage/RequestsPanel"
import TeachingSchedule from "@/components/TeachersManage/TeachingSchedule"
import AvailableCourses from "@/components/TeachersManage/AvailableCourses"
import type { ScheduleItem, Course } from "@/types/schedule"

export default function TeacherManagement() {
  // Sample schedule data
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: 1,
      date: "2023-06-01",
      day: "Monday",
      courses: [
        {
          id: 101,
          title: "Beginner Swimming",
          level: "Beginner",
          schedule: "9:00 AM - 10:30 AM",
          students: 8,
          maxStudents: 12,
          location: "Main Pool",
        },
        {
          id: 102,
          title: "Advanced Techniques",
          level: "Advanced",
          schedule: "4:00 PM - 5:30 PM",
          students: 6,
          maxStudents: 10,
          location: "Olympic Pool",
        },
      ],
    },
    {
      id: 2,
      date: "2023-06-02",
      day: "Tuesday",
      courses: [
        {
          id: 103,
          title: "Intermediate Stroke",
          level: "Intermediate",
          schedule: "10:00 AM - 11:30 AM",
          students: 10,
          maxStudents: 12,
          location: "Main Pool",
        },
      ],
    },
    {
      id: 3,
      date: "2023-06-03",
      day: "Wednesday",
      courses: [
        {
          id: 104,
          title: "Kids Swimming",
          level: "Beginner",
          schedule: "3:00 PM - 4:00 PM",
          students: 12,
          maxStudents: 15,
          location: "Kids Pool",
        },
      ],
    },
  ])

  // Available courses (not yet scheduled)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([
    {
      id: 201,
      title: "Freestyle Mastery",
      level: "Intermediate",
      schedule: "Not Scheduled",
      students: 0,
      maxStudents: 12,
      location: "TBD",
    },
    {
      id: 202,
      title: "Water Safety",
      level: "Beginner",
      schedule: "Not Scheduled",
      students: 0,
      maxStudents: 15,
      location: "TBD",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState("schedule")

  // Simulated requests
  const [requests, setRequests] = useState([
    { id: 1, name: "John Doe", type: "Join Beginner Swimming", date: "2023-06-01" },
    { id: 2, name: "Jane Smith", type: "Schedule Change Request", date: "2023-06-02" },
  ])

  // Filter schedule items based on search term
  const filteredSchedule = schedule
    .map((day) => ({
      ...day,
      courses: day.courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.location.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((day) => day.courses.length > 0)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TeacherHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Stats Cards */}
        <TeacherStats schedule={schedule} availableCourses={availableCourses} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Calendar View */}
          <CalendarView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filteredSchedule={filteredSchedule}
          />

          {/* Incoming Requests */}
          <RequestsPanel requests={requests} />
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === "schedule" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-slate-600"}`}
              onClick={() => setActiveTab("schedule")}
            >
              Teaching Schedule
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === "courses" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-slate-600"}`}
              onClick={() => setActiveTab("courses")}
            >
              Available Courses
            </button>
          </div>

          {/* Teaching Schedule Tab */}
          {activeTab === "schedule" && <TeachingSchedule filteredSchedule={filteredSchedule} />}

          {/* Available Courses Tab */}
          {activeTab === "courses" && <AvailableCourses availableCourses={availableCourses} />}
        </div>
      </div>
    </div>
  )
}
