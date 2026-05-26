-- =====================================================
-- Phase 12: Advanced Engineering Features
-- =====================================================

-- Saved code snippets (playground drafts)
CREATE TABLE IF NOT EXISTS saved_code_snippets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title       text NOT NULL DEFAULT 'Untitled Snippet',
  language    text NOT NULL DEFAULT 'javascript'
              CHECK (language IN ('javascript','typescript','python','sql')),
  code        text NOT NULL DEFAULT '',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE saved_code_snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own snippets"
  ON saved_code_snippets FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_snippets_user ON saved_code_snippets (user_id, created_at DESC);

-- -------------------------------------------------------

-- Resume profiles (one per user)
CREATE TABLE IF NOT EXISTS resume_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  template    text NOT NULL DEFAULT 'modern'
              CHECK (template IN ('modern','minimal','classic')),
  data        jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE resume_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own resume"
  ON resume_profiles FOR ALL
  USING (auth.uid() = user_id);

-- -------------------------------------------------------

-- Study goals
CREATE TABLE IF NOT EXISTS study_goals (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title                text NOT NULL,
  target_minutes_daily int  NOT NULL DEFAULT 30 CHECK (target_minutes_daily > 0),
  topic                text,
  is_active            boolean DEFAULT true,
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE study_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own goals"
  ON study_goals FOR ALL
  USING (auth.uid() = user_id);

-- -------------------------------------------------------

-- Study sessions (daily log)
CREATE TABLE IF NOT EXISTS study_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration_minutes int  NOT NULL DEFAULT 0 CHECK (duration_minutes >= 0),
  session_date     date NOT NULL DEFAULT CURRENT_DATE,
  topic            text,
  notes            text,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sessions"
  ON study_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_study_sessions_user_date
  ON study_sessions (user_id, session_date DESC);

-- -------------------------------------------------------

-- Bookmarks (lessons, challenges, projects, paths)
CREATE TABLE IF NOT EXISTS bookmarks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_type text NOT NULL
                CHECK (resource_type IN ('lesson','challenge','project','path')),
  resource_id   uuid NOT NULL,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, resource_type, resource_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_bookmarks_user
  ON bookmarks (user_id, resource_type);
