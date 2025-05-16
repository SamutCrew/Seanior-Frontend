"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/Common/Button"
import type { SkillAssessment } from "./ProgressTracker"

interface SkillEditModalProps {
  skill: SkillAssessment | null
  onClose: () => void
  onSave: (skill: SkillAssessment) => void
}

export default function SkillEditModal({ skill, onClose, onSave }: SkillEditModalProps) {
  const [name, setName] = useState("")
  const [progress, setProgress] = useState(0)
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (skill) {
      setName(skill.name || "")
      setProgress(skill.progress || 0)
      setDescription(skill.description || "")
    }
  }, [skill])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      // Show validation error
      return
    }

    const updatedSkill: SkillAssessment = {
      ...(skill || {}),
      name,
      progress,
      description: description || undefined,
      lastUpdated: new Date().toISOString(),
    }

    onSave(updatedSkill)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{skill?.id ? "Edit Skill" : "Add New Skill"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Skill Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              placeholder="Enter skill name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Progress: {progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number.parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-white h-24"
              placeholder="Enter skill description"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gradient" type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
