export interface Profile {
  id: string
  display_name: string
  age_range: string | null
  gender_identity: string | null
  timezone: string
  feedback_style: 'gentle' | 'balanced' | 'direct' | 'straight_talk'
  onboarding_completed: boolean
  goals: string[] | null
  challenges: string[] | null
  life_situation: string | null
  ai_user_summary: string | null
  streak_count: number
  longest_streak: number
  last_entry_date: string | null
  created_at: string
  updated_at: string
}

export interface JournalSession {
  id: string
  user_id: string
  session_date: string
  completed_at: string | null
  mood_score: number | null
  ai_themes: string[] | null
  ai_summary: string | null
  created_at: string
}

export interface JournalQuestion {
  id: string
  session_id: string
  user_id: string
  question_text: string
  category: 'emotions' | 'productivity' | 'obstacles' | 'time_management' | 'growth' | 'relationships'
  sequence_order: number
  rationale: string | null
  created_at: string
}

export interface JournalEntry {
  id: string
  session_id: string
  question_id: string
  user_id: string
  response_text: string
  input_method: 'text' | 'voice'
  word_count: number
  created_at: string
}

export interface AiReport {
  id: string
  user_id: string
  report_type: 'weekly' | 'monthly' | 'on_demand'
  period_start: string | null
  period_end: string | null
  report_content: ReportContent
  generated_at: string
}

export interface ReportContent {
  patterns: string[]
  strengths: string[]
  blind_spots: string[]
  hard_truth: string
  recommendations: string[]
  focus_question: string
  mood_trend?: { date: string; score: number }[]
  summary?: string
}

export interface GeneratedQuestion {
  question: string
  category: JournalQuestion['category']
  rationale: string
}

export type FeedbackStyle = 'gentle' | 'balanced' | 'direct' | 'straight_talk'

export const AGE_RANGES = [
  { value: 'under_18', label: 'Under 18' },
  { value: '18_25', label: '18–25' },
  { value: '26_35', label: '26–35' },
  { value: '36_45', label: '36–45' },
  { value: '46_55', label: '46–55' },
  { value: '56_65', label: '56–65' },
  { value: '65_plus', label: '65+' },
]

export const GOALS_OPTIONS = [
  'Be more productive',
  'Manage stress better',
  'Improve relationships',
  'Build better habits',
  'Find more purpose',
  'Advance my career',
  'Improve mental health',
  'Get healthier physically',
  'Manage my time better',
  'Increase self-awareness',
  'Overcome procrastination',
  'Build confidence',
]

export const CHALLENGES_OPTIONS = [
  'Procrastination',
  'Anxiety or worry',
  'Low motivation',
  'Poor sleep',
  'Overthinking',
  'People pleasing',
  'Lack of focus',
  'Negative self-talk',
  'Work-life balance',
  'Imposter syndrome',
  'Anger management',
  'Loneliness',
]

export const FEEDBACK_STYLES = [
  {
    value: 'gentle',
    label: 'Gentle',
    description: 'Encouraging and supportive. Growth-focused.',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Honest but kind. The default.',
  },
  {
    value: 'direct',
    label: 'Direct',
    description: 'Straight to the point. No fluff.',
  },
  {
    value: 'straight_talk',
    label: 'Straight Talk',
    description: "Unfiltered truth. What you need, not what you want to hear.",
  },
]
