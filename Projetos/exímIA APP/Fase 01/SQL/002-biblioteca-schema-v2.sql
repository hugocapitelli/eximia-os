-- ============================================================
-- FASE 01: MÓDULO BIBLIOTECA — V2 (CATÁLOGO GLOBAL)
-- Schema Atualizado com Catálogo de Livros Global
-- Version: 2.0.0
-- Date: 2026-02-01
-- Aprovado por: Aria (Architect)
-- ============================================================

-- ============================================================
-- MUDANÇA PRINCIPAL:
-- - book_catalog: Livros únicos (global, sem user_id)
-- - books: Biblioteca pessoal do usuário (referencia catalog)
-- - book_summaries: Resumos globais (referencia catalog)
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
-- TABLE: user_roles
-- Sistema de roles para Admin
-- ============================================================

CREATE TABLE public.user_roles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
  granted_at    TIMESTAMPTZ DEFAULT now(),
  granted_by    UUID REFERENCES auth.users(id),

  UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

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
  name          VARCHAR(255) NOT NULL,
  bio           TEXT,
  photo_url     TEXT,

  -- Integração futura com Minds/Clones
  mind_id       UUID,

  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),

  -- Evitar duplicatas
  UNIQUE(name)
);

CREATE INDEX idx_authors_name ON biblioteca.authors(name);
CREATE INDEX idx_authors_name_search ON biblioteca.authors USING gin(name gin_trgm_ops);

-- ============================================================
-- TABLE: book_catalog
-- Catálogo global de livros (sem user_id)
-- ============================================================

CREATE TABLE biblioteca.book_catalog (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificadores externos (para deduplicação)
  google_books_id   VARCHAR(50) UNIQUE,
  open_library_key  VARCHAR(50),
  isbn10            VARCHAR(13),
  isbn13            VARCHAR(17) UNIQUE,

  -- Dados do livro
  title             VARCHAR(500) NOT NULL,
  subtitle          VARCHAR(500),
  author_id         UUID REFERENCES biblioteca.authors(id) ON DELETE SET NULL,
  author_name       VARCHAR(255),              -- Desnormalizado para busca rápida
  description       TEXT,                       -- Sinopse

  -- Metadados
  publisher         VARCHAR(255),
  published_date    DATE,
  page_count        INTEGER,
  language          VARCHAR(10) DEFAULT 'pt',
  categories        TEXT[],

  -- Imagens
  cover_url         TEXT,                       -- URL no Supabase Storage
  thumbnail_url     TEXT,                       -- URL original (backup)

  -- Estatísticas (atualizadas via trigger)
  readers_count     INTEGER DEFAULT 0,          -- Quantos usuários têm este livro

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_catalog_google_id ON biblioteca.book_catalog(google_books_id);
CREATE INDEX idx_catalog_isbn ON biblioteca.book_catalog(isbn13);
CREATE INDEX idx_catalog_title ON biblioteca.book_catalog USING gin(title gin_trgm_ops);
CREATE INDEX idx_catalog_author ON biblioteca.book_catalog(author_id);

-- ============================================================
-- TABLE: user_books
-- Biblioteca pessoal do usuário (referencia catalog)
-- ============================================================

CREATE TABLE biblioteca.user_books (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id        UUID NOT NULL REFERENCES biblioteca.book_catalog(id) ON DELETE CASCADE,

  -- Status e progresso (pessoal)
  status            VARCHAR(20) DEFAULT 'to_read'
                    CHECK (status IN ('to_read', 'reading', 'completed', 'abandoned')),
  current_page      INTEGER DEFAULT 0,
  rating            SMALLINT CHECK (rating >= 1 AND rating <= 5),

  -- Computed: progress percentage
  progress_percent  NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN (SELECT page_count FROM biblioteca.book_catalog WHERE id = catalog_id) IS NULL
           OR (SELECT page_count FROM biblioteca.book_catalog WHERE id = catalog_id) = 0
      THEN 0
      ELSE ROUND(
        (current_page::NUMERIC /
         (SELECT page_count FROM biblioteca.book_catalog WHERE id = catalog_id)) * 100,
        2
      )
    END
  ) STORED,

  -- Timestamps pessoais
  added_at          TIMESTAMPTZ DEFAULT now(),
  started_at        TIMESTAMPTZ,
  finished_at       TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ DEFAULT now(),

  -- Um livro por usuário
  UNIQUE(user_id, catalog_id)
);

