-- ============================================================
-- MIGRATION: Add Library Editor Enhancement Tables & Fields
-- Phase: 1 - Database Schema Extensions
-- Story: 7.1.0 - Database Schema Extensions & Indexes
-- ============================================================
-- This migration adds support for:
-- - Book file management (book_files table)
-- - Book tagging system (book_tags table)
-- - Extended book catalog fields
-- - Extended author profiles
-- - Performance indexes
-- - Row-Level Security policies

-- ============================================================
-- 1. EXTEND book_catalog TABLE
-- ============================================================

ALTER TABLE book_catalog
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS book_file_path TEXT,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS synopsys_source TEXT DEFAULT 'manual' CHECK (synopsys_source IN ('api', 'manual', 'ai')),
ADD COLUMN IF NOT EXISTS synopsys_fetched_at TIMESTAMP WITH TIME ZONE;

-- ============================================================
-- 2. EXTEND authors TABLE
-- ============================================================

ALTER TABLE authors
ADD COLUMN IF NOT EXISTS biography TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- ============================================================
-- 3. CREATE book_files TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS book_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to book catalog
  catalog_id UUID NOT NULL REFERENCES book_catalog(id) ON DELETE CASCADE,

  -- File information
  file_path TEXT NOT NULL UNIQUE,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'epub', 'json', 'yaml')),
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,

  -- Metadata
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),

  -- Constraints
  CONSTRAINT unique_file_per_catalog UNIQUE(catalog_id, file_type)
);

-- ============================================================
-- 4. CREATE book_tags TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS book_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to book catalog
  catalog_id UUID NOT NULL REFERENCES book_catalog(id) ON DELETE CASCADE,

  -- Tag information
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_tag_per_book UNIQUE(catalog_id, tag)
);

-- ============================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_book_files_catalog ON book_files(catalog_id);
CREATE INDEX IF NOT EXISTS idx_book_files_type ON book_files(file_type);
CREATE INDEX IF NOT EXISTS idx_book_tags_catalog ON book_tags(catalog_id);
CREATE INDEX IF NOT EXISTS idx_book_tags_tag ON book_tags(tag);
CREATE INDEX IF NOT EXISTS idx_book_catalog_has_file ON book_catalog(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_book_catalog_tags ON book_catalog USING GIN(tags);

-- ============================================================
-- 6. ROW-LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on new tables
ALTER TABLE book_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_tags ENABLE ROW LEVEL SECURITY;

-- book_files policies
-- Anyone can read file metadata
CREATE POLICY IF NOT EXISTS "book_files_select" ON book_files
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete files
CREATE POLICY IF NOT EXISTS "book_files_admin_write" ON book_files
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY IF NOT EXISTS "book_files_admin_update" ON book_files
  FOR UPDATE
  USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY IF NOT EXISTS "book_files_admin_delete" ON book_files
  FOR DELETE
  USING (auth.jwt() ->> 'user_role' = 'admin');

-- book_tags policies
-- Anyone can read tags
CREATE POLICY IF NOT EXISTS "book_tags_select" ON book_tags
  FOR SELECT
  USING (true);

-- Book owners or admins can insert tags
CREATE POLICY IF NOT EXISTS "book_tags_insert" ON book_tags
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'user_role' = 'admin' OR
    (SELECT added_by FROM book_catalog WHERE id = catalog_id) = auth.uid()
  );

-- Book owners or admins can delete tags
CREATE POLICY IF NOT EXISTS "book_tags_delete" ON book_tags
  FOR DELETE
  USING (
    auth.jwt() ->> 'user_role' = 'admin' OR
    (SELECT added_by FROM book_catalog WHERE id = catalog_id) = auth.uid()
  );

-- ============================================================
-- 7. GRANTS
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON book_files TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON book_tags TO authenticated;

-- ============================================================
-- ROLLBACK PROCEDURE (manual if needed)
-- ============================================================
-- To rollback, run:
-- ALTER TABLE book_catalog DROP COLUMN IF EXISTS tags;
-- ALTER TABLE book_catalog DROP COLUMN IF EXISTS book_file_path;
-- ALTER TABLE book_catalog DROP COLUMN IF EXISTS is_available;
-- ALTER TABLE book_catalog DROP COLUMN IF EXISTS synopsys_source;
-- ALTER TABLE book_catalog DROP COLUMN IF EXISTS synopsys_fetched_at;
-- ALTER TABLE authors DROP COLUMN IF EXISTS biography;
-- ALTER TABLE authors DROP COLUMN IF EXISTS photo_url;
-- ALTER TABLE authors DROP COLUMN IF EXISTS social_links;
-- ALTER TABLE authors DROP COLUMN IF EXISTS is_verified;
-- DROP TABLE IF EXISTS book_files CASCADE;
-- DROP TABLE IF EXISTS book_tags CASCADE;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these to verify successful migration:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'book_catalog' AND column_name IN ('tags', 'book_file_path', 'is_available');
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'authors' AND column_name IN ('biography', 'photo_url', 'social_links');
-- SELECT tablename FROM pg_tables WHERE tablename IN ('book_files', 'book_tags');
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('book_files', 'book_tags');
