# CHECKPOINT: BLOCO 1.1 - Connection Layer: Schema
**Criado:** 26 Janeiro 2026
**Atualizado:** 27 Janeiro 2026
**Status:** `DONE`

---

## Informações do Bloco

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Connection-Layer-v5.0.md` |
| **Dependências** | FASE 0 completa |
| **Instância Atual** | CLAUDE_2026-01-26_03 |

---

## Checklist de Escopo

### 1. Modelagem do Banco

#### Tabela: events (Event Bus)
- [x] Criar tabela `events`
- [x] Campos: id, type, source_module, entity_type, entity_id, data (jsonb)
- [x] Campos: user_id, workspace_id, correlation_id
- [x] Campos: timestamp, processed_at, status
- [x] Índices para busca eficiente

#### Tabela: entity_links (Conexões Bidirecionais)
- [x] Criar tabela `entity_links`
- [x] Campos: source_module, source_type, source_id
- [x] Campos: target_module, target_type, target_id
- [x] Campos: link_type, relationship, strength, bidirectional
- [x] Campos: created_by, created_reason
- [x] Índices compostos para navegação

#### Tabela: suggestions (IA Proativa)
- [x] Criar tabela `suggestions`
- [x] Campos: trigger_event_id, trigger_entity (jsonb)
- [x] Campos: suggestion_type, action (jsonb), title, description, reasoning
- [x] Campos: confidence, prefilled_data (jsonb)
- [x] Campos: target_module, target_route
- [x] Campos: priority, display_type, status
- [x] Campos: expires_at, snooze_until

#### Tabela: notifications
- [x] Criar tabela `notifications`
- [x] Campos: type, title, body, icon
- [x] Campos: action_url, action_label, actions (jsonb)
- [x] Campos: source_module, related_entity (jsonb)
- [x] Campos: channels (array), priority, status
- [x] Campos: scheduled_for, sent_at, read_at, actioned_at

#### Tabela: inbox_items (Entrada Universal)
- [x] Criar tabela `inbox_items`
- [x] Campos: content, content_type, attachments (jsonb)
- [x] Campos: source, source_metadata (jsonb)
- [x] Campos: ai_analysis (jsonb)
- [x] Campos: status, converted_to (jsonb)

### 2. Migrations Supabase
- [x] Criar arquivo SQL de migration
- [x] Executar migration no Supabase
- [x] Verificar tabelas criadas

### 3. RLS Policies
- [x] RLS para events (user pode ver apenas seus eventos)
- [x] RLS para entity_links (user pode ver/criar links de suas entidades)
- [x] RLS para suggestions (user pode ver apenas suas sugestões)
- [x] RLS para notifications (user pode ver apenas suas notificações)
- [x] RLS para inbox_items (user pode ver apenas seus items)

### 4. Tipos TypeScript
- [x] Criar types para Event
- [x] Criar types para EntityLink
- [x] Criar types para Suggestion
- [x] Criar types para Notification
- [x] Criar types para InboxItem
- [x] Criar enums para ModuleType, EntityType
- [x] Exportar de `@/types/connection-layer`

### 5. Seed Data
- [x] Criar script de seed
- [x] Dados de teste para desenvolvimento (helper function criada)

**Progresso:** 29/29 (100%)

---

## Estado Atual

### Última Ação Realizada
```
- Migration SQL criada: supabase/migrations/001_connection_layer.sql
- Tipos TypeScript criados: app/src/types/connection-layer.ts
- Todas as tabelas, indexes, RLS policies e helper functions definidas
```

### Próxima Ação Pendente
```
BLOCO CONCLUÍDO!
- Seed script criado em supabase/seed/001_connection_layer_seed.sql
- Helper function create_test_connection_data() para criar dados de teste
```

---

## Schema de Referência (do PRD)

### Event
```typescript
interface SystemEvent {
  id: string;
  type: string;              // "goal.created", "habit.completed", etc.
  source_module: ModuleType;
  entity_type: EntityType;
  entity_id: string;
  data: Record<string, any>;
  user_id: string;
  workspace_id?: string;
  correlation_id?: string;
  timestamp: Date;
  processed_at?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
```

### EntityLink
```typescript
interface EntityLink {
  id: string;
  source_module: ModuleType;
  source_type: EntityType;
  source_id: string;
  target_module: ModuleType;
  target_type: EntityType;
  target_id: string;
  link_type: 'cascaded' | 'suggested' | 'manual' | 'derived';
  relationship: string;
  strength: number;
  bidirectional: boolean;
  created_by: 'system' | 'user' | 'ai';
  created_reason?: string;
  created_at: Date;
  last_accessed_at?: Date;
}
```

---

## Blockers (se houver)

| Blocker | Descrição | Ação Necessária |
|---------|-----------|-----------------|
| - | Nenhum | - |

---

## Critério de Done

- [x] Tabelas criadas no Supabase
- [x] RLS funcionando
- [x] Tipos disponíveis no frontend
- [x] Seed data inserido

---

## Histórico de Sessões

| Data | Instância | Ações | Resultado |
|------|-----------|-------|-----------|
| 26/01/2026 | CLAUDE_2026-01-26_03 | Checkpoint criado | Iniciando |

---

*Última atualização: 26 Janeiro 2026*
