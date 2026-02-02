# Finance Métricas SaaS

## Visão Geral

**Módulo:** Finance
**Tela:** Métricas SaaS
**Prioridade:** P1
**Status:** Especificação Completa

**Propósito:** Dashboard completo de métricas SaaS — MRR, ARR, Churn, LTV, CAC, NRR, e outras métricas essenciais para empresas de software.

---

## Wireframe Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📊 MÉTRICAS SAAS                          [Jan 2026 ▾] [Export] [⚙️]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💰 RECEITA RECORRENTE                                            │   │
│  │                                                                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │ MRR      │ │ ARR      │ │ Net New  │ │ Expansion│ │ Churn  │ │   │
│  │  │ R$ 4.5K  │ │ R$ 54K   │ │ +R$ 580  │ │ +R$ 120  │ │-R$ 140 │ │   │
│  │  │ 🟢 ↑ 15% │ │ 🟢 ↑ 15% │ │ 5 novos  │ │ 3 upg    │ │ 1 canc │ │   │
│  │  │Meta: 10K │ │Meta: 120K│ │          │ │          │ │ 2.8%   │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📈 EVOLUÇÃO DO MRR                                               │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │   5K ┤                                               ╭──────    │   │
│  │      │                                          ╭────╯          │   │
│  │   4K ┤                                     ╭────╯               │   │
│  │      │                                ╭────╯                    │   │
│  │   3K ┤                           ╭────╯                         │   │
│  │      │                      ╭────╯                              │   │
│  │   2K ┤                 ╭────╯                                   │   │
│  │      │            ╭────╯                                        │   │
│  │   1K ┤       ╭────╯                                             │   │
│  │      │  ╭────╯                                                  │   │
│  │      └──────────────────────────────────────────────────────    │   │
│  │        Jun  Jul  Ago  Set  Out  Nov  Dez  Jan                   │   │
│  │                                                                  │   │
│  │  Breakdown:                                                      │   │
│  │  ■ New MRR   ■ Expansion   ■ Contraction   ■ Churned            │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ 👥 UNIT ECONOMICS             │  │ 🔄 RETENÇÃO                   │  │
│  ├───────────────────────────────┤  ├───────────────────────────────┤  │
│  │                               │  │                               │  │
│  │  LTV (Lifetime Value)         │  │  NRR (Net Revenue Retention)  │  │
│  │  ┌────────────────────────┐   │  │  ┌────────────────────────┐   │  │
│  │  │      R$ 890            │   │  │  │       105%             │   │  │
│  │  │   🟢 Saudável          │   │  │  │    🟢 Excelente        │   │  │
│  │  │   Meta: R$ 1.000       │   │  │  │    Meta: > 100%        │   │  │
│  │  └────────────────────────┘   │  │  └────────────────────────┘   │  │
│  │                               │  │                               │  │
│  │  CAC (Customer Acquisition)   │  │  GRR (Gross Revenue Retention)│  │
│  │  ┌────────────────────────┐   │  │  ┌────────────────────────┐   │  │
│  │  │      R$ 120            │   │  │  │       97%              │   │  │
│  │  │   🟢 Eficiente         │   │  │  │    🟢 Muito bom        │   │  │
│  │  │   Meta: < R$ 150       │   │  │  │    Meta: > 90%         │   │  │
│  │  └────────────────────────┘   │  │  └────────────────────────┘   │  │
│  │                               │  │                               │  │
│  │  LTV : CAC Ratio              │  │  Logo Retention               │  │
│  │  ┌────────────────────────┐   │  │  ┌────────────────────────┐   │  │
│  │  │      7.4x              │   │  │  │       94%              │   │  │
│  │  │   🟢 Excelente         │   │  │  │    🟢 Saudável         │   │  │
│  │  │   Benchmark: > 3x      │   │  │  │    Meta: > 90%         │   │  │
│  │  └────────────────────────┘   │  │  └────────────────────────┘   │  │
│  │                               │  │                               │  │
│  │  Payback Period               │  │  Churn Rate                   │  │
│  │  ┌────────────────────────┐   │  │  ┌────────────────────────┐   │  │
│  │  │      3.2 meses         │   │  │  │       2.8%             │   │  │
│  │  │   🟢 Rápido            │   │  │  │    🟢 Baixo            │   │  │
│  │  │   Meta: < 12 meses     │   │  │  │    Meta: < 5%          │   │  │
│  │  └────────────────────────┘   │  │  └────────────────────────┘   │  │
│  │                               │  │                               │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📦 MRR POR PLANO                                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐ │   │
│  │  │ Plano         │ Clientes │ MRR       │ ARPU    │ % Total   │ │   │
│  │  ├────────────────────────────────────────────────────────────┤ │   │
│  │  │ 🟣 Enterprise │    3     │ R$ 2.997  │ R$ 999  │ 67%       │ │   │
│  │  │ 🔵 Pro        │   12     │ R$ 1.194  │ R$ 99.5 │ 27%       │ │   │
│  │  │ 🟢 Starter    │    8     │ R$ 312    │ R$ 39   │ 6%        │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │  Recomendação: Foco em upsell de Pro → Enterprise               │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 COHORT ANALYSIS                                               │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Cohort    │ M0    │ M1    │ M2    │ M3    │ M4    │ M5    │ M6 │   │
│  │  ──────────┼───────┼───────┼───────┼───────┼───────┼───────┼────│   │
│  │  Jul 2025  │ 100%  │ 95%   │ 92%   │ 90%   │ 88%   │ 87%   │ 85%│   │
│  │  Ago 2025  │ 100%  │ 93%   │ 90%   │ 88%   │ 86%   │ 85%   │    │   │
│  │  Set 2025  │ 100%  │ 94%   │ 91%   │ 89%   │ 87%   │       │    │   │
│  │  Out 2025  │ 100%  │ 92%   │ 90%   │ 88%   │       │       │    │   │
│  │  Nov 2025  │ 100%  │ 95%   │ 93%   │       │       │       │    │   │
│  │  Dez 2025  │ 100%  │ 94%   │       │       │       │       │    │   │
│  │  Jan 2026  │ 100%  │       │       │       │       │       │    │   │
│  │                                                                  │   │
│  │  Insight: Melhoria na retenção M1 a partir de Out 2025          │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

