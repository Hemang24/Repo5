-- This migration was applied via Supabase MCP
-- Run this manually if setting up a new Supabase project

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  age_range TEXT CHECK (age_range IN ('under_18','18_25','26_35','36_45','46_55','56_65','65_plus')),
  gender_identity TEXT,
  timezone TEXT DEFAULT 'UTC',
  feedback_style TEXT CHECK (feedback_style IN ('gentle','balanced','direct','straight_talk')) DEFAULT 'balanced',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  goals TEXT[],
  challenges TEXT[],
  life_situation TEXT,
  ai_user_summary TEXT,
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journal_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  ai_themes TEXT[],
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_date)
);

CREATE TABLE journal_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES journal_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  category TEXT CHECK (category IN ('emotions','productivity','obstacles','time_management','growth','relationships')),
  sequence_order INT NOT NULL,
  rationale TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES journal_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES journal_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  input_method TEXT CHECK (input_method IN ('text','voice')) DEFAULT 'text',
  word_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  report_type TEXT CHECK (report_type IN ('weekly','monthly','on_demand')) DEFAULT 'on_demand',
  period_start DATE,
  period_end DATE,
  report_content JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own their data" ON journal_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their data" ON journal_questions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their data" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own their data" ON ai_reports FOR ALL USING (auth.uid() = user_id);
