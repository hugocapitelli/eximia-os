# CHECKPOINT: BLOCO 1.2 - Synthetic Minds: Base
**Criado:** 26 Janeiro 2026
**Atualizado:** 27 Janeiro 2026
**Status:** `DONE`

---

## Informações do Bloco

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Synthetic-Minds-Library-v1.0.md` |
| **Dependências** | BLOCO 0.2 (Agent Service) |
| **Instância Atual** | CLAUDE_2026-01-26_03 |

---

## Checklist de Escopo

### 1. Schema de Agentes no Supabase

#### Tabela: agents (Mentes Sintéticas)
- [x] Criar tabela `agents`
- [x] Campos: id, name, slug, domain, subdomain
- [x] Campos: tier, version, status (active, validating, inactive)
- [x] Campos: fidelity_score, avatar_url
- [x] Campos: description, use_cases (array), avoid_cases (array)
- [x] Campos: system_prompt, knowledge_bases (jsonb)
- [x] Campos: tags (array), times_invoked, avg_rating
- [x] Timestamps: created_at, updated_at

#### Tabela: conversations
- [x] Criar tabela `conversations`
- [x] Campos: id, user_id, agent_id
- [x] Campos: title, status (active, archived)
- [x] Campos: metadata (jsonb)
- [x] Timestamps: created_at, updated_at, last_message_at

#### Tabela: messages
- [x] Criar tabela `messages`
- [x] Campos: id, conversation_id
- [x] Campos: role (user, assistant, system)
- [x] Campos: content, tokens_used
- [x] Campos: metadata (jsonb)
- [x] Timestamps: created_at

### 2. Endpoint de Chat no Agent Service

#### Chat Router
- [x] Criar `/api/v1/chat/` router
- [x] POST `/chat/conversations` - iniciar conversa
- [x] POST `/chat/conversations/{id}/messages` - enviar mensagem
- [x] GET `/chat/conversations/{id}` - buscar conversa
- [x] GET `/chat/conversations/{id}/messages` - listar mensagens

#### Agents Router
- [x] Criar `/api/v1/agents/` router
- [x] GET `/agents/` - listar agentes
- [x] GET `/agents/{agent_id}` - detalhes do agente
- [x] GET `/agents/slug/{slug}` - buscar por slug

### 3. Integração com LLMs
- [x] Criar service `llm_service.py`
- [x] Suporte para OpenAI (GPT-4)
- [x] Suporte para Anthropic (Claude)
- [x] Abstração para trocar providers
- [x] Configuração via env vars

### 4. Streaming de Respostas
- [x] Implementar Server-Sent Events (SSE)
- [x] Endpoint POST `/chat/conversations/{id}/messages/stream`
- [x] Streaming de tokens em tempo real
- [x] Fallback para não-streaming

### 5. Storage de Conversas
- [x] Persistir mensagens no Supabase
- [x] Carregar contexto da conversa
- [x] Limitar contexto (últimas N mensagens)
- [x] Soft delete de conversas (archive)

### 6. UI Básica de Chat no Frontend
- [x] Componente `ChatWindow`
- [x] Componente `MessageList`
- [x] Componente `MessageBubble`
- [x] Componente `ChatInput`
- [x] Componente `AgentSelector`
- [x] Componente `AgentCard`
- [x] Hook `useChat` para gerenciar estado
- [x] Suporte a streaming no frontend
- [x] Página `/minds`

**Progresso:** 32/32 (100%)

---

## Estado Atual

### Última Ação Realizada
```
- Migration SQL criada: supabase/migrations/002_synthetic_minds.sql
- Tipos TypeScript criados: app/src/types/synthetic-minds.ts
- Models Pydantic criados: agent-service/app/models/
- LLM Service criado com suporte OpenAI + Anthropic
- Chat Service criado com toda lógica de negócio
- Routers de chat e agents criados
- Componentes de UI criados: ChatWindow, MessageList, MessageBubble, ChatInput, AgentCard, AgentSelector
- Build Next.js passando sem erros
```

### Próxima Ação Pendente
```
BLOCO CONCLUÍDO!
- Hook useChat criado em app/src/hooks/use-chat.ts
- Hook useAgents criado em app/src/hooks/use-agents.ts
- Página /minds criada em app/src/app/(dashboard)/minds/page.tsx
- Navigation atualizada na Sidebar
```

---

## Schemas de Referência

### Agent
```typescript
interface Agent {
  id: string;
  name: string;
  slug: string;
  domain: string;
  subdomain?: string;
  tier: 'tier_0' | 'tier_1' | 'tier_2' | 'tier_3';
  version: string;
  status: 'active' | 'validating' | 'inactive';
  fidelity_score?: number;
  avatar_url?: string;
  description: string;
  use_cases: string[];
  avoid_cases: string[];
  system_prompt: string;
  knowledge_bases?: Record<string, any>;
  tags: string[];
  times_invoked: number;
  avg_rating?: number;
  created_at: Date;
  updated_at: Date;
}
```

### Conversation
```typescript
interface Conversation {
  id: string;
  user_id: string;
  agent_id: string;
  title?: string;
  status: 'active' | 'archived';
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  last_message_at?: Date;
}
```

### Message
```typescript
interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used?: number;
  metadata?: Record<string, any>;
  created_at: Date;
}
```

---

## Arquitetura do Agent Service

```
agent-service/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── chat.py          # Chat endpoints
│   │       └── agents.py        # Agents endpoints
│   ├── services/
│   │   ├── llm_service.py       # LLM abstraction
│   │   └── chat_service.py      # Chat business logic
│   ├── models/
│   │   ├── agent.py             # Agent Pydantic models
│   │   ├── conversation.py      # Conversation models
│   │   └── message.py           # Message models
│   └── ...
```

---

## Blockers (se houver)

| Blocker | Descrição | Ação Necessária |
|---------|-----------|-----------------|
| - | Nenhum | - |

---

## Critério de Done

- [x] Conversar com um agente genérico
- [x] Respostas em streaming
- [x] Histórico persistido no Supabase
- [x] UI básica funcionando

---

## Histórico de Sessões

| Data | Instância | Ações | Resultado |
|------|-----------|-------|-----------|
| 26/01/2026 | CLAUDE_2026-01-26_03 | Checkpoint criado | Iniciando |

---

*Última atualização: 26 Janeiro 2026*
