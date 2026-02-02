# Story EXIMIA-012: Journey Module API

**Story ID:** EXIMIA-012
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 4
**Pontos:** 8
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-011 (Journey Schema)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter uma API completa para o módulo Journey,
**Para que** o frontend possa criar, ler, atualizar e deletar Goals e Habits.

---

## Contexto

API usando Server Actions do Next.js + Supabase.
Padrão: `/lib/actions/journey.ts` com funções server-side.

---

## Acceptance Criteria

### Goals API
- [ ] `getGoals(filters)` — Listar goals do usuário
- [ ] `getGoal(id)` — Buscar goal específica com KRs
- [ ] `createGoal(data)` — Criar nova goal
- [ ] `updateGoal(id, data)` — Atualizar goal
- [ ] `deleteGoal(id)` — Deletar goal
- [ ] `updateKeyResult(id, data)` — Atualizar KR progress

### Habits API
- [ ] `getHabits(filters)` — Listar habits ativos
- [ ] `getHabit(id)` — Buscar habit específico
- [ ] `createHabit(data)` — Criar novo habit
- [ ] `updateHabit(id, data)` — Atualizar habit
- [ ] `deleteHabit(id)` — Deletar/arquivar habit
- [ ] `logHabit(habitId, date, data)` — Registrar conclusão
- [ ] `getHabitLogs(habitId, dateRange)` — Histórico de logs

### Dashboard API
- [ ] `getJourneyDashboard()` — Dados agregados para dashboard
- [ ] `getTodayHabits()` — Habits do dia atual
- [ ] `getActiveGoals()` — Goals ativas com progresso

---

## Technical Details

### Goals Actions

```typescript
// lib/actions/journey/goals.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type Goal = Database["public"]["Tables"]["goals"]["Row"];
type GoalInsert = Database["public"]["Tables"]["goals"]["Insert"];
type GoalUpdate = Database["public"]["Tables"]["goals"]["Update"];
type KeyResult = Database["public"]["Tables"]["key_results"]["Row"];

// Types
interface GoalFilters {
  status?: Goal["status"];
  priority?: Goal["priority"];
  timeframe?: Goal["timeframe"];
  search?: string;
}

interface GoalWithKeyResults extends Goal {
  key_results: KeyResult[];
}

// ============================================================================
// GET GOALS
// ============================================================================

export async function getGoals(filters: GoalFilters = {}): Promise<Goal[]> {
  const supabase = createClient();

  let query = supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.priority) {
    query = query.eq("priority", filters.priority);
  }

  if (filters.timeframe) {
    query = query.eq("timeframe", filters.timeframe);
  }

  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

// ============================================================================
// GET SINGLE GOAL (with Key Results)
// ============================================================================

export async function getGoal(id: string): Promise<GoalWithKeyResults | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("goals")
    .select(`
      *,
      key_results (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(error.message);
  }

  return data as GoalWithKeyResults;
}

// ============================================================================
// CREATE GOAL
// ============================================================================

interface CreateGoalInput {
  title: string;
  description?: string;
  why?: string;
  priority?: Goal["priority"];
  timeframe?: Goal["timeframe"];
  start_date?: string;
  due_date?: string;
  tags?: string[];
  color?: string;
  icon?: string;
  key_results?: Omit<KeyResult, "id" | "goal_id" | "user_id" | "created_at" | "updated_at">[];
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Create goal
  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      why: input.why,
      priority: input.priority || "medium",
      timeframe: input.timeframe || "quarterly",
      status: "draft",
      start_date: input.start_date,
      due_date: input.due_date,
      tags: input.tags || [],
      color: input.color,
      icon: input.icon,
    })
    .select()
    .single();

  if (goalError) throw new Error(goalError.message);

  // Create key results if provided
  if (input.key_results && input.key_results.length > 0) {
    const keyResultsToInsert = input.key_results.map((kr, index) => ({
      goal_id: goal.id,
      user_id: user.id,
      title: kr.title,
      description: kr.description,
      metric_type: kr.metric_type || "percentage",
      target_value: kr.target_value || 100,
      current_value: kr.current_value || 0,
      unit: kr.unit,
      weight: kr.weight || 1.0,
      sort_order: index,
    }));

    const { error: krError } = await supabase
      .from("key_results")
      .insert(keyResultsToInsert);

    if (krError) throw new Error(krError.message);
  }

  revalidatePath("/journey");
  revalidatePath("/journey/goals");

  return goal;
}

