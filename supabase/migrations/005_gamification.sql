-- ============================================================
-- Migration 005: Gamification System
-- ============================================================

-- ─── Add last_streak_date to profiles ────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_streak_date date;

-- ─── achievements ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL UNIQUE,
  description       text        NOT NULL,
  icon              text        NOT NULL DEFAULT '🏆',
  achievement_type  text        NOT NULL,
  requirement_value int         NOT NULL DEFAULT 1,
  xp_reward         int         NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ─── user_achievements ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_achievements (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid        NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

-- ─── Leaderboard view ─────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  p.id AS user_id,
  COALESCE(NULLIF(p.username, ''), NULLIF(p.full_name, ''), 'Anonymous') AS display_name,
  COALESCE(p.xp, 0)     AS xp,
  COALESCE(p.level, 1)  AS level,
  COALESCE(p.streak, 0) AS streak,
  COALESCE((
    SELECT SUM(COALESCE(array_length(up.completed_lesson_ids, 1), 0))::int
    FROM user_progress up
    WHERE up.user_id = p.id
  ), 0) AS lessons_completed,
  COALESCE((
    SELECT COUNT(*)::int
    FROM user_challenges uc
    WHERE uc.user_id = p.id AND uc.is_correct = true
  ), 0) AS challenges_completed,
  COALESCE((
    SELECT COUNT(*)::int
    FROM project_submissions ps
    WHERE ps.user_id = p.id
  ), 0) AS projects_submitted
FROM profiles p;

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE achievements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read achievements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'achievements' AND policyname = 'Anyone can read achievements'
  ) THEN
    CREATE POLICY "Anyone can read achievements"
      ON achievements FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Users can read their own user_achievements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_achievements' AND policyname = 'Users can read own achievements'
  ) THEN
    CREATE POLICY "Users can read own achievements"
      ON user_achievements FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Users can insert their own user_achievements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_achievements' AND policyname = 'Users can insert own achievements'
  ) THEN
    CREATE POLICY "Users can insert own achievements"
      ON user_achievements FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow all authenticated users to read all profiles (for leaderboard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles' AND policyname = 'Authenticated users can read all profiles'
  ) THEN
    CREATE POLICY "Authenticated users can read all profiles"
      ON profiles FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ─── Seed achievements ────────────────────────────────────────────────────────
INSERT INTO achievements (name, description, icon, achievement_type, requirement_value, xp_reward)
VALUES
  ('First Lesson',        'Completed your very first lesson',        '📚', 'lesson_count',    1,   10),
  ('First Challenge',     'Solved your very first challenge',        '⚡', 'challenge_count', 1,   10),
  ('First Submission',    'Submitted your first portfolio project',  '🚀', 'project_count',   1,   25),
  ('Lesson Streak 5',     'Completed 5 lessons in total',            '📖', 'lesson_count',    5,   25),
  ('10 Lessons Done',     'Completed 10 lessons in total',           '🎓', 'lesson_count',    10,  50),
  ('Challenge Solver',    'Solved 5 challenges',                     '🧩', 'challenge_count', 5,   25),
  ('Challenge Master',    'Solved 10 challenges',                    '🏅', 'challenge_count', 10,  50),
  ('3-Day Streak',        'Studied 3 days in a row',                 '🔥', 'streak_days',     3,   30),
  ('7-Day Streak',        'Studied 7 days in a row',                 '💫', 'streak_days',     7,   75),
  ('Portfolio Published', 'Had a portfolio project approved',        '💼', 'project_approved',1,   50),
  ('Python Beginner',     'Started the Python Developer path',       '🐍', 'path_python',     1,   20),
  ('JavaScript Beginner', 'Started the JavaScript Developer path',   '✨', 'path_javascript', 1,   20),
  ('Full-Stack Starter',  'Started the Full-Stack Developer path',   '🔧', 'path_fullstack',  1,   20),
  ('Job-Ready Builder',   'Submitted 3 portfolio projects',          '🏆', 'project_count',   3,  100)
ON CONFLICT (name) DO NOTHING;
