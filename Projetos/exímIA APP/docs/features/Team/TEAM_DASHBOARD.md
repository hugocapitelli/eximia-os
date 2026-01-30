# Team Dashboard - Central de Comando do Time

## Feature Specification

**Módulo:** EQUIPE & CULTURA → Dashboard
**Status:** Planejamento Detalhado
**Prioridade:** P3
**Owner:** Product Team

---

## Visão Geral

O Team Dashboard é a **central de comando de pessoas** do ExímIA OS. Uma visão unificada da saúde organizacional — quem somos, como estamos, para onde vamos. Tudo que um líder precisa saber sobre seu time em uma única tela.

### Problema que Resolve

> "Não sei como meu time está. Preciso abrir 5 ferramentas diferentes para ter uma visão geral."

**Antes:** Informações espalhadas → Decisões cegas → Problemas não detectados
**Depois:** Dashboard unificado → Visão clara → Ação proativa

---

## Layout do Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 👥 EQUIPE & CULTURA                                    [+ Ação rápida ▼]│
├─────────────────────────────────────────────────────────────────────────┤
│ [Dashboard] [Organograma] [Membros] [Hiring] [Onboarding] [Performance] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 VISÃO GERAL DO TIME                              Janeiro 2026│   │
│  │                                                                 │   │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│   │
│  │ │ 👥 12    │ │ ⏱️ 1.8y  │ │ 📈 +52   │ │ 🎯 2     │ │ 🚀 3     ││   │
│  │ │ Membros  │ │ Tenure   │ │ eNPS     │ │ Vagas    │ │Onboarding││   │
│  │ │ ativos   │ │ médio    │ │          │ │ abertas  │ │ ativos   ││   │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌────────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ 📸 TEAM SNAPSHOT               │ │ 🎯 HIRING PIPELINE           │   │
│  │                                │ │                              │   │
│  │ ┌────┬────┬────┬────┐         │ │ Product Manager              │   │
│  │ │👤  │👤  │👤  │👤  │         │ │ ████████████░░░░ 3 candidatos│   │
│  │ ├────┼────┼────┼────┤         │ │                              │   │
│  │ │👤  │👤  │👤  │👤  │         │ │ Dev Frontend                 │   │
│  │ ├────┼────┼────┼────┤         │ │ ██████░░░░░░░░░░ 1 candidato │   │
│  │ │👤  │👤  │👤  │👤  │         │ │                              │   │
│  │ └────┴────┴────┴────┘         │ │ [Ver pipeline completo →]    │   │
│  │                                │ │                              │   │
│  │ Por área:                      │ └──────────────────────────────┘   │
│  │ • Produto: 4  • Tech: 5       │                                     │
│  │ • Comercial: 2  • Ops: 1      │ ┌──────────────────────────────┐   │
│  │                                │ │ 🚀 ONBOARDINGS EM ANDAMENTO  │   │
│  │ [Ver organograma →]           │ │                              │   │
│  └────────────────────────────────┘ │ ┌────────────────────────┐  │   │
│                                     │ │ 👤 Maria Silva         │  │   │
│  ┌────────────────────────────────┐ │ │ Product Manager        │  │   │
│  │ 🎂 ANIVERSÁRIOS & DATAS        │ │ │ Dia 12 de 30 ████░░░░  │  │   │
│  │                                │ │ └────────────────────────┘  │   │
│  │ Esta semana:                   │ │ ┌────────────────────────┐  │   │
│  │ 🎂 João Pedro - 29/01 (Qui)   │ │ │ 👤 Carlos Souza        │  │   │
│  │ 🎉 Ana Clara - 2 anos - 31/01 │ │ │ Dev Frontend           │  │   │
│  │                                │ │ │ Dia 5 de 30 ██░░░░░░░  │  │   │
│  │ Próximo mês:                   │ │ └────────────────────────┘  │   │
│  │ 🎂 3 aniversários              │ │                              │   │
│  │ 🎉 2 aniversários de empresa   │ │ [Ver todos →]                │   │
│  │                                │ └──────────────────────────────┘   │
│  │ [Ver calendário →]            │                                     │
│  └────────────────────────────────┘                                     │
│                                                                         │
│  ┌────────────────────────────────┐ ┌──────────────────────────────┐   │
│  │ 🔔 RITUAIS DA SEMANA           │ │ 🌟 RECONHECIMENTOS RECENTES  │   │
│  │                                │ │                              │   │
│  │ Hoje - Segunda                 │ │ 👤 → 👤 "Excelente trabalho  │   │
│  │ • 09:00 Daily Standup (Tech)  │ │ João   Ana  no lançamento!"  │   │
│  │ • 14:00 1:1 com Maria         │ │ #ownership há 2 horas        │   │
│  │                                │ │                              │   │
│  │ Terça                          │ │ 👤 → 👤 "Ajuda incrível no   │   │
│  │ • 10:00 Sprint Planning       │ │ Ana   Pedro cliente X"       │   │
│  │ • 15:00 1:1 com Carlos        │ │ #colaboração há 5 horas      │   │
│  │                                │ │                              │   │
│  │ Quinta                         │ │ [Ver todos →] [+ Dar kudos]  │   │
│  │ • 17:00 All Hands             │ │                              │   │
│  │                                │ └──────────────────────────────┘   │
│  │ [Ver calendário completo →]   │                                     │
│  └────────────────────────────────┘                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚠️ ALERTAS E AÇÕES PENDENTES                                    │   │
│  │                                                                 │   │
│  │ 🔴 3 1:1s atrasados (mais de 2 semanas)                        │   │
│  │ 🟡 2 performance reviews pendentes                              │   │
│  │ 🟡 1 onboarding com task atrasada (Maria - Setup de acessos)   │   │
│  │ 🟢 Pulse survey desta semana: 89% respondido                    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Widgets do Dashboard

