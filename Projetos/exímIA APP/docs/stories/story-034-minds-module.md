# Story EXIMIA-034: Minds Module (AI Clones)

**Story ID:** EXIMIA-034
**Epic:** EXIMIA-EPIC-011 (Minds Module)
**Sprint:** 12
**Pontos:** 21
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** conversar com AI Minds (clones de personalidades e especialistas),
**Para que** eu possa aprender e receber orientação de mentores virtuais.

---

## Contexto

Módulo de Minds permite conversar com clones de IA de personalidades famosas
(David Goggins, Elon Musk, etc.) e especialistas. Inclui arquivos para download
(se configurado pelo admin) e integração com autores da biblioteca de livros.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Main Page Spec** | `docs/features/Minds/MINDS_MAIN.md` | Lista de Minds |
| **Detail Page Spec** | `docs/features/Minds/MINDS_DETAIL.md` | Chat e arquivos |
| **Mock Data** | `app/src/data/minds-*.ts` | Dados de exemplo |

---

## Acceptance Criteria

### Database Schema
- [ ] Tabelas: minds, mind_files, mind_conversations, mind_messages
- [ ] Admin-only: criação/edição de Minds
- [ ] User: conversas e downloads
- [ ] RLS policies

### Minds Main Page
- [ ] Grid de Minds disponíveis
- [ ] Filtros por categoria
- [ ] Busca por nome/especialidade
- [ ] Card com avatar, nome, tags, rating
- [ ] Badge de arquivos disponíveis
- [ ] Featured Mind em destaque
- [ ] Seção "Recentes" (últimas conversas)

### Mind Detail Page
- [ ] Perfil completo (bio, expertise, quote)
- [ ] Lista de arquivos (se permitido download)
- [ ] Interface de chat
- [ ] Streaming de respostas
- [ ] Suggested prompts
- [ ] Histórico de conversas

### Chat Features
- [ ] Mensagens user/assistant
- [ ] Streaming response (typewriter effect)
- [ ] Botão de "Nova Conversa"
- [ ] Salvar/continuar conversas anteriores
- [ ] Personality-aware responses (system prompt customizado)

### Files & Downloads
- [ ] Lista de arquivos do Mind
- [ ] Preview quando possível
- [ ] Download (se admin permitir)
- [ ] Badge "Download não disponível" se bloqueado

### Integração Journey Authors
- [ ] Se Mind corresponde a autor de livro, mostrar link
- [ ] Na página do livro, mostrar link para Mind do autor

---

## Technical Details

### Database Schema

```sql
-- =============================================
-- MINDS MODULE SCHEMA
-- =============================================

-- Minds (admin-created)
CREATE TABLE minds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  title TEXT, -- "Can't Hurt Me Author & Ultra-Athlete"
  bio TEXT,
  short_bio TEXT,

  -- Visual
  avatar_url TEXT,
  cover_image_url TEXT,

  -- Categorization
  categories TEXT[],
  tags TEXT[],

  -- Personality
  quote TEXT, -- Signature quote
  personality JSONB, -- traits, communication_style, expertise, signature phrases

  -- System prompt for AI
  system_prompt TEXT NOT NULL,

  -- Files
  has_files BOOLEAN DEFAULT false,
  files_downloadable BOOLEAN DEFAULT false, -- Admin setting

  -- Stats
  conversation_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'coming_soon', 'maintenance', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mind Files
CREATE TABLE mind_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mind_id UUID NOT NULL REFERENCES minds(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,

  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'audio', 'video', 'document', 'other')),
  mime_type TEXT,
  file_url TEXT NOT NULL,
  file_size INTEGER,

  -- Access control
  downloadable BOOLEAN DEFAULT true, -- Admin can control per file

  -- Stats
  download_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Conversations with Minds
CREATE TABLE mind_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mind_id UUID NOT NULL REFERENCES minds(id) ON DELETE CASCADE,

  title TEXT, -- Auto-generated or user-set

  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0,

  -- Status
  is_archived BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation Messages
CREATE TABLE mind_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES mind_conversations(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,

  -- Metadata
  tokens_used INTEGER,
  model_used TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mind Ratings (user feedback)
CREATE TABLE mind_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mind_id UUID NOT NULL REFERENCES minds(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, mind_id)
);

-- File Downloads tracking
CREATE TABLE mind_file_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES mind_files(id) ON DELETE CASCADE,

  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_minds_status ON minds(status) WHERE status = 'active';
CREATE INDEX idx_minds_featured ON minds(is_featured) WHERE is_featured = true;
CREATE INDEX idx_mind_conversations_user ON mind_conversations(user_id);
CREATE INDEX idx_mind_conversations_mind ON mind_conversations(mind_id);
CREATE INDEX idx_mind_messages_conversation ON mind_messages(conversation_id);

-- RLS
ALTER TABLE minds ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_file_downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can view active public minds
CREATE POLICY "View active minds" ON minds FOR SELECT USING (status = 'active' AND is_public = true);
CREATE POLICY "View mind files" ON mind_files FOR SELECT USING (
  mind_id IN (SELECT id FROM minds WHERE status = 'active' AND is_public = true)
);

-- Users manage own conversations
CREATE POLICY "Users manage own conversations" ON mind_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own messages" ON mind_messages FOR ALL USING (
  conversation_id IN (SELECT id FROM mind_conversations WHERE user_id = auth.uid())
);
CREATE POLICY "Users manage own ratings" ON mind_ratings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users track own downloads" ON mind_file_downloads FOR ALL USING (auth.uid() = user_id);
```

