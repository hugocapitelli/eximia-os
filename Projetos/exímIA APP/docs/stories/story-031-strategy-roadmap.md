# Story EXIMIA-031: Strategy Roadmap

**Story ID:** EXIMIA-031
**Epic:** EXIMIA-EPIC-008 (Strategy Module)
**Sprint:** 10
**Pontos:** 13
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-029 (Strategy Initiatives)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** visualizar minhas iniciativas em um roadmap timeline,
**Para que** eu possa ver quando cada iniciativa acontece e suas dependências.

---

## Contexto

Visualização Gantt/Timeline das iniciativas estratégicas com suporte
a diferentes views (Gantt, Timeline, Kanban) e interações de drag & drop.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Strategy/STRATEGY_ROADMAP.md` | Wireframes, views, interações |
| **Mock Data** | `app/src/data/strategy-roadmap-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/strategy.ts` | RoadmapItem, RoadmapView interfaces |

---

## Acceptance Criteria

### Gantt View (Default)
- [ ] Barras horizontais representando iniciativas
- [ ] Timeline no topo (dias/semanas/meses)
- [ ] Today line destacada
- [ ] Progress dentro da barra
- [ ] Cores por status (on_track, at_risk, behind, done)
- [ ] Dependências com linhas de conexão

### Timeline View
- [ ] Visão vertical por data
- [ ] Agrupado por semana/mês
- [ ] Foco em milestones
- [ ] Markers de início/fim

### Kanban View
- [ ] Colunas: Planned, In Progress, Done
- [ ] Cards de iniciativas
- [ ] Drag & drop entre colunas

### Controles
- [ ] Zoom: Day, Week, Month, Quarter
- [ ] Navegação: botões prev/next, go to today
- [ ] Período selecionável
- [ ] Filtros por status, prioridade

### Interações (Gantt)
- [ ] Drag barra para mover datas
- [ ] Drag edges para estender/encurtar
- [ ] Click para abrir detail
- [ ] Double-click para editar inline

### Milestones do Ciclo
- [ ] Timeline de milestones importantes
- [ ] Marcadores de progresso
- [ ] Status de cada milestone

---

## Technical Details

### Server Actions

```typescript
// lib/actions/roadmap.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RoadmapItem {
  id: string;
  type: 'initiative' | 'milestone';
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: string;
  priority: string;
  color?: string;
  dependsOn?: string[];
}

export async function getRoadmapData(cycleId: string, startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get initiatives in range
  const { data: initiatives } = await supabase
    .from("initiatives")
    .select(`
      *,
      dependencies:initiative_dependencies(depends_on_id)
    `)
    .eq("cycle_id", cycleId)
    .or(`start_date.gte.${startDate},end_date.lte.${endDate}`)
    .order("start_date");

  // Get cycle milestones (from initiative milestones that are cycle-level)
  const { data: milestones } = await supabase
    .from("initiative_milestones")
    .select(`
      *,
      initiative:initiatives!inner(cycle_id)
    `)
    .eq("initiative.cycle_id", cycleId)
    .gte("due_date", startDate)
    .lte("due_date", endDate)
    .order("due_date");

  // Get cycle info
  const { data: cycle } = await supabase
    .from("strategy_cycles")
    .select("*")
    .eq("id", cycleId)
    .single();

  const items: RoadmapItem[] = (initiatives || []).map(init => ({
    id: init.id,
    type: 'initiative' as const,
    title: init.title,
    startDate: new Date(init.start_date),
    endDate: new Date(init.end_date),
    progress: init.progress,
    status: init.status,
    priority: init.priority,
    color: init.color,
    dependsOn: init.dependencies?.map((d: any) => d.depends_on_id),
  }));

  return {
    cycle,
    items,
    milestones: milestones || [],
  };
}

