export interface SessionProgress {
  session_progress_id: string
  enrollment_id: string
  session_number: number
  topic_covered: string
  performance_notes: string
  date_session: string
  created_at: string
  updated_at: string
}

export interface ProgressSummary {
  totalSessions: number
  completedSessions: number
  upcomingSessions: number
  nextSessionDate: string | null
  lastSessionDate: string | null
  progressPercentage: number
}

export interface SkillAssessment {
  name: string
  progress: number
}

export interface Milestone {
  name: string
  completed: boolean
  date: string
}
