-- ============================================================
-- FASE 01: MÓDULO BIBLIOTECA — PUBLIC VIEWS
-- Creates views in public schema for Supabase client access
-- Version: 1.0.0
-- ============================================================

-- ============================================================
-- VIEW: catalog_view
-- Main view for book catalog with summary status
-- ============================================================

CREATE OR REPLACE VIEW public.catalog_view AS
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
  bc.added_by,
  bc.created_at,
  bc.updated_at,
  -- Summary status
  EXISTS (
    SELECT 1 FROM biblioteca.book_summaries bs
    WHERE bs.catalog_id = bc.id AND bs.is_published = true
  ) AS has_published_summary,
  (
    SELECT bs.id FROM biblioteca.book_summaries bs
    WHERE bs.catalog_id = bc.id
    ORDER BY bs.created_at DESC
    LIMIT 1
  ) AS summary_id
FROM biblioteca.book_catalog bc;

-- Grant access
GRANT SELECT ON public.catalog_view TO authenticated;
GRANT SELECT ON public.catalog_view TO anon;

-- ============================================================
-- VIEW: book_catalog (alias for direct access)
-- ============================================================

CREATE OR REPLACE VIEW public.book_catalog AS
SELECT * FROM biblioteca.book_catalog;

-- Grant access
GRANT SELECT ON public.book_catalog TO authenticated;
GRANT SELECT ON public.book_catalog TO anon;

-- ============================================================
-- VIEW: book_summaries
-- ============================================================

CREATE OR REPLACE VIEW public.book_summaries AS
SELECT * FROM biblioteca.book_summaries;

-- Grant access
GRANT SELECT ON public.book_summaries TO authenticated;
GRANT SELECT ON public.book_summaries TO anon;

-- ============================================================
-- VIEW: summary_chapters
-- ============================================================

CREATE OR REPLACE VIEW public.summary_chapters AS
SELECT * FROM biblioteca.summary_chapters;

-- Grant access
GRANT SELECT ON public.summary_chapters TO authenticated;
GRANT SELECT ON public.summary_chapters TO anon;

-- ============================================================
-- VIEW: user_favorites
-- ============================================================

CREATE OR REPLACE VIEW public.user_favorites AS
SELECT * FROM biblioteca.user_favorites;

-- Grant access (users can only see their own via RLS on base table)
GRANT SELECT, INSERT, DELETE ON public.user_favorites TO authenticated;

-- ============================================================
-- VIEW: summary_reading_progress
-- ============================================================

CREATE OR REPLACE VIEW public.summary_reading_progress AS
SELECT * FROM biblioteca.summary_reading_progress;

-- Grant access
GRANT SELECT, INSERT, UPDATE ON public.summary_reading_progress TO authenticated;

-- ============================================================
-- VIEW: user_reading_preferences
-- ============================================================

CREATE OR REPLACE VIEW public.user_reading_preferences AS
SELECT * FROM biblioteca.user_reading_preferences;

-- Grant access
GRANT SELECT, INSERT, UPDATE ON public.user_reading_preferences TO authenticated;

-- ============================================================
-- VIEW: user_notes
-- ============================================================

CREATE OR REPLACE VIEW public.user_notes AS
SELECT * FROM biblioteca.user_notes;

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_notes TO authenticated;

-- ============================================================
-- VIEW: authors
-- ============================================================

CREATE OR REPLACE VIEW public.authors AS
SELECT * FROM biblioteca.authors;

-- Grant access
GRANT SELECT ON public.authors TO authenticated;
GRANT SELECT ON public.authors TO anon;

-- ============================================================
-- INSTEAD OF TRIGGERS for INSERT/UPDATE/DELETE on views
-- These allow the Supabase client to write through the views
-- ============================================================

-- book_catalog INSERT
CREATE OR REPLACE FUNCTION public.book_catalog_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.book_catalog (
    google_books_id, open_library_key, isbn13, isbn10,
    title, subtitle, author_id, author_name, description,
    publisher, published_date, page_count, language,
    categories, cover_url, thumbnail_url, added_by
  ) VALUES (
    NEW.google_books_id, NEW.open_library_key, NEW.isbn13, NEW.isbn10,
    NEW.title, NEW.subtitle, NEW.author_id, NEW.author_name, NEW.description,
    NEW.publisher, NEW.published_date, NEW.page_count, NEW.language,
    NEW.categories, NEW.cover_url, NEW.thumbnail_url, NEW.added_by
  ) RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS book_catalog_insert_trigger ON public.book_catalog;
CREATE TRIGGER book_catalog_insert_trigger
  INSTEAD OF INSERT ON public.book_catalog
  FOR EACH ROW EXECUTE FUNCTION public.book_catalog_insert();

