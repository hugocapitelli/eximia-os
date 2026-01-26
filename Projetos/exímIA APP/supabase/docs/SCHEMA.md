# ExímIA APP - Database Schema

**Projeto:** ExímIA APP
**Data:** 2026-01-26
**Versão:** 1.0
**Agente:** @data-engineer (via @architect)

---

## Status Atual

| Aspecto | Status |
|---------|--------|
| **Tabelas Implementadas** | 0 (apenas auth Supabase) |
| **Tabelas Planejadas** | 35+ |
| **Migrations** | Nenhuma |
| **RLS Policies** | Nenhuma |
| **Indexes** | Nenhum |

---

## 1. Schema Planejado (per PRD)

### 1.1 Connection Layer (CRÍTICO)

```sql
-- ═══════════════════════════════════════════════════════════════════
-- EVENTS - Event Bus (Sistema Nervoso Central)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  type TEXT NOT NULL,                    -- "goal.created", "habit.completed"
  source_module TEXT NOT NULL,           -- "journey", "academy", "strategy"

  -- Payload
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',

  -- Contexto
  user_id UUID NOT NULL REFERENCES auth.users(id),
  workspace_id UUID,
  correlation_id UUID,                   -- Rastrear cadeia de eventos

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'pending';
CREATE INDEX idx_events_created_at ON events(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════
-- ENTITY_LINKS - Conexões Bidirecionais
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE entity_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  source_module TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,

  -- Target
  target_module TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,

  -- Metadata
  link_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (link_type IN ('cascaded', 'suggested', 'manual', 'derived')),
  relationship TEXT NOT NULL,            -- "parent_of", "supports", "related_to"
  strength DECIMAL(3,2) DEFAULT 1.0,     -- 0-1
  bidirectional BOOLEAN DEFAULT TRUE,

  -- Contexto
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_by TEXT NOT NULL DEFAULT 'user'
    CHECK (created_by IN ('system', 'user', 'ai')),
  created_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,

  UNIQUE(source_type, source_id, target_type, target_id)
);

CREATE INDEX idx_links_source ON entity_links(source_type, source_id);
CREATE INDEX idx_links_target ON entity_links(target_type, target_id);
CREATE INDEX idx_links_user ON entity_links(user_id);

-- ═══════════════════════════════════════════════════════════════════
-- SUGGESTIONS - IA Proativa
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Trigger
  trigger_event_id UUID REFERENCES events(id),
  trigger_event_type TEXT,
  trigger_entity_type TEXT,
  trigger_entity_id UUID,
  trigger_entity_title TEXT,

  -- Sugestão
  suggestion_type TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_module TEXT NOT NULL,
  action_params JSONB DEFAULT '{}',

  title TEXT NOT NULL,
  description TEXT,
  reasoning TEXT,
  confidence DECIMAL(3,2) NOT NULL,      -- 0-1

  -- Pré-preenchimento
  prefilled_data JSONB,

  -- UI
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  display_type TEXT DEFAULT 'card'
    CHECK (display_type IN ('toast', 'card', 'modal', 'notification')),

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'shown', 'accepted', 'dismissed', 'snoozed', 'expired')),

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  shown_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  snooze_until TIMESTAMPTZ
);

CREATE INDEX idx_suggestions_user ON suggestions(user_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);

-- ═══════════════════════════════════════════════════════════════════
-- NOTIFICATIONS - Saída Proativa
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Conteúdo
  type TEXT NOT NULL
    CHECK (type IN ('reminder', 'alert', 'suggestion', 'celebration', 'digest', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,

  -- Ação
  action_url TEXT,
  action_label TEXT,
  actions JSONB,                          -- Array de ações

  -- Contexto
  source_module TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  related_entity_title TEXT,

  -- Delivery
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'],
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'actioned', 'dismissed')),

  -- Timing
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  actioned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for)
  WHERE status = 'pending';
```

### 1.2 Journey Module

