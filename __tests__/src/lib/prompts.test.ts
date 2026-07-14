import {
  buildQuestionPrompt,
  buildReportPrompt,
  buildOnboardingSummaryPrompt,
} from '../../../src/lib/claude/prompts'
import type { Profile, JournalSession, JournalQuestion, JournalEntry } from '../../../src/types'

// Shared fixtures

const baseProfile: Profile = {
  id: 'user-1',
  display_name: 'Alex',
  age_range: '25-34',
  gender_identity: 'non-binary',
  life_situation: 'starting a new job',
  goals: ['build better habits', 'reduce anxiety'],
  challenges: ['procrastination', 'sleep issues'],
  feedback_style: 'balanced',
  ai_user_summary: null,
  onboarding_completed: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

type FullSession = JournalSession & { questions: JournalQuestion[]; entries: JournalEntry[] }

// ── buildQuestionPrompt ───────────────────────────────────────────────────────

describe('buildQuestionPrompt', () => {
  it('includes the user display name', () => {
    const prompt = buildQuestionPrompt(baseProfile, [], 3)
    expect(prompt).toContain('Alex')
  })

  it('includes the requested question count', () => {
    const prompt = buildQuestionPrompt(baseProfile, [], 5)
    expect(prompt).toContain('5')
  })

  it('mentions no previous entries when sessions list is empty', () => {
    const prompt = buildQuestionPrompt(baseProfile, [])
    expect(prompt).toMatch(/No previous entries/i)
  })

  it('includes recent session data when provided', () => {
    const session: FullSession = {
      id: 's1',
      user_id: 'user-1',
      session_date: '2024-06-01',
      mood_score: 7,
      completed_at: '2024-06-01T20:00:00Z',
      ai_themes: ['productivity', 'growth'],
      created_at: '2024-06-01T08:00:00Z',
      questions: [
        {
          id: 'q1',
          session_id: 's1',
          user_id: 'user-1',
          question_text: 'What went well today?',
          category: 'growth',
          sequence_order: 1,
          rationale: null,
          created_at: '2024-06-01T08:00:00Z',
        },
      ],
      entries: [
        {
          id: 'e1',
          session_id: 's1',
          question_id: 'q1',
          user_id: 'user-1',
          response_text: 'I finished the report early.',
          input_method: 'text',
          word_count: 5,
          created_at: '2024-06-01T20:00:00Z',
        },
      ],
    }

    const prompt = buildQuestionPrompt(baseProfile, [session])
    expect(prompt).toContain('2024-06-01')
    expect(prompt).toContain('What went well today?')
    expect(prompt).toContain('I finished the report early.')
  })

  it('uses at most 7 recent sessions', () => {
    const sessions: FullSession[] = Array.from({ length: 10 }, (_, i) => ({
      id: `s${i}`,
      user_id: 'user-1',
      session_date: `2024-06-${String(i + 1).padStart(2, '0')}`,
      mood_score: 5,
      completed_at: `2024-06-${String(i + 1).padStart(2, '0')}T20:00:00Z`,
      ai_themes: [],
      created_at: `2024-06-${String(i + 1).padStart(2, '0')}T08:00:00Z`,
      questions: [],
      entries: [],
    }))

    const prompt = buildQuestionPrompt(baseProfile, sessions)
    // Sessions 8-10 (index 7-9) should not appear
    expect(prompt).not.toContain('2024-06-08')
    expect(prompt).not.toContain('2024-06-09')
    expect(prompt).not.toContain('2024-06-10')
  })

  it('maps straight_talk feedback style to blunt language', () => {
    const profile = { ...baseProfile, feedback_style: 'straight_talk' as const }
    const prompt = buildQuestionPrompt(profile, [])
    expect(prompt).toMatch(/bluntly honest/i)
  })

  it('maps gentle feedback style to supportive language', () => {
    const profile = { ...baseProfile, feedback_style: 'gentle' as const }
    const prompt = buildQuestionPrompt(profile, [])
    expect(prompt).toMatch(/supportive/i)
  })

  it('includes the user goals and challenges', () => {
    const prompt = buildQuestionPrompt(baseProfile, [])
    expect(prompt).toContain('build better habits')
    expect(prompt).toContain('procrastination')
  })

  it('instructs Claude to return JSON array', () => {
    const prompt = buildQuestionPrompt(baseProfile, [])
    expect(prompt).toMatch(/\[.*\]/s)
  })

  it('includes ai_user_summary when present', () => {
    const profile = { ...baseProfile, ai_user_summary: 'Highly driven but prone to burnout.' }
    const prompt = buildQuestionPrompt(profile, [])
    expect(prompt).toContain('Highly driven but prone to burnout.')
  })
})

// ── buildReportPrompt ─────────────────────────────────────────────────────────

describe('buildReportPrompt', () => {
  const session: FullSession = {
    id: 's1',
    user_id: 'user-1',
    session_date: '2024-06-01',
    mood_score: 8,
    completed_at: '2024-06-01T20:00:00Z',
    ai_themes: [],
    created_at: '2024-06-01T08:00:00Z',
    questions: [
      {
        id: 'q1',
        session_id: 's1',
        user_id: 'user-1',
        question_text: 'What challenged you today?',
        category: 'obstacles',
        sequence_order: 1,
        rationale: null,
        created_at: '2024-06-01T08:00:00Z',
      },
    ],
    entries: [
      {
        id: 'e1',
        session_id: 's1',
        question_id: 'q1',
        user_id: 'user-1',
        response_text: 'Deadlines felt overwhelming.',
        input_method: 'text',
        word_count: 4,
        created_at: '2024-06-01T20:00:00Z',
      },
    ],
  }

  it('includes the user name', () => {
    const prompt = buildReportPrompt(baseProfile, [session], 'Last 7 days')
    expect(prompt).toContain('Alex')
  })

  it('includes the period label', () => {
    const prompt = buildReportPrompt(baseProfile, [session], 'Last 30 days')
    expect(prompt).toContain('Last 30 days')
  })

  it('includes journal entry text', () => {
    const prompt = buildReportPrompt(baseProfile, [session], 'Last 7 days')
    expect(prompt).toContain('Deadlines felt overwhelming.')
  })

  it('includes mood score', () => {
    const prompt = buildReportPrompt(baseProfile, [session], 'Last 7 days')
    expect(prompt).toContain('8')
  })

  it('adds unfiltered instruction for straight_talk style', () => {
    const profile = { ...baseProfile, feedback_style: 'straight_talk' as const }
    const prompt = buildReportPrompt(profile, [session], 'Last 7 days')
    expect(prompt).toMatch(/Do NOT sugarcoat/i)
  })

  it('instructs Claude to return valid JSON object', () => {
    const prompt = buildReportPrompt(baseProfile, [session], 'Last 7 days')
    expect(prompt).toMatch(/Return ONLY valid JSON/i)
    expect(prompt).toContain('"summary"')
    expect(prompt).toContain('"patterns"')
    expect(prompt).toContain('"hard_truth"')
  })

  it('shows (no response) for unanswered questions', () => {
    const sessionNoAnswers: FullSession = {
      ...session,
      entries: [],
    }
    const prompt = buildReportPrompt(baseProfile, [sessionNoAnswers], 'Last 7 days')
    expect(prompt).toContain('(no response)')
  })
})

// ── buildOnboardingSummaryPrompt ──────────────────────────────────────────────

describe('buildOnboardingSummaryPrompt', () => {
  const onboardingData = {
    display_name: 'Jordan',
    age_range: '25-34',
    gender_identity: 'male',
    life_situation: 'freelancer',
    goals: ['financial independence', 'health'],
    challenges: ['inconsistency', 'focus'],
    feedback_style: 'direct',
  }

  it('includes the display name', () => {
    const prompt = buildOnboardingSummaryPrompt(onboardingData)
    expect(prompt).toContain('Jordan')
  })

  it('includes all goals', () => {
    const prompt = buildOnboardingSummaryPrompt(onboardingData)
    expect(prompt).toContain('financial independence')
    expect(prompt).toContain('health')
  })

  it('includes all challenges', () => {
    const prompt = buildOnboardingSummaryPrompt(onboardingData)
    expect(prompt).toContain('inconsistency')
    expect(prompt).toContain('focus')
  })

  it('includes the feedback style', () => {
    const prompt = buildOnboardingSummaryPrompt(onboardingData)
    expect(prompt).toContain('direct')
  })

  it('instructs Claude to target 100-150 words', () => {
    const prompt = buildOnboardingSummaryPrompt(onboardingData)
    expect(prompt).toMatch(/100.{0,5}150 word/i)
  })

  it('asks for only the profile text in the response', () => {
    const prompt = buildOnboardingSummaryPrompt(onboardingData)
    expect(prompt).toMatch(/Return ONLY the profile text/i)
  })
})
