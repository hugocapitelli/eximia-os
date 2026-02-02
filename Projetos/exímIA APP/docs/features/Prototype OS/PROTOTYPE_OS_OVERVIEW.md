# PROTOTYPE OS - Módulo de Design & Produto

> Central de produto e design para empreendedores que querem transformar ideias em produtos digitais de forma estruturada, com IA acelerando cada etapa do processo.

---

## 1. Visão Geral

### Propósito
O módulo PROTOTYPE OS é a **fábrica de produtos digitais** do ExímIA OS. Aqui, empreendedores transformam ideias em PRDs, wireframes, especificações técnicas e handoffs prontos para desenvolvimento — tudo com IA assistindo cada etapa e Brand Voice injetado automaticamente.

### Para Quem é Este Módulo

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PERFIS DE USUÁRIO                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  👤 EMPREENDEDOR SOLO                                               │
│  "Tenho uma ideia mas não sei como documentar para um dev"          │
│  → PRD Generator + Wireframes + Handoff                             │
│                                                                     │
│  👥 PEQUENO TIME                                                    │
│  "Precisamos de processos de produto sem burocracia"                │
│  → Projetos + PRDs + Specs + Colaboração                           │
│                                                                     │
│  🚀 STARTUP EM CRESCIMENTO                                          │
│  "Queremos escalar nosso processo de discovery e delivery"          │
│  → Research + User Stories + Design System + Analytics             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Estrutura do Módulo

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ◇ PROTOTYPE OS                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 📊 DASHBOARD                                                   │ │
│  │ Central de comando: projetos, métricas, atividade recente     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│         ┌────────────────────┼────────────────────┐                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │
│  │ 📁 PROJETOS │      │ 🔬 RESEARCH │      │ 📋 BACKLOG  │         │
│  │ Gestão de   │      │ Descoberta  │      │ User Stories│         │
│  │ projetos    │      │ e validação │      │ e priorização        │         │
│  └─────────────┘      └─────────────┘      └─────────────┘         │
│         │                    │                    │                 │
│         └────────────────────┼────────────────────┘                 │
│                              ▼                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 📄 PRD GENERATOR                                               │ │
│  │ Geração de PRDs completos com IA + Brand Voice                │ │
│  │ Problema → Solução → Features → Métricas → Riscos             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│         ┌────────────────────┼────────────────────┐                 │
│         ▼                    ▼                    ▼                 │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │
│  │ 🖼️ WIREFRAME│      │ 📐 SPECS    │      │ 🎨 DESIGN   │         │
│  │ Sketches    │      │ Técnicas    │      │ SYSTEM      │         │
│  │ e mockups   │      │ para devs   │      │ Tokens      │         │
│  └─────────────┘      └─────────────┘      └─────────────┘         │
│         │                    │                    │                 │
│         └────────────────────┼────────────────────┘                 │
│                              ▼                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🤝 HANDOFF                                                     │ │
│  │ Exportação completa para desenvolvimento                      │ │
│  │ PRD + Wireframes + Specs + Assets → GitHub/Jira/Notion        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Submodules Overview

| Submodule | Ícone | Descrição | Prioridade |
|-----------|-------|-----------|------------|
| **Dashboard** | 📊 | Central de comando com projetos e métricas | P0 |
| **Projetos** | 📁 | Gestão de projetos de produto | P0 |
| **Research** | 🔬 | Descoberta de produto, entrevistas, validação | P1 |
| **Backlog** | 📋 | User stories, épicos, priorização | P1 |
| **PRD Generator** | 📄 | Geração de PRDs com IA | P0 |
| **Wireframes** | 🖼️ | Builder de wireframes e mockups | P1 |
| **Specs** | 📐 | Especificações técnicas para devs | P1 |
| **Design System** | 🎨 | Tokens, componentes, guidelines | P2 |
| **Handoff** | 🤝 | Exportação para desenvolvimento | P0 |

---

