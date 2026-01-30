# Story EXIMIA-019: Journey Books Module

**Story ID:** EXIMIA-019
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 6
**Pontos:** 8
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-013 (Journey UI), EXIMIA-006 (Organisms)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** gerenciar minha biblioteca pessoal de livros com progresso de leitura,
**Para que** eu possa acompanhar minhas leituras, fazer anotações e atingir minha meta anual.

---

## Contexto

Módulo de livros dentro do Journey para tracking de leitura pessoal.
Integração com autores que podem ter Minds disponíveis.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Journey/JOURNEY_LIVROS.md` | Wireframes, interfaces TypeScript, eventos |
| **Mock Data** | `app/src/data/journey-livros-mock.ts` | Dados de exemplo para desenvolvimento |
| **Types** | `app/src/types/journey-books.ts` | Book, ReadingProgress, Quote, Note interfaces |

---

## Acceptance Criteria

### Página Principal (Biblioteca)
- [ ] Grid de livros com capa, título, autor e progresso
- [ ] Filtros por status: Lendo, Quero Ler, Lido, Abandonado
- [ ] Busca por título ou autor
- [ ] Meta anual com progress bar (ex: 12/24 livros)
- [ ] Stats: Total lido, páginas este mês, média por livro

### Modal Adicionar Livro
- [ ] Campos: título, autor, total de páginas, capa (upload ou URL)
- [ ] Status inicial: "Quero Ler"
- [ ] Tags/categorias opcionais
- [ ] Validação de campos obrigatórios

### Detalhe do Livro
- [ ] Informações completas do livro
- [ ] Slider ou input para atualizar página atual
- [ ] Cálculo automático de % de progresso
- [ ] Seção de notas com editor markdown
- [ ] Seção de citações favoritas
- [ ] Link para Mind do autor (se disponível)

### Notas e Citações
- [ ] Criar nota com página de referência
- [ ] Criar citação com página
- [ ] Listar notas/citações do livro
- [ ] Buscar em notas/citações

---

## Technical Details

### Database Schema Extension

```sql
-- Adicionar ao schema Journey existente

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  total_pages INTEGER NOT NULL,
  current_page INTEGER DEFAULT 0,
  cover_url TEXT,
  status TEXT DEFAULT 'want_to_read' CHECK (status IN ('reading', 'want_to_read', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE book_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  page_number INTEGER,
  type TEXT DEFAULT 'note' CHECK (type IN ('note', 'quote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reading_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  target_books INTEGER NOT NULL,
  UNIQUE(user_id, year)
);

-- Indexes
CREATE INDEX idx_books_user ON books(user_id);
CREATE INDEX idx_books_status ON books(user_id, status);
CREATE INDEX idx_book_notes_book ON book_notes(book_id);

-- RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own books" ON books FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" ON book_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON reading_goals FOR ALL USING (auth.uid() = user_id);
```

### Server Actions

```typescript
// lib/actions/books.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBooks(filters?: { status?: string; search?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let query = supabase
    .from("books")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createBook(data: CreateBookInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("books").insert({
    ...data,
    user_id: user.id,
  });

  if (error) throw error;
  revalidatePath("/journey/books");
}

export async function updateBookProgress(bookId: string, currentPage: number) {
  const supabase = await createClient();

  const { data: book } = await supabase
    .from("books")
    .select("total_pages, status")
    .eq("id", bookId)
    .single();

  const updates: any = { current_page: currentPage, updated_at: new Date().toISOString() };

  // Auto-update status
  if (currentPage > 0 && book?.status === "want_to_read") {
    updates.status = "reading";
    updates.started_at = new Date().toISOString();
  }
  if (currentPage >= book?.total_pages) {
    updates.status = "completed";
    updates.finished_at = new Date().toISOString();
  }

  const { error } = await supabase.from("books").update(updates).eq("id", bookId);
  if (error) throw error;
  revalidatePath("/journey/books");
}

export async function getReadingStats(year: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [booksResult, goalResult] = await Promise.all([
    supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("finished_at", `${year}-01-01`)
      .lte("finished_at", `${year}-12-31`),
    supabase
      .from("reading_goals")
      .select("target_books")
      .eq("user_id", user.id)
      .eq("year", year)
      .single(),
  ]);

  return {
    booksCompleted: booksResult.data?.length || 0,
    targetBooks: goalResult.data?.target_books || 12,
    totalPages: booksResult.data?.reduce((sum, b) => sum + b.total_pages, 0) || 0,
  };
}
```

---

## Tasks

- [ ] Criar migration para tabelas books, book_notes, reading_goals
- [ ] Implementar server actions para CRUD de livros
- [ ] Criar página /journey/books com grid de livros
- [ ] Implementar filtros e busca
- [ ] Criar modal AddBookModal
- [ ] Criar página de detalhe /journey/books/[id]
- [ ] Implementar atualização de progresso com slider
- [ ] Criar seção de notas e citações
- [ ] Implementar meta anual com stats
- [ ] Adicionar link para Mind do autor (verificar existência)
- [ ] Loading states e empty states
- [ ] Testes E2E básicos

---

## Definition of Done

- [ ] CRUD completo de livros funcionando
- [ ] Progresso de leitura atualizando corretamente
- [ ] Notas e citações funcionais
- [ ] Meta anual exibindo corretamente
- [ ] Integração com Minds (link para autor)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_journey_books.sql              [CREATE]

app/(dashboard)/journey/books/
├── page.tsx                            [CREATE]
└── [id]/
    └── page.tsx                        [CREATE]

components/journey/
├── BookCard.tsx                        [CREATE]
├── BookGrid.tsx                        [CREATE]
├── AddBookModal.tsx                    [CREATE]
├── BookDetail.tsx                      [CREATE]
├── ReadingProgress.tsx                 [CREATE]
├── BookNotes.tsx                       [CREATE]
├── BookQuotes.tsx                      [CREATE]
└── ReadingGoalCard.tsx                 [CREATE]

lib/actions/
└── books.ts                            [CREATE]

app/src/data/
└── journey-livros-mock.ts              [CREATE]

app/src/types/
└── journey-books.ts                    [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"journey.book.added" { book_id, title, author }
"journey.book.progress.updated" { book_id, current_page, total_pages, percent }
"journey.book.completed" { book_id, title, days_to_complete }
"journey.book.note.created" { book_id, note_id, type }

// Eventos consumidos
"minds.author.available" → Mostrar link para Mind do autor
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
