# Story EXIMIA-020: Journey Authors Page

**Story ID:** EXIMIA-020
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 6
**Pontos:** 5
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-019 (Journey Books), EXIMIA-044 (Minds Main)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ver uma lista de autores dos livros da minha biblioteca,
**Para que** eu possa conhecer mais sobre eles e conversar com seus Minds (se disponíveis).

---

## Contexto

Página derivada da biblioteca de livros, agregando autores únicos.
Integração direta com o módulo Minds para autores que possuem clones de IA.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Journey/JOURNEY_AUTORES.md` | Wireframes, interfaces TypeScript, eventos |
| **Mock Data** | `app/src/data/journey-autores-mock.ts` | Dados de exemplo para desenvolvimento |
| **Types** | `app/src/types/journey-authors.ts` | Author, AuthorWithBooks interfaces |

---

## Acceptance Criteria

### Página de Autores
- [ ] Lista de autores extraídos dos livros do usuário
- [ ] Card de autor com: foto (se disponível), nome, contagem de livros
- [ ] Busca por nome do autor
- [ ] Ordenação: mais livros, alfabética, mais recente

### Card do Autor
- [ ] Avatar/foto do autor (placeholder se não houver)
- [ ] Nome do autor
- [ ] Quantidade de livros na biblioteca
- [ ] Lista dos livros (collapsed, expandível)
- [ ] Badge "Mind Disponível" se houver Mind vinculado
- [ ] Botão "Conversar com Mind" (link para /minds/[id])

### Integração com Minds
- [ ] Verificar se autor tem Mind correspondente
- [ ] Mostrar indicador visual quando Mind disponível
- [ ] Link direto para página do Mind

---

## Technical Details

### Server Actions

```typescript
// lib/actions/authors.ts
"use server";

import { createClient } from "@/lib/supabase/server";

interface AuthorWithBooks {
  author: string;
  bookCount: number;
  books: { id: string; title: string; cover_url: string | null }[];
  mindId: string | null;
  mindAvatarUrl: string | null;
}

export async function getAuthors(search?: string): Promise<AuthorWithBooks[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get all books grouped by author
  const { data: books, error } = await supabase
    .from("books")
    .select("id, title, author, cover_url")
    .eq("user_id", user.id)
    .order("author");

  if (error) throw error;

  // Group by author
  const authorsMap = new Map<string, AuthorWithBooks>();

  for (const book of books || []) {
    const existing = authorsMap.get(book.author);
    if (existing) {
      existing.bookCount++;
      existing.books.push({ id: book.id, title: book.title, cover_url: book.cover_url });
    } else {
      authorsMap.set(book.author, {
        author: book.author,
        bookCount: 1,
        books: [{ id: book.id, title: book.title, cover_url: book.cover_url }],
        mindId: null,
        mindAvatarUrl: null,
      });
    }
  }

  // Check for matching Minds
  const authorNames = Array.from(authorsMap.keys());
  const { data: minds } = await supabase
    .from("minds")
    .select("id, name, avatar_url")
    .in("name", authorNames)
    .eq("status", "active");

  // Link minds to authors
  for (const mind of minds || []) {
    const author = authorsMap.get(mind.name);
    if (author) {
      author.mindId = mind.id;
      author.mindAvatarUrl = mind.avatar_url;
    }
  }

  let result = Array.from(authorsMap.values());

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter((a) => a.author.toLowerCase().includes(searchLower));
  }

  // Sort by book count (descending)
  result.sort((a, b) => b.bookCount - a.bookCount);

  return result;
}
```

### Author Card Component

```tsx
// components/journey/AuthorCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Badge, Button, Card } from "@/components/ui";
import { ChevronDown, ChevronUp, MessageCircle, Book } from "lucide-react";

interface AuthorCardProps {
  author: AuthorWithBooks;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Avatar
          src={author.mindAvatarUrl}
          alt={author.author}
          fallback={author.author.charAt(0)}
          size="lg"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{author.author}</h3>
            {author.mindId && (
              <Badge variant="primary" size="sm">
                🧠 Mind
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {author.bookCount} {author.bookCount === 1 ? "livro" : "livros"} na sua biblioteca
          </p>

          {/* Books list (collapsed) */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-primary mt-2"
          >
            <Book className="w-4 h-4" />
            Ver livros
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <ul className="mt-2 space-y-1 pl-5">
              {author.books.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/journey/books/${book.id}`}
                    className="text-sm text-muted-foreground hover:text-white"
                  >
                    {book.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mind CTA */}
        {author.mindId && (
          <Link href={`/minds/${author.mindId}`}>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversar
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
```

---

## Tasks

- [ ] Criar server action getAuthors
- [ ] Criar página /journey/authors
- [ ] Implementar AuthorCard component
- [ ] Adicionar busca por nome
- [ ] Adicionar ordenação (mais livros, A-Z)
- [ ] Integrar verificação de Minds
- [ ] Loading states e empty state
- [ ] Link na sidebar do Journey

---

## Definition of Done

- [ ] Lista de autores extraída corretamente dos livros
- [ ] Cards exibindo informações do autor
- [ ] Integração com Minds funcionando
- [ ] Busca e ordenação funcionais
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/journey/authors/
└── page.tsx                            [CREATE]

components/journey/
├── AuthorCard.tsx                      [CREATE]
├── AuthorList.tsx                      [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── authors.ts                          [CREATE]

app/src/data/
└── journey-autores-mock.ts             [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"journey.authors.viewed"
"journey.author.mind.clicked" { author_name, mind_id }

// Eventos consumidos
"minds.mind.created" → Atualizar badge de Mind disponível
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
