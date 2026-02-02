# EPIC: Technical Debt Resolution - exímIA APP

**Epic ID:** EXIMIA-EPIC-001
**Título:** Resolução de Débito Técnico - Fundação MVP
**Data:** 2026-01-26
**Owner:** @pm (via @architect)
**Status:** Planning

---

## Sumário Executivo

Este Epic agrupa todas as Stories necessárias para resolver os débitos técnicos identificados no Brownfield Discovery e estabelecer a fundação do MVP do exímIA APP.

### Contexto

O Brownfield Discovery (Fases 1-3) identificou:
- **88% de gap** entre especificação e implementação
- **35+ tabelas** de database não criadas
- **50+ componentes** de Design System não implementados
- **Connection Layer** (core do produto) não existe

### Objetivo

Implementar a fundação técnica necessária para o MVP:
1. Database schema completo
2. Design System funcional
3. Connection Layer básico
4. Primeiro módulo completo (Journey)

---

## Métricas de Sucesso

| Métrica | Atual | Target | Prazo |
|---------|-------|--------|-------|
| Tabelas implementadas | 0 | 20 | 4 semanas |
| Componentes DS | 1 | 25 | 6 semanas |
| Event Bus funcional | Não | Sim | 3 semanas |
| Módulo Journey | 0% | 80% | 8 semanas |

---

## Stories Incluídas

### Sprint 1: Fundação (Semanas 1-2)

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| EXIMIA-001 | Implementar Database Schema - Connection Layer | 8 | P0 |
| EXIMIA-002 | Implementar Design Tokens | 5 | P0 |
| EXIMIA-003 | Criar Atoms Base (Button, Input, Badge) | 8 | P0 |

### Sprint 2: Connection Layer (Semanas 3-4)

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| EXIMIA-004 | Implementar Event Bus API | 8 | P0 |
| EXIMIA-005 | Implementar Entity Links | 5 | P0 |
| EXIMIA-006 | Criar Molecules Base (FormField, Card, NavItem) | 8 | P1 |

### Sprint 3: Navigation & Layout (Semanas 5-6)

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| EXIMIA-007 | Implementar Database Schema - Journey | 5 | P1 |
| EXIMIA-008 | Criar Sidebar Organism | 8 | P1 |
| EXIMIA-009 | Criar Header Organism | 5 | P1 |
| EXIMIA-010 | Implementar DashboardLayout Template | 5 | P1 |

### Sprint 4: Journey Module (Semanas 7-8)

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| EXIMIA-011 | Implementar Goals CRUD | 8 | P1 |
| EXIMIA-012 | Implementar Habits CRUD | 8 | P1 |
| EXIMIA-013 | Criar GoalCard Organism | 5 | P1 |
| EXIMIA-014 | Criar HabitTracker Organism | 5 | P1 |

### Backlog (Sprints Futuros)

| ID | Story | Pontos | Prioridade |
|----|-------|--------|------------|
| EXIMIA-015 | Implementar Suggestion Engine | 13 | P2 |
| EXIMIA-016 | Implementar Inbox Module | 8 | P2 |
| EXIMIA-017 | Configurar PWA | 5 | P2 |
| EXIMIA-018 | Implementar Academy Schema | 5 | P2 |
| EXIMIA-019 | Implementar Strategy Schema | 5 | P2 |

---

## Dependências entre Stories

```
EXIMIA-001 (DB Connection Layer)
    │
    ├──▶ EXIMIA-004 (Event Bus API)
    │        │
    │        └──▶ EXIMIA-015 (Suggestion Engine)
    │
    └──▶ EXIMIA-005 (Entity Links)

EXIMIA-002 (Design Tokens)
    │
    └──▶ EXIMIA-003 (Atoms)
             │
             └──▶ EXIMIA-006 (Molecules)
                      │
                      ├──▶ EXIMIA-008 (Sidebar)
                      │
                      └──▶ EXIMIA-009 (Header)
                               │
                               └──▶ EXIMIA-010 (DashboardLayout)

EXIMIA-007 (DB Journey)
    │
    ├──▶ EXIMIA-011 (Goals CRUD)
    │        │
    │        └──▶ EXIMIA-013 (GoalCard)
    │
    └──▶ EXIMIA-012 (Habits CRUD)
             │
             └──▶ EXIMIA-014 (HabitTracker)
```

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Schema complexo demais | Média | Alto | Implementar incrementalmente |
| Design System demora | Alta | Médio | Usar Tailwind classes primeiro |
| Connection Layer complexo | Alta | Alto | Começar com Event Bus simples |
| Integração Supabase | Baixa | Médio | Usar patterns existentes |

---

## Definition of Done (Epic)

- [ ] Database schema Connection Layer implementado
- [ ] Database schema Journey implementado
- [ ] Design Tokens configurados
- [ ] 15+ componentes do Design System
- [ ] Event Bus funcional
- [ ] Entity Links funcional
- [ ] Sidebar e Header implementados
- [ ] Goals CRUD completo
- [ ] Habits CRUD completo
- [ ] RLS policies em todas as tabelas
- [ ] Testes básicos passando

---

## Estimativas

| Área | Stories | Pontos | Horas (~2h/ponto) |
|------|---------|--------|-------------------|
| Database | 3 | 18 | 36h |
| Design System | 6 | 39 | 78h |
| Connection Layer | 3 | 21 | 42h |
| Journey Module | 4 | 26 | 52h |
| **Total Sprint 1-4** | **16** | **104** | **~208h** |

**Timeline:** 8 semanas (2 meses) com 1 desenvolvedor full-time

---

## Referências

- [System Architecture](../architecture/system-architecture.md)
- [Database Schema](../../supabase/docs/SCHEMA.md)
- [Database Audit](../../supabase/docs/DB-AUDIT.md)
- [Frontend Spec](../frontend/frontend-spec.md)
- [PRD Connection Layer](../../00_Core/PRD-Connection-Layer-v5.0.md)
- [PRD Design System](../../00_Core/PRD-Design-System-v5.0.md)

---

**Epic criado pelo Brownfield Discovery Workflow**
**Data:** 2026-01-26