CREATE INDEX idx_user_books_user ON biblioteca.user_books(user_id);
CREATE INDEX idx_user_books_status ON biblioteca.user_books(user_id, status);
CREATE INDEX idx_user_books_catalog ON biblioteca.user_books(catalog_id);

-- ============================================================
-- TABLE: notes
-- Anotações do usuário (vinculadas ao user_book)
-- ============================================================

CREATE TABLE biblioteca.notes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_book_id  UUID NOT NULL REFERENCES biblioteca.user_books(id) ON DELETE CASCADE,
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

CREATE INDEX idx_notes_user_book ON biblioteca.notes(user_book_id);
CREATE INDEX idx_notes_user ON biblioteca.notes(user_id);
CREATE INDEX idx_notes_type ON biblioteca.notes(user_book_id, type);

-- ============================================================
-- TABLE: book_summaries
-- Resumos criados pelo ADMIN (globais, referenciam catalog)
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

  -- Um resumo por livro do catálogo
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

CREATE TRIGGER trg_authors_updated_at
  BEFORE UPDATE ON biblioteca.authors
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_catalog_updated_at
  BEFORE UPDATE ON biblioteca.book_catalog
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_updated_at();

CREATE TRIGGER trg_user_books_updated_at
  BEFORE UPDATE ON biblioteca.user_books
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
-- TRIGGERS: Auto-status transition para user_books
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.auto_status_transition()
RETURNS TRIGGER AS $$
DECLARE
  v_page_count INTEGER;
BEGIN
  -- Buscar page_count do catálogo
  SELECT page_count INTO v_page_count
  FROM biblioteca.book_catalog
  WHERE id = NEW.catalog_id;

  -- to_read → reading quando começar a ler
  IF OLD.status = 'to_read' AND NEW.current_page > 0 THEN
    NEW.status = 'reading';
    NEW.started_at = COALESCE(NEW.started_at, now());
  END IF;

  -- reading → completed quando terminar
  IF OLD.status = 'reading'
     AND v_page_count IS NOT NULL
     AND NEW.current_page >= v_page_count THEN
    NEW.status = 'completed';
    NEW.finished_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_books_status_transition
  BEFORE UPDATE ON biblioteca.user_books
  FOR EACH ROW EXECUTE FUNCTION biblioteca.auto_status_transition();

-- ============================================================
-- TRIGGERS: Atualizar readers_count no catálogo
-- ============================================================

CREATE OR REPLACE FUNCTION biblioteca.update_readers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE biblioteca.book_catalog
    SET readers_count = readers_count + 1
    WHERE id = NEW.catalog_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE biblioteca.book_catalog
    SET readers_count = readers_count - 1
    WHERE id = OLD.catalog_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_readers_count
  AFTER INSERT OR DELETE ON biblioteca.user_books
  FOR EACH ROW EXECUTE FUNCTION biblioteca.update_readers_count();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.book_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.user_reading_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.summary_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblioteca.reading_goals ENABLE ROW LEVEL SECURITY;

-- User Roles: usuário vê suas próprias roles
CREATE POLICY "user_roles_read_own" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Authors: público para leitura
CREATE POLICY "authors_read_all" ON biblioteca.authors
  FOR SELECT USING (true);

-- Authors: admin pode criar/editar
CREATE POLICY "authors_admin_write" ON biblioteca.authors
  FOR ALL USING (biblioteca.is_admin());

-- Catalog: público para leitura (todos podem ver livros disponíveis)
CREATE POLICY "catalog_read_all" ON biblioteca.book_catalog
  FOR SELECT USING (true);

-- Catalog: qualquer usuário autenticado pode adicionar livros ao catálogo
CREATE POLICY "catalog_insert_authenticated" ON biblioteca.book_catalog
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Catalog: apenas admin pode editar/deletar
CREATE POLICY "catalog_admin_update" ON biblioteca.book_catalog
  FOR UPDATE USING (biblioteca.is_admin());

