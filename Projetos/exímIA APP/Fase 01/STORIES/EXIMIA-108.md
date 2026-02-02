# EXIMIA-108: Sistema de Notas

> EPIC-001: Biblioteca Core | Sprint 3 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-108 |
| Título | Sistema de Notas e Anotações |
| Epic | EPIC-001 |
| Story Points | 8 |
| Sprint | 3 |
| Prioridade | Média |
| Assignee | @dev |

---

## User Story

**Como** usuário,
**Quero** criar notas em livros favoritados,
**Para** guardar insights, highlights e citações importantes.

---

## Acceptance Criteria

- [ ] **AC1:** Server Action `createNote(data)` implementada
- [ ] **AC2:** Server Action `getNotes(catalogId, filters)` implementada
- [ ] **AC3:** Server Action `updateNote(id, data)` implementada
- [ ] **AC4:** Server Action `deleteNote(id)` implementada
- [ ] **AC5:** Tipos de nota suportados:
  - `note` — Anotação livre
  - `highlight` — Destaque
  - `quote` — Citação
- [ ] **AC6:** Campos da nota:
  - `type` (obrigatório)
  - `content` (obrigatório, max 10000 chars)
  - `page_number` (opcional)
  - `chapter` (opcional)
- [ ] **AC7:** Componente `NoteEditor` com:
  - Seletor de tipo (com ícones)
  - Textarea para conteúdo
  - Campos opcionais (página, capítulo)
  - Botões Salvar/Cancelar
- [ ] **AC8:** Componente `NoteCard` com:
  - Ícone e cor por tipo
  - Conteúdo (truncado se longo)
  - Metadata (página, capítulo, data)
  - Menu de ações (editar, excluir)
- [ ] **AC9:** Componente `NoteList` com:
  - Filtro por tipo
  - Ordenação (data, página)
  - Lista de cards
- [ ] **AC10:** Aba "Notas" na página de detalhe do livro
- [ ] **AC11:** Estado vazio: "Nenhuma nota ainda"
- [ ] **AC12:** Confirmação antes de excluir
- [ ] **AC13:** RLS: usuário só vê/edita suas próprias notas

---

## Technical Notes

### Arquivos de Referência
- Schema: `Fase 01/SQL/003-biblioteca-schema-v3.sql` (tabela `user_notes`)
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Constantes: `NOTE_TYPE_CONFIG`

### Estrutura de Arquivos

```
src/lib/actions/notes/
├── create.ts           # createNote()
├── get.ts              # getNotes()
├── update.ts           # updateNote()
├── delete.ts           # deleteNote()
└── index.ts

src/components/biblioteca/Notes/
├── NoteEditor.tsx
├── NoteCard.tsx
├── NoteList.tsx
├── NoteTypeSelector.tsx
└── index.ts
```

### Server Actions

```typescript
// src/lib/actions/notes/create.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateNoteSchema, UserNote, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function createNote(
  input: unknown
): Promise<ActionResult<UserNote>> {
  const validated = CreateNoteSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .insert({
      ...validated.data,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Create note error:', error);
    return { success: false, error: 'Falha ao criar nota', code: 'INSERT_ERROR' };
  }

  revalidatePath(`/biblioteca/livro/${validated.data.catalog_id}`);
  return { success: true, data };
}
```

```typescript
// src/lib/actions/notes/get.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { NoteFilters, UserNote, ActionResult } from '@/types/biblioteca';

export async function getNotes(
  filters: NoteFilters
): Promise<ActionResult<UserNote[]>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const {
    catalog_id,
    type,
    orderBy = 'created_at',
    orderDir = 'desc',
  } = filters;

  let query = supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('catalog_id', catalog_id);

  if (type) {
    query = query.eq('type', type);
  }

  query = query.order(orderBy, { ascending: orderDir === 'asc' });

  const { data, error } = await query;

  if (error) {
    console.error('Get notes error:', error);
    return { success: false, error: 'Falha ao carregar notas', code: 'QUERY_ERROR' };
  }

  return { success: true, data: data || [] };
}
```

```typescript
// src/lib/actions/notes/update.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { UpdateNoteSchema, UserNote, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function updateNote(
  id: string,
  input: unknown
): Promise<ActionResult<UserNote>> {
  const validated = UpdateNoteSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { data, error } = await supabase
    .from('user_notes')
    .update(validated.data)
    .eq('id', id)
    .eq('user_id', user.id) // RLS adicional
    .select()
    .single();

  if (error) {
    console.error('Update note error:', error);
    return { success: false, error: 'Falha ao atualizar nota', code: 'UPDATE_ERROR' };
  }

  revalidatePath(`/biblioteca/livro/${data.catalog_id}`);
  return { success: true, data };
}
```

