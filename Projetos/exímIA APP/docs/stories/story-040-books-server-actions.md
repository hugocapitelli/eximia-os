# Story EXIMIA-040: Books Server Actions (Library Module)

**Story ID:** EXIMIA-040
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 5
**Pontos:** 8
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-038 (Supabase Client), EXIMIA-019 (Journey Books Schema)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ter APIs funcionais para a Biblioteca de Livros,
**Para que** eu possa gerenciar minha leitura, fazer anotações e acompanhar minha meta anual.

---

## Contexto

Esta story implementa todas as Server Actions para o módulo Library (Books, Notes, Quotes, Reading Goals).
Inclui funcionalidades de auto-transição de status baseado no progresso.

---

## Acceptance Criteria

### Books API
- [ ] `getBooks(filters?)` - Listar livros com filtros (status, search)
- [ ] `getBook(id)` - Obter livro com notas e citações
- [ ] `createBook(data)` - Adicionar novo livro
- [ ] `updateBook(id, data)` - Atualizar livro
- [ ] `deleteBook(id)` - Remover livro
- [ ] `updateReadingProgress(id, currentPage)` - Atualizar progresso com auto-status

### Notes API
- [ ] `getBookNotes(bookId)` - Listar notas de um livro
- [ ] `createNote(bookId, data)` - Criar nota
- [ ] `updateNote(id, data)` - Editar nota
- [ ] `deleteNote(id)` - Deletar nota

### Quotes API
- [ ] `getBookQuotes(bookId)` - Listar citações de um livro
- [ ] `createQuote(bookId, data)` - Criar citação
- [ ] `deleteQuote(id)` - Deletar citação

### Reading Goals API
- [ ] `getReadingGoal(year)` - Obter meta do ano
- [ ] `setReadingGoal(year, target)` - Definir meta anual
- [ ] `getReadingStats(year)` - Estatísticas de leitura

### Auto-transitions
- [ ] `want_to_read` → `reading` quando currentPage > 0
- [ ] `reading` → `completed` quando currentPage >= totalPages

---

## Technical Details

### Directory Structure

```
src/lib/actions/books/
├── books.ts           # Books CRUD
├── progress.ts        # Reading progress
├── notes.ts           # Notes CRUD
├── quotes.ts          # Quotes CRUD
├── goals.ts           # Reading goals
├── stats.ts           # Reading statistics
└── index.ts           # Re-exports
```

### Books Server Actions

```typescript
// src/lib/actions/books/books.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =============================================================================
// SCHEMAS
// =============================================================================

const CreateBookSchema = z.object({
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  total_pages: z.number().int().positive(),
  cover_url: z.string().url().optional().nullable(),
  isbn: z.string().optional(),
  genre: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const UpdateBookSchema = CreateBookSchema.partial().extend({
  status: z.enum(["wishlist", "reading", "completed", "abandoned"]).optional(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  notes: z.string().optional(),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;

// =============================================================================
// READ
// =============================================================================

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
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 20) - 1
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch books: ${error.message}`);
  }

  return { books: data || [], total: count || 0 };
}

export async function getBook(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      book_notes (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Book not found: ${error.message}`);
  }

  // Separate notes and quotes
  const notes = data.book_notes?.filter((n: any) => n.type === "note") || [];
  const quotes = data.book_notes?.filter((n: any) => n.type === "quote") || [];

  return {
    ...data,
    notes,
    quotes,
  };
}

// =============================================================================
// CREATE
// =============================================================================

export async function createBook(input: CreateBookInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validated = CreateBookSchema.parse(input);

  const { data, error } = await supabase
    .from("books")
    .insert({
      ...validated,
      user_id: user.id,
      status: "wishlist",
      current_page: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create book: ${error.message}`);
  }

  revalidatePath("/journey/books");
  return data;
}

// =============================================================================
// UPDATE
// =============================================================================

