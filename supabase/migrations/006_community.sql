-- ============================================================
-- Migration 006: Community & Project Showcase
-- ============================================================

-- ─── public_profiles ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public_profiles (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name  text        NOT NULL DEFAULT '',
  bio           text        NOT NULL DEFAULT '',
  avatar_url    text        NOT NULL DEFAULT '',
  github_url    text        NOT NULL DEFAULT '',
  linkedin_url  text        NOT NULL DEFAULT '',
  portfolio_url text        NOT NULL DEFAULT '',
  is_public     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ─── project_likes ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_likes (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_submission_id uuid        NOT NULL REFERENCES project_submissions(id) ON DELETE CASCADE,
  created_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, project_submission_id)
);

-- ─── project_comments ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_comments (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_submission_id uuid        NOT NULL REFERENCES project_submissions(id) ON DELETE CASCADE,
  comment               text        NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ─── project_reports ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_reports (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id           uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_submission_id uuid        NOT NULL REFERENCES project_submissions(id) ON DELETE CASCADE,
  reason                text        NOT NULL,
  status                text        NOT NULL DEFAULT 'pending',
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ─── Add is_public + is_featured to project_submissions ──────────────────────
ALTER TABLE project_submissions
  ADD COLUMN IF NOT EXISTS is_public   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- ─── Community feed view ─────────────────────────────────────────────────────
CREATE OR REPLACE VIEW community_projects_view AS
SELECT
  ps.id,
  ps.user_id,
  ps.project_id,
  ps.github_url,
  ps.demo_url,
  ps.notes,
  ps.status,
  ps.submitted_at,
  ps.is_featured,
  COALESCE(NULLIF(pp.display_name, ''), NULLIF(pr.username, ''), NULLIF(pr.full_name, ''), 'Anonymous') AS display_name,
  pp.avatar_url,
  pp.github_url   AS profile_github_url,
  p.title         AS project_title,
  p.description   AS project_description,
  p.portfolio_level,
  p.skills_covered,
  lp.title        AS path_title,
  lp.slug         AS path_slug,
  lp.category     AS path_category,
  (SELECT COUNT(*)::int FROM project_likes pl WHERE pl.project_submission_id = ps.id) AS like_count,
  (SELECT COUNT(*)::int FROM project_comments pc WHERE pc.project_submission_id = ps.id) AS comment_count
FROM project_submissions ps
JOIN projects p            ON p.id = ps.project_id
JOIN learning_paths lp     ON lp.id = p.path_id
LEFT JOIN public_profiles pp ON pp.user_id = ps.user_id AND pp.is_public = true
LEFT JOIN profiles pr      ON pr.id = ps.user_id
WHERE ps.is_public = true
  AND ps.status IN ('submitted', 'reviewed', 'approved');

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reports  ENABLE ROW LEVEL SECURITY;

-- public_profiles: anyone authenticated can read public profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_profiles' AND policyname='Anyone can read public profiles') THEN
    CREATE POLICY "Anyone can read public profiles"
      ON public_profiles FOR SELECT TO authenticated USING (is_public = true);
  END IF;
END $$;

-- public_profiles: users can read their own (even if not public)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_profiles' AND policyname='Users can read own public profile') THEN
    CREATE POLICY "Users can read own public profile"
      ON public_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- public_profiles: users can insert their own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_profiles' AND policyname='Users can insert own public profile') THEN
    CREATE POLICY "Users can insert own public profile"
      ON public_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- public_profiles: users can update their own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='public_profiles' AND policyname='Users can update own public profile') THEN
    CREATE POLICY "Users can update own public profile"
      ON public_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- project_likes: anyone can read
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_likes' AND policyname='Anyone can read project likes') THEN
    CREATE POLICY "Anyone can read project likes"
      ON project_likes FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- project_likes: users can insert own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_likes' AND policyname='Users can insert own likes') THEN
    CREATE POLICY "Users can insert own likes"
      ON project_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- project_likes: users can delete own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_likes' AND policyname='Users can delete own likes') THEN
    CREATE POLICY "Users can delete own likes"
      ON project_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- project_comments: anyone can read
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_comments' AND policyname='Anyone can read project comments') THEN
    CREATE POLICY "Anyone can read project comments"
      ON project_comments FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- project_comments: users can insert own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_comments' AND policyname='Users can insert own comments') THEN
    CREATE POLICY "Users can insert own comments"
      ON project_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- project_comments: users can update own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_comments' AND policyname='Users can update own comments') THEN
    CREATE POLICY "Users can update own comments"
      ON project_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- project_comments: users can delete own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_comments' AND policyname='Users can delete own comments') THEN
    CREATE POLICY "Users can delete own comments"
      ON project_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- project_reports: users can insert (report)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_reports' AND policyname='Users can report projects') THEN
    CREATE POLICY "Users can report projects"
      ON project_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
  END IF;
END $$;

-- project_reports: admins only can read (via service role) — users cannot read others' reports
