# Backend Architecture: Academy & Library (Journey)

**Version:** 1.0.0
**Author:** Aria (Architect Agent)
**Date:** 2026-01-30
**Status:** Proposed

---

## Executive Summary

Este documento define a arquitetura completa de backend para os módulos **Academy** (cursos e aprendizado Socrático) e **Library** (biblioteca de livros dentro do Journey). A arquitetura utiliza **Next.js Server Actions** como camada de API, **Supabase (PostgreSQL)** como banco de dados, e um sistema de eventos para integração entre módulos.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema](#3-database-schema)
4. [API Layer (Server Actions)](#4-api-layer-server-actions)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [File Storage](#6-file-storage)
7. [Event System](#7-event-system)
8. [Socratic Chat Backend](#8-socratic-chat-backend)
9. [Performance Considerations](#9-performance-considerations)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Security Considerations](#11-security-considerations)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js 15)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Academy   │  │   Library   │  │   Journey   │  │   Shared Components │ │
│  │   Pages     │  │   Pages     │  │   Pages     │  │   (UI Components)   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
└─────────┼────────────────┼────────────────┼─────────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SERVER ACTIONS LAYER                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ lib/actions/    │  │ lib/actions/    │  │ lib/actions/    │              │
│  │ academy/        │  │ books/          │  │ journey/        │              │
│  │  - courses.ts   │  │  - books.ts     │  │  - goals.ts     │              │
│  │  - enrollments  │  │  - notes.ts     │  │  - habits.ts    │              │
│  │  - progress.ts  │  │  - quotes.ts    │  │  - dashboard.ts │              │
│  │  - socratic.ts  │  │  - stats.ts     │  │                 │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
└───────────┼─────────────────────┼─────────────────────┼──────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                        PostgreSQL Database                               ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                ││
│  │  │  Academy      │  │  Library      │  │  Journey      │                ││
│  │  │  - courses    │  │  - books      │  │  - goals      │                ││
│  │  │  - modules    │  │  - book_notes │  │  - key_results│                ││
│  │  │  - lessons    │  │  - reading_   │  │  - habits     │                ││
│  │  │  - enrollments│  │    goals      │  │  - habit_logs │                ││
│  │  │  - progress   │  │               │  │               │                ││
│  │  │  - socratic   │  │               │  │               │                ││
│  │  └───────────────┘  └───────────────┘  └───────────────┘                ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Supabase      │  │   Supabase      │  │   Row Level     │              │
│  │   Auth          │  │   Storage       │  │   Security      │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVENT SYSTEM (Future)                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Supabase Realtime / Database Triggers                                  ││
│  │  - academy.course.completed → Journey (skill unlock)                    ││
│  │  - journey.book.completed → Brand (expertise)                           ││
│  │  - journey.goal.created → Academy (course suggestions)                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **API Pattern** | Next.js Server Actions | Type-safe, no API route boilerplate, automatic revalidation |
| **Database** | Supabase (PostgreSQL) | Managed, realtime subscriptions, built-in auth, RLS |
| **ORM** | None (Supabase Client) | Direct queries with PostgREST, typed with generated types |
| **Auth** | Supabase Auth | JWT-based, social logins, magic links supported |
| **File Storage** | Supabase Storage | Integrated with auth, CDN-backed, policy-based access |
| **Caching** | Next.js ISR + Supabase | `revalidatePath()` for on-demand, ISR for static pages |
| **Realtime** | Supabase Realtime | WebSocket subscriptions for chat, progress updates |

---

## 2. Technology Stack

### 2.1 Core Stack

```yaml
Runtime:
  - Next.js: 15.1.0
  - React: 19.0.0
  - TypeScript: 5.7.0
  - Node.js: 20.x LTS

Database:
  - Supabase: PostgreSQL 15
  - PostgREST: REST API layer
  - pgvector: (future) AI embeddings

Auth:
  - Supabase Auth: JWT-based
  - Providers: Email, Google, GitHub (configurable)

Storage:
  - Supabase Storage: S3-compatible
  - Buckets: avatars, course-thumbnails, book-covers

AI/LLM (Socratic):
  - Claude API: Anthropic
  - Model: claude-3-5-sonnet (or configurable)
```

### 2.2 Package Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@supabase/ssr": "^0.5.0",
    "next": "15.1.0",
    "react": "19.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "supabase": "^1.200.0"
  }
}
```

---

## 3. Database Schema

### 3.1 Complete ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ACADEMY MODULE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐         │
│  │  courses    │──1:N─│  course_modules  │──1:N─│    lessons      │         │
│  │  ───────    │      │  ──────────────  │      │    ────────     │         │
│  │  id (PK)    │      │  id (PK)         │      │  id (PK)        │         │
│  │  title      │      │  course_id (FK)  │      │  module_id (FK) │         │
│  │  slug       │      │  title           │      │  course_id (FK) │         │
│  │  description│      │  sort_order      │      │  title          │         │
│  │  difficulty │      │                  │      │  type           │         │
│  │  status     │      └──────────────────┘      │  content (JSONB)│         │
│  │  author_id  │                                │  socratic_enabled│        │
│  │  price_cents│      ┌──────────────────┐      └────────┬────────┘         │
│  │  is_free    │      │   enrollments    │               │                  │
│  └──────┬──────┘      │   ───────────    │               │                  │
│         │             │  id (PK)         │               │                  │
│         └─────────────│  user_id (FK)    │               │                  │
│                       │  course_id (FK)  │──────┐        │                  │
│                       │  status          │      │        │                  │
│                       │  progress_percent│      │        │                  │
│                       └──────────────────┘      │        │                  │
│                                                 │        │                  │
│                       ┌──────────────────┐      │        │                  │
│                       │  lesson_progress │◄─────┴────────┘                  │
│                       │  ───────────────  │                                 │
│                       │  id (PK)         │      ┌──────────────────┐        │
│                       │  user_id (FK)    │      │ socratic_sessions│        │
│                       │  lesson_id (FK)  │      │ ─────────────────│        │
│                       │  enrollment_id   │      │  id (PK)         │        │
│                       │  is_completed    │      │  user_id (FK)    │        │
│                       │  watch_time      │      │  lesson_id (FK)  │        │
│                       └──────────────────┘      │  messages (JSONB)│        │
│                                                 └──────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           LIBRARY MODULE (Journey)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐         │
│  │   books     │──1:N─│   book_notes     │      │  reading_goals  │         │
│  │   ─────     │      │   ──────────     │      │  ─────────────  │         │
│  │  id (PK)    │      │  id (PK)         │      │  id (PK)        │         │
│  │  user_id    │      │  book_id (FK)    │      │  user_id (FK)   │         │
│  │  title      │      │  user_id (FK)    │      │  year           │         │
│  │  author     │      │  content         │      │  target_books   │         │
│  │  total_pages│      │  page_number     │      └─────────────────┘         │
│  │  current_page      │  type (note/quote)                                  │
│  │  status     │      └──────────────────┘                                  │
│  │  cover_url  │                                                            │
│  │  rating     │      ┌──────────────────┐                                  │
│  │  tags[]     │      │   authors        │   (Future: Mind integration)     │
│  └─────────────┘      │   ───────        │                                  │
│                       │  id (PK)         │                                  │
│                       │  name            │                                  │
│                       │  mind_id (FK)    │   ← Link to Minds module         │
│                       └──────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           JOURNEY MODULE (Core)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐      ┌──────────────────┐                                  │
│  │   goals     │──1:N─│   key_results    │                                  │
│  │   ─────     │      │   ───────────    │                                  │
│  │  id (PK)    │      │  id (PK)         │                                  │
│  │  user_id    │      │  goal_id (FK)    │                                  │
│  │  title      │      │  title           │                                  │
│  │  description│      │  target_value    │                                  │
│  │  status     │      │  current_value   │                                  │
│  │  priority   │      │  weight          │                                  │
│  │  timeframe  │      │  completed       │                                  │
│  │  progress   │      └──────────────────┘                                  │
│  └─────────────┘                                                            │
│                                                                              │
│  ┌─────────────┐      ┌──────────────────┐                                  │
│  │   habits    │──1:N─│   habit_logs     │                                  │
│  │   ──────    │      │   ──────────     │                                  │
│  │  id (PK)    │      │  id (PK)         │                                  │
│  │  user_id    │      │  habit_id (FK)   │                                  │
│  │  title      │      │  log_date        │                                  │
│  │  frequency  │      │  completed       │                                  │
│  │  current_streak    │  duration_minutes│                                  │
│  │  best_streak│      │  notes           │                                  │
│  └─────────────┘      └──────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Migration Files Structure

```
supabase/migrations/
├── 001_connection_layer.sql       # Core (entity_links, notifications)
├── 002_journey_module.sql         # Goals, Key Results, Habits, Habit Logs
├── 003_journey_books.sql          # Books, Book Notes, Reading Goals
├── 004_academy_module.sql         # Courses, Modules, Lessons, Enrollments
├── 005_academy_socratic.sql       # Socratic Sessions (separate for AI)
└── 006_functions_triggers.sql     # Shared functions and triggers
```

### 3.3 Key Indexes Strategy

```sql
-- High-frequency queries optimization

-- Academy: Course catalog (public, no auth filter)
CREATE INDEX idx_courses_catalog
  ON courses(status, category, difficulty, created_at DESC)
  WHERE status = 'published';

-- Academy: User's enrollments dashboard
CREATE INDEX idx_enrollments_user_active
  ON enrollments(user_id, status, last_activity_at DESC)
  WHERE status = 'active';

-- Library: User's books by status
CREATE INDEX idx_books_user_status
  ON books(user_id, status, updated_at DESC);

-- Library: Full-text search on books (future)
CREATE INDEX idx_books_search
  ON books USING GIN(to_tsvector('portuguese', title || ' ' || author));

-- Journey: Active goals dashboard
CREATE INDEX idx_goals_active
  ON goals(user_id, status, due_date)
  WHERE status = 'active';

-- Journey: Today's habits
CREATE INDEX idx_habits_active
  ON habits(user_id, active)
  WHERE active = TRUE;

-- Journey: Habit log lookups (last 30 days)
CREATE INDEX idx_habit_logs_recent
  ON habit_logs(user_id, log_date DESC);
```

---

## 4. API Layer (Server Actions)

### 4.1 Directory Structure

```
src/lib/actions/
├── academy/
│   ├── courses.ts          # getCourses, getCourse, createCourse (admin)
│   ├── enrollments.ts      # enroll, getEnrollments, unenroll
│   ├── progress.ts         # markLessonComplete, getProgress, updateWatchTime
│   └── socratic.ts         # startSession, sendMessage, getSession
├── books/
│   ├── books.ts            # getBooks, createBook, updateBook, deleteBook
│   ├── progress.ts         # updateReadingProgress, getReadingStats
│   ├── notes.ts            # createNote, getNotes, deleteNote
│   └── quotes.ts           # createQuote, getQuotes, deleteQuote
├── journey/
│   ├── goals.ts            # CRUD goals
│   ├── key-results.ts      # CRUD key results
│   ├── habits.ts           # CRUD habits
│   ├── habit-logs.ts       # logHabit, getHabitHistory
│   └── dashboard.ts        # getDashboardStats
└── shared/
    ├── auth.ts             # getAuthUser (helper)
    └── validation.ts       # Zod schemas
```

### 4.2 Server Action Patterns

#### Pattern 1: Basic CRUD with Authentication

```typescript
// lib/actions/books/books.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema
const CreateBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  total_pages: z.number().int().positive(),
  cover_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;

// Read: Get user's books with filters
export async function getBooks(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let query = supabase
    .from("books")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`
    );
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch books: ${error.message}`);
  }

  return { books: data || [], total: count || 0 };
}

// Create: Add new book
export async function createBook(input: CreateBookInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Validate input
  const validated = CreateBookSchema.parse(input);

  const { data, error } = await supabase
    .from("books")
    .insert({
      ...validated,
      user_id: user.id,
      status: "want_to_read",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create book: ${error.message}`);
  }

  revalidatePath("/journey/books");
  return data;
}

// Update: Modify book details
export async function updateBook(
  bookId: string,
  updates: Partial<CreateBookInput & { status: string; rating: number }>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("books")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookId)
    .eq("user_id", user.id) // RLS backup
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update book: ${error.message}`);
  }

  revalidatePath("/journey/books");
  revalidatePath(`/journey/books/${bookId}`);
  return data;
}

// Delete: Remove book
export async function deleteBook(bookId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete book: ${error.message}`);
  }

  revalidatePath("/journey/books");
}
```

#### Pattern 2: Complex Operations with Transactions

```typescript
// lib/actions/academy/enrollments.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // 1. Get course info and lesson count
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      is_free,
      price_cents,
      lessons(id)
    `)
    .eq("id", courseId)
    .eq("status", "published")
    .single();

  if (courseError || !course) {
    throw new Error("Course not found");
  }

  // 2. Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existingEnrollment) {
    if (existingEnrollment.status === "active") {
      return existingEnrollment; // Already enrolled
    }
    // Reactivate if paused/cancelled
    const { data, error } = await supabase
      .from("enrollments")
      .update({ status: "active", last_activity_at: new Date().toISOString() })
      .eq("id", existingEnrollment.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidatePath("/academy");
    return data;
  }

  // 3. Create enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .insert({
      user_id: user.id,
      course_id: courseId,
      status: "active",
      total_lessons: course.lessons?.length || 0,
    })
    .select()
    .single();

  if (enrollError) {
    throw new Error(`Enrollment failed: ${enrollError.message}`);
  }

  // 4. Increment course enrolled_count (via RPC for atomicity)
  await supabase.rpc("increment_course_enrolled_count", {
    p_course_id: courseId
  });

  // 5. Emit event (future: connection layer)
  // await emitEvent("academy.course.enrolled", {
  //   user_id: user.id,
  //   course_id: courseId
  // });

  revalidatePath("/academy");
  revalidatePath(`/academy/courses/${courseId}`);
  revalidatePath("/academy/my-courses");

  return enrollment;
}
```

#### Pattern 3: Progress Tracking with Auto-Status Updates

```typescript
// lib/actions/books/progress.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReadingProgress(
  bookId: string,
  currentPage: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get current book state
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, status, total_pages, started_at")
    .eq("id", bookId)
    .eq("user_id", user.id)
    .single();

  if (bookError || !book) {
    throw new Error("Book not found");
  }

  // Calculate new state
  const updates: Record<string, any> = {
    current_page: currentPage,
    updated_at: new Date().toISOString(),
  };

  // Auto-transition: want_to_read → reading
  if (currentPage > 0 && book.status === "want_to_read") {
    updates.status = "reading";
    updates.started_at = new Date().toISOString();
  }

  // Auto-transition: reading → completed
  if (currentPage >= book.total_pages && book.status === "reading") {
    updates.status = "completed";
    updates.finished_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("books")
    .update(updates)
    .eq("id", bookId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update progress: ${error.message}`);
  }

  // Emit completion event if book was just completed
  if (updates.status === "completed") {
    // Future: emit to connection layer
    // await emitEvent("journey.book.completed", { book_id: bookId });
  }

  revalidatePath("/journey/books");
  revalidatePath(`/journey/books/${bookId}`);

  return data;
}

export async function getReadingStats(year: number = new Date().getFullYear()) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;

  // Parallel queries for stats
  const [booksResult, goalResult, currentlyReadingResult] = await Promise.all([
    // Books completed this year
    supabase
      .from("books")
      .select("id, title, total_pages, finished_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("finished_at", startOfYear)
      .lte("finished_at", endOfYear),

    // Reading goal for this year
    supabase
      .from("reading_goals")
      .select("target_books")
      .eq("user_id", user.id)
      .eq("year", year)
      .single(),

    // Currently reading
    supabase
      .from("books")
      .select("id, title, current_page, total_pages")
      .eq("user_id", user.id)
      .eq("status", "reading"),
  ]);

  const booksCompleted = booksResult.data || [];
  const totalPages = booksCompleted.reduce((sum, b) => sum + (b.total_pages || 0), 0);
  const currentlyReading = currentlyReadingResult.data || [];

  return {
    year,
    booksCompleted: booksCompleted.length,
    targetBooks: goalResult.data?.target_books || 12, // Default goal
    totalPagesRead: totalPages,
    averagePagesPerBook: booksCompleted.length > 0
      ? Math.round(totalPages / booksCompleted.length)
      : 0,
    currentlyReading: currentlyReading.length,
    progressPercentage: goalResult.data?.target_books
      ? Math.round((booksCompleted.length / goalResult.data.target_books) * 100)
      : 0,
  };
}
```

### 4.3 API Response Patterns

```typescript
// lib/actions/shared/types.ts

// Standard success response
export type ActionResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code?: string;
};

// Paginated response
export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

// Action wrapper for consistent error handling
export async function safeAction<T>(
  action: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
```

---

## 5. Authentication & Authorization

### 5.1 Supabase Auth Configuration

```typescript
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component, ignore
          }
        },
      },
    }
  );
}
```

### 5.2 Row Level Security Policies

```sql
-- Academy: Courses (public read, author write)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published courses"
  ON courses FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can manage their courses"
  ON courses FOR ALL
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Library: Books (private, user-only)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own books"
  ON books FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Journey: Goals (private, user-only)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals"
  ON goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 5.3 Auth Middleware

```typescript
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ["/dashboard", "/academy", "/journey", "/settings"];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 6. File Storage

### 6.1 Storage Buckets Configuration

```sql
-- Create buckets via Supabase Dashboard or SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('course-thumbnails', 'course-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('book-covers', 'book-covers', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('lesson-content', 'lesson-content', false, 104857600, ARRAY['video/mp4', 'application/pdf']);

-- Storage policies
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view course thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Authors can upload course thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-thumbnails'
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id::text = (storage.foldername(name))[1]
      AND courses.author_id = auth.uid()
    )
  );
```

### 6.2 Upload Server Action

```typescript
// lib/actions/storage/upload.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadBookCover(bookId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP allowed.");
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File too large. Maximum 2MB.");
  }

  // Generate unique filename
  const ext = file.name.split(".").pop();
  const filename = `${bookId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("book-covers")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from("book-covers")
    .getPublicUrl(data.path);

  // Update book with cover URL
  await supabase
    .from("books")
    .update({ cover_url: publicUrl })
    .eq("id", bookId)
    .eq("user_id", user.id);

  return publicUrl;
}
```

---

## 7. Event System

### 7.1 Event Architecture (Phase 2)

```typescript
// lib/events/types.ts

export type EventType =
  // Academy Events
  | "academy.course.enrolled"
  | "academy.course.completed"
  | "academy.lesson.completed"
  | "academy.skill.unlocked"
  // Library Events
  | "journey.book.added"
  | "journey.book.progress.updated"
  | "journey.book.completed"
  // Journey Events
  | "journey.goal.created"
  | "journey.goal.completed"
  | "journey.habit.completed";

export interface Event<T = unknown> {
  type: EventType;
  payload: T;
  user_id: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Event payloads
export interface CourseCompletedPayload {
  course_id: string;
  course_title: string;
  skills_unlocked: string[];
  completion_time_hours: number;
}

export interface BookCompletedPayload {
  book_id: string;
  book_title: string;
  author: string;
  days_to_complete: number;
  rating?: number;
}
```

### 7.2 Event Emission (Database Triggers)

```sql
-- Events table for async processing
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_unprocessed ON events(created_at) WHERE processed = FALSE;

-- Trigger function to emit events
CREATE OR REPLACE FUNCTION emit_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO events (type, payload, user_id)
  VALUES (
    TG_ARGV[0],  -- Event type passed as trigger argument
    row_to_json(NEW),
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Example: Book completion event
CREATE TRIGGER trigger_book_completed
AFTER UPDATE OF status ON books
FOR EACH ROW
WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
EXECUTE FUNCTION emit_event('journey.book.completed');

-- Example: Course enrollment event
CREATE TRIGGER trigger_course_enrolled
AFTER INSERT ON enrollments
FOR EACH ROW
EXECUTE FUNCTION emit_event('academy.course.enrolled');
```

### 7.3 Event Consumers (Supabase Edge Functions)

```typescript
// supabase/functions/process-events/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get unprocessed events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("processed", false)
    .limit(100);

  for (const event of events || []) {
    try {
      await processEvent(supabase, event);

      await supabase
        .from("events")
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq("id", event.id);
    } catch (error) {
      console.error(`Failed to process event ${event.id}:`, error);
    }
  }

  return new Response(JSON.stringify({ processed: events?.length || 0 }));
});

async function processEvent(supabase: any, event: any) {
  switch (event.type) {
    case "academy.course.completed":
      // Update user skills
      // Notify user
      // Update journey goals if linked
      break;

    case "journey.book.completed":
      // Update reading stats
      // Check if goal completed
      // Suggest related courses
      break;

    case "journey.goal.completed":
      // Update parent goals
      // Create celebration notification
      break;
  }
}
```

---

## 8. Socratic Chat Backend

### 8.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SOCRATIC CHAT FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User Message                                                            │
│       │                                                                  │
│       ▼                                                                  │
│  ┌─────────────┐                                                         │
│  │ Server      │  1. Validate session                                    │
│  │ Action      │  2. Load lesson context                                 │
│  │ (socratic)  │  3. Build prompt                                        │
│  └──────┬──────┘                                                         │
│         │                                                                │
│         ▼                                                                │
│  ┌─────────────┐                                                         │
│  │ Claude API  │  System prompt + lesson content + history               │
│  │ (Streaming) │                                                         │
│  └──────┬──────┘                                                         │
│         │                                                                │
│         ▼                                                                │
│  ┌─────────────┐                                                         │
│  │ Save to DB  │  Append message to socratic_sessions.messages           │
│  │             │                                                         │
│  └──────┬──────┘                                                         │
│         │                                                                │
│         ▼                                                                │
│  Stream to Client (React Server Component + Suspense)                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Socratic Server Actions

```typescript
// lib/actions/academy/socratic.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";

const anthropic = new Anthropic();

// System prompt for Socratic method
const SOCRATIC_SYSTEM_PROMPT = `Você é um tutor socrático especializado em educação transformadora.

## Princípios:
1. **Nunca dê respostas diretas** — sempre guie através de perguntas
2. **Use três níveis de questionamento:**
   - Clarificação: "O que você quer dizer com...?"
   - Desafio: "E se considerássemos o oposto...?"
   - Síntese: "Como isso se conecta com...?"
3. **Reconheça insights genuínos** — quando o aluno demonstrar compreensão profunda
4. **Mantenha o foco** — sempre conecte de volta ao tópico da lição
5. **Seja encorajador** — erros são oportunidades de aprendizado

## Contexto da Lição:
{LESSON_CONTEXT}

## Formato de Resposta:
- Respostas curtas (1-3 parágrafos)
- Use analogias do dia a dia
- Termine com uma pergunta provocativa
`;

export async function startSocraticSession(lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check if session already exists
  const { data: existingSession } = await supabase
    .from("socratic_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .single();

  if (existingSession) {
    return existingSession;
  }

  // Create new session
  const { data: session, error } = await supabase
    .from("socratic_sessions")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      messages: [],
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return session;
}

export async function sendSocraticMessage(
  sessionId: string,
  userMessage: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get session with lesson context
  const { data: session, error: sessionError } = await supabase
    .from("socratic_sessions")
    .select(`
      *,
      lesson:lessons (
        title,
        content,
        socratic_system_prompt
      )
    `)
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (sessionError || !session) {
    throw new Error("Session not found");
  }

  // Build messages history
  const messages = session.messages || [];
  const newUserMessage = {
    role: "user",
    content: userMessage,
    timestamp: new Date().toISOString(),
  };
  messages.push(newUserMessage);

  // Build system prompt with lesson context
  const lessonContext = `
Título: ${session.lesson.title}
Conteúdo: ${JSON.stringify(session.lesson.content)}
`;
  const systemPrompt = (session.lesson.socratic_system_prompt || SOCRATIC_SYSTEM_PROMPT)
    .replace("{LESSON_CONTEXT}", lessonContext);

  // Call Claude API
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const assistantMessage = {
    role: "assistant",
    content: response.content[0].type === "text" ? response.content[0].text : "",
    timestamp: new Date().toISOString(),
    type: classifyResponseType(response.content[0]),
  };
  messages.push(assistantMessage);

  // Update session
  const { error: updateError } = await supabase
    .from("socratic_sessions")
    .update({
      messages,
      message_count: messages.length,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) {
    throw new Error(`Failed to save message: ${updateError.message}`);
  }

  revalidatePath(`/academy/lessons/${session.lesson_id}`);

  return assistantMessage;
}

function classifyResponseType(content: any): "clarification" | "challenge" | "synthesis" | "feedback" {
  const text = content.text?.toLowerCase() || "";

  if (text.includes("o que você quer dizer") || text.includes("pode explicar")) {
    return "clarification";
  }
  if (text.includes("e se") || text.includes("considere o oposto")) {
    return "challenge";
  }
  if (text.includes("como isso se conecta") || text.includes("resumindo")) {
    return "synthesis";
  }
  return "feedback";
}

export async function getSocraticSession(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("socratic_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Session not found: ${error.message}`);
  }

  return data;
}
```

### 8.3 Streaming Response (Future Enhancement)

```typescript
// lib/actions/academy/socratic-stream.ts
"use server";

import { createStreamableValue } from "ai/rsc";
import Anthropic from "@anthropic-ai/sdk";

export async function sendSocraticMessageStream(
  sessionId: string,
  userMessage: string
) {
  const stream = createStreamableValue("");

  (async () => {
    const anthropic = new Anthropic();

    // ... same setup as non-streaming version ...

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages: formattedMessages,
    });

    let fullText = "";
    for await (const event of response) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        fullText += event.delta.text;
        stream.update(fullText);
      }
    }

    // Save to database after streaming complete
    await saveMessageToSession(sessionId, fullText);

    stream.done();
  })();

  return { output: stream.value };
}
```

---

## 9. Performance Considerations

### 9.1 Caching Strategy

| Data Type | Strategy | TTL | Invalidation |
|-----------|----------|-----|--------------|
| Course catalog | ISR + SWR | 5 min | `revalidatePath("/academy")` |
| Course details | ISR | 1 hour | On course update |
| User enrollments | No cache | - | Always fresh |
| User progress | No cache | - | Always fresh |
| Book library | SWR | 30 sec | `revalidatePath("/journey/books")` |
| Reading stats | SWR | 5 min | On book completion |
| Socratic sessions | No cache | - | Realtime |

### 9.2 Query Optimization

```typescript
// GOOD: Select only needed fields
const { data } = await supabase
  .from("courses")
  .select("id, title, slug, thumbnail_url, difficulty, enrolled_count")
  .eq("status", "published")
  .limit(20);

