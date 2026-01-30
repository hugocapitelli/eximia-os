-- ============================================================================
-- ACADEMY MODULE SCHEMA
-- Version: 1.0.0
-- Date: 2026-01-30
-- ============================================================================

-- Create academy schema
CREATE SCHEMA IF NOT EXISTS academy;

-- ============================================================================
-- TABLE: courses
-- ============================================================================
CREATE TABLE academy.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado')),
  category TEXT NOT NULL,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Content metadata
  thumbnail_url TEXT,
  cover_color TEXT,
  duration_minutes INT,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,

  -- Denormalized counts (updated via triggers)
  modules_count INT DEFAULT 0,
  lessons_count INT DEFAULT 0,
  enrollments_count INT DEFAULT 0,

  -- Skills & Tags
  skills TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT courses_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0)
);

-- Indexes
CREATE INDEX idx_courses_status ON academy.courses(status);
CREATE INDEX idx_courses_category ON academy.courses(category);
CREATE INDEX idx_courses_featured ON academy.courses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_courses_published ON academy.courses(status, published_at) WHERE status = 'published';

-- Comments
COMMENT ON TABLE academy.courses IS 'Academy courses catalog';
COMMENT ON COLUMN academy.courses.level IS 'Difficulty level: Iniciante, Intermediário, Avançado';
COMMENT ON COLUMN academy.courses.status IS 'Publishing status: draft, published, archived';

-- ============================================================================
-- TABLE: modules
-- ============================================================================
CREATE TABLE academy.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES academy.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL,

  -- Denormalized
  lessons_count INT DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT modules_sort_order_positive CHECK (sort_order >= 0),
  UNIQUE(course_id, sort_order)
);

CREATE INDEX idx_modules_course ON academy.modules(course_id);
CREATE INDEX idx_modules_sort ON academy.modules(course_id, sort_order);

-- ============================================================================
-- TABLE: lessons
-- ============================================================================
CREATE TABLE academy.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES academy.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES academy.modules(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL,
  duration_minutes INT,

  -- Features
  socratic_enabled BOOLEAN DEFAULT FALSE,
  has_quiz BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT lessons_sort_order_positive CHECK (sort_order >= 0),
  CONSTRAINT lessons_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0)
);

CREATE INDEX idx_lessons_course ON academy.lessons(course_id);
CREATE INDEX idx_lessons_module ON academy.lessons(module_id);
CREATE INDEX idx_lessons_sort ON academy.lessons(course_id, sort_order);

-- ============================================================================
-- TABLE: enrollments
-- ============================================================================
CREATE TABLE academy.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES academy.courses(id) ON DELETE CASCADE,

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),

  -- Progress (denormalized from lesson_progress)
  progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  completed_lessons_count INT DEFAULT 0,
  total_lessons_count INT DEFAULT 0,

  -- Timestamps
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON academy.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON academy.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON academy.enrollments(user_id, status);
CREATE INDEX idx_enrollments_active ON academy.enrollments(user_id) WHERE status = 'active';

-- ============================================================================
-- TABLE: lesson_progress
-- ============================================================================
CREATE TABLE academy.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES academy.lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES academy.enrollments(id) ON DELETE CASCADE,

  -- Progress
  is_completed BOOLEAN DEFAULT FALSE,
  watch_time_seconds INT DEFAULT 0 CHECK (watch_time_seconds >= 0),
  quiz_score INT CHECK (quiz_score IS NULL OR (quiz_score BETWEEN 0 AND 100)),

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON academy.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_enrollment ON academy.lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_lesson ON academy.lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_completed ON academy.lesson_progress(user_id, is_completed) WHERE is_completed = TRUE;

-- ============================================================================
-- TABLE: tracks (learning paths)
-- ============================================================================
CREATE TABLE academy.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Visual
  icon TEXT,
  color_from TEXT,
  color_to TEXT,

  -- Denormalized
  courses_count INT DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: track_courses (junction table)
-- ============================================================================
CREATE TABLE academy.track_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES academy.tracks(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES academy.courses(id) ON DELETE CASCADE,
  sort_order INT NOT NULL CHECK (sort_order >= 0),

  UNIQUE(track_id, course_id),
  UNIQUE(track_id, sort_order)
);

CREATE INDEX idx_track_courses_track ON academy.track_courses(track_id);
CREATE INDEX idx_track_courses_sort ON academy.track_courses(track_id, sort_order);

-- ============================================================================
-- TABLE: socratic_sessions
-- ============================================================================
CREATE TABLE academy.socratic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES academy.lessons(id) ON DELETE CASCADE,

  -- Session data
  messages JSONB NOT NULL DEFAULT '[]',
  context JSONB,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_socratic_user ON academy.socratic_sessions(user_id);
CREATE INDEX idx_socratic_lesson ON academy.socratic_sessions(lesson_id);
CREATE INDEX idx_socratic_active ON academy.socratic_sessions(user_id, is_active) WHERE is_active = TRUE;

-- ============================================================================
-- TABLE: achievements
-- ============================================================================
CREATE TABLE academy.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,

  -- Unlock criteria (JSONB for flexibility)
  criteria JSONB NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: user_achievements
-- ============================================================================
CREATE TABLE academy.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES academy.achievements(id) ON DELETE CASCADE,

  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON academy.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON academy.user_achievements(achievement_id);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION academy.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON academy.courses
  FOR EACH ROW EXECUTE FUNCTION academy.update_updated_at();

CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON academy.modules
  FOR EACH ROW EXECUTE FUNCTION academy.update_updated_at();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON academy.lessons
  FOR EACH ROW EXECUTE FUNCTION academy.update_updated_at();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON academy.tracks
  FOR EACH ROW EXECUTE FUNCTION academy.update_updated_at();
