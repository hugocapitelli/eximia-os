# ExímIA OS — Module Planning
## Planejamento Completo de Módulos

**Data:** 2026-01-28
**Status:** Planejamento Estratégico
**Owner:** Orion (AIOS Master)

---

## Estrutura Atual da Sidebar

```
exímIA OS
│
├── 📥 INBOX
│
├── 🎯 JOURNEY ▾
├── 🎓 ACADEMY ▾
│
├── ─── BUSINESS ───
├── 📈 STRATEGY ▾
├── 💰 FINANCE ▾
├── 💵 VENDAS & CLIENTES ▾     ← Vazio
├── 👥 EQUIPE & CULTURA ▾
│
├── ─── CREATIVE ───
├── ◇ PROTOTYPOS ▾
├── 🎨 IDENTIDADE & MARCA ▾
├── ✨ CRIAÇÃO & CONTEÚDO ▾    ← Só Course Creator
│
├── ⚡ AI PLAYGROUND
├── 🧠 MINDS
│
└── 👤 User Profile
```

---

## 📥 INBOX (Universal Capture)

**Status:** PRD Completo | **Prioridade:** P0 (MVP)

### Submodules

| Item | Descrição | Conexões |
|------|-----------|----------|
| **Capture** | Quick capture (Cmd+Shift+Space) | → Triage para todos os módulos |
| **Triage** | IA classifica e sugere destino | → Journey, Academy, Strategy |
| **Queue** | Itens aguardando processamento | → Bulk actions |

### Fluxo Principal
```
Capture → IA Analysis → Suggestion → User Confirm → Route to Module
```

---

## 🎯 JOURNEY (Execução Diária)

**Status:** PRD Completo | **Prioridade:** P0 (MVP)

### Submodules

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Dashboard** | 📊 | Visão consolidada do dia/semana |
| **Metas** | 🎯 | Hierarquia: Vida → Ano → Trimestre → Mês → Semana |
| **Hábitos** | 🔄 | Tracking diário, streaks, analytics |
| **Livros** | 📚 | Biblioteca, notas, quotes, progresso |
| **Autores** | 👤 | Perfis de influenciadores/mentores |
| **Calendário** | 📅 | Google Calendar sync, time blocking |

### Métricas do Dashboard
- Goals completion rate
- Habit streaks
- Reading progress
- Today's focus

---

## 🎓 ACADEMY (Aprendizado Socrático)

**Status:** PRD Completo | **Prioridade:** P0 (MVP) — Pilar de Receita

### Submodules

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Cursos** | 📖 | Catálogo, enrolled, em progresso |
| **Sessões Socráticas** | 🗣️ | Diálogos interativos com IA |
| **Skill Tree** | 🌳 | Mapa de competências desbloqueadas |
| **Certificados** | 🏆 | Achievements, badges |
| **Progresso** | 📈 | Analytics de aprendizado |

### Integração com Connection Layer
- Goal criado → Sugere cursos relevantes
- Curso completado → Atualiza skill no Brand

---

## 📈 STRATEGY (Planejamento Estratégico)

**Status:** PRD Completo | **Prioridade:** P1

### Submodules

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Dashboard** | 📊 | Overview estratégico |
| **Ciclos** | 🔄 | OKRs trimestrais/anuais |
| **Iniciativas** | 🚀 | Projetos estratégicos (cascade → Journey Goals) |
| **KPIs** | 📉 | Indicadores com thresholds e alertas |
| **Roadmap** | 🗺️ | Timeline visual de iniciativas |

### Cascata Automática
```
Iniciativa criada → Goal criado em Journey → Hábitos sugeridos
```

---

## 💰 FINANCE (Gestão Financeira)

**Status:** PRD Básico | **Prioridade:** P2

### Submodules Propostos

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Dashboard** | 📊 | Visão financeira consolidada |
| **Receitas** | 💵 | Tracking de revenue streams |
| **Despesas** | 💸 | Categorização e tracking |
| **Projeções** | 📈 | Forecasting com IA |
| **Métricas SaaS** | 📉 | MRR, ARR, Churn, LTV, CAC |
| **Relatórios** | 📄 | P&L, Fluxo de Caixa |

### Features Futuras
- Integração bancária (Open Banking)
- Invoice management
- Budget planning
- Financial goals linked to Journey

---

## 💵 VENDAS & CLIENTES (Sales & CRM)

**Status:** ✅ PRD Completo | **Prioridade:** P2

O módulo de Vendas & Clientes é o **sistema nervoso comercial** do ExímIA OS. Aqui, empreendedores gerenciam todo o ciclo de vendas — da captura do lead até a retenção do cliente — com IA assistindo cada interação, predizendo riscos e sugerindo ações.

### Submodules Overview

| Item | Ícone | Descrição | Status |
|------|-------|-----------|--------|
| **Dashboard** | 📊 | Central de comando de vendas | ✅ PRD |
| **Pipeline** | 🎯 | Kanban visual de oportunidades | ✅ PRD |
| **Leads** | 👤 | Gestão, qualificação e scoring de leads | ✅ PRD |
| **Clientes** | 👥 | Customer 360 + Health Score | ✅ PRD |
| **Calls** | 📞 | Gravação, transcrição e análise com IA | ✅ PRD |
| **Propostas** | 📄 | Geração e tracking de propostas | ✅ PRD |

---

### 📊 Dashboard (Central de Vendas)

**Propósito:** Visão unificada da performance de vendas — pipeline health, revenue forecast, team performance e insights de IA em tempo real.

#### Métricas Principais

| Métrica | Descrição |
|---------|-----------|
| **Revenue MTD** | Receita fechada no mês |
| **Pipeline Value** | Valor total de oportunidades ativas |
| **Win Rate** | Taxa de conversão de deals |
| **Avg Deal Size** | Ticket médio |
| **Sales Cycle** | Tempo médio de fechamento |
| **Forecast Accuracy** | Precisão das previsões anteriores |

#### Widgets do Dashboard

| Widget | Descrição |
|--------|-----------|
| **Revenue Gauge** | Progresso vs meta mensal |
| **Pipeline Funnel** | Funil com valor por estágio |
| **Win/Loss Trend** | Gráfico de tendência de conversão |
| **Top Deals** | Maiores oportunidades em andamento |
| **At-Risk Deals** | Deals identificados pela IA como em risco |
| **Team Leaderboard** | Ranking de vendedores |
| **AI Insights** | Recomendações da IA para hoje |
| **Activity Feed** | Últimas ações do time |

#### Wireframe Conceitual

```
┌─────────────────────────────────────────────────────────────────────┐
│  💵 SALES DASHBOARD                               [Today ▾] [🔔 3] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│  │ 📈 Revenue   │ │ 🎯 Pipeline  │ │ 🏆 Win Rate  │ │ 📊 Forecast ││
│  │   R$ 127K    │ │   R$ 450K    │ │     32%      │ │   R$ 180K   ││
│  │   ↑ 12%      │ │   24 deals   │ │   ↑ 5%       │ │   Jan 2026  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘│
│                                                                     │
│  ┌─────────────────────────────┐ ┌─────────────────────────────────┐│
│  │ 📊 PIPELINE FUNNEL          │ │ 🤖 AI INSIGHTS                  ││
│  │                              │ │                                 ││
│  │ Prospecting   ████░░ R$120K │ │ ⚠️ 3 deals at risk this week   ││
│  │ Qualification ████░░ R$100K │ │                                 ││
│  │ Proposal      ███░░░ R$ 80K │ │ 💡 Follow up "Acme Corp" -     ││
│  │ Negotiation   ██░░░░ R$ 90K │ │    decision maker engaged       ││
│  │ Closing       █░░░░░ R$ 60K │ │                                 ││
│  │                              │ │ 📈 Best time to call leads:    ││
│  └─────────────────────────────┘ │    Tue-Thu, 10-11am             ││
│                                  └─────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ⚠️ AT-RISK DEALS                                                ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ Acme Corp      │ R$ 45K │ Negotiation │ 🔴 72% risk │ No contact││
│  │ TechStart      │ R$ 30K │ Proposal    │ 🟡 45% risk │ Competitor││
│  │ GlobalTech     │ R$ 25K │ Closing     │ 🟡 38% risk │ Budget    ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

#### Integração Connection Layer
```
Events Emitidos:
- sales.dashboard.viewed { user_id, filters }
- sales.insight.clicked { insight_id, action }
- sales.deal_risk.acknowledged { deal_id }

Events Consumidos:
- deal.won → Atualiza Revenue MTD
- deal.lost → Atualiza Win Rate
- deal.stage.changed → Atualiza Pipeline Funnel
- call.completed → Adiciona ao Activity Feed
- ai.insight.generated → Atualiza AI Insights
```

---

### 🎯 Pipeline (Kanban de Oportunidades)

**Propósito:** Visualizar e gerenciar todas as oportunidades de venda em um kanban intuitivo, com drag & drop e IA sugerindo próximas ações.

#### Estágios do Pipeline

| Estágio | Probabilidade | Gatilho de Entrada |
|---------|--------------|-------------------|
| **Prospecting** | 0-10% | Lead qualificado como oportunidade |
| **Qualification** | 10-30% | BANT básico validado |
| **Proposal** | 30-60% | Proposta enviada |
| **Negotiation** | 60-80% | Cliente negociando termos |
| **Closing** | 80-100% | Contrato em assinatura |

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Kanban View** | Colunas por estágio com drag & drop |
| **List View** | Tabela com filtros avançados |
| **Quick Deal Card** | Resumo: nome, valor, próx. passo, dias no estágio |
| **Stage Limits** | Alerta quando estágio tem muitos deals parados |
| **Bulk Actions** | Mover múltiplos deals, atribuir vendedor |
| **Deal Drawer** | Painel lateral com todos os detalhes |
| **AI Next Action** | Sugestão automática do próximo passo |
| **Win/Lost Modal** | Captura motivo e feedback |

#### Wireframe Conceitual

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎯 SALES PIPELINE                    [+ New Deal] [Filters ▾] [View ▾]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌────────┐│
│ │ PROSPECTING │ │QUALIFICATION│ │  PROPOSAL   │ │NEGOTIAT. │ │CLOSING ││
│ │   R$ 120K   │ │   R$ 100K   │ │   R$ 80K    │ │  R$ 90K  │ │ R$ 60K ││
│ │  (8 deals)  │ │  (5 deals)  │ │  (4 deals)  │ │(3 deals) │ │(2 deals││
│ ├─────────────┤ ├─────────────┤ ├─────────────┤ ├──────────┤ ├────────┤│
│ │┌───────────┐│ │┌───────────┐│ │┌───────────┐│ │┌────────┐│ │┌──────┐││
│ ││ Acme Corp ││ ││ TechStart ││ ││ GlobalCo  ││ ││FastTech││ ││BigCo │││
│ ││ R$ 25K    ││ ││ R$ 30K    ││ ││ R$ 40K    ││ ││R$ 35K  ││ ││R$45K │││
│ ││ 3 dias    ││ ││ 7 dias    ││ ││ 5 dias    ││ ││2 dias  ││ ││1 dia │││
│ ││ 🤖 Call   ││ ││ 🤖 Demo   ││ ││ 🤖 F/up   ││ ││🤖Terms ││ ││🤖Sign│││
│ │└───────────┘│ │└───────────┘│ │└───────────┘│ │└────────┘│ │└──────┘││
│ │┌───────────┐│ │┌───────────┐│ │┌───────────┐│ │┌────────┐│ │┌──────┐││
│ ││ NewLead   ││ ││ StartupX  ││ ││ LocalBiz  ││ ││OldCust ││ ││Renew │││
│ ││ R$ 15K    ││ ││ R$ 20K    ││ ││ R$ 20K    ││ ││R$ 30K  ││ ││R$15K │││
│ ││ ⚠️ 12 dias││ ││ 🔴 15 dias││ ││ 3 dias    ││ ││5 dias  ││ ││3 dias│││
│ │└───────────┘│ │└───────────┘│ │└───────────┘│ │└────────┘│ │└──────┘││
│ │     ...     │ │     ...     │ │     ...     │ │          │ │        ││
│ └─────────────┘ └─────────────┘ └─────────────┘ └──────────┘ └────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

#### Deal Card TypeScript Interface

```typescript
interface DealCard {
  id: string;
  title: string;
  company: Company;
  value: number;
  currency: 'BRL' | 'USD' | 'EUR';
  stage: PipelineStage;
  probability: number;
  owner: TeamMember;

  // Timing
  created_at: Date;
  stage_entered_at: Date;
  days_in_stage: number;
  expected_close_date: Date | null;

  // AI Features
  risk_score: number;       // 0-100, higher = more at risk
  next_best_action: string;
  stagnation_alert: boolean;

  // Activity
  last_activity_at: Date;
  last_activity_type: 'call' | 'email' | 'meeting' | 'note';
  open_tasks: number;

  // Tags & Custom
  tags: string[];
  custom_fields: Record<string, any>;
}
```

#### Integração Connection Layer
```
Events Emitidos:
- deal.created { deal_id, value, stage }
- deal.stage.changed { deal_id, from_stage, to_stage, value }
- deal.won { deal_id, value, duration, won_reason }
- deal.lost { deal_id, value, lost_reason, competitor }
- deal.value.changed { deal_id, old_value, new_value }

Events Consumidos:
- lead.qualified → Cria deal em Prospecting
- proposal.sent → Move para Proposal
- proposal.accepted → Move para Closing
- contract.signed → Marca como Won
```

---

### 👤 Leads (Gestão de Leads)

**Propósito:** Capturar, qualificar e nutrir leads com scoring automático por IA, movendo-os pelo funil até se tornarem oportunidades.

#### Ciclo de Vida do Lead

```
┌────────────────────────────────────────────────────────────────────┐
│                        LEAD LIFECYCLE                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   📥 NEW      →    📊 MQL       →    🎯 SQL       →    💼 SAL     │
│   Capturado       Marketing         Sales            Accepted      │
│                   Qualified         Qualified                      │
│                                                                    │
│         ↓               ↓               ↓               ↓         │
│                                                                    │
│   Enrichment      Lead Score       BANT/MEDDIC      Opportunity   │
│   Automático      ≥ 50 pts         Validated        Created       │
│                                                                    │
│         ↓                                                          │
│                                                                    │
│   ❄️ COLD         ❌ DISQUALIFIED     👤 CUSTOMER                  │
│   (Nurture)       (Lost)              (Converted)                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Lead Scoring Model

| Categoria | Peso | Fatores |
|-----------|------|---------|
| **Demográfico** | 40% | Cargo, empresa, setor, região |
| **Comportamental** | 60% | Visitas, downloads, emails, calls |

