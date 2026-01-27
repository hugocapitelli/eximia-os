# ROADMAP DE OBRA - ExímIA OS
**Versão:** 1.0.0
**Criado:** 26 Janeiro 2026
**Status:** FASE 0 COMPLETA ✅ | Pronto para FASE 1

---

## Filosofia do Roteiro

> *"Medir duas vezes, cortar uma vez."*

Este documento é a **fonte única de verdade** para o desenvolvimento do ExímIA OS. Cada bloco tem um checkpoint associado que permite:

1. **Retomada precisa** - Se der erro, sabemos exatamente onde paramos
2. **Paralelização segura** - Múltiplas instâncias podem trabalhar em blocos independentes
3. **Visibilidade total** - Status sempre atualizado

---

## Estrutura de Arquivos

```
Projetos/exímIA APP/
├── .build/                          ← SISTEMA DE CONSTRUÇÃO
│   ├── ROADMAP_OBRA.md              ← VOCÊ ESTÁ AQUI
│   ├── ARCHITECTURE.md              ← Decisões arquiteturais
│   ├── CURRENT_FOCUS.md             ← Bloco em andamento (singleton)
│   │
│   ├── checkpoints/                 ← Estado de cada bloco
│   │   ├── BLOCO_0.1_setup.md
│   │   ├── BLOCO_0.2_design_tokens.md
│   │   ├── BLOCO_0.3_design_components.md
│   │   ├── ...
│   │   └── TEMPLATE_CHECKPOINT.md
│   │
│   ├── decisions/                   ← ADRs (Architecture Decision Records)
│   │   ├── ADR_001_stack_choice.md
│   │   ├── ADR_002_agent_service.md
│   │   └── ...
│   │
│   └── logs/                        ← Histórico de sessões
│       ├── 2026-01-26_sessao_01.md
│       └── ...
│
├── 00_Core/                         ← PRDs existentes
├── 01_Journey/
└── ...
```

---

## Arquitetura Definida

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXIMIA OS - ARQUITETURA v1                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                        EASYPANEL                                │    │
│  │                                                                 │    │
│  │  ┌─────────────────────┐      ┌─────────────────────────────┐   │    │
│  │  │    NEXT.JS 14       │      │    AGENT SERVICE            │   │    │
│  │  │    (Frontend)       │      │    (Python/FastAPI)         │   │    │
│  │  │                     │      │                             │   │    │
│  │  │  ├── App Router     │ ───► │  ├── /api/chat/{agent}      │   │    │
│  │  │  ├── UI Components  │      │  ├── /api/agents/           │   │    │
│  │  │  ├── Server Actions │      │  ├── Prompt Management      │   │    │
│  │  │  └── PWA            │ ◄─── │  ├── Context Loading        │   │    │
│  │  │                     │      │  └── LLM Integration        │   │    │
│  │  └─────────────────────┘      └─────────────────────────────┘   │    │
│  │            │                              │                     │    │
│  └────────────┼──────────────────────────────┼─────────────────────┘    │
│               │                              │                          │
│               ▼                              ▼                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                         SUPABASE                                │    │
│  │                                                                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │    │
│  │  │PostgreSQL│  │   Auth   │  │ Storage  │  │Edge Functions│    │    │
│  │  │          │  │          │  │          │  │  (CRON/WH)   │    │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                      │                                  │
│                                      ▼                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      LLM PROVIDERS                              │    │
│  │         OpenAI  │  Anthropic  │  Local (Ollama)                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Legenda de Status

| Ícone | Status | Significado |
|-------|--------|-------------|
| ⬜ | `NOT_STARTED` | Não iniciado |
| 🔵 | `IN_PROGRESS` | Em andamento |
| 🟡 | `BLOCKED` | Bloqueado (ver motivo no checkpoint) |
| 🟢 | `DONE` | Concluído e deployado |
| 🔴 | `FAILED` | Falhou (ver erro no checkpoint) |

---

## FASE 0: FUNDAÇÃO

> **Objetivo:** App funcionando em produção com auth e design system básico.
> **Paralelizável:** NÃO - Sequencial obrigatório.

