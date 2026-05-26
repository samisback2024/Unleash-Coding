-- ============================================================
-- Migration 009: Beta Launch System
-- ============================================================

-- ─── Beta Waitlist ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS beta_waitlist (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  name          text,
  interest_area text,
  status        text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'invited', 'joined', 'declined')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can join the waitlist (no auth required)
CREATE POLICY "Anyone can join waitlist"
  ON beta_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read the waitlist
CREATE POLICY "Admins read waitlist"
  ON beta_waitlist FOR SELECT
  TO authenticated
  USING (is_admin());

-- Only admins can update waitlist status
CREATE POLICY "Admins update waitlist"
  ON beta_waitlist FOR UPDATE
  TO authenticated
  USING (is_admin());

-- ─── Beta Invites ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS beta_invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  invite_code text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'hex'),
  status      text NOT NULL DEFAULT 'unused'
    CHECK (status IN ('unused', 'used', 'revoked')),
  invited_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  used_at     timestamptz
);

ALTER TABLE beta_invites ENABLE ROW LEVEL SECURITY;

-- Only admins can create invites
CREATE POLICY "Admins create invites"
  ON beta_invites FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can read all invites
CREATE POLICY "Admins read invites"
  ON beta_invites FOR SELECT
  TO authenticated
  USING (is_admin());

-- Authenticated users can validate their own invite code (select by code)
CREATE POLICY "Users validate invite code"
  ON beta_invites FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can update invites (or the system via service role)
CREATE POLICY "Admins update invites"
  ON beta_invites FOR UPDATE
  TO authenticated
  USING (is_admin() OR used_by = auth.uid());

-- ─── User Activity ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_activity (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Users can insert their own activity
CREATE POLICY "Users insert own activity"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can read their own activity
CREATE POLICY "Users read own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all activity
CREATE POLICY "Admins read all activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (is_admin());

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at DESC);
