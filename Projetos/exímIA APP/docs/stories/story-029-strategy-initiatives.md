# Story EXIMIA-029: Strategy Initiatives

**Story ID:** EXIMIA-029
**Epic:** EXIMIA-EPIC-008 (Strategy Module)
**Sprint:** 10
**Pontos:** 8
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-028 (Strategy OKRs)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** gerenciar iniciativas estratégicas vinculadas aos meus OKRs,
**Para que** eu possa planejar e executar projetos que contribuem para meus objetivos.

---

## Contexto

Iniciativas são projetos/ações estratégicas que contribuem para atingir Objectives.
Possuem timeline, milestones e podem gerar automaticamente Goals no Journey.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Strategy/STRATEGY_INICIATIVAS.md` | Wireframes, interfaces |
| **Mock Data** | `app/src/data/strategy-iniciativas-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/strategy.ts` | Initiative, Milestone interfaces |

---

## Acceptance Criteria

### Lista de Iniciativas
- [ ] Cards com título, progresso, health, prazo
- [ ] Filtros por status (planning, in_progress, completed)
- [ ] Filtros por prioridade (critical, high, medium, low)
- [ ] Ordenação por prioridade, prazo, progresso

### Card de Iniciativa
- [ ] Ícone e cor customizáveis
- [ ] Título e descrição curta
- [ ] Progress bar
- [ ] Datas de início e fim
- [ ] Health status (on_track, at_risk, behind)
- [ ] OKRs vinculados (badges)

### Modal Criar/Editar Iniciativa
- [ ] Título e descrição
- [ ] Prioridade (dropdown)
- [ ] Datas de início e fim
- [ ] Cor e ícone
- [ ] Vincular a Objectives (multiselect)
- [ ] Adicionar milestones inline

### Milestones
- [ ] Lista de milestones com checkbox
- [ ] Data de cada milestone
- [ ] Reordenar milestones
- [ ] Progresso calculado por milestones completos

### Detalhe da Iniciativa
- [ ] Header com todas as infos
- [ ] Lista de milestones editável
- [ ] OKRs vinculados com link
- [ ] Goal vinculada no Journey (se existir)
- [ ] Histórico de alterações

### Cascade para Journey
- [ ] Botão "Criar Goal no Journey"
- [ ] Auto-link entre Initiative e Goal

### Dependências
- [ ] Marcar dependência entre iniciativas
- [ ] Visual de dependência no roadmap

---

## Technical Details

### Server Actions

```typescript
// lib/actions/initiatives.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInitiatives(cycleId: string, filters?: {
  status?: string;
  priority?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let query = supabase
    .from("initiatives")
    .select(`
      *,
      milestones:initiative_milestones(*),
      objectives:initiative_objectives(
        objective:objectives(id, title, progress)
      ),
      dependencies:initiative_dependencies(
        depends_on:initiatives!initiative_dependencies_depends_on_id_fkey(id, title)
      )
    `)
    .eq("cycle_id", cycleId)
    .eq("user_id", user.id);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.priority) {
    query = query.eq("priority", filters.priority);
  }

  const { data, error } = await query.order("priority", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createInitiative(data: {
  cycle_id: string;
  title: string;
  description?: string;
  priority: string;
  start_date?: string;
  end_date?: string;
  color?: string;
  icon?: string;
  objective_ids?: string[];
  milestones?: { title: string; due_date?: string }[];
  create_journey_goal?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Create initiative
  const { data: initiative, error } = await supabase
    .from("initiatives")
    .insert({
      cycle_id: data.cycle_id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      start_date: data.start_date,
      end_date: data.end_date,
      color: data.color,
      icon: data.icon,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Link to objectives
  if (data.objective_ids && data.objective_ids.length > 0) {
    const links = data.objective_ids.map(objId => ({
      initiative_id: initiative.id,
      objective_id: objId,
    }));
    await supabase.from("initiative_objectives").insert(links);
  }

  // Create milestones
  if (data.milestones && data.milestones.length > 0) {
    const milestones = data.milestones.map((m, idx) => ({
      initiative_id: initiative.id,
      title: m.title,
      due_date: m.due_date,
      order_index: idx,
    }));
    await supabase.from("initiative_milestones").insert(milestones);
  }

  // Create linked Journey Goal
  if (data.create_journey_goal) {
    const { data: goal } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: data.title,
        description: `Strategic Initiative: ${data.title}`,
        due_date: data.end_date,
        priority: data.priority === 'critical' ? 'high' : data.priority,
        timeframe: 'quarterly',
      })
      .select()
      .single();

    // Link goal to initiative
    await supabase
      .from("initiatives")
      .update({ linked_goal_id: goal?.id })
      .eq("id", initiative.id);
  }

  revalidatePath("/strategy/initiatives");
  return initiative;
}

export async function updateInitiativeProgress(initiativeId: string) {
  const supabase = await createClient();

  // Get milestones
  const { data: milestones } = await supabase
    .from("initiative_milestones")
    .select("completed")
    .eq("initiative_id", initiativeId);

  if (!milestones || milestones.length === 0) return;

  const completed = milestones.filter(m => m.completed).length;
  const progress = Math.round((completed / milestones.length) * 100);

  // Determine health
  const { data: initiative } = await supabase
    .from("initiatives")
    .select("start_date, end_date")
    .eq("id", initiativeId)
    .single();

  let health = 'on_track';
  if (initiative?.end_date) {
    const today = new Date();
    const endDate = new Date(initiative.end_date);
    const startDate = new Date(initiative.start_date || initiative.end_date);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = today.getTime() - startDate.getTime();
    const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);

    if (progress < expectedProgress * 0.7) health = 'behind';
    else if (progress < expectedProgress * 0.9) health = 'at_risk';
  }

  await supabase
    .from("initiatives")
    .update({ progress, health, updated_at: new Date().toISOString() })
    .eq("id", initiativeId);

  revalidatePath("/strategy/initiatives");
}

export async function toggleMilestone(milestoneId: string, completed: boolean) {
  const supabase = await createClient();

  const { data: milestone } = await supabase
    .from("initiative_milestones")
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", milestoneId)
    .select("initiative_id")
    .single();

  if (milestone) {
    await updateInitiativeProgress(milestone.initiative_id);
  }
}

export async function addDependency(initiativeId: string, dependsOnId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("initiative_dependencies")
    .insert({
      initiative_id: initiativeId,
      depends_on_id: dependsOnId,
    });

  if (error) throw error;
  revalidatePath("/strategy/initiatives");
}
```

---

## Tasks

- [ ] Implementar server actions para initiatives
- [ ] Criar página /strategy/initiatives
- [ ] Implementar InitiativeCard component
- [ ] Criar CreateInitiativeModal
- [ ] Implementar milestone management
- [ ] Criar InitiativeDetail page/modal
- [ ] Implementar linking com OKRs
- [ ] Adicionar cascade para Journey Goals
- [ ] Implementar dependências entre iniciativas
- [ ] Filtros e ordenação
- [ ] Loading e empty states

---

## Definition of Done

- [ ] CRUD de initiatives funcionando
- [ ] Milestones com toggle de conclusão
- [ ] Progresso calculando automaticamente
- [ ] Links com OKRs funcionais
- [ ] Cascade para Journey
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/strategy/initiatives/
├── page.tsx                            [CREATE]
└── [id]/
    └── page.tsx                        [CREATE]

components/strategy/
├── InitiativeCard.tsx                  [CREATE]
├── InitiativeList.tsx                  [CREATE]
├── CreateInitiativeModal.tsx           [CREATE]
├── InitiativeDetail.tsx                [CREATE]
├── MilestoneList.tsx                   [CREATE]
├── MilestoneItem.tsx                   [CREATE]
├── DependencySelector.tsx              [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── initiatives.ts                      [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"strategy.initiative.created" { initiative_id, title }
"strategy.initiative.updated" { initiative_id, changes }
"strategy.milestone.completed" { milestone_id, initiative_id }
"strategy.initiative.completed" { initiative_id }

// Eventos consumidos
"journey.goal.completed" → Atualiza initiative vinculada
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