CREATE POLICY "catalog_admin_delete" ON biblioteca.book_catalog
  FOR DELETE USING (biblioteca.is_admin());

-- User Books: usuário gerencia seus próprios
CREATE POLICY "user_books_user_all" ON biblioteca.user_books
  FOR ALL USING (auth.uid() = user_id);

-- Notes: usuário vê apenas suas próprias
CREATE POLICY "notes_user_all" ON biblioteca.notes
  FOR ALL USING (auth.uid() = user_id);

-- Summaries: todos podem ler se publicado
CREATE POLICY "summaries_read_published" ON biblioteca.book_summaries
  FOR SELECT USING (is_published = true);

-- Summaries: admin pode tudo
CREATE POLICY "summaries_admin_all" ON biblioteca.book_summaries
  FOR ALL USING (biblioteca.is_admin());

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
  FOR ALL USING (biblioteca.is_admin());

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
  ub.user_id,
  COUNT(*) FILTER (WHERE ub.status = 'to_read') AS to_read_count,
  COUNT(*) FILTER (WHERE ub.status = 'reading') AS reading_count,
  COUNT(*) FILTER (WHERE ub.status = 'completed') AS completed_count,
  COUNT(*) FILTER (WHERE ub.status = 'abandoned') AS abandoned_count,
  COUNT(*) AS total_books,
  COALESCE(SUM(bc.page_count) FILTER (WHERE ub.status = 'completed'), 0) AS total_pages_read,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER AS current_year,
  COUNT(*) FILTER (
    WHERE ub.status = 'completed'
    AND EXTRACT(YEAR FROM ub.finished_at) = EXTRACT(YEAR FROM CURRENT_DATE)
  ) AS books_completed_this_year
FROM biblioteca.user_books ub
JOIN biblioteca.book_catalog bc ON bc.id = ub.catalog_id
GROUP BY ub.user_id;

-- View: Livros com dados do catálogo (para listagem)
CREATE VIEW biblioteca.user_books_with_catalog AS
SELECT
  ub.id,
  ub.user_id,
  ub.catalog_id,
  ub.status,
  ub.current_page,
  ub.rating,
  ub.added_at,
  ub.started_at,
  ub.finished_at,
  bc.title,
  bc.subtitle,
  bc.author_name,
  bc.description,
  bc.publisher,
  bc.published_date,
  bc.page_count,
  bc.language,
  bc.categories,
  bc.cover_url,
  bc.thumbnail_url,
  bc.google_books_id,
  bc.readers_count,
  CASE
    WHEN bc.page_count IS NULL OR bc.page_count = 0 THEN 0
    ELSE ROUND((ub.current_page::NUMERIC / bc.page_count) * 100, 2)
  END AS progress_percent,
  EXISTS (
    SELECT 1 FROM biblioteca.book_summaries bs
    WHERE bs.catalog_id = bc.id AND bs.is_published = true
  ) AS has_summary
FROM biblioteca.user_books ub
JOIN biblioteca.book_catalog bc ON bc.id = ub.catalog_id;

-- View: Catálogo com info de resumo
CREATE VIEW biblioteca.catalog_with_summary AS
SELECT
  bc.*,
  bs.id AS summary_id,
  bs.is_published AS has_published_summary,
  (SELECT COUNT(*) FROM biblioteca.summary_chapters sc WHERE sc.summary_id = bs.id) AS chapter_count
FROM biblioteca.book_catalog bc
LEFT JOIN biblioteca.book_summaries bs ON bs.catalog_id = bc.id;

-- ============================================================
-- STORAGE BUCKET
-- Executar via Supabase Dashboard ou API
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('book-covers', 'book-covers', true);

-- CREATE POLICY "book_covers_upload" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'book-covers'
--     AND auth.uid() IS NOT NULL
--   );

-- CREATE POLICY "book_covers_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'book-covers');

-- ============================================================
-- SEED: Criar primeiro admin (executar manualmente)
-- ============================================================

-- INSERT INTO public.user_roles (user_id, role, granted_by)
-- VALUES ('SEU_USER_ID_AQUI', 'admin', 'SEU_USER_ID_AQUI');

-- ============================================================
-- END OF MIGRATION V2
-- ============================================================