**Scoring Breakdown:**

```
Demográfico (0-40 pts):
├── Cargo: C-Level (+15), Diretor (+12), Gerente (+8), Analista (+4)
├── Tamanho Empresa: 100+ (+10), 50-100 (+7), 10-50 (+5), <10 (+2)
├── Setor: Target (+10), Adjacent (+5), Other (+2)
└── Região: Tier 1 (+5), Tier 2 (+3), Tier 3 (+1)

Comportamental (0-60 pts):
├── Visitas Site: Pricing (+15), Case Studies (+10), Blog (+3)
├── Downloads: eBook (+10), Whitepaper (+8), Checklist (+5)
├── Emails: Open (+2), Click (+5), Reply (+10)
├── Calls: Scheduled (+15), Completed (+20), No-show (-10)
└── Recência: Last 7 days (×1.5), Last 30 days (×1.0), >30 days (×0.5)
```

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Lead Inbox** | Lista de novos leads para triagem |
| **Lead Card** | Perfil completo com score e histórico |
| **Auto-Enrichment** | Preenche dados via APIs (LinkedIn, Clearbit) |
| **Scoring Dashboard** | Visualização do score breakdown |
| **Qualification Forms** | BANT, MEDDIC, CHAMP frameworks |
| **Activity Timeline** | Histórico de todas as interações |
| **Nurture Sequences** | Automação de follow-up |
| **Bulk Import** | CSV, integração com forms |

#### Wireframe Conceitual

```
┌─────────────────────────────────────────────────────────────────────┐
│  👤 LEAD DETAIL                                    [Convert] [Edit] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────┐ ┌────────────────────────────────┐│
│  │ 👤 Maria Silva               │ │ LEAD SCORE                     ││
│  │ Product Manager @ TechCorp   │ │                                ││
│  │ maria@techcorp.com           │ │     ┌────────────────┐         ││
│  │ +55 11 99999-9999            │ │     │      75        │ 🟢 Hot  ││
│  │                              │ │     │    /100        │         ││
│  │ Status: MQL → SQL            │ │     └────────────────┘         ││
│  │ Source: Webinar              │ │                                ││
│  │ Owner: João (SDR)            │ │ Demo: 35/40  Behav: 40/60     ││
│  └──────────────────────────────┘ └────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┤
│  │ QUALIFICATION (BANT)                                             │
│  ├──────────────────────────────────────────────────────────────────┤
│  │ Budget:    [✓] R$ 30-50K/ano aprovado                           │
│  │ Authority: [✓] Decision maker confirmado                        │
│  │ Need:      [✓] Pain point: integração de dados                  │
│  │ Timeline:  [~] Q1 2026 (flexível)                               │
│  └──────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┤
│  │ TIMELINE                                           [+ Add Note] │
│  ├──────────────────────────────────────────────────────────────────┤
│  │ 📧 Jan 20 │ Email aberto: "Case Study TechX"                    │
│  │ 📞 Jan 22 │ Discovery Call (25min) - Pain points identificados  │
│  │ 📥 Jan 24 │ Download: Pricing Sheet                             │
│  │ 📧 Jan 25 │ Reply: "Vamos agendar demo técnica"                 │
│  └──────────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────┘
```

#### Integração Connection Layer
```
Events Emitidos:
- lead.created { lead_id, source, score }
- lead.score.changed { lead_id, old_score, new_score, trigger }
- lead.status.changed { lead_id, from, to }
- lead.qualified { lead_id, framework, answers }
- lead.converted { lead_id, deal_id }
- lead.disqualified { lead_id, reason }

Events Consumidos:
- inbox.item.triaged → Cria lead (se categorizado como lead)
- form.submitted → Atualiza dados do lead
- email.opened → Incrementa score
- call.completed → Atualiza timeline + score
```

---

### 👥 Clientes (Customer 360)

**Propósito:** Visão completa de cada cliente — health score, contratos, interações, oportunidades de expansão e risco de churn, tudo monitorado por IA.

#### Customer Health Score

A fórmula do Health Score combina 5 dimensões:

```
Health Score = (Usage × 30%) + (Engagement × 25%) + (Support × 20%)
             + (Payment × 15%) + (Growth × 10%)

┌────────────────────────────────────────────────────────────────────┐
│                    HEALTH SCORE BREAKDOWN                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  📊 USAGE (30%)           │ 🤝 ENGAGEMENT (25%)                    │
│  ├── DAU/MAU ratio        │ ├── Login frequency                   │
│  ├── Feature adoption     │ ├── Support tickets (low = good)      │
│  ├── API calls            │ ├── NPS/CSAT responses                │
│  └── Data volume          │ └── Event attendance                  │
│                           │                                        │
│  📞 SUPPORT (20%)         │ 💳 PAYMENT (15%)                       │
│  ├── Ticket volume        │ ├── On-time payments                  │
│  ├── Resolution time      │ ├── Payment method                    │
│  ├── Escalations          │ ├── Failed transactions               │
│  └── CSAT per ticket      │ └── Invoice disputes                  │
│                           │                                        │
│  📈 GROWTH (10%)          │                                        │
│  ├── Upsell conversations │                                        │
│  ├── Referrals given      │                                        │
│  └── Expansion signals    │                                        │
│                           │                                        │
└────────────────────────────────────────────────────────────────────┘
```

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Customer List** | Lista com health score, MRR, status |
| **360 View** | Perfil completo do cliente |
| **Health Dashboard** | Breakdown do health score com trends |
| **Contract Manager** | Contratos ativos, renovações, SLAs |
| **Expansion Detector** | IA identifica oportunidades de upsell |
| **Churn Predictor** | Modelo de ML prevê risco de churn |
| **Playbooks** | Ações recomendadas por segmento |
| **Success Plans** | Roadmap de sucesso por cliente |

#### Wireframe Conceitual

```
┌─────────────────────────────────────────────────────────────────────┐
│  👥 CUSTOMER 360: Acme Corporation                          [Edit] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────┐  ┌────────────────────────────────────────────┐│
│  │                │  │ Health Score: 72/100          🟡 At Risk   ││
│  │    [LOGO]      │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░                      ││
│  │                │  │                                            ││
│  │  Acme Corp     │  │ Usage: 85    Engage: 70   Support: 60     ││
│  │  Enterprise    │  │ Payment: 95  Growth: 45                    ││
│  │  MRR: R$ 15K   │  └────────────────────────────────────────────┘│
│  │  Since: 2024   │                                                │
│  │  CSM: Ana      │  ┌────────────────────────────────────────────┐│
│  └────────────────┘  │ ⚠️ RISK SIGNALS                            ││
│                      │ • Usage dropped 30% last month              ││
│                      │ • No login from key user (Maria) in 14 days││
│                      │ • 2 unresolved support tickets              ││
│                      └────────────────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐│
│  │ 📋 CONTRACTS         │  │ 💡 EXPANSION OPPORTUNITIES           ││
│  ├──────────────────────┤  ├──────────────────────────────────────┤│
│  │ Pro Plan             │  │ • API add-on: fits their use case    ││
│  │ R$ 15K/mo            │  │ • +5 seats: team grew 20%            ││
│  │ Renews: Mar 2026     │  │ • Training package: new hires        ││
│  │ 🟡 60 days left      │  │                                      ││
│  └──────────────────────┘  └──────────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┤
│  │ 📊 ENGAGEMENT TIMELINE                                          │
│  ├──────────────────────────────────────────────────────────────────┤
│  │ [Graph showing usage, logins, support tickets over time]        │
│  │ ▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▁▂                                            │
│  │ Jan                              Feb                            │
│  └──────────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────┘
```

#### Customer TypeScript Interface

```typescript
interface Customer {
  id: string;
  company: Company;
  status: 'active' | 'churned' | 'paused';
  tier: 'starter' | 'pro' | 'enterprise';

  // Financials
  mrr: number;
  arr: number;
  ltv: number;
  customer_since: Date;

  // Health
  health_score: number;
  health_breakdown: HealthBreakdown;
  risk_level: 'healthy' | 'at_risk' | 'critical';
  churn_probability: number;

  // Relationships
  csm: TeamMember | null;
  primary_contact: Contact;
  stakeholders: Contact[];

  // Contracts
  contracts: Contract[];
  current_contract: Contract | null;
  renewal_date: Date | null;

  // AI Insights
  expansion_opportunities: ExpansionOpportunity[];
  risk_signals: RiskSignal[];
  recommended_actions: string[];
}

interface HealthBreakdown {
  usage: number;        // 0-100
  engagement: number;   // 0-100
  support: number;      // 0-100
  payment: number;      // 0-100
  growth: number;       // 0-100
}
```

#### Integração Connection Layer
```
Events Emitidos:
- customer.created { customer_id, tier, mrr }
- customer.health.changed { customer_id, old_score, new_score, signals }
- customer.churned { customer_id, mrr_lost, reason }
- customer.expansion.detected { customer_id, opportunity_type, value }
- customer.contract.renewed { customer_id, new_mrr, term }

Events Consumidos:
- deal.won → Cria customer
- payment.received → Atualiza payment score
- support.ticket.created → Recalcula support score
- login.completed → Atualiza engagement
- usage.metric.recorded → Recalcula usage score
```

---

### 📞 Calls (Inteligência de Calls)

**Propósito:** Gravar, transcrever e analisar calls de vendas com IA — detectando sentimento, objeções, próximos passos e coaching automático para o time.

#### Call Intelligence Pipeline

```
┌────────────────────────────────────────────────────────────────────┐
│                    CALL INTELLIGENCE PIPELINE                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   📞 CALL        →    🎙️ RECORD      →    📝 TRANSCRIBE           │
│   Scheduled           Audio capture       Whisper/AssemblyAI       │
│                                                                    │
│         ↓                                                          │
│                                                                    │
│   🤖 ANALYZE                                                       │
│   ├── Sentiment analysis (positive/neutral/negative)              │
│   ├── Objection detection (price, timing, competitor, etc.)       │
│   ├── Topic extraction (pain points, requirements, etc.)          │
│   ├── Next steps identification                                   │
│   ├── Talk/listen ratio                                           │
│   └── Filler words, interruptions                                 │
│                                                                    │
│         ↓                                                          │
│                                                                    │
│   📊 INSIGHTS                                                      │
│   ├── Call score (1-100)                                          │
│   ├── Coaching recommendations                                    │
│   ├── Key moments highlighted                                     │
│   └── Summary auto-generated                                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Call Scheduler** | Agendar calls com link automático |
| **Recording** | Gravação com consentimento |
| **Live Transcription** | Transcrição em tempo real |
| **Playback** | Player com transcrição sincronizada |
| **AI Summary** | Resumo automático da call |
| **Objection Tracker** | Detecta e categoriza objeções |
| **Next Steps Extractor** | Identifica action items |
| **Coaching Dashboard** | Métricas e dicas para vendedores |
| **Snippet Sharing** | Compartilhar momentos-chave |

#### Call Quality Metrics

| Métrica | Descrição | Target |
|---------|-----------|--------|
| **Talk Ratio** | % do tempo falando | 30-40% |
| **Longest Monologue** | Maior sequência sem pausa | < 2 min |
| **Question Count** | Perguntas feitas | 10-15 |
| **Filler Words** | "então", "né", "tipo" | < 5/min |
| **Patience Score** | Pausas antes de responder | > 2s |
| **Engagement Score** | Interações do prospect | High |

#### Wireframe Conceitual

```
┌─────────────────────────────────────────────────────────────────────┐
│  📞 CALL DETAIL: Discovery - Acme Corp                     [Share] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ [▶ Play] ━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━ 12:45 / 28:30         ││
│  │                      ↑                                          ││
│  │                  Key moment                                     ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐│
│  │ 📊 CALL SCORE        │  │ 🤖 AI SUMMARY                        ││
│  │                      │  │                                      ││
│  │      78/100          │  │ Discovery call with Maria (PM) from  ││
│  │      🟢 Good         │  │ Acme Corp. Main pain point: data     ││
│  │                      │  │ integration taking 2+ hours/day.     ││
│  │ Talk: 35% ✓          │  │ Budget: R$ 30-50K approved.          ││
│  │ Questions: 12 ✓      │  │ Decision maker: confirmed.           ││
│  │ Fillers: 3/min ✓     │  │ Next: send proposal by Friday.       ││
│  └──────────────────────┘  └──────────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┤
│  │ 📝 TRANSCRIPTION WITH INSIGHTS                                   │
│  ├──────────────────────────────────────────────────────────────────┤
│  │ [00:00] 👤 João: Oi Maria, obrigado por aceitar a call...       │
│  │ [00:15] 👤 Maria: Oi João, tudo bem! Estou curiosa pra...       │
│  │ [02:30] 👤 Maria: Nosso maior problema é a integração...        │
│  │         🏷️ Pain Point: Data Integration                        │
│  │ [05:45] 👤 Maria: O orçamento aprovado é entre 30 e 50K...      │
│  │         💰 Budget: R$ 30-50K                                    │
│  │ [12:30] 👤 Maria: Mas não sei se o timing é o melhor...         │
│  │         ⚠️ Objection: Timing                                    │
│  │ [25:00] 👤 João: Então, próximo passo seria eu enviar...        │
│  │         ✅ Next Step: Send proposal by Friday                   │
│  └──────────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────────┘
```

#### Call TypeScript Interface

```typescript
interface Call {
  id: string;
  type: 'discovery' | 'demo' | 'negotiation' | 'check_in' | 'other';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

  // Participants
  owner: TeamMember;
  participants: Participant[];

  // Timing
  scheduled_at: Date;
  started_at: Date | null;
  ended_at: Date | null;
  duration_seconds: number;

  // Recording
  recording_url: string | null;
  recording_consented: boolean;

  // Transcription
  transcript: CallTranscript | null;

  // AI Analysis
  analysis: CallAnalysis | null;

  // Links
  deal_id: string | null;
  lead_id: string | null;
  customer_id: string | null;
}

interface CallAnalysis {
  summary: string;
  quality_score: number;                // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';

  // Metrics
  talk_ratio: number;                   // 0-100 (% seller talking)
  longest_monologue_seconds: number;
  question_count: number;
  filler_word_count: number;
  patience_score: number;               // 0-100

  // Extracted Info
  objections: DetectedObjection[];
  pain_points: string[];
  next_steps: string[];
  key_moments: KeyMoment[];

  // Coaching
  coaching_tips: string[];
}

