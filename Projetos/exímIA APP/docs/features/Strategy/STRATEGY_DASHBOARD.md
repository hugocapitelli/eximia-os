# Strategy Dashboard

## Visão Geral

**Módulo:** Strategy
**Tela:** Dashboard
**Prioridade:** P1
**Status:** Especificação Completa

**Propósito:** Overview estratégico da empresa/projeto — visão consolidada de OKRs, iniciativas, KPIs e roadmap. É o "cockpit" de planejamento estratégico.

---

## Wireframe Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📈 STRATEGY DASHBOARD                             [Q1 2026 ▾] [⚙️]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 HEALTH DO CICLO ATUAL                                         │   │
│  │                                                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │   │
│  │  │ 🎯 OKRs    │  │ 🚀 Inic.   │  │ 📉 KPIs    │  │ ⏱️ Prazo   │ │   │
│  │  │   68%      │  │   4/6      │  │  3 🟢 2 🟡 │  │  45 dias   │ │   │
│  │  │  On Track  │  │ em andamento│  │  1 🔴      │  │  restantes │ │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ 🎯 OKRs DO CICLO              │  │ 🚀 INICIATIVAS PRIORITÁRIAS   │  │
│  ├───────────────────────────────┤  ├───────────────────────────────┤  │
│  │                               │  │                               │  │
│  │ O1: Lançar MVP (75%)         │  │ ┌─────────────────────────┐   │  │
│  │ ━━━━━━━━━━━━━━━●━━━━━         │  │ │ 🔥 Product Launch       │   │  │
│  │ • KR1: 100 users ✅ 100/100  │  │ │    ━━━━━━━━●━━━  65%    │   │  │
│  │ • KR2: NPS > 50  🔵 42/50    │  │ │    Prazo: 15 Mar        │   │  │
│  │ • KR3: Churn < 5% 🟡 7%      │  │ └─────────────────────────┘   │  │
│  │                               │  │                               │  │
│  │ O2: Revenue (45%)            │  │ ┌─────────────────────────┐   │  │
│  │ ━━━━━━━━●━━━━━━━━━━━━━━      │  │ │ 📊 Analytics Setup      │   │  │
│  │ • KR1: R$10K MRR  🔵 4.5K   │  │ │    ━━━━━━━━━━━●━  85%   │   │  │
│  │ • KR2: 50 paying  🔵 22     │  │ │    Prazo: 31 Jan ⚠️     │   │  │
│  │                               │  │ └─────────────────────────┘   │  │
│  │ O3: Team Scale (60%)         │  │                               │  │
│  │ ━━━━━━━━━━━━●━━━━━━━━━       │  │ ┌─────────────────────────┐   │  │
│  │ • KR1: Hire 2 devs  🔵 1/2  │  │ │ 👥 Hiring Pipeline      │   │  │
│  │ • KR2: Onboarding  ✅ Done  │  │ │    ━━━━━━●━━━━━━  50%   │   │  │
│  │                               │  │ │    Prazo: 28 Feb        │   │  │
│  │ [Ver Todos os OKRs →]        │  │ └─────────────────────────┘   │  │
│  │                               │  │                               │  │
│  │                               │  │ [Ver Todas →]                 │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📉 KPIs EM DESTAQUE                                              │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │   │
│  │  │ 💰 MRR     │  │ 👥 Users   │  │ 📈 Growth  │  │ 😊 NPS     │ │   │
│  │  │  R$ 4.5K   │  │    156     │  │   +12%     │  │    42      │ │   │
│  │  │  🟢 ↑ 15%  │  │  🟢 ↑ 8%  │  │  🟢 Target │  │  🟡 Target │ │   │
│  │  │  Meta: 10K │  │  Meta: 200 │  │  Meta: 10% │  │  Meta: 50  │ │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │   │
│  │                                                                  │   │
│  │  [Ver Dashboard de KPIs →]                                       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🗺️ ROADMAP SIMPLIFICADO                         [Ver Completo →] │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Jan         Fev         Mar         Abr         Mai            │   │
│  │   │           │           │           │           │             │   │
│  │   ├──[Analytics Setup]──┤                                       │   │
│  │   │                      │                                       │   │
│  │   ├────────────[Product Launch]──────────┤                       │   │
│  │   │                                       │                      │   │
│  │   │      ├─────[Hiring Pipeline]────────────────┤               │   │
│  │   │      │                                       │               │   │
│  │   │      │           ├───────[Academy v2]────────────┤          │   │
│  │   │      │           │                               │          │   │
│  │   ▼      ▼           ▼                               ▼          │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💡 AI INSIGHTS                                                   │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ⚠️ KR "NPS > 50" está 16% abaixo do target. Considere:        │   │
│  │     • Coletar feedback qualitativo dos detratores               │   │
│  │     • Priorizar bugs críticos reportados                        │   │
│  │                                                                  │   │
│  │  💡 Iniciativa "Hiring Pipeline" pode atrasar. 50% do prazo    │   │
│  │     passou com apenas 50% de progresso.                         │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

