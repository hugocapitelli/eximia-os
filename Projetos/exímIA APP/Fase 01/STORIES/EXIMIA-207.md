# EXIMIA-207: Admin — Criar e Editar Resumos

> EPIC-002: Modo Leitura | Sprint 4 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-207 |
| Título | Admin — Criar e Gerenciar Resumos |
| Epic | EPIC-002 |
| Story Points | 8 |
| Sprint | 4 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** Admin,
**Quero** criar resumos para livros do catálogo,
**Para** disponibilizar conteúdo estruturado aos usuários.

---

## Acceptance Criteria

- [ ] **AC1:** Rota `/admin/resumos` protegida por role admin
- [ ] **AC2:** Lista de resumos existentes com:
  - Capa do livro
  - Título
  - Status (Rascunho / Publicado)
  - Número de capítulos
  - Data de criação
  - Ações (Editar, Preview, Publicar)
- [ ] **AC3:** Botão "Novo Resumo" abre seletor de livro
- [ ] **AC4:** Seletor de livro:
  - Busca no catálogo
  - Mostra apenas livros SEM resumo
  - Card com capa e título
- [ ] **AC5:** Server Action `createSummary(data)` — Admin only
- [ ] **AC6:** Server Action `updateSummary(id, data)` — Admin only
- [ ] **AC7:** Server Action `publishSummary(id)` — Admin only
- [ ] **AC8:** Server Action `unpublishSummary(id)` — Admin only
- [ ] **AC9:** Server Action `deleteSummary(id)` — Admin only
- [ ] **AC10:** Verificação de role em todas as actions
- [ ] **AC11:** Redirect para login se não autenticado
- [ ] **AC12:** Redirect para home se não admin

---

## Technical Notes

### Arquivos de Referência
- Schema: `Fase 01/SQL/003-biblioteca-schema-v3.sql`
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Schemas: `CreateSummarySchema`

### Estrutura de Arquivos

```
src/app/(platform)/admin/
├── layout.tsx              # Layout com verificação de admin
├── resumos/
│   ├── page.tsx            # Lista de resumos
│   ├── novo/
│   │   └── page.tsx        # Seletor de livro
│   └── [id]/
│       ├── page.tsx        # Editor de resumo
│       └── layout.tsx
└── ...

src/lib/actions/admin/summaries/
├── create.ts               # createSummary()
├── update.ts               # updateSummary()
├── publish.ts              # publishSummary(), unpublishSummary()
├── delete.ts               # deleteSummary()
├── list.ts                 # listSummaries()
└── index.ts

src/components/admin/
├── AdminLayout.tsx
├── SummaryList.tsx
├── SummaryCard.tsx
├── BookSelector.tsx
└── ...
```

### Layout Admin com Verificação

