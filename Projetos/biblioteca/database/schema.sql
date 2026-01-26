-- ===========================================================================
-- Bibliotheca Database Schema - Supabase
-- ===========================================================================
-- This script creates all necessary tables for the Bibliotheca library
-- management system in Supabase PostgreSQL database.
-- ===========================================================================

-- Drop existing tables if needed (for clean slate)
-- DROP TABLE IF EXISTS reading_progress CASCADE;
-- DROP TABLE IF EXISTS loans CASCADE;
-- DROP TABLE IF EXISTS books CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ===================================
-- TABLES
-- ===================================

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  isbn TEXT,
  category TEXT,
  status TEXT CHECK (status IN ('reading', 'available', 'loaned', 'overdue')) DEFAULT 'available',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table  
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  member_since TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loans table
CREATE TABLE IF NOT EXISTS loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  person_initials TEXT NOT NULL,
  loan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'returned', 'archived')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reading Progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, user_id)
);

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - can be restricted later with auth)
CREATE POLICY "Enable all operations for books" ON books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for loans" ON loans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for reading_progress" ON reading_progress FOR ALL USING (true) WITH CHECK (true);

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_loans_book_id ON loans(book_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_reading_progress_book_id ON reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);

-- ===================================
-- STORAGE BUCKET (Run separately in Supabase Dashboard)
-- ===================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket: "biblioteca-covers"
-- 3. Set to Public
-- 4. Set size limit: 5MB
-- 5. Allowed MIME types: image/jpeg, image/png, image/webp

-- ===================================
-- NOTES
-- ===================================
-- After running this script:
-- 1. Verify tables were created in Supabase Table Editor
-- 2. Create the storage bucket manually in Dashboard
-- 3. Run the seed data script to populate initial books
