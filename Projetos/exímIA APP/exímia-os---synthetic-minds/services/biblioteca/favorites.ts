// Favorites Service - User Favorites Operations
// EXIMIA-105, EXIMIA-106

import { supabase } from '@/lib/supabase/client';
import type {
  UserFavorite,
  UserFavoriteView,
  FavoriteFilters,
  ActionResult,
  PaginatedResponse,
  UserStats,
} from '../../types/biblioteca';

// Toggle favorite (add or remove)
export async function toggleFavorite(
  catalogId: string
): Promise<ActionResult<{ isFavorite: boolean }>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('catalog_id', catalogId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('Remove favorite error:', error);
      return { success: false, error: 'Falha ao remover favorito', code: 'DELETE_ERROR' };
    }

    return { success: true, data: { isFavorite: false } };
  } else {
    // Add favorite
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        catalog_id: catalogId,
      });

    if (error) {
      console.error('Add favorite error:', error);
      return { success: false, error: 'Falha ao adicionar favorito', code: 'INSERT_ERROR' };
    }

    return { success: true, data: { isFavorite: true } };
  }
}

// Check if books are favorited
export async function checkFavorites(
  catalogIds: string[]
): Promise<ActionResult<Set<string>>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: new Set() };
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('catalog_id')
    .eq('user_id', user.id)
    .in('catalog_id', catalogIds);

  if (error) {
    console.error('Check favorites error:', error);
    return { success: false, error: 'Falha ao verificar favoritos', code: 'QUERY_ERROR' };
  }

  const favoriteIds = new Set((data || []).map(f => f.catalog_id));
  return { success: true, data: favoriteIds };
}

// Check if single book is favorited
export async function isFavorited(
  catalogId: string
): Promise<ActionResult<boolean>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: false };
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('catalog_id', catalogId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('isFavorited error:', error);
    return { success: false, error: 'Falha ao verificar favorito', code: 'QUERY_ERROR' };
  }

  return { success: true, data: !!data };
}

// Get user favorites with book data
export async function getUserFavorites(
  filters: FavoriteFilters = {}
): Promise<ActionResult<PaginatedResponse<UserFavoriteView>>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const {
    has_summary,
    summary_completed,
    limit = 20,
    offset = 0,
    orderBy = 'favorited_at',
    orderDir = 'desc',
  } = filters;

  let query = supabase
    .from('user_favorites_view')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  // Apply filters
  if (has_summary !== undefined) {
    query = query.eq('has_published_summary', has_summary);
  }

  if (summary_completed !== undefined) {
    query = query.eq('summary_completed', summary_completed);
  }

  // Apply ordering
  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Get favorites error:', error);
    return { success: false, error: 'Falha ao carregar favoritos', code: 'QUERY_ERROR' };
  }

  const total = count || 0;
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data: {
      data: (data || []) as UserFavoriteView[],
      total,
      page,
      pageSize: limit,
      totalPages,
    },
  };
}

// Get favorites count
export async function getFavoritesCount(): Promise<ActionResult<number>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: 0 };
  }

  const { count, error } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('Get favorites count error:', error);
    return { success: false, error: 'Falha ao contar favoritos', code: 'QUERY_ERROR' };
  }

  return { success: true, data: count || 0 };
}

// Get user stats
export async function getUserStats(): Promise<ActionResult<UserStats>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Get favorites count
  const { count: favoritesCount } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get completed summaries count
  const { count: summariesCompleted } = await supabase
    .from('summary_reading_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true);

  // Get notes count
  const { count: notesCount } = await supabase
    .from('user_notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return {
    success: true,
    data: {
      user_id: user.id,
      favorites_count: favoritesCount || 0,
      summaries_completed: summariesCompleted || 0,
      notes_count: notesCount || 0,
    },
  };
}

// Remove from favorites
export async function removeFromFavorites(
  catalogId: string
): Promise<ActionResult<void>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('catalog_id', catalogId);

  if (error) {
    console.error('Remove favorite error:', error);
    return { success: false, error: 'Falha ao remover favorito', code: 'DELETE_ERROR' };
  }

  return { success: true };
}