```typescript
interface SaaSMetricsDashboard {
  period: {
    month: number;
    year: number;
    label: string;
  };
  revenue: RevenueMetrics;
  unitEconomics: UnitEconomicsMetrics;
  retention: RetentionMetrics;
  mrrByPlan: PlanMetrics[];
  cohortAnalysis: CohortData;
  mrrHistory: MRRHistoryEntry[];
}

interface RevenueMetrics {
  mrr: MetricValue;
  arr: MetricValue;
  netNewMRR: MetricValue;
  expansionMRR: MetricValue;
  contractionMRR: MetricValue;
  churnedMRR: MetricValue;

  newCustomers: number;
  upgrades: number;
  downgrades: number;
  churned: number;
}

interface MetricValue {
  value: number;
  change: number;                  // % vs período anterior
  changeAbsolute: number;
  target?: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface UnitEconomicsMetrics {
  ltv: MetricValue;
  cac: MetricValue;
  ltvCacRatio: MetricValue;
  paybackPeriod: MetricValue;      // em meses
  arpu: MetricValue;
  grossMargin: MetricValue;
}

interface RetentionMetrics {
  nrr: MetricValue;                // Net Revenue Retention
  grr: MetricValue;                // Gross Revenue Retention
  logoRetention: MetricValue;
  churnRate: MetricValue;
  monthlyChurnRate: MetricValue;
  annualChurnRate: MetricValue;
}

interface PlanMetrics {
  planId: string;
  planName: string;
  color: string;
  customerCount: number;
  mrr: number;
  arpu: number;
  percentOfTotal: number;
  churnRate: number;
}

interface CohortData {
  cohorts: CohortEntry[];
  insight?: string;
}

interface CohortEntry {
  cohortMonth: Date;
  cohortLabel: string;
  initialCustomers: number;
  retentionByMonth: number[];      // % de retenção para cada mês
}

interface MRRHistoryEntry {
  month: Date;
  monthLabel: string;
  mrr: number;
  newMRR: number;
  expansionMRR: number;
  contractionMRR: number;
  churnedMRR: number;
}

interface MRRMovement {
  type: 'new' | 'expansion' | 'contraction' | 'churn' | 'reactivation';
  customerId: string;
  customerName: string;
  previousMRR: number;
  newMRR: number;
  change: number;
  reason?: string;
  date: Date;
}

interface SaaSBenchmarks {
  ltvCacRatio: { good: number; excellent: number };
  churnRate: { good: number; excellent: number };
  nrr: { good: number; excellent: number };
  paybackPeriod: { good: number; excellent: number };
}
```

---

