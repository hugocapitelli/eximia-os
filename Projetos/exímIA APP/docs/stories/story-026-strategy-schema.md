# Story EXIMIA-026: Strategy Module Schema

**Story ID:** EXIMIA-026
**Epic:** EXIMIA-EPIC-008 (Strategy Module)
**Sprint:** 9
**Pontos:** 8
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter o schema de banco de dados do módulo Strategy configurado,
**Para que** as telas de OKRs, iniciativas, KPIs e roadmap possam ser implementadas.

---

## Contexto

Fundação de dados para todo o módulo Strategy. Inclui ciclos de planejamento,
objectives, key results, iniciativas, KPIs e seus relacionamentos.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec Dashboard** | `docs/features/Strategy/STRATEGY_DASHBOARD.md` | Interfaces principais |
| **Feature Spec Ciclos** | `docs/features/Strategy/STRATEGY_CICLOS.md` | OKR interfaces |
| **Feature Spec Iniciativas** | `docs/features/Strategy/STRATEGY_INICIATIVAS.md` | Initiative interfaces |
| **Feature Spec KPIs** | `docs/features/Strategy/STRATEGY_KPIS.md` | KPI interfaces |
| **Feature Spec Roadmap** | `docs/features/Strategy/STRATEGY_ROADMAP.md` | Roadmap interfaces |

---

## Acceptance Criteria

### Tabelas Principais
- [ ] strategy_cycles (ciclos de planejamento)
- [ ] objectives (OKRs - Objectives)
- [ ] key_results (OKRs - Key Results)
- [ ] initiatives (iniciativas estratégicas)
- [ ] initiative_milestones (marcos das iniciativas)
- [ ] kpis (indicadores chave)
- [ ] kpi_values (histórico de valores dos KPIs)

### Relacionamentos
- [ ] Cycles → Objectives (1:N)
- [ ] Objectives → Key Results (1:N)
- [ ] Objectives → Initiatives (M:N)
- [ ] Initiatives → Milestones (1:N)
- [ ] Initiatives → Journey Goals (cascade)
- [ ] KPIs → KPI Values (1:N)

### Row Level Security
- [ ] Políticas RLS para todas as tabelas
- [ ] Usuários veem apenas seus próprios dados

### Indexes
- [ ] Indexes para queries frequentes
- [ ] Indexes para filtros por status e datas

---

## Technical Details

### Migration SQL

