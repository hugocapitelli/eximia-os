# Story EXIMIA-032: Finance Module (Full)

**Story ID:** EXIMIA-032
**Epic:** EXIMIA-EPIC-009 (Finance Module)
**Sprint:** 11
**Pontos:** 21
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** gerenciar minhas finanças empresariais completas,
**Para que** eu possa controlar receitas, despesas, projeções e métricas SaaS.

---

## Contexto

Módulo financeiro completo com dashboard, receitas, despesas, projeções,
métricas SaaS e relatórios. Esta é uma story épica que engloba múltiplas telas.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Dashboard Spec** | `docs/features/Finance/FINANCE_DASHBOARD.md` | Overview financeiro |
| **Receitas Spec** | `docs/features/Finance/FINANCE_RECEITAS.md` | Gestão de receitas |
| **Despesas Spec** | `docs/features/Finance/FINANCE_DESPESAS.md` | Gestão de despesas |
| **Projeções Spec** | `docs/features/Finance/FINANCE_PROJECOES.md` | Cenários e projeções |
| **SaaS Metrics Spec** | `docs/features/Finance/FINANCE_METRICAS_SAAS.md` | MRR, ARR, Churn, etc. |
| **Relatórios Spec** | `docs/features/Finance/FINANCE_RELATORIOS.md` | DRE, fluxo de caixa |
| **Mock Data** | `app/src/data/finance-*.ts` | Dados de exemplo |

---

## Acceptance Criteria

### Database Schema
- [ ] Tabelas: revenues, expenses, expense_categories, scenarios, kpis_saas
- [ ] Histórico de valores
- [ ] Categorização
- [ ] RLS policies

### Finance Dashboard
- [ ] Cards: Receita, Despesa, Lucro, Saldo
- [ ] Gráfico Fluxo de Caixa (linha)
- [ ] Pie chart de despesas por categoria
- [ ] Métricas SaaS resumidas
- [ ] Contas a receber/pagar
- [ ] Alertas financeiros

### Receitas
- [ ] Lista de receitas com filtros
- [ ] Criar receita (recorrente ou pontual)
- [ ] Categorias de receita
- [ ] Status: pago, pendente, atrasado
- [ ] Vincular a cliente (opcional)

### Despesas
- [ ] Lista de despesas por categoria (accordion)
- [ ] Criar despesa (fixa, variável, pontual)
- [ ] Orçamento por categoria
- [ ] Alertas de orçamento excedido
- [ ] Fornecedores

### Projeções
- [ ] Criar cenários (base, otimista, pessimista)
- [ ] Premissas configuráveis
- [ ] Gráfico de projeção
- [ ] Cálculo de runway
- [ ] Simulador what-if

### Métricas SaaS
- [ ] MRR, ARR, Net New MRR
- [ ] Churn rate
- [ ] LTV, CAC, LTV/CAC ratio
- [ ] NRR, GRR
- [ ] Cohort analysis
- [ ] MRR por plano

### Relatórios
- [ ] DRE (Demonstração de Resultado)
- [ ] Fluxo de Caixa
- [ ] Relatório mensal
- [ ] Export PDF/Excel
- [ ] Agendamento de relatórios

---

## Technical Details

### Database Schema

```sql
-- =============================================
-- FINANCE MODULE SCHEMA
-- =============================================

-- Revenue Categories
CREATE TABLE revenue_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenues
CREATE TABLE revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  category_id UUID REFERENCES revenue_categories(id) ON DELETE SET NULL,

  -- Type
  type TEXT DEFAULT 'one_time' CHECK (type IN ('recurring', 'one_time')),

  -- Dates
  due_date DATE NOT NULL,
  paid_date DATE,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),

  -- Client (optional)
  client_name TEXT,
  client_id UUID,

  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  recurrence_end_date DATE,

  notes TEXT,
  tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense Categories with Budget
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  budget DECIMAL DEFAULT 0,
  budget_period TEXT DEFAULT 'monthly' CHECK (budget_period IN ('monthly', 'quarterly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  description TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,

  -- Type
  type TEXT DEFAULT 'one_time' CHECK (type IN ('fixed', 'variable', 'one_time')),

  -- Dates
  due_date DATE NOT NULL,
  paid_date DATE,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'scheduled')),

  -- Payment
  payment_method TEXT,
  vendor_name TEXT,

  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_frequency TEXT,
  recurrence_day INTEGER,

  -- Attachments
  receipt_url TEXT,

  notes TEXT,
  tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Scenarios (Projections)
CREATE TABLE finance_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT DEFAULT 'custom' CHECK (type IN ('optimistic', 'base', 'pessimistic', 'custom')),

  -- Period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Assumptions
  mrr_growth_rate DECIMAL DEFAULT 0,
  churn_rate DECIMAL DEFAULT 0,
  expense_growth_rate DECIMAL DEFAULT 0,

  -- Initial values
  initial_mrr DECIMAL DEFAULT 0,
  initial_balance DECIMAL DEFAULT 0,
  initial_expenses DECIMAL DEFAULT 0,

  -- Calculated
  projections JSONB,
  summary JSONB,

  is_active BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SaaS Metrics Snapshots
CREATE TABLE saas_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  period_date DATE NOT NULL,

  -- MRR
  mrr DECIMAL DEFAULT 0,
  arr DECIMAL DEFAULT 0,
  new_mrr DECIMAL DEFAULT 0,
  expansion_mrr DECIMAL DEFAULT 0,
  contraction_mrr DECIMAL DEFAULT 0,
  churned_mrr DECIMAL DEFAULT 0,

  -- Customers
  total_customers INTEGER DEFAULT 0,
  new_customers INTEGER DEFAULT 0,
  churned_customers INTEGER DEFAULT 0,

  -- Unit Economics
  ltv DECIMAL,
  cac DECIMAL,
  arpu DECIMAL,

  -- Retention
  nrr DECIMAL,
  grr DECIMAL,
  logo_retention DECIMAL,
  churn_rate DECIMAL,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, period_date)
);

-- Generated Reports
CREATE TABLE finance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  name TEXT NOT NULL,

  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  data JSONB,
  pdf_url TEXT,

  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_revenues_user ON revenues(user_id);
CREATE INDEX idx_revenues_date ON revenues(user_id, due_date);
CREATE INDEX idx_revenues_status ON revenues(user_id, status);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(user_id, due_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_saas_metrics_user ON saas_metrics(user_id, period_date);

-- RLS
ALTER TABLE revenue_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own data" ON revenue_categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own revenues" ON revenues FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own expense cats" ON expense_categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own scenarios" ON finance_scenarios FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own metrics" ON saas_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own reports" ON finance_reports FOR ALL USING (auth.uid() = user_id);
```