```tsx
// src/app/(platform)/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?redirect=/admin/resumos');
  }

  // Verificar role admin
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    redirect('/biblioteca');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Painel Admin</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

### Server Actions Admin

```typescript
// src/lib/actions/admin/summaries/create.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateSummarySchema, BookSummary, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function createSummary(
  input: unknown
): Promise<ActionResult<BookSummary>> {
  const supabase = await createClient();

  // Verificar admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  // Validar input
  const validated = CreateSummarySchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  // Verificar se já existe resumo para este livro
  const { data: existing } = await supabase
    .from('book_summaries')
    .select('id')
    .eq('catalog_id', validated.data.catalog_id)
    .single();

  if (existing) {
    return { success: false, error: 'Este livro já possui um resumo', code: 'DUPLICATE' };
  }

  // Criar resumo
  const { data, error } = await supabase
    .from('book_summaries')
    .insert({
      catalog_id: validated.data.catalog_id,
      title: validated.data.title,
      created_by: user.id,
      is_published: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Create summary error:', error);
    return { success: false, error: 'Falha ao criar resumo', code: 'INSERT_ERROR' };
  }

  revalidatePath('/admin/resumos');
  return { success: true, data };
}
```

```typescript
// src/lib/actions/admin/summaries/publish.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function publishSummary(
  summaryId: string
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  // Verificar admin
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  // Verificar se tem pelo menos 1 capítulo
  const { count } = await supabase
    .from('summary_chapters')
    .select('*', { count: 'exact', head: true })
    .eq('summary_id', summaryId);

  if (!count || count === 0) {
    return { success: false, error: 'Adicione pelo menos um capítulo antes de publicar', code: 'NO_CHAPTERS' };
  }

  // Publicar
  const { error } = await supabase
    .from('book_summaries')
    .update({
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq('id', summaryId);

  if (error) {
    return { success: false, error: 'Falha ao publicar', code: 'UPDATE_ERROR' };
  }

  revalidatePath('/admin/resumos');
  revalidatePath('/biblioteca');
  return { success: true };
}

export async function unpublishSummary(
  summaryId: string
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { error } = await supabase
    .from('book_summaries')
    .update({
      is_published: false,
      published_at: null,
    })
    .eq('id', summaryId);

  if (error) {
    return { success: false, error: 'Falha ao despublicar', code: 'UPDATE_ERROR' };
  }

  revalidatePath('/admin/resumos');
  revalidatePath('/biblioteca');
  return { success: true };
}
```

```typescript
// src/lib/actions/admin/summaries/list.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/biblioteca';

interface SummaryListItem {
  id: string;
  title: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  chapter_count: number;
  catalog: {
    id: string;
    title: string;
    author_name: string;
    cover_url: string | null;
  };
}

export async function listSummaries(): Promise<ActionResult<SummaryListItem[]>> {
  const supabase = await createClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const { data, error } = await supabase
    .from('book_summaries')
    .select(`
      id,
      title,
      is_published,
      published_at,
      created_at,
      book_catalog (
        id,
        title,
        author_name,
        cover_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: 'Falha ao carregar resumos', code: 'QUERY_ERROR' };
  }

  // Buscar contagem de capítulos
  const summariesWithCount = await Promise.all(
    (data || []).map(async (summary) => {
      const { count } = await supabase
        .from('summary_chapters')
        .select('*', { count: 'exact', head: true })
        .eq('summary_id', summary.id);

      return {
        ...summary,
        chapter_count: count || 0,
        catalog: summary.book_catalog,
      };
    })
  );

  return { success: true, data: summariesWithCount };
}
```

### Componente de Lista

```tsx
// src/components/admin/SummaryList.tsx
'use client';

import { useState } from 'react';
import { Eye, Edit, Globe, GlobeLock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { publishSummary, unpublishSummary, deleteSummary } from '@/lib/actions/admin/summaries';
import { toast } from 'sonner';

interface SummaryListProps {
  summaries: SummaryListItem[];
}

export function SummaryList({ summaries }: SummaryListProps) {
  const [items, setItems] = useState(summaries);

  const handlePublish = async (id: string, isPublished: boolean) => {
    const action = isPublished ? unpublishSummary : publishSummary;
    const result = await action(id);

    if (result.success) {
      toast.success(isPublished ? 'Despublicado!' : 'Publicado!');
      // Atualizar estado local
      setItems(items.map(item =>
        item.id === id ? { ...item, is_published: !isPublished } : item
      ));
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;

    const result = await deleteSummary(id);
    if (result.success) {
      toast.success('Resumo excluído');
      setItems(items.filter(item => item.id !== id));
    } else {
      toast.error(result.error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Nenhum resumo criado ainda.</p>
        <Link
          href="/admin/resumos/novo"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg inline-block"
        >
          Criar Primeiro Resumo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((summary) => (
        <div
          key={summary.id}
          className="bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center gap-4"
        >
          {/* Capa */}
          <div className="w-16 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
            {summary.catalog.cover_url ? (
              <img
                src={summary.catalog.cover_url}
                alt={summary.catalog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">📚</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{summary.catalog.title}</h3>
            <p className="text-sm text-muted-foreground">{summary.catalog.author_name}</p>
            <p className="text-sm mt-1">
              {summary.chapter_count} capítulos
              {summary.is_published ? (
                <span className="ml-2 text-green-600">• Publicado</span>
              ) : (
                <span className="ml-2 text-yellow-600">• Rascunho</span>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/biblioteca/livro/${summary.catalog.id}/ler`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Preview"
            >
              <Eye className="w-5 h-5" />
            </Link>

            <Link
              href={`/admin/resumos/${summary.id}`}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title="Editar"
            >
              <Edit className="w-5 h-5" />
            </Link>

            <button
              onClick={() => handlePublish(summary.id, summary.is_published)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              title={summary.is_published ? 'Despublicar' : 'Publicar'}
            >
              {summary.is_published ? (
                <GlobeLock className="w-5 h-5 text-green-600" />
              ) : (
                <Globe className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => handleDelete(summary.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-600"
              title="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Definition of Done

- [ ] Rota admin protegida
- [ ] Lista de resumos funcional
- [ ] Criar novo resumo funcional
- [ ] Seletor de livro funcional
- [ ] Publicar/Despublicar funcional
- [ ] Excluir com confirmação
- [ ] Verificações de admin em todas as actions
- [ ] Redirects apropriados
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-103 (Admin Adicionar Livro - para ter livros no catálogo)

### Bloqueia
- EXIMIA-208 (Editor de Capítulos)

---

## Out of Scope

- Sistema de permissões granular (só admin por enquanto)
- Histórico de alterações
- Múltiplos autores de resumo
- Templates de resumo

---

*— River, removendo obstáculos 🌊*
