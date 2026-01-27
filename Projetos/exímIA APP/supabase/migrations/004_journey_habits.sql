-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION 004: Journey Habits Schema
-- ExímIA APP - BLOCO 3.2
-- Created: 2026-01-27
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════

-- Habit frequency types
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'monthly');

-- Habit status
CREATE TYPE habit_status AS ENUM ('active', 'paused', 'archived', 'completed');

-- ═══════════════════════════════════════════════════════════════════
-- HABITS TABLE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🎯',
  color TEXT DEFAULT '#6366F1',

  -- Frequency configuration
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  target_days INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- For weekly: 0=Sun, 1=Mon, 2=Tue, etc.
  target_count INTEGER DEFAULT 1, -- Times per day/week/month

  -- Streak tracking
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,

  -- Status
  status habit_status DEFAULT 'active',

  -- Goal linking (optional)
  linked_goal_id UUID,

  -- Gamification
  badges JSONB DEFAULT '[]',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_completed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════════
-- HABIT COMPLETIONS TABLE
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Completion date (stored as date, not timestamp, for easier querying)
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Optional notes for the completion
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate completions on same day
  UNIQUE(habit_id, completed_date)
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════

-- Habits indexes
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_status ON habits(status);
CREATE INDEX idx_habits_frequency ON habits(frequency);
CREATE INDEX idx_habits_linked_goal ON habits(linked_goal_id) WHERE linked_goal_id IS NOT NULL;
CREATE INDEX idx_habits_created_at ON habits(created_at DESC);

-- Completions indexes
CREATE INDEX idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_completions_user_id ON habit_completions(user_id);
CREATE INDEX idx_completions_date ON habit_completions(completed_date DESC);
CREATE INDEX idx_completions_habit_date ON habit_completions(habit_id, completed_date);

-- ═══════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Habits policies
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- Completions policies
CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completions"
  ON habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completions"
  ON habit_completions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════

