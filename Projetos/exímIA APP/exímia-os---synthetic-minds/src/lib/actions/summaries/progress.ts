import { supabase } from '@/lib/supabase/client';
import {
  SaveSummaryProgressInput,
  SummaryReadingProgress,
  ActionResult,
} from '@/types/biblioteca';

/**
 * Salva o progresso de leitura do usuário (upsert)
 * - Atualiza capítulo atual
 * - Marca como concluído se necessário
 * - Rastreia última leitura automaticamente
 */
export async function saveReadingProgress(
  input: SaveSummaryProgressInput
): Promise<ActionResult<SummaryReadingProgress>> {
  try {
    // Validar input
    if (!input.summary_id || !input.summary_id.trim()) {
      return {
        success: false,
        error: 'ID do resumo é obrigatório',
        code: 'VALIDATION_ERROR',
      };
    }

    if (input.current_chapter < 1) {
      return {
        success: false,
        error: 'Número do capítulo deve ser maior que 0',
        code: 'VALIDATION_ERROR',
      };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED',
      };
    }

    const { summary_id, current_chapter, completed } = input;
    const now = new Date().toISOString();

    // Fazer upsert do progresso
    const { data, error } = await supabase
      .from('summary_reading_progress')
      .upsert(
        {
          user_id: user.id,
          summary_id,
          current_chapter,
          completed: completed || false,
          last_read_at: now,
          completed_at: completed ? now : null,
        },
        {
          onConflict: 'user_id,summary_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Save progress error:', error);
      return {
        success: false,
        error: 'Falha ao salvar progresso',
        code: 'UPSERT_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('saveReadingProgress error:', err);
    return {
      success: false,
      error: 'Erro ao salvar progresso',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Recupera o progresso de leitura do usuário para um resumo
 * - Retorna null se o usuário não começou a ler
 */
export async function getReadingProgress(
  summaryId: string
): Promise<ActionResult<SummaryReadingProgress | null>> {
  try {
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
        // Nenhum progresso encontrado
        return { success: true, data: null };
      }
      console.error('Get progress error:', error);
      return {
        success: false,
        error: 'Falha ao carregar progresso',
        code: 'QUERY_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('getReadingProgress error:', err);
    return {
      success: false,
      error: 'Erro ao buscar progresso',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Marca um resumo como concluído
 */
export async function markSummaryAsCompleted(
  summaryId: string
): Promise<ActionResult<SummaryReadingProgress>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED',
      };
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('summary_reading_progress')
      .update({
        completed: true,
        completed_at: now,
        last_read_at: now,
      })
      .eq('user_id', user.id)
      .eq('summary_id', summaryId)
      .select()
      .single();

    if (error) {
      console.error('Mark as completed error:', error);
      return {
        success: false,
        error: 'Falha ao marcar como concluído',
        code: 'UPDATE_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('markSummaryAsCompleted error:', err);
    return {
      success: false,
      error: 'Erro ao marcar resumo como concluído',
      code: 'UNKNOWN_ERROR',
    };
  }
}
