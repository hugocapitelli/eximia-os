# Story EXIMIA-027: Strategy Dashboard

**Story ID:** EXIMIA-027
**Epic:** EXIMIA-EPIC-008 (Strategy Module)
**Sprint:** 9
**Pontos:** 8
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-026 (Strategy Schema)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ter uma visão consolidada da minha estratégia em um dashboard,
**Para que** eu possa acompanhar OKRs, iniciativas, KPIs e roadmap em um só lugar.

---

## Contexto

Dashboard estratégico que serve como "cockpit" de planejamento.
Consolida informações dos sub-módulos de Strategy.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Strategy/STRATEGY_DASHBOARD.md` | Wireframes, interfaces completas |
| **Mock Data** | `app/src/data/strategy-dashboard-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/strategy.ts` | Interfaces TypeScript |

---

## Acceptance Criteria

### Health Cards do Ciclo
- [ ] Card de progresso OKRs com % e health status
- [ ] Card de iniciativas (X/Y em andamento)
- [ ] Card de KPIs (quantos green/yellow/red)
- [ ] Card de prazo (dias restantes no ciclo)

### Seção OKRs
- [ ] Lista resumida de Objectives com progress bar
- [ ] Key Results principais com status
- [ ] Link para página completa de OKRs

### Seção Iniciativas
- [ ] Top 3-4 iniciativas prioritárias
- [ ] Progress bar de cada uma
- [ ] Prazo e health status
- [ ] Link para página de iniciativas

### Seção KPIs
- [ ] Top 4-6 KPIs destacados
- [ ] Valor atual, meta e trend
- [ ] Status visual (verde/amarelo/vermelho)
- [ ] Link para dashboard de KPIs

### Roadmap Simplificado
- [ ] Timeline visual dos próximos 3 meses
- [ ] Barras de iniciativas posicionadas
- [ ] Link para roadmap completo

### AI Insights
- [ ] Insights gerados por IA sobre riscos
- [ ] Sugestões de ação
- [ ] Relacionados a OKRs ou iniciativas específicas

---

## Technical Details

### Server Actions

```typescript
// lib/actions/strategy.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStrategyDashboard(cycleId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get active cycle if not specified
  let activeCycleId = cycleId;
  if (!activeCycleId) {
    const { data: activeCycle } = await supabase
      .from("strategy_cycles")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("start_date", { ascending: false })
      .limit(1)
      .single();

    activeCycleId = activeCycle?.id;
  }

  if (!activeCycleId) {
    return null; // No active cycle
  }

  // Get cycle details
  const { data: cycle } = await supabase
    .from("strategy_cycles")
    .select("*")
    .eq("id", activeCycleId)
    .single();

  // Get objectives with key results
  const { data: objectives } = await supabase
    .from("objectives")
    .select(`
      *,
      key_results(*)
    `)
    .eq("cycle_id", activeCycleId)
    .order("created_at");

  // Get initiatives
  const { data: initiatives } = await supabase
    .from("initiatives")
    .select(`
      *,
      milestones:initiative_milestones(*)
    `)
    .eq("cycle_id", activeCycleId)
    .order("priority", { ascending: true });

  // Get highlighted KPIs
  const { data: kpis } = await supabase
    .from("kpis")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_highlighted", true)
    .order("display_order");

  // Calculate cycle progress
  const today = new Date();
  const startDate = new Date(cycle!.start_date);
  const endDate = new Date(cycle!.end_date);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, totalDays - elapsedDays);
  const cycleProgress = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  // Calculate OKR health
  const okrProgress = objectives?.length
    ? Math.round(objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length)
    : 0;

  // Calculate initiative stats
  const initiativesInProgress = initiatives?.filter(i => i.status === 'in_progress').length || 0;
  const initiativesTotal = initiatives?.length || 0;

  // Calculate KPI stats
  const kpiStats = {
    green: kpis?.filter(k => k.status === 'green').length || 0,
    yellow: kpis?.filter(k => k.status === 'yellow').length || 0,
    red: kpis?.filter(k => k.status === 'red').length || 0,
  };

  return {
    cycle: {
      ...cycle,
      totalDays,
      elapsedDays,
      daysRemaining,
      cycleProgress,
    },
    health: {
      okrProgress,
      okrHealth: getHealthStatus(okrProgress, cycleProgress),
      initiativesInProgress,
      initiativesTotal,
      kpiStats,
    },
    objectives: objectives || [],
    initiatives: initiatives || [],
    kpis: kpis || [],
  };
}

function getHealthStatus(progress: number, expectedProgress: number): string {
  const ratio = progress / Math.max(expectedProgress, 1);
  if (ratio >= 0.9) return 'on_track';
  if (ratio >= 0.7) return 'at_risk';
  return 'behind';
}

export async function getCycleOptions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data } = await supabase
    .from("strategy_cycles")
    .select("id, name, type, status")
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  return data || [];
}
```

### Page Component

```tsx
// app/(dashboard)/strategy/page.tsx
import { getStrategyDashboard, getCycleOptions } from "@/lib/actions/strategy";
import { StrategyDashboard } from "@/components/strategy/StrategyDashboard";

export default async function StrategyPage({
  searchParams,
}: {
  searchParams: { cycle?: string };
}) {
  const [dashboard, cycleOptions] = await Promise.all([
    getStrategyDashboard(searchParams.cycle),
    getCycleOptions(),
  ]);

  if (!dashboard) {
    return <EmptyStrategyState />;
  }

  return (
    <StrategyDashboard
      dashboard={dashboard}
      cycleOptions={cycleOptions}
    />
  );
}
```

---

## Tasks

- [ ] Implementar server actions para dashboard
- [ ] Criar página /strategy
- [ ] Implementar HealthCards component
- [ ] Criar OKRSummary component
- [ ] Criar InitiativesList component
- [ ] Criar KPIHighlights component
- [ ] Criar RoadmapPreview component
- [ ] Implementar cycle selector
- [ ] Empty state para sem ciclo ativo
- [ ] Loading states
- [ ] Link navigation para sub-páginas

---

## Definition of Done

- [ ] Dashboard exibindo dados do ciclo ativo
- [ ] Health cards funcionais
- [ ] Todas as seções com dados reais
- [ ] Navigation para sub-páginas
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/strategy/
├── page.tsx                            [CREATE]
└── layout.tsx                          [CREATE]

components/strategy/
├── StrategyDashboard.tsx               [CREATE]
├── CycleHealthCards.tsx                [CREATE]
├── OKRSummary.tsx                      [CREATE]
├── InitiativesSummary.tsx              [CREATE]
├── KPIHighlights.tsx                   [CREATE]
├── RoadmapPreview.tsx                  [CREATE]
├── AIInsights.tsx                      [CREATE]
├── CycleSelector.tsx                   [CREATE]
└── index.ts                            [CREATE]

lib/actions/
└── strategy.ts                         [CREATE]

app/src/data/
└── strategy-dashboard-mock.ts          [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"strategy.dashboard.viewed" { cycle_id }
"strategy.cycle.changed" { old_cycle_id, new_cycle_id }
"strategy.insight.clicked" { insight_id }

// Eventos consumidos
"strategy.okr.updated" → Refresh dashboard
"strategy.initiative.updated" → Refresh dashboard
"strategy.kpi.updated" → Refresh dashboard
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
