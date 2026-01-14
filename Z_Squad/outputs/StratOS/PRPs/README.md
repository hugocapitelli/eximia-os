# StratOS Platform - Product Requirement Prompts (PRPs)

> **Versão:** 1.0.0
> **Data:** 2026-01-13
> **Baseado em:** StratOS_Platform_PRD_v2.md

---

## Sumário

Este diretório contém os PRPs (Product Requirement Prompts) detalhados para o desenvolvimento da plataforma StratOS, incluindo wireframes ASCII, especificações técnicas e critérios de aceite.

---

## Estrutura de PRPs

```
PRPs/
├── README.md (este arquivo)
│
├── 01_Foundation/
│   ├── PRP_01_Auth_Onboarding.md       # Autenticação e onboarding
│   ├── PRP_02_Design_System.md         # Design tokens e componentes
│   └── PRP_03_AI_Services.md           # Orquestração de IA
│
├── 02_The_Forge/
│   └── PRP_04_The_Forge_Complete.md    # Wizard de criação de estratégia
│
├── 03_War_Room/
│   └── PRP_05_War_Room_Dashboard.md    # Dashboard executivo
│
├── 04_Execution_Hub/
│   └── PRP_06_Execution_Hub.md         # Gestão de iniciativas
│
└── 05_Governance/
    └── PRP_07_Governance.md            # Revisão e Catchball
```

---

## Visão Geral dos PRPs

### PRP-01: Authentication & Onboarding
**Prioridade:** P0 | **Complexidade:** Média

- Login com email/senha e OAuth (Google, Microsoft)
- Onboarding em 3 steps (Organização, Perfil, Convites)
- RBAC (Admin, Editor, Viewer)
- Wireframes: Login, Signup, Onboarding steps

### PRP-02: Design System & Component Library
**Prioridade:** P0 | **Complexidade:** Alta

- Design tokens (cores, tipografia, espaçamento)
- Componentes: Buttons, Inputs, Cards, Badges
- Componentes compostos: BSC Card, Initiative Card, AI Panel
- Dark mode first, Executive-grade UX

### PRP-03: AI Services & Orchestration
**Prioridade:** P0 | **Complexidade:** Alta

- 14 modos de IA (SWOT, North Star, Drivers, KPIs, Briefing, etc.)
- Arquitetura: Context Builder → Mode Selector → Prompt Composer → LLM Gateway
- Fallback Anthropic → OpenAI
- Rate limiting, retry, streaming

### PRP-04: The Forge (Strategy Creation)
**Prioridade:** P0 | **Complexidade:** Muito Alta

- Wizard de 6 steps:
  - Step 0: SWOT Analysis
  - Step 1: North Star
  - Step 2: Dimensões BSC
  - Step 3: Drivers Estratégicos
  - Step 4: Iniciativas Táticas/Operacionais
  - Step 5: Metas & KPIs
  - Step 6: Consolidação
- IA como co-piloto em cada etapa
- Wireframes detalhados para cada step

### PRP-05: War Room (Executive Dashboard)
**Prioridade:** P0 | **Complexidade:** Alta

- North Star Banner (sempre visível)
- 4 BSC Health Cards com drill-down
- AI Daily Briefing (wins, alerts, predictions, actions)
- Critical Alerts Panel
- Timeline/Gantt simplificado
- Real-time updates via WebSocket

### PRP-06: Execution Hub (Initiative Management)
**Prioridade:** P0 | **Complexidade:** Alta

- 3 visualizações: Tree, Kanban, Gantt
- Filtros por Driver, Owner, Status
- Quick update de progresso
- Escalation flow
- Dependências entre iniciativas

### PRP-07: Governance (Review & Catchball)
**Prioridade:** P1 | **Complexidade:** Média

- Review Dashboard com filtros
- Catchball threads vinculados a iniciativas
- @mentions e notificações
- AI: Action Item Extractor
- AI: Discussion Summarizer
- History log completo

---

## Ordem de Implementação Sugerida

### Fase 1: Foundation (Semanas 1-4)
1. **PRP-02**: Design System (tokens e componentes base)
2. **PRP-01**: Authentication & Onboarding
3. **PRP-03**: AI Services (infraestrutura)

### Fase 2: Core Strategy (Semanas 5-10)
4. **PRP-04**: The Forge (módulo principal)
   - Step 0-1: SWOT + North Star
   - Step 2-3: Dimensões + Drivers
   - Step 4-5: Iniciativas + KPIs
   - Step 6: Consolidação

### Fase 3: Operations (Semanas 11-14)
5. **PRP-05**: War Room (dashboard)
6. **PRP-06**: Execution Hub (gestão)

### Fase 4: Governance (Semanas 15-16)
7. **PRP-07**: Governance (revisão)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand + React Query |
| Backend | Supabase (Auth, DB, Realtime) |
| Database | PostgreSQL |
| AI | Vercel AI SDK + Anthropic (Claude) |
| Hosting | Vercel |

---

## Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Tempo para criar estratégia completa | < 4 horas |
| Taxa de conclusão do Forge | > 70% |
| Sugestões de AI aceitas | > 60% |
| NPS de usuários C-Level | > 50 |
| Uptime | 99.9% |

---

## Convenções

### Wireframes
- Formato ASCII para portabilidade
- `[texto]` = botão/link
- `┌───┐` = container/card
- `●` = selecionado, `○` = não selecionado
- `✓` = concluído, `○` = pendente

### Prioridades
- **P0**: Critical Path (bloqueante)
- **P1**: Important (alto valor)
- **P2**: Nice to have (baixa prioridade)

### Status Codes
| Código | Nome | Cor |
|--------|------|-----|
| 0 | Não Planejado | Cinza |
| 1 | Planejado | Azul Claro |
| 2 | On Track | Verde |
| 3 | At Risk | Amarelo |
| 4 | Off Track | Vermelho |
| 5 | Concluído | Azul |

---

## Changelog

### v1.0.0 (2026-01-13)
- Criação inicial de todos os PRPs
- 7 PRPs cobrindo todos os módulos do PRD
- Wireframes detalhados em ASCII
- Especificações de API
- Critérios de aceite
