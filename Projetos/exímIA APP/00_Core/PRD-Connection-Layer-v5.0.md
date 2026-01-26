# ExímIA OS — CONNECTION LAYER
**Módulo:** Core / Connection Layer
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** ⭐ **CRÍTICO** — O Coração do Sistema

> [← Voltar ao Índice Master](../PRD-Master-Index-v5.0.md)

---

## Sumário

1. [Filosofia: Sistema Nervoso Central](#1-filosofia-sistema-nervoso-central)
2. [Event Bus — Sistema de Eventos](#2-event-bus--sistema-de-eventos)
3. [Entity Links — Conexões Bidirecionais](#3-entity-links--conexões-bidirecionais)
4. [Suggestion Engine — IA Proativa](#4-suggestion-engine--ia-proativa)
5. [Cascading Rules — Automações](#5-cascading-rules--automações)
6. [Cross-Module Workflows](#6-cross-module-workflows)
7. [Inbox — Entrada Universal](#7-inbox--entrada-universal)
8. [Notifications — Saída Proativa](#8-notifications--saída-proativa)
9. [Métricas de Saúde](#9-métricas-de-saúde)

---

# Introdução

> **"O valor não está nas features — está na CONEXÃO entre elas."**
> — Elon Musk Clone Analysis

A Connection Layer é o **diferencial competitivo absoluto** do ExímIA OS. Sem ela, somos apenas 5 apps isolados competindo com ferramentas melhores. COM ela, somos o único sistema que realmente conecta a vida do empreendedor.

**Esta seção representa 60% do PRD porque a Connection Layer É o produto.**

---

# 1. Filosofia: Sistema Nervoso Central

## O Problema que Resolvemos

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   ANTES: ILHAS ISOLADAS                                                │
│                                                                        │
│   [Journey]     [Academy]     [Brand]     [Strategy]     [Prototyp]   │
│      ↓             ↓            ↓            ↓              ↓         │
│   (dados)       (dados)      (dados)      (dados)        (dados)      │
│                                                                        │
│   Nenhuma comunicação. Usuário é o "middleware humano".               │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   DEPOIS: SISTEMA NERVOSO CENTRAL                                      │
│                                                                        │
│                      ┌─────────────────┐                              │
│                      │ CONNECTION LAYER │                              │
│                      │   (Event Bus)    │                              │
│                      └────────┬────────┘                              │
│            ┌──────────┬───────┼───────┬──────────┐                    │
│            ↓          ↓       ↓       ↓          ↓                    │
│       [Journey]  [Academy] [Brand] [Strategy] [Prototyp]              │
│            ↑          ↑       ↑       ↑          ↑                    │
│            └──────────┴───────┴───────┴──────────┘                    │
│                    (comunicação bidirecional)                          │
│                                                                        │
│   Tudo conectado. Sistema antecipa. Usuário decide.                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Princípios Arquiteturais

| Princípio | Descrição | Exemplo |
|-----------|-----------|---------|
| **Event-Driven** | Toda ação gera evento. Eventos propagam. | `goal.created` → sugere cursos em Academy |
| **Bidirectional Links** | Conexões são de ida E volta | Goal ↔ Initiative (ambos sabem do outro) |
| **Proactive Intelligence** | Sistema age sem ser pedido | "Sua meta está atrasada. Quer ajustar?" |
| **Context Preservation** | Contexto viaja entre módulos | Brand voice disponível ao escrever PRD |
| **User in Control** | Sistema sugere, usuário decide | Toda automação pode ser desligada |

---

# 2. Event Bus — Sistema de Eventos

O Event Bus é a **espinha dorsal** da Connection Layer. Todo evento significativo é publicado e pode ser consumido por qualquer módulo.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                           EVENT BUS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PRODUCERS                    EVENT STORE                 CONSUMERS │
│  ─────────                    ───────────                 ───────── │
│                                                                     │
│  [Journey] ──publish──→  ┌─────────────┐  ──subscribe──→ [Academy]  │
│  [Academy] ──publish──→  │   Events    │  ──subscribe──→ [Strategy] │
│  [Strategy]──publish──→  │   Queue     │  ──subscribe──→ [Journey]  │
│  [Brand]   ──publish──→  │  (Redis/    │  ──subscribe──→ [Notif]    │
│  [Prototyp]──publish──→  │   Postgres) │  ──subscribe──→ [Suggest]  │
│                          └─────────────┘                            │
│                                 │                                   │
│                          [Event Log]                                │
│                        (Histórico)                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Modelo: Event

```typescript
interface SystemEvent {
  id: string;

  // Identificação
  type: string;              // "goal.created", "habit.completed", etc.
  source_module: ModuleType; // "journey" | "academy" | "strategy" | "brand" | "prototyper"

  // Payload
  entity_type: EntityType;
  entity_id: string;
  data: Record<string, any>; // Dados específicos do evento

  // Contexto
  user_id: string;
  workspace_id?: string;
  correlation_id?: string;   // Para rastrear cadeia de eventos

  // Timing
  timestamp: Date;
  processed_at?: Date;

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

type ModuleType = 'journey' | 'academy' | 'strategy' | 'brand' | 'prototyper' | 'inbox' | 'system';

type EntityType =
  | 'goal' | 'habit' | 'book' | 'event'           // Journey
  | 'course' | 'lesson' | 'session'               // Academy
  | 'initiative' | 'cycle' | 'kpi'                // Strategy
  | 'brand_identity' | 'asset' | 'palette'        // Brand
  | 'project' | 'prd' | 'design_system';          // PrototypOS
```

## Catálogo Completo de Eventos

### Journey Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `goal.created` | Usuário cria meta | `{goal, category, scope}` | Academy (sugerir cursos), Strategy (linkar initiative) |
| `goal.completed` | Meta marcada concluída | `{goal, completion_date}` | Notifications (celebrar), Strategy (atualizar initiative) |
| `goal.progress_updated` | Progresso alterado | `{goal, old_progress, new_progress}` | Strategy (sync KPI) |
| `goal.deadline_approaching` | Faltam ≤7 dias | `{goal, days_remaining}` | Notifications (alertar) |
| `goal.overdue` | Passou do deadline | `{goal, days_overdue}` | Notifications (alertar), Suggestions (ajustar) |
| `habit.completed` | Hábito marcado hoje | `{habit, streak, date}` | Notifications (se milestone) |
| `habit.streak_broken` | Streak zerado | `{habit, old_streak}` | Notifications (encorajar) |
| `habit.streak_milestone` | 7, 30, 100 dias | `{habit, milestone}` | Notifications (celebrar) |
| `book.started` | Começou a ler | `{book, author}` | Academy (sugerir curso relacionado) |
| `book.completed` | Terminou livro | `{book, notes_count}` | Suggestions (criar goal de aplicação) |
| `book.quote_saved` | Salvou citação | `{book, quote}` | Brand (disponibilizar para copy) |

### Academy Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `course.enrolled` | Usuário se matriculou | `{course, reason}` | Journey (linkar goal se existir) |
| `course.completed` | Finalizou curso | `{course, score, certificate}` | Notifications (celebrar), Journey (sugerir goal) |
| `lesson.completed` | Finalizou lição | `{lesson, course, progress}` | — |
| `socratic.session_completed` | Terminou diálogo | `{session, score, insights}` | Journey (atualizar goal se linkado) |
| `skill.unlocked` | Completou skill path | `{skill, level}` | Brand (atualizar expertise), Strategy (sugerir initiative) |

### Strategy Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `initiative.created` | Nova iniciativa | `{initiative, cycle, priority}` | **Journey (criar goal automaticamente)** |
| `initiative.status_changed` | Status alterado | `{initiative, old_status, new_status}` | Journey (atualizar goal linkado) |
| `initiative.completed` | Iniciativa concluída | `{initiative, outcomes}` | Notifications (celebrar), Journey (completar goal) |
| `cycle.started` | Ciclo iniciou | `{cycle, objectives}` | Notifications (informar) |
| `cycle.ending_soon` | Faltam ≤14 dias | `{cycle, days_remaining}` | Notifications (review reminder) |
| `kpi.threshold_crossed` | KPI passou limite | `{kpi, threshold, direction}` | Notifications (alertar) |

### Brand Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `brand.voice_updated` | Tom de voz alterado | `{voice_tone, guidelines}` | PrototypOS (atualizar contexto PRD) |
| `brand.colors_updated` | Paleta alterada | `{colors}` | PrototypOS (atualizar design system) |
| `brand.asset_added` | Novo asset | `{asset, type}` | — |

### PrototypOS Events

| Evento | Trigger | Dados | Consumidores |
|--------|---------|-------|--------------|
| `project.created` | Novo projeto | `{project}` | Strategy (sugerir criar initiative) |
| `prd.generated` | PRD gerado | `{prd, project}` | — |
| `design_system.exported` | DS exportado | `{design_system, format}` | Brand (sync se relevante) |

## API de Eventos

```typescript
// Publicar evento
POST /api/events
{
  "type": "goal.created",
  "entity_type": "goal",
  "entity_id": "goal_123",
  "data": {
    "title": "Lançar MVP",
    "category": "business",
    "scope": "quarterly"
  }
}

// Stream de eventos (SSE)
GET /api/events/stream?modules=journey,academy

// Histórico de eventos
GET /api/events?entity_id=goal_123
GET /api/events?type=goal.*&since=2026-01-01

// Replay de evento (para debug)
POST /api/events/:id/replay
```

---

# 3. Entity Links — Conexões Bidirecionais

Entity Links são **conexões persistentes** entre entidades de diferentes módulos. Diferente de eventos (que são momentâneos), links permanecem e podem ser navegados.

## Tipos de Links

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `cascaded` | Criado automaticamente por regra | Initiative → Goal (automático) |
| `suggested` | Sistema sugeriu, usuário aceitou | Book → Course (sugestão aceita) |
| `manual` | Usuário criou explicitamente | Goal → Habit (usuário linkou) |
| `derived` | Inferido por IA | Goal ↔ Goal (mesma categoria) |

## Modelo: EntityLink

```typescript
interface EntityLink {
  id: string;

  // Source (origem)
  source_module: ModuleType;
  source_type: EntityType;
  source_id: string;

  // Target (destino)
  target_module: ModuleType;
  target_type: EntityType;
  target_id: string;

  // Metadata
  link_type: 'cascaded' | 'suggested' | 'manual' | 'derived';
  relationship: string;        // "parent_of", "supports", "related_to", etc.
  strength: number;            // 0-1, relevância do link
  bidirectional: boolean;      // Se true, target também "vê" source

  // Contexto
  created_by: 'system' | 'user' | 'ai';
  created_reason?: string;     // "Created from initiative cascade"

  // Timestamps
  created_at: Date;
  last_accessed_at?: Date;     // Para ranking de relevância
}
```

## Matriz de Links Possíveis

```
                   │ Goal │ Habit │ Book │ Course │ Initiative │ Brand │ Project │
───────────────────┼──────┼───────┼──────┼────────┼────────────┼───────┼─────────┤
Goal               │  ─   │  ✓    │  ✓   │   ✓    │     ✓      │       │         │
Habit              │  ✓   │  ─    │      │   ✓    │            │       │         │
Book               │  ✓   │       │  ─   │   ✓    │            │   ✓   │         │
Course             │  ✓   │  ✓    │  ✓   │   ─    │     ✓      │       │         │
Initiative         │  ✓   │       │      │   ✓    │     ─      │       │    ✓    │
Brand              │      │       │  ✓   │        │            │   ─   │    ✓    │
Project            │      │       │      │        │     ✓      │   ✓   │    ─    │
```

## Link Graph Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ENTITY LINK GRAPH                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Initiative: Lançar MVP]                                           │
│         │                                                           │
│         │ cascaded (strength: 1.0)                                  │
│         ↓                                                           │
│  [Goal: Desenvolver plataforma]──manual──→[Habit: Codar 2h/dia]    │
│         │                                                           │
│         │ suggested (strength: 0.85)                                │
│         ↓                                                           │
│  [Course: React Avançado]──related──→[Book: Clean Code]            │
│         │                                                           │
│         │ derived (strength: 0.7)                                   │
│         ↓                                                           │
│  [Project: ExímIA OS]──uses──→[Brand: ExímIA Identity]             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## API de Links

```typescript
// Criar link manual
POST /api/links
{
  "source_type": "goal",
  "source_id": "goal_123",
  "target_type": "habit",
  "target_id": "habit_456",
  "relationship": "supports"
}

// Buscar links de uma entidade
GET /api/links?entity_type=goal&entity_id=goal_123
// Retorna todos os links onde goal_123 é source OU target

// Buscar links por tipo
GET /api/links?link_type=cascaded&source_module=strategy

// Grafo de links (para visualização)
GET /api/links/graph?root_type=initiative&root_id=init_123&depth=3

// Deletar link
DELETE /api/links/:id
```

## Link Navigation UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  Goal: Lançar MVP do ExímIA OS                                      │
│  ────────────────────────────────────────────────                   │
│                                                                     │
│  📊 Progress: 45%                                                   │
│  📅 Deadline: 30 Mar 2026                                           │
│                                                                     │
│  ─────────────────────────────────────────────────────────────      │
│  🔗 CONNECTIONS (4)                                                 │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  ⬆️ DERIVES FROM                                                    │
│  ├─ 🎯 Initiative: Q1 - Lançar Plataforma [Strategy]               │
│                                                                     │
│  ➡️ SUPPORTS                                                        │
│  ├─ ✓ Habit: Codar 2h por dia (streak: 23) [Journey]               │
│  └─ ✓ Habit: Review PRs toda manhã [Journey]                        │
│                                                                     │
│  📚 LEARNING                                                        │
│  └─ 📖 Course: React Avançado (60% complete) [Academy]              │
│                                                                     │
│  [+ Add Connection]                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 4. Suggestion Engine — IA Proativa

O Suggestion Engine é o cérebro da Connection Layer. Ele analisa contexto, eventos e links para gerar sugestões relevantes.

## Como Funciona

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SUGGESTION ENGINE FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  [Event Bus] ──→ [Trigger Detection] ──→ [Context Gathering]       │
│                          │                       │                  │
│                          ↓                       ↓                  │
│                   [Rule Matching] ←──── [User Preferences]          │
│                          │                                          │
│                          ↓                                          │
│                 [Suggestion Generation]                             │
│                          │                                          │
│                    ┌─────┴─────┐                                    │
│                    ↓           ↓                                    │
│            [Immediate]    [Queued]                                  │
│            (in-app)       (notification)                            │
│                    ↓           ↓                                    │
│                    └─────┬─────┘                                    │
│                          ↓                                          │
│                   [User Decision]                                   │
│                   ↙     ↓     ↘                                     │
│            [Accept] [Dismiss] [Snooze]                              │
│                 ↓       ↓         ↓                                 │
│           [Execute] [Learn]  [Reschedule]                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Modelo: Suggestion

```typescript
interface Suggestion {
  id: string;
  user_id: string;

  // Trigger
  trigger_event_id: string;
  trigger_event_type: string;
  trigger_entity: {
    type: EntityType;
    id: string;
    title: string;
  };

  // Sugestão
  suggestion_type: SuggestionType;
  action: SuggestionAction;
  title: string;
  description: string;
  reasoning: string;           // "Porque você criou a meta X..."
  confidence: number;          // 0-1

  // Pré-preenchimento
  prefilled_data?: Record<string, any>;

  // Destino
  target_module: ModuleType;
  target_route?: string;        // Deep link para executar

  // UI
  priority: 'low' | 'medium' | 'high';
  display_type: 'toast' | 'card' | 'modal' | 'notification';

  // Status
  status: 'pending' | 'shown' | 'accepted' | 'dismissed' | 'snoozed' | 'expired';

  // Timing
  created_at: Date;
  shown_at?: Date;
  decided_at?: Date;
  expires_at: Date;
  snooze_until?: Date;
}

type SuggestionType =
  | 'create_entity'      // Criar nova entidade
  | 'link_entities'      // Conectar entidades
  | 'complete_entity'    // Marcar como concluído
  | 'update_entity'      // Atualizar algo
  | 'enroll_course'      // Matricular em curso
  | 'start_habit'        // Iniciar hábito
  | 'review_progress'    // Revisar progresso
  | 'adjust_deadline';   // Ajustar prazo

interface SuggestionAction {
  type: string;          // "create_goal", "enroll_course", etc.
  module: ModuleType;
  params: Record<string, any>;
}
```

## Regras de Sugestão

```yaml
# suggestions_rules.yaml

rules:
  # Quando cria Goal de educação → sugerir cursos
  - name: goal_to_courses
    trigger:
      event: goal.created
      conditions:
        - goal.category in ['education', 'professional', 'skill']
    action:
      type: suggest_courses
      params:
        search_query: "{{goal.title}}"
        limit: 3
    suggestion:
      type: enroll_course
      title: "Cursos para {{goal.title}}"
      description: "Encontramos cursos que podem ajudar você a alcançar esta meta"
      confidence: 0.8
      priority: medium
      display_type: card
      expires_in: 7d

  # Quando Initiative é criada → criar Goal automaticamente
  - name: initiative_to_goal
    trigger:
      event: initiative.created
      conditions:
        - initiative.status == 'active'
    action:
      type: create_goal
      auto_execute: true  # Executa sem perguntar
      params:
        title: "{{initiative.title}}"
        scope: quarterly
        category: business
        linked_initiative: "{{initiative.id}}"
    notification:
      type: info
      title: "Meta criada automaticamente"
      body: "A meta '{{initiative.title}}' foi criada a partir da iniciativa"

  # Quando livro é concluído → sugerir criar goal de aplicação
  - name: book_to_application_goal
    trigger:
      event: book.completed
    action:
      type: create_goal
      auto_execute: false
    suggestion:
      type: create_entity
      title: "Aplicar aprendizados de '{{book.title}}'"
      description: "Você terminou o livro! Que tal criar uma meta para aplicar o que aprendeu?"
      confidence: 0.75
      priority: low
      prefilled_data:
        title: "Aplicar conceitos de {{book.title}}"
        category: education
        linked_books: ["{{book.id}}"]

  # Quando streak quebra → encorajar retomada
  - name: streak_broken_encouragement
    trigger:
      event: habit.streak_broken
      conditions:
        - habit.old_streak >= 7  # Só se tinha streak significativo
    action:
      type: encourage
    notification:
      type: celebration  # Tom positivo, não punitivo
      title: "Recomeçar é uma vitória"
      body: "Você teve um streak de {{habit.old_streak}} dias em '{{habit.name}}'. Que tal começar de novo hoje?"

  # Quando Goal está atrasado → sugerir ajuste
  - name: goal_overdue_adjustment
    trigger:
      event: goal.overdue
      conditions:
        - goal.days_overdue >= 7
    action:
      type: adjust_deadline
    suggestion:
      type: update_entity
      title: "Revisar prazo de '{{goal.title}}'?"
      description: "Esta meta está {{goal.days_overdue}} dias atrasada. Quer ajustar o prazo ou quebrar em tarefas menores?"
      confidence: 0.9
      priority: high
      display_type: modal
```

## Suggestion UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  💡 SUGGESTION                                               [×]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📚 Cursos para "Melhorar comunicação"                             │
│  ─────────────────────────────────────────                          │
│                                                                     │
│  Encontramos cursos que podem ajudar você a alcançar esta meta.    │
│                                                                     │
│  Sugestões:                                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🎓 Comunicação Assertiva para Líderes          [Matricular] │   │
│  │    4h · Academy · 4.8★                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🎓 Apresentações Executivas                    [Matricular] │   │
│  │    6h · Academy · 4.6★                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ℹ️ Baseado na meta "Melhorar comunicação" criada há 2min         │
│                                                                     │
│  [Ignorar]                                    [Ver todos os cursos] │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 5. Cascading Rules — Automações

Cascading Rules são automações que executam **automaticamente** quando certas condições são atendidas. Diferente de Suggestions, não pedem permissão.

## Regras de Cascateamento Ativas

| Trigger | Condição | Ação Automática | Pode Desativar? |
|---------|----------|-----------------|-----------------|
| `initiative.created` | status == 'active' | Criar Goal em Journey | ✅ Sim |
| `initiative.completed` | — | Completar Goal linkado | ✅ Sim |
| `initiative.status_changed` | new_status == 'critical' | Alertar via Notification | ✅ Sim |
| `goal.completed` | has_linked_initiative | Atualizar Initiative progress | ❌ Não |
| `habit.streak_milestone` | milestone in [7, 30, 100] | Criar celebração | ✅ Sim |
| `course.completed` | has_linked_goal | Atualizar Goal progress | ❌ Não |
| `brand.voice_updated` | — | Invalidar cache em PrototypOS | ❌ Não |

## Modelo: CascadeRule

```typescript
interface CascadeRule {
  id: string;
  name: string;
  description: string;

  // Trigger
  trigger_event: string;
  conditions: RuleCondition[];

  // Action
  actions: CascadeAction[];

  // Config
  enabled: boolean;
  user_can_disable: boolean;

  // Stats
  executions_count: number;
  last_executed_at?: Date;
}

interface CascadeAction {
  type: 'create' | 'update' | 'delete' | 'notify' | 'link';
  target_module: ModuleType;
  target_type?: EntityType;
  params: Record<string, any>;

  // Templating
  template?: string;  // Handlebars-style: "{{initiative.title}}"
}
```

## Configuração de Cascades (User Settings)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚙️ AUTOMAÇÕES                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  STRATEGY → JOURNEY                                                 │
│  ─────────────────────────                                          │
│  [✓] Criar meta automaticamente quando iniciativa é ativada        │
│  [✓] Completar meta quando iniciativa é concluída                  │
│  [✓] Alertar quando iniciativa vira "crítica"                      │
│                                                                     │
│  JOURNEY → ACADEMY                                                  │
│  ─────────────────────────                                          │
│  [✓] Sugerir cursos quando criar meta de educação                  │
│  [ ] Matricular automaticamente (desativado por padrão)            │
│                                                                     │
│  HABIT MILESTONES                                                   │
│  ─────────────────────────                                          │
│  [✓] Celebrar streaks de 7, 30 e 100 dias                          │
│  [✓] Enviar notificação quando streak quebrar                      │
│                                                                     │
│  BRAND → PROTOTYPOS                                                 │
│  ─────────────────────────                                          │
│  [✓] Usar voz da marca em PRDs gerados (não desativável)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 6. Cross-Module Workflows

Workflows são **sequências de ações** que atravessam múltiplos módulos. São a expressão máxima da Connection Layer.

## Workflow: Lançamento de Produto

```
┌─────────────────────────────────────────────────────────────────────┐
│                   WORKFLOW: PRODUCT LAUNCH                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. STRATEGY                                                        │
│     └─ Criar Cycle "Q1 2026"                                        │
│        └─ Criar Initiative "Lançar MVP"                             │
│                          │                                          │
│                    [CASCATA]                                        │
│                          ↓                                          │
│  2. JOURNEY                                                         │
│     └─ Goal criado automaticamente                                  │
│        ├─ User adiciona Habits de suporte                           │
│        └─ User linka livros relevantes                              │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  3. ACADEMY                                                         │
│     └─ Cursos sugeridos baseado em Goal                             │
│        └─ User se matricula                                         │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  4. PROTOTYPOS                                                      │
│     └─ Criar projeto vinculado                                      │
│        └─ PRD gerado com Brand voice                                │
│                          │                                          │
│                    [CASCATA]                                        │
│                          ↓                                          │
│  5. BRAND                                                           │
│     └─ Brand guidelines aplicadas                                   │
│        └─ Assets organizados por projeto                            │
│                                                                     │
│  ─────────────────────────────────────────────────────────────      │
│                                                                     │
│  RESULTADO: Todos os módulos trabalhando juntos                     │
│  USER EFFORT: Criou 1 initiative, sistema fez o resto               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Workflow: Desenvolvimento de Competência

```
┌─────────────────────────────────────────────────────────────────────┐
│                   WORKFLOW: SKILL DEVELOPMENT                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. JOURNEY                                                         │
│     └─ User cria Goal "Aprender React"                              │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  2. ACADEMY                                                         │
│     └─ 3 cursos sugeridos                                           │
│        └─ User escolhe e se matricula                               │
│           └─ Link: Course ↔ Goal (auto)                             │
│                          │                                          │
│                    [SUGESTÃO]                                       │
│                          ↓                                          │
│  3. JOURNEY (Books)                                                 │
│     └─ Livros sugeridos sobre React                                 │
│        └─ Link: Book ↔ Goal (auto)                                  │
│                          │                                          │
│                   [PROGRESSO]                                       │
│                          ↓                                          │
│  4. JOURNEY (Habits)                                                │
│     └─ Habit sugerido "Estudar React 30min/dia"                     │
│        └─ Link: Habit ↔ Goal (manual)                               │
│                          │                                          │
│               [CONCLUSÃO DO CURSO]                                  │
│                          ↓                                          │
│  5. JOURNEY                                                         │
│     └─ Goal progress atualizado automaticamente                     │
│        └─ Sugestão: criar Goal de aplicação prática                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 7. Inbox — Entrada Universal

O Inbox é o **ponto de entrada único** do sistema. Tudo começa aqui antes de ser organizado.

## Filosofia

> "Capture primeiro, organize depois."

O empreendedor não pode parar para decidir onde cada ideia vai. O Inbox recebe TUDO e depois o sistema (ou IA) ajuda a triar.

## Modelo: InboxItem

```typescript
interface InboxItem {
  id: string;
  user_id: string;

  // Conteúdo
  content: string;
  content_type: 'text' | 'voice' | 'image' | 'link' | 'file';
  attachments?: Attachment[];

  // Origem
  source: 'quick_capture' | 'voice' | 'email' | 'api' | 'share' | 'screenshot';
  source_metadata?: Record<string, any>;

  // Triagem IA
  ai_analysis?: {
    suggested_module: ModuleType;
    suggested_entity_type: EntityType;
    confidence: number;
    reasoning: string;
    extracted_entities?: {
      title?: string;
      date?: Date;
      category?: string;
      tags?: string[];
    };
  };

  // Status
  status: 'inbox' | 'processing' | 'triaged' | 'converted' | 'archived';

  // Resultado
  converted_to?: {
    module: ModuleType;
    entity_type: EntityType;
    entity_id: string;
  };

  // Timestamps
  created_at: Date;
  processed_at?: Date;
}
```

## Fluxo de Triagem

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INBOX TRIAGE FLOW                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CAPTURA                                                            │
│  ────────                                                           │
│  [Cmd+Shift+I] → Quick text capture                                 │
│  [Voice]       → Gravação + transcrição                             │
│  [Share]       → De outros apps                                     │
│  [Email]       → Forward para inbox@eximia.app                      │
│                                                                     │
│         ↓                                                           │
│  ┌─────────────┐                                                    │
│  │   INBOX     │                                                    │
│  │  (pending)  │                                                    │
│  └──────┬──────┘                                                    │
│         ↓                                                           │
│  ┌─────────────┐     ┌──────────────────┐                          │
│  │ IA ANALYSIS │ ──→ │ Sugestão         │                          │
│  │ (auto)      │     │ "Parece um Goal" │                          │
│  └──────┬──────┘     │ [85% confiança]  │                          │
│         ↓            └──────────────────┘                           │
│  ┌─────────────────────────────────────┐                           │
│  │         USER DECISION               │                           │
│  │                                     │                           │
│  │  [✓ Aceitar] [✏️ Editar] [📁 Manual]│                           │
│  │                                     │                           │
│  └──────┬──────────────┬───────────────┘                           │
│         ↓              ↓                                            │
│  ┌─────────────┐ ┌─────────────┐                                   │
│  │ AUTO CREATE │ │ MANUAL PICK │                                   │
│  │ (Journey)   │ │ (modal)     │                                   │
│  └──────┬──────┘ └──────┬──────┘                                   │
│         ↓              ↓                                            │
│  ┌─────────────────────────────────────┐                           │
│  │      ENTITY CREATED + LINKED        │                           │
│  │  + Link: InboxItem → Created Entity │                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Documentação Completa:** [PRD-Inbox-v5.0.md](../06_Inbox/PRD-Inbox-v5.0.md)

---

# 8. Notifications — Saída Proativa

O sistema de Notifications é a **saída proativa** da Connection Layer. É como o sistema "fala" com o usuário sem ser perguntado.

## Tipos de Notificação

| Tipo | Ícone | Quando | Tom |
|------|-------|--------|-----|
| **Reminder** | ⏰ | Tempo-baseado | Gentil |
| **Alert** | ⚠️ | Condição de negócio | Urgente |
| **Suggestion** | 💡 | IA detectou oportunidade | Curioso |
| **Celebration** | 🎉 | Conquista | Festivo |
| **Digest** | 📊 | Agendado | Informativo |
| **System** | ℹ️ | Status técnico | Neutro |

## Modelo: Notification

```typescript
interface Notification {
  id: string;
  user_id: string;

  // Conteúdo
  type: 'reminder' | 'alert' | 'suggestion' | 'celebration' | 'digest' | 'system';
  title: string;
  body: string;
  icon?: string;

  // Ação
  action_url?: string;
  action_label?: string;
  actions?: NotificationAction[];  // Múltiplas ações

  // Contexto
  source_module?: ModuleType;
  related_entity?: {
    type: EntityType;
    id: string;
    title: string;
  };

  // Delivery
  channels: ('in_app' | 'push' | 'email')[];
  priority: 'low' | 'normal' | 'high' | 'urgent';

  // Status
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'actioned' | 'dismissed';

  // Timing
  scheduled_for?: Date;
  sent_at?: Date;
  read_at?: Date;
  actioned_at?: Date;
}

interface NotificationAction {
  label: string;
  action: string;  // "complete_habit", "open_goal", etc.
  params?: Record<string, any>;
  style?: 'primary' | 'secondary' | 'destructive';
}
```

## Regras de Proatividade

```yaml
# notification_rules.yaml

schedules:
  # Daily habit reminder
  - name: daily_habit_reminder
    cron: "0 20 * * *"  # 20:00 todos os dias
    query:
      habits:
        status: active
        today_completed: false
    action:
      type: reminder
      channel: [push, in_app]
      title: "Hábitos do dia"
      body: "Você tem {{count}} hábitos para completar hoje"
      actions:
        - label: "Ver hábitos"
          action: "open"
          params: { route: "/journey/habits" }
        - label: "Completar todos"
          action: "complete_all_habits"

  # Weekly digest
  - name: weekly_digest
    cron: "0 18 * * 0"  # Domingo 18:00
    action:
      type: digest
      channel: [email]
      template: weekly_summary
      include:
        - habits_summary
        - goals_progress
        - courses_completed
        - suggestions_accepted

conditions:
  # Goal deadline approaching
  - name: goal_deadline_alert
    trigger:
      schedule: "0 9 * * *"  # Check diário às 9h
    query:
      goals:
        status: in_progress
        deadline: { $lte: "+7d" }
    action:
      type: alert
      priority: high
      channel: [push, in_app]
      title: "{{goal.title}} vence em {{days_remaining}} dias"
      body: "Progresso atual: {{goal.progress}}%"

  # Streak milestone celebration
  - name: streak_celebration
    trigger:
      event: habit.completed
    condition: streak in [7, 30, 100, 365]
    action:
      type: celebration
      channel: [push, in_app]
      title: "🎉 {{streak}} dias de {{habit.name}}!"
      body: "Você é incrível! Continue assim."
```

---

# 9. Métricas de Saúde

A Connection Layer tem suas próprias métricas para garantir que está funcionando.

## Dashboard de Conexão

```
┌─────────────────────────────────────────────────────────────────────┐
│              CONNECTION LAYER HEALTH DASHBOARD                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EVENTOS (últimas 24h)                                              │
│  ─────────────────────────                                          │
│  Published: 847          Processed: 842          Failed: 5          │
│  ████████████████████████████████████████████░░ 99.4%               │
│                                                                     │
│  LINKS ATIVOS                                                       │
│  ─────────────────────────                                          │
│  Total: 1,234            Cascaded: 456           Manual: 778        │
│  Avg links/entity: 3.2   Most connected: Goals (4.1 avg)            │
│                                                                     │
│  SUGESTÕES (últimos 7 dias)                                         │
│  ─────────────────────────                                          │
│  Generated: 89           Accepted: 31            Dismissed: 42      │
│  Acceptance Rate: 34.8%  ████████░░░░░░░░░░░░░░                     │
│                                                                     │
│  CASCADES (últimos 7 dias)                                          │
│  ─────────────────────────                                          │
│  Triggered: 23           Executed: 23            User reverted: 2   │
│  Success Rate: 91.3%     █████████████████████░                     │
│                                                                     │
│  TOP CROSS-MODULE PATHS                                             │
│  ─────────────────────────                                          │
│  1. Strategy → Journey → Academy      (34 interactions)             │
│  2. Journey → Academy                 (28 interactions)             │
│  3. Inbox → Journey                   (21 interactions)             │
│  4. Strategy → Journey → Habits       (18 interactions)             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Métricas-Chave

| Métrica | Definição | Target | Por que importa |
|---------|-----------|--------|-----------------|
| **Event Processing Rate** | % de eventos processados sem erro | > 99% | Confiabilidade do sistema |
| **Link Density** | Links por entidade (média) | > 3.0 | Quão conectado está o sistema |
| **Suggestion Acceptance** | % de sugestões aceitas | > 30% | Relevância da IA |
| **Cascade Success** | % de cascades executados corretamente | > 90% | Automações funcionando |
| **Cross-Module Interactions** | Ações envolvendo 2+ módulos/sessão | > 2.0 | Usuários usando a conexão |

---

## Referências Cruzadas

### Documentos Relacionados
- [PRD-Journey-v5.0.md](../01_Journey/PRD-Journey-v5.0.md) — Origem de muitos eventos
- [PRD-Academy-v5.0.md](../02_Academy/PRD-Academy-v5.0.md) — Consumidor de sugestões
- [PRD-Strategy-v5.0.md](../04_Strategy/PRD-Strategy-v5.0.md) — Cascateamento para Journey
- [PRD-Inbox-v5.0.md](../06_Inbox/PRD-Inbox-v5.0.md) — Entrada universal
- [PRD-API-Endpoints-v5.0.md](./PRD-API-Endpoints-v5.0.md) — Contratos de API

### Status de Implementação
**Prioridade:** ⭐ **CRÍTICA** — É o diferencial do produto

**Status Atual:** ❌ Não implementado

**Próximos Passos:**
1. Implementar Event Bus básico (Redis + Postgres)
2. Criar API de eventos
3. Implementar Entity Links (tabela de relações)
4. Desenvolver Suggestion Engine v1
5. Configurar Cascades Strategy → Journey

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **5.0** | 25/01/2026 | Modularização — Connection Layer extraída como PRD independente |
| 4.2 | 25/01/2026 | Expansão para 60% do PRD |
| 4.1 | 25/01/2026 | Adição de Inbox e Notifications |

---

*Este documento descreve o coração do ExímIA OS — a camada que transforma 5 apps isolados em um sistema nervoso central.*

[← Voltar ao Índice Master](../PRD-Master-Index-v5.0.md)
