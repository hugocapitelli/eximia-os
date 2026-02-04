// Author Service - Author Management Operations
// Story 7.2.0

import { supabase } from '../../lib/supabase/client';
import type { Author, ActionResult } from '../../types/biblioteca';

/**
 * Create a new author with bio, photo, and social links
 * @param name - Author's name (required)
 * @param bio - Author's biography (optional)
 * @param photoUrl - Author's photo URL (optional)
 * @param socialLinks - Author's social media links (optional)
 * @returns Created author object or error
 */
export async function createAuthor(
  name: string,
  bio?: string,
  photoUrl?: string,
  socialLinks?: Record<string, string>
): Promise<ActionResult<Author>> {
  // Validate name is not empty
  if (!name || name.trim().length === 0) {
    return { success: false, error: 'Nome do autor é obrigatório', code: 'VALIDATION_ERROR' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Check admin status
  const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !adminData) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  try {
    const { data, error } = await supabase
      .from('authors')
      .insert({
        name: name.trim(),
        bio: bio ? bio.trim() : null,
        photo_url: photoUrl || null,
        social_links: socialLinks || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Create author error:', error);
      return { success: false, error: 'Falha ao criar autor', code: 'INSERT_ERROR' };
    }

    return { success: true, data: data as Author };
  } catch (err) {
    console.error('Create author exception:', err);
    return { success: false, error: 'Erro ao criar autor', code: 'EXCEPTION' };
  }
}

/**
 * Link an author to a book
 * @param bookId - Book catalog ID
 * @param authorId - Author ID
 * @returns Success/failure result
 */
export async function linkAuthorToBook(
  bookId: string,
  authorId: string
): Promise<ActionResult<void>> {
  if (!bookId || !authorId) {
    return { success: false, error: 'IDs do livro e autor são obrigatórios', code: 'VALIDATION_ERROR' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Check admin status
  const { data: adminData, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || !adminData) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  try {
    // Verify author exists
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('id')
      .eq('id', authorId)
      .single();

    if (authorError || !author) {
      return { success: false, error: 'Autor não encontrado', code: 'NOT_FOUND' };
    }

    // Update book with author_id
    const { error: updateError } = await supabase
      .from('book_catalog')
      .update({ author_id: authorId })
      .eq('id', bookId);

    if (updateError) {
      console.error('Link author error:', updateError);
      return { success: false, error: 'Falha ao vincular autor', code: 'UPDATE_ERROR' };
    }

    return { success: true };
  } catch (err) {
    console.error('Link author exception:', err);
    return { success: false, error: 'Erro ao vincular autor', code: 'EXCEPTION' };
  }
}

/**
 * Check if an author exists by name (case-insensitive)
 * @param name - Author name to search for
 * @returns True if author exists, false otherwise
 */
export async function checkAuthorExists(name: string): Promise<boolean> {
  if (!name || name.trim().length === 0) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('authors')
      .select('id')
      .ilike('name', name.trim())
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Check author exists error:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Check author exists exception:', err);
    return false;
  }
}

/**
 * Get author by name (case-insensitive)
 * @param name - Author name to search for
 * @returns Author object or null if not found
 */
export async function getAuthorByName(name: string): Promise<ActionResult<Author | null>> {
  if (!name || name.trim().length === 0) {
    return { success: false, error: 'Nome do autor é obrigatório', code: 'VALIDATION_ERROR' };
  }

  try {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .ilike('name', name.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found is not an error, just return null
        return { success: true, data: null };
      }
      console.error('Get author by name error:', error);
      return { success: false, error: 'Falha ao buscar autor', code: 'QUERY_ERROR' };
    }

    return { success: true, data: data as Author };
  } catch (err) {
    console.error('Get author by name exception:', err);
    return { success: false, error: 'Erro ao buscar autor', code: 'EXCEPTION' };
  }
}

/**
 * Get all books by an author
 * @param authorId - Author ID
 * @returns Array of books by the author
 */
export async function getAuthorBooks(authorId: string): Promise<ActionResult<any[]>> {
  if (!authorId) {
    return { success: false, error: 'ID do autor é obrigatório', code: 'VALIDATION_ERROR' };
  }

  try {
    const { data, error } = await supabase
      .from('book_catalog')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get author books error:', error);
      return { success: false, error: 'Falha ao carregar livros do autor', code: 'QUERY_ERROR' };
    }

    return { success: true, data: data || [] };
  } catch (err) {
    console.error('Get author books exception:', err);
    return { success: false, error: 'Erro ao carregar livros do autor', code: 'EXCEPTION' };
  }
}
