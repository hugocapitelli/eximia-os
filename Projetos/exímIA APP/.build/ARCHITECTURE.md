# ARCHITECTURE - ExímIA OS
**Versão:** 1.0.0
**Data:** 26 Janeiro 2026
**Status:** Aprovado

---

## Decisão Arquitetural

Este documento consolida as decisões de arquitetura tomadas para o ExímIA OS.

---

## Stack Definida

### Frontend

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Next.js** | 14.x | App Router, RSC, melhor DX, comunidade |
| **TypeScript** | 5.x | Type safety, melhor manutenção |
| **Tailwind CSS** | 3.x | Utility-first, rápido, customizável |
| **shadcn/ui** | latest | Componentes base, não é dependência |
| **Lucide Icons** | latest | Consistente, tree-shakeable |

### Agent Service (Backend de Agentes)

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Python** | 3.11+ | Ecossistema de IA, libs maduras |
| **FastAPI** | 0.100+ | Async, tipado, rápido, docs automáticas |
| **Pydantic** | 2.x | Validação, serialização |
| **httpx** | latest | Cliente HTTP async |
| **supabase-py** | latest | Client oficial Supabase |

### Backend (BaaS)

| Serviço | Uso |
|---------|-----|
| **Supabase PostgreSQL** | Banco de dados principal |
| **Supabase Auth** | Autenticação |
| **Supabase Storage** | Arquivos e mídia |
| **Supabase Realtime** | Subscriptions (se necessário) |
| **Supabase Edge Functions** | CRON jobs, webhooks |

### LLM Providers

| Provider | Uso |
|----------|-----|
| **Anthropic (Claude)** | Agentes principais, raciocínio complexo |
| **OpenAI (GPT-4)** | Fallback, tasks específicas |
| **Configurável** | Por agente, definido no banco |

### Infraestrutura