### 🟢 BLOCO 0.1 - Setup & Infraestrutura ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | N/A (infraestrutura) |
| **Checkpoint** | `.build/checkpoints/BLOCO_0.1_setup.md` |
| **Dependências** | Nenhuma (primeiro bloco) |
| **Estimativa** | 1 sessão |

**Escopo:**
- [x] Criar projeto Next.js 14 (App Router, TypeScript, Tailwind)
- [x] Configurar Supabase (projeto + env vars)
- [x] Implementar Auth básico (login/logout/registro)
- [x] Configurar Easypanel (container Next.js)
- [x] Deploy inicial funcionando
- [x] Configurar domínio (se houver)

**Critério de Done:**
- [x] URL pública acessível
- [x] Login/logout funcionando com Supabase Auth
- [x] Página protegida acessível apenas logado

**Não inclui (próximo bloco):**
- Design system
- Qualquer UI além do mínimo para auth

---

### 🟢 BLOCO 0.2 - Agent Service Setup ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | N/A (infraestrutura) |
| **Checkpoint** | `.build/checkpoints/BLOCO_0.2_agent_service.md` |
| **Dependências** | BLOCO 0.1 |
| **Estimativa** | 1 sessão |

**Escopo:**
- [x] Criar projeto FastAPI (Python 3.11+)
- [x] Estrutura base (routers, services, models)
- [x] Endpoint de health check
- [x] Integração com Supabase (client Python)
- [x] Configurar container no Easypanel
- [x] Deploy funcionando
- [x] Comunicação Next.js ↔ Agent Service testada

**Critério de Done:**
- [x] `/health` retornando OK
- [x] Next.js consegue chamar Agent Service
- [x] Logs visíveis no Easypanel

**Não inclui (próximo bloco):**
- Integração com LLMs
- Lógica de agentes

---

### 🟢 BLOCO 0.3 - Design System: Tokens & Base ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seções 1-2) |
| **Checkpoint** | `.build/checkpoints/BLOCO_0.3_design_tokens.md` |
| **Dependências** | BLOCO 0.1 ✅ |
| **Estimativa** | 1 sessão |

**Escopo:**
- [x] Configurar design tokens (CSS variables)
- [x] Configurar Tailwind com tokens customizados
- [x] Configurar shadcn/ui como base
- [x] Criar tema dark (ExímIA palette)
- [x] Documentar tokens (docs/DESIGN_TOKENS.md)

**Critério de Done:**
- [x] Tokens disponíveis globalmente
- [x] Tailwind usando cores ExímIA
- [x] Componentes shadcn com tema aplicado

---

### 🟢 BLOCO 0.4 - Design System: Atoms ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seção 3) |
| **Checkpoint** | `.build/checkpoints/BLOCO_0.4_atoms.md` |
| **Dependências** | BLOCO 0.3 ✅ |
| **Estimativa** | 1-2 sessões |

**Escopo:**
- [x] Button (todas variantes + loading state)
- [x] Input (sizes, icons, clearable)
- [x] Badge (todas variantes + sizes + dot)
- [x] Icon system (Lucide wrapper)
- [x] Avatar (image, fallback, sizes, status, AvatarGroup)
- [x] Typography components (Heading, Text, Label, Code, Kbd)
- [x] Spinner component

**Critério de Done:**
- [x] Componentes exportados de `@/components/ui`
- [x] Todos estados funcionando (hover, focus, disabled, loading)
- [x] Acessibilidade básica (focus visible, aria labels)

---

### 🟢 BLOCO 0.5 - Design System: Molecules ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seção 4) |
| **Checkpoint** | `.build/checkpoints/BLOCO_0.5_molecules.md` |
| **Dependências** | BLOCO 0.4 ✅ |
| **Estimativa** | 1-2 sessões |

**Escopo:**
- [x] FormField (Label + Input + Error)
- [x] SearchInput
- [x] MetricCard
- [x] NavItem
- [x] EntityLink (para Connection Layer)

**Critério de Done:**
- [x] Componentes compostos funcionando
- [x] Props tipadas corretamente

---

### 🟢 BLOCO 0.6 - Design System: Layout Shell ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seções 5-6) |
| **Checkpoint** | `.build/checkpoints/BLOCO_0.6_layout.md` |
| **Dependências** | BLOCO 0.5 ✅ |
| **Estimativa** | 1-2 sessões |

