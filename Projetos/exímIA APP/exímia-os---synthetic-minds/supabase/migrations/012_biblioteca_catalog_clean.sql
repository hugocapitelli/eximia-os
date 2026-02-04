-- ============================================================
-- MIGRATION 012: Biblioteca Catalog - Clean Version
-- Purpose: Drop and recreate all biblioteca catalog objects
-- Note: This replaces 011 with proper cleanup
-- ============================================================

-- ============================================================
-- STEP 1: Drop everything in reverse dependency order
-- ============================================================

-- Drop ALL views first (including any that might exist as views)
DROP VIEW IF EXISTS public.user_favorites_view CASCADE;
DROP VIEW IF EXISTS public.catalog_view CASCADE;
DROP VIEW IF EXISTS public.summary_reading_progress CASCADE;
DROP VIEW IF EXISTS public.reading_preferences CASCADE;
DROP VIEW IF EXISTS public.user_notes CASCADE;
DROP VIEW IF EXISTS public.user_favorites CASCADE;
DROP VIEW IF EXISTS public.summary_chapters CASCADE;
DROP VIEW IF EXISTS public.book_summaries CASCADE;
DROP VIEW IF EXISTS public.book_catalog CASCADE;
DROP VIEW IF EXISTS public.authors CASCADE;

-- Drop tables (CASCADE to drop dependent objects)
DROP TABLE IF EXISTS public.reading_preferences CASCADE;
DROP TABLE IF EXISTS public.summary_reading_progress CASCADE;
DROP TABLE IF EXISTS public.user_notes CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.summary_chapters CASCADE;
DROP TABLE IF EXISTS public.book_summaries CASCADE;
DROP TABLE IF EXISTS public.book_catalog CASCADE;
DROP TABLE IF EXISTS public.authors CASCADE;

-- ============================================================
-- STEP 2: Create AUTHORS table
-- ============================================================

CREATE TABLE public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  bio TEXT,
  photo_url TEXT,
  mind_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_authors_name ON public.authors(name);

-- ============================================================
-- STEP 3: Create BOOK CATALOG TABLE
-- ============================================================

CREATE TABLE public.book_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_books_id TEXT UNIQUE,
  open_library_key TEXT UNIQUE,
  isbn13 TEXT UNIQUE,
  isbn10 TEXT UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  author_name TEXT,
  description TEXT,
  publisher TEXT,
  published_date DATE,
  page_count INTEGER,
  language TEXT DEFAULT 'pt',
  categories TEXT[] DEFAULT '{}',
  cover_url TEXT,
  thumbnail_url TEXT,
  favorites_count INTEGER DEFAULT 0,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_book_catalog_title ON public.book_catalog(title);
CREATE INDEX idx_book_catalog_author_name ON public.book_catalog(author_name);
CREATE INDEX idx_book_catalog_google_id ON public.book_catalog(google_books_id);
CREATE INDEX idx_book_catalog_isbn13 ON public.book_catalog(isbn13);
CREATE INDEX idx_book_catalog_isbn10 ON public.book_catalog(isbn10);

-- ============================================================
-- STEP 4: Create BOOK SUMMARIES TABLE
-- ============================================================

CREATE TABLE public.book_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id UUID NOT NULL REFERENCES public.book_catalog(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_summaries_catalog_id ON public.book_summaries(catalog_id);
CREATE INDEX idx_summaries_created_by ON public.book_summaries(created_by);
CREATE INDEX idx_summaries_published ON public.book_summaries(is_published);

-- ============================================================
-- STEP 5: Create SUMMARY CHAPTERS TABLE
-- ============================================================

CREATE TABLE public.summary_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_id UUID NOT NULL REFERENCES public.book_summaries(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chapters_summary_id ON public.summary_chapters(summary_id);
CREATE INDEX idx_chapters_number ON public.summary_chapters(chapter_number);
CREATE INDEX idx_chapters_order ON public.summary_chapters(order_index);

-- ============================================================
-- STEP 6: Create USER FAVORITES TABLE
-- ============================================================

CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id UUID NOT NULL REFERENCES public.book_catalog(id) ON DELETE CASCADE,
  favorited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_favorites_catalog_id ON public.user_favorites(catalog_id);

-- ============================================================
-- STEP 7: Create USER NOTES TABLE
-- ============================================================

CREATE TABLE public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id UUID NOT NULL REFERENCES public.book_catalog(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('note', 'highlight', 'quote')),
  content TEXT NOT NULL,
  page_number INTEGER,
  chapter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON public.user_notes(user_id);
CREATE INDEX idx_notes_catalog_id ON public.user_notes(catalog_id);
CREATE INDEX idx_notes_type ON public.user_notes(type);

-- ============================================================
-- STEP 8: Create SUMMARY READING PROGRESS TABLE
-- ============================================================

CREATE TABLE public.summary_reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_id UUID NOT NULL REFERENCES public.book_summaries(id) ON DELETE CASCADE,
  current_chapter INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_progress_user_id ON public.summary_reading_progress(user_id);
CREATE INDEX idx_progress_summary_id ON public.summary_reading_progress(summary_id);

-- ============================================================
-- STEP 9: Create READING PREFERENCES TABLE
-- ============================================================

CREATE TABLE public.reading_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'sepia', 'dark')),
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_preferences_user_id ON public.reading_preferences(user_id);

-- ============================================================
-- STEP 10: Create VIEWS
-- ============================================================

