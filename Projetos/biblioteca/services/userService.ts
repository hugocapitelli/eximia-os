import { supabase, type User, type NewUser } from '../lib/supabase';

export const userService = {
    /**
     * Get user profile by ID
     */
    async getUser(userId: string) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data as User;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Get user by email
     */
    async getUserByEmail(email: string) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) throw error;
            return data as User;
        } catch (error) {
            console.error(`Error fetching user by email ${email}:`, error);
            throw error;
        }
    },

    /**
     * Create new user
     */
    async createUser(user: NewUser) {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([user])
                .select()
                .single();

            if (error) throw error;
            return data as User;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    /**
     * Update user profile
     */
    async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'created_at'>>) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data as User;
        } catch (error) {
            console.error(`Error updating user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Get user reading statistics
     */
    async getUserStats(userId: string) {
        try {
            // Get total books read (from reading_progress where progress = 100)
            const { data: completedBooks, error: progressError } = await supabase
                .from('reading_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('progress_percentage', 100);

            if (progressError) throw progressError;

            // Get currently reading books
            const { data: readingNow, error: readingError } = await supabase
                .from('reading_progress')
                .select('*')
                .eq('user_id', userId)
                .gt('progress_percentage', 0)
                .lt('progress_percentage', 100);

            if (readingError) throw readingError;

            // Calculate average reading time (placeholder - would need loan data)
            const stats = {
                booksRead: completedBooks?.length || 0,
                readingNow: readingNow?.length || 0,
                avgTime: '18 dias', // Placeholder - would calculate from loan history
            };

            return stats;
        } catch (error) {
            console.error(`Error fetching stats for user ${userId}:`, error);
            throw error;
        }
    },
};