### 1. Métricas Principais (KPI Cards)

| Métrica | Descrição | Cálculo | Alerta |
|---------|-----------|---------|--------|
| **Membros ativos** | Headcount atual | COUNT(status=active) | - |
| **Tenure médio** | Tempo médio na empresa | AVG(today - start_date) | < 1 ano |
| **eNPS** | Employee Net Promoter Score | (Promoters - Detractors) / Total | < 30 |
| **Vagas abertas** | Posições em recrutamento | COUNT(jobs.status=open) | > 5 |
| **Onboardings** | Novos membros integrando | COUNT(onboarding.active) | - |
| **1:1 pendentes** | 1:1s atrasados | COUNT(overdue > 14 days) | > 0 |

### 2. Team Snapshot

```typescript
interface TeamSnapshot {
  total_members: number;
  by_area: {
    area: string;
    count: number;
    percentage: number;
  }[];
  by_location: {
    location: string;
    count: number;
  }[];
  by_tenure: {
    range: '< 6m' | '6m-1y' | '1-2y' | '2-5y' | '5y+';
    count: number;
  }[];
  recent_changes: {
    joined_last_30d: number;
    left_last_30d: number;
    net_change: number;
  };
}
```

**Visualização:**
- Grid de avatares (hover mostra nome/cargo)
- Breakdown por área com cores
- Indicador de crescimento/redução

### 3. Hiring Pipeline Mini

```
Product Manager    ████████████░░░░ 3/5 stages
                   └─ João (entrevista técnica)
                   └─ Maria (case)
                   └─ Pedro (proposta)

Dev Frontend       ██████░░░░░░░░░░ 1/5 stages
                   └─ Ana (triagem)
```

### 4. Onboarding Tracker

```
┌─────────────────────────────────────────┐
│ 👤 Maria Silva                          │
│ Product Manager • Início: 15/01         │
│                                         │
│ Progresso: ████████░░░░░░░░ 40%        │
│ Dia 12 de 30 • 8 tasks pendentes       │
│                                         │
│ Próxima task: Setup Figma (atrasada!)  │
│                                         │
│ Buddy: João Pedro                       │
└─────────────────────────────────────────┘
```

### 5. Calendário de Celebrações

| Tipo | Ícone | Descrição |
|------|-------|-----------|
| **Aniversário** | 🎂 | Data de nascimento |
| **Work Anniversary** | 🎉 | Aniversário na empresa |
| **Promoção** | 🚀 | Data da promoção |
| **Milestone** | ⭐ | Marcos especiais |

### 6. Rituais da Semana

```typescript
interface RitualWidget {
  today: Ritual[];
  this_week: {
    day: string;
    rituals: Ritual[];
  }[];
  overdue: Ritual[];  // 1:1s atrasados, etc.
}

interface Ritual {
  id: string;
  type: 'daily' | '1:1' | 'sprint' | 'all_hands' | 'review';
  title: string;
  time: string;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'overdue';
}
```

### 7. Reconhecimentos Recentes

```
Feed de kudos:
├── 👤 João → 👤 Ana
│   "Excelente trabalho no lançamento!"
│   #ownership • há 2 horas • 5 ❤️
│
├── 👤 Ana → 👤 Pedro
│   "Ajuda incrível com o cliente X"
│   #colaboração • há 5 horas • 3 ❤️
│
└── [+ Dar kudos]
```

### 8. Alertas e Ações

| Nível | Cor | Exemplos |
|-------|-----|----------|
| 🔴 Crítico | Vermelho | 1:1 > 3 semanas, Review vencido |
| 🟡 Atenção | Amarelo | 1:1 > 2 semanas, Task atrasada |
| 🟢 Info | Verde | Pulse respondido, Milestone atingido |

---

## Ações Rápidas

