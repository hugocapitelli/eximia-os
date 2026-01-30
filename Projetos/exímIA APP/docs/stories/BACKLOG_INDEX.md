# ExímIA APP — Backlog Completo

**Atualizado:** 2026-01-30
**Total de Stories:** 44
**Estimativa Total:** ~355 pontos (~60-70 dias de dev)

---

## NEW STORIES (2026-01-30)

Created by River (SM) based on backend architecture by Aria (Architect) and validation by Dara (Data Engineer):

### CRITICAL (Bloqueantes)
| ID | Story | Pts | Sprint | Purpose |
|----|-------|-----|--------|---------|
| **035** | Profiles & User Streaks | 3 | 3 | Fix missing tables for RLS and functions |
| **036** | RLS Fixes Academy | 2 | 4 | Add missing author write policies |
| **038** | Supabase Client Setup | 3 | 3 | Required for all Server Actions |

### HIGH (Backend APIs)
| ID | Story | Pts | Sprint | Purpose |
|----|-------|-----|--------|---------|
| **037** | Updated_at Triggers | 1 | 4 | Consistency for all tables |
| **039** | Journey Server Actions | 8 | 4 | Goals, Habits, Key Results CRUD |
| **040** | Books Server Actions | 8 | 5 | Library module complete API |
| **041** | Academy Server Actions | 13 | 5 | Courses, Enrollments, Progress API |
| **042** | Socratic Chat Backend | 13 | 6 | Claude integration for AI tutoring |
| **044** | Storage Buckets | 3 | 4 | File upload infrastructure |

### MEDIUM (Integration)
| ID | Story | Pts | Sprint | Purpose |
|----|-------|-----|--------|---------|
| **043** | Event System | 8 | 7 | Connection Layer foundation |

### Dependency Chain
```
009 → 035 → 036 → 041 → 042
009 → 038 → 039, 040, 041
009 → 044
011 → 037, 039
015 → 036, 037, 041
```

---

## Visão Geral por Sprint

| Sprint | Foco | Stories | Pontos | Status |
|--------|------|---------|--------|--------|
| **Sprint 1** | Foundation | 001-003 | 21 | 🟡 Em progresso |
| **Sprint 2** | Design System | 004-008 | 55 | ⏳ Pendente |
| **Sprint 3** | Backend/Auth | 009-011 | 18 | ⏳ Pendente |
| **Sprint 4** | Journey + Academy | 012-016 | 47 | ⏳ Pendente |
| **Sprint 5** | UX Polish | 017-018 | 16 | ⏳ Pendente |
| **Sprint 6** | Journey Extended | 019-021 | 26 | ⏳ Pendente |
| **Sprint 7** | Academy Extended | 022-025 | 42 | ⏳ Pendente |
| **Sprint 8** | Strategy Foundation | 026-027 | 16 | ⏳ Pendente |
| **Sprint 9** | Strategy OKRs | 028-029 | 21 | ⏳ Pendente |
| **Sprint 10** | Strategy Complete | 030-031 | 21 | ⏳ Pendente |
| **Sprint 11** | Finance Module | 032 | 21 | ⏳ Pendente |
| **Sprint 12** | Brand + Minds | 033-034 | 34 | ⏳ Pendente |

---

## Sprint 1: Foundation (21 pontos)

> **Objetivo:** Estabelecer infraestrutura básica de backend e design tokens.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 001 | Database Schema - Connection Layer | 8 | ⏳ | - |
| 002 | Implementar Design Tokens | 5 | ⏳ | - |
| 003 | Criar Atoms Base (Button, Input, Badge, Spinner) | 8 | ⏳ | 002 |

---

## Sprint 2: Design System (55 pontos)

> **Objetivo:** Completar toda a biblioteca de componentes + Design Systems Library funcional.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 004 | Atoms Estendidos (Icon, Avatar, Typography, etc.) | 8 | ⏳ | 003 |
| 005 | Molecules Core (FormField, MetricCard, NavItem, etc.) | 13 | ⏳ | 004 |
| 006 | Organisms Essenciais (Sidebar, Header, GoalCard, etc.) | 13 | ⏳ | 005 |
| 007 | Templates e Layouts | 8 | ⏳ | 006 |
| 008 | Design Systems Library Funcional | 13 | ⏳ | 007 |

---

## Sprint 3: Backend & Auth (18 pontos)

> **Objetivo:** Supabase configurado + Auth funcionando + Journey schema.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 009 | Supabase Project Setup | 5 | ⏳ | - |
| 010 | Authentication Pages (Login, Register, Forgot) | 8 | ⏳ | 009, 007 |
| 011 | Journey Module Database Schema | 5 | ⏳ | 001, 009 |

---

## Sprint 4: Core Modules (47 pontos)