interface DetectedObjection {
  type: 'price' | 'timing' | 'competitor' | 'authority' | 'need' | 'other';
  text: string;
  timestamp_seconds: number;
  suggested_response: string;
}
```

#### Integração Connection Layer
```
Events Emitidos:
- call.scheduled { call_id, deal_id, participants }
- call.started { call_id, recording_started }
- call.completed { call_id, duration, recording_url }
- call.transcribed { call_id, transcript_id }
- call.analyzed { call_id, score, objections_count }
- call.objection.detected { call_id, objection_type, text }

Events Consumidos:
- deal.created → Sugere agendar discovery call
- calendar.event.created → Cria call record
- recording.uploaded → Inicia transcrição
- transcript.completed → Inicia análise
```

---

### 📄 Propostas (Geração e Tracking)

**Propósito:** Criar, enviar e rastrear propostas comerciais com templates inteligentes, geração assistida por IA e analytics de engajamento.

#### Proposal Workflow

```
┌────────────────────────────────────────────────────────────────────┐
│                      PROPOSAL WORKFLOW                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   📝 DRAFT        →    ✅ REVIEW      →    📤 SENT                │
│   AI generates        Manager approves     Delivered to client     │
│                                                                    │
│         ↓                                                          │
│                                                                    │
│   👁️ VIEWED       →    💬 NEGOTIATING  →   📊 OUTCOME            │
│   Client opened       Client engaged       Accepted/Declined       │
│   Page analytics      Back-and-forth                               │
│                                                                    │
│         ↓                                                          │
│                                                                    │
│   ✍️ SIGNATURE    →    🎉 CLOSED                                  │
│   E-signature         Deal won!                                    │
│   integration                                                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Template Library** | Templates por segmento e tipo de deal |
| **AI Generator** | Gera proposta baseada em contexto do deal |
| **Content Blocks** | Seções reutilizáveis (pricing, terms, etc.) |
| **Dynamic Pricing** | Tabelas de preço editáveis |
| **Approval Workflow** | Revisão obrigatória para descontos |
| **View Analytics** | Tempo por página, seções mais vistas |
| **E-Signature** | Integração DocuSign/PandaDoc |
| **Version Control** | Histórico de versões da proposta |
| **Expiration** | Validade automática com alertas |

#### Wireframe Conceitual

```
┌─────────────────────────────────────────────────────────────────────┐
│  📄 PROPOSAL EDITOR                                        [Preview]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Deal: Acme Corp - R$ 45K              Status: Draft       [🤖 AI] │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ SECTIONS                                            [+ Add]     ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ ☰ Cover Page          ✓ Complete                               ││
│  │ ☰ Executive Summary   ✓ AI Generated                           ││
│  │ ☰ Problem Statement   ✓ From discovery call                    ││
│  │ ☰ Solution Overview   ○ Edit needed                            ││
│  │ ☰ Pricing Table       ○ Review discounts                       ││
│  │ ☰ Case Studies        ✓ Auto-selected                          ││
│  │ ☰ Terms & Conditions  ✓ Standard                               ││
│  │ ☰ Next Steps          ○ Add timeline                           ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ PRICING TABLE                                                   ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ Item                    │ Qty │ Unit Price │ Total             ││
│  │ ─────────────────────────────────────────────────────────────── ││
│  │ Pro Plan (annual)       │  1  │ R$ 15.000  │ R$ 15.000         ││
│  │ Additional Seats        │  10 │ R$    500  │ R$  5.000         ││
│  │ Implementation          │  1  │ R$ 10.000  │ R$ 10.000         ││
│  │ Training (8h)           │  1  │ R$  5.000  │ R$  5.000         ││
│  │ ─────────────────────────────────────────────────────────────── ││
│  │ Subtotal                │     │            │ R$ 35.000         ││
│  │ Discount (10%)          │     │            │ -R$ 3.500 ⚠️     ││
│  │ ─────────────────────────────────────────────────────────────── ││
│  │ TOTAL                   │     │            │ R$ 31.500         ││
│  │                                         Needs manager approval  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  [Save Draft]              [Request Approval]              [Send]  │
└─────────────────────────────────────────────────────────────────────┘
```

#### Proposal Analytics

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 PROPOSAL ANALYTICS                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Acme Corp Proposal                         Status: Viewed 3x       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ VIEW TIMELINE                                                 │  │
│  │                                                               │  │
│  │ 👁️ Jan 26, 10:15am │ Maria (5 min) │ Pricing, Terms          │  │
│  │ 👁️ Jan 27, 2:30pm  │ Carlos (12 min) │ All pages            │  │
│  │ 👁️ Jan 28, 9:00am  │ Maria (3 min) │ Pricing only           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ PAGE HEATMAP                                                  │  │
│  │                                                               │  │
│  │ Cover           ▓░░░░░░░░░ 10%                                │  │
│  │ Exec Summary    ▓▓░░░░░░░░ 15%                                │  │
│  │ Problem         ▓▓▓░░░░░░░ 20%                                │  │
│  │ Solution        ▓▓▓▓░░░░░░ 25%                                │  │
│  │ PRICING         ▓▓▓▓▓▓▓▓░░ 60%  🔥 Most viewed               │  │
│  │ Case Studies    ▓▓░░░░░░░░ 15%                                │  │
│  │ Terms           ▓▓▓▓░░░░░░ 30%                                │  │
│  │ Next Steps      ▓░░░░░░░░░ 8%                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  🤖 AI Insight: Client spent most time on Pricing. Consider        │
│     proactively addressing value justification on follow-up call.  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Proposal TypeScript Interface

```typescript
interface Proposal {
  id: string;
  deal_id: string;
  version: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';

  // Content
  title: string;
  sections: ProposalSection[];
  pricing: ProposalPricing;

  // Template
  template_id: string | null;

  // Dates
  created_at: Date;
  sent_at: Date | null;
  first_viewed_at: Date | null;
  expires_at: Date | null;

  // Analytics
  analytics: ProposalAnalytics;

  // Approval
  approval: ApprovalStatus | null;

  // Signature
  signature_status: 'not_sent' | 'pending' | 'signed' | 'declined';
  signature_url: string | null;
  signed_at: Date | null;
}

interface ProposalAnalytics {
  total_views: number;
  unique_viewers: number;
  total_time_seconds: number;
  page_views: PageView[];
  viewer_sessions: ViewerSession[];
}

interface ViewerSession {
  viewer_email: string;
  viewed_at: Date;
  duration_seconds: number;
  pages_viewed: string[];
}
```

#### Integração Connection Layer
```
Events Emitidos:
- proposal.created { proposal_id, deal_id, value }
- proposal.sent { proposal_id, recipient_emails }
- proposal.viewed { proposal_id, viewer, duration, pages }
- proposal.accepted { proposal_id, deal_id }
- proposal.declined { proposal_id, reason }
- proposal.signed { proposal_id, signer }
- proposal.expired { proposal_id }

Events Consumidos:
- deal.stage.changed → Sugere criar proposta (se Proposal stage)
- call.completed → Extrai info para proposta
- customer.contract.expiring → Sugere proposta de renovação
```

---

### 🤖 AI Agents do Módulo de Vendas

O módulo de Vendas & Clientes conta com uma camada de IA composta por agentes especializados:

| Agente | Responsabilidade | Trigger |
|--------|-----------------|---------|
| **Lead Scorer** | Pontuação automática de leads | Qualquer evento de lead |
| **Deal Risk Predictor** | Identifica deals em risco | Diário + mudança de estágio |
| **Revenue Forecaster** | Previsão de receita | Semanal + sob demanda |
| **Call Analyzer** | Análise de calls | Pós-transcrição |
| **Sales Coach** | Dicas personalizadas | Após calls/deals perdidos |
| **Churn Predictor** | Prevê clientes em risco | Diário |
| **Expansion Detector** | Identifica oportunidades | Semanal |
| **Proposal Generator** | Gera propostas | Sob demanda |
| **Objection Handler** | Sugere respostas | Objeção detectada em call |

#### AI Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SALES AI PIPELINE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────────┐  │
│  │ Events  │───▶│ Router  │───▶│ Agents  │───▶│ Actions/Insights│  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────────────┘  │
│                                                                     │
│  Events:           Router:           Agents:        Outputs:        │
│  - deal.created    Classifica        Lead Scorer    - Score update  │
│  - call.completed  evento e          Deal Risk      - Risk alert    │
│  - lead.activity   roteia para       Revenue Fcst   - Forecast      │
│  - health.changed  agente(s)         Call Analyzer  - Insights      │
│  - etc.            apropriado(s)     Churn Pred.    - Playbooks     │
│                                      Expansion Det. - Suggestions   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 📊 Métricas Chave do Módulo

| Categoria | Métrica | Fórmula/Descrição |
|-----------|---------|-------------------|
| **Pipeline** | Pipeline Value | Σ (deal_value × probability) |
| **Pipeline** | Pipeline Velocity | Avg(days_to_close) por estágio |
| **Conversion** | Lead-to-MQL | MQLs / Total Leads |
| **Conversion** | MQL-to-SQL | SQLs / MQLs |
| **Conversion** | SQL-to-Won | Closed Won / SQLs |
| **Conversion** | Win Rate | Closed Won / (Won + Lost) |
| **Revenue** | MRR | Monthly Recurring Revenue |
| **Revenue** | ARR | Annual Recurring Revenue |
| **Revenue** | Net Revenue Retention | (MRR_start + Expansion - Churn) / MRR_start |
| **Customer** | Avg Health Score | Média de health scores |
| **Customer** | Churn Rate | Churned / Total Customers |
| **Calls** | Avg Call Score | Média de quality scores |
| **Proposals** | Proposal Win Rate | Accepted / Sent |

---

### 🗄️ Database Schema (Supabase)

```sql
-- Core Tables
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  contact_id UUID REFERENCES contacts(id),
  status VARCHAR(20) DEFAULT 'new',
  score INTEGER DEFAULT 0,
  score_demographic INTEGER DEFAULT 0,
  score_behavioral INTEGER DEFAULT 0,
  source VARCHAR(50),
  owner_id UUID REFERENCES team_members(id),
  qualified_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  company_id UUID REFERENCES companies(id),
  lead_id UUID REFERENCES leads(id),
  stage VARCHAR(50) DEFAULT 'prospecting',
  value DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'BRL',
  probability INTEGER DEFAULT 10,
  owner_id UUID REFERENCES team_members(id),
  expected_close_date DATE,
  won_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  lost_reason VARCHAR(100),
  risk_score INTEGER DEFAULT 0,
  stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  status VARCHAR(20) DEFAULT 'active',
  tier VARCHAR(20),
  mrr DECIMAL(15,2),
  health_score INTEGER DEFAULT 100,
  health_usage INTEGER DEFAULT 100,
  health_engagement INTEGER DEFAULT 100,
  health_support INTEGER DEFAULT 100,
  health_payment INTEGER DEFAULT 100,
  health_growth INTEGER DEFAULT 100,
  churn_probability DECIMAL(5,2) DEFAULT 0,
  csm_id UUID REFERENCES team_members(id),
  customer_since DATE,
  churned_at TIMESTAMPTZ,
  churn_reason VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) DEFAULT 'discovery',
  status VARCHAR(20) DEFAULT 'scheduled',
  owner_id UUID REFERENCES team_members(id),
  deal_id UUID REFERENCES deals(id),
  lead_id UUID REFERENCES leads(id),
  customer_id UUID REFERENCES customers(id),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  recording_url TEXT,
  recording_consented BOOLEAN DEFAULT FALSE,
  quality_score INTEGER,
  talk_ratio INTEGER,
  sentiment VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id),
  version INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'draft',
  title VARCHAR(255),
  total_value DECIMAL(15,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  template_id UUID REFERENCES proposal_templates(id),
  sent_at TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  total_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Example RLS: Users see only their organization's data
CREATE POLICY "org_leads" ON leads
  FOR ALL USING (
    company_id IN (SELECT company_id FROM org_members WHERE user_id = auth.uid())
  );
```

---

### 🚀 Implementation Roadmap

| Fase | Entregas | Duração Est. |
|------|----------|--------------|
| **Fase 1** | Dashboard + Pipeline básico | 3-4 semanas |
| **Fase 2** | Leads + Lead Scoring | 2-3 semanas |
| **Fase 3** | Clientes + Health Score | 2-3 semanas |
| **Fase 4** | Calls + Transcription | 3-4 semanas |
| **Fase 5** | Propostas + Analytics | 2-3 semanas |
| **Fase 6** | AI Agents (Risk, Coach) | 3-4 semanas |
| **Fase 7** | E-signature + Integrações | 2-3 semanas |

**Total estimado:** 17-24 semanas para MVP completo

---

### 🔗 Integrações Externas Sugeridas

| Serviço | Propósito |
|---------|-----------|
| **Whisper/AssemblyAI** | Transcrição de calls |
| **DocuSign/PandaDoc** | E-signature de propostas |
| **Clearbit/Apollo** | Enriquecimento de leads |
| **Calendly** | Agendamento de calls |
| **Twilio** | Discagem e gravação |
| **Slack** | Notificações de deals |
| **Zapier** | Automações customizadas |

---

## 👥 EQUIPE & CULTURA (Team & Culture)

**Status:** 🆕 Básico | **Prioridade:** P3

O módulo de Equipe & Cultura é o **sistema operacional de pessoas** do ExímIA OS. Aqui, empreendedores constroem times de alta performance com processos claros, rituais inteligentes e uma cultura documentada que escala — sem perder a alma da empresa.

### Submodules Overview

| Item | Ícone | Descrição | Status |
|------|-------|-----------|--------|
| **Dashboard** | 📊 | Central de comando do time | 🆕 |
| **Organograma** | 🏛️ | Estrutura visual da empresa | 🆕 |
| **Membros** | 👥 | Perfis completos do time | 🆕 |
| **Hiring** | 🎯 | Pipeline de contratação | 🆕 |
| **Onboarding** | 🚀 | Jornada de novos membros | 🆕 |
| **Performance** | 📈 | Avaliações e feedback contínuo | 🆕 |
| **Rituais** | 🔔 | Cerimônias e reuniões | 🆕 |
| **Cultura** | 🌟 | DNA, valores e reconhecimento | 🆕 |
| **Comunicação** | 💬 | Announcements e canais | 🆕 |
| **Offboarding** | 👋 | Desligamento estruturado | 🆕 |

---

### 📊 Dashboard (Central do Time)

**Propósito:** Visão unificada da saúde organizacional — quem somos, como estamos, para onde vamos.

#### Métricas Principais

