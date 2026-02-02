-- ============================================================================
-- BIBLIOTECA MODULE SCHEMA
-- Version: 1.0.0
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS biblioteca;

-- ============================================================================
-- TABLE: authors
-- ============================================================================
CREATE TABLE biblioteca.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  mind_id UUID, -- Reference to synthetic_minds (future)
  books_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_authors_name ON biblioteca.authors(name);

-- ============================================================================
-- TABLE: books
-- ============================================================================
CREATE TABLE biblioteca.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author_name TEXT,
  author_id UUID REFERENCES biblioteca.authors(id) ON DELETE SET NULL,
  total_pages INT CHECK (total_pages IS NULL OR total_pages > 0),
  cover_url TEXT,
  isbn TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'to_read'
    CHECK (status IN ('to_read', 'reading', 'completed', 'abandoned')),
  rating INT CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_reading_at TIMESTAMPTZ,
  completed_reading_at TIMESTAMPTZ
);

CREATE INDEX idx_books_user ON biblioteca.books(user_id);
CREATE INDEX idx_books_status ON biblioteca.books(user_id, status);
CREATE INDEX idx_books_author ON biblioteca.books(author_id);
CREATE INDEX idx_books_category ON biblioteca.books(user_id, category);

-- ============================================================================
-- TABLE: reading_progress
-- ============================================================================
CREATE TABLE biblioteca.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES biblioteca.books(id) ON DELETE CASCADE,
  current_page INT NOT NULL CHECK (current_page >= 0),
  total_pages INT NOT NULL CHECK (total_pages > 0),
  progress_percent INT GENERATED ALWAYS AS (
    CASE
      WHEN total_pages > 0 THEN (current_page * 100 / total_pages)
      ELSE 0
    END
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, book_id),
  CHECK (current_page <= total_pages)
);

CREATE INDEX idx_reading_progress_user ON biblioteca.reading_progress(user_id);
CREATE INDEX idx_reading_progress_book ON biblioteca.reading_progress(book_id);

-- ============================================================================
-- TABLE: notes
-- ============================================================================
CREATE TABLE biblioteca.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES biblioteca.books(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page_number INT CHECK (page_number IS NULL OR page_number > 0),
  type TEXT NOT NULL CHECK (type IN ('note', 'highlight', 'quote')),
  color TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_user ON biblioteca.notes(user_id);
CREATE INDEX idx_notes_book ON biblioteca.notes(book_id);
CREATE INDEX idx_notes_type ON biblioteca.notes(user_id, type);

-- ============================================================================
-- TABLE: reading_goals
-- ============================================================================
CREATE TABLE biblioteca.reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INT NOT NULL CHECK (year >= 2020 AND year <= 2100),
  target_books_count INT NOT NULL CHECK (target_books_count > 0),
  completed_books_count INT DEFAULT 0 CHECK (completed_books_count >= 0),
  progress_percent INT GENERATED ALWAYS AS (
    CASE
      WHEN target_books_count > 0
      THEN (completed_books_count * 100 / target_books_count)
      ELSE 0
    END
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, year)
);

CREATE INDEX idx_reading_goals_user ON biblioteca.reading_goals(user_id);
CREATE INDEX idx_reading_goals_year ON biblioteca.reading_goals(user_id, year);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION biblioteca.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at trigger
CREATE TRIGGER update_authors_updated_at
  BEFORE UPDATE ON biblioteca.authors
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON biblioteca.books
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER update_reading_progress_updated_at
  BEFORE UPDATE ON biblioteca.reading_progress
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON biblioteca.notes
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER update_reading_goals_updated_at
  BEFORE UPDATE ON biblioteca.reading_goals
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();