> **Objetivo:** Journey e Academy funcionando end-to-end.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 012 | Journey Module API | 8 | ⏳ | 011 |
| 013 | Journey Module UI Integration | 13 | ⏳ | 012, 006 |
| 014 | Inbox Module | 8 | ⏳ | 001 |
| 015 | Academy Module Database Schema | 5 | ⏳ | 009 |
| 016 | Academy API & UI Integration | 13 | ⏳ | 015 |

---

## Sprint 5: UX Polish (16 pontos)

> **Objetivo:** Settings e Onboarding para completar a experiência.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 017 | Settings Pages | 8 | ⏳ | 010, 007 |
| 018 | Onboarding Flow | 8 | ⏳ | 010, 007 |

---

## Sprint 6: Journey Extended (26 pontos)

> **Objetivo:** Completar módulo Journey com Livros, Autores e Calendário.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 019 | Journey Books Library | 8 | ⏳ | 013 |
| 020 | Journey Authors | 5 | ⏳ | 019 |
| 021 | Journey Calendar | 13 | ⏳ | 013 |

---

## Sprint 7: Academy Extended (42 pontos)

> **Objetivo:** Completar módulo Academy com Cursos, Socratic, Skill Tree e Progress.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 022 | Academy Courses | 13 | ⏳ | 016 |
| 023 | Academy Socratic Sessions | 13 | ⏳ | 016 |
| 024 | Academy Skill Tree | 8 | ⏳ | 022 |
| 025 | Academy Progress & Certificates | 8 | ⏳ | 022 |

---

## Sprint 8: Strategy Foundation (16 pontos)

> **Objetivo:** Database schema e dashboard para Strategy.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 026 | Strategy Module Schema | 8 | ⏳ | 009 |
| 027 | Strategy Dashboard | 8 | ⏳ | 026 |

---

## Sprint 9: Strategy OKRs (21 pontos)

> **Objetivo:** Ciclos, OKRs e Iniciativas estratégicas.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 028 | Strategy Cycles & OKRs | 13 | ⏳ | 026 |
| 029 | Strategy Initiatives | 8 | ⏳ | 028 |

---

## Sprint 10: Strategy Complete (21 pontos)

> **Objetivo:** KPIs e Roadmap para completar Strategy.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 030 | Strategy KPIs Dashboard | 8 | ⏳ | 026 |
| 031 | Strategy Roadmap | 13 | ⏳ | 029 |

---

## Sprint 11: Finance Module (21 pontos)

> **Objetivo:** Módulo financeiro completo.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 032 | Finance Module (Full) | 21 | ⏳ | 009 |

---

## Sprint 12: Brand + Minds (34 pontos)

> **Objetivo:** Módulos de Marca e AI Minds.

| ID | Story | Pontos | Status | Dependências |
|----|-------|--------|--------|--------------|
| 033 | Brand Module | 13 | ⏳ | 009 |
| 034 | Minds Module (AI Clones) | 21 | ⏳ | 009 |

---

## Dependências Visuais

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEPENDENCY GRAPH                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SPRINT 1 (Foundation)                                                  │
│  ┌─────────┐    ┌─────────┐                                             │
│  │   001   │    │   002   │                                             │
│  │ DB Conn │    │ Tokens  │                                             │
│  └────┬────┘    └────┬────┘                                             │
│       │              │                                                  │
│       │              ▼                                                  │
│       │         ┌─────────┐                                             │
│       │         │   003   │                                             │
│       │         │  Atoms  │                                             │
│       │         └────┬────┘                                             │
│       │              │                                                  │
│  SPRINT 2 (Design System)                                               │
│       │              ▼                                                  │
│       │         ┌─────────┐                                             │
│       │         │   004   │                                             │
│       │         │  Atoms+ │                                             │
│       │         └────┬────┘                                             │
│       │              ▼                                                  │
│       │         ┌─────────┐                                             │
│       │         │   005   │                                             │
│       │         │Molecules│                                             │
│       │         └────┬────┘                                             │
│       │              ▼                                                  │
│       │         ┌─────────┐                                             │
│       │         │   006   │                                             │
│       │         │Organisms│                                             │
│       │         └────┬────┘                                             │
│       │              ▼                                                  │
│       │         ┌─────────┐                                             │
│       │         │   007   │                                             │
│       │         │Templates│                                             │
│       │         └────┬────┘                                             │
│       │              │                                                  │
│       │              ├──────────────────┐                               │
│       │              │                  │                               │
│       │              ▼                  ▼                               │
│       │         ┌─────────┐       ┌─────────┐                           │
│       │         │   008   │       │   010   │ ◄─── 009 (Supabase)       │
│       │         │ DS Lib  │       │  Auth   │                           │
│       │         └─────────┘       └────┬────┘                           │
│       │                                │                                │
│       │                                ├──────────────────┐             │
│       │                                │                  │             │
│  SPRINT 3/4                            ▼                  ▼             │
│       │                           ┌─────────┐       ┌─────────┐         │
│       │                           │   017   │       │   018   │         │
│       │                           │Settings │       │Onboard  │         │
│       │                           └─────────┘       └─────────┘         │
│       │                                                                 │
│       └───────────────────┬─────────────────────────────┐               │
│                           │                             │               │
│                           ▼                             ▼               │
│  SPRINT 3            ┌─────────┐                   ┌─────────┐          │
│                      │   011   │                   │   014   │          │
│                      │ Journey │                   │  Inbox  │          │
│                      │ Schema  │                   └─────────┘          │
│                      └────┬────┘                                        │
│                           │                                             │
│  SPRINT 4                 ▼                                             │
│                      ┌─────────┐                                        │
│                      │   012   │                                        │
│                      │  J API  │                                        │
│                      └────┬────┘                                        │
│                           │                                             │
│                           ▼                                             │
│                      ┌─────────┐                                        │
│                      │   013   │                                        │
│                      │  J UI   │                                        │
│                      └─────────┘                                        │
│                                                                         │
│  ACADEMY TRACK                                                          │
│  009 ──► 015 ──► 016                                                    │
│         (Schema)  (API+UI)                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Épicos

