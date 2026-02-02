# EXIMIA-106: Página Favoritos

> EPIC-001: Biblioteca Core | Sprint 2 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-106 |
| Título | Página Favoritos (Meus Livros) |
| Epic | EPIC-001 |
| Story Points | 8 |
| Sprint | 2 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** ver meus livros favoritados,
**Para** acompanhar minha lista e acessar resumos disponíveis.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `getUserFavorites(filters)` implementada
- [ ] **AC2:** Usa view `user_favorites_view` para dados enriquecidos
- [ ] **AC3:** Filtros funcionando:
  - Apenas com resumo disponível
  - Resumo completo vs em andamento
- [ ] **AC4:** Ordenação:
  - Mais recentes (favorited_at)
  - Título (A-Z)
- [ ] **AC5:** Componente `FavoriteCard` com:
  - Capa e informações básicas
  - Badge "Resumo disponível" se tem resumo publicado
  - Barra de progresso do resumo (se aplicável)
  - Botão "Continuar Lendo" se tem progresso
  - Botão "Iniciar Leitura" se tem resumo mas sem progresso
  - Botão de desfavoritar (coração preenchido)
- [ ] **AC6:** Stats no topo:
  - Total de favoritos
  - Resumos concluídos
  - Em andamento
- [ ] **AC7:** Estado de "nenhum favorito" com CTA para explorar
- [ ] **AC8:** Click no card navega para página de detalhe
- [ ] **AC9:** Responsivo: grid adaptativo
- [ ] **AC10:** Autenticação obrigatória (redirect se não logado)

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Interface: `UserFavoriteView`, `FavoriteFilters`

### Estrutura de Arquivos

```
src/lib/actions/favorites/
├── get.ts              # getUserFavorites()
└── index.ts

src/app/(platform)/biblioteca/
├── favoritos/
│   └── page.tsx        # Página de favoritos
└── layout.tsx

src/components/biblioteca/
├── FavoriteCard.tsx
├── FavoriteGrid.tsx
├── FavoriteStats.tsx
└── EmptyFavorites.tsx
```

### Server Action

```typescript
// src/lib/actions/favorites/get.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { FavoriteFilters, UserFavoriteView, PaginatedResponse, ActionResult } from '@/types/biblioteca';

export async function getUserFavorites(
  filters: FavoriteFilters = {}
): Promise<ActionResult<PaginatedResponse<UserFavoriteView>>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const {
    has_summary,
    summary_completed,
    limit = 20,
    offset = 0,
    orderBy = 'favorited_at',
    orderDir = 'desc',
  } = filters;

  let query = supabase
    .from('user_favorites_view')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  // Filtros
  if (has_summary !== undefined) {
    query = query.eq('has_published_summary', has_summary);
  }

  if (summary_completed !== undefined) {
    query = query.eq('summary_completed', summary_completed);
  }

  // Ordenação
  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  // Paginação
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Favorites query error:', error);
    return { success: false, error: 'Falha ao carregar favoritos', code: 'QUERY_ERROR' };
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

export async function getFavoriteStats(): Promise<ActionResult<{
  total: number;
  with_summary: number;
  completed: number;
  in_progress: number;
}>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_favorites_view')
    .select('has_published_summary, summary_completed, current_chapter')
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Falha ao carregar estatísticas', code: 'QUERY_ERROR' };
  }

  const stats = {
    total: data?.length || 0,
    with_summary: data?.filter(f => f.has_published_summary).length || 0,
    completed: data?.filter(f => f.summary_completed).length || 0,
    in_progress: data?.filter(f => f.current_chapter && !f.summary_completed).length || 0,
  };

  return { success: true, data: stats };
}
```

### Componente de Card

```tsx
// src/components/biblioteca/FavoriteCard.tsx
'use client';

import { Heart, BookOpen, CheckCircle } from 'lucide-react';
import { UserFavoriteView } from '@/types/biblioteca';
import Link from 'next/link';
import { useFavorite } from '@/hooks/useFavorite';

interface FavoriteCardProps {
  favorite: UserFavoriteView;
  onRemove?: () => void;
}

export function FavoriteCard({ favorite, onRemove }: FavoriteCardProps) {
  const { toggle, isLoading } = useFavorite(favorite.id, true);

  const handleRemove = async () => {
    await toggle();
    onRemove?.();
  };

  return (
    <div className="group relative">
      <Link href={`/biblioteca/livro/${favorite.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted">
          {favorite.cover_url ? (
            <img
              src={favorite.cover_url}
              alt={favorite.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              📚
            </div>
          )}

          {/* Badge de Resumo */}
          {favorite.has_published_summary && (
            <div className="absolute top-2 left-2">
              {favorite.summary_completed ? (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Concluído
                </div>
              ) : favorite.current_chapter ? (
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Cap. {favorite.current_chapter}
                </div>
              ) : (
                <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded">
                  Resumo
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-2">
          <h3 className="font-medium line-clamp-2">{favorite.title}</h3>
          <p className="text-sm text-muted-foreground">{favorite.author_name}</p>

          {/* Progresso do Resumo */}
          {favorite.has_published_summary && favorite.chapter_count > 0 && (
            <div className="mt-2">
              <div className="h-1 bg-muted rounded overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${((favorite.current_chapter || 0) / favorite.chapter_count) * 100}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {favorite.current_chapter || 0} de {favorite.chapter_count} capítulos
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Botão Desfavoritar */}
      <button
        onClick={handleRemove}
        disabled={isLoading}
        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
      >
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      </button>

      {/* CTA de Leitura */}
      {favorite.has_published_summary && !favorite.summary_completed && (
        <Link
          href={`/biblioteca/livro/${favorite.id}/ler`}
          className="absolute bottom-16 left-2 right-2 bg-amber-500 hover:bg-amber-600 text-white text-sm py-2 px-4 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <BookOpen className="w-4 h-4 inline mr-1" />
          {favorite.current_chapter ? 'Continuar' : 'Iniciar Leitura'}
        </Link>
      )}
    </div>
  );
}
```

### Estado Vazio

```tsx
// src/components/biblioteca/EmptyFavorites.tsx
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

export function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Heart className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Explore o catálogo e favorite livros para criar sua lista pessoal.
      </p>
      <Link
        href="/biblioteca/explorar"
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        Explorar Catálogo
      </Link>
    </div>
  );
}
```

---

## Definition of Done

- [ ] Server Actions implementadas
- [ ] Página Favoritos funcional com dados reais
- [ ] View `user_favorites_view` utilizada corretamente
- [ ] Stats no topo funcionando
- [ ] Cards com badge de progresso
- [ ] Estado vazio com CTA
- [ ] Desfavoritar funcionando
- [ ] Link para leitura funcionando
- [ ] Responsivo
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-105 (Sistema de Favoritos)

### Bloqueia
- EXIMIA-206 (Integração com Modo Leitura)

---

## Out of Scope

- Drag and drop para reordenar
- Exportar lista de favoritos
- Compartilhar favoritos

---

*— River, removendo obstáculos 🌊*