## Fórmulas de Cálculo

```typescript
// MRR Movements
const calculateNetNewMRR = (movements: MRRMovement[]): number => {
  const newMRR = movements.filter(m => m.type === 'new').reduce((sum, m) => sum + m.change, 0);
  const expansionMRR = movements.filter(m => m.type === 'expansion').reduce((sum, m) => sum + m.change, 0);
  const contractionMRR = movements.filter(m => m.type === 'contraction').reduce((sum, m) => sum + m.change, 0);
  const churnedMRR = movements.filter(m => m.type === 'churn').reduce((sum, m) => sum + m.change, 0);

  return newMRR + expansionMRR - contractionMRR - churnedMRR;
};

// LTV Calculation
const calculateLTV = (arpu: number, churnRate: number, grossMargin: number): number => {
  if (churnRate === 0) return arpu * 60 * grossMargin; // Cap at 5 years
  return (arpu * grossMargin) / churnRate;
};

// CAC Calculation
const calculateCAC = (
  marketingSpend: number,
  salesSpend: number,
  newCustomers: number
): number => {
  if (newCustomers === 0) return 0;
  return (marketingSpend + salesSpend) / newCustomers;
};

// Net Revenue Retention
const calculateNRR = (
  startingMRR: number,
  expansionMRR: number,
  contractionMRR: number,
  churnedMRR: number
): number => {
  if (startingMRR === 0) return 0;
  return ((startingMRR + expansionMRR - contractionMRR - churnedMRR) / startingMRR) * 100;
};

// Gross Revenue Retention
const calculateGRR = (
  startingMRR: number,
  contractionMRR: number,
  churnedMRR: number
): number => {
  if (startingMRR === 0) return 0;
  return ((startingMRR - contractionMRR - churnedMRR) / startingMRR) * 100;
};

// Payback Period
const calculatePaybackPeriod = (cac: number, arpu: number, grossMargin: number): number => {
  if (arpu === 0 || grossMargin === 0) return Infinity;
  return cac / (arpu * grossMargin);
};
```

---

## Benchmarks de Referência

```typescript
const SAAS_BENCHMARKS: SaaSBenchmarks = {
  ltvCacRatio: { good: 3, excellent: 5 },
  churnRate: { good: 5, excellent: 3 },           // % mensal
  nrr: { good: 100, excellent: 120 },             // %
  paybackPeriod: { good: 12, excellent: 6 },      // meses
};

const getMetricStatus = (
  metricName: keyof SaaSBenchmarks,
  value: number,
  isLowerBetter: boolean = false
): 'excellent' | 'good' | 'warning' | 'critical' => {
  const benchmark = SAAS_BENCHMARKS[metricName];

  if (isLowerBetter) {
    if (value <= benchmark.excellent) return 'excellent';
    if (value <= benchmark.good) return 'good';
    if (value <= benchmark.good * 1.5) return 'warning';
    return 'critical';
  } else {
    if (value >= benchmark.excellent) return 'excellent';
    if (value >= benchmark.good) return 'good';
    if (value >= benchmark.good * 0.7) return 'warning';
    return 'critical';
  }
};
```

---

## Integração Connection Layer

```
Events Emitidos:
- finance.saas.mrr.updated { mrr, change }
- finance.saas.churn.detected { customer_id, mrr_lost }
- finance.saas.expansion.detected { customer_id, mrr_added }
- finance.saas.metric.alert { metric, value, threshold }

Events Consumidos:
- sales.deal.won → Adiciona como New MRR
- sales.customer.upgraded → Registra Expansion MRR
- sales.customer.downgraded → Registra Contraction MRR
- sales.customer.churned → Registra Churned MRR
```

---

## Estados da UI

### Empty State
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           📊                                        │
│                                                                     │
│              Nenhuma métrica SaaS disponível                       │
│                                                                     │
│     Configure suas receitas recorrentes para começar a             │
│     acompanhar suas métricas SaaS.                                 │
│                                                                     │
│                      [Configurar Receitas]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dados Mock (Referência)

**Localização:** `app/src/data/finance-metricas-saas-mock.ts`

```typescript
export const MOCK_SAAS_METRICS: SaaSMetricsDashboard = {
  period: { month: 1, year: 2026, label: 'Janeiro 2026' },
  revenue: {
    mrr: { value: 4500, change: 15, target: 10000, status: 'good' },
    arr: { value: 54000, change: 15, target: 120000, status: 'good' },
    // ... dados completos
  },
};
```
