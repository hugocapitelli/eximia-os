// Description Fetching Service for Books
// Story 7.4.0: Automatic Description Fetching Service
// Fetches book descriptions from Google Books and OpenLibrary APIs with caching

const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_API_BASE = 'https://openlibrary.org';
const DESCRIPTION_FETCH_TIMEOUT = 5000; // 5 seconds

// Cache for descriptions by ISBN or title+author
interface DescriptionCacheEntry {
  description: string | null;
  timestamp: number;
  source?: 'google' | 'openlibrary';
}

const descriptionCache = new Map<string, DescriptionCacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Retry configuration
const MAX_RETRIES = 2;
const INITIAL_DELAY = 500; // 500ms

/**
 * Generates cache key from ISBN or title+author
 */
function generateCacheKey(title: string, author: string, isbn?: string): string {
  if (isbn) {
    return `isbn:${isbn}`;
  }
  // Normalize title and author for cache key
  const normalizedTitle = title.toLowerCase().trim();
  const normalizedAuthor = author.toLowerCase().trim();
  return `title-author:${normalizedTitle}:${normalizedAuthor}`;
}

/**
 * Fetch with timeout and retry support for description fetching
 */
async function fetchWithTimeout(
  url: string,
  timeout: number = DESCRIPTION_FETCH_TIMEOUT
): Promise<Response | null> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, { signal: controller.signal });

        clearTimeout(timeoutId);

        // Handle rate limiting with exponential backoff
        if (response.status === 429 && attempt < MAX_RETRIES) {
          const delay = INITIAL_DELAY * Math.pow(2, attempt);
          console.warn(`[DescriptionService] Rate limited on attempt ${attempt + 1}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn(`[DescriptionService] Fetch timeout after ${timeout}ms on attempt ${attempt + 1}`);
          lastError = new Error(`Fetch timeout after ${timeout}ms`);
        } else {
          lastError = error instanceof Error ? error : new Error(String(error));
        }

        if (attempt < MAX_RETRIES) {
          const delay = INITIAL_DELAY * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  return null;
}

/**
 * Fetch description from Google Books API
 */
async function fetchFromGoogleBooks(title: string, author: string): Promise<string | null> {
  try {
    console.log(`[DescriptionService] Fetching from Google Books: "${title}" by ${author}`);

    const query = `${title} ${author}`;
    const params = new URLSearchParams({
      q: query,
      maxResults: '1',
      fields: 'items/volumeInfo/description',
    });

    const response = await fetchWithTimeout(`${GOOGLE_BOOKS_API_BASE}?${params}`);

    if (!response) {
      console.log(`[DescriptionService] Google Books fetch timed out or failed`);
      return null;
    }

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[DescriptionService] Book not found on Google Books`);
        return null;
      }
      console.warn(`[DescriptionService] Google Books API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const description = data.items?.[0]?.volumeInfo?.description;

    if (description) {
      console.log(`[DescriptionService] Found description on Google Books (length: ${description.length})`);
      return description;
    }

    return null;
  } catch (error) {
    console.error(`[DescriptionService] Error fetching from Google Books:`, error);
    return null;
  }
}

/**
 * Fetch description from OpenLibrary API
 */
async function fetchFromOpenLibrary(title: string, author: string): Promise<string | null> {
  try {
    console.log(`[DescriptionService] Fetching from OpenLibrary: "${title}" by ${author}`);

    const query = `${title} ${author}`;
    const params = new URLSearchParams({
      q: query,
      limit: '1',
      fields: 'key,title,author_name,first_publish_year,publisher,description',
    });

    const response = await fetchWithTimeout(`${OPEN_LIBRARY_API_BASE}/search.json?${params}`);

    if (!response) {
      console.log(`[DescriptionService] OpenLibrary fetch timed out or failed`);
      return null;
    }

    if (!response.ok) {
      console.warn(`[DescriptionService] OpenLibrary API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const doc = data.docs?.[0];

    if (!doc) {
      console.log(`[DescriptionService] Book not found on OpenLibrary`);
      return null;
    }

    // OpenLibrary may have description or needs fallback to detailed fetch
    let description = doc.description;

    // If description is an object with "value", extract it
    if (typeof description === 'object' && description?.value) {
      description = description.value;
    }

    if (description && typeof description === 'string') {
      console.log(`[DescriptionService] Found description on OpenLibrary (length: ${description.length})`);
      return description;
    }

    // Try fetching detailed work information if available
    if (doc.key) {
      return await fetchOpenLibraryDetails(doc.key);
    }

    return null;
  } catch (error) {
    console.error(`[DescriptionService] Error fetching from OpenLibrary:`, error);
    return null;
  }
}

