# EXIMIA-105: Sistema de Favoritos

> EPIC-001: Biblioteca Core | Sprint 2 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-105 |
| Título | Sistema de Favoritos |
| Epic | EPIC-001 |
| Story Points | 5 |
| Sprint | 2 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** favoritar livros do catálogo,
**Para** criar minha lista pessoal de favoritos.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `toggleFavorite(catalogId)` implementada
- [ ] **AC2:** Se não favoritado → adiciona favorito
- [ ] **AC3:** Se já favoritado → remove favorito
- [ ] **AC4:** Trigger automático atualiza `favorites_count` no catálogo
- [ ] **AC5:** Server Action `isFavorite(catalogId)` para verificar status
- [ ] **AC6:** Server Action `getUserFavorites(filters)` para listar favoritos
- [ ] **AC7:** Hook `useFavorite(catalogId)` para gerenciar estado no cliente:
  - `isFavorite: boolean`
  - `isLoading: boolean`
  - `toggle: () => void`
- [ ] **AC8:** Optimistic UI: atualização imediata ao clicar
- [ ] **AC9:** Rollback automático se falhar
- [ ] **AC10:** Toast de feedback (sucesso/erro)
- [ ] **AC11:** RLS garante que usuário só gerencia seus próprios favoritos

---

## Technical Notes

### Arquivos de Referência
- Schema: `Fase 01/SQL/003-biblioteca-schema-v3.sql` (tabela `user_favorites`)
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`

### Estrutura de Arquivos

```
src/lib/actions/favorites/
├── toggle.ts           # toggleFavorite()
├── get.ts              # getUserFavorites(), isFavorite()
├── check.ts            # checkFavorites() - batch check
└── index.ts

src/hooks/
└── useFavorite.ts      # Hook para componentes
```

### Server Actions

```typescript
// src/lib/actions/favorites/toggle.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ToggleFavoriteSchema, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(
  catalogId: string
): Promise<ActionResult<{ favorited: boolean }>> {
  const validated = ToggleFavoriteSchema.safeParse({ catalog_id: catalogId });
  if (!validated.success) {
    return { success: false, error: 'ID inválido', code: 'VALIDATION_ERROR' };
  }

  const supabase = await createClient();

  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  // Verificar se já é favorito
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('catalog_id', catalogId)
    .single();

  if (existing) {
    // Remover favorito
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', existing.id);

    if (error) {
      return { success: false, error: 'Falha ao remover favorito', code: 'DELETE_ERROR' };
    }

    revalidatePath('/biblioteca');
    return { success: true, data: { favorited: false } };
  } else {
    // Adicionar favorito
    const { error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        catalog_id: catalogId,
      });

    if (error) {
      return { success: false, error: 'Falha ao adicionar favorito', code: 'INSERT_ERROR' };
    }

    revalidatePath('/biblioteca');
    return { success: true, data: { favorited: true } };
  }
}
```

```typescript
// src/lib/actions/favorites/check.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/biblioteca';

export async function checkFavorites(
  catalogIds: string[]
): Promise<ActionResult<Record<string, boolean>>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: {} };
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select('catalog_id')
    .eq('user_id', user.id)
    .in('catalog_id', catalogIds);

  if (error) {
    return { success: false, error: 'Falha ao verificar favoritos', code: 'QUERY_ERROR' };
  }

  const favoriteMap: Record<string, boolean> = {};
  catalogIds.forEach(id => {
    favoriteMap[id] = data?.some(f => f.catalog_id === id) || false;
  });

  return { success: true, data: favoriteMap };
}
```

### Hook

```typescript
// src/hooks/useFavorite.ts
'use client';

import { useState, useTransition, useOptimistic, useCallback } from 'react';
import { toggleFavorite as toggleFavoriteAction } from '@/lib/actions/favorites/toggle';
import { toast } from 'sonner';

export function useFavorite(catalogId: string, initialState: boolean = false) {
  const [isPending, startTransition] = useTransition();
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    initialState,
    (_, newState: boolean) => newState
  );

  const toggle = useCallback(async () => {
    const newState = !optimisticFavorite;

    startTransition(async () => {
      setOptimisticFavorite(newState);

      const result = await toggleFavoriteAction(catalogId);

      if (!result.success) {
        // Rollback
        setOptimisticFavorite(!newState);
        toast.error(result.error || 'Erro ao atualizar favorito');
      } else {
        toast.success(newState ? 'Adicionado aos favoritos!' : 'Removido dos favoritos');
      }
    });
  }, [catalogId, optimisticFavorite, setOptimisticFavorite]);

  return {
    isFavorite: optimisticFavorite,
    isLoading: isPending,
    toggle,
  };
}
```

---

## Definition of Done

- [ ] Server Actions implementadas
- [ ] Toggle funciona corretamente (add/remove)
- [ ] Contador atualizado automaticamente via trigger
- [ ] Hook implementado com optimistic UI
- [ ] Rollback em caso de erro
- [ ] Toast de feedback
- [ ] RLS testado
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-104 (Página Explorar - para ter onde favoritar)

### Bloqueia
- EXIMIA-106 (Página Favoritos)
- EXIMIA-206 (Integração com Modo Leitura)

---

## Out of Scope

- Listas/coleções personalizadas
- Compartilhamento de favoritos
- Importar favoritos

---

*— River, removendo obstáculos 🌊*
