# Story EXIMIA-028: Strategy Cycles & OKRs

**Story ID:** EXIMIA-028
**Epic:** EXIMIA-EPIC-008 (Strategy Module)
**Sprint:** 9
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-026 (Strategy Schema), EXIMIA-027 (Strategy Dashboard)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** gerenciar meus ciclos de OKRs (Objectives & Key Results),
**Para que** eu possa definir e acompanhar meus objetivos estratégicos.

---

## Contexto

Gestão completa de OKRs com ciclos de planejamento (anual, trimestral, mensal),
criação de objectives e key results, tracking de progresso e histórico.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Strategy/STRATEGY_CICLOS.md` | Wireframes, interfaces, fluxos |
| **Mock Data** | `app/src/data/strategy-ciclos-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/strategy.ts` | Cycle, Objective, KeyResult interfaces |

---

## Acceptance Criteria

### Gestão de Ciclos
- [ ] Lista de ciclos (anuais, trimestrais, mensais)
- [ ] Criar novo ciclo com datas e tipo
- [ ] Ativar/desativar ciclo
- [ ] Hierarchy de ciclos (Annual → Quarterly → Monthly)
- [ ] Timeline visual do ciclo com posição atual

### Lista de Objectives
- [ ] Cards de objectives com progress bar
- [ ] Health status visual (on_track, at_risk, behind)
- [ ] Key results inline ou expandidos
- [ ] Filtros por health status
- [ ] Ordenação por progresso

### Modal Criar Objective
- [ ] Título e descrição
- [ ] Owner (opcional)
- [ ] Adicionar Key Results inline
- [ ] KR: título, target, unit, current value
- [ ] KR: flag "menor é melhor" (ex: churn)

### Atualização de Key Results
- [ ] Input direto para atualizar current value
- [ ] Histórico de atualizações
- [ ] Nota opcional ao atualizar
- [ ] Auto-cálculo de progresso

### Cascade para Journey
- [ ] Ao criar Objective, opção de criar Goal vinculada
- [ ] Link visual entre Objective e Goal

---

## Technical Details

### Server Actions

```typescript
// lib/actions/okrs.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCycle(data: {
  name: string;
  type: 'annual' | 'quarterly' | 'monthly';
  start_date: string;
  end_date: string;
  parent_cycle_id?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: cycle, error } = await supabase
    .from("strategy_cycles")
    .insert({
      ...data,
      user_id: user.id,
      status: 'planning',
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/strategy/cycles");
  return cycle;
}

export async function activateCycle(cycleId: string) {
  const supabase = await createClient();

  // Deactivate other cycles of same type
  const { data: cycle } = await supabase
    .from("strategy_cycles")
    .select("type, user_id")
    .eq("id", cycleId)
    .single();

  await supabase
    .from("strategy_cycles")
    .update({ status: 'closed' })
    .eq("user_id", cycle!.user_id)
    .eq("type", cycle!.type)
    .eq("status", "active");

  // Activate this cycle
  const { error } = await supabase
    .from("strategy_cycles")
    .update({ status: 'active' })
    .eq("id", cycleId);

  if (error) throw error;
  revalidatePath("/strategy");
}

export async function createObjective(data: {
  cycle_id: string;
  title: string;
  description?: string;
  owner_name?: string;
  key_results: {
    title: string;
    target_value: number;
    unit: string;
    is_lower_better?: boolean;
  }[];
  create_journey_goal?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Create objective
  const { data: objective, error: objError } = await supabase
    .from("objectives")
    .insert({
      cycle_id: data.cycle_id,
      title: data.title,
      description: data.description,
      owner_name: data.owner_name,
      user_id: user.id,
    })
    .select()
    .single();

  if (objError) throw objError;

  // Create key results
  if (data.key_results.length > 0) {
    const krs = data.key_results.map(kr => ({
      objective_id: objective.id,
      user_id: user.id,
      title: kr.title,
      target_value: kr.target_value,
      unit: kr.unit,
      is_lower_better: kr.is_lower_better || false,
      current_value: 0,
    }));

    const { error: krError } = await supabase
      .from("key_results")
      .insert(krs);

    if (krError) throw krError;
  }

  // Optionally create linked Journey Goal
  if (data.create_journey_goal) {
    await supabase.from("goals").insert({
      user_id: user.id,
      title: data.title,
      description: `Linked to Strategy Objective: ${data.title}`,
      timeframe: 'quarterly',
      priority: 'high',
      linked_objective_id: objective.id,
    });
  }

  revalidatePath("/strategy/cycles");
  return objective;
}

export async function updateKeyResult(
  krId: string,
  newValue: number,
  note?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get KR details
  const { data: kr } = await supabase
    .from("key_results")
    .select("target_value, is_lower_better")
    .eq("id", krId)
    .single();

  // Calculate progress
  let progress: number;
  if (kr!.is_lower_better) {
    progress = Math.min(100, Math.round((kr!.target_value / Math.max(newValue, 0.01)) * 100));
  } else {
    progress = Math.min(100, Math.round((newValue / kr!.target_value) * 100));
  }

  // Determine status
  let status = 'in_progress';
  if (progress >= 100) status = 'completed';
  else if (progress < 50) status = 'at_risk';

  // Update KR
  const { error } = await supabase
    .from("key_results")
    .update({
      current_value: newValue,
      progress,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", krId);

  if (error) throw error;

  // Record history
  await supabase.from("key_result_history").insert({
    key_result_id: krId,
    value: newValue,
    note,
    recorded_by: user.email,
  });

  revalidatePath("/strategy/cycles");
}

export async function getObjectivesWithKRs(cycleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("objectives")
    .select(`
      *,
      key_results(
        *,
        history:key_result_history(*)
      )
    `)
    .eq("cycle_id", cycleId)
    .eq("user_id", user.id)
    .order("created_at");

  if (error) throw error;
  return data;
}
```

---

## Tasks

- [ ] Implementar server actions para cycles e OKRs
- [ ] Criar página /strategy/cycles
- [ ] Implementar CyclesList component
- [ ] Criar CreateCycleModal
- [ ] Criar ObjectiveCard component
- [ ] Criar KeyResultRow component
- [ ] Implementar CreateObjectiveModal
- [ ] Criar UpdateKRInput com histórico
- [ ] Implementar filtros e ordenação
- [ ] Adicionar cascade para Journey Goals
- [ ] Loading states
- [ ] Empty state

---

## Definition of Done

- [ ] CRUD completo de Cycles funcionando
- [ ] CRUD de Objectives e Key Results
- [ ] Atualização de KR com histórico
- [ ] Progresso calculando automaticamente
- [ ] Cascade para Journey opcional
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/strategy/cycles/
├── page.tsx                            [CREATE]
└── [cycleId]/
    └── page.tsx                        [CREATE]

components/strategy/
├── CyclesList.tsx                      [CREATE]
├── CycleCard.tsx                       [CREATE]
├── CreateCycleModal.tsx                [CREATE]
├── ObjectiveCard.tsx                   [CREATE]
├── KeyResultRow.tsx                    [CREATE]
├── CreateObjectiveModal.tsx            [CREATE]
├── UpdateKRModal.tsx                   [CREATE]
├── KRHistoryPopover.tsx                [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── okrs.ts                             [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"strategy.cycle.created" { cycle_id, type }
"strategy.cycle.activated" { cycle_id }
"strategy.objective.created" { objective_id, cycle_id }
"strategy.kr.updated" { kr_id, old_value, new_value }
"strategy.kr.completed" { kr_id }

// Eventos consumidos
"journey.goal.progress.updated" → Sugere atualizar KR vinculado
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