### AI Chat Integration

```typescript
// lib/actions/minds-chat.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function sendMessageToMind(
  mindId: string,
  conversationId: string | null,
  message: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get mind details
  const { data: mind } = await supabase
    .from("minds")
    .select("system_prompt, name")
    .eq("id", mindId)
    .single();

  if (!mind) throw new Error("Mind not found");

  // Get or create conversation
  let convId = conversationId;
  if (!convId) {
    const { data: conv } = await supabase
      .from("mind_conversations")
      .insert({
        user_id: user.id,
        mind_id: mindId,
      })
      .select()
      .single();
    convId = conv!.id;
  }

  // Get conversation history (last 10 messages for context)
  const { data: history } = await supabase
    .from("mind_messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true })
    .limit(10);

  // Save user message
  await supabase.from("mind_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  // Build messages array
  const messages = [
    ...(history || []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: "user" as const, content: message },
  ];

  // Generate AI response with streaming
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system: mind.system_prompt,
    messages,
  });

  // Collect full response
  let fullResponse = "";
  for await (const chunk of result.textStream) {
    fullResponse += chunk;
    // In real implementation, stream to client via SSE or WebSocket
  }

  // Save assistant message
  await supabase.from("mind_messages").insert({
    conversation_id: convId,
    role: "assistant",
    content: fullResponse,
    tokens_used: result.usage?.totalTokens,
    model_used: "gpt-4-turbo",
  });

  // Update conversation
  await supabase
    .from("mind_conversations")
    .update({
      last_message_at: new Date().toISOString(),
      message_count: (history?.length || 0) + 2,
    })
    .eq("id", convId);

  // Increment mind conversation count
  await supabase.rpc("increment_mind_conversation_count", { mind_id: mindId });

  return {
    conversationId: convId,
    response: fullResponse,
  };
}

export async function getConversations(mindId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let query = supabase
    .from("mind_conversations")
    .select(`
      *,
      mind:minds(id, name, avatar_url)
    `)
    .eq("user_id", user.id)
    .order("last_message_at", { ascending: false });

  if (mindId) {
    query = query.eq("mind_id", mindId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mind_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
```

---

## Tasks

### Phase 1: Foundation & Main Page
- [ ] Criar migration do schema
- [ ] Implementar server actions base
- [ ] Criar Minds Main Page
- [ ] MindCard component
- [ ] Filtros e busca
- [ ] Featured Mind

### Phase 2: Mind Detail & Profile
- [ ] Mind Detail Page
- [ ] Profile section
- [ ] Files list with download
- [ ] Suggested prompts

### Phase 3: Chat Interface
- [ ] Chat component
- [ ] Message bubbles
- [ ] Streaming response
- [ ] AI integration
- [ ] Conversation history

### Phase 4: Integration
- [ ] Integration com Journey Authors
- [ ] Ratings system
- [ ] Recent conversations section

---

## Definition of Done

- [ ] Schema criado e testado
- [ ] Main page com lista de Minds
- [ ] Detail page com perfil completo
- [ ] Chat funcionando com streaming
- [ ] Download de arquivos (quando permitido)
- [ ] Integração com Journey Authors
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_minds_module.sql                [CREATE]

app/(dashboard)/minds/
├── page.tsx                            [CREATE] (Main)
└── [mindId]/
    └── page.tsx                        [CREATE] (Detail/Chat)

components/minds/
├── MindsGrid.tsx                       [CREATE]
├── MindCard.tsx                        [CREATE]
├── FeaturedMind.tsx                    [CREATE]
├── MindsFilters.tsx                    [CREATE]
├── MindProfile.tsx                     [CREATE]
├── MindFilesList.tsx                   [CREATE]
├── MindFileCard.tsx                    [CREATE]
├── MindChat.tsx                        [CREATE]
├── ChatMessage.tsx                     [CREATE]
├── ChatInput.tsx                       [CREATE]
├── SuggestedPrompts.tsx                [CREATE]
├── ConversationHistory.tsx             [CREATE]
├── RecentMinds.tsx                     [CREATE]
└── index.ts                            [CREATE]

lib/actions/
├── minds.ts                            [CREATE]
└── minds-chat.ts                       [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"minds.page.viewed"
"minds.mind.viewed" { mind_id }
"minds.conversation.started" { mind_id, conversation_id }
"minds.message.sent" { conversation_id }
"minds.file.downloaded" { mind_id, file_id }
"minds.rating.submitted" { mind_id, rating }

// Eventos consumidos
"journey.book.viewed" → Sugerir Mind do autor (se disponível)
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
