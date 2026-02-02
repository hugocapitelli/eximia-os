-- ============================================================================
-- MIGRATION 004: Fix RLS Infinite Recursion
-- ============================================================================
-- Problem: is_admin() function causes infinite recursion on profiles table
-- Solution: Drop CASCADE and recreate all policies correctly
-- ============================================================================

-- Step 1: Drop problematic policies on profiles first
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Step 2: Drop is_admin() function CASCADE (will drop all dependent policies)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- Step 3: Recreate is_admin() with SECURITY INVOKER to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get the role directly from the profiles table
  -- SECURITY INVOKER means this runs with the caller's permissions
  -- This avoids infinite recursion on profiles table
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN user_role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================================================
-- Step 4: Recreate profiles policies WITHOUT is_admin() (to avoid recursion)
-- ============================================================================

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Service role can do everything
CREATE POLICY "Service role full access"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- Step 5: Drop all existing policies before recreating
-- ============================================================================

-- Drop Academy policies
DROP POLICY IF EXISTS "courses_all_admin" ON academy.courses;
DROP POLICY IF EXISTS "courses_select_enrolled" ON academy.courses;
DROP POLICY IF EXISTS "modules_all_admin" ON academy.modules;
DROP POLICY IF EXISTS "modules_select_enrolled" ON academy.modules;
DROP POLICY IF EXISTS "lessons_all_admin" ON academy.lessons;
DROP POLICY IF EXISTS "lessons_select_enrolled" ON academy.lessons;
DROP POLICY IF EXISTS "enrollments_all_admin" ON academy.enrollments;
DROP POLICY IF EXISTS "enrollments_select_own" ON academy.enrollments;
DROP POLICY IF EXISTS "enrollments_insert_own" ON academy.enrollments;
DROP POLICY IF EXISTS "tracks_all_admin" ON academy.tracks;
DROP POLICY IF EXISTS "tracks_select_all" ON academy.tracks;
DROP POLICY IF EXISTS "track_courses_all_admin" ON academy.track_courses;
DROP POLICY IF EXISTS "track_courses_select_all" ON academy.track_courses;
DROP POLICY IF EXISTS "achievements_all_admin" ON academy.achievements;
DROP POLICY IF EXISTS "achievements_select_all" ON academy.achievements;
DROP POLICY IF EXISTS "lesson_progress_all_admin" ON academy.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_select_own" ON academy.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_insert_own" ON academy.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_update_own" ON academy.lesson_progress;
DROP POLICY IF EXISTS "socratic_sessions_all_admin" ON academy.socratic_sessions;
DROP POLICY IF EXISTS "socratic_sessions_select_own" ON academy.socratic_sessions;
DROP POLICY IF EXISTS "socratic_sessions_insert_own" ON academy.socratic_sessions;
DROP POLICY IF EXISTS "user_achievements_all_admin" ON academy.user_achievements;
DROP POLICY IF EXISTS "user_achievements_select_own" ON academy.user_achievements;

-- Drop Biblioteca policies
DROP POLICY IF EXISTS "authors_all_admin" ON biblioteca.authors;
DROP POLICY IF EXISTS "authors_select_all" ON biblioteca.authors;
DROP POLICY IF EXISTS "books_all_admin" ON biblioteca.books;
DROP POLICY IF EXISTS "books_select_own" ON biblioteca.books;
DROP POLICY IF EXISTS "books_insert_own" ON biblioteca.books;
DROP POLICY IF EXISTS "books_update_own" ON biblioteca.books;
DROP POLICY IF EXISTS "books_delete_own" ON biblioteca.books;
DROP POLICY IF EXISTS "reading_progress_all_admin" ON biblioteca.reading_progress;
DROP POLICY IF EXISTS "reading_progress_select_own" ON biblioteca.reading_progress;
DROP POLICY IF EXISTS "reading_progress_insert_own" ON biblioteca.reading_progress;
DROP POLICY IF EXISTS "reading_progress_update_own" ON biblioteca.reading_progress;
DROP POLICY IF EXISTS "notes_all_admin" ON biblioteca.notes;
DROP POLICY IF EXISTS "notes_select_own" ON biblioteca.notes;
DROP POLICY IF EXISTS "notes_insert_own" ON biblioteca.notes;
DROP POLICY IF EXISTS "notes_update_own" ON biblioteca.notes;
DROP POLICY IF EXISTS "notes_delete_own" ON biblioteca.notes;
DROP POLICY IF EXISTS "reading_goals_all_admin" ON biblioteca.reading_goals;
DROP POLICY IF EXISTS "reading_goals_select_own" ON biblioteca.reading_goals;
DROP POLICY IF EXISTS "reading_goals_insert_own" ON biblioteca.reading_goals;
DROP POLICY IF EXISTS "reading_goals_update_own" ON biblioteca.reading_goals;
DROP POLICY IF EXISTS "reading_goals_delete_own" ON biblioteca.reading_goals;

-- ============================================================================
-- Step 6: Recreate Academy policies
-- ============================================================================

-- Academy: courses
CREATE POLICY "courses_all_admin"
  ON academy.courses FOR ALL
  USING (public.is_admin());

CREATE POLICY "courses_select_enrolled"
  ON academy.courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM academy.enrollments
      WHERE course_id = courses.id AND user_id = auth.uid()
    )
  );

-- Academy: modules
CREATE POLICY "modules_all_admin"
  ON academy.modules FOR ALL
  USING (public.is_admin());

