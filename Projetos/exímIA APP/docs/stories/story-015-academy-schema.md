# Story EXIMIA-015: Academy Module Database Schema

**Story ID:** EXIMIA-015
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 4
**Pontos:** 5
**Prioridade:** P1 (Alto)
**Depende de:** EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter o schema de database do módulo Academy,
**Para que** eu possa construir o sistema de cursos e aprendizado.

---

## Contexto

Academy é o pilar de receita do exímIA:
- **Courses** — Cursos com módulos e lições
- **Enrollments** — Matrículas de usuários
- **Progress** — Tracking de progresso
- **Socratic Sessions** — Sessões de chat com IA

---

## Acceptance Criteria

- [ ] Tabela `courses` criada
- [ ] Tabela `course_modules` criada
- [ ] Tabela `lessons` criada
- [ ] Tabela `enrollments` criada
- [ ] Tabela `lesson_progress` criada
- [ ] Tabela `socratic_sessions` criada
- [ ] Indexes e RLS configurados

---

## Technical Details

### Schema

```sql
-- supabase/migrations/004_academy_module.sql

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE course_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'quiz', 'exercise', 'socratic');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'paused', 'cancelled');

-- =============================================================================
-- COURSES
-- =============================================================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Metadata
  thumbnail_url TEXT,
  duration_hours DECIMAL(5,1),
  difficulty course_difficulty NOT NULL DEFAULT 'beginner',

  -- Categorization
  category TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Author
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,

  -- Pricing
  is_free BOOLEAN DEFAULT FALSE,
  price_cents INTEGER,

  -- Status
  status course_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,

  -- Stats (denormalized for performance)
  enrolled_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  avg_rating DECIMAL(3,2),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- COURSE MODULES
-- =============================================================================

CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- Duration (sum of lessons)
  duration_minutes INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- LESSONS
-- =============================================================================

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- Core
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL DEFAULT 'text',

  -- Content
  content JSONB DEFAULT '{}', -- Flexible content structure
  video_url TEXT,
  duration_minutes INTEGER,

  -- Ordering
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- Free preview
  is_preview BOOLEAN DEFAULT FALSE,

  -- Socratic config
  socratic_enabled BOOLEAN DEFAULT FALSE,
  socratic_system_prompt TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(module_id, slug)
);

-- =============================================================================
-- ENROLLMENTS
-- =============================================================================

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- Status
  status enrollment_status NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Progress (denormalized)
  progress_percent DECIMAL(5,2) DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,

  -- Last activity
  last_lesson_id UUID REFERENCES lessons(id),
  last_activity_at TIMESTAMPTZ,

  -- Certificate
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,

  UNIQUE(user_id, course_id)
);

-- =============================================================================
-- LESSON PROGRESS
-- =============================================================================

CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,

  -- Progress
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE,

  -- For videos
  watch_time_seconds INTEGER DEFAULT 0,

  -- For quizzes
  quiz_score DECIMAL(5,2),
  quiz_attempts INTEGER DEFAULT 0,

  -- Notes
  notes TEXT,

  UNIQUE(user_id, lesson_id)
);

-- =============================================================================
-- SOCRATIC SESSIONS
-- =============================================================================

CREATE TABLE socratic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,

  -- Messages stored as JSONB array
  messages JSONB DEFAULT '[]',
  -- [{ role: 'user'|'assistant', content: string, timestamp: string }]

  -- Stats
  message_count INTEGER DEFAULT 0,

  -- Status
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_courses_status ON courses(status) WHERE status = 'published';
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_slug ON courses(slug);

CREATE INDEX idx_modules_course ON course_modules(course_id);

CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status) WHERE status = 'active';

CREATE INDEX idx_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_progress_enrollment ON lesson_progress(enrollment_id);

CREATE INDEX idx_socratic_user ON socratic_sessions(user_id);
CREATE INDEX idx_socratic_lesson ON socratic_sessions(lesson_id);

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Courses (public read for published, admin write)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can manage own courses" ON courses
  FOR ALL USING (auth.uid() = author_id);

-- Modules (inherit from course)
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view modules of published courses" ON course_modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_modules.course_id AND status = 'published')
  );

-- Lessons (inherit from course)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons of published courses" ON lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND status = 'published')
  );

-- Enrollments (user's own)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own enrollments" ON enrollments
  FOR ALL USING (auth.uid() = user_id);

-- Progress (user's own)
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- Socratic (user's own)
ALTER TABLE socratic_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON socratic_sessions
  FOR ALL USING (auth.uid() = user_id);
```

---

## Tasks

- [ ] Criar migration `004_academy_module.sql`
- [ ] Implementar enums
- [ ] Implementar todas as tabelas
- [ ] Adicionar indexes
- [ ] Configurar RLS policies
- [ ] Testar migration
- [ ] Regenerar tipos TypeScript
- [ ] Criar seed data (curso de exemplo)

---

## Definition of Done

- [ ] Migration aplicada sem erros
- [ ] 6 tabelas criadas
- [ ] RLS funcionando
- [ ] Seed data disponível
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/
├── migrations/
│   └── 004_academy_module.sql    [CREATE]
└── seed/
    └── 002_academy_seed.sql      [CREATE]

types/
└── supabase.ts                   [REGENERATE]
```

---

**Story criada por River (SM)**
**Data:** 2026-01-29
