-- ============================================================
-- FASE 01: MÓDULO BIBLIOTECA — V3 (CATÁLOGO + FAVORITOS)
-- Schema Simplificado: Catálogo Global + Sistema de Favoritos
-- Version: 3.0.0
-- Date: 2026-02-01
-- Aprovado por: Aria (Architect)
-- ============================================================

-- ============================================================
-- MODELO SIMPLIFICADO:
-- - book_catalog: Livros do catálogo (Admin adiciona)
-- - user_favorites: Usuário favorita livros do catálogo
-- - book_summaries: Resumos globais (Admin cria)
-- - Progresso de leitura: Apenas nos resumos
-- ============================================================

-- ============================================================
-- SCHEMA & EXTENSIONS
-- ============================================================

CREATE SCHEMA IF NOT EXISTS biblioteca;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para busca fuzzy

-- ============================================================
-- TABLE: user_roles
-- Sistema de roles para Admin
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
-- Verifica se usuário atual é admin
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

-- ============================================================
-- TABLE: authors
-- Autores de livros (global)
-- ============================================================

CREATE TABLE biblioteca.authors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(255) NOT NULL UNIQUE,
  bio           TEXT,
  photo_url     TEXT,
  mind_id       UUID,  -- Integração futura com Minds/Clones
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_authors_name ON biblioteca.authors(name);

-- ============================================================
-- TABLE: book_catalog
-- Catálogo global de livros (Admin adiciona via busca)
-- ============================================================

CREATE TABLE biblioteca.book_catalog (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificadores externos
  google_books_id   VARCHAR(50) UNIQUE,
  open_library_key  VARCHAR(50),
  isbn13            VARCHAR(17) UNIQUE,
  isbn10            VARCHAR(13),

  -- Dados do livro
  title             VARCHAR(500) NOT NULL,
  subtitle          VARCHAR(500),
  author_id         UUID REFERENCES biblioteca.authors(id) ON DELETE SET NULL,
  author_name       VARCHAR(255),              -- Desnormalizado para busca
  description       TEXT,                       -- Sinopse

  -- Metadados
  publisher         VARCHAR(255),
  published_date    DATE,
  page_count        INTEGER,
  language          VARCHAR(10) DEFAULT 'pt',
  categories        TEXT[],

  -- Imagens
  cover_url         TEXT,
  thumbnail_url     TEXT,

  -- Estatísticas
  favorites_count   INTEGER DEFAULT 0,         -- Quantos favoritaram

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  added_by          UUID REFERENCES auth.users(id)  -- Admin que adicionou
);

CREATE INDEX idx_catalog_google_id ON biblioteca.book_catalog(google_books_id);
CREATE INDEX idx_catalog_title ON biblioteca.book_catalog USING gin(title gin_trgm_ops);
CREATE INDEX idx_catalog_author ON biblioteca.book_catalog USING gin(author_name gin_trgm_ops);
CREATE INDEX idx_catalog_categories ON biblioteca.book_catalog USING gin(categories);

-- ============================================================
-- TABLE: user_favorites
-- Livros favoritados pelo usuário
-- ============================================================

CREATE TABLE biblioteca.user_favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id    UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,

  -- Quando favoritou
  favorited_at  TIMESTAMPTZ DEFAULT now(),

  -- Um favorito por livro por usuário
  UNIQUE(user_id, catalog_id)
);

CREATE INDEX idx_favorites_user ON biblioteca.user_favorites(user_id);
CREATE INDEX idx_favorites_catalog ON biblioteca.user_favorites(catalog_id);

-- ============================================================
-- TABLE: book_summaries
-- Resumos criados pelo ADMIN (globais)
-- ============================================================

CREATE TABLE biblioteca.book_summaries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalog_id    UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,

  -- Metadados
  title         VARCHAR(500) NOT NULL,
  created_by    UUID NOT NULL REFERENCES auth.users(id),

  -- Status de publicação
  is_published  BOOLEAN DEFAULT false,
  published_at  TIMESTAMPTZ,

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- Um resumo por livro
  UNIQUE(catalog_id)
);

CREATE INDEX idx_summaries_catalog ON biblioteca.book_summaries(catalog_id);
CREATE INDEX idx_summaries_published ON biblioteca.book_summaries(is_published) WHERE is_published = true;

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
  content         TEXT NOT NULL,              -- Markdown

  -- Ordenação
  order_index     INTEGER NOT NULL,

  -- Metadados
  word_count      INTEGER,

  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE(summary_id, chapter_number)
);

