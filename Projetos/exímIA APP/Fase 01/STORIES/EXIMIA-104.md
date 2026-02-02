# EXIMIA-104: Página Explorar (Catálogo)

> EPIC-001: Biblioteca Core | Sprint 2 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-104 |
| Título | Página Explorar — Catálogo de Livros |
| Epic | EPIC-001 |
| Story Points | 8 |
| Sprint | 2 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** navegar pelo catálogo de livros,
**Para** descobrir e favoritar livros.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `getCatalogBooks(filters)` implementada
- [ ] **AC2:** View `catalog_view` utilizada para dados enriquecidos
- [ ] **AC3:** Filtros funcionando:
  - Busca por título/autor (fuzzy search)
  - Categoria
  - Apenas com resumo disponível
  - Idioma
- [ ] **AC4:** Ordenação:
  - Mais recentes
  - Mais favoritados
  - Título (A-Z)
- [ ] **AC5:** Paginação com 20 livros por página
- [ ] **AC6:** Componente `CatalogBookCard` com:
  - Capa (placeholder se não houver)
  - Título e autor
  - Badge "Resumo disponível" se `has_published_summary`
  - Contador de favoritos
  - Botão de favorito (coração)
- [ ] **AC7:** Estado de loading com skeleton cards
- [ ] **AC8:** Estado de "catálogo vazio"
- [ ] **AC9:** Estado de "nenhum resultado" para filtros
- [ ] **AC10:** Click no card navega para página de detalhe
- [ ] **AC11:** Responsivo: grid 2 cols mobile, 3 tablet, 4+ desktop

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Interface: `CatalogFilters`, `BookCatalogView`

### Estrutura de Arquivos

```
src/lib/actions/catalog/
├── get.ts              # getCatalogBooks(), getCatalogBook()
└── index.ts

src/app/(platform)/biblioteca/
├── page.tsx            # Container com tabs
├── explorar/
│   └── page.tsx        # Aba Explorar
├── favoritos/
│   └── page.tsx        # EXIMIA-106
└── autores/
    └── page.tsx        # Futuro

src/components/biblioteca/
├── CatalogBookCard.tsx
├── CatalogGrid.tsx
├── CatalogFilters.tsx
├── CatalogSearch.tsx
└── CatalogPagination.tsx
```

### Server Action

```typescript
// src/lib/actions/catalog/get.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { CatalogFilters, BookCatalogView, PaginatedResponse, ActionResult } from '@/types/biblioteca';

export async function getCatalogBooks(
  filters: CatalogFilters = {}
): Promise<ActionResult<PaginatedResponse<BookCatalogView>>> {
  const supabase = await createClient();

  const {
    search,
    category,
    has_summary,
    language,
    limit = 20,
    offset = 0,
    orderBy = 'created_at',
    orderDir = 'desc',
  } = filters;

  let query = supabase
    .from('catalog_view')
    .select('*', { count: 'exact' });

  // Filtros
  if (search) {
    query = query.or(`title.ilike.%${search}%,author_name.ilike.%${search}%`);
  }

  if (category) {
    query = query.contains('categories', [category]);
  }

  if (has_summary) {
    query = query.eq('has_published_summary', true);
  }

  if (language) {
    query = query.eq('language', language);
  }

  // Ordenação
  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  // Paginação
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Catalog query error:', error);
    return { success: false, error: 'Falha ao carregar catálogo', code: 'QUERY_ERROR' };
  }

  return {
    success: true,
    data: {
      data: data || [],
      total: count || 0,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
}

export async function getCatalogBook(
  id: string
): Promise<ActionResult<BookCatalogView | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('catalog_view')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: 'Falha ao carregar livro', code: 'QUERY_ERROR' };
  }

  return { success: true, data };
}
```

### Componente de Card

```tsx
// src/components/biblioteca/CatalogBookCard.tsx
'use client';

import { Heart } from 'lucide-react';
import { BookCatalogView } from '@/types/biblioteca';
import Link from 'next/link';

interface CatalogBookCardProps {
  book: BookCatalogView;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function CatalogBookCard({ book, isFavorite, onToggleFavorite }: CatalogBookCardProps) {
  return (
    <Link href={`/biblioteca/livro/${book.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            📚
          </div>
        )}

        {book.has_published_summary && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Resumo
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.();
          }}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
      </div>

      <div className="mt-2">
        <h3 className="font-medium line-clamp-2">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author_name}</p>
        <p className="text-xs text-muted-foreground mt-1">
          ❤️ {book.favorites_count}
        </p>
      </div>
    </Link>
  );
}
```

---

## Definition of Done

- [ ] Server Actions implementadas
- [ ] Página Explorar funcional com dados reais
- [ ] Filtros e ordenação funcionando
- [ ] Paginação funcionando
- [ ] Cards responsivos
- [ ] Estados de loading/empty/error
- [ ] Navegação para detalhe funcionando
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-103 (Admin Adicionar Livro - para ter dados no catálogo)

### Bloqueia
- EXIMIA-105 (Sistema de Favoritos)
- EXIMIA-107 (Página de Detalhe)

---

## Out of Scope

- Infinite scroll (usar paginação tradicional)
- Filtros avançados (preço, disponibilidade)
- Ordenação por rating

---

*— River, removendo obstáculos 🌊*