-- book_catalog UPDATE
CREATE OR REPLACE FUNCTION public.book_catalog_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE biblioteca.book_catalog SET
    google_books_id = NEW.google_books_id,
    open_library_key = NEW.open_library_key,
    isbn13 = NEW.isbn13,
    isbn10 = NEW.isbn10,
    title = NEW.title,
    subtitle = NEW.subtitle,
    author_id = NEW.author_id,
    author_name = NEW.author_name,
    description = NEW.description,
    publisher = NEW.publisher,
    published_date = NEW.published_date,
    page_count = NEW.page_count,
    language = NEW.language,
    categories = NEW.categories,
    cover_url = NEW.cover_url,
    thumbnail_url = NEW.thumbnail_url
  WHERE id = OLD.id
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS book_catalog_update_trigger ON public.book_catalog;
CREATE TRIGGER book_catalog_update_trigger
  INSTEAD OF UPDATE ON public.book_catalog
  FOR EACH ROW EXECUTE FUNCTION public.book_catalog_update();

-- book_catalog DELETE
CREATE OR REPLACE FUNCTION public.book_catalog_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM biblioteca.book_catalog WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS book_catalog_delete_trigger ON public.book_catalog;
CREATE TRIGGER book_catalog_delete_trigger
  INSTEAD OF DELETE ON public.book_catalog
  FOR EACH ROW EXECUTE FUNCTION public.book_catalog_delete();

-- book_summaries INSERT
CREATE OR REPLACE FUNCTION public.book_summaries_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.book_summaries (
    catalog_id, title, created_by, is_published, published_at
  ) VALUES (
    NEW.catalog_id, NEW.title, NEW.created_by,
    COALESCE(NEW.is_published, false), NEW.published_at
  ) RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS book_summaries_insert_trigger ON public.book_summaries;
CREATE TRIGGER book_summaries_insert_trigger
  INSTEAD OF INSERT ON public.book_summaries
  FOR EACH ROW EXECUTE FUNCTION public.book_summaries_insert();

-- book_summaries UPDATE
CREATE OR REPLACE FUNCTION public.book_summaries_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE biblioteca.book_summaries SET
    catalog_id = NEW.catalog_id,
    title = NEW.title,
    is_published = NEW.is_published,
    published_at = NEW.published_at
  WHERE id = OLD.id
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS book_summaries_update_trigger ON public.book_summaries;
CREATE TRIGGER book_summaries_update_trigger
  INSTEAD OF UPDATE ON public.book_summaries
  FOR EACH ROW EXECUTE FUNCTION public.book_summaries_update();

-- book_summaries DELETE
CREATE OR REPLACE FUNCTION public.book_summaries_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM biblioteca.book_summaries WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS book_summaries_delete_trigger ON public.book_summaries;
CREATE TRIGGER book_summaries_delete_trigger
  INSTEAD OF DELETE ON public.book_summaries
  FOR EACH ROW EXECUTE FUNCTION public.book_summaries_delete();

-- summary_chapters INSERT
CREATE OR REPLACE FUNCTION public.summary_chapters_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.summary_chapters (
    summary_id, chapter_number, title, subtitle, content, order_index, word_count
  ) VALUES (
    NEW.summary_id, NEW.chapter_number, NEW.title, NEW.subtitle,
    NEW.content, NEW.order_index, COALESCE(NEW.word_count, 0)
  ) RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS summary_chapters_insert_trigger ON public.summary_chapters;
CREATE TRIGGER summary_chapters_insert_trigger
  INSTEAD OF INSERT ON public.summary_chapters
  FOR EACH ROW EXECUTE FUNCTION public.summary_chapters_insert();

-- summary_chapters UPDATE
CREATE OR REPLACE FUNCTION public.summary_chapters_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE biblioteca.summary_chapters SET
    chapter_number = NEW.chapter_number,
    title = NEW.title,
    subtitle = NEW.subtitle,
    content = NEW.content,
    order_index = NEW.order_index,
    word_count = NEW.word_count
  WHERE id = OLD.id
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS summary_chapters_update_trigger ON public.summary_chapters;
CREATE TRIGGER summary_chapters_update_trigger
  INSTEAD OF UPDATE ON public.summary_chapters
  FOR EACH ROW EXECUTE FUNCTION public.summary_chapters_update();

-- summary_chapters DELETE
CREATE OR REPLACE FUNCTION public.summary_chapters_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM biblioteca.summary_chapters WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS summary_chapters_delete_trigger ON public.summary_chapters;
CREATE TRIGGER summary_chapters_delete_trigger
  INSTEAD OF DELETE ON public.summary_chapters
  FOR EACH ROW EXECUTE FUNCTION public.summary_chapters_delete();

-- user_favorites INSERT
CREATE OR REPLACE FUNCTION public.user_favorites_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.user_favorites (user_id, catalog_id)
  VALUES (NEW.user_id, NEW.catalog_id)
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_favorites_insert_trigger ON public.user_favorites;
CREATE TRIGGER user_favorites_insert_trigger
  INSTEAD OF INSERT ON public.user_favorites
  FOR EACH ROW EXECUTE FUNCTION public.user_favorites_insert();

