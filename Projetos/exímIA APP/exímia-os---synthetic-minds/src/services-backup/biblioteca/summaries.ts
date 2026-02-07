// Summaries Service - Book Summaries & Reading Progress
// EXIMIA-201, EXIMIA-205, EXIMIA-207

import { supabase } from '../../lib/supabase/client';
import type {
  BookSummary,
  SummaryChapter,
  SummaryWithChapters,
  SummaryReadingProgress,
  UserReadingPreferences,
  CreateSummaryInput,
  CreateChapterInput,
  UpdateChapterInput,
  ReorderChaptersInput,
  SaveSummaryProgressInput,
  SaveReadingPreferencesInput,
  ActionResult,
  ReadingTheme,
  FontSize,
} from '../../types/biblioteca';
import { isAdmin } from './catalog';

// ============================================================
// READING - Public Functions
// ============================================================

// Get summary by catalog ID
export async function getSummaryByCatalog(
  catalogId: string
): Promise<ActionResult<BookSummary | null>> {
  const admin = await isAdmin();

  let query = supabase
    .from('book_summaries')
    .select('*')
    .eq('catalog_id', catalogId);

  if (!admin) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get summary error:', error);
    return { success: false, error: 'Falha ao carregar resumo', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data as BookSummary };
}

// Get summary with chapters
export async function getSummaryWithChapters(
  summaryId: string
): Promise<ActionResult<SummaryWithChapters | null>> {
  const admin = await isAdmin();

  // Get summary
  let summaryQuery = supabase
    .from('book_summaries')
    .select('*, book_catalog(*)')
    .eq('id', summaryId);

  if (!admin) {
    summaryQuery = summaryQuery.eq('is_published', true);
  }

  const { data: summary, error: summaryError } = await summaryQuery.single();

  if (summaryError) {
    if (summaryError.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get summary error:', summaryError);
    return { success: false, error: 'Falha ao carregar resumo', code: 'QUERY_ERROR' };
  }

  // Get chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('summary_chapters')
    .select('*')
    .eq('summary_id', summaryId)
    .order('order_index');

  if (chaptersError) {
    console.error('Get chapters error:', chaptersError);
    return { success: false, error: 'Falha ao carregar capítulos', code: 'QUERY_ERROR' };
  }

  return {
    success: true,
    data: {
      ...summary,
      chapters: (chapters || []) as SummaryChapter[],
      catalog: summary.book_catalog,
    } as SummaryWithChapters,
  };
}

// Get single chapter
export async function getChapter(
  summaryId: string,
  chapterNumber: number
): Promise<ActionResult<SummaryChapter | null>> {
  const { data, error } = await supabase
    .from('summary_chapters')
    .select('*')
    .eq('summary_id', summaryId)
    .eq('chapter_number', chapterNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get chapter error:', error);
    return { success: false, error: 'Falha ao carregar capítulo', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data as SummaryChapter };
}

// ============================================================
// PROGRESS & PREFERENCES
// ============================================================

// Save reading progress
export async function saveReadingProgress(
  input: SaveSummaryProgressInput
): Promise<ActionResult<SummaryReadingProgress>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { summary_id, current_chapter, completed } = input;

  const { data, error } = await supabase
    .from('summary_reading_progress')
    .upsert(
      {
        user_id: user.id,
        summary_id,
        current_chapter,
        completed: completed || false,
        last_read_at: new Date().toISOString(),
        completed_at: completed ? new Date().toISOString() : null,
      },
      {
        onConflict: 'user_id,summary_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Save progress error:', error);
    return { success: false, error: 'Falha ao salvar progresso', code: 'UPSERT_ERROR' };
  }

  return { success: true, data: data as SummaryReadingProgress };
}

// Get reading progress
export async function getReadingProgress(
  summaryId: string
): Promise<ActionResult<SummaryReadingProgress | null>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: null };
  }

  const { data, error } = await supabase
    .from('summary_reading_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('summary_id', summaryId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get progress error:', error);
    return { success: false, error: 'Falha ao carregar progresso', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data as SummaryReadingProgress };
}