| Componente | Plataforma |
|------------|------------|
| **Frontend** | Easypanel (Docker) |
| **Agent Service** | Easypanel (Docker) |
| **Database** | Supabase (managed) |
| **DNS/CDN** | Cloudflare (opcional) |

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE (Browser/PWA)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              EASYPANEL (VPS)                                │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │         NEXT.JS 14              │  │       AGENT SERVICE             │   │
│  │         (Container)             │  │       (Container)               │   │
│  │                                 │  │                                 │   │
│  │  ┌───────────────────────────┐  │  │  ┌───────────────────────────┐  │   │
│  │  │      App Router           │  │  │  │      FastAPI              │  │   │
│  │  │  ├── /                    │  │  │  │  ├── /health              │  │   │
│  │  │  ├── /journey/*           │  │  │  │  ├── /api/v1/chat        │  │   │
│  │  │  ├── /academy/*           │──┼──┼─►│  ├── /api/v1/agents      │  │   │
│  │  │  ├── /inbox/*             │  │  │  │  └── /api/v1/kb          │  │   │
│  │  │  └── /api/* (server)      │  │  │  └───────────────────────────┘  │   │
│  │  └───────────────────────────┘  │  │              │                  │   │
│  │              │                  │  │              │                  │   │
│  └──────────────┼──────────────────┘  └──────────────┼──────────────────┘   │
│                 │                                    │                      │
└─────────────────┼────────────────────────────────────┼──────────────────────┘
                  │                                    │
                  ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE (Cloud)                               │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │  │   Realtime   │    │
│  │              │  │              │  │              │  │              │    │
│  │  - users     │  │  - sessions  │  │  - avatars   │  │  - presence  │    │
│  │  - goals     │  │  - providers │  │  - files     │  │  - changes   │    │
│  │  - habits    │  │  - tokens    │  │  - exports   │  │              │    │
│  │  - agents    │  │              │  │              │  │              │    │
│  │  - convos    │  │              │  │              │  │              │    │
│  │  - links     │  │              │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LLM PROVIDERS (External)                          │
│                                                                             │
│              Anthropic (Claude)  │  OpenAI (GPT-4)  │  Others               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados

### 1. Autenticação

```
Browser → Next.js → Supabase Auth → JWT → Browser (cookie)
                                       ↓
                         Next.js Server (validates)
                                       ↓
                         Agent Service (receives user_id)
```

### 2. CRUD de Entidades

```
Browser → Next.js Server Action → Supabase (direct) → Response
```

### 3. Chat com Agente

```
Browser → Next.js API Route → Agent Service → LLM Provider
    ↑                              │
    └──────── SSE Stream ──────────┘
                   │
                   ▼
              Supabase (save conversation)
```

---

## Estrutura de Pastas

### Frontend (Next.js)

```
eximia-app/
├── src/
│   ├── app/                    # App Router
│   │   ├── (auth)/             # Rotas de auth (login, register)
│   │   ├── (dashboard)/        # Rotas protegidas
│   │   │   ├── journey/
│   │   │   ├── academy/
│   │   │   ├── inbox/
│   │   │   └── settings/
│   │   ├── api/                # API Routes (proxy para Agent Service)
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # Atoms (shadcn + custom)
│   │   ├── molecules/          # Composições
│   │   ├── organisms/          # Seções complexas
│   │   └── templates/          # Layouts
│   │
│   ├── lib/
│   │   ├── supabase/           # Clients e helpers
│   │   ├── agents/             # Client do Agent Service
│   │   └── utils/
│   │
│   ├── hooks/                  # Custom hooks
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles, tokens
│
├── public/                     # Static assets
├── supabase/                   # Migrations, seeds
└── package.json
```

### Agent Service (FastAPI)

```
agent-service/
├── app/
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Settings
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── chat.py         # Chat endpoints
│   │   │   ├── agents.py       # Agent CRUD
│   │   │   └── health.py
│   │   └── deps.py             # Dependencies
│   │
│   ├── services/
│   │   ├── llm.py              # LLM integrations
│   │   ├── context.py          # Context building
│   │   └── supabase.py         # DB operations
│   │
│   ├── models/
│   │   ├── agent.py
│   │   ├── conversation.py
│   │   └── message.py
│   │
│   └── prompts/                # Prompt templates
│
├── tests/
├── Dockerfile
└── requirements.txt
```

---

## Comunicação entre Serviços

### Next.js → Agent Service

```typescript
// lib/agents/client.ts
const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL;

export async function chatWithAgent(agentId: string, message: string) {
  const response = await fetch(`${AGENT_SERVICE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseToken}`,
    },
    body: JSON.stringify({ agent_id: agentId, message }),
  });

  return response.body; // Stream
}
```

### Agent Service → Supabase

```python
# services/supabase.py
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async def get_agent_prompt(agent_id: str) -> str:
    result = supabase.table("agents").select("prompt").eq("id", agent_id).single().execute()
    return result.data["prompt"]
```

---

## Segurança

### Autenticação

- JWT via Supabase Auth
- Cookies httpOnly para tokens
- Refresh token rotation

### Autorização

- RLS no Supabase (row-level security)
- Agent Service valida JWT antes de processar
- Service role key apenas no backend

### Secrets

- Env vars no Easypanel
- Nunca expor API keys no frontend
- LLM keys apenas no Agent Service

---

## Performance

### Frontend

- React Server Components (RSC)
- Streaming SSR
- Image optimization (next/image)
- Bundle splitting por rota

### Agent Service

- Async/await everywhere
- Connection pooling
- Response streaming
- Caching de prompts

### Database

- Indexes apropriados
- RLS otimizado
- Connection pooling via Supabase

---

## Monitoramento

### Logs

- Next.js: Vercel/Easypanel logs
- Agent Service: Structured logging (JSON)
- Supabase: Dashboard nativo

### Métricas (futuro)

- Latência de chat
- Token usage por agente
- Erros por endpoint

---

*Este documento é a fonte de verdade para decisões arquiteturais. Mudanças devem ser documentadas via ADR.*
