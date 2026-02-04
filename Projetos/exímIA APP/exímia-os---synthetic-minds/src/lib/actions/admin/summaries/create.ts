import { supabase } from '../../../supabase/client';
import { BookSummary, ActionResult } from '../../../../types/biblioteca';

export async function createSummary(input: {
  catalog_id: string;
  title: string;
}): Promise<ActionResult<BookSummary>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' };
    }

    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return { success: false, error: 'Access denied', code: 'FORBIDDEN' };
    }

    const { data: existing } = await supabase
      .from('book_summaries')
      .select('id')
      .eq('catalog_id', input.catalog_id)
      .single();

    if (existing) {
      return { success: false, error: 'Summary already exists', code: 'DUPLICATE' };
    }

    const { data, error } = await supabase
      .from('book_summaries')
      .insert({
        catalog_id: input.catalog_id,
        title: input.title,
        created_by: user.id,
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Create summary error:', error);
      return { success: false, error: 'Failed to create summary', code: 'INSERT_ERROR' };
    }

    return { success: true, data };
  } catch (err) {
    console.error('createSummary error:', err);
    return { success: false, error: 'Unknown error', code: 'UNKNOWN_ERROR' };
  }
}