```typescript
// src/lib/actions/notes/delete.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function deleteNote(
  id: string,
  catalogId: string
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Não autenticado', code: 'UNAUTHORIZED' };
  }

  const { error } = await supabase
    .from('user_notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // RLS adicional

  if (error) {
    console.error('Delete note error:', error);
    return { success: false, error: 'Falha ao excluir nota', code: 'DELETE_ERROR' };
  }

  revalidatePath(`/biblioteca/livro/${catalogId}`);
  return { success: true };
}
```

### Componente de Editor

```tsx
// src/components/biblioteca/Notes/NoteEditor.tsx
'use client';

import { useState } from 'react';
import { NoteType, NOTE_TYPE_CONFIG } from '@/types/biblioteca';
import { createNote, updateNote } from '@/lib/actions/notes';
import { toast } from 'sonner';

interface NoteEditorProps {
  catalogId: string;
  note?: UserNote;
  defaultType?: NoteType;
  onSave?: (note: UserNote) => void;
  onCancel?: () => void;
}

export function NoteEditor({
  catalogId,
  note,
  defaultType = 'note',
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [type, setType] = useState<NoteType>(note?.type || defaultType);
  const [content, setContent] = useState(note?.content || '');
  const [pageNumber, setPageNumber] = useState(note?.page_number?.toString() || '');
  const [chapter, setChapter] = useState(note?.chapter || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Conteúdo é obrigatório');
      return;
    }

    setSaving(true);

    const data = {
      catalog_id: catalogId,
      type,
      content: content.trim(),
      page_number: pageNumber ? parseInt(pageNumber) : undefined,
      chapter: chapter || undefined,
    };

    const result = note
      ? await updateNote(note.id, data)
      : await createNote(data);

    setSaving(false);

    if (result.success && result.data) {
      toast.success(note ? 'Nota atualizada!' : 'Nota criada!');
      onSave?.(result.data);
    } else {
      toast.error(result.error || 'Erro ao salvar nota');
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      {/* Seletor de Tipo */}
      <div className="flex gap-2">
        {(Object.keys(NOTE_TYPE_CONFIG) as NoteType[]).map((noteType) => {
          const config = NOTE_TYPE_CONFIG[noteType];
          return (
            <button
              key={noteType}
              onClick={() => setType(noteType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                type === noteType
                  ? 'border-2'
                  : 'border-gray-200'
              }`}
              style={{
                borderColor: type === noteType ? config.color : undefined,
                backgroundColor: type === noteType ? config.bgColor : undefined,
              }}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          type === 'quote'
            ? 'Digite a citação...'
            : type === 'highlight'
            ? 'O que você quer destacar?'
            : 'Escreva sua nota...'
        }
        className="w-full h-32 p-3 border rounded-lg resize-none"
        maxLength={10000}
      />

      {/* Campos opcionais */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Página</label>
          <input
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            placeholder="Ex: 42"
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Capítulo</label>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Ex: Introdução"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}
```

### Componente de Card

```tsx
// src/components/biblioteca/Notes/NoteCard.tsx
'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { UserNote, NOTE_TYPE_CONFIG } from '@/types/biblioteca';
import { deleteNote } from '@/lib/actions/notes';
import { toast } from 'sonner';

interface NoteCardProps {
  note: UserNote;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const config = NOTE_TYPE_CONFIG[note.type];

  const handleDelete = async () => {
    if (!confirm('Excluir esta nota?')) return;

    setDeleting(true);
    const result = await deleteNote(note.id, note.catalog_id);
    setDeleting(false);

    if (result.success) {
      toast.success('Nota excluída');
      onDelete?.();
    } else {
      toast.error(result.error || 'Erro ao excluir');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className="p-4 rounded-lg border-l-4"
      style={{ borderColor: config.color, backgroundColor: config.bgColor }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-sm font-medium" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-black/10 rounded"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded border z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onEdit?.();
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>

      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        {note.page_number && <span>Página {note.page_number}</span>}
        {note.chapter && <span>{note.chapter}</span>}
        <span>{formatDate(note.created_at)}</span>
      </div>
    </div>
  );
}
```

---

## Definition of Done

- [ ] CRUD de notas implementado
- [ ] Três tipos de nota funcionando
- [ ] Componentes de UI implementados
- [ ] Aba Notas integrada na página de detalhe
- [ ] Filtros e ordenação funcionando
- [ ] Estado vazio
- [ ] Confirmação de exclusão
- [ ] RLS testado
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-107 (Página de Detalhe - para integrar aba)

### Bloqueia
- Nenhuma (última story do EPIC-001)

---

## Out of Scope

- Notas públicas/compartilhadas
- Anexar imagens às notas
- Exportar notas
- Tags/labels nas notas

---

*— River, removendo obstáculos 🌊*
