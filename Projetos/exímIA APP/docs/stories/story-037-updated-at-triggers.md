# Story EXIMIA-037: Updated_at Triggers for All Tables

**Story ID:** EXIMIA-037
**Epic:** EXIMIA-EPIC-001 (Core Foundation)
**Sprint:** 4
**Pontos:** 1
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-035 (Profiles), EXIMIA-015 (Academy Schema), EXIMIA-011 (Journey Schema)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter triggers `updated_at` em todas as tabelas,
**Para que** o timestamp de atualização seja consistente em todo o sistema.

---

## Contexto

A validação de @data-engineer identificou que algumas tabelas não têm o trigger `updated_at`:

| Tabela | Trigger Existente |
|--------|-------------------|
| goals | ✅ |
| habits | ✅ |
| books | ✅ |
| profiles | ✅ (Story 035) |
| courses | ❌ |
| lessons | ❌ |
| enrollments | ❌ |
| key_results | ❌ |
| course_modules | ❌ |

---

## Acceptance Criteria

- [ ] Trigger `updated_at` aplicado em `courses`
- [ ] Trigger `updated_at` aplicado em `lessons`
- [ ] Trigger `updated_at` aplicado em `enrollments`
- [ ] Trigger `updated_at` aplicado em `key_results`
- [ ] Trigger `updated_at` aplicado em `course_modules`
- [ ] Trigger `updated_at` aplicado em `book_notes`
- [ ] Verificar que UPDATE em qualquer tabela atualiza `updated_at`

---

## Technical Details

### Migration SQL

```sql
-- supabase/migrations/006_updated_at_triggers.sql

-- =============================================================================
-- ENSURE base function exists
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- APPLY TRIGGERS TO ALL TABLES WITH updated_at COLUMN
-- =============================================================================

-- Academy Module
CREATE TRIGGER trigger_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Journey Module
CREATE TRIGGER trigger_key_results_updated_at
  BEFORE UPDATE ON key_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Library Module
CREATE TRIGGER trigger_book_notes_updated_at
  BEFORE UPDATE ON book_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Note: goals, habits, books already have triggers from Story 011
-- Note: profiles already has trigger from Story 035
```

---

## Tasks

- [ ] Criar migration `006_updated_at_triggers.sql`
- [ ] Adicionar triggers para Academy tables
- [ ] Adicionar triggers para Journey tables
- [ ] Adicionar triggers para Library tables
- [ ] Testar UPDATE em cada tabela
- [ ] Verificar que `updated_at` é atualizado

---

## Definition of Done

- [ ] Migration aplicada sem erros
- [ ] UPDATE em qualquer tabela atualiza `updated_at` automaticamente
- [ ] Sem erros em logs
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/
└── migrations/
    └── 006_updated_at_triggers.sql    [CREATE]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No duplicate trigger names
- [ ] Function exists before trigger creation

**Expected Issues:** None (simple migration)

---

**Story criada por River (SM)**
**Data:** 2026-01-30