### EXIMIA-EPIC-001: Technical Debt Resolution
- 001, 002, 003

### EXIMIA-EPIC-002: Design System Foundation
- 004, 005, 006, 007, 008

### EXIMIA-EPIC-003: Backend Infrastructure
- 009, 010, 011

### EXIMIA-EPIC-004: Journey Module
- 012, 013, 019, 020, 021

### EXIMIA-EPIC-005: Connection Layer Features
- 014

### EXIMIA-EPIC-006: Academy Module
- 015, 016, 022, 023, 024, 025

### EXIMIA-EPIC-007: User Experience
- 017, 018

### EXIMIA-EPIC-008: Strategy Module
- 026, 027, 028, 029, 030, 031

### EXIMIA-EPIC-009: Finance Module
- 032

### EXIMIA-EPIC-010: Brand Module
- 033

### EXIMIA-EPIC-011: Minds Module
- 034

---

## Priorização MoSCoW

### Must Have (MVP)
- 001-013: Design System + Auth + Journey funcionando
- Total: ~95 pontos

### Should Have (Beta)
- 014: Inbox
- 015-016: Academy
- Total: ~26 pontos

### Could Have (v1.0)
- 017: Settings
- 018: Onboarding
- Total: ~16 pontos

### Could Have (v1.5)
- 026-031: Strategy Module
- 032: Finance Module
- 033: Brand Module
- 034: Minds Module
- Total: ~138 pontos

### Won't Have (Backlog Futuro)
- PrototypOS Module
- Team Module
- Sales/CRM Module
- AI Playground Extensions

---

## Métricas de Velocidade

| Sprint | Planejado | Completado | Velocidade |
|--------|-----------|------------|------------|
| 1 | 21 pts | TBD | TBD |
| 2 | 55 pts | TBD | TBD |
| 3 | 18 pts | TBD | TBD |
| 4 | 47 pts | TBD | TBD |
| 5 | 16 pts | TBD | TBD |
| 6 | 26 pts | TBD | TBD |
| 7 | 42 pts | TBD | TBD |
| 8 | 16 pts | TBD | TBD |
| 9 | 21 pts | TBD | TBD |
| 10 | 21 pts | TBD | TBD |
| 11 | 21 pts | TBD | TBD |
| 12 | 34 pts | TBD | TBD |

---

## Como usar este backlog

1. **Início do Sprint:** Revisar stories do sprint
2. **Durante o Sprint:** Usar `*draft` para criar stories adicionais se necessário
3. **Daily:** Atualizar status das stories
4. **Fim do Sprint:** Calcular velocidade e ajustar próximo sprint

---

## Desenvolvimento Paralelo

Para acelerar o desenvolvimento com múltiplas instâncias do Claude Code:

| Documento | Descrição |
|-----------|-----------|
| [PARALLEL_DEVELOPMENT_GUIDE.md](../PARALLEL_DEVELOPMENT_GUIDE.md) | Guia completo de tracks, fases e dependências |
| [INSTANCE_QUICKSTART.md](../INSTANCE_QUICKSTART.md) | Blocos prontos para copiar/colar em cada instância |

### Resumo de Capacidade

| Modo | Instâncias | Tempo Estimado |
|------|-----------|----------------|
| Sequencial | 1 | ~30-35 dias |
| **Paralelo** | 3-4 | **~12-15 dias** |

---

**Gerado por River (SM) — 🌊 Removendo obstáculos**
