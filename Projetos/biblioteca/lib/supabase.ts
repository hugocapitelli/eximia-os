import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ===================================
// DATABASE TYPES
// ===================================

export type Book = {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  isbn: string | null;
  category: string | null;
  status: 'reading' | 'available' | 'loaned' | 'overdue';
  rating: number | null;
  added_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Loan = {
  id: string;
  book_id: string;
  person_name: string;
  person_initials: string;
  loan_date: string;
  due_date: string | null;
  return_date: string | null;
  status: 'active' | 'returned' | 'archived';
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  member_since: string;
  created_at: string;
};

export type ReadingProgress = {
  id: string;
  book_id: string;
  user_id: string;
  progress_percentage: number;
  last_updated: string;
};

// ===================================
// HELPER TYPES FOR FORMS
// ===================================

export type NewBook = Omit<Book, 'id' | 'created_at' | 'updated_at'>;
export type  BookUpdate = Partial<Omit<Book, 'id' | 'created_at' | 'updated_at'>>;
export type NewLoan = Omit<Loan, 'id' | 'created_at' | 'loan_date'>;
export type NewUser = Omit<User, 'id' | 'created_at'>;