| Métrica | Descrição |
|---------|-----------|
| **Headcount** | Total de membros ativos |
| **Tenure Médio** | Tempo médio de casa |
| **eNPS** | Employee Net Promoter Score |
| **Vagas Abertas** | Posições em hiring |
| **Onboardings Ativos** | Pessoas em integração |
| **Próximos Rituais** | Reuniões da semana |

#### Widgets do Dashboard

| Widget | Descrição |
|--------|-----------|
| **Team Snapshot** | Foto do time com headcount por área |
| **Hiring Pipeline** | Funil de contratações em andamento |
| **Birthdays & Anniversaries** | Aniversários da semana |
| **Ritual Calendar** | Próximas cerimônias |
| **Recent Recognitions** | Últimos reconhecimentos dados |
| **Alerts** | Onboardings atrasados, 1:1s pendentes |

#### Integração Connection Layer
```
Events Emitidos:
- team.dashboard.viewed
- team.alert.acknowledged

Events Consumidos:
- member.hired → Atualiza headcount
- member.offboarded → Atualiza métricas
- ritual.completed → Remove do calendar
- recognition.given → Adiciona ao feed
```

---

### 🏛️ Organograma (Estrutura Organizacional)

**Propósito:** Visualizar a estrutura da empresa de forma clara — quem responde a quem, quais áreas existem, como estamos organizados.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Tree View** | Organograma hierárquico tradicional |
| **Card View** | Cards por área/squad |
| **Matrix View** | Para estruturas matriciais |
| **Drag & Drop** | Reorganize facilmente |
| **History** | Histórico de mudanças organizacionais |
| **Export** | PDF, PNG para apresentações |

#### Tipos de Estrutura Suportados

| Tipo | Use Case |
|------|----------|
| **Hierárquica** | Empresa tradicional com níveis claros |
| **Flat** | Startups com poucos níveis |
| **Matricial** | Pessoas em múltiplos projetos |
| **Squads** | Modelo Spotify (Squads, Tribes, Chapters) |
| **Híbrida** | Combinação de modelos |

#### Elementos do Organograma
```
┌─────────────────────────────────────────┐
│           👤 CEO / Founder              │
│           Hugo D.                       │
└───────────────┬─────────────────────────┘
        ┌───────┴───────┐
        ▼               ▼
┌───────────────┐ ┌───────────────┐
│ 🎯 Produto    │ │ 💰 Comercial  │
│ Maria S.      │ │ João P.       │
│ 3 membros     │ │ 5 membros     │
└───────────────┘ └───────────────┘
```

#### Integração Connection Layer
```
Events Emitidos:
- org.structure.updated { change_type, affected_members }
- org.area.created { area_id, parent_id }

Events Consumidos:
- member.hired → Adiciona ao org
- member.promoted → Move na hierarquia
- member.offboarded → Remove do org
```

---

### 👥 Membros (Perfis do Time)

**Propósito:** Perfis completos de cada membro — skills, histórico, goals, feedback — tudo em um lugar.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Profile Card** | Foto, nome, cargo, área, contato |
| **Skills Map** | Competências técnicas e soft skills |
| **Career Timeline** | Histórico na empresa (promoções, mudanças) |
| **Goals** | OKRs pessoais linkados aos da empresa |
| **Feedback Log** | Histórico de feedbacks recebidos |
| **1:1 Notes** | Notas de reuniões 1:1 |
| **Recognition Wall** | Reconhecimentos recebidos |
| **Documents** | Contrato, docs pessoais |

#### Estrutura do Perfil

```yaml
member:
  # Básico
  id: "member_123"
  name: "Maria Silva"
  email: "maria@eximia.com"
  avatar: "url..."
  role: "Product Manager"
  area: "Produto"
  reports_to: "hugo_d"

  # Datas
  start_date: "2025-03-15"
  tenure: "10 meses"
  birthday: "1992-08-20"

  # Skills
  skills:
    - name: "Product Discovery"
      level: "expert"
      validated_by: "Academy"
    - name: "SQL"
      level: "intermediate"

  # Performance
  current_goals: 3
  goals_completed: 12
  last_review: "2025-12-01"
  next_review: "2026-03-01"

  # Status
  status: "active"  # active, on_leave, offboarding
  location: "São Paulo, BR"
  timezone: "America/Sao_Paulo"
```

#### Views Disponíveis

| View | Descrição |
|------|-----------|
| **Grid** | Cards com foto e info básica |
| **List** | Tabela com filtros avançados |
| **By Area** | Agrupado por departamento |
| **By Skill** | Quem sabe o quê |
| **Birthday Calendar** | Aniversários do mês |

#### Integração Connection Layer
```
Events Emitidos:
- member.profile.viewed { member_id }
- member.profile.updated { member_id, fields_changed }
- member.skill.added { member_id, skill }

Events Consumidos:
- academy.course.completed → Adiciona skill
- journey.goal.completed → Atualiza progresso
- feedback.given → Adiciona ao log
```

---

### 🎯 Hiring (Pipeline de Contratação)

**Propósito:** Gerenciar todo o processo de contratação — da vaga aberta até o primeiro dia.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Job Board** | Vagas abertas com descrição |
| **Kanban Pipeline** | Candidatos por estágio |
| **Candidate Profile** | Perfil completo do candidato |
| **Interview Kit** | Roteiros de entrevista |
| **Scorecards** | Avaliação estruturada |
| **Offer Management** | Geração e tracking de ofertas |
| **Analytics** | Métricas do funil |

#### Pipeline Stages

```
APLICOU → TRIAGEM → ENTREVISTA RH → ENTREVISTA TÉCNICA → CASE → OFERTA → CONTRATADO
   │         │            │                │             │        │
   │         │            │                │             │        └→ Onboarding
   │         │            │                │             └→ Recusou/Rejeitado
   │         │            │                └→ Reprovado
   │         │            └→ Reprovado
   │         └→ Não qualificado
   └→ Duplicado
```

#### Job Description Builder

| Seção | Descrição |
|-------|-----------|
| **Sobre a Vaga** | Descrição do papel |
| **Responsabilidades** | O que vai fazer |
| **Requisitos** | Must-have skills |
| **Diferenciais** | Nice-to-have |
| **Benefícios** | O que oferecemos |
| **Processo** | Como será a seleção |

#### IA Features

| Feature | Descrição |
|---------|-----------|
| **JD Generator** | Gera descrição baseada no cargo |
| **Resume Parser** | Extrai dados do CV automaticamente |
| **Match Score** | Pontua fit com a vaga |
| **Interview Questions** | Sugere perguntas por skill |
| **Offer Letter** | Gera carta proposta com Brand Voice |

#### Integração Connection Layer
```
Events Emitidos:
- hiring.job.created { job_id, title, area }
- hiring.candidate.moved { candidate_id, from_stage, to_stage }
- hiring.offer.sent { candidate_id, job_id }
- hiring.offer.accepted { candidate_id } → Trigger onboarding

Events Consumidos:
- member.offboarded → Pode reabrir vaga
- org.area.created → Pode precisar de vagas
```

---

### 🚀 Onboarding (Integração de Novos Membros)

**Propósito:** Garantir que todo novo membro tenha uma experiência de integração incrível, produtiva e acolhedora.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Onboarding Tracks** | Trilhas por cargo/área |
| **Checklist Builder** | Crie checklists customizados |
| **Progress Tracker** | Acompanhe cada novo membro |
| **Buddy System** | Atribuição de buddy/mentor |
| **30-60-90 Plan** | Plano estruturado de integração |
| **Resource Library** | Docs e vídeos para novatos |
| **Feedback Points** | Checkpoints de feedback |

#### Estrutura do Onboarding

```
SEMANA 1: Acolhimento
├── Dia 1: Welcome Day
│   ├── [ ] Setup de equipamentos
│   ├── [ ] Acesso aos sistemas
│   ├── [ ] Conhecer o buddy
│   └── [ ] Tour virtual/presencial
├── Dia 2-3: Imersão na Cultura
│   ├── [ ] Ler Handbook
│   ├── [ ] Entender valores
│   └── [ ] Conhecer áreas
└── Dia 4-5: Entendendo o Negócio
    ├── [ ] Produto e clientes
    ├── [ ] Métricas chave
    └── [ ] Stakeholders

SEMANA 2-4: Ramp Up
├── [ ] Treinamentos da área
├── [ ] Primeiro projeto pequeno
├── [ ] 1:1 com gestor
└── [ ] Feedback 30 dias

MÊS 2-3: Autonomia
├── [ ] Projetos maiores
├── [ ] Goals próprios
├── [ ] Feedback 60 dias
└── [ ] Feedback 90 dias → Fim do período
```

#### Onboarding Tracks por Tipo

| Track | Duração | Foco |
|-------|---------|------|
| **Executivo** | 4 semanas | Stakeholders, decisões, cultura |
| **Técnico** | 6 semanas | Stack, arquitetura, code review |
| **Comercial** | 4 semanas | Produto, pitch, CRM |
| **Operações** | 3 semanas | Processos, ferramentas |
| **Geral** | 2 semanas | Cultura, valores, básico |

#### Integração Connection Layer
```
Events Emitidos:
- onboarding.started { member_id, track }
- onboarding.task.completed { member_id, task_id }
- onboarding.checkpoint { member_id, day: 30|60|90 }
- onboarding.completed { member_id, duration }

Events Consumidos:
- hiring.offer.accepted → Criar onboarding
- academy.course.assigned → Adicionar ao track
- member.buddy.assigned → Notificar buddy
```

---

### 📈 Performance (Gestão de Desempenho)

**Propósito:** Sistema de avaliação contínua — não apenas reviews anuais, mas feedback constante, goals claros e desenvolvimento contínuo.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Goals Management** | OKRs/Goals individuais |
| **Continuous Feedback** | Feedback a qualquer momento |
| **Performance Reviews** | Ciclos formais de avaliação |
| **360 Feedback** | Avaliação multi-fonte |
| **Calibration** | Sessões de calibração |
| **Growth Plans** | Planos de desenvolvimento |
| **Analytics** | Métricas de performance |

#### Ciclo de Performance

```
┌────────────────────────────────────────────────────────────────┐
│                    CICLO TRIMESTRAL                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  INÍCIO DO Q      MID-Q          FIM DO Q       INÍCIO Q+1    │
│      │              │               │               │          │
│      ▼              ▼               ▼               ▼          │
│  ┌───────┐     ┌───────┐      ┌───────┐      ┌───────┐        │
│  │ Goals │     │ Check │      │ Review│      │ Plan  │        │
│  │ Set   │     │  -in  │      │       │      │ Next  │        │
│  └───────┘     └───────┘      └───────┘      └───────┘        │
│      │              │               │               │          │
│      └──── Feedback Contínuo ──────┴───────────────┘          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Tipos de Feedback

| Tipo | Quando | Quem → Quem |
|------|--------|-------------|
| **Praise** | A qualquer momento | Qualquer → Qualquer |
| **Constructive** | A qualquer momento | Gestor → Direto |
| **Peer Review** | Durante ciclos | Par → Par |
| **Upward** | Durante ciclos | Direto → Gestor |
| **Self** | Durante ciclos | Próprio |
| **360** | Anual/Semestral | Todos os ângulos |

#### Performance Review Framework

| Dimensão | Peso | O que avalia |
|----------|------|--------------|
| **Results** | 40% | Entrega de goals |
| **How** | 30% | Alinhamento com valores |
| **Growth** | 20% | Desenvolvimento de skills |
| **Impact** | 10% | Contribuição além do escopo |

#### Rating Scale
```
5 - Excepcional: Supera consistentemente, referência
4 - Acima: Supera expectativas com frequência
3 - Atende: Entrega o esperado consistentemente
2 - Abaixo: Precisa de suporte para entregar
1 - Crítico: Não atende, requer ação imediata
```

#### Integração Connection Layer
```
Events Emitidos:
- performance.goal.created { member_id, goal }
- performance.feedback.given { from, to, type }
- performance.review.completed { member_id, rating }
- performance.promotion.approved { member_id, new_role }

Events Consumidos:
- journey.goal.completed → Atualiza progresso individual
- decisions.decision.made { owner } → Pode virar goal
- academy.skill.acquired → Atualiza competências
```

---

### 🔔 Rituais (Cerimônias de Time)

**Propósito:** Estruturar as reuniões e cerimônias que mantêm o time alinhado, conectado e produtivo.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Ritual Templates** | Templates prontos para cada tipo |
| **Scheduling** | Agenda automática recorrente |
| **Agenda Builder** | Monte a pauta da reunião |
| **Notes** | Atas com action items |
| **Follow-up** | Tracking de ações decididas |
| **Attendance** | Controle de presença |
| **Effectiveness** | Avaliação de utilidade |

#### Tipos de Rituais

| Ritual | Frequência | Duração | Participantes |
|--------|------------|---------|---------------|
| **Daily Standup** | Diário | 15 min | Squad |
| **Weekly Sync** | Semanal | 30-60 min | Área |
| **1:1** | Semanal/Quinzenal | 30 min | Gestor + Direto |
| **Sprint Planning** | Quinzenal | 2h | Squad |
| **Sprint Review** | Quinzenal | 1h | Squad + Stakeholders |
| **Retrospective** | Quinzenal | 1h | Squad |
| **All Hands** | Mensal | 1h | Toda empresa |
| **Town Hall** | Trimestral | 2h | Toda empresa |
| **Quarterly Planning** | Trimestral | 4h | Liderança |
| **Annual Kickoff** | Anual | Full day | Toda empresa |

#### Template de 1:1

```markdown
## 1:1 - [Nome] & [Gestor]
Data: [DATA]
Duração: 30 min

### Check-in Pessoal (5 min)
- Como você está? (1-10)
- Algo te preocupando fora do trabalho?

### Updates (10 min)
- Progresso nos goals
- Bloqueios/desafios
- Wins da semana

### Desenvolvimento (10 min)
- Feedback para você
- Seu feedback para mim
- Skills a desenvolver

### Action Items (5 min)
- [ ] Ação 1 - Owner - Prazo
- [ ] Ação 2 - Owner - Prazo

### Próximo 1:1
Data: [PRÓXIMA DATA]
```

#### IA Features para Rituais

| Feature | Descrição |
|---------|-----------|
| **Agenda Suggester** | Sugere pauta baseada em contexto |
| **Summary Generator** | Gera resumo da reunião |
| **Action Extractor** | Identifica ações decididas |
| **Follow-up Reminder** | Lembra de ações pendentes |
| **Effectiveness Score** | Avalia se a reunião foi produtiva |

#### Integração Connection Layer
```
Events Emitidos:
- ritual.scheduled { ritual_id, type, participants }
- ritual.started { ritual_id }
- ritual.completed { ritual_id, duration, actions_created }
- ritual.action.created { ritual_id, action, owner }

