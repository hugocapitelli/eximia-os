import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import type { User } from '../lib/supabase';

// For now, we'll use a hardcoded user ID
// In a real app,  this would come from authentication
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000'; // Will be overridden by actual user from DB

export function useUser(userId?: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);

                // If no userId provided, try to get user by email
                // In a real app, this would use auth context
                const data = await userService.getUserByEmail('hugo@biblioteca.com');
                setUser(data);
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    return { user, loading, error };
}

export function useUserStats(userId?: string) {
    const [stats, setStats] = useState({
        booksRead: 0,
        readingNow: 0,
        avgTime: '0 dias',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                // First get user
                const user = await userService.getUserByEmail('hugo@biblioteca.com');

                if (user) {
                    const data = await userService.getUserStats(user.id);
                    setStats(data);
                }
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching user stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    return { stats, loading, error };
}
