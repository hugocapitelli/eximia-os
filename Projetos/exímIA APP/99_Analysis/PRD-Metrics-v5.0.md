# PRD — Métricas de Sucesso
**Documento:** 99_Analysis
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Tipo:** Métricas & KPIs

---

## Sumário Executivo

Este documento define as métricas que realmente importam para o ExímIA OS — não vanity metrics, mas indicadores reais de valor entregue.

---

## Índice

1. [Métricas Primárias (North Star)](#1-métricas-primárias)
2. [Métricas de Conexão](#2-métricas-de-conexão)
3. [Métricas por Módulo](#3-métricas-por-módulo)
4. [Métricas de Proatividade](#4-métricas-de-proatividade)
5. [Métricas de Saúde do Produto](#5-métricas-de-saúde)
6. [Dashboard de Métricas](#6-dashboard)
7. [Anti-Métricas](#7-anti-métricas)

---

# 1. Métricas Primárias (North Star)

| Métrica | Definição | Target v5.0 |
|---------|-----------|-------------|
| **Weekly Active Users (WAU)** | Usuários únicos que acessam ≥3x/semana | Baseline + 20% |
| **Cross-Module Engagement** | % de sessões com ≥2 módulos usados | > 40% |
| **Task Completion Rate** | Metas marcadas como concluídas | > 60% |

**Rationale:** WAU mostra retenção real, Cross-Module prova que conexão funciona, Task Completion mostra valor entregue.

---

# 2. Métricas de Conexão (O Diferencial)

> **CRÍTICO:** Estas métricas provam que a Connection Layer funciona.

| Métrica | O Que Mede | Target | Por Que Importa |
|---------|------------|--------|-----------------|
| **Link Density** | Links por entidade | > 2.5 | Quão conectado está o sistema |
| **Cascade Success Rate** | % de cascateamentos aceitos | > 70% | Connection Layer funcionando |
| **Suggestion Acceptance** | % de sugestões aceitas pela IA | > 30% | Relevância das recomendações |
| **Cross-Module Navigation** | Cliques entre módulos/sessão | > 2.0 | Fluidez do sistema |

---

# 3. Métricas por Módulo

## 3.1 Journey

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Habit Completion Rate** | Completados / (Ativos × Dias) | > 70% |
| **Goal Completion Rate** | Concluídos / Criados (30d) | > 50% |
| **Streak Retention** | Usuários com streak ≥7 dias | > 30% |
| **Library Activity** | Livros em progresso / usuário | > 2 |

## 3.2 Academy

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Course Completion** | Cursos finalizados / Iniciados | > 40% |
| **Socratic Engagement** | Msgs por sessão socrática | ≥ 3 |
| **Return Rate** | Voltou em 7 dias após sessão | > 60% |
| **Insight Quality** | Insights validados / respostas | > 20% |

## 3.3 Strategy

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Initiative Progress** | Avg progress de iniciativas ativas | > 65% |
| **Cascade Adoption** | Initiatives com Goals linkados | > 80% |
| **Cycle Completion** | Ciclos finalizados no prazo | > 70% |
| **KPI Achievement** | KPIs que atingem target | > 60% |

## 3.4 Brand

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Asset Reuse** | Assets usados > 1x | > 50% |
| **Voice Consistency** | Materiais com voice aplicado | > 80% |
| **Expertise Updates** | Skills adicionadas via Academy | > 70% |

## 3.5 PrototypOS

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Projects Created** | Novos projetos / mês | Baseline |
| **Design System Exports** | DS exportados / criados | > 40% |
| **PRD Completion** | PRDs finalizados / iniciados | > 60% |

## 3.6 Inbox

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Capture Frequency** | Itens capturados / dia | > 3 |
| **Triage Success** | Sugestões aceitas / total | > 60% |
| **Inbox Zero Time** | Tempo médio para processar | < 48h |

---

# 4. Métricas de Proatividade

> **CRÍTICO:** Estas métricas provam que o sistema é proativo, não reativo.

| Métrica | O Que Mede | Target |
|---------|------------|--------|
| **Notification Open Rate** | Notificações abertas / enviadas | > 50% |
| **Reminder Effectiveness** | Ações tomadas após reminder | > 30% |
| **Digest Read Rate** | Digests abertos / enviados | > 60% |
| **Insight Action Rate** | Insights que geram ação | > 25% |

---

# 5. Métricas de Saúde do Produto

| Métrica | Definição | Alarme |
|---------|-----------|--------|
| **Churn Rate** | Usuários inativos ≥30d | > 10% |
| **Time to Value** | Tempo até primeira ação significativa | > 5 min |
| **Error Rate** | Erros / requests | > 1% |
| **Load Time (P95)** | Tempo de carregamento | > 3s |

---

# 6. Dashboard de Métricas

## 6.1 Visualização Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT HEALTH DASHBOARD                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WAU            Cross-Module      Task Completion   Churn       │
│  ████████ 847   ████░░░░ 42%     █████████ 67%     ██░░ 8%     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  CONEXÃO                                                        │
│  Link Density: 3.2/entity   Cascade Success: 78%               │
│  Suggestion Accept: 31%     Cross-Module Nav: 2.4/session      │
├─────────────────────────────────────────────────────────────────┤
│  PROATIVIDADE                                                   │
│  Notification Open: 52%     Reminder Effect: 34%               │
│  Digest Read: 61%           Inbox Zero: 36h avg                │
└─────────────────────────────────────────────────────────────────┘
```

## 6.2 Alertas Automáticos

| Condição | Alerta | Ação |
|----------|--------|------|
| Cross-Module < 30% | 🔴 Crítico | Connection Layer não está funcionando |
| Churn > 15% | 🔴 Crítico | Problema de retenção |
| Cascade Success < 50% | 🟡 Atenção | Sugestões não estão relevantes |
| Habit Completion < 60% | 🟡 Atenção | Usuários não estão engajados |

---

# 7. Anti-Métricas (O Que NÃO Medir)

> **IMPORTANTE:** Estas métricas são **enganosas** e não devem guiar decisões.

| Métrica Vaidosa | Por que evitar | Alternativa |
|-----------------|----------------|-------------|
| **Total de usuários cadastrados** | Não mostra uso real | WAU |
| **Features entregues** | Não mostra impacto | Task Completion |
| **Linhas de código** | Quantidade ≠ Qualidade | Error Rate |
| **Tempo no app** | Pode indicar confusão | Actions/session |
| **Page views** | Não mostra valor | Cross-Module Engagement |

---

## Implementação

### Ferramentas Recomendadas

| Ferramenta | Uso |
|------------|-----|
| **PostHog** | Product analytics, events, funnels |
| **Mixpanel** | Cohorts, retention, user journey |
| **Sentry** | Error tracking |
| **Vercel Analytics** | Performance (LCP, FID, CLS) |

### Events para Tracking

```typescript
// Exemplo: Track cross-module navigation
analytics.track('cross_module_navigation', {
  from_module: 'journey',
  to_module: 'academy',
  trigger: 'suggestion_click',
  timestamp: Date.now()
});

// Exemplo: Track cascade acceptance
analytics.track('cascade_accepted', {
  source_module: 'strategy',
  target_module: 'journey',
  entity_type: 'goal',
  confidence: 0.85
});
```

---

## Revisão Periódica

| Frequência | Métricas | Ação |
|------------|----------|------|
| **Diária** | WAU, Error Rate, Load Time | Alertas automáticos |
| **Semanal** | Cross-Module, Cascade Success | Review com time |
| **Mensal** | Churn, Completion Rates | Board review |
| **Trimestral** | North Star, Strategy alignment | Roadmap adjustment |

---

*Métricas v5.0 — O Que Realmente Importa*
*ExímIA OS — 2026*
