# Story EXIMIA-039: Journey Server Actions (Goals & Habits)

**Story ID:** EXIMIA-039
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 4
**Pontos:** 8
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-038 (Supabase Client), EXIMIA-011 (Journey Schema)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ter APIs funcionais para Goals e Habits,
**Para que** eu possa criar, editar e acompanhar minhas metas e hábitos.

---

## Contexto

Esta story implementa todas as Server Actions para o módulo Journey (Goals e Habits).
Os Server Actions seguem o padrão definido na arquitetura de backend.

---

## Acceptance Criteria

### Goals API
- [ ] `getGoals(filters?)` - Listar goals do usuário com filtros
- [ ] `getGoal(id)` - Obter goal específico com key results
- [ ] `createGoal(data)` - Criar novo goal
- [ ] `updateGoal(id, data)` - Atualizar goal
- [ ] `deleteGoal(id)` - Deletar goal
- [ ] `updateGoalProgress(id)` - Recalcular progresso baseado em KRs

### Key Results API
- [ ] `getKeyResults(goalId)` - Listar KRs de um goal
- [ ] `createKeyResult(goalId, data)` - Criar KR
- [ ] `updateKeyResult(id, data)` - Atualizar KR (inclui current_value)
- [ ] `deleteKeyResult(id)` - Deletar KR

### Habits API
- [ ] `getHabits(filters?)` - Listar hábitos ativos
- [ ] `getHabit(id)` - Obter hábito com histórico recente
- [ ] `createHabit(data)` - Criar hábito
- [ ] `updateHabit(id, data)` - Atualizar hábito
- [ ] `deleteHabit(id)` - Arquivar hábito (soft delete)
- [ ] `logHabit(habitId, date?, notes?)` - Registrar conclusão
- [ ] `getHabitLogs(habitId, dateRange)` - Histórico de logs

### Dashboard API
- [ ] `getJourneyDashboard()` - Stats consolidados

### Validação
- [ ] Zod schemas para todos os inputs
- [ ] Error handling consistente
- [ ] Revalidation paths corretos

---

## Technical Details

### Directory Structure

```
src/lib/actions/journey/
├── goals.ts           # Goals CRUD
├── key-results.ts     # Key Results CRUD
├── habits.ts          # Habits CRUD
├── habit-logs.ts      # Habit logging
├── dashboard.ts       # Dashboard stats
└── index.ts           # Re-exports
```

### Goals Server Actions

```typescript
// src/lib/actions/journey/goals.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =============================================================================
// SCHEMAS
// =============================================================================

const CreateGoalSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  why: z.string().max(1000).optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  timeframe: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const UpdateGoalSchema = CreateGoalSchema.partial().extend({
  status: z.enum(["draft", "active", "paused", "completed", "cancelled"]).optional(),
});

export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;

// =============================================================================
// READ
// =============================================================================

export async function getGoals(filters?: {
  status?: string;
  timeframe?: string;
  priority?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let query = supabase
    .from("goals")
    .select(`
      *,
      key_results (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.timeframe) {
    query = query.eq("timeframe", filters.timeframe);
  }
  if (filters?.priority) {
    query = query.eq("priority", filters.priority);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch goals: ${error.message}`);
  }

  return data || [];
}

export async function getGoal(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("goals")
    .select(`
      *,
      key_results (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Goal not found: ${error.message}`);
  }

  return data;
}

// =============================================================================
// CREATE
// =============================================================================

export async function createGoal(input: CreateGoalInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validated = CreateGoalSchema.parse(input);

  const { data, error } = await supabase
    .from("goals")
    .insert({
      ...validated,
      user_id: user.id,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create goal: ${error.message}`);
  }

  revalidatePath("/journey/goals");
  return data;
}

// =============================================================================
// UPDATE
// =============================================================================