---

## Sub-Tasks (Breakdown)

### Sprint 11a: Foundation & Dashboard
- [ ] Criar migration do schema
- [ ] Implementar server actions base
- [ ] Criar Finance Dashboard
- [ ] Cards de resumo
- [ ] Gráficos básicos

### Sprint 11b: Receitas & Despesas
- [ ] Página de Receitas com CRUD
- [ ] Página de Despesas com CRUD
- [ ] Categorias com orçamento
- [ ] Alertas de orçamento

### Sprint 11c: Projeções & Métricas
- [ ] Página de Projeções
- [ ] Cenários e simulador
- [ ] Métricas SaaS dashboard
- [ ] Cohort analysis

### Sprint 11d: Relatórios
- [ ] Geração de DRE
- [ ] Fluxo de Caixa
- [ ] Export PDF
- [ ] Agendamento

---

## Definition of Done

- [ ] Schema criado e testado
- [ ] Dashboard funcionando
- [ ] CRUD de Receitas/Despesas
- [ ] Projeções calculando corretamente
- [ ] Métricas SaaS exibindo
- [ ] Pelo menos 1 relatório gerando PDF
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_finance_module.sql              [CREATE]

app/(dashboard)/finance/
├── page.tsx                            [CREATE] (Dashboard)
├── revenues/
│   └── page.tsx                        [CREATE]
├── expenses/
│   └── page.tsx                        [CREATE]
├── projections/
│   └── page.tsx                        [CREATE]
├── saas-metrics/
│   └── page.tsx                        [CREATE]
└── reports/
    └── page.tsx                        [CREATE]

components/finance/
├── FinanceDashboard.tsx                [CREATE]
├── SummaryCards.tsx                    [CREATE]
├── CashFlowChart.tsx                   [CREATE]
├── ExpensesPieChart.tsx                [CREATE]
├── RevenueList.tsx                     [CREATE]
├── RevenueForm.tsx                     [CREATE]
├── ExpenseList.tsx                     [CREATE]
├── ExpenseForm.tsx                     [CREATE]
├── CategoryAccordion.tsx               [CREATE]
├── BudgetAlert.tsx                     [CREATE]
├── ScenarioCard.tsx                    [CREATE]
├── ProjectionChart.tsx                 [CREATE]
├── WhatIfSimulator.tsx                 [CREATE]
├── SaaSMetricsGrid.tsx                 [CREATE]
├── MRRChart.tsx                        [CREATE]
├── CohortTable.tsx                     [CREATE]
├── ReportCard.tsx                      [CREATE]
├── ReportPreview.tsx                   [CREATE]
└── index.ts                            [CREATE]

lib/actions/
├── revenues.ts                         [CREATE]
├── expenses.ts                         [CREATE]
├── finance-scenarios.ts                [CREATE]
├── saas-metrics.ts                     [CREATE]
└── finance-reports.ts                  [CREATE]

lib/pdf/
└── finance-reports.ts                  [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"finance.revenue.created" { id, amount, type }
"finance.revenue.paid" { id }
"finance.expense.created" { id, amount, category }
"finance.budget.exceeded" { category_id, budget, actual }
"finance.scenario.created" { id, type }
"finance.report.generated" { id, type }

// Eventos consumidos
"sales.deal.won" → Cria receita vinculada
"sales.invoice.paid" → Atualiza status da receita
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