CREATE INDEX idx_chapters_summary ON biblioteca.summary_chapters(summary_id);
CREATE INDEX idx_chapters_order ON biblioteca.summary_chapters(summary_id, order_index);

-- ============================================================
-- TABLE: user_reading_preferences
-- Preferências do modo leitura
-- ============================================================

CREATE TABLE biblioteca.user_reading_preferences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  theme         VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('light', 'sepia', 'dark')),
  font_size     VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),

  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE: summary_reading_progress
-- Progresso de leitura dos resumos
-- ============================================================

CREATE TABLE biblioteca.summary_reading_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary_id      UUID NOT NULL REFERENCES biblioteca.book_summaries(id) ON DELETE CASCADE,

  current_chapter INTEGER DEFAULT 1,
  completed       BOOLEAN DEFAULT false,

  last_read_at    TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,

  UNIQUE(user_id, summary_id)
);

CREATE INDEX idx_summary_progress_user ON biblioteca.summary_reading_progress(user_id);

-- ============================================================
-- TABLE: user_notes
-- Anotações do usuário nos livros
-- ============================================================

CREATE TABLE biblioteca.user_notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id    UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,

  type          VARCHAR(20) NOT NULL CHECK (type IN ('note', 'highlight', 'quote')),
  content       TEXT NOT NULL,
  page_number   INTEGER,
  chapter       VARCHAR(255),

  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notes_user ON biblioteca.user_notes(user_id);
CREATE INDEX idx_notes_catalog ON biblioteca.user_notes(catalog_id);
CREATE INDEX idx_notes_user_catalog ON biblioteca.user_notes(user_id, catalog_id);

-- ============================================================
-- TABLE: reading_goals
-- Metas de leitura anuais
-- ============================================================

CREATE TABLE biblioteca.reading_goals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year          INTEGER NOT NULL,
  target_books  INTEGER NOT NULL,
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

CREATE TRIGGER trg_authors_updated BEFORE UPDATE ON biblioteca.authors
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_catalog_updated BEFORE UPDATE ON biblioteca.book_catalog
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_summaries_updated BEFORE UPDATE ON biblioteca.book_summaries
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_chapters_updated BEFORE UPDATE ON biblioteca.summary_chapters
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_preferences_updated BEFORE UPDATE ON biblioteca.user_reading_preferences
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON biblioteca.user_notes
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_goals_updated BEFORE UPDATE ON biblioteca.reading_goals
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

-- ============================================================
-- TRIGGERS: Atualizar favorites_count
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE biblioteca.book_catalog
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.catalog_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE biblioteca.book_catalog
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.catalog_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_favorites_count
  AFTER INSERT OR DELETE ON biblioteca.user_favorites
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_favorites_count();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_reading_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.reading_goals ENABLE ROW LEVEL SECURITY;

-- User Roles
CREATE POLICY "roles_read_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Authors: público para leitura
CREATE POLICY "authors_read" ON biblioteca.authors
  FOR SELECT USING (true);

CREATE POLICY "authors_admin" ON biblioteca.authors
  FOR ALL USING (biblioteca.is_admin());

-- Catalog: todos podem ler, apenas admin pode modificar
CREATE POLICY "catalog_read" ON biblioteca.book_catalog
  FOR SELECT USING (true);

CREATE POLICY "catalog_admin" ON biblioteca.book_catalog
  FOR INSERT WITH CHECK (biblioteca.is_admin());

CREATE POLICY "catalog_admin_update" ON biblioteca.book_catalog
  FOR UPDATE USING (biblioteca.is_admin());

CREATE POLICY "catalog_admin_delete" ON biblioteca.book_catalog
  FOR DELETE USING (biblioteca.is_admin());

-- Favorites: usuário gerencia seus próprios
CREATE POLICY "favorites_user" ON biblioteca.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Summaries: todos leem publicados, admin gerencia
CREATE POLICY "summaries_read" ON biblioteca.book_summaries
  FOR SELECT USING (is_published = true OR biblioteca.is_admin());

CREATE POLICY "summaries_admin" ON biblioteca.book_summaries
  FOR INSERT WITH CHECK (biblioteca.is_admin());

