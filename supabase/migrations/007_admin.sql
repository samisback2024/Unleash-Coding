-- ============================================================
-- Migration 007: Admin Role & Content Management RLS
-- ============================================================

-- ─── Add role column to profiles ─────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';

-- ─── Helper: is current user an admin? ───────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ─── Trigger: prevent non-admins from escalating their own role ───────────────
CREATE OR REPLACE FUNCTION prevent_role_escalation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin() THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_role_immutable ON profiles;
CREATE TRIGGER enforce_role_immutable
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION prevent_role_escalation();

-- ─── Admin policies: profiles ─────────────────────────────────────────────────
-- Admins can read all profiles (for user management)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Admins can read all profiles') THEN
    CREATE POLICY "Admins can read all profiles"
      ON profiles FOR SELECT TO authenticated USING (is_admin());
  END IF;
END $$;

-- Admins can update any profile (for role changes)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Admins can update any profile') THEN
    CREATE POLICY "Admins can update any profile"
      ON profiles FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

-- ─── Admin policies: learning_paths ───────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='learning_paths' AND policyname='Admins can insert learning paths') THEN
    CREATE POLICY "Admins can insert learning paths"
      ON learning_paths FOR INSERT TO authenticated WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='learning_paths' AND policyname='Admins can update learning paths') THEN
    CREATE POLICY "Admins can update learning paths"
      ON learning_paths FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='learning_paths' AND policyname='Admins can delete learning paths') THEN
    CREATE POLICY "Admins can delete learning paths"
      ON learning_paths FOR DELETE TO authenticated USING (is_admin());
  END IF;
END $$;

-- ─── Admin policies: modules ──────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='modules' AND policyname='Admins can insert modules') THEN
    CREATE POLICY "Admins can insert modules"
      ON modules FOR INSERT TO authenticated WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='modules' AND policyname='Admins can update modules') THEN
    CREATE POLICY "Admins can update modules"
      ON modules FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='modules' AND policyname='Admins can delete modules') THEN
    CREATE POLICY "Admins can delete modules"
      ON modules FOR DELETE TO authenticated USING (is_admin());
  END IF;
END $$;

-- ─── Admin policies: lessons ──────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lessons' AND policyname='Admins can insert lessons') THEN
    CREATE POLICY "Admins can insert lessons"
      ON lessons FOR INSERT TO authenticated WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lessons' AND policyname='Admins can update lessons') THEN
    CREATE POLICY "Admins can update lessons"
      ON lessons FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lessons' AND policyname='Admins can delete lessons') THEN
    CREATE POLICY "Admins can delete lessons"
      ON lessons FOR DELETE TO authenticated USING (is_admin());
  END IF;
END $$;

-- ─── Admin policies: challenges ───────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='challenges' AND policyname='Admins can insert challenges') THEN
    CREATE POLICY "Admins can insert challenges"
      ON challenges FOR INSERT TO authenticated WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='challenges' AND policyname='Admins can update challenges') THEN
    CREATE POLICY "Admins can update challenges"
      ON challenges FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='challenges' AND policyname='Admins can delete challenges') THEN
    CREATE POLICY "Admins can delete challenges"
      ON challenges FOR DELETE TO authenticated USING (is_admin());
  END IF;
END $$;

-- ─── Admin policies: projects ─────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Admins can insert projects') THEN
    CREATE POLICY "Admins can insert projects"
      ON projects FOR INSERT TO authenticated WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Admins can update projects') THEN
    CREATE POLICY "Admins can update projects"
      ON projects FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Admins can delete projects') THEN
    CREATE POLICY "Admins can delete projects"
      ON projects FOR DELETE TO authenticated USING (is_admin());
  END IF;
END $$;

-- ─── Admin policies: project_submissions ─────────────────────────────────────
-- Admins can update any submission (feature/unfeature, status changes)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_submissions' AND policyname='Admins can update project submissions') THEN
    CREATE POLICY "Admins can update project submissions"
      ON project_submissions FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

-- Admins can read all submissions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_submissions' AND policyname='Admins can read all project submissions') THEN
    CREATE POLICY "Admins can read all project submissions"
      ON project_submissions FOR SELECT TO authenticated USING (is_admin());
  END IF;
END $$;

-- ─── Admin policies: project_reports ─────────────────────────────────────────
-- Admins can read all reports
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_reports' AND policyname='Admins can read project reports') THEN
    CREATE POLICY "Admins can read project reports"
      ON project_reports FOR SELECT TO authenticated USING (is_admin());
  END IF;
END $$;

-- Admins can update report status
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_reports' AND policyname='Admins can update report status') THEN
    CREATE POLICY "Admins can update report status"
      ON project_reports FOR UPDATE TO authenticated
      USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;