Events Consumidos:
- decisions.ritual.triggered → Agendar ritual
- onboarding.checkpoint → Agendar feedback ritual
- performance.review.due → Agendar review meeting
```

---

### 🌟 Cultura (DNA Organizacional)

**Propósito:** Documentar, viver e escalar a cultura da empresa — valores, comportamentos, reconhecimento e o que nos torna únicos.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Values Canvas** | Definição visual dos valores |
| **Behavior Examples** | O que cada valor significa na prática |
| **Culture Handbook** | Documento vivo da cultura |
| **Recognition System** | Sistema de reconhecimento peer-to-peer |
| **Culture Pulse** | Pesquisas de clima |
| **Traditions** | Documentação de tradições |
| **Wall of Fame** | Reconhecimentos públicos |

#### Estrutura de Valores

```yaml
value:
  name: "Ownership"
  emoji: "🎯"
  tagline: "Age como dono"
  description: "Tomamos responsabilidade pelos resultados, não apenas pelas tarefas"

  behaviors:
    do:
      - "Antecipa problemas e propõe soluções"
      - "Pede feedback proativamente"
      - "Entrega além do combinado"
    dont:
      - "Espera ser cobrado"
      - "Culpa outros por resultados"
      - "Faz apenas o mínimo"

  recognition_tags:
    - "ownership-moment"
    - "dono-do-resultado"
```

#### Sistema de Reconhecimento

| Tipo | Quem dá | Visibilidade | Reward |
|------|---------|--------------|--------|
| **Kudos** | Qualquer pessoa | Público no Slack/Feed | Badge |
| **Value Champion** | Qualquer pessoa | Wall of Fame | Badge especial |
| **Spot Bonus** | Gestores | Privado + Feed | $ |
| **Quarterly Award** | Liderança | All Hands | $ + Troféu |
| **Annual Award** | Liderança | Kickoff | $ + Prêmio |

#### Culture Pulse (Pesquisa de Clima)

| Frequência | Perguntas | Foco |
|------------|-----------|------|
| **Semanal** | 1-3 | Mood check rápido |
| **Mensal** | 5-10 | Engajamento geral |
| **Trimestral** | 20-30 | Profundo (eNPS, valores, gestão) |
| **Anual** | 50+ | Completo (clima organizacional) |

#### Métricas de Cultura

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **eNPS** | Employee Net Promoter Score | > 50 |
| **Values Alignment** | % que se identifica com valores | > 80% |
| **Recognition Rate** | Kudos dados por mês por pessoa | > 2 |
| **Pulse Response** | Taxa de resposta às pesquisas | > 85% |
| **Retention** | Taxa de retenção anual | > 85% |

#### Integração Connection Layer
```
Events Emitidos:
- culture.recognition.given { from, to, value, message }
- culture.pulse.response { member_id, scores }
- culture.handbook.updated { section }

Events Consumidos:
- performance.review.completed → Pode gerar reconhecimento
- member.anniversary → Reconhecimento automático
- ritual.completed { type: "all_hands" } → Anunciar awards
```

---

### 💬 Comunicação (Internal Comms)

**Propósito:** Centralizar a comunicação interna — announcements, atualizações importantes e canais de comunicação.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Announcements** | Comunicados oficiais |
| **News Feed** | Feed de novidades |
| **Channels** | Canais temáticos |
| **Directory** | Quem faz o quê |
| **Search** | Busca em toda comunicação |
| **Templates** | Templates de comunicados |

#### Tipos de Comunicação

| Tipo | Urgência | Canal | Exemplo |
|------|----------|-------|---------|
| **Crítico** | Imediato | Push + Email + Slack | Incidente de segurança |
| **Importante** | 24h | Email + Slack | Mudança de política |
| **Informativo** | 48h | Feed | Nova contratação |
| **Social** | Quando quiser | Feed | Aniversários, wins |

#### Templates de Announcements

| Template | Use Case |
|----------|----------|
| **New Hire** | Anunciar nova contratação |
| **Promotion** | Anunciar promoção |
| **Policy Update** | Atualização de política |
| **Company News** | Notícias da empresa |
| **Event** | Eventos e treinamentos |
| **Celebration** | Conquistas e marcos |

#### Integração Connection Layer
```
Events Emitidos:
- comms.announcement.published { announcement_id, type, audience }
- comms.announcement.read { member_id, announcement_id }

Events Consumidos:
- hiring.offer.accepted → Auto-gerar announcement de new hire
- performance.promotion → Auto-gerar announcement
- culture.award.given → Auto-gerar celebration
```

---

### 👋 Offboarding (Desligamento)

**Propósito:** Garantir que desligamentos sejam feitos com respeito, clareza e captura de conhecimento.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Offboarding Checklist** | Tasks para desligamento |
| **Knowledge Transfer** | Documentação de conhecimento |
| **Exit Interview** | Entrevista de saída estruturada |
| **Access Revocation** | Checklist de acessos a revogar |
| **Alumni Network** | Manter contato com ex-membros |
| **Feedback** | Feedback final bidirecional |

#### Offboarding Checklist

```
COMUNICAÇÃO
├── [ ] Informar gestor direto
├── [ ] Informar RH
├── [ ] Comunicar time (quando apropriado)
└── [ ] Announcement interno

CONHECIMENTO
├── [ ] Documentar projetos em andamento
├── [ ] Handoff para substituto
├── [ ] Atualizar wikis/docs
└── [ ] Gravar vídeos de passagem

ACESSOS
├── [ ] Email corporativo
├── [ ] Slack/Teams
├── [ ] GitHub/GitLab
├── [ ] Ferramentas SaaS
├── [ ] Acessos físicos
└── [ ] Equipamentos

FINANCEIRO
├── [ ] Acerto de férias
├── [ ] Rescisão
├── [ ] Benefícios (plano de saúde, etc.)
└── [ ] Stock options (se aplicável)

DESPEDIDA
├── [ ] Exit interview
├── [ ] Feedback final
├── [ ] Carta de recomendação
├── [ ] Adicionar à rede de alumni
└── [ ] Presente/Reconhecimento de saída
```

#### Exit Interview Questions

```
1. O que te motivou a sair?
2. O que poderíamos ter feito diferente?
3. Como era sua relação com seu gestor?
4. Você se sentia valorizado?
5. A cultura correspondia ao que foi prometido?
6. O que você mais vai sentir falta?
7. O que você menos vai sentir falta?
8. Você recomendaria a empresa para outros?
9. Algum feedback para a liderança?
10. Gostaria de voltar no futuro?
```

#### Integração Connection Layer
```
Events Emitidos:
- offboarding.started { member_id, last_day, reason }
- offboarding.task.completed { member_id, task }
- offboarding.exit_interview.completed { member_id, nps }
- offboarding.completed { member_id }

Events Consumidos:
- offboarding.started → Trigger checklist
- offboarding.completed → Atualizar org, metrics
```

---

### 🔗 Integração com Outros Módulos

| Módulo | Integração |
|--------|------------|
| **Journey** | Goals pessoais linkados aos da empresa |
| **Academy** | Skills adquiridos aparecem no perfil |
| **Decisions (Camada 4)** | Rituais viram Decision Cards |
| **Strategy** | OKRs cascateados para indivíduos |
| **Brand** | Comunicados usam Brand Voice |
| **Finance** | Headcount costs, budget de hiring |

---

### 📊 Métricas do Módulo

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Time to Hire** | Dias da vaga à contratação | < 30 dias |
| **Onboarding Completion** | % que completa onboarding | > 95% |
| **eNPS** | Employee Net Promoter Score | > 50 |
| **1:1 Completion** | % de 1:1s realizados | > 90% |
| **Retention Rate** | Retenção anual | > 85% |
| **Recognition Rate** | Kudos por pessoa/mês | > 2 |
| **Goal Achievement** | % de goals batidos | > 70% |

---

### 🚀 Roadmap de Implementação

| Fase | Items | Prioridade |
|------|-------|------------|
| **MVP** | Dashboard, Membros, Rituais básico | P3 |
| **v1.1** | Onboarding, Performance básico | P3 |
| **v1.2** | Hiring, Cultura, Recognition | P4 |
| **v2.0** | Analytics avançado, AI features | P5 |

---

## ◇ PROTOTYPE OS (Design & Produto)

**Status:** PRD Completo | **Prioridade:** P1

O Prototype OS é a **central de design e produto** do ExímIA OS. Aqui, empreendedores transformam ideias em produtos validados — da descoberta inicial ao handoff para desenvolvimento, com IA assistindo cada etapa do processo.

### Submodules Overview

| Item | Ícone | Descrição | Status |
|------|-------|-----------|--------|
| **Dashboard** | 📊 | Central de comando de projetos | 🆕 |
| **Projetos** | 📁 | Gestão de projetos de produto | 🆕 |
| **Research** | 🔬 | Discovery, hipóteses, entrevistas | 🆕 |
| **PRDs** | 📄 | Geração de PRDs com IA + Brand voice | 🆕 |
| **Backlog** | 📋 | User Stories, Epics, prioritização | 🆕 |
| **Wireframes** | 🖼️ | Sketches e wireframes low-fidelity | 🆕 |
| **Specs** | 🔧 | Especificações técnicas e APIs | 🆕 |
| **Handoff** | 🤝 | Exportação para desenvolvimento | 🆕 |

---

### 📊 Dashboard (Central de Projetos)

**Propósito:** Visão unificada de todos os projetos de produto em andamento, métricas de progresso e próximos passos.

#### Métricas Principais

| Métrica | Descrição |
|---------|-----------|
| **Projetos Ativos** | Total de projetos em andamento |
| **Por Fase** | Distribuição por fase (Discovery → Handoff) |
| **Stories Ready** | Stories prontas para desenvolvimento |
| **Velocity** | Velocidade média de entrega |

#### Widgets do Dashboard

| Widget | Descrição |
|--------|-----------|
| **Project Pipeline** | Kanban de projetos por fase |
| **Team Allocation** | Quem está em qual projeto |
| **Upcoming Deadlines** | Prazos próximos |
| **Recent Activity** | Últimas atualizações |
| **Discovery Insights** | Insights recentes de pesquisa |
| **PRD Status** | PRDs em aprovação |

#### Integração Connection Layer
```
Events Emitidos:
- prototype.dashboard.viewed
- prototype.project.filtered

Events Consumidos:
- project.phase.changed → Atualiza pipeline
- story.created → Atualiza contadores
- prd.approved → Move projeto para próxima fase
```

---

### 📁 Projetos (Gestão de Projetos de Produto)

**Propósito:** Organizar e gerenciar projetos de produto do início ao fim, com fases claras e artefatos rastreáveis.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Project Hub** | Central de cada projeto com todos os artefatos |
| **Phase Tracking** | Acompanhamento de fases do projeto |
| **Artifact Links** | Conexão entre PRDs, wireframes, specs, stories |
| **Team Management** | Atribuição de membros ao projeto |
| **Timeline** | Roadmap visual do projeto |
| **Metrics** | Métricas de saúde do projeto |

#### Fases do Projeto

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT PROJECT PHASES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  💡 IDEATION  →  🔬 DISCOVERY  →  📄 DEFINITION                 │
│  Hipótese        Validação        PRD completo                  │
│                                                                  │
│        ↓                                                         │
│                                                                  │
│  🖼️ DESIGN   →  🔧 SPECIFICATION  →  🤝 HANDOFF                │
│  Wireframes      Tech specs          Dev ready                  │
│                                                                  │
│        ↓                                                         │
│                                                                  │
│  ✅ COMPLETED                                                    │
│  Entregue para desenvolvimento                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Estrutura do Projeto

```yaml
project:
  id: "proj_123"
  name: "Dashboard v2.0"
  description: "Redesign do dashboard principal"
  status: "definition"
  phase: "prd"

  # Datas
  started_at: "2026-01-15"
  target_date: "2026-03-01"

  # Equipe
  owner: "maria_pm"
  members:
    - { id: "joao_dev", role: "tech_lead" }
    - { id: "ana_design", role: "designer" }

  # Artefatos
  artifacts:
    hypotheses: 3
    interviews: 5
    prd: "prd_456"
    wireframes: "wire_789"
    stories: 12
    tech_spec: "spec_012"

  # Métricas
  metrics:
    stories_ready: 8
    stories_done: 0
    estimated_points: 45
```

#### Integração Connection Layer
```
Events Emitidos:
- project.created { project_id, name, owner }
- project.phase.changed { project_id, from, to }
- project.artifact.linked { project_id, artifact_type, artifact_id }
- project.completed { project_id, duration }

Events Consumidos:
- prd.approved → Avança para Design
- wireframe.approved → Avança para Specification
- spec.approved → Avança para Handoff
- handoff.exported → Marca como Completed
```

---

### 🔬 Research (Product Discovery)

**Propósito:** Validar hipóteses, conduzir entrevistas com clientes, e sintetizar insights antes de escrever código.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Hypothesis Canvas** | Defina e valide hipóteses |
| **Interview Hub** | Agende e conduza entrevistas |
| **Interview Scripts** | Templates de roteiro com IA |
| **Transcription** | Transcrição automática de calls |
| **Insight Synthesis** | IA extrai insights de entrevistas |
| **Competitive Analysis** | Análise de concorrentes com IA |
| **Validation Board** | Acompanhe status de validação |

#### Hypothesis Canvas

```
┌─────────────────────────────────────────────────────────────────┐
│                    HYPOTHESIS CANVAS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WE BELIEVE THAT...                                             │
│  [Usuários precisam de X feature]                               │
│                                                                  │
│  FOR...                                                          │
│  [Persona: Empreendedores solo]                                 │
│                                                                  │
│  WE WILL KNOW WE ARE RIGHT WHEN...                              │
│  [70% dos entrevistados confirmam a dor]                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Status: [🟡 In Validation]                                     │
│  Confidence: 65%                                                 │
│  Evidence: 4/6 interviews support                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Pipeline de Entrevistas

```
SCHEDULED → CONDUCTED → TRANSCRIBED → ANALYZED → INSIGHTS EXTRACTED
    │           │            │             │              │
    │           │            │             │              └→ Link to backlog
    │           │            │             └→ IA Analysis
    │           │            └→ Whisper/Assembly AI
    │           └→ Recording
    └→ Calendar invite
```

#### IA Features para Research