// ============================================================================
// UPDATE GOAL
// ============================================================================

export async function updateGoal(id: string, input: GoalUpdate): Promise<Goal> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("goals")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/journey");
  revalidatePath(`/journey/goals/${id}`);

  return data;
}

// ============================================================================
// DELETE GOAL
// ============================================================================

export async function deleteGoal(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/journey");
  revalidatePath("/journey/goals");
}

// ============================================================================
// UPDATE KEY RESULT
// ============================================================================

export async function updateKeyResult(
  id: string,
  input: { current_value?: number; completed?: boolean }
): Promise<KeyResult> {
  const supabase = createClient();

  const updateData: any = { ...input };

  if (input.completed) {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("key_results")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Get goal to revalidate
  const { data: kr } = await supabase
    .from("key_results")
    .select("goal_id")
    .eq("id", id)
    .single();

  if (kr) {
    revalidatePath(`/journey/goals/${kr.goal_id}`);
  }

  revalidatePath("/journey");

  return data;
}
```

### Habits Actions

```typescript
// lib/actions/journey/habits.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/supabase";

type Habit = Database["public"]["Tables"]["habits"]["Row"];
type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

// ============================================================================
// GET HABITS
// ============================================================================

export async function getHabits(activeOnly = true): Promise<Habit[]> {
  const supabase = createClient();

  let query = supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });

  if (activeOnly) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

// ============================================================================
// GET SINGLE HABIT
// ============================================================================

export async function getHabit(id: string): Promise<Habit | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
}

// ============================================================================
// CREATE HABIT
// ============================================================================

interface CreateHabitInput {
  title: string;
  description?: string;
  frequency?: Habit["frequency"];
  frequency_config?: Record<string, any>;
  target_per_period?: number;
  duration_minutes?: number;
  preferred_time?: string;
  reminder_time?: string;
  icon?: string;
  color?: string;
}

export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: user.id,
      title: input.title,
      description: input.description,
      frequency: input.frequency || "daily",
      frequency_config: input.frequency_config || {},
      target_per_period: input.target_per_period || 1,
      duration_minutes: input.duration_minutes,
      preferred_time: input.preferred_time,
      reminder_time: input.reminder_time,
      icon: input.icon,
      color: input.color,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/journey");
  revalidatePath("/journey/habits");

  return data;
}

// ============================================================================
// UPDATE HABIT
// ============================================================================

export async function updateHabit(
  id: string,
  input: Partial<CreateHabitInput & { active: boolean }>
): Promise<Habit> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("habits")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/journey");
  revalidatePath("/journey/habits");

  return data;
}

// ============================================================================
// DELETE (ARCHIVE) HABIT
// ============================================================================

export async function archiveHabit(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("habits")
    .update({
      active: false,
      archived_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/journey");
  revalidatePath("/journey/habits");
}

// ============================================================================
// LOG HABIT COMPLETION
// ============================================================================

interface LogHabitInput {
  completed: boolean;
  duration_minutes?: number;
  notes?: string;
  mood?: number;
}

export async function logHabit(
  habitId: string,
  date: string, // YYYY-MM-DD
  input: LogHabitInput
): Promise<HabitLog> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Upsert to handle re-logging same day
  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        log_date: date,
        completed: input.completed,
        completed_at: input.completed ? new Date().toISOString() : null,
        duration_minutes: input.duration_minutes,
        notes: input.notes,
        mood: input.mood,
      },
      {
        onConflict: "habit_id,log_date",
      }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/journey");
  revalidatePath("/journey/habits");

  return data;
}

// ============================================================================
// GET HABIT LOGS
// ============================================================================

interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
}