**Escopo:**
- [x] Sidebar organism (navegação principal)
- [x] Header organism (breadcrumb, título, ações)
- [x] DashboardLayout template
- [x] Mobile navigation (bottom nav ou drawer)
- [x] Responsividade testada

**Critério de Done:**
- [x] Layout navegável entre módulos (mesmo que páginas vazias)
- [x] Funciona em desktop e mobile
- [x] Build passando sem erros

---

## FASE 1: CORE

> **Objetivo:** Connection Layer + Base de Agentes funcionando.
> **Paralelizável:** BLOCO 1.1 e 1.2 podem rodar em paralelo após FASE 0.

### 🟢 BLOCO 1.1 - Connection Layer: Schema ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Connection-Layer-v5.0.md` |
| **Checkpoint** | `.build/checkpoints/BLOCO_1.1_connection_schema.md` |
| **Dependências** | FASE 0 completa |
| **Estimativa** | 1 sessão |

**Escopo:**
- [x] Modelagem do banco (entidades, relacionamentos)
- [x] Migrations Supabase
- [x] RLS policies
- [x] Tipos TypeScript gerados
- [x] Seed data básico para testes

**Critério de Done:**
- [x] Tabelas criadas no Supabase
- [x] RLS funcionando
- [x] Tipos disponíveis no frontend

---

### 🟢 BLOCO 1.2 - Synthetic Minds: Base ✅

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Synthetic-Minds-Library-v1.0.md` |
| **Checkpoint** | `.build/checkpoints/BLOCO_1.2_synthetic_minds.md` |
| **Dependências** | BLOCO 0.2 (Agent Service) |
| **Estimativa** | 2 sessões |

**Escopo:**
- [x] Schema de agentes no Supabase (prompts, KBs, configs)
- [x] Endpoint de chat no Agent Service
- [x] Integração com OpenAI/Anthropic
- [x] Streaming de respostas
- [x] Storage de conversas
- [x] UI básica de chat no frontend

**Critério de Done:**
- [x] Conversar com um agente genérico
- [x] Respostas em streaming
- [x] Histórico persistido

---

### ⬜ BLOCO 1.3 - Connection Layer: UI

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Connection-Layer-v5.0.md` |
| **Checkpoint** | `.build/checkpoints/BLOCO_1.3_connection_ui.md` |
| **Dependências** | BLOCO 1.1 |
| **Estimativa** | 1-2 sessões |

**Escopo:**
- [ ] EntityLink component
- [ ] LinkModal (criar/editar links)
- [ ] EntityCard com links visíveis
- [ ] Busca de entidades para linkar

**Critério de Done:**
- [ ] Criar link entre duas entidades
- [ ] Visualizar links em um card
- [ ] Navegar via link

---

## FASE 2: INBOX (Primeiro Módulo Vertical)

> **Objetivo:** Módulo completo funcionando como validação da arquitetura.
> **Paralelizável:** NÃO - Sequencial.

### ⬜ BLOCO 2.1 - Inbox: Capture

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `06_Inbox/PRD-Inbox-v5.0.md` |
| **Checkpoint** | `.build/checkpoints/BLOCO_2.1_inbox_capture.md` |
| **Dependências** | FASE 1 completa |
| **Estimativa** | 1 sessão |

**Escopo:**
- [ ] Quick capture (texto)
- [ ] Lista de items
- [ ] CRUD básico
- [ ] Filtros simples

**Critério de Done:**
- [ ] Capturar item de texto
- [ ] Listar items
- [ ] Arquivar item

---

### ⬜ BLOCO 2.2 - Inbox: AI Processing

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `06_Inbox/PRD-Inbox-v5.0.md` |
| **Checkpoint** | `.build/checkpoints/BLOCO_2.2_inbox_ai.md` |
| **Dependências** | BLOCO 2.1 + BLOCO 1.2 |
| **Estimativa** | 1-2 sessões |

**Escopo:**
- [ ] Classificação automática via IA
- [ ] Sugestão de destino (Goal, Task, etc.)
- [ ] Aceitar/rejeitar sugestão
- [ ] Routing para entidade correta

**Critério de Done:**
- [ ] IA sugere categoria para item
- [ ] Aceitar cria entidade no destino
- [ ] Link automático criado

