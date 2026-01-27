# BLOCO 3.2 - Journey Habits

**Fase:** 3 - JOURNEY
**Status:** DONE
**Data:** 27 Janeiro 2026

---

## Escopo

Sistema de tracking de hábitos com streaks, completions diárias, badges de gamificação e calendário visual.

---

## Arquivos Criados

### Migration SQL
- `supabase/migrations/004_journey_habits.sql`
  - Tabela `habits` com configuração de frequência
  - Tabela `habit_completions` para tracking diário
  - RLS policies para user isolation
  - Triggers para atualização de streaks
  - Functions: complete_habit, uncomplete_habit, get_habit_completion_rate
  - Índices otimizados

### Types
- `app/src/types/journey.ts` (extensão)
  - Habit, HabitWithStatus, HabitCompletion interfaces
  - HabitFrequency, HabitStatus enums
  - HabitBadge, HabitStats
  - CalendarDay, CalendarMonth para visualização
  - Config objects (FREQUENCY_LABELS, HABIT_STATUS_CONFIG, etc.)
  - Utility functions (isHabitDueToday, getStreakColor, etc.)
  - DEFAULT_HABIT_ICONS, DEFAULT_HABIT_COLORS

### Hook
- `app/src/hooks/use-habits.ts`
  - `useHabits()` - Lista com filtros, stats, completions
  - `useSingleHabit()` - Habit individual com histórico
  - Operações: create, update, delete
  - Completions: completeHabit, uncompleteHabit
  - History: getCompletionHistory, getCalendarMonth
  - Stats calculadas automaticamente

### Components
- `app/src/components/journey/habit-card.tsx`
  - HabitCard com completion toggle
  - Streak display
  - Frequência e target days

- `app/src/components/journey/habit-form.tsx`
  - HabitForm para criar/editar
  - HabitFormModal
  - Seleção de ícone e cor
  - Configuração de frequência e target days

- `app/src/components/journey/habit-list.tsx`
  - HabitList com filtros
  - CompactHabitList (para dashboard)
  - Filtros por status, frequência

- `app/src/components/journey/habit-tracker.tsx`
  - HabitTracker (calendário mensal)
  - MiniHabitCalendar
  - HabitHeatmap (estilo GitHub)

- `app/src/components/journey/streak-badge.tsx`
  - StreakBadge com cores dinâmicas
  - StreakIndicator
  - BadgeCollection (milestones)

### Page
- `app/src/app/(dashboard)/journey/habits/page.tsx`
  - Página principal de Habits
  - MetricCards com stats do dia
  - Sidebar com streaks overview
  - Calendar preview
  - Modals para create/edit

---

## Features Implementadas

### Habit Configuration
- **Frequency:** daily, weekly, monthly
- **Target Days:** Para hábitos semanais (dom, seg, ter, etc.)
- **Target Count:** Vezes por período
- **Visual:** icon (emoji) + color

### Streak System
- Current streak atualizado automaticamente
- Best streak histórico
- Total completions tracking
- Streak badges em milestones (7, 30, 100 dias)

### Daily Tracking
- Check/uncheck de completions
- Notes opcionais em completions
- Status automático (completed_today, is_due_today)
- Completion rate calculada (últimos 30 dias)

### Gamification
- Badges por milestones de streak
- Cores dinâmicas por streak length
- Visual feedback de progresso

### Calendar Views
- Calendário mensal com completions
- Heatmap estilo GitHub
- Mini calendar para sidebar

---

## Database Schema

```sql
-- Habits Table
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '🎯',
  color TEXT NOT NULL DEFAULT '#6366F1',
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  target_days INTEGER[] DEFAULT '{}',
  target_count INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  total_completions INTEGER NOT NULL DEFAULT 0,
  status habit_status NOT NULL DEFAULT 'active',
  linked_goal_id UUID REFERENCES goals(id),
  badges JSONB DEFAULT '[]',
  last_completed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habit Completions Table
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  completed_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Database Functions
CREATE FUNCTION complete_habit(p_habit_id UUID, p_notes TEXT DEFAULT NULL)
CREATE FUNCTION uncomplete_habit(p_habit_id UUID, p_date DATE)
CREATE FUNCTION get_habit_completion_rate(p_habit_id UUID, p_days INTEGER)
```

---

## Exports Adicionados

### hooks/index.ts
```typescript
export { useHabits, useSingleHabit } from './use-habits';
```

### components/journey/index.ts
```typescript
export { HabitCard } from "./habit-card";
export { HabitForm, HabitFormModal } from "./habit-form";
export { HabitList, CompactHabitList } from "./habit-list";
export { HabitTracker, MiniHabitCalendar, HabitHeatmap } from "./habit-tracker";
export { StreakBadge, StreakIndicator, BadgeCollection } from "./streak-badge";
```

---

## Dependências

- BLOCO 3.1 (Goals) - Para linked_goal_id
- BLOCO 0.5 (Molecules) - MetricCard
- BLOCO 0.6 (Layout) - DashboardShell, Header
- date-fns - Para manipulação de datas

---

## Testes Sugeridos

1. CRUD de habits
2. Complete/uncomplete workflow
3. Streak calculation após completions
4. Badge awarding em milestones
5. Calendar rendering
6. RLS policies (user isolation)

---

*Checkpoint criado em 27/01/2026*