// Save reading preferences
export async function saveReadingPreferences(
  input: SaveReadingPreferencesInput
): Promise<ActionResult<UserReadingPreferences>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_reading_preferences')
    .upsert(
      {
        user_id: user.id,
        ...input,
      },
      {
        onConflict: 'user_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Save preferences error:', error);
    return { success: false, error: 'Falha ao salvar preferências', code: 'UPSERT_ERROR' };
  }

  return { success: true, data: data as UserReadingPreferences };
}

// Get reading preferences
export async function getReadingPreferences(): Promise<ActionResult<UserReadingPreferences | null>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: null };
  }

  const { data, error } = await supabase
    .from('user_reading_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Return defaults
      return {
        success: true,
        data: {
          id: '',
          user_id: user.id,
          theme: 'dark' as ReadingTheme,
          font_size: 'medium' as FontSize,
          updated_at: new Date().toISOString(),
        },
      };
    }
    console.error('Get preferences error:', error);
    return { success: false, error: 'Falha ao carregar preferências', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data as UserReadingPreferences };
}

// ============================================================
// ADMIN - Summary Management
// ============================================================

// Create summary (Admin only)
export async function createSummary(
  catalogId: string,
  input: { title: string; version?: number; status?: 'draft' | 'published' }
): Promise<ActionResult<BookSummary>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { data, error } = await supabase
    .from('book_summaries')
    .insert({
      catalog_id: catalogId,
      title: input.title,
      created_by: user.id,
      is_published: input.status === 'published',
    })
    .select()
    .single();

  if (error) {
    console.error('Create summary error:', error);
    return { success: false, error: 'Falha ao criar resumo', code: 'INSERT_ERROR' };
  }

  return {
    success: true,
    data: {
      ...data,
      status: data.is_published ? 'published' : 'draft',
      version: input.version || 1,
    } as BookSummary,
  };
}

