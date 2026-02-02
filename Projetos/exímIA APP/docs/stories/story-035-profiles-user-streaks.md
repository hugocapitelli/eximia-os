# Story EXIMIA-035: Profiles & User Streaks Tables

**Story ID:** EXIMIA-035
**Epic:** EXIMIA-EPIC-001 (Core Foundation)
**Sprint:** 3
**Pontos:** 3
**Prioridade:** P0 (Bloqueante)
**Depende de:** EXIMIA-009 (Supabase Setup)
**Bloqueia:** EXIMIA-015 (Academy Schema), EXIMIA-016 (Academy API)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter as tabelas `profiles` e `user_streaks` implementadas,
**Para que** o sistema de roles (admin/author) e streaks funcione corretamente.

---

## Contexto

Esta story resolve issues CRITICAL identificados na validação de schema:
- **profiles**: Necessária para RLS policies de admin em cursos
- **user_streaks**: Referenciada na função `get_academy_dashboard_stats()`

Sem estas tabelas, o deploy do Academy Schema falhará.

---

## Acceptance Criteria

### Tabela `profiles`
- [ ] Tabela criada com campos: id, role, full_name, avatar_url, bio, created_at, updated_at
- [ ] FK para auth.users(id) com ON DELETE CASCADE
- [ ] CHECK constraint para role IN ('user', 'admin', 'author')
- [ ] Trigger `on_auth_user_created` para auto-criar profile
- [ ] RLS policies configuradas

### Tabela `user_streaks`
- [ ] Tabela criada com campos: user_id, current_streak, best_streak, last_activity_date, streak_type
- [ ] PK em user_id (one streak record per user)
- [ ] RLS policies configuradas
- [ ] Função `update_user_streak()` implementada

### Validação
- [ ] Migration aplicada sem erros
- [ ] Trigger de auto-criação funcionando
- [ ] RLS testado com positive/negative cases

---

## Technical Details

### Migration SQL

```sql
-- supabase/migrations/000_profiles_and_streaks.sql

-- =============================================================================
-- PROFILES TABLE
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Role for RLS
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'author')),

  -- Profile info
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,

  -- Settings
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  locale TEXT DEFAULT 'pt-BR',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for role lookups (used in RLS)
CREATE INDEX idx_profiles_role ON profiles(role) WHERE role IN ('admin', 'author');

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- USER STREAKS TABLE
-- =============================================================================

CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Streak data
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,

  -- Type of streak (learning, reading, habits)
  streak_type TEXT NOT NULL DEFAULT 'learning' CHECK (streak_type IN ('learning', 'reading', 'habits', 'combined')),

  -- Timestamps
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak" ON user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update streak (called by triggers on activity tables)
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID, p_streak_type TEXT DEFAULT 'learning')
RETURNS VOID AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_last_date DATE;
  v_current_streak INTEGER;
  v_best_streak INTEGER;
BEGIN
  -- Get current streak data
  SELECT last_activity_date, current_streak, best_streak
  INTO v_last_date, v_current_streak, v_best_streak
  FROM user_streaks
  WHERE user_id = p_user_id AND streak_type = p_streak_type;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, streak_type, current_streak, best_streak, last_activity_date)
    VALUES (p_user_id, p_streak_type, 1, 1, v_today);
    RETURN;
  END IF;

  -- If already logged today, do nothing
  IF v_last_date = v_today THEN
    RETURN;
  END IF;

  -- If yesterday, increment streak
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
    v_best_streak := GREATEST(v_best_streak, v_current_streak);
  -- If missed a day, reset streak
  ELSE
    v_current_streak := 1;
  END IF;

  -- Update record
  UPDATE user_streaks
  SET
    current_streak = v_current_streak,
    best_streak = v_best_streak,
    last_activity_date = v_today,
    updated_at = NOW()
  WHERE user_id = p_user_id AND streak_type = p_streak_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- HELPER FUNCTION (if not exists)
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Tasks

- [ ] Criar migration file `000_profiles_and_streaks.sql`
- [ ] Implementar tabela `profiles`
- [ ] Implementar trigger `handle_new_user()`
- [ ] Implementar tabela `user_streaks`
- [ ] Implementar função `update_user_streak()`
- [ ] Configurar RLS policies
- [ ] Testar auto-criação de profile
- [ ] Testar streak calculation
- [ ] Atualizar TypeScript types

---

## Definition of Done

- [ ] Migration aplicada sem erros
- [ ] Profile criado automaticamente em novo signup
- [ ] Streaks atualizando corretamente
- [ ] RLS funcionando (testado com diferentes roles)
- [ ] TypeScript types gerados
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/
└── migrations/
    └── 000_profiles_and_streaks.sql   [CREATE]

src/lib/supabase/
└── types.ts                            [REGENERATE]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] RLS bypass check (no SECURITY DEFINER without audit)
- [ ] Trigger function security review
- [ ] Index efficiency validation

**Expected Issues:** None (clean schema)

---

**Story criada por River (SM)**
**Data:** 2026-01-30
**Validated by:** Dara (Data Engineer)