```sql
-- ═══════════════════════════════════════════════════════════════════
-- GOALS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Conteúdo
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,                         -- "business", "education", "health"
  scope TEXT DEFAULT 'quarterly'
    CHECK (scope IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),

  -- Progresso
  status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Timing
  start_date DATE,
  deadline DATE,
  completed_at TIMESTAMPTZ,

  -- Metadata
  tags TEXT[],
  linked_initiative_id UUID,             -- Link com Strategy

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_deadline ON goals(deadline);

-- ═══════════════════════════════════════════════════════════════════
-- HABITS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Conteúdo
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,

  -- Frequência
  frequency TEXT DEFAULT 'daily'
    CHECK (frequency IN ('daily', 'weekly', 'weekdays', 'weekends', 'custom')),
  frequency_config JSONB,                -- Para custom: {days: [1,3,5]}

  -- Tracking
  status TEXT DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'archived')),
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,

  -- Timing
  reminder_time TIME,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,

  UNIQUE(habit_id, completed_at::DATE)   -- Uma completion por dia
);

CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habit_completions_habit ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(completed_at DESC);

-- ═══════════════════════════════════════════════════════════════════
-- BOOKS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Info
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  cover_url TEXT,

  -- Tracking
  status TEXT DEFAULT 'to_read'
    CHECK (status IN ('to_read', 'reading', 'completed', 'abandoned')),
  progress INTEGER DEFAULT 0,            -- Páginas ou %
  total_pages INTEGER,

  -- Dates
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Review
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE book_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  content TEXT NOT NULL,
  page_number INTEGER,
  chapter TEXT,
  is_quote BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_books_user ON books(user_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_book_notes_book ON book_notes(book_id);
```

### 1.3 Academy Module

```sql
-- ═══════════════════════════════════════════════════════════════════
-- COURSES (Catalog - pode ser compartilhado ou por user)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Info
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT,                         -- "academy", "external", "youtube"
  external_url TEXT,
  thumbnail_url TEXT,

  -- Structure
  total_lessons INTEGER DEFAULT 0,
  estimated_hours DECIMAL(5,2),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),

  -- Metadata
  tags TEXT[],
  category TEXT,

  -- Pricing
  is_free BOOLEAN DEFAULT TRUE,
  price DECIMAL(10,2),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- ENROLLMENTS (User's courses)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  course_id UUID NOT NULL REFERENCES courses(id),

  -- Progress
  status TEXT DEFAULT 'enrolled'
    CHECK (status IN ('enrolled', 'in_progress', 'completed', 'abandoned')),
  progress INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,

  -- Timing
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,

  -- Resultado
  certificate_url TEXT,
  final_score DECIMAL(5,2),

  UNIQUE(user_id, course_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- LESSONS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- Info
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,                          -- Markdown
  video_url TEXT,

  -- Structure
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(lesson_id, enrollment_id)
);

-- ═══════════════════════════════════════════════════════════════════
-- SOCRATIC SESSIONS (IA Socrática)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE socratic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  lesson_id UUID REFERENCES lessons(id),

  -- Session
  topic TEXT NOT NULL,
  transcript JSONB NOT NULL DEFAULT '[]', -- Array de messages

  -- Results
  score DECIMAL(5,2),
  insights JSONB,                         -- Insights extraídos

  -- Timing
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_socratic_user ON socratic_sessions(user_id);
```

### 1.4 Strategy Module

```sql
-- ═══════════════════════════════════════════════════════════════════
-- ORGANIZATIONS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- CYCLES (Períodos estratégicos)
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  name TEXT NOT NULL,                    -- "Q1 2026", "Sprint 1"
  description TEXT,

  -- Timing
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Status
  status TEXT DEFAULT 'planning'
    CHECK (status IN ('planning', 'active', 'review', 'completed')),

  -- Objectives
  objectives JSONB,                      -- OKRs, etc.

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- INITIATIVES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Info
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),

  -- Progress
  status TEXT DEFAULT 'planned'
    CHECK (status IN ('planned', 'active', 'blocked', 'completed', 'cancelled')),
  progress INTEGER DEFAULT 0,

  -- Timing
  target_date DATE,
  completed_at TIMESTAMPTZ,

  -- Outcomes
  outcomes JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- KPIs
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID REFERENCES initiatives(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  name TEXT NOT NULL,
  description TEXT,
  unit TEXT,                             -- "%", "R$", "users"

  -- Values
  target_value DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) DEFAULT 0,
  baseline_value DECIMAL(15,2),

  -- Thresholds
  warning_threshold DECIMAL(15,2),
  critical_threshold DECIMAL(15,2),

  -- Direction
  direction TEXT DEFAULT 'higher_is_better'
    CHECK (direction IN ('higher_is_better', 'lower_is_better')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE kpi_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,

  value DECIMAL(15,2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX idx_initiatives_cycle ON initiatives(cycle_id);
CREATE INDEX idx_initiatives_status ON initiatives(status);
CREATE INDEX idx_kpis_initiative ON kpis(initiative_id);
CREATE INDEX idx_kpi_history_kpi ON kpi_history(kpi_id);
```

