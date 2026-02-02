# EXIMIA-102: Integração Google Books API

> EPIC-001: Biblioteca Core | Sprint 1 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-102 |
| Título | Serviço de Busca — Google Books API |
| Epic | EPIC-001 |
| Story Points | 8 |
| Sprint | 1 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** Admin,
**Quero** buscar livros via Google Books API,
**Para** encontrar e adicionar livros ao catálogo global.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `searchBooks(query: string)` implementada
- [ ] **AC2:** Retorna até 10 resultados por busca
- [ ] **AC3:** Cada resultado contém campos do `BookSearchResult`:
  - `externalId` (Google Books ID)
  - `title`, `subtitle`
  - `authors[]`
  - `description`
  - `coverUrl`, `thumbnailUrl`
  - `isbn10`, `isbn13`
  - `publisher`, `publishedDate`
  - `pageCount`, `categories[]`, `language`
- [ ] **AC4:** Server Action `searchByISBN(isbn: string)` implementada
- [ ] **AC5:** Fallback para Open Library API se Google falhar (rate limit ou timeout)
- [ ] **AC6:** Cache de resultados por 1 hora usando `unstable_cache`
- [ ] **AC7:** Tratamento de erros:
  - Rate limit → Retry com backoff ou fallback
  - Timeout (> 5s) → Fallback
  - Sem resultados → Retornar array vazio
- [ ] **AC8:** Logs de erro no servidor (não expor ao cliente)
- [ ] **AC9:** API Key em variável de ambiente server-only
- [ ] **AC10:** Validação de input com Zod

---

## Technical Notes

### Arquivos de Referência
- API Mapping: `Fase 01/API/google-books-mapping.md`
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`

### Estrutura de Arquivos

```
src/lib/actions/catalog/
├── search.ts           # searchBooks(), searchByISBN()
└── index.ts            # Re-exports

src/lib/services/
├── google-books.ts     # GoogleBooksService
└── open-library.ts     # OpenLibraryService (fallback)
```

### Implementação Base

```typescript
// src/lib/services/google-books.ts
import { unstable_cache } from 'next/cache';
import { GoogleBooksSearchResponse, BookSearchResult } from '@/types/biblioteca';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function searchGoogleBooks(query: string): Promise<BookSearchResult[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_BOOKS_API_KEY not configured');

  const url = new URL(GOOGLE_BOOKS_API);
  url.searchParams.set('q', query);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('maxResults', '10');
  url.searchParams.set('langRestrict', 'pt');

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // 1 hour cache
  });

  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`);
  }

  const data: GoogleBooksSearchResponse = await response.json();
  return mapGoogleBooksResponse(data);
}

function mapGoogleBooksResponse(data: GoogleBooksSearchResponse): BookSearchResult[] {
  if (!data.items) return [];

  return data.items.map((item) => {
    const info = item.volumeInfo;
    const isbn13 = info.industryIdentifiers?.find(i => i.type === 'ISBN_13')?.identifier;
    const isbn10 = info.industryIdentifiers?.find(i => i.type === 'ISBN_10')?.identifier;

    return {
      externalId: item.id,
      source: 'google' as const,
      title: info.title,
      subtitle: info.subtitle,
      authors: info.authors || [],
      description: info.description,
      coverUrl: info.imageLinks?.large || info.imageLinks?.medium || info.imageLinks?.thumbnail,
      thumbnailUrl: info.imageLinks?.thumbnail,
      isbn10,
      isbn13,
      publisher: info.publisher,
      publishedDate: info.publishedDate,
      pageCount: info.pageCount,
      categories: info.categories,
      language: info.language,
    };
  });
}
```

### Server Action

```typescript
// src/lib/actions/catalog/search.ts
'use server';

import { z } from 'zod';
import { searchGoogleBooks } from '@/lib/services/google-books';
import { searchOpenLibrary } from '@/lib/services/open-library';
import { BookSearchResult, ActionResult } from '@/types/biblioteca';

const SearchSchema = z.object({
  query: z.string().min(2).max(200),
});

export async function searchBooks(
  query: string
): Promise<ActionResult<BookSearchResult[]>> {
  try {
    const validated = SearchSchema.parse({ query });

    // Tentar Google Books primeiro
    try {
      const results = await searchGoogleBooks(validated.query);
      return { success: true, data: results };
    } catch (googleError) {
      console.error('Google Books failed, trying Open Library:', googleError);

      // Fallback para Open Library
      const results = await searchOpenLibrary(validated.query);
      return { success: true, data: results };
    }
  } catch (error) {
    console.error('Search failed:', error);
    return {
      success: false,
      error: 'Falha ao buscar livros. Tente novamente.',
      code: 'SEARCH_FAILED'
    };
  }
}
```

### Variáveis de Ambiente

```env
# .env.local (server-only)
GOOGLE_BOOKS_API_KEY=your_api_key_here
```

---

## Definition of Done

- [ ] Server Actions implementadas e funcionando
- [ ] Fallback para Open Library testado
- [ ] Cache de 1 hora verificado
- [ ] Erros logados no servidor
- [ ] Types validados com Zod
- [ ] Testes unitários escritos
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-101 (Schema V3 - para types)

### Bloqueia
- EXIMIA-103 (Admin Adicionar Livro)
- EXIMIA-104 (Página Explorar)

---

## Out of Scope

- Busca por autor isolada
- Filtros avançados na busca
- Autocomplete

---

*— River, removendo obstáculos 🌊*