## 3. Fluxo de Trabalho Típico

### Do Zero ao Handoff

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE PRODUTO COMPLETO                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FASE 1: DISCOVERY (1-2 semanas)                                    │
│  ─────────────────────────────────────────────────────────────────  │
│  📥 Ideia/Problema  →  🔬 Research  →  ✅ Validação                │
│     ↓                    ↓               ↓                          │
│     Inbox capture        Entrevistas     Decisão Go/No-Go           │
│     Hypothesis           Análise         Métricas de sucesso        │
│                          competidores                               │
│                                                                     │
│  FASE 2: DEFINITION (1-2 semanas)                                   │
│  ─────────────────────────────────────────────────────────────────  │
│  📄 PRD Draft  →  📋 User Stories  →  🎯 Priorização               │
│     ↓                 ↓                  ↓                          │
│     Problema          Épicos             MoSCoW                     │
│     Solução           Stories            Story Points               │
│     Features          Criteria           Roadmap                    │
│                                                                     │
│  FASE 3: DESIGN (1-2 semanas)                                       │
│  ─────────────────────────────────────────────────────────────────  │
│  🖼️ Wireframes  →  🎨 UI Design  →  🧪 Usability Test             │
│     ↓                 ↓                 ↓                           │
│     Low-fi            High-fi           Feedback                    │
│     Flows             Protótipo         Iteração                    │
│     Estrutura         Interações                                    │
│                                                                     │
│  FASE 4: HANDOFF (1 semana)                                         │
│  ─────────────────────────────────────────────────────────────────  │
│  📐 Specs  →  📦 Assets  →  🤝 Dev Handoff                         │
│     ↓            ↓             ↓                                    │
│     Técnicas     Exportação    GitHub Issue                         │
│     API          Figma/Sketch  Jira Ticket                          │
│     Database     Icons/Images  Notion Doc                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo Simplificado (Solo/MVP)