| Feature | Descrição |
|---------|-----------|
| **Script Generator** | Gera roteiro de entrevista baseado nas hipóteses |
| **Live Transcription** | Transcreve em tempo real |
| **Sentiment Analysis** | Identifica sentimentos nas respostas |
| **Key Quote Extractor** | Destaca citações importantes |
| **Pattern Finder** | Encontra padrões entre entrevistas |
| **Insight Synthesizer** | Resume insights acionáveis |

#### Integração Connection Layer
```
Events Emitidos:
- research.hypothesis.created { hypothesis_id, project_id }
- research.hypothesis.validated { hypothesis_id, result, confidence }
- research.interview.completed { interview_id, insights_count }
- research.insight.extracted { insight_id, source_interviews[] }

Events Consumidos:
- inbox.captured { type: "customer_feedback" } → Sugere criar hipótese
- project.created → Sugere iniciar discovery
```

---

### 📄 PRDs (Product Requirement Documents)

**Propósito:** Gerar PRDs completos e estruturados com assistência de IA, mantendo consistência com Brand Voice.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **PRD Templates** | Templates por tipo (Feature, Product, Integration) |
| **AI Generator** | Gera PRD completo a partir de briefing |
| **Section Editor** | Editor por seção com sugestões |
| **Version Control** | Histórico de versões e diff |
| **Approval Flow** | Workflow de aprovação |
| **Export** | PDF, Notion, Markdown |
| **Story Extraction** | Extrai User Stories do PRD |

#### Estrutura do PRD (12 Seções)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRD STRUCTURE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. OVERVIEW                     7. USER FLOWS                  │
│     - Problem statement             - Journey maps              │
│     - Solution summary              - Edge cases               │
│                                                                  │
│  2. OBJECTIVES                   8. TECHNICAL REQUIREMENTS      │
│     - Goals & success metrics       - Architecture notes        │
│     - Non-goals                     - Integrations             │
│                                                                  │
│  3. BACKGROUND                   9. SECURITY & PRIVACY         │
│     - Research insights             - Data handling            │
│     - Competitive analysis          - Compliance               │
│                                                                  │
│  4. USER PERSONAS                10. ANALYTICS                  │
│     - Target users                  - Events to track          │
│     - Jobs to be done               - Success metrics          │
│                                                                  │
│  5. SCOPE                        11. ROLLOUT PLAN              │
│     - In scope                      - Phases                   │
│     - Out of scope                  - Feature flags            │
│     - Future considerations                                     │
│                                                                  │
│  6. REQUIREMENTS                 12. APPENDIX                   │
│     - Functional                    - Wireframes               │
│     - Non-functional                - References               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Templates de PRD

| Template | Use Case | Seções |
|----------|----------|--------|
| **Feature** | Nova funcionalidade | Completo |
| **Product** | Novo produto/módulo | Expandido |
| **Integration** | Integração externa | Foco técnico |
| **Improvement** | Melhoria existente | Simplificado |
| **Technical** | Tech-led initiative | Foco arquitetura |
| **Mobile** | Feature mobile | + Platform specifics |

#### IA Features para PRD

| Feature | Descrição |
|---------|-----------|
| **PRD Architect** | Gera estrutura completa do PRD |
| **Section Writer** | Escreve cada seção com contexto |
| **Competitor Scanner** | Analisa concorrentes para Background |
| **Story Generator** | Extrai User Stories automaticamente |
| **NFR Suggester** | Sugere requisitos não-funcionais |
| **Consistency Checker** | Verifica consistência entre seções |

#### Integração Connection Layer
```
Events Emitidos:
- prd.created { prd_id, project_id, template }
- prd.section.completed { prd_id, section }
- prd.submitted_for_review { prd_id, reviewers[] }
- prd.approved { prd_id, approved_by }
- prd.stories.extracted { prd_id, story_count }

Events Consumidos:
- research.insight.extracted → Sugere adicionar ao Background
- brand.voice.updated → Oferece reprocessar linguagem
- project.phase.changed { to: "definition" } → Iniciar PRD
```

---

### 📋 Backlog (User Stories & Epics)

**Propósito:** Gerenciar o backlog de produto com hierarquia clara, priorização inteligente e rastreabilidade completa.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Epic/Feature/Story** | Hierarquia completa |
| **Story Generator** | IA gera stories de PRD ou descrição |
| **Acceptance Criteria** | Gherkin ou checklist |
| **Planning Poker** | Estimativas colaborativas |
| **Prioritization** | WSJF, RICE, Value/Effort |
| **Sprint Management** | Planejamento de sprints |
| **Velocity Tracking** | Métricas de entrega |

#### Hierarquia do Backlog

```
THEME (Strategic)
└── EPIC (Large Initiative)
    └── FEATURE (Deliverable)
        └── STORY (User Story)
            └── TASK (Implementation)
```

#### Planning Poker com IA

| Feature | Descrição |
|---------|-----------|
| **AI Estimate** | IA sugere pontos baseado em stories similares |
| **Similar Stories** | Mostra stories parecidas já estimadas |
| **Consensus Helper** | Detecta divergências e sugere discussão |
| **Historical Data** | Usa velocidade passada para calibrar |

#### Métodos de Priorização

| Método | Fórmula | Quando Usar |
|--------|---------|-------------|
| **MoSCoW** | Must/Should/Could/Won't | Simples, poucos itens |
| **WSJF** | (Value + Time + Risk) / Size | SAFe, fluxo contínuo |
| **RICE** | Reach × Impact × Confidence / Effort | Muitos itens, dados |
| **Value/Effort** | Value / Effort | Visual, rápido |

#### Integração Connection Layer
```
Events Emitidos:
- backlog.story.created { story_id, epic_id, ai_generated }
- backlog.story.estimated { story_id, points, method }
- backlog.story.moved { story_id, from_status, to_status }
- backlog.sprint.completed { sprint_id, velocity }

Events Consumidos:
- prd.stories.extracted → Criar stories no backlog
- research.insight.validated → Sugere criar story
- handoff.github.exported → Link com issue externa
```

---

### 🖼️ Wireframes (Low-Fidelity Design)

**Propósito:** Criar wireframes rápidos e descartáveis para validar estrutura e fluxo antes do design visual.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Canvas Editor** | Editor visual drag-and-drop |
| **Component Library** | Primitivos e componentes prontos |
| **Flow Mapping** | Conecte telas com fluxos |
| **Annotations** | Notas e comentários nas telas |
| **Prototype Mode** | Preview interativo |
| **Version Compare** | Compare versões lado a lado |
| **AI Generator** | Gera wireframe de descrição |

#### Componentes Disponíveis

```
PRIMITIVES       CONTAINERS       NAVIGATION        INPUTS
─────────────    ─────────────    ─────────────    ─────────────
□ Rectangle      ┌┐ Card          ≡ Navbar         [___] Text
○ Circle         ╔╗ Modal         ⌄ Tabs           [▼] Select
T Text           ▭ Section        ▣ Sidebar        [ ] Checkbox
─ Line           ├─ List          ... Pagination   [●] Radio
→ Arrow          ┌┬┐ Grid         < Breadcrumb     [Toggle]
```

#### Flow Mapping

```
┌─────────┐       ┌─────────┐       ┌─────────┐
│ LANDING │──────▶│  LOGIN  │──────▶│ VERIFY  │
│  PAGE   │       │  PAGE   │       │  EMAIL  │
└─────────┘       └────┬────┘       └────┬────┘
     │                 │                 │
     │                 │ Error           │ Success
     ▼                 ▼                 ▼
┌─────────┐       ┌─────────┐       ┌─────────┐
│ SIGNUP  │       │  ERROR  │       │DASHBOARD│
│  PAGE   │       │  MODAL  │       │  HOME   │
└─────────┘       └─────────┘       └─────────┘
```

#### IA Features para Wireframes

| Feature | Descrição |
|---------|-----------|
| **Layout Generator** | Gera wireframe de descrição textual |
| **Component Suggester** | Sugere componentes baseado no contexto |
| **Flow Analyzer** | Detecta dead-ends e inconsistências |
| **Improvement Tips** | Sugere melhorias de UX |

#### Integração Connection Layer
```
Events Emitidos:
- wireframe.created { wireframe_id, project_id, screen_count }
- wireframe.annotated { wireframe_id, annotation_id }
- wireframe.approved { wireframe_id }
- wireframe.linked { wireframe_id, story_id }

Events Consumidos:
- prd.approved → Sugere criar wireframes
- backlog.story.created { ui_related } → Link wireframe
```

---

### 🔧 Specs (Technical Specifications)

**Propósito:** Traduzir PRDs e wireframes em especificações técnicas detalhadas, incluindo APIs, data models e arquitetura.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **API Designer** | Define endpoints OpenAPI/Swagger |
| **Data Modeler** | ERD e TypeScript interfaces |
| **Architecture Diagrams** | C4, sequence, component |
| **NFR Manager** | Requisitos não-funcionais |
| **Test Criteria** | Cenários de teste |
| **AI Generator** | Gera specs de PRD |

#### Estrutura da Spec

```
TECHNICAL SPECIFICATION
├── API Endpoints
│   ├── OpenAPI/Swagger
│   ├── Request/Response schemas
│   └── Error handling
├── Data Models
│   ├── TypeScript interfaces
│   ├── Database schema (SQL)
│   └── Migrations
├── Architecture
│   ├── Component diagram
│   ├── Sequence diagrams
│   └── Data flow
├── Non-Functional Requirements
│   ├── Performance targets
│   ├── Security requirements
│   └── Scalability
└── Test Criteria
    ├── Unit test scenarios
    ├── Integration tests
    └── E2E scenarios
```

#### IA Features para Specs

| Feature | Descrição |
|---------|-----------|
| **Spec Generator** | Gera spec completa de PRD |
| **API Extractor** | Identifica endpoints necessários |
| **Schema Generator** | Cria TypeScript types de exemplos |
| **NFR Suggester** | Sugere requisitos não-funcionais |
| **Diagram Generator** | Cria diagramas Mermaid |

#### Integração Connection Layer
```
Events Emitidos:
- spec.created { spec_id, project_id }
- spec.api.added { spec_id, endpoint }
- spec.approved { spec_id }
- spec.types.exported { spec_id, format }

Events Consumidos:
- wireframe.approved → Iniciar spec
- prd.approved → Gerar spec base
```

---

### 🤝 Handoff (Developer Handoff)

**Propósito:** Empacotar todos os artefatos e exportar para ferramentas de desenvolvimento (GitHub, Jira, Notion).

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Package Builder** | Monta pacote com todos artefatos |
| **GitHub Export** | Cria issues, milestones, project |
| **Jira Export** | Cria tickets e epics |
| **Notion Export** | Cria página de documentação |
| **Asset Export** | Design tokens, icons, wireframes |
| **Changelog** | Gera release notes |

#### Conteúdo do Pacote Handoff

```
📦 handoff-package/
├── 📋 README.md           # Overview & quick start
├── 📁 docs/
│   ├── PRD.md             # Product requirements
│   ├── TECH_SPEC.md       # Technical spec
│   ├── USER_STORIES.md    # All stories
│   └── NFRs.md            # Non-functional reqs
├── 📁 design/
│   ├── wireframes/        # Screen exports (PNG/SVG)
│   ├── assets/icons/      # Icon exports
│   └── tokens/            # Design tokens (CSS/JSON)
├── 📁 api/
│   ├── openapi.yaml       # API specification
│   └── types.ts           # TypeScript interfaces
├── 📁 database/
│   ├── schema.sql         # DB schema
│   └── migrations/        # Migration files
└── 📁 tests/
    └── test-cases.md      # Test scenarios
```

#### Export Destinations

| Destination | Actions |
|-------------|---------|
| **GitHub** | Create issues, milestone, project board, labels |
| **Jira** | Create tickets, epic, sprint, components |
| **Linear** | Create issues, project, cycle |
| **Notion** | Create page with full documentation |
| **Confluence** | Create space with docs |
| **ZIP** | Download all assets |

#### GitHub Issue Template

```markdown
## User Story

**Como** [persona]
**Quero** [ação]
**Para que** [benefício]

## Acceptance Criteria

- [ ] Dado que... Quando... Então...
- [ ] Dado que... Quando... Então...

## Technical Notes

- API: `GET /api/v1/endpoint`
- See: [Tech Spec](#link)

## Design References

| Screen | Link |
|--------|------|
| Dashboard | [View Wireframe](#) |

---
📦 Handoff Package: Dashboard v2.1
🔗 PRD: PRD-003
📊 Story Points: 5
```

#### Integração Connection Layer
```
Events Emitidos:
- handoff.package.created { package_id, project_id }
- handoff.github.exported { package_id, issues_count, milestone }
- handoff.notion.exported { package_id, page_url }
- handoff.completed { package_id, destinations[] }

Events Consumidos:
- spec.approved → Package ready for export
- backlog.story.ready → Include in package
```

---

### 🤖 AI Agents Pipeline

O Prototype OS utiliza um pipeline de 6 agentes especializados:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AGENTS PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 🔬 DISCOVERY AGENT                                          │
│     - Gera hipóteses de research                                │
│     - Cria scripts de entrevista                                │
│     - Analisa transcrições                                      │
│                                                                  │
│  2. 📄 PRD ARCHITECT                                            │
│     - Estrutura PRD completo                                    │
│     - Escreve cada seção                                        │
│     - Mantém Brand Voice                                        │
│                                                                  │
│  3. 📖 STORY WRITER                                             │
│     - Extrai stories do PRD                                     │
│     - Gera acceptance criteria (Gherkin)                        │
│     - Sugere estimativas                                        │
│                                                                  │
│  4. 🖼️ WIREFRAME ASSISTANT                                     │
│     - Gera layouts de descrição                                 │
│     - Sugere componentes                                        │
│     - Analisa fluxos                                            │
│                                                                  │
│  5. 🔧 SPEC ENGINEER                                            │
│     - Gera API specs (OpenAPI)                                  │
│     - Cria data models                                          │
│     - Define NFRs                                               │
│                                                                  │
│  6. 📦 HANDOFF PACKAGER                                         │
│     - Monta pacote final                                        │
│     - Formata para cada destination                             │
│     - Gera changelog                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 📊 Métricas do Módulo

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Discovery to Handoff** | Tempo total do processo | < 4 semanas |
| **PRD Approval Time** | Tempo para aprovar PRD | < 3 dias |
| **Stories per PRD** | Média de stories extraídas | 8-15 |
| **Spec Coverage** | % de stories com spec completa | > 90% |
| **Handoff Success** | % exportados sem erro | > 95% |
| **AI Acceptance Rate** | % de sugestões IA aceitas | > 70% |

---

### 🔗 Integração com Outros Módulos

