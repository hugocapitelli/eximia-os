-- ============================================================
-- FASE 01: MÓDULO BIBLIOTECA — V3 (SAFE MIGRATION)
-- Schema com IF NOT EXISTS para evitar conflitos
-- Version: 3.0.1
-- ============================================================

-- ============================================================
-- SCHEMA & EXTENSIONS
-- ============================================================

CREATE SCHEMA IF NOT EXISTS biblioteca;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- TABLE: user_roles
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
  granted_at    TIMESTAMPTZ DEFAULT now(),
  granted_by    UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);

-- ============================================================
-- FUNCTION: is_admin()
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also create in public schema for easier access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TABLE: authors
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.authors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(255) NOT NULL,
  bio           TEXT,
  photo_url     TEXT,
  mind_id       UUID,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraint if not exists (may fail silently)
DO $$
BEGIN
  ALTER TABLE biblioteca.authors ADD CONSTRAINT authors_name_unique UNIQUE (name);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_authors_name ON biblioteca.authors(name);

-- ============================================================
-- TABLE: book_catalog
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.book_catalog (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_books_id   VARCHAR(50),
  open_library_key  VARCHAR(50),
  isbn13            VARCHAR(17),
  isbn10            VARCHAR(13),
  title             VARCHAR(500) NOT NULL,
  subtitle          VARCHAR(500),
  author_id         UUID REFERENCES biblioteca.authors(id) ON DELETE SET NULL,
  author_name       VARCHAR(255),
  description       TEXT,
  publisher         VARCHAR(255),
  published_date    VARCHAR(20),
  page_count        INTEGER,
  language          VARCHAR(10) DEFAULT 'pt',
  categories        TEXT[],
  cover_url         TEXT,
  thumbnail_url     TEXT,
  favorites_count   INTEGER DEFAULT 0,
  added_by          UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraints if not exist
DO $$
BEGIN
  ALTER TABLE biblioteca.book_catalog ADD CONSTRAINT book_catalog_google_books_id_unique UNIQUE (google_books_id);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE biblioteca.book_catalog ADD CONSTRAINT book_catalog_isbn13_unique UNIQUE (isbn13);
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_book_catalog_title ON biblioteca.book_catalog USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_book_catalog_author ON biblioteca.book_catalog(author_name);
CREATE INDEX IF NOT EXISTS idx_book_catalog_categories ON biblioteca.book_catalog USING gin(categories);

-- ============================================================
-- TABLE: user_favorites
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.user_favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id    UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,
  favorited_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, catalog_id)
);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON biblioteca.user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_catalog ON biblioteca.user_favorites(catalog_id);

-- ============================================================
-- TABLE: book_summaries
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.book_summaries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalog_id    UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,
  title         VARCHAR(500) NOT NULL,
  created_by    UUID NOT NULL REFERENCES auth.users(id),
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_book_summaries_catalog ON biblioteca.book_summaries(catalog_id);
CREATE INDEX IF NOT EXISTS idx_book_summaries_published ON biblioteca.book_summaries(is_published) WHERE is_published = true;

-- ============================================================
-- TABLE: summary_chapters
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.summary_chapters (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  summary_id      UUID NOT NULL REFERENCES biblioteca.book_summaries(id) ON DELETE CASCADE,
  chapter_number  INTEGER NOT NULL,
  title           VARCHAR(500) NOT NULL,
  subtitle        VARCHAR(500),
  content         TEXT NOT NULL,
  order_index     INTEGER NOT NULL,
  word_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(summary_id, chapter_number)
);

CREATE INDEX IF NOT EXISTS idx_summary_chapters_summary ON biblioteca.summary_chapters(summary_id);

