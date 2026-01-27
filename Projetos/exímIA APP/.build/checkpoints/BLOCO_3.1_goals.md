# BLOCO 3.1 - Journey Goals

**Fase:** 3 - JOURNEY
**Status:** DONE
**Data:** 27 Janeiro 2026

---

## Escopo

Sistema completo de Goals (OKRs) com hierarquia de escopos, key results mensuráveis e tracking de progresso.

---

## Arquivos Criados

### Migration SQL
- `supabase/migrations/003_journey_goals.sql`
  - Tabela `goals` com hierarquia (parent_id)
  - Tabela `key_results` vinculada a goals
  - RLS policies para user isolation
  - Triggers para atualização de progresso
  - Índices otimizados

### Types
- `app/src/types/journey.ts`
  - Goal, KeyResult interfaces
  - GoalStatus, GoalScope, GoalCategory, GoalPriority enums
  - CreateGoalInput, UpdateGoalInput
  - GoalFilters
  - Config objects para UI (GOAL_STATUS_CONFIG, etc.)
  - Utility functions (getProgressColor, canHaveChildren, etc.)

### Hook
- `app/src/hooks/use-goals.ts`
  - `useGoals()` - Lista com filtros e CRUD
  - `useGoal()` - Goal individual com key results
  - Operações: create, update, delete, updateProgress, updateStatus
  - Key results: add, update, delete
  - Utilities: getGoalById, getGoalWithKeyResults, getChildGoals

### Components
- `app/src/components/journey/goal-card.tsx`
  - GoalCard com progress bar
  - StatusBadge, PriorityBadge, ScopeBadge, CategoryBadge
  - ProgressBar component

- `app/src/components/journey/goal-form.tsx`
  - GoalForm para criar/editar goals
  - KeyResultForm para key results
  - Seleção de categoria, prioridade, scope
  - Date pickers para start/target dates

- `app/src/components/journey/goal-list.tsx`
  - GoalList com filtros
  - FiltersBar (scope, status, category, priority)
  - ScopeGroup para agrupar por escopo
  - Empty states

- `app/src/components/journey/key-result-item.tsx`
  - KeyResultItem com progress
  - KeyResultsList

### Page
- `app/src/app/(dashboard)/journey/goals/page.tsx`
  - Página principal de Goals
  - MetricCards com stats
  - Modals para create/edit
  - Filtros e agrupamento

- `app/src/app/(dashboard)/journey/goals/[id]/page.tsx`
  - Página de detalhe do Goal
  - Key Results management
  - Progress updates

---

## Features Implementadas

### Goal Hierarchy (OKR-style)
- **Scopes:** Life → Yearly → Quarterly → Monthly → Weekly
- **Parent-child relationships:** Goals podem ter sub-goals
- **Cascading progress:** Progresso calculado baseado em key results

### Goal Properties
- Title, description, "why" (motivation)
- Category: business, personal, health, finance, education
- Priority: low, medium, high, critical
- Status: not_started, in_progress, completed, paused, cancelled
- Visual: color, icon
- Dates: start_date, target_date, completed_at

### Key Results
- Métricas mensuráveis (percentage, number, currency, boolean)
- Target value e current value
- Progress automático baseado em current/target
- Ordenação por position

### UI Features
- Progress bars com cores dinâmicas
- Badges coloridos para status/priority
- Filtros por scope, status, category, priority
- Agrupamento por scope
- Empty states informativos

---

## Database Schema

```sql
-- Goals Table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  why TEXT,
  scope goal_scope NOT NULL DEFAULT 'monthly',
  parent_id UUID REFERENCES goals(id),
  category goal_category NOT NULL DEFAULT 'personal',
  priority goal_priority NOT NULL DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  status goal_status NOT NULL DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  start_date DATE,
  target_date DATE,
  completed_at TIMESTAMPTZ,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Key Results Table
CREATE TABLE key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  metric_type metric_type NOT NULL DEFAULT 'percentage',
  target_value NUMERIC NOT NULL DEFAULT 100,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  status key_result_status NOT NULL DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Exports Adicionados

### hooks/index.ts
```typescript
export { useGoals, useGoal } from './use-goals';
```

### components/journey/index.ts
```typescript
export { GoalCard, ProgressBar, StatusBadge, PriorityBadge, ScopeBadge, CategoryBadge } from "./goal-card";
export { KeyResultItem, KeyResultsList } from "./key-result-item";
export { GoalForm, KeyResultForm } from "./goal-form";
export { GoalList } from "./goal-list";
```

---

## Dependências

- BLOCO 1.1 (Connection Schema) - Para entity_links
- BLOCO 0.5 (Molecules) - MetricCard
- BLOCO 0.6 (Layout) - DashboardShell, Header

---

## Testes Sugeridos

1. CRUD de goals
2. Hierarquia parent-child
3. Key results progress calculation
4. Filtros funcionando
5. RLS policies (user isolation)

---

*Checkpoint criado em 27/01/2026*