// List all summaries (Admin only)
export async function listSummaries(): Promise<ActionResult<(BookSummary & { chapter_count: number; catalog: any })[]>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { data, error } = await supabase
    .from('book_summaries')
    .select(`
      *,
      book_catalog (
        id,
        title,
        author_name,
        cover_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('List summaries error:', error);
    return { success: false, error: 'Falha ao carregar resumos', code: 'QUERY_ERROR' };
  }

  // Get chapter counts
  const summariesWithCount = await Promise.all(
    (data || []).map(async (summary) => {
      const { count } = await supabase
        .from('summary_chapters')
        .select('*', { count: 'exact', head: true })
        .eq('summary_id', summary.id);

      return {
        ...summary,
        chapter_count: count || 0,
        catalog: summary.book_catalog,
      };
    })
  );

  return { success: true, data: summariesWithCount };
}

// Publish summary (Admin only)
export async function publishSummary(
  summaryId: string
): Promise<ActionResult<void>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  // Check if has at least 1 chapter
  const { count } = await supabase
    .from('summary_chapters')
    .select('*', { count: 'exact', head: true })
    .eq('summary_id', summaryId);

  if (!count || count === 0) {
    return { success: false, error: 'Adicione pelo menos um capítulo antes de publicar', code: 'NO_CHAPTERS' };
  }

  const { error } = await supabase
    .from('book_summaries')
    .update({
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq('id', summaryId);

  if (error) {
    console.error('Publish summary error:', error);
    return { success: false, error: 'Falha ao publicar', code: 'UPDATE_ERROR' };
  }

  return { success: true };
}

// Unpublish summary (Admin only)
export async function unpublishSummary(
  summaryId: string
): Promise<ActionResult<void>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { error } = await supabase
    .from('book_summaries')
    .update({
      is_published: false,
      published_at: null,
    })
    .eq('id', summaryId);

  if (error) {
    console.error('Unpublish summary error:', error);
    return { success: false, error: 'Falha ao despublicar', code: 'UPDATE_ERROR' };
  }

  return { success: true };
}

// Delete summary (Admin only)
export async function deleteSummary(
  summaryId: string
): Promise<ActionResult<void>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { error } = await supabase
    .from('book_summaries')
    .delete()
    .eq('id', summaryId);

  if (error) {
    console.error('Delete summary error:', error);
    return { success: false, error: 'Falha ao excluir resumo', code: 'DELETE_ERROR' };
  }

  return { success: true };
}

// ============================================================
// ADMIN - Chapter Management
// ============================================================

// Add chapter (Admin only)
export async function addChapter(
  input: CreateChapterInput
): Promise<ActionResult<SummaryChapter>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const wordCount = input.content.split(/\s+/).filter(Boolean).length;

  const { data, error } = await supabase
    .from('summary_chapters')
    .insert({
      ...input,
      word_count: wordCount,
    })
    .select()
    .single();

  if (error) {
    console.error('Add chapter error:', error);
    return { success: false, error: 'Falha ao adicionar capítulo', code: 'INSERT_ERROR' };
  }

  return { success: true, data: data as SummaryChapter };
}

// Update chapter (Admin only)
export async function updateChapter(
  chapterId: string,
  input: UpdateChapterInput
): Promise<ActionResult<SummaryChapter>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const updateData: any = { ...input };

  if (input.content) {
    updateData.word_count = input.content.split(/\s+/).filter(Boolean).length;
  }

  const { data, error } = await supabase
    .from('summary_chapters')
    .update(updateData)
    .eq('id', chapterId)
    .select()
    .single();

  if (error) {
    console.error('Update chapter error:', error);
    return { success: false, error: 'Falha ao atualizar capítulo', code: 'UPDATE_ERROR' };
  }

  return { success: true, data: data as SummaryChapter };
}

// Delete chapter (Admin only)
export async function deleteChapter(
  chapterId: string
): Promise<ActionResult<void>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { error } = await supabase
    .from('summary_chapters')
    .delete()
    .eq('id', chapterId);

  if (error) {
    console.error('Delete chapter error:', error);
    return { success: false, error: 'Falha ao excluir capítulo', code: 'DELETE_ERROR' };
  }

  return { success: true };
}

// Reorder chapters (Admin only)
export async function reorderChapters(
  summaryId: string,
  orderMap: Record<string, number>
): Promise<ActionResult<void>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  // Update each chapter's order
  for (const [chapterId, orderIndex] of Object.entries(orderMap)) {
    const { error } = await supabase
      .from('summary_chapters')
      .update({
        order_index: orderIndex - 1,
        chapter_number: orderIndex,
      })
      .eq('id', chapterId);

    if (error) {
      console.error('Reorder chapter error:', error);
      return { success: false, error: 'Falha ao reordenar', code: 'UPDATE_ERROR' };
    }
  }

  return { success: true };
}

// Get summaries for a book
export async function getBookSummaries(
  catalogId: string
): Promise<ActionResult<BookSummary[]>> {
  const admin = await isAdmin();

  let query = supabase
    .from('book_summaries')
    .select('*')
    .eq('catalog_id', catalogId)
    .order('created_at', { ascending: false });

  if (!admin) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Get book summaries error:', error);
    return { success: false, error: 'Falha ao carregar resumos', code: 'QUERY_ERROR' };
  }

  // Map to expected format
  const summaries = (data || []).map((s: any) => ({
    ...s,
    status: s.is_published ? 'published' : 'draft',
    version: 1,
  }));

  return { success: true, data: summaries as BookSummary[] };
}

// Update summary (Admin only)
export async function updateSummary(
  summaryId: string,
  input: Partial<{ title: string; status: 'draft' | 'published' }>
): Promise<ActionResult<BookSummary>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const updateData: any = {};
  if (input.title) updateData.title = input.title;
  if (input.status) {
    updateData.is_published = input.status === 'published';
    if (input.status === 'published') {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from('book_summaries')
    .update(updateData)
    .eq('id', summaryId)
    .select()
    .single();

  if (error) {
    console.error('Update summary error:', error);
    return { success: false, error: 'Falha ao atualizar resumo', code: 'UPDATE_ERROR' };
  }

  return {
    success: true,
    data: {
      ...data,
      status: data.is_published ? 'published' : 'draft',
      version: 1,
    } as BookSummary,
  };
}
