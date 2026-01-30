# Story EXIMIA-014: Inbox Module

**Story ID:** EXIMIA-014
**Epic:** EXIMIA-EPIC-005 (Connection Layer Features)
**Sprint:** 4
**Pontos:** 8
**Prioridade:** P1 (Alto)
**Depende de:** EXIMIA-001 (Connection Layer Schema)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** capturar pensamentos rapidamente e ter sugestões de onde salvar,
**Para que** nada se perca e tudo seja organizado automaticamente.

---

## Contexto

A Inbox é o ponto de entrada universal do sistema:
- Captura rápida de texto/voz/links
- IA sugere destino (Goal, Habit, Book, etc.)
- Usuário confirma ou edita sugestão
- Item é criado no módulo correto

---

## Acceptance Criteria

### Database
- [ ] Tabela `inbox_items` criada
- [ ] Tipos: text, voice, link, image
- [ ] Status: pending, processed, archived

### API
- [ ] `createInboxItem(data)` — Criar item
- [ ] `getInboxItems(filters)` — Listar items
- [ ] `processInboxItem(id, destination)` — Mover para destino
- [ ] `archiveInboxItem(id)` — Arquivar

### UI
- [ ] Quick capture input fixo
- [ ] Lista de items pending
- [ ] Badge com sugestão da IA
- [ ] Botões Accept/Edit/Archive
- [ ] Voice recording (UI apenas, funcionalidade futura)

### AI Suggestion (Mock)
- [ ] Análise básica de keywords
- [ ] Sugestão de módulo destino
- [ ] Confidence score

---

## Technical Details

### Schema

```sql
-- supabase/migrations/003_inbox_module.sql

CREATE TYPE inbox_item_type AS ENUM ('text', 'voice', 'link', 'image');
CREATE TYPE inbox_item_status AS ENUM ('pending', 'processing', 'processed', 'archived');

CREATE TABLE inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  type inbox_item_type NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- URL preview, voice duration, etc.

  -- AI Suggestion
  suggested_module TEXT,
  suggested_type TEXT,
  suggested_params JSONB DEFAULT '{}',
  suggestion_confidence DECIMAL(3,2),
  suggestion_reasoning TEXT,

  -- Status
  status inbox_item_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  processed_to_module TEXT,
  processed_to_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_inbox_user_id ON inbox_items(user_id);
CREATE INDEX idx_inbox_status ON inbox_items(status) WHERE status = 'pending';
CREATE INDEX idx_inbox_created ON inbox_items(created_at DESC);

-- RLS
ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own inbox" ON inbox_items
  FOR ALL USING (auth.uid() = user_id);
```

### API Actions

```typescript
// lib/actions/inbox.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { analyzeInboxItem } from "@/lib/ai/inbox-analyzer";

export async function createInboxItem(input: {
  content: string;
  type?: "text" | "voice" | "link" | "image";
  metadata?: Record<string, any>;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Analyze with AI (mock for now)
  const suggestion = await analyzeInboxItem(input.content);

  const { data, error } = await supabase
    .from("inbox_items")
    .insert({
      user_id: user.id,
      type: input.type || "text",
      content: input.content,
      metadata: input.metadata || {},
      suggested_module: suggestion.module,
      suggested_type: suggestion.type,
      suggested_params: suggestion.params,
      suggestion_confidence: suggestion.confidence,
      suggestion_reasoning: suggestion.reasoning,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/inbox");
  return data;
}

export async function getInboxItems(status: "pending" | "processed" | "archived" = "pending") {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function processInboxItem(
  id: string,
  destination: { module: string; type: string; params?: Record<string, any> }
) {
  const supabase = createClient();

  // Create item in destination module
  let createdId: string | null = null;

  if (destination.module === "journey" && destination.type === "goal") {
    const { createGoal } = await import("@/lib/actions/journey");
    const goal = await createGoal({ title: destination.params?.title || "Nova meta" });
    createdId = goal.id;
  } else if (destination.module === "journey" && destination.type === "habit") {
    const { createHabit } = await import("@/lib/actions/journey");
    const habit = await createHabit({ title: destination.params?.title || "Novo hábito" });
    createdId = habit.id;
  }
  // Add more destination handlers...

  // Update inbox item
  const { error } = await supabase
    .from("inbox_items")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
      processed_to_module: destination.module,
      processed_to_id: createdId,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/inbox");
}

export async function archiveInboxItem(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("inbox_items")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/inbox");
}
```

### AI Analyzer (Mock)

```typescript
// lib/ai/inbox-analyzer.ts

interface InboxSuggestion {
  module: string;
  type: string;
  params: Record<string, any>;
  confidence: number;
  reasoning: string;
}

const KEYWORDS = {
  goal: ["meta", "objetivo", "alcançar", "atingir", "lançar", "criar", "desenvolver"],
  habit: ["hábito", "rotina", "diário", "diariamente", "todo dia", "sempre"],
  book: ["ler", "livro", "leitura", "autor", "páginas"],
  task: ["fazer", "tarefa", "pendente", "revisar", "enviar", "responder"],
};

export async function analyzeInboxItem(content: string): Promise<InboxSuggestion> {
  const lowerContent = content.toLowerCase();

  // Simple keyword matching (replace with real AI later)
  let bestMatch = { module: "journey", type: "task", score: 0 };

  for (const [type, keywords] of Object.entries(KEYWORDS)) {
    const matches = keywords.filter((k) => lowerContent.includes(k)).length;
    if (matches > bestMatch.score) {
      bestMatch = {
        module: type === "book" ? "journey" : "journey",
        type,
        score: matches,
      };
    }
  }

  const confidence = Math.min(0.95, 0.5 + bestMatch.score * 0.15);

  return {
    module: bestMatch.module,
    type: bestMatch.type,
    params: { title: content.slice(0, 100) },
    confidence,
    reasoning: `Detectado como ${bestMatch.type} baseado em palavras-chave`,
  };
}
```

---

## Tasks

- [ ] Criar migration `003_inbox_module.sql`
- [ ] Implementar inbox API actions
- [ ] Criar AI analyzer mock
- [ ] Conectar Inbox page com API
- [ ] Implementar quick capture
- [ ] Implementar InboxItem component
- [ ] Implementar process flow
- [ ] Testar fluxo completo

---

## Definition of Done

- [ ] Captura funcionando
- [ ] Sugestões aparecendo
- [ ] Process/Archive funcionando
- [ ] Items criados no módulo destino
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── 003_inbox_module.sql          [CREATE]

lib/
├── actions/
│   └── inbox.ts                  [CREATE]
└── ai/
    └── inbox-analyzer.ts         [CREATE]

app/(dashboard)/inbox/
└── page.tsx                      [MODIFY]

components/inbox/
├── QuickCapture.tsx              [CREATE]
├── InboxItemCard.tsx             [CREATE]
└── index.ts                      [CREATE]
```

---

**Story criada por River (SM)**
**Data:** 2026-01-29
