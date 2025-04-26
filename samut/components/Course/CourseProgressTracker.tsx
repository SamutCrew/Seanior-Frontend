"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaSave, FaCheck, FaRegCircle, FaChevronDown, FaChevronUp, FaPlus, FaImage, FaInfoCircle } from "react-icons/fa"
import { useAppSelector } from "@/app/redux"
import type { CourseProgress, StudySessionDetail } from "@/types/course"
import ProgressDetailModal from "./ProgressDetailModal"

interface CourseProgressTrackerProps {
  courseId: number
  initialProgress?: CourseProgress
  onSave: (progress: CourseProgress) => void
}

export default function CourseProgressTracker({ courseId, initialProgress, onSave }: CourseProgressTrackerProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  // Default progress structure if none is provided
  const defaultProgress: CourseProgress = {
    overallCompletion: 0,
    modules: [
      {
        id: 1,
        title: "Introduction & Water Safety",
        completion: 0,
        topics: [
          { id: 101, title: "Pool Safety Rules", completed: false },
          { id: 102, title: "Basic Water Comfort", completed: false },
          { id: 103, title: "Equipment Introduction", completed: false },
        ],
      },
      {
        id: 2,
        title: "Fundamental Techniques",
        completion: 0,
        topics: [
          { id: 201, title: "Proper Breathing", completed: false },
          { id: 202, title: "Body Position", completed: false },
          { id: 203, title: "Basic Arm Movement", completed: false },
          { id: 204, title: "Leg Kick Technique", completed: false },
        ],
      },
      {
        id: 3,
        title: "Stroke Development",
        completion: 0,
        topics: [
          { id: 301, title: "Freestyle Basics", completed: false },
          { id: 302, title: "Backstroke Introduction", completed: false },
          { id: 303, title: "Coordination Drills", completed: false },
        ],
      },
    ],
    lastUpdated: new Date().toISOString(),
    sessionDetails: [],
  }

  // Use provided progress or default
  const [progress, setProgress] = useState<CourseProgress>(initialProgress || defaultProgress)
  const [expandedModules, setExpandedModules] = useState<number[]>([1]) // Start with first module expanded
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // State for progress detail modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<{ id: number; title: string } | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<{ id: number; title: string } | null>(null)
  const [selectedSessionDetail, setSelectedSessionDetail] = useState<StudySessionDetail | undefined>(undefined)

  // Toggle module expansion
  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  // Toggle topic completion
  const toggleTopic = (moduleId: number, topicId: number) => {
    const updatedModules = progress.modules.map((module) => {
      if (module.id === moduleId) {
        const updatedTopics = module.topics.map((topic) => {
          if (topic.id === topicId) {
            return { ...topic, completed: !topic.completed }
          }
          return topic
        })

        // Calculate new module completion percentage
        const completedTopics = updatedTopics.filter((topic) => topic.completed).length
        const completion = Math.round((completedTopics / updatedTopics.length) * 100)

        return { ...module, topics: updatedTopics, completion }
      }
      return module
    })

    // Calculate overall completion
    const totalTopics = updatedModules.reduce((sum, module) => sum + module.topics.length, 0)
    const completedTopics = updatedModules.reduce(
      (sum, module) => sum + module.topics.filter((topic) => topic.completed).length,
      0,
    )
    const overallCompletion = Math.round((completedTopics / totalTopics) * 100)

    setProgress({
      ...progress,
      modules: updatedModules,
      overallCompletion,
      lastUpdated: new Date().toISOString(),
    })
  }

  // Open detail modal for a topic
  const openDetailModal = (moduleId: number, topicId: number) => {
    const module = progress.modules.find((m) => m.id === moduleId)
    const topic = module?.topics.find((t) => t.id === topicId)

    if (module && topic) {
      setSelectedModule({ id: moduleId, title: module.title })
      setSelectedTopic({ id: topicId, title: topic.title })

      // Check if there's an existing session detail for this topic
      const existingDetail = progress.sessionDetails?.find(
        (detail) => detail.moduleId === moduleId && detail.topicId === topicId,
      )

      setSelectedSessionDetail(existingDetail)
      setIsDetailModalOpen(true)
    }
  }

  // Save session details
  const saveSessionDetails = (details: StudySessionDetail) => {
    const existingDetails = progress.sessionDetails || []
    let updatedDetails: StudySessionDetail[]

    // Check if we're updating an existing detail or adding a new one
    const existingIndex = existingDetails.findIndex(
      (detail) => detail.moduleId === details.moduleId && detail.topicId === details.topicId,
    )

    if (existingIndex >= 0) {
      // Update existing detail
      updatedDetails = [
        ...existingDetails.slice(0, existingIndex),
        details,
        ...existingDetails.slice(existingIndex + 1),
      ]
    } else {
      // Add new detail
      updatedDetails = [...existingDetails, details]
    }

    setProgress({
      ...progress,
      sessionDetails: updatedDetails,
      lastUpdated: new Date().toISOString(),
    })
  }

  // Handle save
  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update last updated timestamp
      const updatedProgress = {
        ...progress,
        lastUpdated: new Date().toISOString(),
      }

      onSave(updatedProgress)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to save progress:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Check if a topic has session details
  const hasSessionDetails = (moduleId: number, topicId: number) => {
    return (
      progress.sessionDetails?.some((detail) => detail.moduleId === moduleId && detail.topicId === topicId) || false
    )
  }

  // Get session details for a topic
  const getSessionDetails = (moduleId: number, topicId: number) => {
    return progress.sessionDetails?.find((detail) => detail.moduleId === moduleId && detail.topicId === topicId)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-xl p-6 ${isDarkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Course Progress Tracker
          </h2>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSaving
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : saveSuccess
                  ? "bg-green-500 text-white"
                  : isDarkMode
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                    : "bg-sky-600 hover:bg-sky-500 text-white"
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <FaCheck />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <FaSave />
                <span>Save Progress</span>
              </>
            )}
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>Overall Completion</h3>
            <span className={`font-bold ${isDarkMode ? "text-cyan-400" : "text-sky-600"}`}>
              {progress.overallCompletion}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
            <div
              className={`h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600`}
              style={{ width: `${progress.overallCompletion}%` }}
            ></div>
          </div>
          <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Last updated: {new Date(progress.lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {progress.modules.map((module) => (
            <div
              key={module.id}
              className={`rounded-lg border ${
                isDarkMode ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50"
              }`}
            >
              {/* Module Header */}
              <div
                className={`p-4 flex items-center justify-between cursor-pointer ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                } rounded-t-lg transition-colors`}
                onClick={() => toggleModule(module.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      module.completion === 100
                        ? "bg-green-500 text-white"
                        : isDarkMode
                          ? "bg-slate-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {module.completion === 100 ? (
                      <FaCheck className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-bold">{module.completion}%</span>
                    )}
                  </div>
                  <h3 className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{module.title}</h3>
                </div>
                {expandedModules.includes(module.id) ? (
                  <FaChevronUp className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                ) : (
                  <FaChevronDown className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                )}
              </div>

              {/* Module Progress Bar */}
              <div className="px-4">
                <div className={`w-full h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                  <div
                    className={`h-1.5 rounded-full ${
                      module.completion === 100 ? "bg-green-500" : "bg-gradient-to-r from-cyan-500 to-blue-600"
                    }`}
                    style={{ width: `${module.completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Module Topics */}
              {expandedModules.includes(module.id) && (
                <div className={`p-4 ${isDarkMode ? "border-t border-slate-700" : "border-t border-gray-200"}`}>
                  <ul className="space-y-2">
                    {module.topics.map((topic) => {
                      const hasDetails = hasSessionDetails(module.id, topic.id)
                      const sessionDetail = getSessionDetails(module.id, topic.id)

                      return (
                        <li key={topic.id} className="flex items-center justify-between">
                          <button
                            onClick={() => toggleTopic(module.id, topic.id)}
                            className={`flex items-center gap-3 py-1 px-2 rounded-md text-left ${
                              isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                            } transition-colors`}
                          >
                            {topic.completed ? (
                              <FaCheck className={`h-4 w-4 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
                            ) : (
                              <FaRegCircle className={`h-4 w-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                            )}
                            <span
                              className={`${
                                topic.completed
                                  ? isDarkMode
                                    ? "text-gray-300 line-through"
                                    : "text-gray-500 line-through"
                                  : isDarkMode
                                    ? "text-gray-200"
                                    : "text-gray-700"
                              }`}
                            >
                              {topic.title}
                            </span>

                            {/* Indicator if this topic has session details */}
                            {hasDetails && (
                              <div className="flex items-center">
                                {sessionDetail?.images && sessionDetail.images.length > 0 && (
                                  <FaImage
                                    className={`ml-1 h-3 w-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                                    title="Has images"
                                  />
                                )}
                                <FaInfoCircle
                                  className={`ml-1 h-3 w-3 ${isDarkMode ? "text-cyan-400" : "text-blue-500"}`}
                                  title="Has details"
                                />
                              </div>
                            )}
                          </button>

                          {/* Add details button */}
                          <button
                            onClick={() => openDetailModal(module.id, topic.id)}
                            className={`flex items-center gap-1 py-1 px-2 rounded-md text-xs ${
                              isDarkMode
                                ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            } transition-colors`}
                            title={hasDetails ? "Edit session details" : "Add session details"}
                          >
                            <FaPlus className="h-3 w-3" />
                            <span>{hasDetails ? "Edit Details" : "Add Details"}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress Detail Modal */}
      {selectedModule && selectedTopic && (
        <ProgressDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onSave={saveSessionDetails}
          moduleId={selectedModule.id}
          topicId={selectedTopic.id}
          moduleName={selectedModule.title}
          topicName={selectedTopic.title}
          initialDetails={selectedSessionDetail}
        />
      )}
    </>
  )
}