```
┌───────────────────────────────────────────────────────────────┐
│                    FLUXO MVP RÁPIDO                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  💡 Ideia  →  📄 PRD  →  🖼️ Wireframe  →  🤝 Handoff        │
│     (5min)    (30min)     (2h)             (15min)           │
│                                                               │
│  Total: ~3 horas do conceito ao ticket de desenvolvimento    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Pipeline de IA

### Agentes Especializados

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE AGENTES                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 1. DISCOVERY AGENT                                            │  │
│  │    "O Pesquisador"                                            │  │
│  │    ─────────────────────────────────────────────────────────  │  │
│  │    • Analisa problema e contexto                              │  │
│  │    • Sugere hipóteses a validar                               │  │
│  │    • Identifica competidores                                  │  │
│  │    • Gera roteiro de entrevistas                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 2. PRD ARCHITECT                                              │  │
│  │    "O Estruturador"                                           │  │
│  │    ─────────────────────────────────────────────────────────  │  │
│  │    • Gera estrutura de PRD                                    │  │
│  │    • Define problema e solução                                │  │
│  │    • Lista features e scope                                   │  │
│  │    • Injeta Brand Voice automaticamente                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 3. STORY WRITER                                               │  │
│  │    "O Tradutor"                                               │  │
│  │    ─────────────────────────────────────────────────────────  │  │
│  │    • Transforma features em user stories                      │  │
│  │    • Gera acceptance criteria                                 │  │
│  │    • Estima complexidade                                      │  │
│  │    • Identifica dependências                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 4. WIREFRAME ASSISTANT                                        │  │
│  │    "O Visualizador"                                           │  │
│  │    ─────────────────────────────────────────────────────────  │  │
│  │    • Sugere estrutura de telas                                │  │
│  │    • Gera descrições de wireframe                             │  │
│  │    • Identifica componentes necessários                       │  │
│  │    • Mapeia fluxos de navegação                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 5. SPEC ENGINEER                                              │  │
│  │    "O Técnico"                                                │  │
│  │    ─────────────────────────────────────────────────────────  │  │
│  │    • Gera especificações técnicas                             │  │
│  │    • Define API contracts                                     │  │
│  │    • Sugere database schema                                   │  │
│  │    • Lista tech decisions necessárias                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 6. HANDOFF PACKAGER                                           │  │
│  │    "O Empacotador"                                            │  │
│  │    ─────────────────────────────────────────────────────────  │  │
│  │    • Compila todos os artefatos                               │  │
│  │    • Gera GitHub issues/Jira tickets                          │  │
│  │    • Exporta para Notion/Confluence                           │  │
│  │    • Prepara assets para dev                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Integração com Outros Módulos

### Connection Layer

```typescript
// Eventos emitidos pelo PROTOTYPE OS
const PROTOTYPOS_EVENTS = {
  // Projetos
  PROJECT_CREATED: 'prototypos.project.created',
  PROJECT_PHASE_CHANGED: 'prototypos.project.phase_changed',
  PROJECT_COMPLETED: 'prototypos.project.completed',

  // PRDs
  PRD_CREATED: 'prototypos.prd.created',
  PRD_APPROVED: 'prototypos.prd.approved',
  PRD_VERSIONED: 'prototypos.prd.versioned',

  // Research
  RESEARCH_INSIGHT_ADDED: 'prototypos.research.insight',
  INTERVIEW_COMPLETED: 'prototypos.research.interview',
  HYPOTHESIS_VALIDATED: 'prototypos.research.hypothesis_validated',

  // User Stories
  STORY_CREATED: 'prototypos.story.created',
  STORY_PRIORITIZED: 'prototypos.story.prioritized',
  EPIC_CREATED: 'prototypos.epic.created',

  // Wireframes
  WIREFRAME_CREATED: 'prototypos.wireframe.created',
  FLOW_MAPPED: 'prototypos.flow.mapped',
  PROTOTYPE_READY: 'prototypos.prototype.ready',

  // Specs
  SPEC_GENERATED: 'prototypos.spec.generated',
  API_DESIGNED: 'prototypos.api.designed',

  // Handoff
  HANDOFF_EXPORTED: 'prototypos.handoff.exported',
  GITHUB_ISSUE_CREATED: 'prototypos.github.issue_created',
  JIRA_TICKET_CREATED: 'prototypos.jira.ticket_created',
};
```

### Integrações Bidirecionais

| Módulo | De PROTOTYPE OS → | → Para PROTOTYPE OS |
|--------|-----------------|-------------------|
| **Inbox** | — | Ideias capturadas viram projetos |
| **Journey** | Goals de produto | Iniciativas geram demanda de features |
| **Strategy** | OKRs de produto | Iniciativas estratégicas |
| **Brand** | — | Voice injetado em PRDs e copies |
| **Academy** | Documentação vira curso | Cursos geram ideias de features |
| **Minds** | — | Clones revisam PRDs |
| **Decisions** | Decision Cards para tech choices | — |
| **Finance** | — | Estimativas de custo |

---

## 6. Métricas do Módulo

### KPIs Principais

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Time to PRD** | Da ideia ao PRD aprovado | < 1 dia |
| **Time to Handoff** | Do PRD ao handoff | < 1 semana |
| **PRD Approval Rate** | % de PRDs aprovados de primeira | > 80% |
| **Story Accuracy** | % de stories sem mudança em dev | > 70% |
| **Wireframe Iterations** | Iterações até aprovação | < 3 |
| **Handoff Completeness** | % de info suficiente para dev | > 90% |

### Dashboard Metrics

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MÉTRICAS DO MÓDULO                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  VOLUME                    VELOCIDADE               QUALIDADE       │
│  ────────────────────      ────────────────────     ────────────── │
│  📁 12 Projetos ativos     ⏱️ 4h avg Time-to-PRD    ✅ 85% PRDs ok  │
│  📄 34 PRDs este mês       ⏱️ 3d avg PRD-to-Dev     ✅ 92% Handoffs │
│  📋 156 Stories criadas    ⏱️ 2 iterations/wf       ✅ 78% Stories  │
│                                                                     │
│  PIPELINE ATUAL                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                     │
│  Discovery  │  Definition  │  Design    │  Handoff   │  Done       │
│  ████       │  ██████      │  ████████  │  ██        │  ██████████ │
│  2 projetos │  3 projetos  │  4 projetos│  1 projeto │  15 projetos│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Tech Stack Sugerida

### Ferramentas Integradas

| Categoria | Ferramentas |
|-----------|-------------|
| **Design** | Figma (import/export), Excalidraw (embed), Mermaid (diagramas) |
| **Project Management** | GitHub Projects, Jira, Linear, Notion |
| **Documentation** | Notion, Confluence, GitBook |
| **Prototyping** | Figma, Framer, InVision |
| **Collaboration** | Slack, Discord, Teams |
| **Version Control** | GitHub, GitLab |

### APIs e Integrações

```typescript
interface PrototyposIntegrations {
  // Design
  figma: {
    import: (fileKey: string) => FigmaDesign;
    export: (wireframe: Wireframe) => FigmaFile;
  };