/**
 * Fetch detailed description from OpenLibrary work endpoint
 */
async function fetchOpenLibraryDetails(workKey: string): Promise<string | null> {
  try {
    const response = await fetchWithTimeout(`${OPEN_LIBRARY_API_BASE}${workKey}.json`);

    if (!response || !response.ok) {
      return null;
    }

    const data = await response.json();
    let description = data.description;

    if (typeof description === 'object' && description?.value) {
      description = description.value;
    }

    if (description && typeof description === 'string') {
      console.log(`[DescriptionService] Found detailed description on OpenLibrary (length: ${description.length})`);
      return description;
    }

    return null;
  } catch (error) {
    console.error(`[DescriptionService] Error fetching OpenLibrary details:`, error);
    return null;
  }
}

/**
 * Get book description with caching and fallback
 *
 * @param title - Book title
 * @param author - Book author
 * @param isbn - Optional ISBN for better caching
 * @returns Description text or null if not found
 */
export async function getBookDescription(
  title: string,
  author: string,
  isbn?: string
): Promise<string | null> {
  // Validate inputs
  if (!title || !author) {
    console.warn(`[DescriptionService] Missing title or author for description fetch`);
    return null;
  }

  // Check cache first
  const cacheKey = generateCacheKey(title, author, isbn);
  const cached = descriptionCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[DescriptionService] Cache hit for: "${title}" by ${author}`);
    return cached.description;
  }

  // Try Google Books first
  let description = await fetchFromGoogleBooks(title, author);

  // Fallback to OpenLibrary if Google Books fails
  if (!description) {
    description = await fetchFromOpenLibrary(title, author);
  }

  // Cache the result (even if null)
  descriptionCache.set(cacheKey, {
    description,
    timestamp: Date.now(),
    source: description ? 'google' : 'openlibrary',
  });

  if (!description) {
    console.log(`[DescriptionService] No description found for: "${title}" by ${author}`);
  }

  return description;
}

/**
 * Clear description cache
 */
export function clearDescriptionCache(): void {
  console.log(`[DescriptionService] Clearing description cache`);
  descriptionCache.clear();
}

/**
 * Get cache statistics
 */
export function getDescriptionCacheStats(): { size: number; entries: Array<{ key: string; age: number }> } {
  const entries = Array.from(descriptionCache.entries()).map(([key, entry]) => ({
    key,
    age: Date.now() - entry.timestamp,
  }));

  return {
    size: descriptionCache.size,
    entries,
  };
}

/**
 * Remove expired cache entries
 */
export function cleanExpiredDescriptionCache(): number {
  let removed = 0;
  const now = Date.now();

  for (const [key, entry] of descriptionCache.entries()) {
    if (now - entry.timestamp >= CACHE_TTL) {
      descriptionCache.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    console.log(`[DescriptionService] Cleaned ${removed} expired cache entries`);
  }

  return removed;
}

/**
 * Warm up cache with a list of books
 */
export async function warmDescriptionCache(books: Array<{ title: string; author: string; isbn?: string }>): Promise<number> {
  console.log(`[DescriptionService] Warming cache with ${books.length} books...`);

  let successCount = 0;

  for (const book of books) {
    const description = await getBookDescription(book.title, book.author, book.isbn);
    if (description) {
      successCount++;
    }
    // Add small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`[DescriptionService] Cache warming complete: ${successCount}/${books.length} descriptions loaded`);
  return successCount;
}
