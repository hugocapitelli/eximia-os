import { supabase } from '@/lib/supabase/client';
import { BookSummary, ActionResult } from '@/types/biblioteca';

export async function publishSummary(summaryId: string): Promise<ActionResult<BookSummary>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' };
    }

    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return { success: false, error: 'Access denied', code: 'FORBIDDEN' };
    }

    const { data, error } = await supabase
      .from('book_summaries')
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', summaryId)
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Failed to publish', code: 'UPDATE_ERROR' };
    }

    return { success: true, data };
  } catch (err) {
    console.error('publishSummary error:', err);
    return { success: false, error: 'Unknown error', code: 'UNKNOWN_ERROR' };
  }
}

export async function unpublishSummary(summaryId: string): Promise<ActionResult<BookSummary>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', code: 'UNAUTHORIZED' };
    }

    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return { success: false, error: 'Access denied', code: 'FORBIDDEN' };
    }

    const { data, error } = await supabase
      .from('book_summaries')
      .update({ is_published: false })
      .eq('id', summaryId)
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Failed to unpublish', code: 'UPDATE_ERROR' };
    }

    return { success: true, data };
  } catch (err) {
    console.error('unpublishSummary error:', err);
    return { success: false, error: 'Unknown error', code: 'UNKNOWN_ERROR' };
  }
}
