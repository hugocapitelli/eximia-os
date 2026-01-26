// Google Books API integration
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        industryIdentifiers?: Array<{
            type: string;
            identifier: string;
        }>;
        categories?: string[];
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
        };
    };
}

export interface BookSearchResult {
    title: string;
    author: string;
    publisher?: string;
    publishedYear?: string;
    description?: string;
    isbn?: string;
    category?: string;
    coverUrl?: string;
    googleBooksId?: string;
}

/**
 * Search books using Google Books API
 * @param query - Search query (title, author, or ISBN)
 * @param maxResults - Maximum number of results to return (default: 10)
 */
export async function search Books(query: string, maxResults: number = 10): Promise < BookSearchResult[] > {
    if(!query.trim()) {
    return [];
}

try {
    const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Google Books API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        return [];
    }

    return data.items.map((item: GoogleBook) => convertGoogleBookToResult(item));
} catch (error) {
    console.error('Error searching books:', error);
    throw error;
}
}

/**
 * Search book by ISBN
 * @param isbn - ISBN-10 or ISBN-13
 */
export async function searchBookByISBN(isbn: string): Promise<BookSearchResult | null> {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const results = await searchBooks(`isbn:${cleanISBN}`, 1);
    return results.length > 0 ? results[0] : null;
}

/**
 * Convert Google Books API response to our format
 */
function convertGoogleBookToResult(googleBook: GoogleBook): BookSearchResult {
    const { volumeInfo } = googleBook;

    // Get ISBN
    const isbn13 = volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13');
    const isbn10 = volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_10');
    const isbn = isbn13?.identifier || isbn10?.identifier;

    // Get cover image (prefer larger thumbnail)
    const coverUrl = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;

    // Get published year
    const publishedYear = volumeInfo.publishedDate?.split('-')[0];

    // Get category (first one if multiple)
    const category = volumeInfo.categories?.[0];

    return {
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors?.join(', ') || 'Unknown Author',
        publisher: volumeInfo.publisher,
        publishedYear,
        description: volumeInfo.description,
        isbn,
        category,
        coverUrl: coverUrl?.replace('http:', 'https:'), // Use HTTPS
        googleBooksId: googleBook.id,
    };
}

/**
 * Get detailed book information by Google Books ID
 */
export async function getBookDetails(googleBooksId: string): Promise<BookSearchResult | null> {
    try {
        const url = `${GOOGLE_BOOKS_API}/${googleBooksId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Books API error: ${response.statusText}`);
        }

        const googleBook: GoogleBook = await response.json();
        return convertGoogleBookToResult(googleBook);
    } catch (error) {
        console.error('Error getting book details:', error);
        return null;
    }
}
