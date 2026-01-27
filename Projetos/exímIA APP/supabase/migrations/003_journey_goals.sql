-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION 003: Journey Goals Schema
-- ExímIA APP - BLOCO 3.1
-- Created: 2026-01-27
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════

-- Goal status
CREATE TYPE goal_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'paused',
  'cancelled'
);

-- Goal category
CREATE TYPE goal_category AS ENUM (
  'business',
  'personal',
  'health',
  'finance',
  'education'
);

-- Goal priority
CREATE TYPE goal_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Goal scope (hierarchy)
CREATE TYPE goal_scope AS ENUM (
  'life',
  'yearly',
  'quarterly',
  'monthly',
  'weekly'
);

-- Key result status
CREATE TYPE key_result_status AS ENUM (
  'not_started',
  'in_progress',
  'completed',
  'at_risk'
);

-- ═══════════════════════════════════════════════════════════════════
-- GOALS TABLE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User ownership
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  why TEXT, -- Motivation/purpose

  -- Hierarchy
  scope goal_scope NOT NULL DEFAULT 'monthly',
  parent_id UUID REFERENCES goals(id) ON DELETE SET NULL,

  -- Categorization
  category goal_category NOT NULL DEFAULT 'personal',
  priority goal_priority NOT NULL DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',

  -- Status
  status goal_status NOT NULL DEFAULT 'not_started',

  -- Progress (0-100)
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Dates
  start_date DATE,
  target_date DATE,
  completed_at TIMESTAMPTZ,

  -- Metadata
  color TEXT, -- Hex color for visual distinction
  icon TEXT, -- Icon name

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_scope ON goals(scope);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_priority ON goals(priority);
CREATE INDEX idx_goals_parent_id ON goals(parent_id);
CREATE INDEX idx_goals_target_date ON goals(target_date);
CREATE INDEX idx_goals_user_scope_status ON goals(user_id, scope, status);

-- RLS
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- KEY RESULTS TABLE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Goal relationship
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  description TEXT,

  -- Metrics
  metric_type TEXT NOT NULL DEFAULT 'percentage', -- percentage, number, currency, boolean
  target_value DECIMAL(15,2) NOT NULL DEFAULT 100,
  current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  unit TEXT, -- %, km, R$, hours, etc.

  -- Status
  status key_result_status NOT NULL DEFAULT 'not_started',

  -- Progress (calculated from current_value/target_value or manual)
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Order within goal
  position INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_key_results_goal_id ON key_results(goal_id);
CREATE INDEX idx_key_results_user_id ON key_results(user_id);
CREATE INDEX idx_key_results_status ON key_results(status);

-- RLS
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own key results"
  ON key_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own key results"
  ON key_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own key results"
  ON key_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own key results"
  ON key_results FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- Function to calculate goal progress based on key results
CREATE OR REPLACE FUNCTION calculate_goal_progress(p_goal_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_avg_progress INTEGER;
  v_kr_count INTEGER;
BEGIN
  SELECT COUNT(*), COALESCE(AVG(progress)::INTEGER, 0)
  INTO v_kr_count, v_avg_progress
  FROM key_results
  WHERE goal_id = p_goal_id;

  -- If no key results, return current goal progress
  IF v_kr_count = 0 THEN
    RETURN (SELECT progress FROM goals WHERE id = p_goal_id);
  END IF;

  RETURN v_avg_progress;
END;
$$;

-- Function to update goal progress when key results change
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE goals
  SET
    progress = calculate_goal_progress(NEW.goal_id),
    updated_at = NOW()
  WHERE id = NEW.goal_id;

  RETURN NEW;
END;
$$;

-- Trigger to auto-update goal progress
CREATE TRIGGER trg_update_goal_progress
AFTER INSERT OR UPDATE OF current_value, progress ON key_results
FOR EACH ROW
EXECUTE FUNCTION update_goal_progress();

-- Function to calculate key result progress
CREATE OR REPLACE FUNCTION calculate_kr_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.target_value > 0 THEN
    NEW.progress := LEAST(100, GREATEST(0,
      ((NEW.current_value / NEW.target_value) * 100)::INTEGER
    ));
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to auto-calculate key result progress
CREATE TRIGGER trg_calculate_kr_progress
BEFORE INSERT OR UPDATE OF current_value, target_value ON key_results
FOR EACH ROW
EXECUTE FUNCTION calculate_kr_progress();

-- Function to get child goals (for hierarchy)
CREATE OR REPLACE FUNCTION get_child_goals(
  p_parent_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS SETOF goals
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM goals
  WHERE parent_id = p_parent_id
    AND user_id = p_user_id
  ORDER BY created_at DESC;
$$;

-- Function to get goal with key results
CREATE OR REPLACE FUNCTION get_goal_with_key_results(
  p_goal_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  goal goals,
  key_results JSON
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    g.*,
    COALESCE(
      (SELECT json_agg(kr ORDER BY kr.position)
       FROM key_results kr
       WHERE kr.goal_id = g.id),
      '[]'::json
    ) as key_results
  FROM goals g
  WHERE g.id = p_goal_id
    AND g.user_id = p_user_id;
$$;

-- Function to get goals by scope with key results count
CREATE OR REPLACE FUNCTION get_goals_by_scope(
  p_scope goal_scope,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  scope goal_scope,
  category goal_category,
  priority goal_priority,
  status goal_status,
  progress INTEGER,
  target_date DATE,
  parent_id UUID,
  key_results_count BIGINT,
  children_count BIGINT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    g.id,
    g.title,
    g.description,
    g.scope,
    g.category,
    g.priority,
    g.status,
    g.progress,
    g.target_date,
    g.parent_id,
    (SELECT COUNT(*) FROM key_results kr WHERE kr.goal_id = g.id) as key_results_count,
    (SELECT COUNT(*) FROM goals child WHERE child.parent_id = g.id) as children_count,
    g.created_at
  FROM goals g
  WHERE g.scope = p_scope
    AND g.user_id = p_user_id
  ORDER BY
    CASE g.priority
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END,
    g.target_date NULLS LAST,
    g.created_at DESC;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- AUTO-UPDATE TIMESTAMP
-- ═══════════════════════════════════════════════════════════════════

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for goals
CREATE TRIGGER trg_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for key_results
CREATE TRIGGER trg_key_results_updated_at
BEFORE UPDATE ON key_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════
-- COMMENTS
-- ═══════════════════════════════════════════════════════════════════

COMMENT ON TABLE goals IS 'Journey goals with hierarchical structure (Life → Yearly → Quarterly → Monthly → Weekly)';
COMMENT ON TABLE key_results IS 'Key results linked to goals for OKR-style tracking';
COMMENT ON COLUMN goals.scope IS 'Goal scope determines hierarchy level: life (vision) → yearly → quarterly → monthly → weekly (tasks)';
COMMENT ON COLUMN goals.parent_id IS 'Parent goal for cascading hierarchy';
COMMENT ON COLUMN goals.why IS 'The purpose/motivation behind the goal (Start with Why)';
COMMENT ON COLUMN key_results.metric_type IS 'Type of metric: percentage, number, currency, boolean';
COMMENT ON COLUMN key_results.target_value IS 'Target value to achieve';
COMMENT ON COLUMN key_results.current_value IS 'Current progress value';
