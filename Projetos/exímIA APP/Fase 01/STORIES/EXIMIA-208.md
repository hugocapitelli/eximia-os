# EXIMIA-208: Admin — Editor de Capítulos

> EPIC-002: Modo Leitura | Sprint 4-5 | 8 SP

---

## Story

| Campo | Valor |
|-------|-------|
| ID | EXIMIA-208 |
| Título | Admin — Editor de Capítulos |
| Epic | EPIC-002 |
| Story Points | 8 |
| Sprint | 4-5 |
| Prioridade | Alta |
| Assignee | @dev |

---

## User Story

**Como** Admin,
**Quero** criar e editar capítulos com editor rico,
**Para** produzir conteúdo de qualidade.

---

## Acceptance Criteria

- [ ] **AC1:** Página `/admin/resumos/[id]` com editor de capítulos
- [ ] **AC2:** Sidebar com lista de capítulos ordenados
- [ ] **AC3:** Adicionar novo capítulo via botão "+"
- [ ] **AC4:** Cada capítulo tem:
  - Campo título (obrigatório)
  - Campo subtítulo (opcional)
  - Editor de conteúdo (TipTap)
- [ ] **AC5:** Editor TipTap com formatação:
  - Negrito, itálico, sublinhado
  - Títulos (H2, H3)
  - Listas (ordenada, não-ordenada)
  - Citações (blockquote)
  - Links
- [ ] **AC6:** Conteúdo salvo como Markdown
- [ ] **AC7:** Autosave a cada 30 segundos de inatividade
- [ ] **AC8:** Indicador de "Salvando..." / "Salvo"
- [ ] **AC9:** Reordenação de capítulos via drag-and-drop
- [ ] **AC10:** Excluir capítulo com confirmação
- [ ] **AC11:** Contagem de palavras por capítulo
- [ ] **AC12:** Botão "Preview" abre modo leitura em nova aba
- [ ] **AC13:** Botão "Publicar" (ou "Despublicar") no header

---

## Technical Notes

### Arquivos de Referência
- Types: `Fase 01/TYPES/biblioteca.types.v3.ts`
- Schemas: `CreateChapterSchema`, `UpdateChapterSchema`, `ReorderChaptersSchema`

### Estrutura de Arquivos

```
src/app/(platform)/admin/resumos/[id]/
├── page.tsx                # Editor de resumo
└── layout.tsx

src/lib/actions/admin/chapters/
├── create.ts               # addChapter()
├── update.ts               # updateChapter()
├── delete.ts               # deleteChapter()
├── reorder.ts              # reorderChapters()
└── index.ts

src/components/admin/
├── ChapterEditor/
│   ├── ChapterEditor.tsx   # Container principal
│   ├── ChapterSidebar.tsx  # Lista de capítulos
│   ├── ChapterForm.tsx     # Formulário de capítulo
│   ├── TipTapEditor.tsx    # Editor rico
│   └── index.ts
└── ...
```

### Bibliotecas Necessárias

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install turndown  # Para converter HTML → Markdown
```

### Server Actions de Capítulos

```typescript
// src/lib/actions/admin/chapters/create.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateChapterSchema, SummaryChapter, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function addChapter(
  input: unknown
): Promise<ActionResult<SummaryChapter>> {
  const supabase = await createClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const validated = CreateChapterSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const { summary_id, chapter_number, title, subtitle, content, order_index } = validated.data;

  // Calcular word count
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  const { data, error } = await supabase
    .from('summary_chapters')
    .insert({
      summary_id,
      chapter_number,
      title,
      subtitle,
      content,
      order_index,
      word_count: wordCount,
    })
    .select()
    .single();

  if (error) {
    console.error('Add chapter error:', error);
    return { success: false, error: 'Falha ao adicionar capítulo', code: 'INSERT_ERROR' };
  }

  revalidatePath(`/admin/resumos/${summary_id}`);
  return { success: true, data };
}
```

```typescript
// src/lib/actions/admin/chapters/update.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { UpdateChapterSchema, SummaryChapter, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function updateChapter(
  chapterId: string,
  summaryId: string,
  input: unknown
): Promise<ActionResult<SummaryChapter>> {
  const supabase = await createClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const validated = UpdateChapterSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const updateData: Record<string, unknown> = { ...validated.data };

  // Recalcular word count se content mudou
  if (validated.data.content) {
    updateData.word_count = validated.data.content.split(/\s+/).filter(Boolean).length;
  }

  const { data, error } = await supabase
    .from('summary_chapters')
    .update(updateData)
    .eq('id', chapterId)
    .select()
    .single();

  if (error) {
    console.error('Update chapter error:', error);
    return { success: false, error: 'Falha ao atualizar capítulo', code: 'UPDATE_ERROR' };
  }

  revalidatePath(`/admin/resumos/${summaryId}`);
  return { success: true, data };
}
```

```typescript
// src/lib/actions/admin/chapters/reorder.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { ReorderChaptersSchema, ActionResult } from '@/types/biblioteca';
import { revalidatePath } from 'next/cache';

