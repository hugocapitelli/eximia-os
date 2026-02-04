import { supabase } from '../../supabase/client';
import {
  SaveReadingPreferencesInput,
  UserReadingPreferences,
  ActionResult,
  ReadingTheme,
  FontSize,
} from '../../../types/biblioteca';

/**
 * Salva as preferências de leitura do usuário (upsert)
 * - Tema (light, sepia, dark)
 * - Tamanho da fonte (small, medium, large)
 */
export async function saveReadingPreferences(
  input: SaveReadingPreferencesInput
): Promise<ActionResult<UserReadingPreferences>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
        code: 'UNAUTHORIZED',
      };
    }

    // Validar tema se fornecido
    const validThemes: ReadingTheme[] = ['light', 'sepia', 'dark'];
    if (input.theme && !validThemes.includes(input.theme)) {
      return {
        success: false,
        error: 'Tema inválido',
        code: 'VALIDATION_ERROR',
      };
    }

    // Validar tamanho da fonte se fornecido
    const validFontSizes: FontSize[] = ['small', 'medium', 'large'];
    if (input.font_size && !validFontSizes.includes(input.font_size)) {
      return {
        success: false,
        error: 'Tamanho de fonte inválido',
        code: 'VALIDATION_ERROR',
      };
    }

    const updateData: Record<string, unknown> = {};
    if (input.theme) updateData.theme = input.theme;
    if (input.font_size) updateData.font_size = input.font_size;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('user_reading_preferences')
      .upsert(
        {
          user_id: user.id,
          ...updateData,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Save preferences error:', error);
      return {
        success: false,
        error: 'Falha ao salvar preferências',
        code: 'UPSERT_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('saveReadingPreferences error:', err);
    return {
      success: false,
      error: 'Erro ao salvar preferências',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Recupera as preferências de leitura do usuário
 * - Retorna defaults se o usuário não tem preferências salvas
 */
export async function getReadingPreferences(): Promise<ActionResult<UserReadingPreferences | null>> {
  try {
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
        // Retornar defaults se não existir
        const defaults: UserReadingPreferences = {
          id: '',
          user_id: user.id,
          theme: 'dark',
          font_size: 'medium',
          updated_at: new Date().toISOString(),
        };
        return { success: true, data: defaults };
      }
      console.error('Get preferences error:', error);
      return {
        success: false,
        error: 'Falha ao carregar preferências',
        code: 'QUERY_ERROR',
      };
    }

    return { success: true, data };
  } catch (err) {
    console.error('getReadingPreferences error:', err);
    return {
      success: false,
      error: 'Erro ao buscar preferências',
      code: 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Atualiza apenas o tema
 */
export async function updateTheme(theme: ReadingTheme): Promise<ActionResult<UserReadingPreferences>> {
  return saveReadingPreferences({ theme });
}

/**
 * Atualiza apenas o tamanho da fonte
 */
export async function updateFontSize(fontSize: FontSize): Promise<ActionResult<UserReadingPreferences>> {
  return saveReadingPreferences({ font_size: fontSize });
}

/**
 * Reseta as preferências para os defaults
 */
export async function resetReadingPreferences(): Promise<ActionResult<UserReadingPreferences>> {
  return saveReadingPreferences({
    theme: 'dark',
    font_size: 'medium',
  });
}
