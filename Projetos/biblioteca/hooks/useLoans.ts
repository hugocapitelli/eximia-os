import { useState, useEffect } from 'react';
import { loanService } from '../services/loanService';
import type { Loan } from '../lib/supabase';

export function useLoans(status?: 'active' | 'returned' | 'archived') {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await loanService.getLoans(status);
            setLoans(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching loans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, [status]);

    const refresh = () => fetchLoans();

    return { loans, loading, error, refresh };
}

export function useLoanHistory(bookId: string | undefined) {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!bookId) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                setLoading(true);
                const data = await loanService.getLoanHistoryForBook(bookId);
                setLoans(data);
            } catch (err) {
                setError(err as Error);
                console.error(`Error fetching loan history for book ${bookId}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [bookId]);

    return { loans, loading, error };
}

export function useActiveLoans() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchActiveLoans = async () => {
        try {
            setLoading(true);
            const data = await loanService.getActiveLoans();
            setLoans(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching active loans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveLoans();
    }, []);

    const refresh = () => fetchActiveLoans();

    return { loans, loading, error, refresh };
}
