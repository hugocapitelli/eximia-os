import { supabase, type Loan, type NewLoan, type Book } from '../lib/supabase';
import { bookService } from './bookService';

export const loanService = {
    /**
     * Get all loans with optional status filter
     */
    async getLoans(status?: 'active' | 'returned' | 'archived') {
        try {
            let query = supabase
                .from('loans')
                .select('*')
                .order('loan_date', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Loan[];
        } catch (error) {
            console.error('Error fetching loans:', error);
            throw error;
        }
    },

    /**
     * Get loan history for a specific book
     */
    async getLoanHistoryForBook(bookId: string) {
        try {
            const { data, error } = await supabase
                .from('loans')
                .select('*')
                .eq('book_id', bookId)
                .order('loan_date', { ascending: false });

            if (error) throw error;
            return data as Loan[];
        } catch (error) {
            console.error(`Error fetching loan history for book ${bookId}:`, error);
            throw error;
        }
    },

    /**
     * Get active loans
     */
    async getActiveLoans() {
        try {
            const { data, error } = await supabase
                .from('loans')
                .select('*, books(*)')
                .eq('status', 'active')
                .order('loan_date', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching active loans:', error);
            throw error;
        }
    },

    /**
     * Create new loan and update book status
     */
    async createLoan(loan: NewLoan) {
        try {
            // Create the loan
            const { data: loanData, error: loanError } = await supabase
                .from('loans')
                .insert([loan])
                .select()
                .single();

            if (loanError) throw loanError;

            // Update book status to 'loaned'
            await bookService.updateBook(loan.book_id, { status: 'loaned' });

            return loanData as Loan;
        } catch (error) {
            console.error('Error creating loan:', error);
            throw error;
        }
    },

    /**
     * Return a book (mark loan as returned)
     */
    async returnLoan(loanId: string, bookId: string) {
        try {
            // Update loan status to returned and set return date
            const { data: loanData, error: loanError } = await supabase
                .from('loans')
                .update({
                    status: 'returned',
                    return_date: new Date().toISOString(),
                })
                .eq('id', loanId)
                .select()
                .single();

            if (loanError) throw loanError;

            // Update book status to 'available'
            await bookService.updateBook(bookId, { status: 'available' });

            return loanData as Loan;
        } catch (error) {
            console.error(`Error returning loan ${loanId}:`, error);
            throw error;
        }
    },

    /**
     * Archive a loan
     */
    async archiveLoan(loanId: string) {
        try {
            const { data, error } = await supabase
                .from('loans')
                .update({ status: 'archived' })
                .eq('id', loanId)
                .select()
                .single();

            if (error) throw error;
            return data as Loan;
        } catch (error) {
            console.error(`Error archiving loan ${loanId}:`, error);
            throw error;
        }
    },

    /**
     * Check for overdue loans and update book status
     */
    async checkOverdueLoans() {
        try {
            const { data: activeLoans, error } = await supabase
                .from('loans')
                .select('*, books(*)')
                .eq('status', 'active')
                .not('due_date', 'is', null);

            if (error) throw error;

            const now = new Date();
            const overdueLoans = activeLoans.filter((loan) => {
                if (!loan.due_date) return false;
                return new Date(loan.due_date) < now;
            });

            // Update book status to 'overdue' for overdue loans
            for (const loan of overdueLoans) {
                await bookService.updateBook(loan.book_id, { status: 'overdue' });
            }

            return overdueLoans.length;
        } catch (error) {
            console.error('Error checking overdue loans:', error);
            throw error;
        }
    },

    /**
     * Get loan statistics
     */
    async getStats() {
        try {
            const { data, error } = await supabase.from('loans').select('status');

            if (error) throw error;

            const stats = {
                total: data.length,
                active: data.filter((l) => l.status === 'active').length,
                returned: data.filter((l) => l.status === 'returned').length,
                archived: data.filter((l) => l.status === 'archived').length,
            };

            return stats;
        } catch (error) {
            console.error('Error fetching loan stats:', error);
            throw error;
        }
    },
};