| Módulo | Integração |
|--------|------------|
| **Brand** | Voice injetado em PRDs, Handoff exports |
| **Journey** | Goals de produto linkados |
| **Strategy** | Iniciativas geram projetos |
| **Team** | Alocação de membros |
| **Inbox** | Ideias capturadas viram hipóteses |
| **Academy** | Cursos sobre PM/Design |

---

### 🚀 Roadmap de Implementação

| Fase | Items | Prioridade |
|------|-------|------------|
| **MVP** | Projects, PRD Generator, Backlog básico | P1 |
| **v1.1** | Research, Wireframe Builder | P1 |
| **v1.2** | Specs, Planning Poker | P2 |
| **v2.0** | Handoff, GitHub/Jira export | P2 |
| **v2.1** | AI Pipeline completo | P3 |

---

## 🎨 IDENTIDADE & MARCA (Brand)

**Status:** PRD Completo | **Prioridade:** P1

### Submodules

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Overview** | 🎨 | Brand dashboard |
| **Brand Voice** | 🗣️ | Tom, personalidade, guidelines |
| **Design System** | 🎨 | Tokens, cores, tipografia |
| **Visual Identity** | 👁️ | Logo, assets visuais |
| **Guidelines** | 📋 | Brand book digital |
| **Assets** | 📦 | Banco de mídia |

### Conexões
- Brand voice → Injected in all AI generations
- Design tokens → PrototypOS exports
- Completou curso → Skill added to profile

---

## ✨ CRIAÇÃO & CONTEÚDO (Content Creation)

**Status:** 🟡 Parcial (só Course Creator) | **Prioridade:** P1

O módulo de Criação & Conteúdo é a **fábrica de produção intelectual** do ExímIA OS. Aqui, empreendedores transformam conhecimento em ativos digitais — cursos, ebooks, posts, newsletters — tudo com Brand Voice injetado automaticamente e IA assistindo cada etapa.

### Submodules Overview

| Item | Ícone | Descrição | Status |
|------|-------|-----------|--------|
| **Dashboard** | 📊 | Central de comando de todo conteúdo | 🆕 |
| **Course Creator** | 🎓 | Criador de cursos com IA Socrática | ✅ Existe |
| **Curador[IA]** | 🔍 | Curadoria e organização de conteúdo fonte | 🆕 |
| **Ebook Generator** | 📚 | Transforme conhecimento em ebooks | 🆕 |
| **Social Media** | 📱 | Gestão de posts e calendário editorial | 🆕 |
| **Newsletter Builder** | 📧 | Criação de emails e sequências | 🆕 |
| **Vídeo Scripts** | 🎬 | Roteiros para YouTube, Reels, Stories | 🆕 |
| **Copy Bank** | 📝 | Repositório de copies aprovadas | 🆕 |

---

### 📊 Dashboard (Central de Conteúdo)

**Propósito:** Visão unificada de todo conteúdo em produção, publicado e planejado.

#### Métricas Principais
| Métrica | Descrição |
|---------|-----------|
| **Em Produção** | Conteúdos em cada estágio do pipeline |
| **Publicados** | Total por tipo (cursos, posts, ebooks) |
| **Performance** | Views, engagement, conversões |
| **Próximos** | Calendário dos próximos 7 dias |

#### Features
- **Kanban View:** Visualize conteúdos por estágio (Briefing → Pesquisa → Geração → Revisão → Publicado)
- **Calendar View:** Calendário editorial unificado
- **Analytics:** Performance de cada peça de conteúdo
- **Quick Actions:** Criar novo conteúdo, republicar, arquivar

#### Integração Connection Layer
```
Events Emitidos:
- content.dashboard.viewed
- content.bulk_action.executed

Events Consumidos:
- content.*.created → Atualiza contadores
- content.*.published → Move para "Publicados"
```

---

### 🎓 Course Creator (Criador de Cursos)

**Status:** ✅ Implementado | **Base:** X_Agent LXD Architect

**Propósito:** Criar cursos completos com estrutura pedagógica, perguntas socráticas e materiais de apoio — tudo gerado por IA com supervisão humana.

#### Pipeline de 6 Agentes
```
1. Creator Agent    → Gera estrutura inicial do curso
2. Socrates Agent   → Cria perguntas para reflexão
3. Analyst Agent    → Valida coerência pedagógica
4. Editor Agent     → Refina linguagem e Brand Voice
5. Tester Agent     → Simula aluno e testa fluxo
6. Organizer Agent  → Finaliza e prepara para export
```

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Course Outline** | IA sugere módulos e lições baseado no tema |
| **Lesson Generator** | Gera conteúdo de cada lição com exemplos |
| **Quiz Builder** | Cria quizzes e avaliações automáticas |
| **Socratic Questions** | Perguntas que provocam reflexão (não respostas) |
| **Resource Linker** | Sugere materiais complementares da Academy |
| **Export Formats** | SCORM, PDF, Moodle, Harven.AI format |

#### User Flow
```
1. User define tema/objetivo
2. IA gera outline com módulos e lições
3. User revisa e ajusta estrutura
4. IA gera conteúdo de cada lição
5. User adiciona exemplos pessoais
6. IA cria quizzes e Socratic questions
7. Preview e teste do curso
8. Publicar na Academy ou exportar
```

#### Integração Connection Layer
```
Events Emitidos:
- course.created { course_id, title, modules_count }
- course.lesson.generated { lesson_id, tokens_used }
- course.published { course_id, target: "academy" | "external" }

Events Consumidos:
- brand.voice.updated → Reprocessa linguagem
- goal.created { topic } → Sugere criar curso relacionado
```

---

### 🔍 Curador[IA] (Curadoria Inteligente)

**Propósito:** Organizar, classificar e enriquecer conteúdo-fonte antes de transformá-lo em produtos. É o "pré-processador" que alimenta todos os outros geradores.

#### O Problema que Resolve
> "Tenho 50 transcrições de vídeo, 30 artigos salvos, 10 podcasts. Onde começo?"

O Curador[IA] transforma caos informacional em conhecimento estruturado.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Import Hub** | Importa de múltiplas fontes (YouTube, PDFs, URLs, Notion) |
| **Auto-Tag** | IA classifica e tageia automaticamente |
| **Summary Generator** | Resumo executivo de cada peça |
| **Key Insights** | Extrai os 5-10 principais insights |
| **Duplicate Detector** | Identifica conteúdo repetido/similar |
| **Content Graph** | Visualiza conexões entre peças |
| **Source Library** | Biblioteca organizada por tema/autor/tipo |

#### Tipos de Fonte Suportados
| Tipo | Descrição | Processamento |
|------|-----------|---------------|
| **YouTube** | URLs de vídeos | Transcrição + Summary |
| **PDF** | Documentos | OCR + Extração |
| **URLs** | Artigos web | Scraping + Clean |
| **Audio** | MP3, podcasts | Whisper transcription |
| **Notion** | Páginas | API import |
| **Text** | Raw paste | Estruturação |

#### User Flow
```
1. User importa conteúdo (URL, upload, paste)
2. IA processa e extrai metadados
3. IA sugere tags e categorias
4. User confirma ou ajusta
5. Conteúdo entra na Source Library
6. Disponível para usar em Course, Ebook, Posts
```

#### Integração Connection Layer
```
Events Emitidos:
- source.imported { source_id, type, word_count }
- source.processed { source_id, insights_count, tags }
- source.linked { source_id, target_content_id }

Events Consumidos:
- inbox.captured { type: "url" } → Sugere importar para curadoria
- journey.book.added → Sincroniza com Source Library
```

---

### 📚 Ebook Generator (Gerador de Ebooks)

**Propósito:** Transformar conhecimento em ebooks profissionais — lead magnets, materiais de curso, ou produtos vendáveis.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **From Sources** | Compila ebook a partir de conteúdos curados |
| **From Scratch** | Gera ebook do zero baseado em outline |
| **Chapter Generator** | IA escreve cada capítulo |
| **Style Presets** | Lead Magnet, Deep Dive, Workbook, Guide |
| **Design Templates** | Templates visuais prontos |
| **Cover Generator** | IA sugere capas (integra com DALL-E/Midjourney) |
| **Export** | PDF, EPUB, Kindle (MOBI), Web |

#### Tipos de Ebook

| Tipo | Páginas | Use Case |
|------|---------|----------|
| **Lead Magnet** | 10-20 | Captura de email |
| **Mini Guide** | 20-40 | Produto de entrada |
| **Deep Dive** | 50-100 | Material de curso |
| **Full Book** | 100+ | Produto premium/publicação |

#### Pipeline de Geração
```
1. Definir objetivo e público
2. Selecionar sources ou criar outline
3. IA gera estrutura de capítulos
4. IA escreve cada capítulo (com Brand Voice)
5. User revisa e edita
6. Aplicar design template
7. Gerar capa
8. Export final
```

#### User Flow Detalhado
```
START → Objetivo do Ebook
      → [Usar Sources?]
           YES → Selecionar do Curador[IA]
           NO  → Definir tema manual
      → IA gera outline (3-10 capítulos)
      → User ajusta estrutura
      → [Por capítulo]
           → IA gera rascunho
           → User revisa/edita
           → Mark as "Done"
      → Escolher template visual
      → Gerar/Upload capa
      → Preview completo
      → Export (PDF/EPUB/Web)
END
```

#### Integração Connection Layer
```
Events Emitidos:
- ebook.created { ebook_id, type, chapter_count }
- ebook.chapter.generated { chapter_id, word_count }
- ebook.published { ebook_id, format, download_url }

Events Consumidos:
- course.published → Sugere criar ebook complementar
- source.imported { tag: "ebook-worthy" } → Sugere compilar
- brand.voice.updated → Oferece regenerar com novo tom
```

---

### 📱 Social Media (Gestão de Redes Sociais)

**Propósito:** Criar, agendar e gerenciar posts para todas as redes sociais — com IA que repurpõe conteúdo automaticamente.

#### Plataformas Suportadas

| Plataforma | Formatos | Características |
|------------|----------|-----------------|
| **Instagram** | Feed, Stories, Reels, Carousel | Visual-first, hashtags |
| **LinkedIn** | Posts, Articles, Carousel | Profissional, thought leadership |
| **Twitter/X** | Tweets, Threads | Conciso, viral |
| **YouTube** | Community posts | Engagement com subscribers |
| **TikTok** | Descrições, scripts | Gen-Z, trends |

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Content Calendar** | Calendário visual de publicações |
| **Post Generator** | IA cria posts baseado em tema/fonte |
| **Repurpose Engine** | Transforma 1 conteúdo em posts para todas redes |
| **Carousel Builder** | Cria carrosséis com design automático |
| **Hashtag Suggester** | Sugere hashtags relevantes |
| **Best Time** | Sugere melhor horário baseado em dados |
| **Batch Create** | Cria semana/mês de conteúdo de uma vez |
| **Template Library** | Templates de posts por categoria |

#### Repurpose Engine (Diferencial)
```
Input: 1 artigo de blog (2000 palavras)

Output automático:
├── 1 LinkedIn post (long-form)
├── 1 Twitter thread (10 tweets)
├── 5 Instagram carousel slides
├── 3 Instagram Stories
├── 1 YouTube Community post
└── 1 Newsletter teaser
```

#### User Flow
```
1. Criar novo post OU selecionar fonte para repurpose
2. Escolher plataforma(s) destino
3. IA gera rascunho adaptado para cada rede
4. User edita e ajusta
5. Adicionar mídia (imagem/vídeo)
6. Agendar ou publicar
7. Tracking de performance
```

#### Integração Connection Layer
```
Events Emitidos:
- social.post.created { post_id, platforms[], type }
- social.post.scheduled { post_id, scheduled_at }
- social.post.published { post_id, platform, engagement }
- social.batch.created { batch_id, posts_count }

Events Consumidos:
- ebook.published → Sugere criar posts promocionais
- course.lesson.generated → Sugere transformar em carrossel
- brand.voice.updated → Alertar sobre posts pendentes
```

---

### 📧 Newsletter Builder (Criador de Newsletters)

**Propósito:** Criar newsletters e sequências de email que engajam e convertem — com templates prontos e IA que escreve no seu tom.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Email Editor** | Editor visual drag-and-drop |
| **AI Writer** | IA escreve email completo ou por seção |
| **Template Library** | Templates por objetivo (welcome, nurture, promo) |
| **Sequence Builder** | Cria automações de email |
| **Subject Line Generator** | IA gera 10 opções de assunto |
| **Preview** | Preview mobile/desktop |
| **Export** | HTML para usar em qualquer ESP |

#### Tipos de Email

| Tipo | Use Case | Estrutura |
|------|----------|-----------|
| **Welcome** | Primeiro contato | Apresentação + CTA |
| **Nurture** | Educação | Valor + Próximo passo |
| **Promo** | Vendas | Oferta + Urgência |
| **Newsletter** | Recorrente | Curadoria + Insights |
| **Re-engagement** | Inativos | Win-back |
| **Launch** | Lançamentos | Sequência completa |

#### Sequence Builder (Automações)
```
Exemplo: Welcome Sequence (7 dias)

Day 0: Welcome Email (apresentação)
Day 1: Quick Win (entrega valor imediato)
Day 3: Story Email (sua história)
Day 5: Problema/Solução (agite o problema)
Day 7: Soft CTA (convite para próximo passo)
```

#### User Flow
```
1. Escolher tipo (single ou sequence)
2. Definir objetivo e público
3. IA sugere estrutura
4. IA escreve rascunho
5. User edita no visual editor
6. Preview e teste
7. Export HTML ou conectar ESP
```

#### Integração Connection Layer
```
Events Emitidos:
- newsletter.created { newsletter_id, type }
- newsletter.sequence.created { sequence_id, emails_count }
- newsletter.exported { newsletter_id, format, esp }

Events Consumidos:
- ebook.published → Sugere criar sequence de nurture
- social.post.published { performance: "high" } → Sugere newsletter
- lead.captured → Trigger welcome sequence
```

---

### 🎬 Vídeo Scripts (Roteiros para Vídeo)

**Propósito:** Criar roteiros profissionais para qualquer formato de vídeo — YouTube, Reels, Stories, webinars, VSLs.

#### Formatos Suportados

