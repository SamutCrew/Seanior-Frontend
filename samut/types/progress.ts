// Update the SessionProgress interface to match the API response format
export interface SessionProgress {
  session_progress_id: string
  enrollment_id: string
  session_number: number
  topic_covered: string
  performance_notes: string
  date_session: string
  created_at: string
  updated_at: string
  // Keep other fields that might be used elsewhere
  skill_area?: string
  skill_name?: string
  proficiency_level?: number
  instructor_notes?: string
  student_notes?: string
  achievements?: string
  areas_for_improvement?: string
  next_steps?: string
  media_urls?: string[]
}

export interface ProgressMilestone {
  milestone_id: string
  enrollment_id: string
  title: string
  description: string
  target_date: string
  completed: boolean
  completed_date?: string
  created_at: string
  updated_at: string
}

export interface SkillAssessment {
  skill_id: string
  enrollment_id: string
  name: string
  category: string
  progress: number // 0-100
  last_assessed: string
  created_at: string
  updated_at: string
}