// BAD: Select everything
const { data } = await supabase
  .from("courses")
  .select("*");

// GOOD: Parallel queries
const [courses, enrollments] = await Promise.all([
  supabase.from("courses").select("*").eq("status", "published"),
  supabase.from("enrollments").select("*").eq("user_id", userId),
]);

// BAD: Sequential queries
const courses = await supabase.from("courses").select("*");
const enrollments = await supabase.from("enrollments").select("*");
```

### 9.3 Database Functions for Complex Operations

```sql
-- Atomic increment for course enrollment count
CREATE OR REPLACE FUNCTION increment_course_enrolled_count(p_course_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE courses
  SET enrolled_count = enrolled_count + 1
  WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's academy dashboard stats
CREATE OR REPLACE FUNCTION get_academy_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'enrolled_courses', (
      SELECT COUNT(*) FROM enrollments
      WHERE user_id = p_user_id AND status = 'active'
    ),
    'completed_courses', (
      SELECT COUNT(*) FROM enrollments
      WHERE user_id = p_user_id AND status = 'completed'
    ),
    'total_lessons_completed', (
      SELECT COUNT(*) FROM lesson_progress lp
      JOIN enrollments e ON lp.enrollment_id = e.id
      WHERE e.user_id = p_user_id AND lp.is_completed = TRUE
    ),
    'current_streak', (
      SELECT COALESCE(current_streak, 0) FROM user_streaks
      WHERE user_id = p_user_id
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 10. Implementation Roadmap

### Phase 1: Foundation (Sprint 3-4)

```
Week 1-2: Database Setup
├── [ ] Create Supabase project
├── [ ] Apply migration 001_connection_layer.sql
├── [ ] Apply migration 002_journey_module.sql
├── [ ] Apply migration 003_journey_books.sql
├── [ ] Configure RLS policies
├── [ ] Create storage buckets
└── [ ] Generate TypeScript types

Week 3-4: Core Server Actions
├── [ ] lib/supabase/server.ts (auth client)
├── [ ] lib/supabase/client.ts (browser client)
├── [ ] lib/actions/journey/goals.ts
├── [ ] lib/actions/journey/habits.ts
├── [ ] lib/actions/books/books.ts
├── [ ] lib/actions/books/notes.ts
└── [ ] Integration tests
```

### Phase 2: Academy Core (Sprint 5-6)

```
Week 5-6: Academy Database
├── [ ] Apply migration 004_academy_module.sql
├── [ ] Create seed data (sample courses)
├── [ ] lib/actions/academy/courses.ts
├── [ ] lib/actions/academy/enrollments.ts
└── [ ] lib/actions/academy/progress.ts

Week 7-8: Academy UI Integration
├── [ ] Course catalog page
├── [ ] Course detail page
├── [ ] Lesson player
├── [ ] Progress tracking
└── [ ] My courses dashboard
```

### Phase 3: Socratic & Events (Sprint 7-8)

```
Week 9-10: Socratic Chat
├── [ ] Apply migration 005_academy_socratic.sql
├── [ ] lib/actions/academy/socratic.ts
├── [ ] Claude API integration
├── [ ] Chat UI component
└── [ ] Session persistence

Week 11-12: Event System
├── [ ] Events table and triggers
├── [ ] Edge function for processing
├── [ ] Academy → Journey connections
├── [ ] Notification system
└── [ ] End-to-end testing
```

### Phase 4: Polish & Optimization (Sprint 9)

```
Week 13-14: Performance & Polish
├── [ ] Query optimization
├── [ ] Caching implementation
├── [ ] Error handling improvements
├── [ ] Logging and monitoring
├── [ ] Documentation
└── [ ] Load testing
```

---

## 11. Security Considerations

### 11.1 Input Validation

```typescript
// All server actions must validate input with Zod
import { z } from "zod";

const CreateGoalSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().max(2000).optional(),
  timeframe: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  due_date: z.string().datetime().optional(),
});

// Sanitize user content before storage
import DOMPurify from "isomorphic-dompurify";

function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href"],
  });
}
```

### 11.2 Rate Limiting

```typescript
// lib/utils/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const socraticRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 messages per minute
  analytics: true,
});

// Usage in server action
export async function sendSocraticMessage(sessionId: string, message: string) {
  const { data: { user } } = await supabase.auth.getUser();

  const { success } = await socraticRateLimit.limit(user.id);
  if (!success) {
    throw new Error("Rate limit exceeded. Please wait a moment.");
  }

  // ... rest of the function
}
```

### 11.3 API Key Security

```env
# .env.local (never commit)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...  # Server-only
ANTHROPIC_API_KEY=sk-ant-...  # Server-only
```

```typescript
// Ensure server-only keys are not exposed
if (typeof window !== "undefined") {
  throw new Error("This module can only be used on the server");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

---

## Appendix A: File Structure Summary

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── academy/
│   │   │   ├── page.tsx                    # Course catalog
│   │   │   ├── courses/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx            # Course detail
│   │   │   │       └── lessons/
│   │   │   │           └── [lessonSlug]/
│   │   │   │               └── page.tsx    # Lesson player
│   │   │   └── my-courses/
│   │   │       └── page.tsx                # User enrollments
│   │   ├── journey/
│   │   │   ├── goals/
│   │   │   ├── habits/
│   │   │   └── books/
│   │   │       ├── page.tsx                # Book library
│   │   │       └── [id]/
│   │   │           └── page.tsx            # Book detail
│   │   └── dashboard/
│   │       └── page.tsx
│   └── api/
│       └── webhooks/
│           └── supabase/
│               └── route.ts                # Event webhooks
├── components/
│   ├── academy/
│   │   ├── CourseCard.tsx
│   │   ├── CourseCatalog.tsx
│   │   ├── ModuleAccordion.tsx
│   │   ├── LessonContent.tsx
│   │   ├── ProgressSidebar.tsx
│   │   └── SocraticChat.tsx
│   ├── journey/
│   │   ├── GoalCard.tsx
│   │   ├── HabitRow.tsx
│   │   ├── BookCard.tsx
│   │   ├── BookGrid.tsx
│   │   └── ReadingProgress.tsx
│   └── ui/
│       └── ... (Design System)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser client
│   │   ├── server.ts                       # Server client
│   │   └── types.ts                        # Generated types
│   ├── actions/
│   │   ├── academy/
│   │   │   ├── courses.ts
│   │   │   ├── enrollments.ts
│   │   │   ├── progress.ts
│   │   │   └── socratic.ts
│   │   ├── books/
│   │   │   ├── books.ts
│   │   │   ├── notes.ts
│   │   │   └── progress.ts
│   │   ├── journey/
│   │   │   ├── goals.ts
│   │   │   ├── habits.ts
│   │   │   └── dashboard.ts
│   │   └── shared/
│   │       ├── auth.ts
│   │       └── validation.ts
│   └── utils/
│       ├── rate-limit.ts
│       └── sanitize.ts
└── types/
    ├── academy.ts
    ├── journey.ts
    └── events.ts

supabase/
├── migrations/
│   ├── 001_connection_layer.sql
│   ├── 002_journey_module.sql
│   ├── 003_journey_books.sql
│   ├── 004_academy_module.sql
│   ├── 005_academy_socratic.sql
│   └── 006_functions_triggers.sql
├── seed/
│   ├── 001_sample_courses.sql
│   └── 002_sample_books.sql
└── functions/
    └── process-events/
        └── index.ts
```

---

## Appendix B: Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anthropic (Claude API)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

**Document Status:** Ready for Review
**Next Steps:**
1. Review with @data-architect for schema validation
2. Review with @dev for implementation feasibility
3. Create Jira/Linear tickets from roadmap
4. Begin Phase 1 implementation

---

*— Aria, arquitetando o futuro*