-- user_favorites DELETE
CREATE OR REPLACE FUNCTION public.user_favorites_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM biblioteca.user_favorites WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_favorites_delete_trigger ON public.user_favorites;
CREATE TRIGGER user_favorites_delete_trigger
  INSTEAD OF DELETE ON public.user_favorites
  FOR EACH ROW EXECUTE FUNCTION public.user_favorites_delete();

-- summary_reading_progress INSERT
CREATE OR REPLACE FUNCTION public.summary_reading_progress_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.summary_reading_progress (
    user_id, summary_id, current_chapter, completed, last_read_at, completed_at
  ) VALUES (
    NEW.user_id, NEW.summary_id, COALESCE(NEW.current_chapter, 1),
    COALESCE(NEW.completed, false), COALESCE(NEW.last_read_at, now()), NEW.completed_at
  ) RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS summary_reading_progress_insert_trigger ON public.summary_reading_progress;
CREATE TRIGGER summary_reading_progress_insert_trigger
  INSTEAD OF INSERT ON public.summary_reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.summary_reading_progress_insert();

-- summary_reading_progress UPDATE
CREATE OR REPLACE FUNCTION public.summary_reading_progress_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE biblioteca.summary_reading_progress SET
    current_chapter = NEW.current_chapter,
    completed = NEW.completed,
    last_read_at = NEW.last_read_at,
    completed_at = NEW.completed_at
  WHERE id = OLD.id
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS summary_reading_progress_update_trigger ON public.summary_reading_progress;
CREATE TRIGGER summary_reading_progress_update_trigger
  INSTEAD OF UPDATE ON public.summary_reading_progress
  FOR EACH ROW EXECUTE FUNCTION public.summary_reading_progress_update();

-- user_reading_preferences INSERT/UPDATE (UPSERT behavior)
CREATE OR REPLACE FUNCTION public.user_reading_preferences_upsert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.user_reading_preferences (user_id, theme, font_size)
  VALUES (NEW.user_id, NEW.theme, NEW.font_size)
  ON CONFLICT (user_id) DO UPDATE SET
    theme = EXCLUDED.theme,
    font_size = EXCLUDED.font_size,
    updated_at = now()
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_reading_preferences_insert_trigger ON public.user_reading_preferences;
CREATE TRIGGER user_reading_preferences_insert_trigger
  INSTEAD OF INSERT ON public.user_reading_preferences
  FOR EACH ROW EXECUTE FUNCTION public.user_reading_preferences_upsert();

DROP TRIGGER IF EXISTS user_reading_preferences_update_trigger ON public.user_reading_preferences;
CREATE TRIGGER user_reading_preferences_update_trigger
  INSTEAD OF UPDATE ON public.user_reading_preferences
  FOR EACH ROW EXECUTE FUNCTION public.user_reading_preferences_upsert();

-- user_notes INSERT
CREATE OR REPLACE FUNCTION public.user_notes_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO biblioteca.user_notes (
    user_id, catalog_id, type, content, page_number, chapter
  ) VALUES (
    NEW.user_id, NEW.catalog_id, COALESCE(NEW.type, 'note'),
    NEW.content, NEW.page_number, NEW.chapter
  ) RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_notes_insert_trigger ON public.user_notes;
CREATE TRIGGER user_notes_insert_trigger
  INSTEAD OF INSERT ON public.user_notes
  FOR EACH ROW EXECUTE FUNCTION public.user_notes_insert();

-- user_notes UPDATE
CREATE OR REPLACE FUNCTION public.user_notes_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE biblioteca.user_notes SET
    type = NEW.type,
    content = NEW.content,
    page_number = NEW.page_number,
    chapter = NEW.chapter
  WHERE id = OLD.id
  RETURNING * INTO NEW;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_notes_update_trigger ON public.user_notes;
CREATE TRIGGER user_notes_update_trigger
  INSTEAD OF UPDATE ON public.user_notes
  FOR EACH ROW EXECUTE FUNCTION public.user_notes_update();

-- user_notes DELETE
CREATE OR REPLACE FUNCTION public.user_notes_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM biblioteca.user_notes WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS user_notes_delete_trigger ON public.user_notes;
CREATE TRIGGER user_notes_delete_trigger
  INSTEAD OF DELETE ON public.user_notes
  FOR EACH ROW EXECUTE FUNCTION public.user_notes_delete();

-- ============================================================
-- GRANT INSERT permissions for views (required for triggers)
-- ============================================================

GRANT INSERT, UPDATE, DELETE ON public.book_catalog TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.book_summaries TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.summary_chapters TO authenticated;

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Biblioteca public views migration completed successfully!';
END $$;