-- ============================================================
-- TABLE: summary_reading_progress
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.summary_reading_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_id      UUID NOT NULL REFERENCES biblioteca.book_summaries(id) ON DELETE CASCADE,
  current_chapter INTEGER DEFAULT 1,
  completed       BOOLEAN DEFAULT false,
  last_read_at    TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  UNIQUE(user_id, summary_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON biblioteca.summary_reading_progress(user_id);

-- ============================================================
-- TABLE: user_reading_preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.user_reading_preferences (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme       VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('light', 'sepia', 'dark')),
  font_size   VARCHAR(20) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: user_notes
-- ============================================================

CREATE TABLE IF NOT EXISTS biblioteca.user_notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id    UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,
  type          VARCHAR(20) DEFAULT 'note' CHECK (type IN ('note', 'highlight', 'quote')),
  content       TEXT NOT NULL,
  page_number   INTEGER,
  chapter       VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notes_user ON biblioteca.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_catalog ON biblioteca.user_notes(catalog_id);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if exist and recreate
DROP TRIGGER IF EXISTS trg_authors_updated ON biblioteca.authors;
CREATE TRIGGER trg_authors_updated BEFORE UPDATE ON biblioteca.authors
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

DROP TRIGGER IF EXISTS trg_book_catalog_updated ON biblioteca.book_catalog;
CREATE TRIGGER trg_book_catalog_updated BEFORE UPDATE ON biblioteca.book_catalog
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

DROP TRIGGER IF EXISTS trg_book_summaries_updated ON biblioteca.book_summaries;
CREATE TRIGGER trg_book_summaries_updated BEFORE UPDATE ON biblioteca.book_summaries
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

DROP TRIGGER IF EXISTS trg_summary_chapters_updated ON biblioteca.summary_chapters;
CREATE TRIGGER trg_summary_chapters_updated BEFORE UPDATE ON biblioteca.summary_chapters
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

DROP TRIGGER IF EXISTS trg_user_notes_updated ON biblioteca.user_notes;
CREATE TRIGGER trg_user_notes_updated BEFORE UPDATE ON biblioteca.user_notes
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

-- ============================================================
-- TRIGGER: Favorites count
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE biblioteca.book_catalog
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.catalog_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE biblioteca.book_catalog
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.catalog_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_favorites_count ON biblioteca.user_favorites;
CREATE TRIGGER trg_favorites_count
  AFTER INSERT OR DELETE ON biblioteca.user_favorites
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_favorites_count();

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE biblioteca.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_reading_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'biblioteca'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON biblioteca.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Authors: Read all, Admin write
CREATE POLICY authors_read ON biblioteca.authors FOR SELECT USING (true);
CREATE POLICY authors_admin ON biblioteca.authors FOR ALL USING (biblioteca.is_admin());

-- Book Catalog: Read all, Admin write
CREATE POLICY catalog_read ON biblioteca.book_catalog FOR SELECT USING (true);
CREATE POLICY catalog_admin ON biblioteca.book_catalog FOR ALL USING (biblioteca.is_admin());

-- User Favorites: Own data only
CREATE POLICY favorites_own ON biblioteca.user_favorites FOR ALL USING (auth.uid() = user_id);

-- Book Summaries: Read published, Admin write all
CREATE POLICY summaries_read ON biblioteca.book_summaries FOR SELECT
  USING (is_published = true OR biblioteca.is_admin());
CREATE POLICY summaries_admin ON biblioteca.book_summaries FOR ALL USING (biblioteca.is_admin());

-- Summary Chapters: Same as summaries
CREATE POLICY chapters_read ON biblioteca.summary_chapters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM biblioteca.book_summaries s
    WHERE s.id = summary_id AND (s.is_published = true OR biblioteca.is_admin())
  ));
CREATE POLICY chapters_admin ON biblioteca.summary_chapters FOR ALL USING (biblioteca.is_admin());

-- Reading Progress: Own data only
CREATE POLICY progress_own ON biblioteca.summary_reading_progress FOR ALL USING (auth.uid() = user_id);

-- Reading Preferences: Own data only
CREATE POLICY preferences_own ON biblioteca.user_reading_preferences FOR ALL USING (auth.uid() = user_id);

-- User Notes: Own data only
CREATE POLICY notes_own ON biblioteca.user_notes FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- GRANTS
-- ============================================================

GRANT USAGE ON SCHEMA biblioteca TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA biblioteca TO authenticated;
GRANT INSERT, UPDATE, DELETE ON biblioteca.user_favorites TO authenticated;
GRANT INSERT, UPDATE, DELETE ON biblioteca.summary_reading_progress TO authenticated;
GRANT INSERT, UPDATE, DELETE ON biblioteca.user_reading_preferences TO authenticated;
GRANT INSERT, UPDATE, DELETE ON biblioteca.user_notes TO authenticated;

-- Admin full access (via RLS policies)

-- ============================================================
-- INITIAL ADMIN SETUP (optional - uncomment and set your user_id)
-- ============================================================

-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR-USER-UUID-HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Biblioteca V3 schema migration completed successfully!';
END $$;