```typescript
type CycleType = 'annual' | 'quarterly' | 'monthly';
type HealthStatus = 'on_track' | 'at_risk' | 'behind' | 'completed';

interface StrategyCycle {
  id: string;
  type: CycleType;
  name: string;                      // "Q1 2026"
  startDate: Date;
  endDate: Date;
  daysRemaining: number;

  // OKRs
  objectives: Objective[];
  okrProgress: number;               // 0-100
  okrHealth: HealthStatus;

  // Initiatives
  initiatives: Initiative[];
  initiativesInProgress: number;
  initiativesTotal: number;

  // KPIs
  kpis: KPI[];
  kpisGreen: number;
  kpisYellow: number;
  kpisRed: number;
}

interface Objective {
  id: string;
  title: string;
  description?: string;
  cycleId: string;
  progress: number;
  health: HealthStatus;
  keyResults: KeyResult[];
  linkedInitiatives: string[];
}

interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
}

interface Initiative {
  id: string;
  title: string;
  description?: string;
  cycleId: string;
  priority: 'critical' | 'high' | 'medium' | 'low';

  // Timing
  startDate: Date;
  endDate: Date;
  progress: number;
  health: HealthStatus;

  // Owner
  ownerId?: string;
  ownerName?: string;

  // Cascade
  linkedObjectiveIds: string[];
  linkedGoalIds: string[];           // Goals in Journey

  // Status
  status: 'planning' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
}

interface KPI {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: number;                     // % change
  trendDirection: 'up' | 'down' | 'stable';
  status: 'green' | 'yellow' | 'red';
  threshold: {
    green: number;
    yellow: number;
    red: number;
  };
}

interface StrategyDashboardData {
  currentCycle: StrategyCycle;
  cycleOptions: { id: string; name: string }[];
  topKPIs: KPI[];
  roadmapItems: RoadmapItem[];
  aiInsights: AIInsight[];
}

interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'opportunity';
  title: string;
  description: string;
  relatedEntityId?: string;
  relatedEntityType?: 'okr' | 'initiative' | 'kpi';
  actions?: string[];
}
```

---

## Integração Connection Layer

```
Events Emitidos:
- strategy.dashboard.viewed { cycle_id }
- strategy.insight.clicked { insight_id }
- strategy.okr.clicked { okr_id }
- strategy.initiative.clicked { initiative_id }

Events Consumidos:
- okr.progress.updated → Atualiza dashboard
- initiative.status.changed → Atualiza dashboard
- kpi.value.updated → Atualiza dashboard
```

---

## AI Insights Engine

A IA analisa os dados estratégicos e gera insights:

```typescript
interface InsightRule {
  condition: string;
  insight: string;
  severity: 'info' | 'warning' | 'critical';
  actions?: string[];
}

// Example rules:
const INSIGHT_RULES: InsightRule[] = [
  {
    condition: 'kr.progress < 0.5 && cycle.progress > 0.6',
    insight: 'KR "{kr.title}" está 16% abaixo do esperado para o tempo decorrido',
    severity: 'warning',
    actions: ['Revisar blockers', 'Alocar mais recursos'],
  },
  {
    condition: 'initiative.progress < 0.3 && initiative.daysToDeadline < 14',
    insight: 'Iniciativa "{initiative.title}" pode não ser entregue no prazo',
    severity: 'critical',
    actions: ['Reduzir escopo', 'Estender prazo', 'Adicionar recursos'],
  },
];
```

---

## Estados da UI

### Empty State (Sem ciclo ativo)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           📈                                        │
│                                                                     │
│              Nenhum ciclo estratégico configurado                  │
│                                                                     │
│     Crie seu primeiro ciclo de OKRs para começar                   │
│     a planejar estrategicamente.                                   │
│                                                                     │
│                      [Criar Ciclo Q1 2026]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dados Mock (Referência)

**Localização:** `app/src/data/strategy-dashboard-mock.ts`

```typescript
export const MOCK_STRATEGY_DASHBOARD: StrategyDashboardData = {
  currentCycle: {
    id: 'cycle_q1_2026',
    type: 'quarterly',
    name: 'Q1 2026',
    // ... dados completos
  },
};
```
