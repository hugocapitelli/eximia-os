-- ============================================================
-- FASE 01: MÓDULO BIBLIOTECA
-- Schema Completo para Supabase PostgreSQL
-- Version: 1.0.0
-- Date: 2026-02-01
-- ============================================================

-- ============================================================
-- SCHEMA
-- ============================================================

CREATE SCHEMA IF NOT EXISTS biblioteca;

-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: authors
-- Autores de livros (pode vincular a Minds no futuro)
-- ============================================================

CREATE TABLE biblioteca.authors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(255) NOT NULL,
  bio           TEXT,
  photo_url     VARCHAR(500),

  -- Integração futura com Minds/Clones
  mind_id       UUID,

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_authors_name ON biblioteca.authors(name);

-- ============================================================
-- TABLE: books
-- Livros na biblioteca do usuário
-- ============================================================

CREATE TABLE biblioteca.books (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_id         UUID REFERENCES biblioteca.authors(id) ON DELETE SET NULL,

  -- Dados básicos
  title             VARCHAR(500) NOT NULL,
  description       TEXT,                    -- Sinopse automática (API)

  -- Identificadores externos
  google_books_id   VARCHAR(50),             -- ID do Google Books
  open_library_key  VARCHAR(50),             -- ID do Open Library
  isbn10            VARCHAR(13),
  isbn13            VARCHAR(17),

  -- Metadados
  publisher         VARCHAR(255),
  published_date    DATE,
  page_count        INTEGER,
  language          VARCHAR(10) DEFAULT 'pt',
  categories        TEXT[],                  -- Array de categorias

  -- Imagens
  cover_url         VARCHAR(500),            -- URL no Supabase Storage
  thumbnail_url     VARCHAR(500),            -- URL original (backup)

  -- Status e progresso
  status            VARCHAR(20) DEFAULT 'to_read'
                    CHECK (status IN ('to_read', 'reading', 'completed', 'abandoned')),
  current_page      INTEGER DEFAULT 0,

  -- Computed: progress percentage
  progress_percent  NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN page_count IS NULL OR page_count = 0 THEN 0
      ELSE ROUND((current_page::NUMERIC / page_count) * 100, 2)
    END
  ) STORED,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  started_at        TIMESTAMPTZ,             -- Quando começou a ler
  finished_at       TIMESTAMPTZ,             -- Quando terminou

  -- Constraints
  UNIQUE(user_id, google_books_id),
  UNIQUE(user_id, isbn13)
);

CREATE INDEX idx_books_user ON biblioteca.books(user_id);
CREATE INDEX idx_books_status ON biblioteca.books(user_id, status);
CREATE INDEX idx_books_google_id ON biblioteca.books(google_books_id);

-- ============================================================
-- TABLE: notes
-- Anotações, highlights e quotes do usuário
-- ============================================================

CREATE TABLE biblioteca.notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id       UUID NOT NULL REFERENCES biblioteca.books(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conteúdo
  type          VARCHAR(20) NOT NULL
                CHECK (type IN ('note', 'highlight', 'quote')),
  content       TEXT NOT NULL,

  -- Localização no livro (opcional)
  page_number   INTEGER,
  chapter       VARCHAR(255),

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notes_book ON biblioteca.notes(book_id);
CREATE INDEX idx_notes_user ON biblioteca.notes(user_id);
CREATE INDEX idx_notes_type ON biblioteca.notes(book_id, type);

-- ============================================================
-- TABLE: reading_progress
-- Histórico de progresso de leitura
-- ============================================================

CREATE TABLE biblioteca.reading_progress (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id       UUID NOT NULL REFERENCES biblioteca.books(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Progresso
  page_number   INTEGER NOT NULL,

  -- Timestamps
  recorded_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_progress_book ON biblioteca.reading_progress(book_id);

-- ============================================================
-- TABLE: book_summaries
-- Resumos criados pelo ADMIN para todos lerem
-- ============================================================

CREATE TABLE biblioteca.book_summaries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id       UUID NOT NULL REFERENCES biblioteca.books(id) ON DELETE CASCADE,

  -- Metadados
  title         VARCHAR(500) NOT NULL,
  created_by    UUID NOT NULL REFERENCES auth.users(id),

  -- Status de publicação
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- Um resumo por livro (global, não por usuário)
  UNIQUE(book_id)
);

CREATE INDEX idx_summaries_published ON biblioteca.book_summaries(is_published);

-- ============================================================
-- TABLE: summary_chapters
-- Capítulos dos resumos
-- ============================================================

CREATE TABLE biblioteca.summary_chapters (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  summary_id      UUID NOT NULL REFERENCES biblioteca.book_summaries(id) ON DELETE CASCADE,

  -- Conteúdo
  chapter_number  INTEGER NOT NULL,
  title           VARCHAR(255) NOT NULL,
  subtitle        VARCHAR(500),
  content         TEXT NOT NULL,              -- Markdown ou HTML

  -- Ordenação
  order_index     INTEGER NOT NULL,

  -- Metadados
  word_count      INTEGER,                    -- Para tempo de leitura

  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(summary_id, chapter_number)
);

CREATE INDEX idx_chapters_summary ON biblioteca.summary_chapters(summary_id);
CREATE INDEX idx_chapters_order ON biblioteca.summary_chapters(summary_id, order_index);

-- ============================================================
-- TABLE: user_reading_preferences
-- Preferências do modo leitura por usuário
-- ============================================================

CREATE TABLE biblioteca.user_reading_preferences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Preferências visuais
  theme         VARCHAR(20) DEFAULT 'dark'
                CHECK (theme IN ('light', 'sepia', 'dark')),
  font_size     VARCHAR(10) DEFAULT 'medium'
                CHECK (font_size IN ('small', 'medium', 'large')),

  -- Timestamps
  updated_at    TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: summary_reading_progress
-- Progresso de leitura dos resumos por usuário
-- ============================================================

CREATE TABLE biblioteca.summary_reading_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_id      UUID NOT NULL REFERENCES biblioteca.book_summaries(id) ON DELETE CASCADE,

  -- Progresso
  current_chapter INTEGER DEFAULT 1,
  completed       BOOLEAN DEFAULT false,

  -- Timestamps
  last_read_at    TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,

  UNIQUE(user_id, summary_id)
);

CREATE INDEX idx_summary_progress_user ON biblioteca.summary_reading_progress(user_id);

-- ============================================================
-- TABLE: reading_goals
-- Metas de leitura anuais
-- ============================================================

CREATE TABLE biblioteca.reading_goals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Meta
  year          INTEGER NOT NULL,
  target_books  INTEGER NOT NULL,

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, year)
);

