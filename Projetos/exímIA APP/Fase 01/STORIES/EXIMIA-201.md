# EXIMIA-201: Server Actions de Resumos (Leitura)

> EPIC-002: Modo Leitura | Sprint 3 | 5 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-201 |
| Título | Server Actions de Resumos — Leitura |
| Epic | EPIC-002 |
| Story Points | 5 |
| Sprint | 3 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** acessar resumos publicados,
**Para** ler conteúdos disponíveis.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `getSummaryByCatalog(catalogId)` implementada
- [ ] **AC2:** Server Action `getSummaryWithChapters(summaryId)` implementada
- [ ] **AC3:** Server Action `getChapter(summaryId, chapterNumber)` implementada
- [ ] **AC4:** Server Action `saveReadingProgress(data)` implementada
- [ ] **AC5:** Server Action `getReadingProgress(summaryId)` implementada
- [ ] **AC6:** Server Action `saveReadingPreferences(prefs)` implementada
- [ ] **AC7:** Server Action `getReadingPreferences()` implementada
- [ ] **AC8:** Apenas resumos com `is_published = true` são retornados para usuários normais
- [ ] **AC9:** Admin pode ver resumos não publicados
- [ ] **AC10:** Validação com Zod em todas as actions
- [ ] **AC11:** RLS garante acesso correto

---

## Technical Notes

### Arquivos de Referência
- Schema: `Fase 01/SQL/003-biblioteca-schema-v3.sql`
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Schemas: `SaveSummaryProgressSchema`, `SaveReadingPreferencesSchema`

### Estrutura de Arquivos

```
src/lib/actions/summaries/
├── get.ts              # getSummary*, getChapter
├── progress.ts         # saveProgress, getProgress
└── index.ts

src/lib/actions/preferences/
├── reading.ts          # save/get ReadingPreferences
└── index.ts
```

### Server Actions

```typescript
// src/lib/actions/summaries/get.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import {
  BookSummary,
  SummaryWithChapters,
  SummaryChapter,
  ActionResult
} from '@/types/biblioteca';

export async function getSummaryByCatalog(
  catalogId: string
): Promise<ActionResult<BookSummary | null>> {
  const supabase = await createClient();

  // Verificar se é admin
  const { data: isAdmin } = await supabase.rpc('is_admin');

  let query = supabase
    .from('book_summaries')
    .select('*')
    .eq('catalog_id', catalogId);

  // Se não for admin, só mostra publicados
  if (!isAdmin) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    console.error('Get summary error:', error);
    return { success: false, error: 'Falha ao carregar resumo', code: 'QUERY_ERROR' };
  }

  return { success: true, data };
}

export async function getSummaryWithChapters(
  summaryId: string
): Promise<ActionResult<SummaryWithChapters | null>> {
  const supabase = await createClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');

  // Buscar resumo
  let summaryQuery = supabase
    .from('book_summaries')
    .select('*, book_catalog(*)')
    .eq('id', summaryId);

  if (!isAdmin) {
    summaryQuery = summaryQuery.eq('is_published', true);
  }

  const { data: summary, error: summaryError } = await summaryQuery.single();

  if (summaryError) {
    if (summaryError.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: 'Falha ao carregar resumo', code: 'QUERY_ERROR' };
  }

  // Buscar capítulos
  const { data: chapters, error: chaptersError } = await supabase
    .from('summary_chapters')
    .select('*')
    .eq('summary_id', summaryId)
    .order('order_index');

  if (chaptersError) {
    return { success: false, error: 'Falha ao carregar capítulos', code: 'QUERY_ERROR' };
  }

  return {
    success: true,
    data: {
      ...summary,
      chapters: chapters || [],
      catalog: summary.book_catalog,
    },
  };
}

export async function getChapter(
  summaryId: string,
  chapterNumber: number
): Promise<ActionResult<SummaryChapter | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('summary_chapters')
    .select('*')
    .eq('summary_id', summaryId)
    .eq('chapter_number', chapterNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: 'Falha ao carregar capítulo', code: 'QUERY_ERROR' };
  }

  return { success: true, data };
}
```

```typescript
// src/lib/actions/summaries/progress.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import {
  SaveSummaryProgressSchema,
  SummaryReadingProgress,
  ActionResult
} from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function saveReadingProgress(
  input: unknown
): Promise<ActionResult<SummaryReadingProgress>> {
  const validated = SaveSummaryProgressSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { summary_id, current_chapter, completed } = validated.data;

  // Upsert progress
  const { data, error } = await supabase
    .from('summary_reading_progress')
    .upsert(
      {
        user_id: user.id,
        summary_id,
        current_chapter,
        completed: completed || false,
        last_read_at: new Date().toISOString(),
        completed_at: completed ? new Date().toISOString() : null,
      },
      {
        onConflict: 'user_id,summary_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Save progress error:', error);
    return { success: false, error: 'Falha ao salvar progresso', code: 'UPSERT_ERROR' };
  }

  return { success: true, data };
}

export async function getReadingProgress(
  summaryId: string
): Promise<ActionResult<SummaryReadingProgress | null>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: null };
  }

  const { data, error } = await supabase
    .from('summary_reading_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('summary_id', summaryId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: 'Falha ao carregar progresso', code: 'QUERY_ERROR' };
  }

  return { success: true, data };
}
```

```typescript
// src/lib/actions/preferences/reading.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import {
  SaveReadingPreferencesSchema,
  UserReadingPreferences,
  ActionResult
} from '@/types/biblioteca';

export async function saveReadingPreferences(
  input: unknown
): Promise<ActionResult<UserReadingPreferences>> {
  const validated = SaveReadingPreferencesSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_reading_preferences')
    .upsert(
      {
        user_id: user.id,
        ...validated.data,
      },
      {
        onConflict: 'user_id',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Save preferences error:', error);
    return { success: false, error: 'Falha ao salvar preferências', code: 'UPSERT_ERROR' };
  }

  return { success: true, data };
}

export async function getReadingPreferences(): Promise<ActionResult<UserReadingPreferences | null>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: true, data: null };
  }

  const { data, error } = await supabase
    .from('user_reading_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Retornar defaults se não existir
      return {
        success: true,
        data: {
          id: '',
          user_id: user.id,
          theme: 'dark',
          font_size: 'medium',
          updated_at: new Date().toISOString(),
        },
      };
    }
    return { success: false, error: 'Falha ao carregar preferências', code: 'QUERY_ERROR' };
  }

  return { success: true, data };
}
```

---

## Definition of Done

- [ ] Todas as Server Actions implementadas
- [ ] Resumos publicados acessíveis a todos
- [ ] Admin pode ver não publicados
- [ ] Progresso salvo corretamente (upsert)
- [ ] Preferências persistidas
- [ ] Validação com Zod
- [ ] RLS testado
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-101 (Schema V3)

### Bloqueia
- EXIMIA-202 (Componente ReadingMode)
- EXIMIA-205 (Progresso de Leitura)

---

## Out of Scope

- Server Actions de criação de resumos (EXIMIA-207)
- Bookmarks por posição no texto
- Sync offline

---

*— River, removendo obstáculos 🌊*