CREATE VIEW public.catalog_view AS
SELECT
  bc.id,
  bc.google_books_id,
  bc.open_library_key,
  bc.isbn13,
  bc.isbn10,
  bc.title,
  bc.subtitle,
  bc.author_id,
  bc.author_name,
  bc.description,
  bc.publisher,
  bc.published_date,
  bc.page_count,
  bc.language,
  bc.categories,
  bc.cover_url,
  bc.thumbnail_url,
  bc.favorites_count,
  bc.created_at,
  bc.updated_at,
  bs.id AS summary_id,
  COALESCE(bs.is_published, FALSE) AS has_published_summary,
  COALESCE(COUNT(sc.id), 0) AS chapter_count
FROM public.book_catalog bc
LEFT JOIN public.book_summaries bs ON bc.id = bs.catalog_id AND bs.is_published = TRUE
LEFT JOIN public.summary_chapters sc ON bs.id = sc.summary_id
GROUP BY bc.id, bs.id;

CREATE VIEW public.user_favorites_view AS
SELECT
  uf.id AS favorite_id,
  uf.user_id,
  uf.favorited_at,
  bc.id,
  bc.google_books_id,
  bc.open_library_key,
  bc.isbn13,
  bc.isbn10,
  bc.title,
  bc.subtitle,
  bc.author_id,
  bc.author_name,
  bc.description,
  bc.publisher,
  bc.published_date,
  bc.page_count,
  bc.language,
  bc.categories,
  bc.cover_url,
  bc.thumbnail_url,
  bc.favorites_count,
  bc.created_at,
  bc.updated_at,
  bs.id AS summary_id,
  COALESCE(bs.is_published, FALSE) AS has_published_summary,
  COALESCE(COUNT(sc.id), 0) AS chapter_count,
  COALESCE(srp.current_chapter, 0) AS current_chapter,
  COALESCE(srp.completed, FALSE) AS summary_completed,
  srp.last_read_at
FROM public.user_favorites uf
JOIN public.book_catalog bc ON uf.catalog_id = bc.id
LEFT JOIN public.book_summaries bs ON bc.id = bs.catalog_id AND bs.is_published = TRUE
LEFT JOIN public.summary_chapters sc ON bs.id = sc.summary_id
LEFT JOIN public.summary_reading_progress srp ON bs.id = srp.summary_id AND srp.user_id = uf.user_id
WHERE uf.user_id = auth.uid()
GROUP BY uf.id, bc.id, bs.id, srp.id;

-- ============================================================
-- STEP 11: Create AUTO-UPDATE TIMESTAMP TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_book_catalog_updated_at
BEFORE UPDATE ON public.book_catalog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_book_summaries_updated_at
BEFORE UPDATE ON public.book_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_summary_chapters_updated_at
BEFORE UPDATE ON public.summary_chapters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_user_notes_updated_at
BEFORE UPDATE ON public.user_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trigger_reading_preferences_updated_at
BEFORE UPDATE ON public.reading_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- STEP 12: Enable RLS
-- ============================================================

ALTER TABLE public.book_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summary_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summary_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 13: RLS POLICIES - book_catalog
-- ============================================================

CREATE POLICY "catalog_read_all" ON public.book_catalog
  FOR SELECT USING (TRUE);

CREATE POLICY "catalog_write_admin" ON public.book_catalog
  FOR INSERT WITH CHECK (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "catalog_update_admin" ON public.book_catalog
  FOR UPDATE USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "catalog_delete_admin" ON public.book_catalog
  FOR DELETE USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================================
-- STEP 14: RLS POLICIES - book_summaries
-- ============================================================

CREATE POLICY "summaries_read_published" ON public.book_summaries
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "summaries_read_all_admin" ON public.book_summaries
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "summaries_write_admin" ON public.book_summaries
  FOR INSERT WITH CHECK (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "summaries_update_admin" ON public.book_summaries
  FOR UPDATE USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "summaries_delete_admin" ON public.book_summaries
  FOR DELETE USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================================
-- STEP 15: RLS POLICIES - summary_chapters
-- ============================================================

CREATE POLICY "chapters_read_published" ON public.summary_chapters
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM public.book_summaries
    WHERE id = summary_id AND is_published = TRUE
  ));

CREATE POLICY "chapters_read_all_admin" ON public.summary_chapters
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "chapters_write_admin" ON public.summary_chapters
  FOR INSERT WITH CHECK (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "chapters_update_admin" ON public.summary_chapters
  FOR UPDATE USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "chapters_delete_admin" ON public.summary_chapters
  FOR DELETE USING (EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- ============================================================
-- STEP 16: RLS POLICIES - user_favorites
-- ============================================================

CREATE POLICY "favorites_read_own" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_write_own" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STEP 17: RLS POLICIES - user_notes
-- ============================================================

CREATE POLICY "notes_read_own" ON public.user_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notes_write_own" ON public.user_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update_own" ON public.user_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notes_delete_own" ON public.user_notes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STEP 18: RLS POLICIES - summary_reading_progress
-- ============================================================

CREATE POLICY "progress_read_own" ON public.summary_reading_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "progress_write_own" ON public.summary_reading_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "progress_update_own" ON public.summary_reading_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- STEP 19: RLS POLICIES - reading_preferences
-- ============================================================

CREATE POLICY "preferences_read_own" ON public.reading_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "preferences_write_own" ON public.reading_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "preferences_update_own" ON public.reading_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- DONE
-- ============================================================