```sql
-- =============================================
-- STRATEGY MODULE SCHEMA
-- =============================================

-- Strategy Cycles (Annual, Quarterly, Monthly)
CREATE TABLE strategy_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('annual', 'quarterly', 'monthly')),

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'review', 'closed')),

  -- Parent cycle (for hierarchy: Annual → Quarterly → Monthly)
  parent_cycle_id UUID REFERENCES strategy_cycles(id) ON DELETE SET NULL,

  description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objectives (O in OKR)
CREATE TABLE objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES strategy_cycles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  owner_name TEXT,

  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  health TEXT DEFAULT 'on_track' CHECK (health IN ('on_track', 'at_risk', 'behind', 'completed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key Results (KR in OKR)
CREATE TABLE key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Metric tracking
  target_value DECIMAL NOT NULL,
  current_value DECIMAL DEFAULT 0,
  unit TEXT NOT NULL, -- "users", "percent", "BRL", etc.

  -- For metrics where lower is better (e.g., churn rate)
  is_lower_better BOOLEAN DEFAULT false,

  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'at_risk')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key Result History (for tracking changes over time)
CREATE TABLE key_result_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_result_id UUID NOT NULL REFERENCES key_results(id) ON DELETE CASCADE,
  value DECIMAL NOT NULL,
  note TEXT,
  recorded_by TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiatives (Strategic projects)
CREATE TABLE initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES strategy_cycles(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'paused', 'cancelled')),

  -- Timeline
  start_date DATE,
  end_date DATE,

  -- Progress
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  health TEXT DEFAULT 'on_track' CHECK (health IN ('on_track', 'at_risk', 'behind', 'completed')),

  -- Owner
  owner_name TEXT,

  -- Visual
  color TEXT,
  icon TEXT,

  -- Link to Journey Goal (cascade)
  linked_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiative-Objective linking (M:N)
CREATE TABLE initiative_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  objective_id UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
  UNIQUE(initiative_id, objective_id)
);

-- Initiative Milestones
CREATE TABLE initiative_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,

  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initiative Dependencies
CREATE TABLE initiative_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  depends_on_id UUID NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE,
  UNIQUE(initiative_id, depends_on_id),
  CHECK (initiative_id != depends_on_id)
);

-- KPIs (Key Performance Indicators)
CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- "Revenue", "Growth", "Customer", etc.

  -- Current value and target
  current_value DECIMAL,
  target_value DECIMAL,
  unit TEXT NOT NULL,

  -- Thresholds for status
  threshold_green DECIMAL,
  threshold_yellow DECIMAL,
  threshold_red DECIMAL,

  is_lower_better BOOLEAN DEFAULT false,

  -- Trend
  trend_value DECIMAL, -- % change
  trend_direction TEXT CHECK (trend_direction IN ('up', 'down', 'stable')),

  status TEXT DEFAULT 'green' CHECK (status IN ('green', 'yellow', 'red')),

  -- Update settings
  update_frequency TEXT DEFAULT 'manual' CHECK (update_frequency IN ('manual', 'daily', 'weekly', 'monthly')),
  last_updated_at TIMESTAMPTZ,

  -- Visual
  icon TEXT,
  color TEXT,

  -- Dashboard display
  is_highlighted BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI Value History
CREATE TABLE kpi_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
  value DECIMAL NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_strategy_cycles_user ON strategy_cycles(user_id);
CREATE INDEX idx_strategy_cycles_status ON strategy_cycles(user_id, status);
CREATE INDEX idx_strategy_cycles_dates ON strategy_cycles(user_id, start_date, end_date);

CREATE INDEX idx_objectives_cycle ON objectives(cycle_id);
CREATE INDEX idx_objectives_user ON objectives(user_id);

CREATE INDEX idx_key_results_objective ON key_results(objective_id);
CREATE INDEX idx_kr_history_kr ON key_result_history(key_result_id);

CREATE INDEX idx_initiatives_cycle ON initiatives(cycle_id);
CREATE INDEX idx_initiatives_user ON initiatives(user_id);
CREATE INDEX idx_initiatives_dates ON initiatives(user_id, start_date, end_date);

CREATE INDEX idx_milestones_initiative ON initiative_milestones(initiative_id);

CREATE INDEX idx_kpis_user ON kpis(user_id);
CREATE INDEX idx_kpis_category ON kpis(user_id, category);
CREATE INDEX idx_kpi_values_kpi ON kpi_values(kpi_id, recorded_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE strategy_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_result_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiative_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;

-- Cycles
CREATE POLICY "Users can manage own cycles" ON strategy_cycles
  FOR ALL USING (auth.uid() = user_id);

-- Objectives
CREATE POLICY "Users can manage own objectives" ON objectives
  FOR ALL USING (auth.uid() = user_id);

-- Key Results
CREATE POLICY "Users can manage own KRs" ON key_results
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own KR history" ON key_result_history
  FOR ALL USING (
    key_result_id IN (SELECT id FROM key_results WHERE user_id = auth.uid())
  );

-- Initiatives
CREATE POLICY "Users can manage own initiatives" ON initiatives
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own initiative_objectives" ON initiative_objectives
  FOR ALL USING (
    initiative_id IN (SELECT id FROM initiatives WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own milestones" ON initiative_milestones
  FOR ALL USING (
    initiative_id IN (SELECT id FROM initiatives WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage own dependencies" ON initiative_dependencies
  FOR ALL USING (
    initiative_id IN (SELECT id FROM initiatives WHERE user_id = auth.uid())
  );

-- KPIs
CREATE POLICY "Users can manage own KPIs" ON kpis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own KPI values" ON kpi_values
  FOR ALL USING (
    kpi_id IN (SELECT id FROM kpis WHERE user_id = auth.uid())
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to calculate objective progress from KRs
CREATE OR REPLACE FUNCTION calculate_objective_progress(obj_id UUID)
RETURNS INTEGER AS $$
DECLARE
  avg_progress INTEGER;
BEGIN
  SELECT COALESCE(AVG(progress), 0)::INTEGER INTO avg_progress
  FROM key_results
  WHERE objective_id = obj_id;

  RETURN avg_progress;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update objective progress when KR changes
CREATE OR REPLACE FUNCTION update_objective_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE objectives
  SET progress = calculate_objective_progress(NEW.objective_id),
      updated_at = NOW()
  WHERE id = NEW.objective_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_objective_progress
AFTER INSERT OR UPDATE ON key_results
FOR EACH ROW EXECUTE FUNCTION update_objective_progress();
```

---

## Tasks

- [ ] Criar arquivo de migration
- [ ] Executar migration no Supabase
- [ ] Criar TypeScript types (gerar com supabase gen types)
- [ ] Criar seed data de exemplo
- [ ] Testar RLS policies
- [ ] Documentar schema

---

## Definition of Done

- [ ] Todas as tabelas criadas com sucesso
- [ ] RLS policies funcionando
- [ ] Triggers operacionais
- [ ] TypeScript types gerados
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_strategy_module.sql             [CREATE]

supabase/seed/
└── strategy_seed.sql                   [CREATE]

app/src/types/
└── strategy.ts                         [CREATE/GENERATE]
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
