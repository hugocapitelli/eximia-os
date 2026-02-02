<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# exímIA OS - Synthetic Minds Platform

A comprehensive learning platform with **Academy** (courses & learning paths) and **Biblioteca** (personal library management) modules, powered by React, Vite, and Supabase.

## 🚀 Features

### 🎓 Academy Module
- **Course Catalog**: Browse and enroll in courses
- **Learning Paths**: Follow curated tracks
- **Progress Tracking**: Monitor your learning journey
- **Socratic AI**: Interactive learning assistant
- **Achievements**: Gamification and rewards
- **Quiz System**: Test your knowledge

### 📚 Biblioteca Module
- **Personal Library**: Manage your book collection
- **Reading Progress**: Track pages and completion
- **Notes & Highlights**: Capture insights as you read
- **Reading Goals**: Set and achieve yearly targets
- **Book Ratings**: Rate and review your reads
- **Authors Database**: Connect with author profiles

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: TailwindCSS (coming soon)
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- Supabase account (free tier available)

## 🔧 Installation

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

Follow the complete setup guide in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

Quick summary:
1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env.local`
3. Add your Supabase credentials to `.env.local`
4. Apply database migrations (see [supabase/README.md](./supabase/README.md))

### 3. Run Locally

```bash
npm run dev
```

Visit: http://localhost:5173

## 📁 Project Structure

```
exímia-os---synthetic-minds/
├── src/
│   ├── lib/
│   │   └── supabase/           # Supabase client & types
│   ├── hooks/                  # React hooks
│   │   ├── useAuth.ts          # Authentication
│   │   ├── useAcademy.ts       # Academy operations
│   │   └── useBiblioteca.ts    # Biblioteca operations
│   ├── examples/               # Usage examples
│   │   └── SupabaseExamples.tsx
│   └── ...
├── supabase/
│   ├── migrations/             # Database migrations
│   │   ├── 000_profiles_table.sql
│   │   ├── 001_academy_schema.sql
│   │   ├── 002_biblioteca_schema.sql
│   │   └── 003_rls_policies.sql
│   └── README.md               # Migration guide
├── .env.example                # Environment variables template
├── SUPABASE_SETUP.md           # Complete setup guide
└── package.json
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **Never commit `.env.local` to git!**

## 📚 Usage Examples

### Authentication

```typescript
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, signIn, signUp, signOut } = useAuth()

  // Sign up new user
  await signUp('user@example.com', 'password', 'John Doe')

  // Sign in
  await signIn('user@example.com', 'password')

  // Sign out
  await signOut()
}
```

### Academy

```typescript
import { useAcademy } from './hooks/useAcademy'

function CoursesPage() {
  const { getCourses, enrollCourse } = useAcademy()

  // List all courses
  const { data: courses } = await getCourses()

  // Enroll in a course
  await enrollCourse(courseId)
}
```

### Biblioteca

```typescript
import { useBiblioteca } from './hooks/useBiblioteca'

function LibraryPage() {
  const { addBook, getBooks, updateProgress } = useBiblioteca()

  // Add a book
  await addBook({
    title: 'Clean Code',
    author_name: 'Robert C. Martin',
    total_pages: 464,
    status: 'reading'
  })

  // Update reading progress
  await updateProgress(bookId, 150, 464)
}
```

See complete examples in [src/examples/SupabaseExamples.tsx](./src/examples/SupabaseExamples.tsx)

## 🗄️ Database Schema

The platform uses 3 PostgreSQL schemas:

### `public` schema
- **profiles**: User profiles with RBAC (user, admin, moderator)

### `academy` schema (10 tables)
- courses, modules, lessons
- enrollments, lesson_progress
- tracks, track_courses
- socratic_sessions
- achievements, user_achievements

### `biblioteca` schema (5 tables)
- authors, books
- reading_progress, notes
- reading_goals

All tables have Row-Level Security (RLS) enabled for data protection.

## 🔒 Security

- **RLS Policies**: All tables protected with Row-Level Security
- **User Isolation**: Users can only access their own data
- **Admin Access**: Admins have full access to manage content
- **JWT Authentication**: Secure token-based authentication via Supabase

## 📖 Documentation

- [Complete Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Database Migrations Guide](./supabase/README.md)
- [Usage Examples](./src/examples/SupabaseExamples.tsx)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Works with any static hosting provider:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Railway

## 🛠️ Development

### Generate TypeScript Types

After applying migrations, generate types:

```bash
npm run supabase:types
```

### Testing

```bash
npm test  # (coming soon)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

Private project - All rights reserved

## 🆘 Support

For issues or questions:
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup help
2. Review [Troubleshooting section](./SUPABASE_SETUP.md#-troubleshooting)
3. Open an issue in the repository

---

**Built with ❤️ for exímIA Ventures** | Backend Implementation Phase 1 Complete
