import { supabase } from '@/lib/supabase/client';
import {
  BookSummary,
  SummaryWithChapters,
  SummaryChapter,
  ActionResult,
} from '@/types/biblioteca';

/**
 * Busca um resumo pelo ID do catálogo
 * - Apenas resumos publicados para usuários normais
 * - Admin pode ver resumos não publicados
 */
export async function getSummaryByCatalog(
  catalogId: string
): Promise<ActionResult<BookSummary | null>> {
  try {
    // Verificar se é admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: true, data: null };
    }

    // Verificar se é admin
    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });

    let query = supabase
      .from('book_summaries')
      .select('*')
      .eq('catalog_id', catalogId);

    // Se não for admin, só mostra publicados
    if (!isAdmin) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum resultado encontrado
        return { success: true, data: null };
      }
      console.error('Get summary error:', error);
      return {
        success: false,
        error: 'Falha ao carregar resumo',
        code: 'QUERY_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('getSummaryByCatalog error:', err);
    return {
      success: false,
      error: 'Erro ao buscar resumo',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Busca um resumo com todos os seus capítulos
 * - Apenas resumos publicados para usuários normais
 * - Admin pode ver resumos não publicados
 */
export async function getSummaryWithChapters(
  summaryId: string
): Promise<ActionResult<SummaryWithChapters | null>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user?.id });

    // Buscar resumo
    let summaryQuery = supabase
      .from('book_summaries')
      .select('*, book_catalog(*)')
      .eq('id', summaryId);

    if (!isAdmin) {
      summaryQuery = summaryQuery.eq('is_published', true);
    }

    const { data: summary, error: summaryError } = await summaryQuery.single();

    if (summaryError) {
      if (summaryError.code === 'PGRST116') {
        return { success: true, data: null };
      }
      return {
        success: false,
        error: 'Falha ao carregar resumo',
        code: 'QUERY_ERROR',
      };
    }

    // Buscar capítulos ordenados
    const { data: chapters, error: chaptersError } = await supabase
      .from('summary_chapters')
      .select('*')
      .eq('summary_id', summaryId)
      .order('order_index', { ascending: true });

    if (chaptersError) {
      console.error('Get chapters error:', chaptersError);
      return {
        success: false,
        error: 'Falha ao carregar capítulos',
        code: 'QUERY_ERROR',
      };
    }

    return {
      success: true,
      data: {
        ...summary,
        chapters: chapters || [],
        catalog: summary.book_catalog,
      },
    };
  } catch (err) {
    console.error('getSummaryWithChapters error:', err);
    return {
      success: false,
      error: 'Erro ao buscar resumo com capítulos',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Busca um capítulo específico por número
 */
export async function getChapter(
  summaryId: string,
  chapterNumber: number
): Promise<ActionResult<SummaryChapter | null>> {
  try {
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
      return {
        success: false,
        error: 'Falha ao carregar capítulo',
        code: 'QUERY_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('getChapter error:', err);
    return {
      success: false,
      error: 'Erro ao buscar capítulo',
      code: 'UNKNOWN_ERROR',
    };
  }
}
