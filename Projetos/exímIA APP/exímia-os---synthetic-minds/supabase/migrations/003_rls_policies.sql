-- ============================================================================
-- ROW-LEVEL SECURITY POLICIES
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================================
-- ACADEMY POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE academy.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.track_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.socratic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy.user_achievements ENABLE ROW LEVEL SECURITY;

-- COURSES: Public can read published, admins can manage all
CREATE POLICY "courses_select_published"
  ON academy.courses FOR SELECT
  USING (status = 'published');

CREATE POLICY "courses_all_admin"
  ON academy.courses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- MODULES: Public can read for published courses
CREATE POLICY "modules_select_published_course"
  ON academy.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM academy.courses
      WHERE id = modules.course_id AND status = 'published'
    )
  );

CREATE POLICY "modules_all_admin"
  ON academy.modules FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- LESSONS: Public can read for published courses
CREATE POLICY "lessons_select_published_course"
  ON academy.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM academy.courses
      WHERE id = lessons.course_id AND status = 'published'
    )
  );

CREATE POLICY "lessons_all_admin"
  ON academy.lessons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ENROLLMENTS: Users can view and create their own
CREATE POLICY "enrollments_select_own"
  ON academy.enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "enrollments_insert_own"
  ON academy.enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_update_own"
  ON academy.enrollments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "enrollments_all_admin"
  ON academy.enrollments FOR ALL
  USING (public.is_admin());

-- LESSON_PROGRESS: Users can manage their own
CREATE POLICY "lesson_progress_all_own"
  ON academy.lesson_progress FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- TRACKS: Public can read
CREATE POLICY "tracks_select_all"
  ON academy.tracks FOR SELECT
  USING (true);

CREATE POLICY "tracks_all_admin"
  ON academy.tracks FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- TRACK_COURSES: Public can read
CREATE POLICY "track_courses_select_all"
  ON academy.track_courses FOR SELECT
  USING (true);

CREATE POLICY "track_courses_all_admin"
  ON academy.track_courses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- SOCRATIC_SESSIONS: Users can manage their own
CREATE POLICY "socratic_sessions_all_own"
  ON academy.socratic_sessions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ACHIEVEMENTS: Public can read
CREATE POLICY "achievements_select_all"
  ON academy.achievements FOR SELECT
  USING (true);

CREATE POLICY "achievements_all_admin"
  ON academy.achievements FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- USER_ACHIEVEMENTS: Users can view their own, system can insert
CREATE POLICY "user_achievements_select_own"
  ON academy.user_achievements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "user_achievements_insert_system"
  ON academy.user_achievements FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- BIBLIOTECA POLICIES
-- ============================================================================

ALTER TABLE biblioteca.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.reading_goals ENABLE ROW LEVEL SECURITY;

-- AUTHORS: Public can read, admins can manage
CREATE POLICY "authors_select_all"
  ON biblioteca.authors FOR SELECT
  USING (true);

CREATE POLICY "authors_all_admin"
  ON biblioteca.authors FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- BOOKS: Users can manage their own
CREATE POLICY "books_all_own"
  ON biblioteca.books FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- READING_PROGRESS: Users can manage their own
CREATE POLICY "reading_progress_all_own"
  ON biblioteca.reading_progress FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- NOTES: Users can manage their own
CREATE POLICY "notes_all_own"
  ON biblioteca.notes FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- READING_GOALS: Users can manage their own
CREATE POLICY "reading_goals_all_own"
  ON biblioteca.reading_goals FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