---

## FASE 3: JOURNEY

> **Objetivo:** Módulo de execução pessoal completo.
> **Paralelizável:** BLOCO 3.1 e 3.2 podem rodar em paralelo.

### ⬜ BLOCO 3.1 - Journey: Goals

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `01_Journey/PRD-Journey-v5.0.md` (seção Goals) |
| **Checkpoint** | `.build/checkpoints/BLOCO_3.1_goals.md` |
| **Dependências** | FASE 2 completa |
| **Estimativa** | 2 sessões |

**Escopo:**
- [ ] CRUD de Goals
- [ ] Key Results
- [ ] Progress tracking
- [ ] GoalCard organism
- [ ] Lista e detalhe de goal

---

### ⬜ BLOCO 3.2 - Journey: Habits

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `01_Journey/PRD-Journey-v5.0.md` (seção Habits) |
| **Checkpoint** | `.build/checkpoints/BLOCO_3.2_habits.md` |
| **Dependências** | FASE 2 completa |
| **Estimativa** | 2 sessões |

**Escopo:**
- [ ] CRUD de Habits
- [ ] Check-in diário
- [ ] Streaks
- [ ] HabitTracker organism
- [ ] Calendário de hábitos

---

### ⬜ BLOCO 3.3 - Journey: Dashboard

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `01_Journey/PRD-Journey-v5.0.md` (seção Dashboard) |
| **Checkpoint** | `.build/checkpoints/BLOCO_3.3_journey_dash.md` |
| **Dependências** | BLOCO 3.1 + 3.2 |
| **Estimativa** | 1-2 sessões |

**Escopo:**
- [ ] Dashboard agregado
- [ ] Métricas widgets
- [ ] Sugestões de IA
- [ ] Quick actions

---

## FASE 4+: MÓDULOS ADICIONAIS

> **Status:** Será detalhado após FASE 3.
> **Paralelizável:** SIM - Múltiplas instâncias podem trabalhar em módulos diferentes.

| Módulo | PRD | Blocos Estimados |
|--------|-----|------------------|
| Academy | PRD-Academy-v5.0.md | 3-4 |
| Strategy | PRD-Strategy-v5.0.md | 3-4 |
| Brand | PRD-Brand-v5.0.md | 2-3 |
| PrototypOS | PRD-PrototypOS-v5.0.md | 2-3 |
| Finance | PRD-Finance-v1.0.md | 2-3 |

---

## Protocolo de Trabalho

### Ao iniciar uma sessão:

```markdown
1. Ler CURRENT_FOCUS.md para saber o bloco ativo
2. Ler checkpoint do bloco para estado atual
3. Continuar de onde parou
```

### Durante o trabalho:

```markdown
1. Atualizar checkpoint a cada sub-task concluída
2. Commitar frequentemente com mensagens claras
3. Se encontrar blocker, marcar no checkpoint e parar
```

### Ao finalizar sessão:

```markdown
1. Atualizar checkpoint com estado atual
2. Atualizar CURRENT_FOCUS.md se mudou de bloco
3. Criar entrada em logs/ com resumo
4. Se bloco concluído, atualizar status neste ROADMAP
```

### Para múltiplas instâncias:

```markdown
1. Verificar CURRENT_FOCUS.md antes de começar
2. Se bloco está livre, "lockar" atualizando CURRENT_FOCUS
3. Trabalhar apenas em blocos sem dependências pendentes
4. Nunca trabalhar no mesmo bloco que outra instância
```

---

## Próximo Passo

**🎉 FASE 1 - BLOCOS 1.1 e 1.2 COMPLETOS!**

Blocos concluídos:
- ✅ 0.1 - Setup & Infraestrutura
- ✅ 0.2 - Agent Service Setup
- ✅ 0.3 - Design Tokens & Base
- ✅ 0.4 - Atoms
- ✅ 0.5 - Molecules
- ✅ 0.6 - Layout Shell
- ✅ 1.1 - Connection Layer: Schema
- ✅ 1.2 - Synthetic Minds: Base

**PRÓXIMO DISPONÍVEL:**
- BLOCO 1.3 - Connection Layer: UI

---

*Última atualização: 27 Janeiro 2026 - 01:30*
