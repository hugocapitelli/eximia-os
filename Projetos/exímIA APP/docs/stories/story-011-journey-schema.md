# Story EXIMIA-011: Journey Module Database Schema

**Story ID:** EXIMIA-011
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 3
**Pontos:** 5
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-001 (Connection Layer Schema), EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter o schema de database do módulo Journey implementado,
**Para que** eu possa construir as funcionalidades de Goals e Habits.

---

## Contexto

O módulo Journey é o core de execução pessoal:
- **Goals** — Metas com OKRs (Key Results)
- **Habits** — Hábitos diários com tracking
- **Books** — Biblioteca de leitura (backlog para futuro)

---

## Acceptance Criteria

- [ ] Tabela `goals` criada com todos os campos
- [ ] Tabela `key_results` criada (relacionada a goals)
- [ ] Tabela `habits` criada
- [ ] Tabela `habit_logs` criada (tracking diário)
- [ ] Tabela `books` criada
- [ ] Indexes otimizados
- [ ] RLS policies configuradas
- [ ] Foreign keys para `entity_links` (Connection Layer)
- [ ] Enums para status e priority

---

## Technical Details

### Database Schema

```sql
-- supabase/migrations/002_journey_module.sql

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE goal_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE goal_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE goal_timeframe AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly');
CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'custom');
CREATE TYPE book_status AS ENUM ('wishlist', 'reading', 'completed', 'abandoned');

-- =============================================================================
-- GOALS
-- =============================================================================

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  why TEXT, -- Motivação/propósito

  -- Classification
  status goal_status NOT NULL DEFAULT 'draft',
  priority goal_priority NOT NULL DEFAULT 'medium',
  timeframe goal_timeframe NOT NULL DEFAULT 'quarterly',

  -- Dates
  start_date DATE,
  due_date DATE,
  completed_at TIMESTAMPTZ,

  -- Progress (calculated from KRs)
  progress DECIMAL(5,2) DEFAULT 0, -- 0-100%

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  color TEXT, -- Para UI
  icon TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- KEY RESULTS (OKRs)
-- =============================================================================

CREATE TABLE key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  description TEXT,

  -- Progress tracking
  metric_type TEXT NOT NULL DEFAULT 'percentage', -- percentage, number, boolean, currency
  target_value DECIMAL(15,2) NOT NULL DEFAULT 100,
  current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  unit TEXT, -- ex: "páginas", "reuniões", "%"

  -- Weight for goal progress calculation
  weight DECIMAL(3,2) DEFAULT 1.0,

  -- Status
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  -- Order within goal
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- HABITS
-- =============================================================================

CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  description TEXT,

  -- Frequency
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  frequency_config JSONB DEFAULT '{}', -- ex: { "days": [1,3,5] } for MWF

  -- Target
  target_per_period INTEGER DEFAULT 1, -- ex: 3x per week
  duration_minutes INTEGER, -- ex: 30 min meditation

  -- Time preference
  preferred_time TEXT, -- 'morning', 'afternoon', 'evening', 'anytime'
  reminder_time TIME,

  -- Tracking
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,

  -- UI
  icon TEXT,
  color TEXT,

  -- Status
  active BOOLEAN DEFAULT TRUE,
  archived_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- HABIT LOGS (Daily tracking)
-- =============================================================================

CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- When
  log_date DATE NOT NULL,

  -- Completion
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  -- Optional details
  duration_minutes INTEGER,
  notes TEXT,
  mood INTEGER CHECK (mood >= 1 AND mood <= 5), -- 1-5 scale

  -- Prevent duplicates
  UNIQUE(habit_id, log_date),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- BOOKS (Reading Library)
-- =============================================================================

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Book info
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  cover_url TEXT,

  -- Status
  status book_status NOT NULL DEFAULT 'wishlist',

  -- Progress
  total_pages INTEGER,
  current_page INTEGER DEFAULT 0,
  started_at DATE,
  finished_at DATE,

  -- Notes & rating
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  highlights JSONB DEFAULT '[]', -- Array of highlighted passages

  -- Categories
  genre TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Goals
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status) WHERE status = 'active';
CREATE INDEX idx_goals_due_date ON goals(due_date);

-- Key Results
CREATE INDEX idx_key_results_goal_id ON key_results(goal_id);
CREATE INDEX idx_key_results_user_id ON key_results(user_id);

-- Habits
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habits_active ON habits(user_id) WHERE active = TRUE;

-- Habit Logs
CREATE INDEX idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX idx_habit_logs_user_date ON habit_logs(user_id, log_date);
CREATE INDEX idx_habit_logs_date ON habit_logs(log_date DESC);

-- Books
CREATE INDEX idx_books_user_id ON books(user_id);
CREATE INDEX idx_books_status ON books(status);

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Key Results
ALTER TABLE key_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own key_results" ON key_results
  FOR ALL USING (auth.uid() = user_id);

-- Habits
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- Habit Logs
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habit_logs" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

-- Books
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own books" ON books
  FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Auto-update goal progress when key results change
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE goals
  SET progress = (
    SELECT COALESCE(
      SUM((kr.current_value / NULLIF(kr.target_value, 0)) * kr.weight * 100) /
      NULLIF(SUM(kr.weight), 0),
      0
    )
    FROM key_results kr
    WHERE kr.goal_id = COALESCE(NEW.goal_id, OLD.goal_id)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.goal_id, OLD.goal_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_goal_progress
AFTER INSERT OR UPDATE OR DELETE ON key_results
FOR EACH ROW EXECUTE FUNCTION update_goal_progress();

-- Auto-update habit streaks
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  streak_count INTEGER;
BEGIN
  IF NEW.completed = TRUE THEN
    -- Calculate current streak
    SELECT COUNT(*)
    INTO streak_count
    FROM (
      SELECT log_date
      FROM habit_logs
      WHERE habit_id = NEW.habit_id
        AND completed = TRUE
        AND log_date <= NEW.log_date
      ORDER BY log_date DESC
    ) sub
    WHERE log_date >= NEW.log_date - (ROW_NUMBER() OVER (ORDER BY log_date DESC) - 1)::INTEGER;

    UPDATE habits
    SET
      current_streak = streak_count,
      best_streak = GREATEST(best_streak, streak_count),
      total_completions = total_completions + 1,
      updated_at = NOW()
    WHERE id = NEW.habit_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_habit_streak
AFTER INSERT OR UPDATE ON habit_logs
FOR EACH ROW EXECUTE FUNCTION update_habit_streak();

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_goals_updated_at
BEFORE UPDATE ON goals
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_habits_updated_at
BEFORE UPDATE ON habits
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Tasks

- [ ] Criar migration file `002_journey_module.sql`
- [ ] Implementar enums
- [ ] Implementar tabela `goals`
- [ ] Implementar tabela `key_results`
- [ ] Implementar tabela `habits`
- [ ] Implementar tabela `habit_logs`
- [ ] Implementar tabela `books`
- [ ] Adicionar indexes
- [ ] Adicionar RLS policies
- [ ] Implementar triggers (progress, streaks)
- [ ] Testar migration localmente
- [ ] Aplicar migration no Supabase
- [ ] Regenerar tipos TypeScript

---

## Definition of Done

- [ ] Migration aplicada sem erros
- [ ] 5 tabelas visíveis no Supabase
- [ ] RLS funcionando
- [ ] Triggers funcionando (testar progress calc)
- [ ] Tipos TypeScript atualizados
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/
└── migrations/
    └── 002_journey_module.sql     [CREATE]

types/
└── supabase.ts                    [REGENERATE]
```

---

## Referências

- [PRD Journey Module](../../01_Journey/PRD-Journey-v5.0.md)
- [PRD Connection Layer](../../00_Core/PRD-Connection-Layer-v5.0.md)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
