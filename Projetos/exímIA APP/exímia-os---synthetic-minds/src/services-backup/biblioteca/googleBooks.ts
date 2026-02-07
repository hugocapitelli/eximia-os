// Google Books API Integration
// EXIMIA-102

import type {
  BookSearchResult,
  GoogleBooksVolume,
  GoogleBooksSearchResponse
} from '../../types/biblioteca';

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_API_BASE = 'https://openlibrary.org';

// Cache for search results
const searchCache = new Map<string, { data: BookSearchResult[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Retry configuration for rate limiting
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 second

async function fetchWithRetry(
  url: string,
  maxRetries: number = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);

      // If rate limited and not last attempt, wait and retry
      if (response.status === 429 && attempt < maxRetries) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt); // Exponential backoff
        console.warn(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = INITIAL_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to fetch after max retries');
}

function mapGoogleBookToSearchResult(volume: GoogleBooksVolume): BookSearchResult {
  const { volumeInfo } = volume;
  const identifiers = volumeInfo.industryIdentifiers || [];

  const isbn13 = identifiers.find(i => i.type === 'ISBN_13')?.identifier;
  const isbn10 = identifiers.find(i => i.type === 'ISBN_10')?.identifier;

  // Get best cover image available
  const imageLinks = volumeInfo.imageLinks || {};
  const coverUrl = imageLinks.large || imageLinks.medium || imageLinks.small ||
                   imageLinks.thumbnail?.replace('zoom=1', 'zoom=2');
  const thumbnailUrl = imageLinks.thumbnail || imageLinks.smallThumbnail;

  return {
    externalId: volume.id,
    source: 'google',
    title: volumeInfo.title,
    subtitle: volumeInfo.subtitle,
    authors: volumeInfo.authors || [],
    description: volumeInfo.description,
    coverUrl: coverUrl?.replace('http://', 'https://'),
    thumbnailUrl: thumbnailUrl?.replace('http://', 'https://'),
    isbn10,
    isbn13,
    publisher: volumeInfo.publisher,
    publishedDate: volumeInfo.publishedDate,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    language: volumeInfo.language,
  };
}

export async function searchGoogleBooks(
  query: string,
  options: { maxResults?: number; startIndex?: number; langRestrict?: string } = {}
): Promise<BookSearchResult[]> {
  const { maxResults = 20, startIndex = 0, langRestrict = 'pt' } = options;

  // Check cache
  const cacheKey = `${query}-${maxResults}-${startIndex}-${langRestrict}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const params = new URLSearchParams({
    q: query,
    maxResults: maxResults.toString(),
    startIndex: startIndex.toString(),
    langRestrict,
    orderBy: 'relevance',
  });

  try {
    const response = await fetchWithRetry(`${GOOGLE_BOOKS_API_BASE}?${params}`);

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const data: GoogleBooksSearchResponse = await response.json();
    const results = (data.items || []).map(mapGoogleBookToSearchResult);

    // Cache results
    searchCache.set(cacheKey, { data: results, timestamp: Date.now() });

    return results;
  } catch (error) {
    console.error('Google Books search error:', error);
    // Try fallback to Open Library
    return searchOpenLibrary(query, maxResults);
  }
}

export async function getGoogleBookById(volumeId: string): Promise<BookSearchResult | null> {
  try {
    const response = await fetchWithRetry(`${GOOGLE_BOOKS_API_BASE}/${volumeId}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const volume: GoogleBooksVolume = await response.json();
    return mapGoogleBookToSearchResult(volume);
  } catch (error) {
    console.error('Google Books get by ID error:', error);
    return null;
  }
}

export async function searchOpenLibrary(
  query: string,
  limit: number = 20
): Promise<BookSearchResult[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      fields: 'key,title,author_name,first_publish_year,publisher,isbn,cover_i,number_of_pages_median,subject,language',
    });

    const response = await fetchWithRetry(`${OPEN_LIBRARY_API_BASE}/search.json?${params}`);

    if (!response.ok) {
      throw new Error(`Open Library API error: ${response.status}`);
    }

    const data = await response.json();

    return (data.docs || []).map((doc: any): BookSearchResult => ({
      externalId: doc.key,
      source: 'openLibrary',
      title: doc.title,
      authors: doc.author_name || [],
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : undefined,
      thumbnailUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : undefined,
      isbn13: doc.isbn?.find((i: string) => i.length === 13),
      isbn10: doc.isbn?.find((i: string) => i.length === 10),
      publisher: doc.publisher?.[0],
      publishedDate: doc.first_publish_year?.toString(),
      pageCount: doc.number_of_pages_median,
      categories: doc.subject?.slice(0, 5),
      language: doc.language?.[0],
    }));
  } catch (error) {
    console.error('Open Library search error:', error);
    return [];
  }
}

export function clearSearchCache(): void {
  searchCache.clear();
}

/**
 * Hybrid search - searches Google Books and Open Library in parallel
 * Deduplicates results by ISBN or title+author
 */
export async function hybridBookSearch(
  query: string,
  options: { maxResults?: number } = {}
): Promise<BookSearchResult[]> {
  const { maxResults = 15 } = options;

  // Check cache first
  const cacheKey = `hybrid-${query}-${maxResults}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Search both APIs in parallel
  const [googleResults, openLibraryResults] = await Promise.allSettled([
    searchGoogleBooks(query, { maxResults: maxResults, langRestrict: '' }), // No language restriction for broader results
    searchOpenLibrary(query, maxResults),
  ]);

  const google = googleResults.status === 'fulfilled' ? googleResults.value : [];
  const openLib = openLibraryResults.status === 'fulfilled' ? openLibraryResults.value : [];

  // Combine and deduplicate
  const seen = new Set<string>();
  const combined: BookSearchResult[] = [];

  // Helper to create a unique key for deduplication
  const getKey = (book: BookSearchResult): string => {
    if (book.isbn13) return `isbn13:${book.isbn13}`;
    if (book.isbn10) return `isbn10:${book.isbn10}`;
    // Fallback to normalized title + first author
    const normalizedTitle = book.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const firstAuthor = (book.authors[0] || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `title:${normalizedTitle}-${firstAuthor}`;
  };

  // Add Google results first (usually better metadata)
  for (const book of google) {
    const key = getKey(book);
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(book);
    }
  }

  // Add Open Library results that weren't in Google
  for (const book of openLib) {
    const key = getKey(book);
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(book);
    }
  }

  // Sort by relevance (books with covers first, then by title match)
  const queryLower = query.toLowerCase();
  combined.sort((a, b) => {
    // Prioritize books with covers
    const aCover = a.coverUrl || a.thumbnailUrl ? 1 : 0;
    const bCover = b.coverUrl || b.thumbnailUrl ? 1 : 0;
    if (aCover !== bCover) return bCover - aCover;

    // Then by exact title match
    const aExact = a.title.toLowerCase().includes(queryLower) ? 1 : 0;
    const bExact = b.title.toLowerCase().includes(queryLower) ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    // Then by having description
    const aDesc = a.description ? 1 : 0;
    const bDesc = b.description ? 1 : 0;
    return bDesc - aDesc;
  });

  // Limit results
  const results = combined.slice(0, maxResults * 2); // Allow more results from hybrid

  // Cache results
  searchCache.set(cacheKey, { data: results, timestamp: Date.now() });

  return results;
}
