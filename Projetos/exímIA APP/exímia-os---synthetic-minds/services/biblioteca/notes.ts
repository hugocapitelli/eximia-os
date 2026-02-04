// Notes Service - User Notes Operations
// EXIMIA-108

import { supabase } from '@/lib/supabase/client';
import type {
  UserNote,
  CreateNoteInput,
  UpdateNoteInput,
  NoteFilters,
  ActionResult,
  NoteType,
} from '../../types/biblioteca';

// Create a note
export async function createNote(
  input: CreateNoteInput
): Promise<ActionResult<UserNote>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .insert({
      user_id: user.id,
      catalog_id: input.catalog_id,
      type: input.type,
      content: input.content,
      page_number: input.page_number,
      chapter: input.chapter,
    })
    .select()
    .single();

  if (error) {
    console.error('Create note error:', error);
    return { success: false, error: 'Falha ao criar nota', code: 'INSERT_ERROR' };
  }

  return { success: true, data: data as UserNote };
}

// Update a note
export async function updateNote(
  noteId: string,
  input: UpdateNoteInput
): Promise<ActionResult<UserNote>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .update(input)
    .eq('id', noteId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Update note error:', error);
    return { success: false, error: 'Falha ao atualizar nota', code: 'UPDATE_ERROR' };
  }

  return { success: true, data: data as UserNote };
}

// Delete a note
export async function deleteNote(
  noteId: string
): Promise<ActionResult<void>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { error } = await supabase
    .from('user_notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete note error:', error);
    return { success: false, error: 'Falha ao excluir nota', code: 'DELETE_ERROR' };
  }

  return { success: true };
}

// Get notes for a book
export async function getNotes(
  filters: NoteFilters
): Promise<ActionResult<UserNote[]>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const {
    catalog_id,
    type,
    orderBy = 'created_at',
    orderDir = 'desc',
  } = filters;

  let query = supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('catalog_id', catalog_id);

  if (type) {
    query = query.eq('type', type);
  }

  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  const { data, error } = await query;

  if (error) {
    console.error('Get notes error:', error);
    return { success: false, error: 'Falha ao carregar notas', code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data || []) as UserNote[] };
}

// Get single note
export async function getNote(
  noteId: string
): Promise<ActionResult<UserNote | null>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('id', noteId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get note error:', error);
    return { success: false, error: 'Falha ao carregar nota', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data as UserNote };
}

// Get notes count by type for a book
export async function getNotesCountByType(
  catalogId: string
): Promise<ActionResult<Record<NoteType, number>>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: { note: 0, highlight: 0, quote: 0 } };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .select('type')
    .eq('user_id', user.id)
    .eq('catalog_id', catalogId);

  if (error) {
    console.error('Get notes count error:', error);
    return { success: false, error: 'Falha ao contar notas', code: 'QUERY_ERROR' };
  }

  const counts: Record<NoteType, number> = { note: 0, highlight: 0, quote: 0 };
  (data || []).forEach(note => {
    counts[note.type as NoteType]++;
  });

  return { success: true, data: counts };
}

// Get all user notes across all books
export async function getAllUserNotes(
  limit: number = 50
): Promise<ActionResult<UserNote[]>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get all notes error:', error);
    return { success: false, error: 'Falha ao carregar notas', code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data || []) as UserNote[] };
}
