# Story EXIMIA-001: Database Schema - Connection Layer

**Story ID:** EXIMIA-001
**Epic:** EXIMIA-EPIC-001 (Technical Debt Resolution)
**Sprint:** 1
**Pontos:** 8
**Prioridade:** P0 (Crítico)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter o schema de database da Connection Layer implementado,
**Para que** eu possa construir o Event Bus e Entity Links que conectam todos os módulos.

---

## Contexto

A Connection Layer é o "coração" do exímIA APP, responsável por:
- Event Bus (comunicação entre módulos)
- Entity Links (conexões bidirecionais)
- Suggestions (IA proativa)
- Notifications (saída proativa)

Sem esse schema, nenhum módulo pode se comunicar.

---

## Acceptance Criteria

- [ ] Tabela `events` criada com todos os campos do PRD
- [ ] Tabela `entity_links` criada com constraints
- [ ] Tabela `suggestions` criada
- [ ] Tabela `notifications` criada
- [ ] Indexes otimizados em todas as tabelas
- [ ] RLS policies para todas as tabelas
- [ ] Migration aplicada com sucesso
- [ ] Seed data de exemplo (opcional)

---

## Technical Details

### Tabelas a Criar

```sql
-- 1. EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  source_module TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  user_id UUID NOT NULL REFERENCES auth.users(id),
  correlation_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- 2. ENTITY_LINKS
CREATE TABLE entity_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_module TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  target_module TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'manual',
  relationship TEXT NOT NULL,
  strength DECIMAL(3,2) DEFAULT 1.0,
  bidirectional BOOLEAN DEFAULT TRUE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_by TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_type, source_id, target_type, target_id)
);

-- 3. SUGGESTIONS
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  trigger_event_id UUID REFERENCES events(id),
  suggestion_type TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_module TEXT NOT NULL,
  action_params JSONB DEFAULT '{}',
  title TEXT NOT NULL,
  description TEXT,
  reasoning TEXT,
  confidence DECIMAL(3,2) NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 4. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  source_module TEXT,
  related_entity_type TEXT,
  related_entity_id UUID,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'],
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'pending',
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'pending';
CREATE INDEX idx_links_source ON entity_links(source_type, source_id);
CREATE INDEX idx_links_target ON entity_links(target_type, target_id);
CREATE INDEX idx_suggestions_user ON suggestions(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
```

### RLS Policies

```sql
-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Entity Links
ALTER TABLE entity_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own links" ON entity_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own links" ON entity_links FOR ALL USING (auth.uid() = user_id);

-- Suggestions
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own suggestions" ON suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own suggestions" ON suggestions FOR UPDATE USING (auth.uid() = user_id);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
```

---

## Tasks

- [ ] Criar migration file `supabase/migrations/001_connection_layer.sql`
- [ ] Implementar tabela `events`
- [ ] Implementar tabela `entity_links`
- [ ] Implementar tabela `suggestions`
- [ ] Implementar tabela `notifications`
- [ ] Adicionar indexes
- [ ] Adicionar RLS policies
- [ ] Testar migration localmente
- [ ] Aplicar migration no Supabase
- [ ] Verificar tabelas no dashboard

---

## Definition of Done

- [ ] Migration aplicada sem erros
- [ ] Todas as 4 tabelas visíveis no Supabase
- [ ] RLS funcionando (testar com 2 users)
- [ ] Documentação atualizada
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/
└── migrations/
    └── 001_connection_layer.sql    [CREATE]
```

---

## Referências

- [PRD Connection Layer](../../00_Core/PRD-Connection-Layer-v5.0.md)
- [Database Schema](../../supabase/docs/SCHEMA.md)

---

**Story criada pelo Brownfield Discovery Workflow**
**Data:** 2026-01-26