| Formato | Duração | Estrutura |
|---------|---------|-----------|
| **YouTube Long** | 10-30 min | Hook → Conteúdo → CTA |
| **YouTube Short** | < 60s | Hook rápido → Valor → CTA |
| **Instagram Reels** | 15-90s | Pattern interrupt → Conteúdo |
| **TikTok** | 15-60s | Trend-based, casual |
| **Stories** | 15s/slide | Sequência de slides |
| **Webinar** | 45-90 min | Educação → Pitch |
| **VSL** | 15-45 min | Sales structure |

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Format Selector** | Escolha formato, IA adapta estrutura |
| **Hook Generator** | 10 opções de abertura que prendem |
| **Script Writer** | Roteiro completo com timings |
| **B-Roll Suggestions** | Sugere imagens/clips de apoio |
| **Teleprompter Mode** | View otimizada para gravar |
| **Shot List** | Lista de tomadas necessárias |
| **Thumbnail Ideas** | Sugere thumbnails para YouTube |

#### Estrutura do Roteiro YouTube
```
[00:00-00:15] HOOK
    - Pattern interrupt
    - Promise do vídeo

[00:15-01:00] INTRO
    - Contexto rápido
    - Preview do que vem

[01:00-08:00] CONTEÚDO
    - Ponto 1 (com exemplo)
    - Ponto 2 (com exemplo)
    - Ponto 3 (com exemplo)

[08:00-09:00] RECAP
    - Resumo dos pontos
    - Insight principal

[09:00-10:00] CTA
    - Call to action claro
    - Próximo vídeo sugerido
```

#### User Flow
```
1. Escolher formato (YouTube, Reels, etc.)
2. Definir tema e objetivo
3. IA gera outline com timestamps
4. User ajusta estrutura
5. IA escreve roteiro completo
6. User edita e personaliza
7. Adicionar notas de produção
8. Export para gravação (PDF/Teleprompter)
```

#### Integração Connection Layer
```
Events Emitidos:
- video_script.created { script_id, format, duration }
- video_script.exported { script_id, format }

Events Consumidos:
- course.lesson.generated → Sugere criar vídeo explicativo
- ebook.chapter.generated → Sugere transformar em YouTube
- social.post.published { type: "carousel", performance: "high" }
    → Sugere criar Reels sobre o tema
```

---

### 📝 Copy Bank (Banco de Copies)

**Propósito:** Repositório centralizado de todas as copies aprovadas — headlines, CTAs, emails, ads — para reuso e consistência.

#### O Problema que Resolve
> "Aquela headline que funcionou... onde foi que eu escrevi?"

Copy Bank é a memória de todas as suas melhores copies.

#### Features Detalhadas

| Feature | Descrição |
|---------|-----------|
| **Categorização** | Organize por tipo, campanha, performance |
| **Tags** | Sistema de tags para busca rápida |
| **Performance Data** | Métricas quando disponível (CTR, conversão) |
| **Versioning** | Histórico de versões de cada copy |
| **Quick Insert** | Insira copies em outros módulos |
| **A/B History** | Registro de testes A/B |
| **AI Variations** | Gere variações de copies existentes |

#### Categorias de Copy

| Categoria | Exemplos |
|-----------|----------|
| **Headlines** | Títulos, subject lines, hooks |
| **CTAs** | Botões, calls to action |
| **Emails** | Templates de email aprovados |
| **Ads** | Copies de anúncios |
| **Landing Pages** | Sections de LPs |
| **Sales** | Argumentos de venda, objection handlers |
| **Social** | Posts que performaram bem |

#### Estrutura de uma Copy
```yaml
copy:
  id: "copy_123"
  content: "Pare de trabalhar 80h/semana para ganhar o que um funcionário ganha em 40"
  type: "headline"
  tags: ["tempo", "empreendedor", "provocativo"]
  performance:
    used_in: 5 campaigns
    best_ctr: 4.2%
    avg_conversion: 2.1%
  created: "2026-01-15"
  author: "Hugo D."
  variants:
    - "Você trabalha 80h para ganhar menos que seu funcionário?"
    - "80 horas de trabalho, salário de 40. Faz sentido?"
```

#### User Flow
```
1. Adicionar copy (manual ou auto-import)
2. Categorizar e taguear
3. (Opcional) Adicionar performance data
4. Copy disponível para busca e reuso
5. Ao usar, sistema registra
6. Gerar variações com IA quando necessário
```

#### Integração Connection Layer
```
Events Emitidos:
- copybank.copy.added { copy_id, type, tags }
- copybank.copy.used { copy_id, used_in }
- copybank.variation.generated { original_id, variations_count }

Events Consumidos:
- social.post.published { performance: "high" }
    → Auto-import para Copy Bank
- newsletter.sent { open_rate: ">40%" }
    → Auto-save subject line
- ad.performance.updated { ctr: ">3%" }
    → Flag como "winning copy"
```

---

### 🔄 Pipeline de Produção Unificado

Todo conteúdo passa por um pipeline consistente:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE PRODUÇÃO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 BRIEFING    →    🔍 PESQUISA    →    📝 OUTLINE            │
│  - Objetivo         - Fontes            - Estrutura            │
│  - Público          - Curadoria         - Seções               │
│  - Formato          - Insights          - Estimativas          │
│                                                                 │
│        ↓                                                        │
│                                                                 │
│  ✨ GERAÇÃO     →    👁️ REVISÃO     →    ✅ PUBLICADO          │
│  - IA escreve       - User edita        - Export/Publish       │
│  - Brand Voice      - QA check          - Track performance    │
│  - Iterações        - Aprovação         - Learn & improve      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Estágios Detalhados

| Estágio | Descrição | Owner | IA Assist |
|---------|-----------|-------|-----------|
| **BRIEFING** | Definir objetivo, público, formato | User | Suggestions |
| **PESQUISA** | Coletar fontes, insights | User + IA | Curador[IA] |
| **OUTLINE** | Estruturar conteúdo | IA | 80% IA |
| **GERAÇÃO** | Criar conteúdo | IA | 90% IA |
| **REVISÃO** | Editar, refinar | User | Suggestions |
| **PUBLICADO** | Distribuir, medir | System | Auto-track |

---

### 🤖 IA Features Globais do Módulo

#### Content Generator
- Gera qualquer tipo de conteúdo
- Brand Voice injetado automaticamente
- Tone adaptation por plataforma

#### Repurposing Engine
```
1 Conteúdo Original → Múltiplos Formatos

Exemplo: 1 Webinar de 1 hora →
├── 3 YouTube Shorts
├── 5 LinkedIn posts
├── 10 Twitter tweets
├── 1 Blog post
├── 1 Newsletter
└── 15 Instagram slides
```

#### SEO Optimizer
- Keyword suggestions
- Meta descriptions
- Heading structure
- Internal linking suggestions

#### A/B Generator
- Gera múltiplas variações
- Track performance
- Learn from winners

#### Consistency Checker
- Verifica Brand Voice
- Alerta inconsistências
- Sugere correções

---

### 📊 Métricas do Módulo

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Conteúdos/mês** | Volume de produção | > 50 |
| **Repurpose ratio** | 1 original → N formatos | > 5:1 |
| **Time to publish** | Briefing → Publicado | < 2h |
| **IA acceptance rate** | % de sugestões aceitas | > 70% |
| **Cross-module links** | Links para Academy, Strategy | > 30% |

---

### 🔗 Integração com Outros Módulos

| Módulo | Integração |
|--------|------------|
| **Brand** | Voice e design tokens em toda geração |
| **Academy** | Cursos gerados alimentam catalog |
| **Journey** | Goals de conteúdo, habit de publicação |
| **Strategy** | Iniciativas geram demanda de conteúdo |
| **Inbox** | Ideias capturadas viram briefings |
| **Minds** | Clone experts revisam conteúdo |

---

## 🚦 TRÁFEGO & CONVERSÃO (Growth) — FUTURO

**Status:** 🆕 Não existe | **Prioridade:** P3

### Submodules Propostos

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Dashboard** | 📊 | Overview de tráfego e conversão |
| **Fábrica de Anúncios** | 🏭 | Geração de ads com IA |
| **Campaigns** | 📢 | Gestão de campanhas |
| **Landing Pages** | 📄 | Builder de LPs |
| **Analytics** | 📈 | UTMs, attribution, funnels |
| **A/B Tests** | 🔬 | Experimentos |
| **Inteligência** | 🧠 | Insights de performance |

### Integração
- Ads performance → Finance (CAC)
- Landing page → Leads → Vendas pipeline
- Content → Distribuição via Tráfego

---

## ⚡ AI PLAYGROUND

**Status:** 🆕 | **Prioridade:** P2

### Proposta

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Chat** | 💬 | Chat livre com IA (GPT, Claude, etc.) |
| **Prompts** | 📝 | Biblioteca de prompts salvos |
| **Histórico** | 📜 | Conversas anteriores |
| **Comparador** | ⚖️ | Compare outputs de diferentes models |
| **Fine-tuning** | 🎛️ | Ajuste de parâmetros (temp, etc.) |

### Diferencial
- Contexto do ExímIA injetado automaticamente
- Brand voice disponível
- Salvar outputs diretamente em módulos

---

## 🧠 MINDS (Mentes Sintéticas)

**Status:** PRD Existe | **Prioridade:** P1

### Submodules

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Galeria** | 🖼️ | Browse de Minds disponíveis |
| **Meus Clones** | 👤 | Clones pessoais criados |
| **Arena** | ⚔️ | Debates entre Minds |
| **Pipeline** | 🔄 | Status de criação de clones |
| **DNA Mental** | 🧬 | Configuração de personalidade |

### Minds Disponíveis (do El_Clonador)
- David Goggins (Disciplina)
- Elon Musk (Visão)
- Alex Hormozi (Business Strategy)
- Custom clones

---

## 📋 DECISIONS (Camada 4) — NOVO

**Status:** 🆕 Arquitetura pronta | **Prioridade:** P0 (integrar no MVP)

### Submodules

| Item | Ícone | Descrição |
|------|-------|-----------|
| **Dashboard** | 📊 | Overview de decisões e loops |
| **Decision Cards** | 📋 | Criar e gerenciar decisões (NCE) |
| **Loops** | 🔄 | Tracking de execution loops |
| **Rituals** | 🔔 | Rituais inteligentes |
| **Learnings** | 📚 | Aprendizados extraídos |
| **KTEMA** | 🧠 | Memória organizacional |

### Posição na Sidebar
Recomendo adicionar na seção principal, logo após Journey:
```
├── 🎯 JOURNEY ▾
├── 📋 DECISIONS ▾    ← NOVO (Camada 4)
├── 🎓 ACADEMY ▾
```

---

## 📊 Matriz de Priorização

| Módulo | Prioridade | Complexidade | ROI | MVP? |
|--------|------------|--------------|-----|------|
| Inbox | P0 | Média | Alto | ✅ |
| Journey | P0 | Alta | Alto | ✅ |
| Academy | P0 | Alta | Alto | ✅ |
| Decisions (C4) | P0 | Alta | Alto | ✅ |
| Strategy | P1 | Média | Alto | Parcial |
| Brand | P1 | Baixa | Médio | Parcial |
| PrototypOS | P1 | Média | Médio | ❌ |
| Criação & Conteúdo | P1 | Alta | Alto | Parcial |
| Minds | P1 | Alta | Alto | Parcial |
| AI Playground | P2 | Baixa | Médio | ❌ |
| Finance | P2 | Média | Médio | ❌ |
| Vendas & Clientes | P2 | Alta | Alto | ❌ |
| Equipe & Cultura | P3 | Média | Baixo | ❌ |
| Tráfego | P3 | Alta | Médio | ❌ |

---

## 🚀 Roadmap de Implementação

### MVP (8-12 semanas)
1. ✅ Connection Layer (Event Bus + Entity Links)
2. ✅ Inbox (Quick Capture + Triage)
3. ✅ Journey (Goals + Habits)
4. ✅ Academy (Courses + Socratic Sessions)
5. ✅ Decisions/Camada 4 (Decision Cards + Guardian)

### Phase 2 (12-16 semanas)
1. Strategy (Initiatives + KPIs)
2. Brand (Voice + Design System)
3. Criação & Conteúdo (expandir além de Course Creator)
4. Minds (Galeria + DNA Mental)

### Phase 3 (16-24 semanas)
1. PrototypOS (PRD Generator)
2. Finance (Dashboard + Métricas)
3. AI Playground
4. Vendas & Clientes (Pipeline + CRM)

### Phase 4 (24+ semanas)
1. Tráfego & Conversão
2. Equipe & Cultura
3. Integrações avançadas

---

## 📐 Sidebar Atualizada Proposta

```
exímIA OS
│
├── 📥 INBOX
│
├── ─── EXECUÇÃO ───
├── 🎯 JOURNEY ▾
│   ├── Dashboard
│   ├── Metas
│   ├── Hábitos
│   ├── Livros
│   └── Calendário
│
├── 📋 DECISIONS ▾        ← 🆕 CAMADA 4
│   ├── Decision Cards
│   ├── Loops
│   ├── Rituals
│   └── KTEMA
│
├── 🎓 ACADEMY ▾
│   ├── Cursos
│   ├── Sessões
│   ├── Skills
│   └── Certificados
│
├── ─── BUSINESS ───
├── 📈 STRATEGY ▾
│   ├── Dashboard
│   ├── Ciclos
│   ├── Iniciativas
│   └── KPIs
│
├── 💰 FINANCE ▾
│   ├── Dashboard
│   ├── Receitas
│   ├── Despesas
│   └── Métricas
│
├── 💵 VENDAS & CLIENTES ▾
│   ├── Dashboard
│   ├── Pipeline
│   ├── Leads
│   ├── Clientes
│   └── Calls
│
├── 👥 EQUIPE & CULTURA ▾
│   ├── Membros
│   ├── Onboarding
│   └── Rituais
│
├── ─── CREATIVE ───
├── ✨ CRIAÇÃO & CONTEÚDO ▾
│   ├── Dashboard
│   ├── Course Creator
│   ├── Curador IA
│   ├── Ebooks
│   ├── Social Media
│   └── Newsletter
│
├── ◇ PROTOTYPOS ▾
│   ├── Projetos
│   └── PRDs
│
├── 🎨 IDENTIDADE & MARCA ▾
│   ├── Brand Voice
│   ├── Design System
│   └── Assets
│
├── ─── AI ───
├── ⚡ AI PLAYGROUND
├── 🧠 MINDS ▾
│   ├── Galeria
│   ├── Meus Clones
│   └── Arena
│
├── ─── SISTEMA ───
├── ⚙️ Configurações
│
└── 👤 Hugo D.
    Admin Workspace
```

---

## Próximos Passos

1. **Validar** esta estrutura com stakeholders
2. **Criar PRDs** para módulos novos (Vendas, Tráfego)
3. **Atualizar Design System** com specs de submenus
4. **Implementar** conforme roadmap

---

**Documento gerado por:** Orion (AIOS Master)
**Data:** 2026-01-28
