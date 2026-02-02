# Story EXIMIA-013: Journey Module UI Integration

**Story ID:** EXIMIA-013
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 4
**Pontos:** 13
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-012 (Journey API), EXIMIA-006 (Organisms)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** poder gerenciar minhas metas e hábitos,
**Para que** eu possa acompanhar meu progresso pessoal.

---

## Contexto

Conectar o frontend existente (synthetic-minds) com a API real.
As páginas já existem em mock — precisamos conectar ao Supabase.

---

## Acceptance Criteria

### Journey Dashboard
- [ ] Métricas reais (goals count, habits completion, streak)
- [ ] Lista de habits do dia com toggle de conclusão
- [ ] Cards de goals ativos com progresso real
- [ ] Sugestões da IA (placeholder para Connection Layer)

### Goals Page
- [ ] Lista de goals com filtros (status, priority)
- [ ] Modal de criação de goal
- [ ] Edição inline de KRs
- [ ] Progress bar atualizado em tempo real
- [ ] Ações (edit, delete, change status)

### Habits Page
- [ ] Lista de habits com streaks
- [ ] Calendar heatmap de conclusões
- [ ] Modal de criação de habit
- [ ] Quick complete (click/swipe)
- [ ] Stats: total completions, best streak

### Forms
- [ ] Goal form com validação
- [ ] Habit form com frequency config
- [ ] Feedback de sucesso/erro (toasts)

---

## Technical Details

### Connect Dashboard to API

```tsx
// app/(dashboard)/journey/page.tsx
import { getJourneyDashboard, getTodayHabits, getGoals } from "@/lib/actions/journey";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { ModuleLayout } from "@/components/templates/ModuleLayout";
import { MetricCard, GoalCard, HabitRow } from "@/components/organisms";

export default async function JourneyPage() {
  const [dashboard, todayHabits, activeGoals] = await Promise.all([
    getJourneyDashboard(),
    getTodayHabits(),
    getGoals({ status: "active" }),
  ]);

  return (
    <DashboardLayout>
      <ModuleLayout
        breadcrumbs={[{ label: "Journey" }]}
        title="Journey"
        icon="Compass"
        description="Acompanhe suas metas e hábitos"
      >
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Metas Ativas"
            value={dashboard.goals.active}
            icon="Target"
            progress={{ current: dashboard.goals.completed, total: dashboard.goals.total }}
          />
          <MetricCard
            label="Hábitos Hoje"
            value={`${dashboard.habits.completedToday}/${dashboard.habits.total}`}
            icon="CheckCircle"
          />
          <MetricCard
            label="Streak Atual"
            value={`${dashboard.habits.currentStreak} dias`}
            icon="Flame"
          />
          <MetricCard
            label="Progresso Médio"
            value={`${Math.round(dashboard.goals.averageProgress)}%`}
            icon="TrendingUp"
          />
        </div>

        {/* Today's Habits */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Hábitos de Hoje</h2>
          <div className="space-y-2">
            {todayHabits.map((habit) => (
              <HabitRowClient key={habit.id} habit={habit} />
            ))}
          </div>
        </section>

        {/* Active Goals */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Metas em Foco</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.slice(0, 4).map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      </ModuleLayout>
    </DashboardLayout>
  );
}
```

### Client Components for Interactivity

```tsx
// components/journey/HabitRowClient.tsx
"use client";

import { useState, useTransition } from "react";
import { logHabit } from "@/lib/actions/journey";
import { HabitRow } from "@/components/organisms";
import { useToast } from "@/components/ui/Toast";

interface HabitRowClientProps {
  habit: HabitWithTodayStatus;
}

export function HabitRowClient({ habit }: HabitRowClientProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(habit.completed_today);
  const { toast } = useToast();

  const handleToggle = () => {
    const newValue = !optimisticCompleted;
    setOptimisticCompleted(newValue);

    const today = new Date().toISOString().split("T")[0];

    startTransition(async () => {
      try {
        await logHabit(habit.id, today, { completed: newValue });
        toast({
          variant: "success",
          title: newValue ? "Hábito concluído!" : "Hábito desmarcado",
        });
      } catch (error) {
        setOptimisticCompleted(!newValue); // Rollback
        toast({
          variant: "error",
          title: "Erro ao salvar",
          description: (error as Error).message,
        });
      }
    });
  };

  return (
    <HabitRow
      habit={habit}
      completed={optimisticCompleted}
      onToggle={handleToggle}
      loading={isPending}
    />
  );
}
```

### Goal Creation Modal

```tsx
// components/journey/CreateGoalModal.tsx
"use client";

import { useState, useTransition } from "react";
import { createGoal } from "@/lib/actions/journey";
import { Modal, Button, Input, Textarea, Select, FormField } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

interface CreateGoalModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGoalModal({ open, onClose }: CreateGoalModalProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    why: "",
    priority: "medium" as const,
    timeframe: "quarterly" as const,
    due_date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await createGoal(formData);
        toast({ variant: "success", title: "Meta criada com sucesso!" });
        onClose();
        setFormData({ title: "", description: "", why: "", priority: "medium", timeframe: "quarterly", due_date: "" });
      } catch (error) {
        toast({ variant: "error", title: "Erro ao criar meta", description: (error as Error).message });
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Nova Meta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Título" required>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Lançar MVP do produto"
            required
          />
        </FormField>

        <FormField label="Descrição">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalhes sobre a meta..."
            rows={3}
          />
        </FormField>

        <FormField label="Por quê?" tooltip="Sua motivação para essa meta">
          <Textarea
            value={formData.why}
            onChange={(e) => setFormData({ ...formData, why: e.target.value })}
            placeholder="Por que essa meta é importante?"
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prioridade">
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              options={[
                { value: "high", label: "Alta" },
                { value: "medium", label: "Média" },
                { value: "low", label: "Baixa" },
              ]}
            />
          </FormField>

          <FormField label="Prazo">
            <Select
              value={formData.timeframe}
              onChange={(e) => setFormData({ ...formData, timeframe: e.target.value as any })}
              options={[
                { value: "weekly", label: "Semanal" },
                { value: "monthly", label: "Mensal" },
                { value: "quarterly", label: "Trimestral" },
                { value: "yearly", label: "Anual" },
              ]}
            />
          </FormField>
        </div>

        <FormField label="Data limite">
          <Input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isPending}>
            Criar Meta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

---

## Tasks

- [ ] Conectar JourneyDashboard page com API real
- [ ] Criar HabitRowClient com optimistic updates
- [ ] Criar GoalCardClient com actions
- [ ] Implementar CreateGoalModal
- [ ] Implementar CreateHabitModal
- [ ] Conectar GoalsPage com filtros e CRUD
- [ ] Conectar HabitsPage com calendar e stats
- [ ] Adicionar loading states (skeletons)
- [ ] Adicionar empty states
- [ ] Testar fluxo completo

---

## Definition of Done

- [ ] Dashboard mostrando dados reais
- [ ] CRUD de Goals funcionando
- [ ] CRUD de Habits funcionando
- [ ] Optimistic updates implementados
- [ ] Toasts de feedback
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/journey/
├── page.tsx                      [MODIFY]
├── goals/
│   └── page.tsx                  [MODIFY]
└── habits/
    └── page.tsx                  [MODIFY]

components/journey/
├── HabitRowClient.tsx            [CREATE]
├── GoalCardClient.tsx            [CREATE]
├── CreateGoalModal.tsx           [CREATE]
├── CreateHabitModal.tsx          [CREATE]
└── index.ts                      [CREATE]
```

---

## Referências

- [PRD Journey Module](../../01_Journey/PRD-Journey-v5.0.md)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
