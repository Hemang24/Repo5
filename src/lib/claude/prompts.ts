import type { Profile, JournalSession, JournalQuestion, JournalEntry } from '@/types'

export function buildQuestionPrompt(
  profile: Profile,
  recentSessions: (JournalSession & { questions: JournalQuestion[]; entries: JournalEntry[] })[],
  questionCount: number = 3
): string {
  const recentContext = recentSessions.slice(0, 7).map(s => {
    const qas = s.questions.map(q => {
      const entry = s.entries.find(e => e.question_id === q.id)
      return `Q: ${q.question_text}\nA: ${entry?.response_text ?? '(unanswered)'}`
    }).join('\n')
    return `--- ${s.session_date} (mood: ${s.mood_score ?? 'not set'}/10) ---\n${qas}\nThemes: ${s.ai_themes?.join(', ') ?? 'none'}`
  }).join('\n\n')

  const feedbackLabel = {
    gentle: 'supportive and encouraging',
    balanced: 'honest but compassionate',
    direct: 'direct and no-nonsense',
    straight_talk: 'bluntly honest — say what needs to be said without softening',
  }[profile.feedback_style] ?? 'balanced'

  return `You are an expert psychologist, life coach, and mentor generating daily journal questions.

USER PROFILE:
- Name: ${profile.display_name}
- Age range: ${profile.age_range ?? 'not specified'}
- Goals: ${profile.goals?.join(', ') ?? 'not specified'}
- Challenges: ${profile.challenges?.join(', ') ?? 'not specified'}
- Life situation: ${profile.life_situation ?? 'not specified'}
- Preferred feedback style: ${feedbackLabel}
${profile.ai_user_summary ? `- Psychological profile: ${profile.ai_user_summary}` : ''}

RECENT JOURNAL HISTORY (last 7 days):
${recentContext || 'No previous entries yet — this is their first session.'}

Generate exactly ${questionCount} journal questions for TODAY. Rules:
1. Be specific to THIS person's situation and recent patterns — never generic
2. If you notice avoidance, repetition, or contradictions in recent entries, probe them gently
3. Rotate across categories: emotions, productivity, obstacles, time_management, growth, relationships
4. At least one question should challenge a potential blind spot
5. Questions should feel like a wise friend asking — warm but purposeful
6. Vary depth: not all heavy questions
7. NEVER repeat a question asked in the last 7 days
8. If this is their first session, start with approachable but meaningful questions

Return ONLY a valid JSON array, no other text:
[{"question":"...","category":"emotions|productivity|obstacles|time_management|growth|relationships","rationale":"brief note on why this question now"}]`
}

export function buildReportPrompt(
  profile: Profile,
  sessions: (JournalSession & { questions: JournalQuestion[]; entries: JournalEntry[] })[],
  periodLabel: string
): string {
  const entriesText = sessions.map(s => {
    const qas = s.questions.map(q => {
      const entry = s.entries.find(e => e.question_id === q.id)
      return `  Q [${q.category}]: ${q.question_text}\n  A: ${entry?.response_text ?? '(no response)'}`
    }).join('\n')
    return `DATE: ${s.session_date} | Mood: ${s.mood_score ?? '?'}/10\n${qas}`
  }).join('\n\n---\n\n')

  const feedbackLabel = {
    gentle: 'Be supportive and growth-focused. Frame challenges with compassion.',
    balanced: 'Be honest and direct, but compassionate. Name patterns clearly.',
    direct: 'Be direct. No filler. Name what you see without softening unnecessarily.',
    straight_talk: 'Be completely unfiltered. If you see self-sabotage or avoidance, name it explicitly. This person wants truth, not comfort.',
  }[profile.feedback_style] ?? 'Be honest and direct, but compassionate.'

  return `You are a team of three specialists writing a unified insight report: a life coach, a therapist, and a mentor.

USER: ${profile.display_name}
PERIOD: ${periodLabel}
TONE INSTRUCTION: ${feedbackLabel}

JOURNAL ENTRIES:
${entriesText}

Write a comprehensive, HONEST report. Reference their actual words where relevant.
${profile.feedback_style === 'straight_talk' || profile.feedback_style === 'direct' ? 'Do NOT sugarcoat. If you see patterns of avoidance or self-sabotage, say so clearly.' : ''}

Return ONLY valid JSON:
{
  "summary": "2-3 sentence executive summary of this period",
  "patterns": ["behavioral/emotional pattern 1", "pattern 2", "pattern 3"],
  "strengths": ["genuine strength with evidence", "strength 2"],
  "blind_spots": ["something they may not be seeing about themselves", "blind spot 2"],
  "hard_truth": "The one honest observation they need to hear — stated with care but said clearly",
  "recommendations": ["specific actionable step 1", "step 2", "step 3"],
  "focus_question": "One powerful question for them to sit with this week",
  "mood_trend": [{"date":"YYYY-MM-DD","score":7}]
}`
}

export function buildOnboardingSummaryPrompt(data: {
  display_name: string
  age_range: string
  gender_identity: string
  life_situation: string
  goals: string[]
  challenges: string[]
  feedback_style: string
}): string {
  return `You are a clinical psychologist. Based on the following onboarding data, write a concise 100-150 word psychological profile that will be used to personalize daily journal questions.

User data:
- Name: ${data.display_name}
- Age range: ${data.age_range}
- Gender: ${data.gender_identity}
- Life situation: ${data.life_situation}
- Goals: ${data.goals.join(', ')}
- Challenges: ${data.challenges.join(', ')}
- Feedback style preference: ${data.feedback_style}

Write this as a briefing for a therapist meeting this person for the first time. Be factual and insightful. Note likely emotional patterns, motivational drivers, and potential areas of resistance. Do not be flattering — be accurate.

Return ONLY the profile text, no labels or headers.`
}