export async function reorderChapters(
  input: unknown
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado', code: 'FORBIDDEN' };
  }

  const validated = ReorderChaptersSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: 'Dados inválidos', code: 'VALIDATION_ERROR' };
  }

  const { summary_id, chapter_ids } = validated.data;

  // Atualizar order_index de cada capítulo
  const updates = chapter_ids.map((id, index) => ({
    id,
    order_index: index,
    chapter_number: index + 1,
  }));

  for (const update of updates) {
    const { error } = await supabase
      .from('summary_chapters')
      .update({
        order_index: update.order_index,
        chapter_number: update.chapter_number,
      })
      .eq('id', update.id);

    if (error) {
      return { success: false, error: 'Falha ao reordenar', code: 'UPDATE_ERROR' };
    }
  }

  revalidatePath(`/admin/resumos/${summary_id}`);
  return { success: true };
}
```

### Componente TipTap Editor

```tsx
// src/components/admin/ChapterEditor/TipTapEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import TurndownService from 'turndown';

interface TipTapEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

const turndown = new TurndownService();

export function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Comece a escrever...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndown.turndown(html);
      onChange(markdown);
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const url = prompt('URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-gray-900">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 self-center mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Título"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Subtítulo"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 self-center mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Lista"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Citação"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 self-center mx-1" />

        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
          title="Desfazer"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
          title="Refazer"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}
```

### Sidebar com Drag-and-Drop

```tsx
// src/components/admin/ChapterEditor/ChapterSidebar.tsx
'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { SummaryChapter } from '@/types/biblioteca';
import { reorderChapters, deleteChapter } from '@/lib/actions/admin/chapters';
import { toast } from 'sonner';

interface ChapterSidebarProps {
  summaryId: string;
  chapters: SummaryChapter[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

function SortableChapter({
  chapter,
  isSelected,
  onSelect,
  onDelete,
}: {
  chapter: SummaryChapter;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 p-2 rounded-lg cursor-pointer
        ${isSelected ? 'bg-amber-100 dark:bg-amber-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
      `}
      onClick={onSelect}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <span className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">
        {chapter.chapter_number}
      </span>

      <span className="flex-1 truncate text-sm">{chapter.title}</span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ChapterSidebar({
  summaryId,
  chapters,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
}: ChapterSidebarProps) {
  const [items, setItems] = useState(chapters);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Salvar nova ordem
      const result = await reorderChapters({
        summary_id: summaryId,
        chapter_ids: newItems.map(item => item.id),
      });

      if (!result.success) {
        toast.error('Falha ao reordenar');
        setItems(items); // Rollback
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este capítulo?')) return;

    const result = await deleteChapter(id, summaryId);
    if (result.success) {
      setItems(items.filter(item => item.id !== id));
      onDelete(id);
      toast.success('Capítulo excluído');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Capítulos</h3>
        <button
          onClick={onAdd}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          title="Adicionar capítulo"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {items.map((chapter) => (
                <SortableChapter
                  key={chapter.id}
                  chapter={chapter}
                  isSelected={selectedId === chapter.id}
                  onSelect={() => onSelect(chapter.id)}
                  onDelete={() => handleDelete(chapter.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Nenhum capítulo</p>
            <button
              onClick={onAdd}
              className="text-amber-500 text-sm mt-2"
            >
              Adicionar primeiro capítulo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Definition of Done

- [ ] Página de editor de resumo funcional
- [ ] Sidebar com lista de capítulos
- [ ] Adicionar capítulo funcional
- [ ] Editor TipTap com formatação
- [ ] Conteúdo salvo como Markdown
- [ ] Autosave implementado
- [ ] Indicador de salvamento
- [ ] Drag-and-drop para reordenar
- [ ] Excluir capítulo com confirmação
- [ ] Contagem de palavras
- [ ] Preview funcional
- [ ] Publicar/Despublicar no header
- [ ] Testes de integração
- [ ] PR aprovado

---

## Dependências

### Bloqueado por
- EXIMIA-207 (Admin Criar Resumos)

### Bloqueia
- Nenhuma (última story do EPIC-002)

---

## Bibliotecas

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install turndown
```

---

## Out of Scope

- Imagens no editor
- Vídeos incorporados
- Code blocks com syntax highlighting
- Colaboração em tempo real
- Versionamento de conteúdo

---

*— River, removendo obstáculos 🌊*
