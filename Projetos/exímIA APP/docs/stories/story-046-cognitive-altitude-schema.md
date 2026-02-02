# Story 046: Cognitive Altitude Database Schema

> **Epic:** Cognitive Altitude System
> **Phase:** 1 (MVP - Assessment Engine)
> **Priority:** HIGH (Blocker for all other stories)
> **Estimate:** 3 points
> **Assignee:** @dev
> **Status:** READY

---

## 📋 Story

**As a** developer
**I want** to create the complete database schema for the Cognitive Altitude system
**So that** we can store user assessments, profiles, and domain levels

---

## 🎯 Acceptance Criteria

### Schema Created
- [ ] All 8 tables created in Supabase with correct structure
- [ ] All indexes created for performance
- [ ] All foreign key relationships established
- [ ] All check constraints added
- [ ] Migration file created and tested

### RLS Policies
- [ ] RLS enabled on all tables
- [ ] Users can only view/edit own profiles
- [ ] Assessment sessions are user-scoped
- [ ] Public read access for reference tables (domains, levels)

### Data Population
- [ ] 7 cognitive domains inserted (Business, Psychology, Health, Relationships, Philosophy, Learning, Creativity)
- [ ] 5 cognitive levels inserted (L0-L4 with descriptions)
- [ ] Test data created for local development

### Testing
- [ ] Migration runs successfully on clean database
- [ ] Rollback works correctly
- [ ] RLS policies tested (users can't access others' data)
- [ ] All foreign keys enforce referential integrity

---

## 📐 Technical Specification

### Tables to Create

