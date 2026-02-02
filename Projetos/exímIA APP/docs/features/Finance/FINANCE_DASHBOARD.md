# Finance Dashboard

## Visão Geral

**Módulo:** Finance
**Tela:** Dashboard
**Prioridade:** P1
**Status:** Especificação Completa

**Propósito:** Overview financeiro consolidado — visão geral de receitas, despesas, fluxo de caixa, métricas SaaS e alertas financeiros. É o "cockpit" financeiro da empresa.

---

## Wireframe Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  💰 FINANCE DASHBOARD                           [Jan 2026 ▾] [⚙️]       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 RESUMO DO MÊS                                                 │   │
│  │                                                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │   │
│  │  │ 💵 Receita │  │ 📉 Despesa │  │ 💰 Lucro   │  │ 🏦 Saldo   │ │   │
│  │  │  R$ 45.2K  │  │  R$ 32.1K  │  │  R$ 13.1K  │  │  R$ 78.5K  │ │   │
│  │  │  🟢 ↑ 12%  │  │  🟡 ↑ 8%   │  │  🟢 ↑ 23%  │  │  🟢 Healthy │ │   │
│  │  │  vs mês ant│  │  vs mês ant│  │  Margem 29%│  │  3.2mo run │ │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ 📈 FLUXO DE CAIXA             │  │ 🥧 DESPESAS POR CATEGORIA     │  │
│  ├───────────────────────────────┤  ├───────────────────────────────┤  │
│  │                               │  │                               │  │
│  │     Receita vs Despesa        │  │      ┌─────────────┐          │  │
│  │                               │  │     /             \         │  │
│  │  50K ┤     ╭──╮               │  │    │   Pessoal    │ 45%     │  │
│  │      │    ╱    ╲   ╭──        │  │    │    45%       │          │  │
│  │  40K ┤   ╱      ╲ ╱           │  │     \   ████████ /          │  │
│  │      │  ╱        ╳            │  │      └─────────────┘          │  │
│  │  30K ┤ ╱        ╱ ╲           │  │                               │  │
│  │      │╱        ╱   ╲──        │  │  ■ Pessoal      45%  R$ 14.4K │  │
│  │  20K ┤────────╱               │  │  ■ Infra        25%  R$ 8.0K  │  │
│  │      │                        │  │  ■ Marketing    18%  R$ 5.8K  │  │
│  │      └─────────────────────   │  │  ■ Operacional  12%  R$ 3.9K  │  │
│  │       Out Nov Dez Jan         │  │                               │  │
│  │                               │  │                               │  │
│  │  ── Receita  ─ ─ Despesa      │  │  [Ver Detalhes →]             │  │
│  │                               │  │                               │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 MÉTRICAS SAAS                                                 │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │ MRR      │ │ ARR      │ │ Churn    │ │ LTV      │ │ CAC    │ │   │
│  │  │ R$ 4.5K  │ │ R$ 54K   │ │ 2.8%     │ │ R$ 890   │ │ R$ 120 │ │   │
│  │  │ 🟢 ↑ 15% │ │ 🟢 ↑ 15% │ │ 🟢 < 5%  │ │ LTV/CAC  │ │ 🟢     │ │   │
│  │  │ Meta: 10K│ │ Meta:120K│ │ Meta: <5%│ │  7.4x    │ │        │ │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │   │
│  │                                                                  │   │
│  │  [Ver Dashboard SaaS Completo →]                                 │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ 📋 CONTAS A RECEBER           │  │ 📋 CONTAS A PAGAR             │  │
│  ├───────────────────────────────┤  ├───────────────────────────────┤  │
│  │                               │  │                               │  │
│  │  Total: R$ 12.500             │  │  Total: R$ 8.200              │  │
│  │                               │  │                               │  │
│  │  🟢 Em dia      R$ 8.500  68% │  │  🟢 Em dia      R$ 5.200  63% │  │
│  │  🟡 Vence 7d    R$ 2.500  20% │  │  🟡 Vence 7d    R$ 2.000  24% │  │
│  │  🔴 Atrasado    R$ 1.500  12% │  │  🔴 Atrasado    R$ 1.000  13% │  │
│  │                               │  │                               │  │
│  │  Próximos vencimentos:        │  │  Próximos vencimentos:        │  │
│  │  • Cliente ABC   R$ 1.2K  05/02│  │  • AWS          R$ 450   03/02│  │
│  │  • Cliente XYZ   R$ 800   07/02│  │  • Salários     R$ 8K    05/02│  │
│  │  • Cliente DEF   R$ 500   10/02│  │  • Google       R$ 200   10/02│  │
│  │                               │  │                               │  │
│  │  [Ver Todas →]                │  │  [Ver Todas →]                │  │
│  │                               │  │                               │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚠️ ALERTAS FINANCEIROS                                          │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  🔴 3 faturas vencidas há mais de 15 dias (total: R$ 1.500)     │  │
│  │     [Enviar Cobranças]                                          │  │
│  │                                                                  │   │
│  │  🟡 Despesas com Marketing 15% acima do orçamento               │  │
│  │     [Ver Detalhes]                                              │  │
│  │                                                                  │   │
│  │  💡 Runway atual: 3.2 meses. Considere reduzir despesas ou      │  │
│  │     acelerar vendas para aumentar para 6+ meses.                │  │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

