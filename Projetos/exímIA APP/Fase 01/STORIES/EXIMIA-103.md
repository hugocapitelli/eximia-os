# EXIMIA-103: Admin — Adicionar Livro ao Catálogo

> EPIC-001: Biblioteca Core | Sprint 1 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-103 |
| Título | Admin — Adicionar Livro ao Catálogo |
| Epic | EPIC-001 |
| Story Points | 8 |
| Sprint | 1 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** Admin,
**Quero** adicionar livros da busca ao catálogo global,
**Para** disponibilizar para todos os usuários.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `addBookToCatalog(data)` implementada (Admin only)
- [ ] **AC2:** Server Action `addBookFromSearch(externalId, source)` que busca dados e adiciona
- [ ] **AC3:** Verificação de duplicata antes de inserir:
  - Por `google_books_id`
  - Por `isbn13`
  - Retornar livro existente se já houver
- [ ] **AC4:** Upload de capa para Supabase Storage se `cover_url` externa
- [ ] **AC5:** Validação de role admin via `biblioteca.is_admin()`
- [ ] **AC6:** Componente `BookSearchModal` para busca:
  - Input com debounce (300ms)
  - Lista de resultados
  - Estado de loading
  - Estado de erro com retry
  - Estado de "nenhum resultado"
- [ ] **AC7:** Componente `BookPreviewCard` com:
  - Capa, título, autor
  - Descrição truncada (expandível)
  - Metadados (editora, ano, páginas, ISBN)
  - Botão "Adicionar ao Catálogo"
- [ ] **AC8:** Toast de sucesso após adicionar
- [ ] **AC9:** Redirecionar para página do livro após adicionar
- [ ] **AC10:** Proteção de rota: apenas admin acessa

---

## Technical Notes

### Arquivos de Referência
- Schema: `Fase 01/SQL/003-biblioteca-schema-v3.sql`
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Zod Schemas: `AddBookToCatalogSchema`, `AddBookFromSearchSchema`

### Estrutura de Arquivos

```
src/lib/actions/catalog/
├── search.ts           # EXIMIA-102
├── add.ts              # addBookToCatalog(), addBookFromSearch()
├── get.ts              # getCatalogBooks(), getCatalogBook()
└── index.ts

src/components/biblioteca/
├── BookSearchModal.tsx
├── BookSearchInput.tsx
├── BookSearchResults.tsx
├── BookPreviewCard.tsx
└── index.ts
```

### Server Action - Adicionar

```typescript
// src/lib/actions/catalog/add.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { AddBookToCatalogSchema, AddBookFromSearchSchema, BookCatalog, ActionResult } from '@/types/biblioteca';
import { searchGoogleBooks } from '@/lib/services/google-books';
import { uploadBookCover } from '@/lib/services/storage';

export async function addBookToCatalog(
  input: unknown
): Promise<ActionResult<BookCatalog>> {
  const supabase = await createClient();

  // Verificar se é admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };

  // Validar input
  const validated = AddBookToCatalogSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const data = validated.data;

  // Verificar duplicata
  if (data.google_books_id) {
    const { data: existing } = await supabase
      .from('book_catalog')
      .select('*')
      .eq('google_books_id', data.google_books_id)
      .single();

    if (existing) {
      return { success: true, data: existing };
    }
  }

  // Upload capa se necessário
  let coverUrl = data.cover_url;
  if (coverUrl && coverUrl.startsWith('http')) {
    try {
      coverUrl = await uploadBookCover(coverUrl, data.google_books_id || data.title);
    } catch (error) {
      console.error('Failed to upload cover:', error);
      // Manter URL original se falhar
    }
  }

  // Inserir no catálogo
  const { data: book, error } = await supabase
    .from('book_catalog')
    .insert({
      ...data,
      cover_url: coverUrl,
      added_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Insert error:', error);
    return { success: false, error: 'Falha ao adicionar livro', code: 'INSERT_ERROR' };
  }

  return { success: true, data: book };
}

export async function addBookFromSearch(
  input: unknown
): Promise<ActionResult<BookCatalog>> {
  const validated = AddBookFromSearchSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const { externalId, source } = validated.data;

  // Buscar dados completos do livro
  let bookData;
  if (source === 'google') {
    const results = await searchGoogleBooks(`id:${externalId}`);
    bookData = results[0];
  }

  if (!bookData) {
    return { success: false, error: 'Livro não encontrado', code: 'NOT_FOUND' };
  }

  // Converter para formato do catálogo
  return addBookToCatalog({
    google_books_id: externalId,
    title: bookData.title,
    subtitle: bookData.subtitle,
    author_name: bookData.authors?.join(', '),
    description: bookData.description,
    publisher: bookData.publisher,
    published_date: bookData.publishedDate,
    page_count: bookData.pageCount,
    language: bookData.language || 'pt',
    categories: bookData.categories,
    cover_url: bookData.coverUrl,
    thumbnail_url: bookData.thumbnailUrl,
    isbn10: bookData.isbn10,
    isbn13: bookData.isbn13,
  });
}
```

### Componente de Busca

```tsx
// src/components/biblioteca/BookSearchModal.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchBooks } from '@/lib/actions/catalog/search';
import { addBookFromSearch } from '@/lib/actions/catalog/add';
import { BookSearchResult } from '@/types/biblioteca';

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: (bookId: string) => void;
}

export function BookSearchModal({ isOpen, onClose, onBookAdded }: BookSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Efeito para buscar quando query muda
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    async function doSearch() {
      setLoading(true);
      setError(null);
      const result = await searchBooks(debouncedQuery);
      setLoading(false);

      if (result.success) {
        setResults(result.data || []);
      } else {
        setError(result.error || 'Erro ao buscar');
      }
    }

    doSearch();
  }, [debouncedQuery]);

  const handleAdd = async (book: BookSearchResult) => {
    setAdding(book.externalId);
    const result = await addBookFromSearch({
      externalId: book.externalId,
      source: book.source,
    });
    setAdding(null);

    if (result.success && result.data) {
      onBookAdded?.(result.data.id);
      onClose();
    }
  };

  // ... render
}
```

---

## Definition of Done

- [ ] Server Actions implementadas e testadas
- [ ] Verificação de admin funcionando
- [ ] Duplicatas tratadas corretamente
- [ ] Upload de capa para Storage funcionando
- [ ] Componentes de UI implementados
- [ ] Toast de feedback implementado
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-101 (Schema V3)
- EXIMIA-102 (Google Books API)

### Bloqueia
- EXIMIA-104 (Página Explorar)
- EXIMIA-207 (Admin Criar Resumos)

---

## Out of Scope

- Edição de livros do catálogo
- Remoção de livros do catálogo
- Merge de livros duplicados
- Adição manual sem busca

---

*— River, removendo obstáculos 🌊*
