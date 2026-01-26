# Bibliotheca Database Setup

This directory contains all database-related files for the Bibliotheca project using Supabase.

## Files

- **`schema.sql`** - Complete database schema with tables, indexes, and RLS policies
- **`seed.js`** - Script to populate the database with initial book data

## Setup Instructions

### 1. Create Tables in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/yqotaltivycqcdjapeok
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `schema.sql` and paste it into the editor
5. Click **Run** to execute the script

This will create:
- `books` table
- `users` table
- `loans` table
- `reading_progress` table
- Row Level Security policies
- Performance indexes

### 2. Create Storage Bucket

1. Go to **Storage** in the Supabase dashboard
2. Click **New bucket**
3. Set bucket name: `biblioteca-covers`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**
6. Click on the bucket, then go to **Policies**
7. Add a policy to allow public read access:
   - Policy name: "Public Access"
   - SELECT operation: `true`

### 3. Seed Initial Data

After creating the tables and bucket, run the seed script to populate your database:

```bash
# Install dotenv if not already installed
npm install dotenv

# Run the seed script
node database/seed.js
```

This will:
- Create a user profile for "Hugo Capitelli"
- Insert ~20 sample books across different categories
- Create reading progress for books with "reading" status
- Create active loans for books with "loaned" status

### 4. Verify Setup

Check that everything was created correctly:

1. **Tables**: Go to Table Editor and verify all 4 tables exist
2. **Data**: Check that books and users tables have data
3. **Storage**: Verify the `biblioteca-covers` bucket exists

## Database Schema Overview

### Books
- Stores all books in the library
- Fields: title, author, cover_url, isbn, category, status, rating, notes

### Users
- User profiles
- Fields: name, email, avatar_url, member_since

### Loans
- Tracks book loans to people
- Fields: book_id, person_name, person_initials, loan_date, return_date, status

### Reading Progress
- Tracks reading progress for each user/book combination
- Fields: book_id, user_id, progress_percentage, last_updated

## Supabase Connection

The app connects to Supabase using environment variables in `.env.local`:

```bash
VITE_SUPABASE_URL=https://yqotaltivycqcdjapeok.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These credentials are already configured in your `.env.local` file.

## Next Steps

After setting up the database:

1. Run `npm install` to ensure @supabase/supabase-js is installed
2. Run `npm run dev` to start the development server
3. The app will now fetch data from Supabase instead of using static constants

## Troubleshooting

**"relation does not exist" error:**
- Make sure you ran the `schema.sql` script in Supabase SQL Editor

**"bucket not found" error:**
- Create the `biblioteca-covers` storage bucket in Supabase Dashboard

**Seed script fails:**
- Check that environment variables are set in `.env.local`
- Verify Supabase credentials are correct
- Ensure tables were created successfully