```typescript
interface FinanceSummary {
  revenue: number;
  revenueChange: number;          // % vs período anterior
  expenses: number;
  expenseChange: number;
  profit: number;
  profitMargin: number;
  balance: number;
  runwayMonths: number;
}

interface CashFlowData {
  period: string;
  revenue: number;
  expenses: number;
  netCashFlow: number;
}

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  budget?: number;
  budgetUsed?: number;
}

interface SaaSMetrics {
  mrr: number;
  mrrChange: number;
  mrrTarget: number;
  arr: number;
  churnRate: number;
  churnTarget: number;
  ltv: number;
  cac: number;
  ltvCacRatio: number;

  // Additional metrics
  arpu?: number;                  // Average Revenue Per User
  nrr?: number;                   // Net Revenue Retention
  grossMargin?: number;
}

interface AccountsReceivable {
  total: number;
  onTime: number;
  dueSoon: number;               // Vence em 7 dias
  overdue: number;
  items: ReceivableItem[];
}

interface ReceivableItem {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: Date;
  status: 'on_time' | 'due_soon' | 'overdue';
  daysOverdue?: number;
  invoiceNumber?: string;
}

interface AccountsPayable {
  total: number;
  onTime: number;
  dueSoon: number;
  overdue: number;
  items: PayableItem[];
}

interface PayableItem {
  id: string;
  vendorName: string;
  category: string;
  amount: number;
  dueDate: Date;
  status: 'on_time' | 'due_soon' | 'overdue';
  recurring: boolean;
}

interface FinanceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  relatedAmount?: number;
  action?: {
    label: string;
    href: string;
  };
  createdAt: Date;
}

interface FinanceDashboardData {
  period: {
    month: number;
    year: number;
    label: string;
  };
  summary: FinanceSummary;
  cashFlow: CashFlowData[];
  expensesByCategory: ExpenseCategory[];
  saasMetrics: SaaSMetrics;
  receivables: AccountsReceivable;
  payables: AccountsPayable;
  alerts: FinanceAlert[];
}
```

---

## Componentes Principais

### 1. Summary Cards

```
┌────────────────────┐
│ 💵 Receita         │
│                    │
│  R$ 45.200         │  ← Valor principal (text-3xl font-bold)
│                    │
│  🟢 ↑ 12%          │  ← Indicador de tendência
│  vs mês anterior   │  ← Contexto
│                    │
└────────────────────┘
```

### 2. Cash Flow Chart

- Line chart com duas séries (Receita e Despesa)
- Área preenchida para visualizar gap
- Tooltip com valores detalhados
- Período selecionável (3m, 6m, 12m)

### 3. Expense Pie Chart

- Donut chart com categorias
- Hover mostra valor e %
- Click filtra para categoria
- Legenda com valores absolutos

---

## Período Selector

```
┌─────────────────────────────────────────────────────────────────────┐
│  [< Anterior]  [Janeiro 2026 ▾]  [Próximo >]                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📅 Comparar com:                                                   │
│  [Mês Anterior ✓] [Mesmo Mês Ano Anterior] [Média 3 Meses]         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Integração Connection Layer

```
Events Emitidos:
- finance.dashboard.viewed { period }
- finance.alert.clicked { alert_id }
- finance.metric.clicked { metric_type }
- finance.period.changed { old_period, new_period }

Events Consumidos:
- finance.transaction.created → Recalcula totais
- finance.transaction.updated → Recalcula totais
- sales.deal.won → Atualiza receita prevista
- sales.invoice.paid → Atualiza contas a receber
```

---

## Cálculos Automáticos

```typescript
// Runway calculation
const calculateRunway = (balance: number, avgMonthlyBurn: number): number => {
  if (avgMonthlyBurn <= 0) return Infinity;
  return balance / avgMonthlyBurn;
};

// Profit margin
const calculateProfitMargin = (revenue: number, expenses: number): number => {
  if (revenue === 0) return 0;
  return ((revenue - expenses) / revenue) * 100;
};

// Health status
const getFinancialHealth = (runway: number): HealthStatus => {
  if (runway >= 12) return 'excellent';
  if (runway >= 6) return 'healthy';
  if (runway >= 3) return 'caution';
  return 'critical';
};
```

---

## Estados da UI

### Empty State
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           💰                                        │
│                                                                     │
│              Nenhum dado financeiro registrado                     │
│                                                                     │
│     Comece registrando suas primeiras receitas e despesas          │
│     para visualizar seu panorama financeiro.                       │
│                                                                     │
│              [+ Adicionar Receita]  [+ Adicionar Despesa]          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dados Mock (Referência)

**Localização:** `app/src/data/finance-dashboard-mock.ts`

```typescript
export const MOCK_FINANCE_DASHBOARD: FinanceDashboardData = {
  period: {
    month: 1,
    year: 2026,
    label: 'Janeiro 2026',
  },
  summary: {
    revenue: 45200,
    revenueChange: 12,
    expenses: 32100,
    expenseChange: 8,
    profit: 13100,
    profitMargin: 29,
    balance: 78500,
    runwayMonths: 3.2,
  },
  // ... dados completos
};
```