-- Function to calculate streak for a habit
CREATE OR REPLACE FUNCTION calculate_habit_streak(p_habit_id UUID)
RETURNS TABLE (current_streak INTEGER, best_streak INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_frequency habit_frequency;
  v_target_days INTEGER[];
  v_current_streak INTEGER := 0;
  v_best_streak INTEGER := 0;
  v_prev_date DATE := NULL;
  v_streak_count INTEGER := 0;
  r RECORD;
BEGIN
  -- Get habit frequency and target days
  SELECT h.frequency, h.target_days INTO v_frequency, v_target_days
  FROM habits h WHERE h.id = p_habit_id;

  -- Calculate streaks based on completions
  FOR r IN
    SELECT completed_date
    FROM habit_completions
    WHERE habit_id = p_habit_id
    ORDER BY completed_date DESC
  LOOP
    IF v_prev_date IS NULL THEN
      -- First iteration
      v_streak_count := 1;
      v_prev_date := r.completed_date;
    ELSE
      -- Check if this date is consecutive based on frequency
      CASE v_frequency
        WHEN 'daily' THEN
          IF v_prev_date - r.completed_date = 1 THEN
            v_streak_count := v_streak_count + 1;
          ELSE
            -- Streak broken
            IF v_streak_count > v_best_streak THEN
              v_best_streak := v_streak_count;
            END IF;
            v_streak_count := 1;
          END IF;
        WHEN 'weekly' THEN
          -- For weekly, check if within same week or consecutive weeks
          IF v_prev_date - r.completed_date <= 7 THEN
            v_streak_count := v_streak_count + 1;
          ELSE
            IF v_streak_count > v_best_streak THEN
              v_best_streak := v_streak_count;
            END IF;
            v_streak_count := 1;
          END IF;
        WHEN 'monthly' THEN
          -- For monthly, check if consecutive months
          IF (DATE_TRUNC('month', v_prev_date) - INTERVAL '1 month') = DATE_TRUNC('month', r.completed_date) THEN
            v_streak_count := v_streak_count + 1;
          ELSE
            IF v_streak_count > v_best_streak THEN
              v_best_streak := v_streak_count;
            END IF;
            v_streak_count := 1;
          END IF;
      END CASE;
      v_prev_date := r.completed_date;
    END IF;
  END LOOP;

  -- Check final streak count
  IF v_streak_count > v_best_streak THEN
    v_best_streak := v_streak_count;
  END IF;

  -- Check if current streak is still active (completed today or yesterday for daily)
  SELECT COUNT(*) INTO v_current_streak
  FROM habit_completions
  WHERE habit_id = p_habit_id
    AND completed_date >= CURRENT_DATE - INTERVAL '1 day';

  IF v_current_streak > 0 THEN
    v_current_streak := v_streak_count;
  ELSE
    v_current_streak := 0;
  END IF;

  RETURN QUERY SELECT v_current_streak, v_best_streak;
END;
$$;

-- Function to complete a habit for today
CREATE OR REPLACE FUNCTION complete_habit(
  p_habit_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS habit_completions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_completion habit_completions;
  v_streaks RECORD;
  v_total_completions INTEGER;
  v_new_badges JSONB := '[]';
  v_existing_badges JSONB;
BEGIN
  -- Insert completion
  INSERT INTO habit_completions (habit_id, user_id, completed_date, notes)
  VALUES (p_habit_id, auth.uid(), CURRENT_DATE, p_notes)
  ON CONFLICT (habit_id, completed_date)
  DO UPDATE SET notes = COALESCE(EXCLUDED.notes, habit_completions.notes)
  RETURNING * INTO v_completion;

  -- Calculate new streaks
  SELECT * INTO v_streaks FROM calculate_habit_streak(p_habit_id);

  -- Get total completions
  SELECT COUNT(*) INTO v_total_completions
  FROM habit_completions WHERE habit_id = p_habit_id;

  -- Get existing badges
  SELECT badges INTO v_existing_badges FROM habits WHERE id = p_habit_id;

  -- Check for new milestone badges
  IF v_streaks.current_streak >= 7 AND NOT v_existing_badges @> '[{"milestone": 7}]' THEN
    v_new_badges := v_new_badges || jsonb_build_array(jsonb_build_object('milestone', 7, 'name', 'First Week', 'earned_at', NOW()));
  END IF;

  IF v_streaks.current_streak >= 30 AND NOT v_existing_badges @> '[{"milestone": 30}]' THEN
    v_new_badges := v_new_badges || jsonb_build_array(jsonb_build_object('milestone', 30, 'name', 'One Month Strong', 'earned_at', NOW()));
  END IF;

  IF v_streaks.current_streak >= 100 AND NOT v_existing_badges @> '[{"milestone": 100}]' THEN
    v_new_badges := v_new_badges || jsonb_build_array(jsonb_build_object('milestone', 100, 'name', 'Century Club', 'earned_at', NOW()));
  END IF;

  -- Update habit with new stats and badges
  UPDATE habits
  SET
    current_streak = v_streaks.current_streak,
    best_streak = GREATEST(best_streak, v_streaks.best_streak),
    total_completions = v_total_completions,
    last_completed_at = NOW(),
    updated_at = NOW(),
    badges = CASE
      WHEN v_new_badges != '[]'::jsonb THEN v_existing_badges || v_new_badges
      ELSE v_existing_badges
    END
  WHERE id = p_habit_id;

  RETURN v_completion;
END;
$$;

-- Function to uncomplete a habit for a specific date
CREATE OR REPLACE FUNCTION uncomplete_habit(
  p_habit_id UUID,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted BOOLEAN;
  v_streaks RECORD;
  v_total_completions INTEGER;
BEGIN
  -- Delete the completion
  DELETE FROM habit_completions
  WHERE habit_id = p_habit_id
    AND completed_date = p_date
    AND user_id = auth.uid();

  v_deleted := FOUND;

  IF v_deleted THEN
    -- Recalculate streaks
    SELECT * INTO v_streaks FROM calculate_habit_streak(p_habit_id);

    -- Get total completions
    SELECT COUNT(*) INTO v_total_completions
    FROM habit_completions WHERE habit_id = p_habit_id;

    -- Update habit stats
    UPDATE habits
    SET
      current_streak = v_streaks.current_streak,
      total_completions = v_total_completions,
      updated_at = NOW()
    WHERE id = p_habit_id;
  END IF;

  RETURN v_deleted;
END;
$$;

-- Function to get completion rate for a habit
CREATE OR REPLACE FUNCTION get_habit_completion_rate(
  p_habit_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_frequency habit_frequency;
  v_target_days INTEGER[];
  v_target_count INTEGER;
  v_completions INTEGER;
  v_expected INTEGER;
  v_rate NUMERIC;
BEGIN
  -- Get habit details
  SELECT h.frequency, h.target_days, h.target_count
  INTO v_frequency, v_target_days, v_target_count
  FROM habits h WHERE h.id = p_habit_id;

  -- Count completions in period
  SELECT COUNT(*) INTO v_completions
  FROM habit_completions
  WHERE habit_id = p_habit_id
    AND completed_date >= CURRENT_DATE - (p_days || ' days')::INTERVAL;

  -- Calculate expected completions based on frequency
  CASE v_frequency
    WHEN 'daily' THEN
      v_expected := p_days * COALESCE(v_target_count, 1);
    WHEN 'weekly' THEN
      v_expected := (p_days / 7) * COALESCE(array_length(v_target_days, 1), 1) * COALESCE(v_target_count, 1);
    WHEN 'monthly' THEN
      v_expected := (p_days / 30) * COALESCE(v_target_count, 1);
  END CASE;

  -- Avoid division by zero
  IF v_expected = 0 THEN
    RETURN 0;
  END IF;

  v_rate := (v_completions::NUMERIC / v_expected::NUMERIC) * 100;

  -- Cap at 100%
  RETURN LEAST(v_rate, 100);
END;
$$;

-- Function to check if habit is due today
CREATE OR REPLACE FUNCTION is_habit_due_today(
  p_frequency habit_frequency,
  p_target_days INTEGER[]
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_today_dow INTEGER;
BEGIN
  v_today_dow := EXTRACT(DOW FROM CURRENT_DATE)::INTEGER; -- 0 = Sunday

  CASE p_frequency
    WHEN 'daily' THEN
      RETURN TRUE;
    WHEN 'weekly' THEN
      -- Check if today's day of week is in target_days
      IF p_target_days IS NULL OR array_length(p_target_days, 1) IS NULL THEN
        RETURN TRUE; -- If no specific days, due every day
      END IF;
      RETURN v_today_dow = ANY(p_target_days);
    WHEN 'monthly' THEN
      -- For monthly, assume always due (can be refined later)
      RETURN TRUE;
  END CASE;

  RETURN FALSE;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_habits_updated_at();

-- ═══════════════════════════════════════════════════════════════════
-- COMMENTS
-- ═══════════════════════════════════════════════════════════════════

COMMENT ON TABLE habits IS 'User habits for the Journey module with streak tracking';
COMMENT ON TABLE habit_completions IS 'Daily completion records for habits';
COMMENT ON FUNCTION calculate_habit_streak IS 'Calculates current and best streak for a habit';
COMMENT ON FUNCTION complete_habit IS 'Marks a habit as complete for today and updates streaks';
COMMENT ON FUNCTION uncomplete_habit IS 'Removes a habit completion for a specific date';
COMMENT ON FUNCTION get_habit_completion_rate IS 'Calculates completion rate percentage over a period';
COMMENT ON FUNCTION is_habit_due_today IS 'Checks if a habit is due based on frequency and target days';