export async function getHabitLogs(
  habitId: string,
  dateRange: DateRange
): Promise<HabitLog[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", habitId)
    .gte("log_date", dateRange.from)
    .lte("log_date", dateRange.to)
    .order("log_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ============================================================================
// GET TODAY'S HABITS (with completion status)
// ============================================================================

interface HabitWithTodayStatus extends Habit {
  completed_today: boolean;
}

export async function getTodayHabits(): Promise<HabitWithTodayStatus[]> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  // Get active habits
  const { data: habits, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("active", true);

  if (habitsError) throw new Error(habitsError.message);

  // Get today's logs
  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("habit_id, completed")
    .eq("log_date", today);

  if (logsError) throw new Error(logsError.message);

  // Merge
  const logsMap = new Map(logs?.map((l) => [l.habit_id, l.completed]) || []);

  return (habits || []).map((habit) => ({
    ...habit,
    completed_today: logsMap.get(habit.id) || false,
  }));
}
```

### Dashboard Actions

```typescript
// lib/actions/journey/dashboard.ts
"use server";

import { createClient } from "@/lib/supabase/server";

interface JourneyDashboardData {
  goals: {
    total: number;
    active: number;
    completed: number;
    averageProgress: number;
  };
  habits: {
    total: number;
    completedToday: number;
    currentStreak: number;
    bestStreak: number;
  };
  books: {
    reading: number;
    completed: number;
    wishlist: number;
  };
}

export async function getJourneyDashboard(): Promise<JourneyDashboardData> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  // Goals stats
  const { data: goals } = await supabase
    .from("goals")
    .select("status, progress");

  const goalsData = goals || [];
  const activeGoals = goalsData.filter((g) => g.status === "active");

  // Habits stats
  const { data: habits } = await supabase
    .from("habits")
    .select("current_streak, best_streak")
    .eq("active", true);

  const { data: todayLogs } = await supabase
    .from("habit_logs")
    .select("completed")
    .eq("log_date", today)
    .eq("completed", true);

  const habitsData = habits || [];
  const maxStreak = Math.max(...habitsData.map((h) => h.current_streak), 0);
  const maxBestStreak = Math.max(...habitsData.map((h) => h.best_streak), 0);

  // Books stats
  const { data: books } = await supabase
    .from("books")
    .select("status");

  const booksData = books || [];

  return {
    goals: {
      total: goalsData.length,
      active: activeGoals.length,
      completed: goalsData.filter((g) => g.status === "completed").length,
      averageProgress: activeGoals.length > 0
        ? activeGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals.length
        : 0,
    },
    habits: {
      total: habitsData.length,
      completedToday: todayLogs?.length || 0,
      currentStreak: maxStreak,
      bestStreak: maxBestStreak,
    },
    books: {
      reading: booksData.filter((b) => b.status === "reading").length,
      completed: booksData.filter((b) => b.status === "completed").length,
      wishlist: booksData.filter((b) => b.status === "wishlist").length,
    },
  };
}
```

---

## Tasks

- [ ] Criar `lib/actions/journey/goals.ts`
- [ ] Criar `lib/actions/journey/habits.ts`
- [ ] Criar `lib/actions/journey/dashboard.ts`
- [ ] Criar `lib/actions/journey/index.ts` (exports)
- [ ] Implementar todas as funções de Goals
- [ ] Implementar todas as funções de Habits
- [ ] Implementar dashboard aggregation
- [ ] Testar todas as operações CRUD
- [ ] Testar revalidação de cache
- [ ] Criar hooks React para consumir actions

---

## Definition of Done

- [ ] Todas as actions implementadas
- [ ] TypeScript sem erros
- [ ] Testado via UI básica
- [ ] Cache invalidation funcionando
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
lib/
└── actions/
    └── journey/
        ├── goals.ts              [CREATE]
        ├── habits.ts             [CREATE]
        ├── dashboard.ts          [CREATE]
        └── index.ts              [CREATE]

hooks/
└── use-journey.ts                [CREATE] (optional React Query hooks)
```

---

## Referências

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [PRD Journey Module](../../01_Journey/PRD-Journey-v5.0.md)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
