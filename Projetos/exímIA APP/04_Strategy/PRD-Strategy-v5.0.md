# PRD — Strategy (StratOS)
**Módulo:** 04_Strategy
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Especificação Completa

---

## Sumário Executivo

O módulo **Strategy** (StratOS) é o sistema de planejamento e execução estratégica que cascateia para todos os módulos do ExímIA OS.

**Propósito:** Transformar visão de longo prazo em iniciativas executáveis que se desdobram automaticamente em metas (Journey), conteúdo educacional (Academy) e identidade de marca (Brand).

**Diferencial:** Não é mais um quadro Kanban — é um sistema que conecta estratégia à execução através do cascateamento automático.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Features](#2-features)
3. [Modelos de Dados](#3-modelos-de-dados)
4. [Conexões com Connection Layer](#4-conexões-com-connection-layer)
5. [Fluxos de Usuário](#5-fluxos-de-usuário)
6. [API Endpoints](#6-api-endpoints)
7. [Métricas de Sucesso](#7-métricas-de-sucesso)

---

# 1. Visão Geral

## 1.1 O Problema

A maioria dos empreendedores tem:
- Planos estratégicos lindos que morrem no PowerPoint
- Iniciativas que não viram execução
- Gap gigante entre "o que queremos" e "o que fazemos"

## 1.2 A Solução: Cascateamento Automático

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRATEGY CASCADING                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Strategic Cycle (Annual/Quarterly)                             │
│         ↓                                                       │
│  Initiative "Lançar MVP do Produto X"                           │
│         ↓ [cascade automático]                                  │
│  Journey Goal "Lançar MVP" (auto-criado)                        │
│         ↓ [sugestão IA]                                         │
│  Academy Course "Product Management" (sugerido)                 │
│         ↓ [link bidirecional]                                   │
│  Brand Voice aplicado ao PRD (contexto)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 2. Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Organizations** | Gestão de múltiplas organizações/projetos | `/strategy/organizations` |
| **Cycle Hub** | Dashboard de ciclos estratégicos ativos | `/strategy` |
| **The Forge** | Ideação e refinamento de iniciativas | `/strategy/forge/:cycleId` |
| **War Room** | Coordenação de execução em tempo real | `/strategy/war-room/:cycleId` |
| **Execution Hub** | Tracking de progresso e KPIs | `/strategy/execution/:cycleId` |
| **Hoshin Kanri** | Planejamento estratégico visual | `/strategy/hoshin-kanri` |

## 2.1 The Forge (Ideação)

Espaço para criar e refinar iniciativas antes de commitar.

**Features:**
- Brainstorm de iniciativas
- RICE prioritization
- Impact/Effort matrix
- Dependency mapping

## 2.2 War Room (Coordenação)

Dashboard em tempo real mostrando status de todas iniciativas.

**Features:**
- Kanban board de iniciativas
- Health indicators (on track, attention, critical)
- Blockers e dependencies
- Quick actions

## 2.3 Execution Hub (Métricas)

Tracking detalhado de KPIs e progresso.

**Features:**
- KPI dashboard por iniciativa
- Burn-up/burn-down charts
- Velocity tracking
- Forecast de completion

---

# 3. Modelos de Dados

## 3.1 StrategicCycle

```typescript
interface StrategicCycle {
  id: string;
  organization_id: string;

  // Info
  title: string;
  type: 'annual' | 'quarterly' | 'monthly';
  period: string;  // "Q1 2026"

  // Status
  status: 'draft' | 'active' | 'review' | 'archived';
  progress: number;  // 0-100
  health: 'on_track' | 'attention' | 'critical';

  // Conteúdo
  vision?: string;
  objectives: Initiative[];

  // Datas
  start_date: Date;
  end_date: Date;

  created_at: Date;
  updated_at: Date;
}
```

## 3.2 Initiative

```typescript
interface Initiative {
  id: string;
  cycle_id: string;

  // Identificação
  code: string;  // "EXIMIA-2026-001"
  title: string;
  description?: string;

  // Classificação
  type: 'strategic' | 'tactical' | 'operational';
  priority: 'must_have' | 'should_have' | 'nice_to_have';

  // Responsabilidade
  owner: string;
  team: string[];

  // Status
  status: 'not_planned' | 'planned' | 'in_progress' | 'on_track' | 'attention' | 'critical' | 'completed';
  progress: number;  // 0-100

  // Tempo
  start_date?: Date;
  end_date?: Date;

  // Métricas
  kpis: KPI[];

  // Cascateamento (Connection Layer)
  cascaded_goals: string[]; // Goals em Journey derivados desta initiative

  // Hierarquia
  parent_id?: string;  // Para sub-initiatives

  created_at: Date;
  updated_at: Date;
}
```

## 3.3 KPI

```typescript
interface KPI {
  id: string;
  initiative_id: string;

  name: string;
  target: number;
  current: number;
  unit: string;  // "users", "%", "R$"

  // Tracking
  history: KPISnapshot[];

  created_at: Date;
}

interface KPISnapshot {
  value: number;
  date: Date;
}
```

---

# 4. Conexões com Connection Layer

## 4.1 Eventos Emitidos

| Evento | Trigger | Data | Consumidores |
|--------|---------|------|--------------|
| `initiative.created` | Nova iniciativa | `{initiative_id, title, owner}` | Journey, Notifications |
| `initiative.updated` | Status/progresso muda | `{initiative_id, progress, status}` | Journey (atualiza Goals cascateados) |
| `initiative.completed` | Iniciativa finalizada | `{initiative_id}` | Journey, Notifications |
| `cycle.started` | Novo ciclo inicia | `{cycle_id, period}` | Todos módulos |
| `kpi.milestone` | KPI atinge target | `{kpi_name, value}` | Notifications |

## 4.2 Cascateamento Automático

Quando uma Initiative é criada:
1. Event Bus publica `initiative.created`
2. Suggestion Engine analisa título/descrição
3. Gera sugestão para criar Goal em Journey
4. Se aceito, Goal é criado automaticamente com:
   - Title (herdado)
   - Deadline (herdado)
   - Linked initiative (bidirecional)

---

# 5. Fluxos de Usuário

## 5.1 Criar Initiative e Cascatear para Journey

```
1. User cria Initiative "Lançar MVP" em Strategy
2. Define deadline: 31/03/2026
3. Salva initiative
4. Connection Layer detecta initiative.created
5. Suggestion Engine gera:
   "💡 Criar meta em Journey para 'Lançar MVP'?"
6. User aceita
7. Goal criado automaticamente em Journey:
   - Title: "Lançar MVP"
   - Deadline: 31/03/2026
   - Linked initiative: [init-123]
   - Status: in_progress
8. Entity Link criado bidirecionalmente
9. Progresso em Goal impacta progresso da Initiative
```

## 5.2 Atualizar KPI e Disparar Notificação

```
1. User atualiza KPI "MRR" de R$10k para R$20k
2. Sistema detecta que target (R$25k) foi alcançado em 80%
3. Event Bus publica kpi.milestone
4. Notifications system cria notificação:
   "🎉 MRR chegou a 80% do target"
5. User recebe push notification
```

---

# 6. API Endpoints

```
# Organizations
GET/POST   /api/strategy/organizations
PUT/DELETE /api/strategy/organizations/:id

# Cycles
GET/POST   /api/strategy/cycles
GET/PUT    /api/strategy/cycles/:id
DELETE     /api/strategy/cycles/:id

# Initiatives
GET/POST   /api/strategy/initiatives
GET/PUT    /api/strategy/initiatives/:id
DELETE     /api/strategy/initiatives/:id
PATCH      /api/strategy/initiatives/:id/status
PATCH      /api/strategy/initiatives/:id/progress

# KPIs
POST       /api/strategy/kpis
PATCH      /api/strategy/kpis/:id/update
GET        /api/strategy/kpis/:id/history
```

---

# 7. Métricas de Sucesso

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Initiative Progress** | Avg progress de iniciativas ativas | > 65% |
| **Cascade Adoption** | Initiatives com Goals linkados | > 80% |
| **Cycle Completion** | Ciclos finalizados no prazo | > 70% |
| **KPI Achievement** | KPIs que atingem target | > 60% |

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **5.0** | 25/01/2026 | Modularização do PRD original. Foco em cascateamento. |

---

*Strategy v5.0 — Da Visão à Execução*
*ExímIA OS — 2026*
