// Catalog Service - Book Catalog Operations
// EXIMIA-103, EXIMIA-104

import { supabase } from '@/lib/supabase/client';
import type {
  BookCatalog,
  BookCatalogView,
  AddBookToCatalogInput,
  CatalogFilters,
  ActionResult,
  PaginatedResponse,
  BookSearchResult,
} from '../../types/biblioteca';
import { getGoogleBookById } from './googleBooks';

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) {
    console.error('isAdmin check error:', error);
    return false;
  }
  return data || false;
}

// Normalize date to YYYY-MM-DD format for PostgreSQL DATE type
function normalizePublishedDate(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;

  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // If only year (YYYY), convert to YYYY-01-01
  if (/^\d{4}$/.test(dateStr)) return `${dateStr}-01-01`;

  // Try to parse and format
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().split('T')[0];
  } catch {
    return undefined;
  }
}

// Add book to catalog (Admin only)
export async function addBookToCatalog(
  input: AddBookToCatalogInput
): Promise<ActionResult<BookCatalog>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  // Check for duplicate
  if (input.google_books_id) {
    const { data: existing } = await supabase
      .from('book_catalog')
      .select('id')
      .eq('google_books_id', input.google_books_id)
      .single();

    if (existing) {
      return { success: false, error: 'Este livro já está no catálogo', code: 'DUPLICATE' };
    }
  }

  // Normalize published_date to valid PostgreSQL DATE format
  const normalizedInput = {
    ...input,
    published_date: normalizePublishedDate(input.published_date),
  };

  const { data, error } = await supabase
    .from('book_catalog')
    .insert({
      ...normalizedInput,
      added_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Add book error:', error);
    return { success: false, error: 'Falha ao adicionar livro', code: 'INSERT_ERROR' };
  }

  return { success: true, data: data as BookCatalog };
}

// Add book from search result (Admin only)
export async function addBookFromSearch(
  searchResult: BookSearchResult
): Promise<ActionResult<BookCatalog>> {
  return addBookToCatalog({
    google_books_id: searchResult.source === 'google' ? searchResult.externalId : undefined,
    open_library_key: searchResult.source === 'openLibrary' ? searchResult.externalId : undefined,
    isbn13: searchResult.isbn13,
    isbn10: searchResult.isbn10,
    title: searchResult.title,
    subtitle: searchResult.subtitle,
    author_name: searchResult.authors.join(', '),
    description: searchResult.description,
    publisher: searchResult.publisher,
    published_date: searchResult.publishedDate,
    page_count: searchResult.pageCount,
    language: searchResult.language || 'pt',
    categories: searchResult.categories,
    cover_url: searchResult.coverUrl,
    thumbnail_url: searchResult.thumbnailUrl,
  });
}

// Get catalog books with filters
export async function getCatalogBooks(
  filters: CatalogFilters = {}
): Promise<ActionResult<PaginatedResponse<BookCatalogView>>> {
  const {
    search,
    category,
    has_summary,
    language,
    limit = 20,
    offset = 0,
    orderBy = 'created_at',
    orderDir = 'desc',
  } = filters;

  let query = supabase
    .from('catalog_view')
    .select('*', { count: 'exact' });

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,author_name.ilike.%${search}%`);
  }

  if (category) {
    query = query.contains('categories', [category]);
  }

  if (has_summary !== undefined) {
    query = query.eq('has_published_summary', has_summary);
  }

  if (language) {
    query = query.eq('language', language);
  }

  // Apply ordering
  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Get catalog error:', error);
    console.error('Get catalog error details:', JSON.stringify(error, null, 2));
    console.error('Query details:', { search, category, has_summary, language, limit, offset });
    return { success: false, error: `Falha ao carregar catálogo: ${error.message}`, code: 'QUERY_ERROR' };
  }

  console.log('getCatalogBooks result:', { dataLength: data?.length, count, search, category });

  const total = count || 0;
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data: {
      data: (data || []) as BookCatalogView[],
      total,
      page,
      pageSize: limit,
      totalPages,
    },
  };
}

// Get single book by ID
export async function getCatalogBook(
  catalogId: string
): Promise<ActionResult<BookCatalogView | null>> {
  const { data, error } = await supabase
    .from('catalog_view')
    .select('*')
    .eq('id', catalogId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get book error:', error);
    return { success: false, error: 'Falha ao carregar livro', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data as BookCatalogView };
}

// Get catalog books by category
export async function getCatalogByCategory(
  category: string,
  limit: number = 10
): Promise<ActionResult<BookCatalogView[]>> {
  const { data, error } = await supabase
    .from('catalog_view')
    .select('*')
    .contains('categories', [category])
    .order('favorites_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get by category error:', error);
    return { success: false, error: 'Falha ao carregar livros', code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data || []) as BookCatalogView[] };
}

// Get popular books
export async function getPopularBooks(
  limit: number = 10
): Promise<ActionResult<BookCatalogView[]>> {
  const { data, error } = await supabase
    .from('catalog_view')
    .select('*')
    .order('favorites_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get popular error:', error);
    return { success: false, error: 'Falha ao carregar livros', code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data || []) as BookCatalogView[] };
}

// Get books with summaries
export async function getBooksWithSummaries(
  limit: number = 10
): Promise<ActionResult<BookCatalogView[]>> {
  const { data, error } = await supabase
    .from('catalog_view')
    .select('*')
    .eq('has_published_summary', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get with summaries error:', error);
    return { success: false, error: 'Falha ao carregar livros', code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data || []) as BookCatalogView[] };
}

// Delete book from catalog (Admin only)
export async function deleteBookFromCatalog(
  catalogId: string
): Promise<ActionResult<void>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { error } = await supabase
    .from('book_catalog')
    .delete()
    .eq('id', catalogId);

  if (error) {
    console.error('Delete book error:', error);
    return { success: false, error: 'Falha ao excluir livro', code: 'DELETE_ERROR' };
  }

  return { success: true };
}

// Update book in catalog (Admin only)
export async function updateCatalogBook(
  catalogId: string,
  updates: Partial<AddBookToCatalogInput>
): Promise<ActionResult<BookCatalog>> {
  const admin = await isAdmin();
  if (!admin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { data, error } = await supabase
    .from('book_catalog')
    .update(updates)
    .eq('id', catalogId)
    .select()
    .single();

  if (error) {
    console.error('Update book error:', error);
    return { success: false, error: 'Falha ao atualizar livro', code: 'UPDATE_ERROR' };
  }

  return { success: true, data: data as BookCatalog };
}
