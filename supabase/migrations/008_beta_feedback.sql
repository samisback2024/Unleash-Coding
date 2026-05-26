-- ============================================================
-- Migration 008: Beta Feedback System
-- ============================================================

CREATE TABLE IF NOT EXISTS beta_feedback (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  page_url    text,
  feedback_type text NOT NULL CHECK (
    feedback_type IN ('bug', 'design_issue', 'confusing_flow', 'feature_request', 'content_issue', 'other')
  ),
  message     text NOT NULL,
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'dismissed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can submit feedback"
  ON beta_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can read their own feedback
CREATE POLICY "Users can read own feedback"
  ON beta_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all feedback
CREATE POLICY "Admins can read all feedback"
  ON beta_feedback FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can update feedback status
CREATE POLICY "Admins can update feedback"
  ON beta_feedback FOR UPDATE
  TO authenticated
  USING (is_admin());
