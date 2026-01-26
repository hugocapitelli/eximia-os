# PRD — Journey (Execução Pessoal)
**Módulo:** 01_Journey
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Especificação Completa

---

## Sumário Executivo

O módulo **Journey** é o núcleo de execução diária do empreendedor exímio — onde metas, hábitos, leitura e calendário convergem para transformar intenção em ação.

**Propósito:** Transformar objetivos estratégicos em execução consistente através de gestão hierárquica de metas, tracking de hábitos e biblioteca pessoal de conhecimento.

**Conexão com Connection Layer:** Journey é um dos módulos mais conectados do sistema — recebe cascateamentos de Strategy, dispara eventos para Academy, e alimenta Brand com contexto de expertise.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Features](#2-features)
3. [Modelos de Dados](#3-modelos-de-dados)
4. [Conexões com Connection Layer](#4-conexões-com-connection-layer)
5. [Fluxos de Usuário](#5-fluxos-de-usuário)
6. [API Endpoints](#6-api-endpoints)
7. [Métricas de Sucesso](#7-métricas-de-sucesso)

---

# 1. Visão Geral

## 1.1 Filosofia

Journey é sobre **execução consistente** — não perfeccionismo, mas progresso diário. O módulo traduz ambições de longo prazo em ações tangíveis do dia a dia.

```
┌─────────────────────────────────────────────────────────────────┐
│                     JOURNEY WORKFLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Strategy Initiative                                            │
│       ↓                                                         │
│  Goal (Yearly/Quarterly/Monthly)                                │
│       ↓                                                         │
│  Habits (Daily execution)                                       │
│       ↓                                                         │
│  Completion & Progress                                          │
│       ↓                                                         │
│  Feedback Loop → Strategy                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Princípios

| Princípio | Aplicação |
|-----------|-----------|
| **Hierarquia Clara** | Life → Yearly → Quarterly → Monthly → Weekly → Task |
| **Hábitos como Sistema** | Não motivação, mas repetição estruturada |
| **Leitura como Prática** | Livros não são decoração, são ferramentas |
| **Visibilidade Total** | Dashboard mostra o que importa, não tudo |

---

# 2. Features

## 2.1 Features Overview

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Visão consolidada: metas ativas, hábitos do dia, próximos eventos | `/journey` |
| **Goals** | Gestão hierárquica de metas (Life → Yearly → Quarterly → Monthly → Task) | `/journey/goals` |
| **Habits** | Tracking de hábitos com streaks, completions e analytics | `/journey/habits` |
| **Library** | Biblioteca pessoal de livros com notas, citações e progresso | `/journey/library` |
| **Authors** | Perfis de autores influentes com insights extraídos | `/journey/authors` |
| **Calendar** | Calendário integrado com Google Calendar | `/journey/calendar` |

## 2.2 Dashboard

O Dashboard é a **home do Journey** — mostra o estado atual de execução do usuário.

### Componentes do Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                     JOURNEY DASHBOARD                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🚀 Bom dia, Hugo!                     25 de Janeiro, 2026      │
│  Você tem 3 hábitos pendentes e 2 metas atrasadas.             │
│                                                                 │
│  ┌─ Quick Stats ───────────────────────────────────────────┐   │
│  │  Metas: 8/12 (67%)  │  Hábitos: 5/8 (63%)               │   │
│  │  Livros: 3 lendo    │  Streak: 45 dias 🔥               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Hábitos de Hoje ──────────────────────────────────────┐   │
│  │  ○ Meditação (15min)                       [Completar] │   │
│  │  ○ Leitura (30min)                         [Completar] │   │
│  │  ✓ Exercício (45min)                        Concluído  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Metas em Foco ────────────────────────────────────────┐   │
│  │  [GoalCard: Lançar MVP ExímIA Finance - 35%]          │   │
│  │  [GoalCard: Ler 24 livros em 2026 - 12%]              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ Sugestões IA ──────────────────────────[Ver Todas]───┐   │
│  │  💡 Curso relevante: "Liderança Situacional"          │   │
│  │                                    [Ver] [Dispensar]   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2.3 Goals (Metas)

Sistema hierárquico de gestão de metas inspirado em OKRs.

### Hierarquia de Goals

```
Life Goals (Vida toda)
  ↓
Yearly Goals (Anuais)
  ↓
Quarterly Goals (Trimestrais)
  ↓
Monthly Goals (Mensais)
  ↓
Weekly Goals (Semanais)
  ↓
Tasks (Tarefas)
```

### Tipos de Goals

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Objective** | Meta qualitativa de alto nível | "Construir autoridade em IA" |
| **Key Result** | Resultado mensurável | "Publicar 12 artigos técnicos" |
| **Task** | Ação específica e concreta | "Escrever artigo sobre Transformers" |

### Estados de Goals

```typescript
type GoalStatus =
  | 'not_started'  // Ainda não começou
  | 'in_progress'  // Em execução
  | 'completed'    // Finalizado
  | 'paused'       // Pausado temporariamente
  | 'cancelled';   // Cancelado
```

### Conexões de Goals

Goals podem se conectar com:
- **Habits:** Meta de exercício → Hábito de treinar 5x/semana
- **Books:** Meta de aprendizado → Livro "Deep Learning"
- **Initiatives:** Meta cascateada de Strategy
- **Courses:** Meta de skill → Curso na Academy

## 2.4 Habits (Hábitos)

Sistema de tracking de hábitos com foco em **streaks** e **consistência**.

### Filosofia de Hábitos

> *"Você não sobe ao nível dos seus objetivos. Você cai ao nível dos seus sistemas."* — James Clear

Journey implementa hábitos como **sistemas**, não intenções:
- Frequência definida (diário, semanal, mensal)
- Tracking visual com streaks
- Reminder automático
- Analytics de completion rate

### Tipos de Frequência

```typescript
type HabitFrequency =
  | 'daily'       // Todo dia
  | 'weekly'      // Dias específicos da semana
  | 'monthly';    // X vezes no mês
```

### Gamification

| Elemento | Descrição |
|----------|-----------|
| **Streak** | Dias consecutivos completos |
| **Best Streak** | Maior streak já alcançado |
| **Completion Rate** | % de completions vs expectativa |
| **Badges** | Conquistas especiais (7d, 30d, 100d, etc.) |

### Hábitos e Goals

Hábitos podem ser linkados a Goals:
```
Goal: "Perder 10kg em Q1"
  ↓
Habit: "Treinar 5x/semana"
  ↓
Completion impacta progresso do Goal
```

## 2.5 Library (Biblioteca)

Gestão de livros, notas, citações e progresso de leitura.

### Features da Library

| Feature | Descrição |
|---------|-----------|
| **Book Tracking** | Páginas lidas, status, datas |
| **Notes** | Anotações por capítulo/página |
| **Quotes** | Citações marcadas com contexto |
| **Authors** | Perfis de autores com biografia |
| **Collections** | Organização por tema/categoria |
| **Reading Goals** | "Ler 24 livros em 2026" |

### Book Status Flow

```
To Read → Reading → Completed
            ↓
        Abandoned
```

### Conexão com Academy

Quando um livro é relevante para um curso:
```
Academy: Curso "Product Management"
   ↓ [sugestão IA]
Library: Adiciona livro "Inspired" por Marty Cagan
```

## 2.6 Calendar

Integração com Google Calendar para visão unificada de compromissos.

### Features

- Sincronização bidirecional com Google Calendar
- Eventos de metas com deadline próximo
- Reminder de hábitos em horários específicos
- Blocos de tempo para foco profundo

---

# 3. Modelos de Dados

## 3.1 Goal (Meta)

```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;

  // Classificação
  category: 'business' | 'personal' | 'health' | 'finance' | 'education';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scope: 'life' | 'yearly' | 'quarterly' | 'monthly' | 'weekly';

  // Hierarquia
  type: 'objective' | 'key_result' | 'task';
  parent_id?: string;

  // Status
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
  progress: number; // 0-100

  // Datas
  start_date?: Date;
  deadline?: Date;

  // Conexões (Connection Layer)
  linked_habits: string[];
  linked_books: string[];
  linked_initiatives: string[]; // De Strategy
  kpis: KPI[];

  // Meta
  tags: string[];
  created_at: Date;
  updated_at: Date;
}
```

## 3.2 Habit (Hábito)

```typescript
interface Habit {
  id: string;
  name: string;
  description?: string;

  // Configuração
  frequency: 'daily' | 'weekly' | 'monthly';
  target_days?: number[];  // [1, 3, 5] = Segunda, Quarta, Sexta
  color: string;
  icon?: string;

  // Tracking
  streak: number;
  best_streak: number;
  completion_rate: number;
  completions: HabitCompletion[];

  // Conexão
  linked_goal?: string;

  // Status
  status: 'active' | 'paused' | 'archived';

  // Reminder
  reminder_time?: string; // "07:00"
  reminder_enabled: boolean;

  // Meta
  created_at: Date;
  updated_at: Date;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: Date;
  note?: string;
}
```

## 3.3 Book (Livro)

```typescript
interface Book {
  id: string;

  // Info básica
  title: string;
  author: string;
  cover_url?: string;
  isbn?: string;

  // Progresso
  total_pages: number;
  current_page: number;
  status: 'to_read' | 'reading' | 'completed' | 'abandoned';

  // Avaliação
  rating?: number;  // 1-5
  is_favorite: boolean;

  // Conteúdo
  notes: BookNote[];
  quotes: BookQuote[];
  summary?: string;

  // Conexão
  linked_goals: string[];

  // Datas
  started_at?: Date;
  finished_at?: Date;

  // Meta
  created_at: Date;
  updated_at: Date;
}

interface BookNote {
  id: string;
  book_id: string;
  content: string;
  page?: number;
  chapter?: string;
  created_at: Date;
}

interface BookQuote {
  id: string;
  book_id: string;
  text: string;
  page?: number;
  created_at: Date;
}
```

---

# 4. Conexões com Connection Layer

> Ver [PRD-Connection-Layer-v5.0.md](../00_Core/PRD-Connection-Layer-v5.0.md) para detalhes completos.

## 4.1 Eventos Emitidos por Journey

| Evento | Trigger | Data | Consumidores |
|--------|---------|------|--------------|
| `goal.created` | Usuário cria meta | `{goal_id, category, scope}` | Academy, Strategy, Brand |
| `goal.completed` | Meta marcada como completa | `{goal_id, duration_days}` | Strategy, Inbox |
| `goal.deadline_approaching` | Faltam 7 dias para deadline | `{goal_id, days_remaining}` | Notifications |
| `habit.completed` | Hábito completado | `{habit_id, streak}` | Goals (atualiza progress) |
| `habit.streak_milestone` | Streak atinge 7, 30, 100 dias | `{habit_id, streak}` | Notifications, Brand |
| `book.completed` | Livro finalizado | `{book_id, author, rating}` | Academy, Brand |
| `book.quote_added` | Citação salva | `{book_id, quote_text}` | Brand (alimenta voice) |

## 4.2 Eventos Consumidos por Journey

| Evento | Source | Ação Journey |
|--------|--------|--------------|
| `initiative.created` | Strategy | Sugere criar Goal linkado |
| `initiative.updated` | Strategy | Atualiza progresso de Goals cascateados |
| `course.completed` | Academy | Sugere adicionar skill ao Goal relacionado |
| `inbox.item_processed` | Inbox | Cria Goal/Task se aplicável |

## 4.3 Entity Links

Journey participa ativamente do sistema de Entity Links:

```typescript
// Exemplo: Goal linkado a Initiative
{
  source_module: 'journey',
  source_type: 'goal',
  source_id: 'goal-123',
  target_module: 'strategy',
  target_type: 'initiative',
  target_id: 'init-456',
  relationship: 'derived_from',
  created_at: new Date()
}

// Exemplo: Habit linkado a Goal
{
  source_module: 'journey',
  source_type: 'habit',
  source_id: 'habit-789',
  target_module: 'journey',
  target_type: 'goal',
  target_id: 'goal-123',
  relationship: 'supports',
  created_at: new Date()
}
```

## 4.4 Sugestões IA

Journey recebe sugestões proativas da Connection Layer:

```yaml
# Exemplo: Sugerir curso baseado em Goal
trigger: goal.created
condition:
  - goal.category == 'education'
  - goal.title contains ['product', 'management']
action:
  type: suggestion
  target_module: academy
  confidence: 0.85
  message: "Encontramos um curso relevante: 'Product Management Fundamentals'"
```

---

# 5. Fluxos de Usuário

## 5.1 Criar Meta a partir de Initiative

```
1. User em Strategy cria Initiative "Lançar MVP"
2. Connection Layer detecta evento initiative.created
3. Suggestion Engine analisa e gera sugestão
4. Notificação aparece em Journey:
   "💡 Criar meta para Initiative 'Lançar MVP'?"
5. User aceita
6. Journey cria Goal pré-preenchido:
   - Title: "Lançar MVP"
   - Linked initiative: [init-456]
   - Deadline: (herdado da initiative)
7. Entity Link criado bidirecionalmente
```

## 5.2 Completar Hábito e Atualizar Goal

```
1. User completa hábito "Treinar 5x/semana"
2. Journey registra completion
3. Verifica se habit tem linked_goal
4. Se sim, recalcula progresso do Goal baseado em completions
5. Emite evento habit.completed
6. Se streak atingiu milestone (7, 30, 100d):
   - Emite habit.streak_milestone
   - Notificação de conquista
   - Badge desbloqueado
```

## 5.3 Adicionar Livro e Receber Curso Relacionado

```
1. User adiciona livro "Inspired" por Marty Cagan
2. Journey emite book.added
3. Academy Suggestion Engine detecta:
   - Livro é sobre Product Management
   - User tem Goal relacionado a "produto"
4. Gera sugestão:
   "📚 Baseado no livro 'Inspired', temos um curso:
    'Product Discovery Fundamentals'"
5. User vê sugestão no Dashboard
6. Se aceitar, é redirecionado para Academy
```

---

# 6. API Endpoints

```
# Goals
GET    /api/journey/goals
POST   /api/journey/goals
GET    /api/journey/goals/:id
PUT    /api/journey/goals/:id
DELETE /api/journey/goals/:id
PATCH  /api/journey/goals/:id/progress

# Habits
GET    /api/journey/habits
POST   /api/journey/habits
GET    /api/journey/habits/:id
PUT    /api/journey/habits/:id
DELETE /api/journey/habits/:id
POST   /api/journey/habits/:id/complete
GET    /api/journey/habits/:id/analytics

# Books
GET    /api/journey/books
POST   /api/journey/books
GET    /api/journey/books/:id
PUT    /api/journey/books/:id
DELETE /api/journey/books/:id
POST   /api/journey/books/:id/notes
POST   /api/journey/books/:id/quotes
PATCH  /api/journey/books/:id/progress

# Calendar
GET    /api/journey/calendar/events
POST   /api/journey/calendar/events
PUT    /api/journey/calendar/events/:id
DELETE /api/journey/calendar/events/:id
POST   /api/journey/calendar/sync  # Google Calendar sync

# Dashboard
GET    /api/journey/dashboard
```

---

# 7. Métricas de Sucesso

## 7.1 Métricas Primárias

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Habit Completion Rate** | Completados / (Ativos × Dias) | > 70% |
| **Goal Completion Rate** | Concluídos / Criados (30d) | > 50% |
| **Streak Retention** | Usuários com streak ≥7 dias | > 30% |
| **Library Activity** | Livros em progresso / usuário | > 2 |

## 7.2 Métricas de Conexão

| Métrica | O Que Mede | Target |
|---------|------------|--------|
| **Goal → Habit Link Rate** | Goals com hábitos vinculados | > 60% |
| **Cascade Acceptance** | Goals criados via Strategy suggestion | > 70% |
| **Cross-Module Navigation** | Cliques Journey → outros módulos | > 2/sessão |

## 7.3 Métricas de Engajamento

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Daily Active Users** | Usuários que acessam Journey/dia | Baseline |
| **Habit Check-in Time** | Tempo médio para completar hábitos | < 2min |
| **Dashboard Return Rate** | % que retornam ao dashboard | > 80% |

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **5.0** | 25/01/2026 | Modularização do PRD original. Especificação completa de Journey. |

---

## Referências

- [PRD-Connection-Layer-v5.0.md](../00_Core/PRD-Connection-Layer-v5.0.md) — Integração de eventos e sugestões
- [PRD-Strategy-v5.0.md](../04_Strategy/PRD-Strategy-v5.0.md) — Cascateamento de initiatives
- [PRD-Academy-v5.0.md](../02_Academy/PRD-Academy-v5.0.md) — Sugestões de cursos
- [MANIFESTO.md](../MANIFESTO.md) — Visão e filosofia

---

*Journey v5.0 — De Objetivos a Execução*
*ExímIA OS — 2026*