#### 1. `cognitive_domains`
```sql
CREATE TABLE cognitive_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Emoji or icon identifier
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 2. `cognitive_levels`
```sql
CREATE TABLE cognitive_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number INT NOT NULL CHECK (level_number >= 0 AND level_number <= 4),
  name TEXT NOT NULL, -- 'Instinctual', 'Conformist', 'Individualist', 'Synthesist', 'Generative'
  description TEXT,
  tier TEXT CHECK (tier IN ('first', 'second')),
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(level_number)
);
```

#### 3. `quiz_questions`
```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id UUID REFERENCES cognitive_domains(id) ON DELETE RESTRICT,
  level_target INT, -- Which level this question best identifies
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('scenario', 'reaction', 'belief')),
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 4. `quiz_answers`
```sql
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  level_score INT NOT NULL CHECK (level_score >= 0 AND level_score <= 4),
  reasoning TEXT, -- Why this answer indicates this level
  order_index INT NOT NULL, -- Display order (a, b, c, d)
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 5. `user_cognitive_profiles`
```sql
CREATE TABLE user_cognitive_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Overall metrics
  overall_altitude DECIMAL(3,2) CHECK (overall_altitude >= 0 AND overall_altitude <= 4),

  -- Metadata
  assessment_version TEXT DEFAULT 'v1.0',
  last_assessment_at TIMESTAMPTZ,

  UNIQUE(user_id)
);
```

#### 6. `user_domain_levels`
```sql
CREATE TABLE user_domain_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES cognitive_domains(id) ON DELETE RESTRICT,
  current_level INT NOT NULL CHECK (current_level >= 0 AND current_level <= 4),
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  evidence JSONB DEFAULT '{}', -- Store quiz answers, behaviors, etc.
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(profile_id, domain_id)
);
```

#### 7. `assessment_sessions`
```sql
CREATE TABLE assessment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES user_cognitive_profiles(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  answers JSONB DEFAULT '{}', -- Store all answers: { question_id: answer_id }
  results JSONB, -- Store calculated levels after completion
  session_duration_seconds INT,

  CHECK (completed_at IS NULL OR completed_at >= started_at)
);
```

#### 8. `altitude_snapshots`
```sql
CREATE TABLE altitude_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES user_cognitive_profiles(id) ON DELETE CASCADE,
  overall_altitude DECIMAL(3,2) NOT NULL,
  domain_levels JSONB NOT NULL, -- Snapshot of all domain levels
  snapshot_date DATE DEFAULT CURRENT_DATE,
  trigger_event TEXT, -- 'assessment', 'content_complete', 'milestone'
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_user_profiles_user_id ON user_cognitive_profiles(user_id);
CREATE INDEX idx_domain_levels_profile ON user_domain_levels(profile_id);
CREATE INDEX idx_domain_levels_domain ON user_domain_levels(domain_id);
CREATE INDEX idx_quiz_questions_domain ON quiz_questions(domain_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX idx_assessment_sessions_user ON assessment_sessions(user_id);
CREATE INDEX idx_assessment_sessions_profile ON assessment_sessions(profile_id);
CREATE INDEX idx_altitude_snapshots_profile ON altitude_snapshots(profile_id);
CREATE INDEX idx_altitude_snapshots_date ON altitude_snapshots(snapshot_date DESC);
```

### RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE user_cognitive_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_domain_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE altitude_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies for user_cognitive_profiles
CREATE POLICY "Users can view own profile"
  ON user_cognitive_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_cognitive_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_cognitive_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_domain_levels
CREATE POLICY "Users can view own domain levels"
  ON user_domain_levels FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM user_cognitive_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own domain levels"
  ON user_domain_levels FOR ALL
  USING (
    profile_id IN (
      SELECT id FROM user_cognitive_profiles WHERE user_id = auth.uid()
    )
  );

-- Policies for assessment_sessions
CREATE POLICY "Users can view own sessions"
  ON assessment_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON assessment_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON assessment_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for altitude_snapshots
CREATE POLICY "Users can view own snapshots"
  ON altitude_snapshots FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM user_cognitive_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can create snapshots"
  ON altitude_snapshots FOR INSERT
  WITH CHECK (true); -- Edge function will create snapshots

-- Public read for reference tables
ALTER TABLE cognitive_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read domains"
  ON cognitive_domains FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can read levels"
  ON cognitive_levels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can read quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Public can read quiz answers"
  ON quiz_answers FOR SELECT
  TO authenticated
  USING (true);
```

### Seed Data

```sql
-- Insert 7 cognitive domains
INSERT INTO cognitive_domains (name, description, icon, order_index) VALUES
('Business', 'Strategy, execution, and commercial acumen', '💼', 1),
('Psychology', 'Self-awareness, emotional intelligence, mental models', '🧠', 2),
('Health', 'Physical fitness, nutrition, energy management', '💪', 3),
('Relationships', 'Communication, empathy, social dynamics', '❤️', 4),
('Philosophy', 'Meaning-making, values, existential understanding', '🤔', 5),
('Learning', 'Meta-learning, curiosity, knowledge acquisition', '📚', 6),
('Creativity', 'Original thinking, expression, artistic sensibility', '🎨', 7);

-- Insert 5 cognitive levels
INSERT INTO cognitive_levels (level_number, name, description, tier) VALUES
(0, 'Instinctual', 'Pure survival mode. Stimulus → Response with minimal thinking.', 'first'),
(1, 'Conformist', 'Black and white thinking. Follows authority without questioning.', 'first'),
(2, 'Individualist', 'Critical thinking emerges. Constructs own mental models.', 'first'),
(3, 'Synthesist', 'Integrates contradictions. Uses perspectives as tools.', 'second'),
(4, 'Generative', 'Creates original perspectives. Navigates full web of ideas.', 'second');
```

---

## 📁 Files to Create/Modify

### New Files
```
apps/web/supabase/migrations/
└── 20260201000000_create_cognitive_altitude_schema.sql

apps/web/supabase/migrations/
└── 20260201000001_seed_cognitive_altitude_data.sql
```

### Migration File Structure
```sql
-- 20260201000000_create_cognitive_altitude_schema.sql

-- 1. Create tables (in order of dependencies)
CREATE TABLE cognitive_domains (...);
CREATE TABLE cognitive_levels (...);
CREATE TABLE quiz_questions (...);
CREATE TABLE quiz_answers (...);
CREATE TABLE user_cognitive_profiles (...);
CREATE TABLE user_domain_levels (...);
CREATE TABLE assessment_sessions (...);
CREATE TABLE altitude_snapshots (...);

-- 2. Create indexes

-- 3. Enable RLS and create policies

-- 4. Create updated_at trigger for profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_cognitive_profiles_updated_at
  BEFORE UPDATE ON user_cognitive_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_domain_levels_updated_at
  BEFORE UPDATE ON user_domain_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🧪 Testing Checklist

### Migration Testing
- [ ] Run migration on clean local database (no errors)
- [ ] Verify all tables exist with correct columns
- [ ] Verify all indexes exist
- [ ] Verify all foreign keys work (try invalid references)
- [ ] Verify check constraints work (try invalid values)
- [ ] Test rollback migration

### RLS Testing
```sql
-- Test as user A
SET request.jwt.claim.sub = '<user_a_uuid>';

-- Should succeed
SELECT * FROM user_cognitive_profiles WHERE user_id = '<user_a_uuid>';

-- Should return empty (not user A's data)
SELECT * FROM user_cognitive_profiles WHERE user_id = '<user_b_uuid>';

-- Should succeed (public read)
SELECT * FROM cognitive_domains;
SELECT * FROM cognitive_levels;
```

### Data Integrity Testing
- [ ] Can't create profile without valid user_id
- [ ] Can't create domain_level without valid profile_id
- [ ] Can't delete domain while questions reference it
- [ ] Can cascade delete user data when user deleted
- [ ] JSONB fields accept valid JSON only

---

## 📚 Reference

- **Architecture:** `cognitive-altitude-system-architecture.md` (Database Schema section)
- **Supabase Docs:** https://supabase.com/docs/guides/database/tables
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security

---

## ✅ Definition of Done

- [x] All 8 tables created successfully
- [x] All indexes created
- [x] All RLS policies enabled and tested
- [x] Seed data inserted (7 domains, 5 levels)
- [x] Migration file committed
- [x] Local testing passed (all checklist items)
- [x] Supabase dashboard shows tables correctly
- [x] No errors in Supabase logs

---

## 🚀 Next Steps

After this story:
- **Story 047:** Assessment Engine Edge Function (depends on this schema)
- **Story 048:** Quiz Frontend UI (depends on schema + edge function)

---

**Story Created:** 2026-02-01
**Created By:** @sm (River)
**Dependencies:** None (Foundation story)
**Blocks:** Stories 047-051 (all Phase 1 stories)

— River, removendo obstáculos 🌊