CREATE POLICY "modules_select_enrolled"
  ON academy.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM academy.enrollments
      JOIN academy.courses ON enrollments.course_id = courses.id
      WHERE courses.id = modules.course_id AND enrollments.user_id = auth.uid()
    )
  );

-- Academy: lessons
CREATE POLICY "lessons_all_admin"
  ON academy.lessons FOR ALL
  USING (public.is_admin());

CREATE POLICY "lessons_select_enrolled"
  ON academy.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM academy.enrollments
      JOIN academy.courses ON enrollments.course_id = courses.id
      JOIN academy.modules ON modules.course_id = courses.id
      WHERE modules.id = lessons.module_id AND enrollments.user_id = auth.uid()
    )
  );

-- Academy: enrollments
CREATE POLICY "enrollments_all_admin"
  ON academy.enrollments FOR ALL
  USING (public.is_admin());

CREATE POLICY "enrollments_select_own"
  ON academy.enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "enrollments_insert_own"
  ON academy.enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Academy: tracks
CREATE POLICY "tracks_all_admin"
  ON academy.tracks FOR ALL
  USING (public.is_admin());

CREATE POLICY "tracks_select_all"
  ON academy.tracks FOR SELECT
  USING (true);

-- Academy: track_courses
CREATE POLICY "track_courses_all_admin"
  ON academy.track_courses FOR ALL
  USING (public.is_admin());

CREATE POLICY "track_courses_select_all"
  ON academy.track_courses FOR SELECT
  USING (true);

-- Academy: achievements
CREATE POLICY "achievements_all_admin"
  ON academy.achievements FOR ALL
  USING (public.is_admin());

CREATE POLICY "achievements_select_all"
  ON academy.achievements FOR SELECT
  USING (true);

-- Academy: lesson_progress (policies remain unchanged)
CREATE POLICY "lesson_progress_all_admin"
  ON academy.lesson_progress FOR ALL
  USING (public.is_admin());

CREATE POLICY "lesson_progress_select_own"
  ON academy.lesson_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "lesson_progress_insert_own"
  ON academy.lesson_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "lesson_progress_update_own"
  ON academy.lesson_progress FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Academy: socratic_sessions (policies remain unchanged)
CREATE POLICY "socratic_sessions_all_admin"
  ON academy.socratic_sessions FOR ALL
  USING (public.is_admin());

CREATE POLICY "socratic_sessions_select_own"
  ON academy.socratic_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "socratic_sessions_insert_own"
  ON academy.socratic_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Academy: user_achievements (policies remain unchanged)
CREATE POLICY "user_achievements_all_admin"
  ON academy.user_achievements FOR ALL
  USING (public.is_admin());

CREATE POLICY "user_achievements_select_own"
  ON academy.user_achievements FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- Step 7: Recreate Biblioteca policies
-- ============================================================================

-- Biblioteca: authors
CREATE POLICY "authors_all_admin"
  ON biblioteca.authors FOR ALL
  USING (public.is_admin());

CREATE POLICY "authors_select_all"
  ON biblioteca.authors FOR SELECT
  USING (true);

-- Biblioteca: books (policies remain unchanged)
CREATE POLICY "books_all_admin"
  ON biblioteca.books FOR ALL
  USING (public.is_admin());

CREATE POLICY "books_select_own"
  ON biblioteca.books FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "books_insert_own"
  ON biblioteca.books FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "books_update_own"
  ON biblioteca.books FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "books_delete_own"
  ON biblioteca.books FOR DELETE
  USING (user_id = auth.uid());

-- Biblioteca: reading_progress (policies remain unchanged)
CREATE POLICY "reading_progress_all_admin"
  ON biblioteca.reading_progress FOR ALL
  USING (public.is_admin());

CREATE POLICY "reading_progress_select_own"
  ON biblioteca.reading_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = reading_progress.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "reading_progress_insert_own"
  ON biblioteca.reading_progress FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = reading_progress.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "reading_progress_update_own"
  ON biblioteca.reading_progress FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = reading_progress.book_id AND books.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = reading_progress.book_id AND books.user_id = auth.uid()
    )
  );

-- Biblioteca: notes (policies remain unchanged)
CREATE POLICY "notes_all_admin"
  ON biblioteca.notes FOR ALL
  USING (public.is_admin());

CREATE POLICY "notes_select_own"
  ON biblioteca.notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = notes.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "notes_insert_own"
  ON biblioteca.notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = notes.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "notes_update_own"
  ON biblioteca.notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = notes.book_id AND books.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = notes.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "notes_delete_own"
  ON biblioteca.notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM biblioteca.books
      WHERE books.id = notes.book_id AND books.user_id = auth.uid()
    )
  );

-- Biblioteca: reading_goals (policies remain unchanged)
CREATE POLICY "reading_goals_all_admin"
  ON biblioteca.reading_goals FOR ALL
  USING (public.is_admin());

CREATE POLICY "reading_goals_select_own"
  ON biblioteca.reading_goals FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "reading_goals_insert_own"
  ON biblioteca.reading_goals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reading_goals_update_own"
  ON biblioteca.reading_goals FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reading_goals_delete_own"
  ON biblioteca.reading_goals FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================================
-- Verification Query (run after migration)
-- ============================================================================
-- SELECT schemaname, tablename, policyname
-- FROM pg_policies
-- WHERE schemaname IN ('public', 'academy', 'biblioteca')
-- ORDER BY schemaname, tablename, policyname;