export async function updateGoal(id: string, input: UpdateGoalInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validated = UpdateGoalSchema.parse(input);

  const { data, error } = await supabase
    .from("goals")
    .update(validated)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update goal: ${error.message}`);
  }

  revalidatePath("/journey/goals");
  revalidatePath(`/journey/goals/${id}`);
  return data;
}

// =============================================================================
// DELETE
// =============================================================================

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete goal: ${error.message}`);
  }

  revalidatePath("/journey/goals");
}
```

### Habits Server Actions

```typescript
// src/lib/actions/journey/habits.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =============================================================================
// SCHEMAS
// =============================================================================

const CreateHabitSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  frequency: z.enum(["daily", "weekly", "custom"]).default("daily"),
  frequency_config: z.record(z.any()).optional(),
  target_per_period: z.number().int().positive().default(1),
  duration_minutes: z.number().int().positive().optional(),
  preferred_time: z.enum(["morning", "afternoon", "evening", "anytime"]).optional(),
  reminder_time: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;

// =============================================================================
// READ
// =============================================================================

export async function getHabits(filters?: { active?: boolean }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let query = supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filters?.active !== undefined) {
    query = query.eq("active", filters.active);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch habits: ${error.message}`);
  }

  return data || [];
}

export async function getHabitWithLogs(id: string, days: number = 30) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (habitError) {
    throw new Error(`Habit not found: ${habitError.message}`);
  }

  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("habit_id", id)
    .gte("log_date", startDate.toISOString().split("T")[0])
    .order("log_date", { ascending: false });

  if (logsError) {
    throw new Error(`Failed to fetch logs: ${logsError.message}`);
  }

  return { ...habit, logs: logs || [] };
}

// =============================================================================
// CREATE
// =============================================================================

export async function createHabit(input: CreateHabitInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const validated = CreateHabitSchema.parse(input);

  const { data, error } = await supabase
    .from("habits")
    .insert({
      ...validated,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create habit: ${error.message}`);
  }

  revalidatePath("/journey/habits");
  return data;
}

// =============================================================================
// LOG HABIT
// =============================================================================

export async function logHabit(
  habitId: string,
  date?: string,
  options?: { notes?: string; duration_minutes?: number; mood?: number }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const logDate = date || new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        log_date: logDate,
        completed: true,
        completed_at: new Date().toISOString(),
        notes: options?.notes,
        duration_minutes: options?.duration_minutes,
        mood: options?.mood,
      },
      {
        onConflict: "habit_id,log_date",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to log habit: ${error.message}`);
  }

  // Trigger updates user_streaks via database trigger
  revalidatePath("/journey/habits");
  revalidatePath("/dashboard");
  return data;
}

// =============================================================================
// ARCHIVE (soft delete)
// =============================================================================

export async function archiveHabit(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("habits")
    .update({
      active: false,
      archived_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to archive habit: ${error.message}`);
  }

  revalidatePath("/journey/habits");
}
```

---

## Tasks

- [ ] Criar `src/lib/actions/journey/goals.ts`
- [ ] Criar `src/lib/actions/journey/key-results.ts`
- [ ] Criar `src/lib/actions/journey/habits.ts`
- [ ] Criar `src/lib/actions/journey/habit-logs.ts`
- [ ] Criar `src/lib/actions/journey/dashboard.ts`
- [ ] Criar `src/lib/actions/journey/index.ts`
- [ ] Implementar Zod schemas
- [ ] Testar CRUD de goals
- [ ] Testar CRUD de habits
- [ ] Testar log de habits
- [ ] Verificar revalidation paths

---

## Definition of Done

- [ ] Todos os endpoints funcionando
- [ ] Zod validation em todos os inputs
- [ ] Error handling consistente
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] Testes manuais de CRUD passando
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/lib/actions/journey/
├── goals.ts           [CREATE]
├── key-results.ts     [CREATE]
├── habits.ts          [CREATE]
├── habit-logs.ts      [CREATE]
├── dashboard.ts       [CREATE]
└── index.ts           [CREATE]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No SQL injection vulnerabilities
- [ ] Proper authentication checks
- [ ] Zod validation on all inputs
- [ ] RLS backup with user_id checks

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