-- ============================================================
-- TRIGGERS: Auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER trg_authors_updated_at
  BEFORE UPDATE ON biblioteca.authors
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_books_updated_at
  BEFORE UPDATE ON biblioteca.books
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON biblioteca.notes
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_summaries_updated_at
  BEFORE UPDATE ON biblioteca.book_summaries
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_chapters_updated_at
  BEFORE UPDATE ON biblioteca.summary_chapters
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_preferences_updated_at
  BEFORE UPDATE ON biblioteca.user_reading_preferences
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_goals_updated_at
  BEFORE UPDATE ON biblioteca.reading_goals
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

-- ============================================================
-- TRIGGERS: Auto-status transition
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.auto_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- to_read → reading quando começar a ler
  IF OLD.status = 'to_read' AND NEW.current_page > 0 THEN
    NEW.status = 'reading';
    NEW.started_at = COALESCE(NEW.started_at, now());
  END IF;

  -- reading → completed quando terminar
  IF OLD.status = 'reading'
     AND NEW.page_count IS NOT NULL
     AND NEW.current_page >= NEW.page_count THEN
    NEW.status = 'completed';
    NEW.finished_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_books_status_transition
  BEFORE UPDATE ON biblioteca.books
  FOR EACH ROW EXECUTE FUNCTION biblioteca.auto_status_transition();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE biblioteca.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_reading_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.reading_goals ENABLE ROW LEVEL SECURITY;

-- Authors: público para leitura
CREATE POLICY "authors_read_all" ON biblioteca.authors
  FOR SELECT USING (true);

-- Books: usuário vê apenas seus próprios
CREATE POLICY "books_user_all" ON biblioteca.books
  FOR ALL USING (auth.uid() = user_id);

-- Notes: usuário vê apenas suas próprias
CREATE POLICY "notes_user_all" ON biblioteca.notes
  FOR ALL USING (auth.uid() = user_id);

-- Reading Progress: usuário vê apenas seu próprio
CREATE POLICY "progress_user_all" ON biblioteca.reading_progress
  FOR ALL USING (auth.uid() = user_id);

-- Summaries: todos podem ler se publicado
CREATE POLICY "summaries_read_published" ON biblioteca.book_summaries
  FOR SELECT USING (is_published = true);

-- Summaries: admin pode tudo (via service_role ou check de role)
-- NOTA: Ajustar conforme implementação de roles
CREATE POLICY "summaries_admin_all" ON biblioteca.book_summaries
  FOR ALL USING (
    auth.uid() = created_by
    -- OR auth.jwt() ->> 'role' = 'admin'
  );

-- Chapters: todos podem ler se resumo publicado
CREATE POLICY "chapters_read_published" ON biblioteca.summary_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM biblioteca.book_summaries s
      WHERE s.id = summary_id AND s.is_published = true
    )
  );

-- Chapters: admin pode editar
CREATE POLICY "chapters_admin_all" ON biblioteca.summary_chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM biblioteca.book_summaries s
      WHERE s.id = summary_id AND s.created_by = auth.uid()
    )
  );

-- Preferences: usuário gerencia suas próprias
CREATE POLICY "preferences_user_all" ON biblioteca.user_reading_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Summary Progress: usuário gerencia seu próprio
CREATE POLICY "summary_progress_user_all" ON biblioteca.summary_reading_progress
  FOR ALL USING (auth.uid() = user_id);

-- Goals: usuário gerencia suas próprias
CREATE POLICY "goals_user_all" ON biblioteca.reading_goals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- VIEWS
-- ============================================================

-- View: Estatísticas de leitura do usuário
CREATE VIEW biblioteca.user_reading_stats AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE status = 'to_read') AS to_read_count,
  COUNT(*) FILTER (WHERE status = 'reading') AS reading_count,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
  COUNT(*) FILTER (WHERE status = 'abandoned') AS abandoned_count,
  COUNT(*) AS total_books,
  SUM(page_count) FILTER (WHERE status = 'completed') AS total_pages_read,
  EXTRACT(YEAR FROM CURRENT_DATE) AS current_year,
  COUNT(*) FILTER (
    WHERE status = 'completed'
    AND EXTRACT(YEAR FROM finished_at) = EXTRACT(YEAR FROM CURRENT_DATE)
  ) AS books_completed_this_year
FROM biblioteca.books
GROUP BY user_id;

-- ============================================================
-- STORAGE BUCKET
-- Executar via Supabase Dashboard ou API
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('book-covers', 'book-covers', true);

-- CREATE POLICY "book_covers_upload" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'book-covers'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "book_covers_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'book-covers');

-- ============================================================
-- END OF MIGRATION
-- ============================================================