export async function updateBook(id: string, input: UpdateBookInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validated = UpdateBookSchema.parse(input);

  const { data, error } = await supabase
    .from("books")
    .update(validated)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update book: ${error.message}`);
  }

  revalidatePath("/journey/books");
  revalidatePath(`/journey/books/${id}`);
  return data;
}

// =============================================================================
// DELETE
// =============================================================================

export async function deleteBook(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete book: ${error.message}`);
  }

  revalidatePath("/journey/books");
}
```

### Progress Server Actions

```typescript
// src/lib/actions/books/progress.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReadingProgress(bookId: string, currentPage: number) {
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

  // Validate page number
  if (currentPage < 0 || currentPage > book.total_pages) {
    throw new Error(`Invalid page number. Must be between 0 and ${book.total_pages}`);
  }

  // Calculate new state
  const updates: Record<string, any> = {
    current_page: currentPage,
  };

  // Auto-transition: wishlist → reading
  if (currentPage > 0 && book.status === "wishlist") {
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

  // Update reading streak if book was just completed or progress made
  if (updates.status === "completed" || currentPage > 0) {
    await supabase.rpc("update_user_streak", {
      p_user_id: user.id,
      p_streak_type: "reading",
    });
  }

  revalidatePath("/journey/books");
  revalidatePath(`/journey/books/${bookId}`);
  revalidatePath("/dashboard");

  return data;
}
```

### Reading Stats

```typescript
// src/lib/actions/books/stats.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getReadingStats(year: number = new Date().getFullYear()) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;

  // Parallel queries for efficiency
  const [booksResult, goalResult, currentlyReadingResult, allBooksResult] =
    await Promise.all([
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

      // Total books in library
      supabase
        .from("books")
        .select("id", { count: "exact" })
        .eq("user_id", user.id),
    ]);

  const booksCompleted = booksResult.data || [];
  const totalPagesRead = booksCompleted.reduce(
    (sum, b) => sum + (b.total_pages || 0),
    0
  );
  const currentlyReading = currentlyReadingResult.data || [];
  const targetBooks = goalResult.data?.target_books || 12;

  return {
    year,
    booksCompleted: booksCompleted.length,
    targetBooks,
    totalPagesRead,
    averagePagesPerBook:
      booksCompleted.length > 0
        ? Math.round(totalPagesRead / booksCompleted.length)
        : 0,
    currentlyReading: currentlyReading.length,
    currentlyReadingBooks: currentlyReading,
    progressPercentage: Math.min(
      Math.round((booksCompleted.length / targetBooks) * 100),
      100
    ),
    totalBooksInLibrary: allBooksResult.count || 0,
    booksRemaining: Math.max(0, targetBooks - booksCompleted.length),
  };
}

export async function setReadingGoal(year: number, targetBooks: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (targetBooks < 1 || targetBooks > 365) {
    throw new Error("Target must be between 1 and 365 books");
  }

  const { data, error } = await supabase
    .from("reading_goals")
    .upsert(
      {
        user_id: user.id,
        year,
        target_books: targetBooks,
      },
      {
        onConflict: "user_id,year",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to set reading goal: ${error.message}`);
  }

  return data;
}
```

---

## Tasks

- [ ] Criar `src/lib/actions/books/books.ts`
- [ ] Criar `src/lib/actions/books/progress.ts`
- [ ] Criar `src/lib/actions/books/notes.ts`
- [ ] Criar `src/lib/actions/books/quotes.ts`
- [ ] Criar `src/lib/actions/books/goals.ts`
- [ ] Criar `src/lib/actions/books/stats.ts`
- [ ] Criar `src/lib/actions/books/index.ts`
- [ ] Implementar Zod schemas
- [ ] Implementar auto-transitions de status
- [ ] Testar CRUD de books
- [ ] Testar notes e quotes
- [ ] Testar reading stats
- [ ] Verificar integração com streaks

---

## Definition of Done

- [ ] Todos os endpoints funcionando
- [ ] Auto-transitions de status funcionando
- [ ] Reading stats calculando corretamente
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] Testes manuais passando
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/lib/actions/books/
├── books.ts           [CREATE]
├── progress.ts        [CREATE]
├── notes.ts           [CREATE]
├── quotes.ts          [CREATE]
├── goals.ts           [CREATE]
├── stats.ts           [CREATE]
└── index.ts           [CREATE]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication checks
- [ ] Page validation bounds checking
- [ ] RLS backup with user_id checks

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