  // Project Management
  github: {
    createIssue: (story: UserStory) => GitHubIssue;
    createProject: (project: ProductProject) => GitHubProject;
  };

  jira: {
    createTicket: (story: UserStory) => JiraTicket;
    syncEpic: (epic: Epic) => JiraEpic;
  };

  linear: {
    createIssue: (story: UserStory) => LinearIssue;
    syncCycle: (sprint: Sprint) => LinearCycle;
  };

  // Documentation
  notion: {
    exportPRD: (prd: PRD) => NotionPage;
    syncDatabase: (backlog: Backlog) => NotionDatabase;
  };

  // AI
  openai: {
    generatePRD: (context: PRDContext) => PRDDraft;
    generateStories: (prd: PRD) => UserStory[];
  };
}
```

---

## 8. Roadmap de Implementação

### Fase 1: Core (Sprint 1-2)
- [ ] Dashboard básico
- [ ] CRUD de Projetos
- [ ] PRD Generator básico
- [ ] Handoff simples (Markdown export)

### Fase 2: Stories & Wireframes (Sprint 3-4)
- [ ] Backlog de User Stories
- [ ] Épicos e priorização
- [ ] Wireframe builder básico
- [ ] Fluxos de navegação

### Fase 3: Research & Specs (Sprint 5-6)
- [ ] Módulo de Research
- [ ] Entrevistas e insights
- [ ] Especificações técnicas
- [ ] API designer

### Fase 4: Integrações (Sprint 7-8)
- [ ] GitHub integration
- [ ] Jira integration
- [ ] Figma import/export
- [ ] Notion sync

### Fase 5: Advanced AI (Sprint 9-10)
- [ ] Discovery Agent
- [ ] Competitive analysis
- [ ] Usability testing assistant
- [ ] Auto-estimation

---

## 9. Próximos Documentos

Cada submodule terá sua especificação detalhada:

1. **PROTOTYPOS_DASHBOARD.md** - Central de comando
2. **PROTOTYPOS_PROJETOS.md** - Gestão de projetos
3. **PROTOTYPOS_RESEARCH.md** - Descoberta de produto
4. **PROTOTYPOS_BACKLOG.md** - User stories e priorização
5. **PROTOTYPOS_PRD.md** - Gerador de PRDs
6. **PROTOTYPOS_WIREFRAMES.md** - Builder de wireframes
7. **PROTOTYPOS_SPECS.md** - Especificações técnicas
8. **PROTOTYPOS_DESIGN_SYSTEM.md** - Tokens e componentes
9. **PROTOTYPOS_HANDOFF.md** - Exportação para dev

---

**Última Atualização:** 2026-01-28
**Versão:** 1.0.0
**Owner:** Product Team
