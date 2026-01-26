import { supabase, type Book, type NewBook, type BookUpdate } from '../lib/supabase';

export const bookService = {
    /**
     * Fetch all books with optional filters
     */
    async getBooks(filters?: { category?: string; status?: string; search?: string }) {
        try {
            let query = supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters?.category) {
                query = query.eq('category', filters.category);
            }

            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            if (filters?.search) {
                query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data as Book[];
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    },

    /**
     * Get books currently being read
     */
    async getReadingNow() {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('status', 'reading')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data as Book[];
        } catch (error) {
            console.error('Error fetching reading now books:', error);
            throw error;
        }
    },

    /**
     * Get recently added books
     */
    async getRecentlyAdded(limit: number = 5) {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data as Book[];
        } catch (error) {
            console.error('Error fetching recently added books:', error);
            throw error;
        }
    },

    /**
     * Get books by category
     */
    async getBooksByCategory(category: string) {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('category', category)
                .order('title', { ascending: true });

            if (error) throw error;
            return data as Book[];
        } catch (error) {
            console.error('Error fetching books by category:', error);
            throw error;
        }
    },

    /**
     * Get single book by ID
     */
    async getBook(id: string) {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Book;
        } catch (error) {
            console.error(`Error fetching book ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create new book
     */
    async createBook(book: NewBook) {
        try {
            const { data, error } = await supabase
                .from('books')
                .insert([book])
                .select()
                .single();

            if (error) throw error;
            return data as Book;
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    },

    /**
     * Update book
     */
    async updateBook(id: string, updates: BookUpdate) {
        try {
            const { data, error } = await supabase
                .from('books')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as Book;
        } catch (error) {
            console.error(`Error updating book ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete book
     */
    async deleteBook(id: string) {
        try {
            const { error } = await supabase.from('books').delete().eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error(`Error deleting book ${id}:`, error);
            throw error;
        }
    },

    /**
     * Upload book cover image
     */
    async uploadCover(bookId: string, file: File) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${bookId}.${fileExt}`;
            const filePath = `covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('biblioteca-covers')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage.from('biblioteca-covers').getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading cover:', error);
            throw error;
        }
    },

    /**
     * Get all unique categories
     */
    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('category')
                .not('category', 'is', null);

            if (error) throw error;

            // Get unique categories
            const categories = [...new Set(data.map((book) => book.category))].filter(Boolean);
            return categories as string[];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Get statistics
     */
    async getStats() {
        try {
            const { data: allBooks, error } = await supabase.from('books').select('status');

            if (error) throw error;

            const stats = {
                total: allBooks.length,
                reading: allBooks.filter((b) => b.status === 'reading').length,
                available: allBooks.filter((b) => b.status === 'available').length,
                loaned: allBooks.filter((b) => b.status === 'loaned').length,
                overdue: allBooks.filter((b) => b.status === 'overdue').length,
            };

            return stats;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    },
};