### 1.5 Brand Module

```sql
-- ═══════════════════════════════════════════════════════════════════
-- BRAND IDENTITY
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE brand_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,

  -- Core
  name TEXT NOT NULL,
  tagline TEXT,
  mission TEXT,
  vision TEXT,
  values TEXT[],

  -- Voice
  voice_tone TEXT,                       -- "formal", "casual", "inspirational"
  voice_guidelines TEXT,

  -- Personality
  personality_traits JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- COLOR PALETTES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE brand_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identities(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  colors JSONB NOT NULL,                 -- {primary: "#...", secondary: "#..."}

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- BRAND ASSETS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE brand_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Info
  name TEXT NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('logo', 'icon', 'image', 'font', 'template', 'guideline')),
  description TEXT,

  -- File
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,

  -- Status
  approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),

  -- Tags
  tags TEXT[],

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brand_assets_brand ON brand_assets(brand_id);
CREATE INDEX idx_brand_assets_type ON brand_assets(type);
```

### 1.6 Inbox Module

```sql
-- ═══════════════════════════════════════════════════════════════════
-- INBOX ITEMS
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Conteúdo
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text'
    CHECK (content_type IN ('text', 'voice', 'image', 'link', 'file')),
  attachments JSONB,

  -- Origem
  source TEXT DEFAULT 'quick_capture'
    CHECK (source IN ('quick_capture', 'voice', 'email', 'api', 'share', 'screenshot')),
  source_metadata JSONB,

  -- Triagem IA
  ai_analysis JSONB,                     -- {suggested_module, confidence, reasoning}

  -- Status
  status TEXT DEFAULT 'inbox'
    CHECK (status IN ('inbox', 'processing', 'triaged', 'converted', 'archived')),

  -- Resultado
  converted_to_module TEXT,
  converted_to_type TEXT,
  converted_to_id UUID,

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX idx_inbox_user ON inbox_items(user_id);
CREATE INDEX idx_inbox_status ON inbox_items(status);
```

### 1.7 User Preferences & Metadata

```sql
-- ═══════════════════════════════════════════════════════════════════
-- USER PREFERENCES
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,

  -- Display
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',

  -- Notifications
  notification_email BOOLEAN DEFAULT TRUE,
  notification_push BOOLEAN DEFAULT TRUE,
  notification_in_app BOOLEAN DEFAULT TRUE,

  -- Automations
  cascade_rules JSONB,                   -- Rules enabled/disabled

  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- AUDIT LOG
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  action TEXT NOT NULL,                  -- "create", "update", "delete"
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,

  old_data JSONB,
  new_data JSONB,

  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

---

## 2. Resumo de Tabelas

| Módulo | Tabelas | Status |
|--------|---------|--------|
| **Connection Layer** | events, entity_links, suggestions, notifications | 0% |
| **Journey** | goals, habits, habit_completions, books, book_notes | 0% |
| **Academy** | courses, enrollments, lessons, lesson_completions, socratic_sessions | 0% |
| **Strategy** | organizations, cycles, initiatives, kpis, kpi_history | 0% |
| **Brand** | brand_identities, brand_palettes, brand_assets | 0% |
| **Inbox** | inbox_items | 0% |
| **Core** | user_preferences, audit_logs | 0% |
| **Total** | **35 tabelas** | **0%** |

---

## 3. RLS Policies (Necessárias)

```sql
-- Todas as tabelas precisam de RLS para multi-tenancy

-- Exemplo para goals:
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Replicar para todas as 35 tabelas
```

---

## 4. Próximos Passos

### Imediato (Semana 1)
1. Criar migration para Connection Layer (events, entity_links)
2. Aplicar RLS em todas as tabelas
3. Criar indexes otimizados

### Curto Prazo (Semanas 2-3)
1. Criar migrations para Journey (goals, habits, books)
2. Criar migrations para Academy básico (courses, enrollments)
3. Seed data para desenvolvimento

### Médio Prazo (Semanas 4+)
1. Implementar triggers para Event Bus
2. Criar functions para cascading
3. Implementar full-text search

---

**Documento gerado automaticamente pelo Brownfield Discovery Workflow**
**Agente:** @data-engineer (via @architect)
**Data:** 2026-01-26
