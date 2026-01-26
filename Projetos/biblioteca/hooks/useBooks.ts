import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import type { Book } from '../lib/supabase';

export function useBooks(filters?: { category?: string; status?: string; search?: string }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await bookService.getBooks(filters);
            setBooks(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [filters?.category, filters?.status, filters?.search]);

    const refresh = () => fetchBooks();

    return { books, loading, error, refresh };
}

export function useReadingNow() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchReadingNow = async () => {
            try {
                setLoading(true);
                const data = await bookService.getReadingNow();
                setBooks(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching reading now books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReadingNow();
    }, []);

    return { books, loading, error };
}

export function useRecentlyAdded(limit: number = 5) {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchRecentlyAdded = async () => {
            try {
                setLoading(true);
                const data = await bookService.getRecentlyAdded(limit);
                setBooks(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching recently added books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentlyAdded();
    }, [limit]);

    return { books, loading, error };
}

export function useBook(id: string | undefined) {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                setLoading(true);
                const data = await bookService.getBook(id);
                setBook(data);
            } catch (err) {
                setError(err as Error);
                console.error(`Error fetching book ${id}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    return { book, loading, error };
}

export function useCategories() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await bookService.getCategories();
                setCategories(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}
