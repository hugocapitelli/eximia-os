-- ============================================================
-- MIGRATION 014: Fix RLS Policies for Biblioteca
-- Purpose: Correct overly restrictive RLS policies
-- ============================================================

-- ============================================================
-- Re-enable RLS and fix policies
-- ============================================================

ALTER TABLE public.book_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summary_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summary_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BOOK_CATALOG: Simple - everyone reads, admins write
-- ============================================================

DROP POLICY IF EXISTS "catalog_read_all" ON public.book_catalog;
DROP POLICY IF EXISTS "catalog_write_admin" ON public.book_catalog;
DROP POLICY IF EXISTS "catalog_update_admin" ON public.book_catalog;
DROP POLICY IF EXISTS "catalog_delete_admin" ON public.book_catalog;

CREATE POLICY "catalog_select" ON public.book_catalog
  FOR SELECT USING (true);

CREATE POLICY "catalog_insert" ON public.book_catalog
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "catalog_update" ON public.book_catalog
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "catalog_delete" ON public.book_catalog
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- BOOK_SUMMARIES: Published visible to all, drafts to admins
-- ============================================================

DROP POLICY IF EXISTS "summaries_read_published" ON public.book_summaries;
DROP POLICY IF EXISTS "summaries_read_all_admin" ON public.book_summaries;
DROP POLICY IF EXISTS "summaries_write_admin" ON public.book_summaries;
DROP POLICY IF EXISTS "summaries_update_admin" ON public.book_summaries;
DROP POLICY IF EXISTS "summaries_delete_admin" ON public.book_summaries;

-- Public: Only see published summaries
CREATE POLICY "summaries_select_published" ON public.book_summaries
  FOR SELECT USING (is_published = true);

-- Admin: See all summaries
CREATE POLICY "summaries_select_admin" ON public.book_summaries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Can insert
CREATE POLICY "summaries_insert_admin" ON public.book_summaries
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Can update
CREATE POLICY "summaries_update_admin" ON public.book_summaries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Can delete
CREATE POLICY "summaries_delete_admin" ON public.book_summaries
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- SUMMARY_CHAPTERS: Published visible to all, drafts to admins
-- ============================================================

DROP POLICY IF EXISTS "chapters_read_published" ON public.summary_chapters;
DROP POLICY IF EXISTS "chapters_read_all_admin" ON public.summary_chapters;
DROP POLICY IF EXISTS "chapters_write_admin" ON public.summary_chapters;
DROP POLICY IF EXISTS "chapters_update_admin" ON public.summary_chapters;
DROP POLICY IF EXISTS "chapters_delete_admin" ON public.summary_chapters;

-- Public: See chapters from published summaries
CREATE POLICY "chapters_select_public" ON public.summary_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.book_summaries
      WHERE id = summary_id AND is_published = true
    )
  );

-- Admin: See all chapters
CREATE POLICY "chapters_select_admin" ON public.summary_chapters
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Can insert
CREATE POLICY "chapters_insert_admin" ON public.summary_chapters
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Can update
CREATE POLICY "chapters_update_admin" ON public.summary_chapters
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin: Can delete
CREATE POLICY "chapters_delete_admin" ON public.summary_chapters
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- USER_FAVORITES: Each user only their own
-- ============================================================

DROP POLICY IF EXISTS "favorites_read_own" ON public.user_favorites;
DROP POLICY IF EXISTS "favorites_write_own" ON public.user_favorites;
DROP POLICY IF EXISTS "favorites_delete_own" ON public.user_favorites;

CREATE POLICY "favorites_select" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- USER_NOTES: Each user only their own
-- ============================================================

DROP POLICY IF EXISTS "notes_read_own" ON public.user_notes;
DROP POLICY IF EXISTS "notes_write_own" ON public.user_notes;
DROP POLICY IF EXISTS "notes_update_own" ON public.user_notes;
DROP POLICY IF EXISTS "notes_delete_own" ON public.user_notes;

CREATE POLICY "notes_select" ON public.user_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notes_insert" ON public.user_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update" ON public.user_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notes_delete" ON public.user_notes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SUMMARY_READING_PROGRESS: Each user only their own
-- ============================================================

DROP POLICY IF EXISTS "progress_read_own" ON public.summary_reading_progress;
DROP POLICY IF EXISTS "progress_write_own" ON public.summary_reading_progress;
DROP POLICY IF EXISTS "progress_update_own" ON public.summary_reading_progress;

CREATE POLICY "progress_select" ON public.summary_reading_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "progress_insert" ON public.summary_reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_update" ON public.summary_reading_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- READING_PREFERENCES: Each user only their own
-- ============================================================

DROP POLICY IF EXISTS "preferences_read_own" ON public.reading_preferences;
DROP POLICY IF EXISTS "preferences_write_own" ON public.reading_preferences;
DROP POLICY IF EXISTS "preferences_update_own" ON public.reading_preferences;

CREATE POLICY "preferences_select" ON public.reading_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "preferences_insert" ON public.reading_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "preferences_update" ON public.reading_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- DONE - RLS Policies Fixed
-- ============================================================