```
┌─────────────────────────────────────────┐
│ [+ Ação rápida ▼]                       │
├─────────────────────────────────────────┤
│ 👤 Adicionar membro                     │
│ 📋 Abrir vaga                           │
│ 🎯 Agendar 1:1                          │
│ 🌟 Dar reconhecimento                   │
│ 📢 Criar announcement                   │
│ 📊 Rodar pulse survey                   │
│ 🔔 Agendar ritual                       │
└─────────────────────────────────────────┘
```

---

## Filtros e Visualizações

### Filtros Globais

```
Período: [Este mês ▼]  Área: [Todas ▼]  Local: [Todos ▼]
```

### Modos de Visualização

| Modo | Descrição |
|------|-----------|
| **Executive** | KPIs principais, visão high-level |
| **Operational** | Detalhes, alertas, ações pendentes |
| **Celebration** | Foco em aniversários, reconhecimentos |
| **Custom** | Widgets configuráveis |

---

## Integrações

### Dados que Alimentam o Dashboard

| Fonte | Dados |
|-------|-------|
| **Membros** | Headcount, tenure, áreas |
| **Hiring** | Vagas, candidatos, pipeline |
| **Onboarding** | Progresso, tasks |
| **Performance** | Reviews pendentes |
| **Rituais** | Próximas reuniões, 1:1s |
| **Cultura** | Kudos, pulse scores |
| **Comunicação** | Announcements recentes |

---

## Eventos Connection Layer

```typescript
// Events Consumidos (para atualizar dashboard)
'member.joined'              // → Atualizar headcount
'member.left'                // → Atualizar headcount
'hiring.candidate.moved'     // → Atualizar pipeline
'onboarding.task.completed'  // → Atualizar progresso
'ritual.scheduled'           // → Atualizar calendário
'ritual.completed'           // → Remover do calendário
'culture.kudos.given'        // → Adicionar ao feed
'culture.pulse.response'     // → Atualizar eNPS

// Events Emitidos
'dashboard.viewed'           // Analytics
'dashboard.action.clicked'   // Tracking de uso
```

---

## Tipos TypeScript

```typescript
// types/team-dashboard.ts

export interface TeamDashboardData {
  kpis: {
    total_members: number;
    avg_tenure_months: number;
    enps: number;
    open_positions: number;
    active_onboardings: number;
    overdue_one_on_ones: number;
  };

  team_snapshot: TeamSnapshot;
  hiring_summary: HiringSummary;
  onboarding_summary: OnboardingSummary;
  celebrations: Celebration[];
  rituals_this_week: RitualsByDay[];
  recent_kudos: Kudos[];
  alerts: Alert[];
}

export interface TeamSnapshot {
  total: number;
  by_area: AreaBreakdown[];
  by_location: LocationBreakdown[];
  by_tenure: TenureBreakdown[];
  recent_changes: {
    joined_30d: number;
    left_30d: number;
  };
}

export interface HiringSummary {
  open_positions: number;
  total_candidates: number;
  positions: {
    title: string;
    candidates_count: number;
    furthest_stage: string;
  }[];
}

export interface OnboardingSummary {
  active_count: number;
  onboardings: {
    member_id: string;
    member_name: string;
    role: string;
    day: number;
    total_days: number;
    progress_percent: number;
    pending_tasks: number;
    buddy_name?: string;
    has_overdue: boolean;
  }[];
}

export interface Celebration {
  type: 'birthday' | 'work_anniversary' | 'promotion' | 'milestone';
  member_id: string;
  member_name: string;
  date: string;
  details?: string;  // "2 anos", "Promovido a Senior"
}

export interface RitualsByDay {
  day: string;
  date: string;
  rituals: {
    id: string;
    type: string;
    title: string;
    time: string;
    participants_count: number;
  }[];
}

export interface Kudos {
  id: string;
  from: { id: string; name: string; avatar: string };
  to: { id: string; name: string; avatar: string };
  message: string;
  value_tag: string;
  created_at: string;
  reactions_count: number;
}

export interface Alert {
  level: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  action_url?: string;
  count?: number;
}
```

---

## Métricas do Widget

| Métrica | Descrição |
|---------|-----------|
| **Dashboard views** | Quantas vezes acessado |
| **Time on dashboard** | Tempo médio na tela |
| **Actions taken** | Ações iniciadas do dashboard |
| **Alerts resolved** | Alertas resolvidos após visualização |

---

## Roadmap

### Fase 1: MVP
- [ ] KPI cards básicos
- [ ] Team snapshot
- [ ] Alertas simples
- [ ] Calendário de celebrações

### Fase 2: Completo
- [ ] Hiring pipeline widget
- [ ] Onboarding tracker
- [ ] Rituais da semana
- [ ] Kudos feed

### Fase 3: Advanced
- [ ] Widgets configuráveis
- [ ] Export de relatórios
- [ ] Comparativo histórico
- [ ] Predictions (churn risk)

---

**Documento criado por:** Product Team
**Data:** 2026-01-28
**Versão:** 1.0