export async function updateInitiativeDates(
  initiativeId: string,
  startDate: string,
  endDate: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("initiatives")
    .update({
      start_date: startDate,
      end_date: endDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", initiativeId);

  if (error) throw error;
  revalidatePath("/strategy/roadmap");
}

export async function updateInitiativeStatus(initiativeId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("initiatives")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", initiativeId);

  if (error) throw error;
  revalidatePath("/strategy/roadmap");
}
```

### Gantt Component Structure

```tsx
// components/strategy/roadmap/GanttView.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { RoadmapItem } from "@/lib/actions/roadmap";

interface GanttViewProps {
  items: RoadmapItem[];
  startDate: Date;
  endDate: Date;
  zoom: 'day' | 'week' | 'month' | 'quarter';
  onItemMove?: (id: string, newStart: Date, newEnd: Date) => void;
  onItemClick?: (id: string) => void;
}

export function GanttView({
  items,
  startDate,
  endDate,
  zoom,
  onItemMove,
  onItemClick,
}: GanttViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const getTimelineUnits = useCallback(() => {
    const units: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      units.push(new Date(current));
      switch (zoom) {
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
        case 'quarter':
          current.setMonth(current.getMonth() + 3);
          break;
      }
    }
    return units;
  }, [startDate, endDate, zoom]);

  const getItemPosition = useCallback((item: RoadmapItem) => {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const itemStart = item.startDate.getTime() - startDate.getTime();
    const itemDuration = item.endDate.getTime() - item.startDate.getTime();

    return {
      left: `${(itemStart / totalDuration) * 100}%`,
      width: `${(itemDuration / totalDuration) * 100}%`,
    };
  }, [startDate, endDate]);

  const getTodayPosition = useCallback(() => {
    const today = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const todayOffset = today.getTime() - startDate.getTime();
    return `${(todayOffset / totalDuration) * 100}%`;
  }, [startDate, endDate]);

  const timelineUnits = getTimelineUnits();

  return (
    <div className="relative overflow-x-auto" ref={containerRef}>
      {/* Timeline Header */}
      <div className="flex border-b border-border sticky top-0 bg-background z-10">
        <div className="w-48 shrink-0 p-2 font-medium">Initiative</div>
        <div className="flex-1 flex">
          {timelineUnits.map((unit, idx) => (
            <div
              key={idx}
              className="flex-1 p-2 text-center text-sm text-muted-foreground border-l border-border"
            >
              {formatTimelineUnit(unit, zoom)}
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="relative">
        {/* Today Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
          style={{ left: getTodayPosition() }}
        />

        {items.map((item) => {
          const position = getItemPosition(item);

          return (
            <div
              key={item.id}
              className="flex items-center h-12 border-b border-border"
            >
              {/* Item Label */}
              <div className="w-48 shrink-0 p-2 truncate">{item.title}</div>

              {/* Gantt Bar */}
              <div className="flex-1 relative h-full">
                <div
                  className={`
                    absolute top-2 bottom-2 rounded cursor-pointer
                    transition-all hover:brightness-110
                    ${getStatusColor(item.status)}
                  `}
                  style={{
                    left: position.left,
                    width: position.width,
                  }}
                  onClick={() => onItemClick?.(item.id)}
                >
                  {/* Progress Fill */}
                  <div
                    className="absolute inset-0 bg-white/20 rounded"
                    style={{ width: `${item.progress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-2 text-xs text-white truncate">
                    {item.title} ({item.progress}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTimelineUnit(date: Date, zoom: string): string {
  switch (zoom) {
    case 'day':
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    case 'week':
      return `Sem ${getWeekNumber(date)}`;
    case 'month':
      return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    case 'quarter':
      return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
    default:
      return '';
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-green-600';
    case 'in_progress': return 'bg-blue-500';
    case 'at_risk': return 'bg-amber-500';
    case 'behind': return 'bg-red-500';
    default: return 'bg-gray-400';
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
```

---

## Tasks

- [ ] Implementar server actions para roadmap
- [ ] Criar página /strategy/roadmap
- [ ] Implementar GanttView component
- [ ] Criar TimelineView component
- [ ] Criar KanbanView component
- [ ] Implementar view switcher
- [ ] Adicionar zoom controls
- [ ] Implementar navegação de período
- [ ] Criar today line
- [ ] Implementar dependency lines (Gantt)
- [ ] Adicionar drag & drop (opcional)
- [ ] Criar InitiativeDetailDrawer
- [ ] Milestones timeline
- [ ] Loading states

---

## Definition of Done

- [ ] Gantt view funcionando
- [ ] Timeline view funcionando
- [ ] Kanban view funcionando
- [ ] Zoom e navegação funcionais
- [ ] Click para detalhes
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/strategy/roadmap/
└── page.tsx                            [CREATE]

components/strategy/roadmap/
├── RoadmapContainer.tsx                [CREATE]
├── GanttView.tsx                       [CREATE]
├── TimelineView.tsx                    [CREATE]
├── KanbanView.tsx                      [CREATE]
├── ViewSwitcher.tsx                    [CREATE]
├── ZoomControls.tsx                    [CREATE]
├── PeriodNavigator.tsx                 [CREATE]
├── GanttBar.tsx                        [CREATE]
├── DependencyLine.tsx                  [CREATE]
├── MilestonesTimeline.tsx              [CREATE]
└── index.ts                            [CREATE]

lib/actions/
└── roadmap.ts                          [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"strategy.roadmap.viewed" { cycle_id, view_mode }
"strategy.roadmap.item.moved" { item_id, old_dates, new_dates }
"strategy.roadmap.zoom.changed" { zoom_level }

// Eventos consumidos
"strategy.initiative.created" → Adiciona ao roadmap
"strategy.initiative.updated" → Atualiza posição/status
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
