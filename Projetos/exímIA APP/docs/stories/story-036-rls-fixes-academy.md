# Story EXIMIA-036: RLS Policies Fixes for Academy Module

**Story ID:** EXIMIA-036
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 4
**Pontos:** 2
**Prioridade:** P0 (Bloqueante)
**Depende de:** EXIMIA-035 (Profiles), EXIMIA-015 (Academy Schema)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter as RLS policies completas para Academy,
**Para que** autores possam criar/editar seus cursos e módulos.

---

## Contexto

A validação de @data-engineer identificou que as tabelas `course_modules` e `lessons` só têm policies de SELECT, mas faltam policies para INSERT/UPDATE/DELETE por autores.

### Issues Identificados:

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| courses | ✅ | ⚠️ | ⚠️ | ⚠️ |
| course_modules | ✅ | ❌ | ❌ | ❌ |
| lessons | ✅ | ❌ | ❌ | ❌ |

---

## Acceptance Criteria

### RLS Policies
- [ ] `course_modules`: Author pode criar/editar/deletar módulos de seus cursos
- [ ] `lessons`: Author pode criar/editar/deletar lições de seus cursos
- [ ] `courses`: Author pode criar novos cursos
- [ ] Admin pode gerenciar todos os cursos/módulos/lições

### Validação
- [ ] Testar como usuário comum (só leitura de published)
- [ ] Testar como author (CRUD no próprio conteúdo)
- [ ] Testar como admin (CRUD em tudo)

---

## Technical Details

### Migration SQL

```sql
-- supabase/migrations/004b_academy_rls_fixes.sql

-- =============================================================================
-- FIX: course_modules RLS (Add author write policies)
-- =============================================================================

-- Authors can INSERT modules in their courses
CREATE POLICY "Authors can create modules in their courses" ON course_modules
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.author_id = auth.uid()
    )
  );

-- Authors can UPDATE their course modules
CREATE POLICY "Authors can update their course modules" ON course_modules
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.author_id = auth.uid()
    )
  );

-- Authors can DELETE their course modules
CREATE POLICY "Authors can delete their course modules" ON course_modules
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.author_id = auth.uid()
    )
  );

-- Admins can manage all modules
CREATE POLICY "Admins can manage all course modules" ON course_modules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- FIX: lessons RLS (Add author write policies)
-- =============================================================================

-- Authors can INSERT lessons in their courses
CREATE POLICY "Authors can create lessons in their courses" ON lessons
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.author_id = auth.uid()
    )
  );

-- Authors can UPDATE their course lessons
CREATE POLICY "Authors can update their course lessons" ON lessons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.author_id = auth.uid()
    )
  );

-- Authors can DELETE their course lessons
CREATE POLICY "Authors can delete their course lessons" ON lessons
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lessons.course_id
      AND courses.author_id = auth.uid()
    )
  );

-- Admins can manage all lessons
CREATE POLICY "Admins can manage all lessons" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- FIX: courses RLS (Add author INSERT policy)
-- =============================================================================

-- Any authenticated user with 'author' role can create courses
CREATE POLICY "Authors can create courses" ON courses
  FOR INSERT WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('author', 'admin')
    )
  );

-- Authors can UPDATE their own courses
CREATE POLICY "Authors can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = author_id);

-- Authors can DELETE their own draft courses
CREATE POLICY "Authors can delete own draft courses" ON courses
  FOR DELETE USING (
    auth.uid() = author_id
    AND status = 'draft'
  );
```

---

## Test Cases

### Positive Tests
```sql
-- As author: Create course
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims TO '{"sub": "author-uuid"}';
INSERT INTO courses (title, slug, author_id) VALUES ('Test', 'test', 'author-uuid');
-- Should: SUCCEED

-- As author: Create module in own course
INSERT INTO course_modules (course_id, title) VALUES ('course-uuid', 'Module 1');
-- Should: SUCCEED
```

### Negative Tests
```sql
-- As regular user: Create course
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims TO '{"sub": "regular-user-uuid"}';
INSERT INTO courses (title, slug, author_id) VALUES ('Test', 'test', 'regular-user-uuid');
-- Should: FAIL (not an author)

-- As author: Create module in another author's course
INSERT INTO course_modules (course_id, title) VALUES ('other-author-course-uuid', 'Module 1');
-- Should: FAIL (not owner)
```

---

## Tasks

- [ ] Criar migration `004b_academy_rls_fixes.sql`
- [ ] Adicionar policies para `course_modules`
- [ ] Adicionar policies para `lessons`
- [ ] Adicionar policies para `courses` INSERT
- [ ] Executar positive tests
- [ ] Executar negative tests
- [ ] Documentar test results

---

## Definition of Done

- [ ] Migration aplicada sem erros
- [ ] Todos os positive tests passando
- [ ] Todos os negative tests falhando (como esperado)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/
└── migrations/
    └── 004b_academy_rls_fixes.sql    [CREATE]

tests/
└── rls/
    └── academy-rls.test.sql          [CREATE]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No RLS bypass vulnerabilities
- [ ] Policy performance check (subquery optimization)
- [ ] Missing policy detection

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
**Validated by:** Dara (Data Engineer)