CREATE POLICY "summaries_admin_update" ON biblioteca.book_summaries
  FOR UPDATE USING (biblioteca.is_admin());

CREATE POLICY "summaries_admin_delete" ON biblioteca.book_summaries
  FOR DELETE USING (biblioteca.is_admin());

-- Chapters: todos leem se resumo publicado, admin gerencia
CREATE POLICY "chapters_read" ON biblioteca.summary_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM biblioteca.book_summaries s
      WHERE s.id = summary_id AND (s.is_published = true OR biblioteca.is_admin())
    )
  );

CREATE POLICY "chapters_admin" ON biblioteca.summary_chapters
  FOR INSERT WITH CHECK (biblioteca.is_admin());

CREATE POLICY "chapters_admin_update" ON biblioteca.summary_chapters
  FOR UPDATE USING (biblioteca.is_admin());

CREATE POLICY "chapters_admin_delete" ON biblioteca.summary_chapters
  FOR DELETE USING (biblioteca.is_admin());

-- Preferences: usuário gerencia suas
CREATE POLICY "preferences_user" ON biblioteca.user_reading_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Progress: usuário gerencia seu
CREATE POLICY "progress_user" ON biblioteca.summary_reading_progress
  FOR ALL USING (auth.uid() = user_id);

-- Notes: usuário gerencia suas
CREATE POLICY "notes_user" ON biblioteca.user_notes
  FOR ALL USING (auth.uid() = user_id);

-- Goals: usuário gerencia suas
CREATE POLICY "goals_user" ON biblioteca.reading_goals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- VIEWS
-- ============================================================

-- View: Catálogo com info de resumo
CREATE OR REPLACE VIEW biblioteca.catalog_view AS
SELECT
  bc.*,
  bs.id AS summary_id,
  bs.is_published AS has_published_summary,
  COALESCE(
    (SELECT COUNT(*) FROM biblioteca.summary_chapters sc WHERE sc.summary_id = bs.id),
    0
  ) AS chapter_count,
  a.bio AS author_bio,
  a.photo_url AS author_photo
FROM biblioteca.book_catalog bc
LEFT JOIN biblioteca.book_summaries bs ON bs.catalog_id = bc.id AND bs.is_published = true
LEFT JOIN biblioteca.authors a ON a.id = bc.author_id;

-- View: Favoritos do usuário com dados do catálogo
CREATE OR REPLACE VIEW biblioteca.user_favorites_view AS
SELECT
  uf.id AS favorite_id,
  uf.user_id,
  uf.favorited_at,
  bc.*,
  bs.id AS summary_id,
  bs.is_published AS has_published_summary,
  COALESCE(
    (SELECT COUNT(*) FROM biblioteca.summary_chapters sc WHERE sc.summary_id = bs.id),
    0
  ) AS chapter_count,
  srp.current_chapter,
  srp.completed AS summary_completed,
  srp.last_read_at
FROM biblioteca.user_favorites uf
JOIN biblioteca.book_catalog bc ON bc.id = uf.catalog_id
LEFT JOIN biblioteca.book_summaries bs ON bs.catalog_id = bc.id AND bs.is_published = true
LEFT JOIN biblioteca.summary_reading_progress srp ON srp.summary_id = bs.id AND srp.user_id = uf.user_id;

-- View: Estatísticas do usuário
CREATE OR REPLACE VIEW biblioteca.user_stats AS
SELECT
  u.id AS user_id,
  (SELECT COUNT(*) FROM biblioteca.user_favorites uf WHERE uf.user_id = u.id) AS favorites_count,
  (SELECT COUNT(*) FROM biblioteca.summary_reading_progress srp WHERE srp.user_id = u.id AND srp.completed = true) AS summaries_completed,
  (SELECT COUNT(*) FROM biblioteca.user_notes un WHERE un.user_id = u.id) AS notes_count
FROM auth.users u;

-- ============================================================
-- STORAGE BUCKET (executar no Supabase Dashboard)
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('book-covers', 'book-covers', true);

-- CREATE POLICY "covers_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'book-covers');

-- CREATE POLICY "covers_admin_upload" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'book-covers'
--     AND biblioteca.is_admin()
--   );

-- ============================================================
-- SEED: Criar admin (executar manualmente)
-- ============================================================

-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('SEU_USER_ID_AQUI', 'admin');

-- ============================================================
-- END OF MIGRATION V3
-- ============================================================
