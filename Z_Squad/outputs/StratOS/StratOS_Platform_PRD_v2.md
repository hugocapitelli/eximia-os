# Product Requirements Document (PRD)
# StratOS Platform v2.0

> **Status:** Draft
> **Version:** 2.0.0
> **Date:** 2026-01-13
> **Author:** Product Team (AI-Assisted)
> **Stakeholders:** CEO, CTO, Product Lead

---

## Sumário Executivo

**StratOS** é uma plataforma de gestão estratégica que digitaliza a metodologia Hoshin Kanri, transformando planos estratégicos estáticos em sistemas vivos de execução. Diferente de ferramentas genéricas de gestão de projetos, o StratOS é **opinionated** (impõe disciplina metodológica) e **AI-augmented** (utiliza IA para acelerar, sugerir e validar decisões estratégicas).

### Problema que Resolve

1. **Teatro Estratégico:** 70% dos planos estratégicos viram "shelfware" após o offsite anual
2. **Desconexão Hierárquica:** Objetivos de alto nível não se traduzem em ações operacionais claras
3. **Falta de Visibilidade:** Líderes não sabem em tempo real se a estratégia está no caminho certo
4. **Processo Manual:** Criação de estratégia é lenta, subjetiva e dependente de consultores caros

### Proposta de Valor

| Para | Que | StratOS | Diferente de |
|------|-----|---------|--------------|
| CEOs e Founders | Precisam traduzir visão em execução | Oferece um sistema que força disciplina estratégica com IA como co-piloto | Planilhas e slides que ninguém atualiza |
| Líderes de Área | Precisam saber exatamente o que fazer e como medir | Conecta suas iniciativas ao "big picture" com KPIs claros | Ferramentas de projeto sem contexto estratégico |
| Times | Precisam de clareza sobre prioridades | Mostra como seu trabalho impacta os objetivos da empresa | Listas de tarefas desconectadas |

---

## 1. Visão do Produto

### 1.1 Product Vision Statement

> "Ser o sistema operacional da empresa estratégica, onde visão se transforma em execução disciplinada com inteligência artificial como co-piloto."

### 1.2 Princípios de Design

| Princípio | Descrição | Implicação |
|-----------|-----------|------------|
| **Methodology as Software** | A ferramenta impõe a metodologia Hoshin Kanri | Usuário não pode criar Meta sem Iniciativa, nem Iniciativa sem Driver |
| **AI as Co-Pilot, Not Autopilot** | IA sugere e valida, humano decide | Todas sugestões de IA são editáveis e rejeitáveis |
| **Living Strategy** | Estratégia é um documento vivo, não um PDF | Atualizações em tempo real, alertas proativos, revisões periódicas |
| **Executive-Grade UX** | Interface para C-Level: densa, precisa, sem ruído | Dark mode, alta densidade de informação, zero gamificação infantil |
| **Opinionated but Flexible** | Estrutura rígida, conteúdo flexível | Hierarquia é fixa, mas quantidade e nomes são customizáveis |

### 1.3 Métricas de Sucesso do Produto

| Métrica | Baseline | Target (6 meses) | Método de Medição |
|---------|----------|------------------|-------------------|
| % de estratégias com atualização mensal | 20% (mercado) | 80% | Analytics de uso |
| Tempo para criar estratégia completa | 2-4 semanas | 2-4 horas | Timer in-app |
| % de iniciativas com KPI vinculado | 30% (mercado) | 95% | Validação do sistema |
| NPS de usuários C-Level | N/A | > 50 | Survey trimestral |
| Adoção de sugestões de IA | N/A | > 60% | Taxa de aceite |

---

## 2. Personas e Jobs-to-be-Done

### 2.1 Persona Primária: O Arquiteto

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PERSONA: O ARQUITETO                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Perfil:           CEO, Founder, CSO (Chief Strategy Officer)               │
│  Empresa:          Startup/Scale-up (10-200 pessoas)                        │
│  Experiência:      5-15 anos de gestão                                      │
│  Tech Savviness:   Média-Alta                                               │
│                                                                             │
│  JOBS-TO-BE-DONE:                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  1. "Quando estou no offsite anual, quero traduzir discussões em um         │
│      plano estruturado para que o time tenha clareza do caminho."           │
│                                                                             │
│  2. "Quando acordo na segunda-feira, quero ver em 30 segundos se a          │
│      estratégia está no caminho certo para que eu saiba onde intervir."     │
│                                                                             │
│  3. "Quando um líder me pede mais recursos, quero ver como isso conecta     │
│      aos objetivos estratégicos para tomar decisões baseadas em dados."     │
│                                                                             │
│  FRUSTRAÇÕES ATUAIS:                                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • "Gastamos 3 dias no offsite e 2 meses depois ninguém lembra o plano"     │
│  • "Cada área tem seu próprio tracker, não consigo ver o todo"              │
│  • "Consultores cobram R$50k para fazer slides que não usamos"              │
│                                                                             │
│  CITAÇÃO:                                                                   │
│  "Estratégia boa é a que as pessoas lembram e executam, não a mais bonita." │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Persona Secundária: O Executor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PERSONA: O EXECUTOR                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Perfil:           Head de Área, Gerente, Tech Lead                         │
│  Empresa:          Mesma do Arquiteto                                       │
│  Experiência:      3-10 anos                                                │
│  Tech Savviness:   Alta                                                     │
│                                                                             │
│  JOBS-TO-BE-DONE:                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  1. "Quando recebo uma iniciativa, quero saber exatamente qual o            │
│      entregável e como medir sucesso para não ter retrabalho."              │
│                                                                             │
│  2. "Quando atualizo o status, quero que o CEO veja automaticamente         │
│      para não ter que fazer apresentações manuais toda semana."             │
│                                                                             │
│  3. "Quando algo está atrasado, quero escalar rapidamente para              │
│      conseguir ajuda antes que vire crise."                                 │
│                                                                             │
│  FRUSTRAÇÕES ATUAIS:                                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • "Me pedem updates de coisas que nem sei que são minha responsabilidade"  │
│  • "Não sei como meu trabalho conecta com a estratégia da empresa"          │
│  • "Atualizo planilha, Slack, Jira, Notion... tempo perdido"                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Persona Terciária: O Observador

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PERSONA: O OBSERVADOR                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Perfil:           Investidor, Board Member, Advisor                        │
│  Relação:          Externa à operação diária                                │
│  Frequência:       Acessa mensalmente ou trimestralmente                    │
│                                                                             │
│  JOBS-TO-BE-DONE:                                                           │
│  ─────────────────────────────────────────────────────────────────────────  │
│  1. "Quando tenho reunião de board, quero ver um snapshot da estratégia     │
│      em 5 minutos para avaliar se a empresa está no caminho certo."         │
│                                                                             │
│  FRUSTRAÇÕES ATUAIS:                                                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • "Cada reunião tem slides diferentes, não dá para comparar evolução"      │
│  • "Não sei se os números que me mostram são reais ou maquiados"            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Modelo de Dados e Hierarquia Estratégica

### 3.1 Estrutura Hierárquica (Core do Produto)

A hierarquia abaixo é **imutável** e representa o coração da metodologia StratOS:

```
CICLO ESTRATÉGICO (ex: "Hoshin 2026")
│
├── NORTH STAR
│   ├── Visão (texto)
│   ├── Propósito (texto)
│   └── Valores (lista)
│
├── DIMENSÃO BSC [4 fixas]
│   ├── Financeira
│   ├── Cliente/Mercado
│   ├── Processos Internos
│   └── Aprendizado e Crescimento
│   │
│   └── DRIVER ESTRATÉGICO [3-5 por ciclo]
│       ├── Código (XX)
│       ├── Nome
│       ├── Definição (Intenção + Escopo + Conexão)
│       ├── Dimensão BSC (FK)
│       ├── Desafio SWOT origem (FK)
│       │
│       └── INICIATIVA TÁTICA [1-N por Driver]
│           ├── Código (XX.YY)
│           ├── Nome
│           ├── Descrição
│           ├── Owner (FK User)
│           ├── Data Início
│           ├── Data Fim
│           ├── Status (calculado das operacionais)
│           │
│           └── INICIATIVA OPERACIONAL [1-N por Tática]
│               ├── Código (XX.YY.ZZ)
│               ├── Nome
│               ├── Descrição
│               ├── Owner (FK User)
│               ├── Data Início
│               ├── Data Fim
│               ├── % Progresso
│               ├── Status (0-5)
│               └── Checklist (opcional)
│
└── META / KPI [1-N, vinculada a Driver ou Tática]
    ├── Nome
    ├── Tipo (Resultado | Processo)
    ├── Fórmula
    ├── Baseline
    ├── Target
    ├── Stretch (opcional)
    ├── Frequência de Medição
    ├── Responsável pela Medição
    └── Histórico de Valores
```

### 3.2 Regras de Integridade (Enforced pelo Sistema)

| Regra | Descrição | Validação |
|-------|-----------|-----------|
| **R01** | Máximo 5 Drivers por ciclo | UI bloqueia criação do 6º |
| **R02** | Todo Driver deve ter pelo menos 1 Iniciativa Tática | Warning até ter, bloqueio para finalizar |
| **R03** | Toda Iniciativa Tática deve ter pelo menos 1 Operacional | Botão "Salvar" desabilitado |
| **R04** | Metas só podem ser criadas após Iniciativas | Tela de Metas bloqueada até step anterior |
| **R05** | Toda Meta deve ter Baseline e Target | Campos obrigatórios |
| **R06** | Código é auto-gerado e imutável | Campo read-only |
| **R07** | Status da Tática é calculado | Média ponderada das Operacionais |
| **R08** | Owner é obrigatório para Táticas e Operacionais | Campo obrigatório |
| **R09** | Datas são obrigatórias para Táticas | Campos obrigatórios |
| **R10** | Driver deve estar vinculado a um Desafio SWOT | Warning se não estiver |

### 3.3 Status Codes

| Código | Nome | Cor | Descrição |
|--------|------|-----|-----------|
| 0 | Não Planejado | Cinza | Item criado mas não iniciado |
| 1 | Planejado | Azul Claro | Planejamento concluído, aguardando início |
| 2 | On Track | Verde | Em execução, dentro do esperado |
| 3 | At Risk | Amarelo | Em execução, com riscos identificados |
| 4 | Off Track | Vermelho | Em execução, fora do esperado |
| 5 | Concluído | Azul | Finalizado com sucesso |

### 3.4 Diagrama de Entidades (ERD Simplificado)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Ciclo     │────<│   SWOT      │     │   User      │
│             │     │   Item      │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
      │                   │                    │
      │                   │ deriva             │ owner
      ▼                   ▼                    │
┌─────────────┐     ┌─────────────┐            │
│  North Star │     │   Driver    │────────────┤
│             │     │             │            │
└─────────────┘     └──────┬──────┘            │
                          │                    │
                          │ 1:N                │
                          ▼                    │
                   ┌─────────────┐             │
                   │  Tática     │─────────────┤
                   │             │             │
                   └──────┬──────┘             │
                          │                    │
                          │ 1:N                │
                          ▼                    │
                   ┌─────────────┐             │
                   │ Operacional │─────────────┘
                   │             │
                   └──────┬──────┘
                          │
                          │ N:1
                          ▼
                   ┌─────────────┐
                   │    Meta     │
                   │             │
                   └─────────────┘
```

---

## 4. Arquitetura de Módulos

### 4.1 Visão Geral dos Módulos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           STRATOS PLATFORM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MODULE 1: THE FORGE                              │   │
│  │                    (Criação Guiada de Estratégia)                   │   │
│  │                                                                      │   │
│  │  Step 0    Step 1      Step 2      Step 3       Step 4      Step 5  │   │
│  │  ┌─────┐  ┌─────┐     ┌─────┐     ┌─────┐      ┌─────┐     ┌─────┐ │   │
│  │  │SWOT │→ │North│  →  │Dimen│  →  │Driv │  →   │Init │  →  │Metas│ │   │
│  │  │     │  │Star │     │sões │     │ers  │      │iat. │     │     │ │   │
│  │  └─────┘  └─────┘     └─────┘     └─────┘      └─────┘     └─────┘ │   │
│  │                                                                      │   │
│  │  [AI: Researcher, Refiner, Suggester, Decomposer, KPI Architect]    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MODULE 2: WAR ROOM                               │   │
│  │                    (Dashboard Executivo)                            │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ North Star   │  │ BSC Health   │  │ Alerts &     │              │   │
│  │  │ Banner       │  │ Cards        │  │ Insights     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  [AI: Alert Analyst, Insight Generator, Briefing Writer]            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MODULE 3: EXECUTION HUB                          │   │
│  │                    (Gestão de Iniciativas)                          │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Tree View    │  │ Kanban View  │  │ Gantt View   │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  [AI: Progress Tracker, Dependency Finder, Risk Identifier]         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MODULE 4: GOVERNANCE                             │   │
│  │                    (Revisão e Catchball)                            │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Review       │  │ Catchball    │  │ History &    │              │   │
│  │  │ Dashboard    │  │ Threads      │  │ Audit Log    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  [AI: Review Summarizer, Action Item Extractor]                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Requisitos Funcionais Detalhados

### 5.1 MODULE 1: THE FORGE (Criação de Estratégia)

#### 5.1.0 Step 0: SWOT Analysis

**Objetivo:** Capturar contexto estratégico e gerar desafios.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-0.1 | SWOT Board Interativo | P0 | Canvas com 4 quadrantes (Forças, Fraquezas, Oportunidades, Ameaças) |
| FR-0.2 | Sticky Notes | P0 | Usuário pode adicionar, editar, excluir itens em cada quadrante |
| FR-0.3 | Drag & Drop | P1 | Mover itens entre quadrantes |
| FR-0.4 | AI: Auto-suggest Items | P1 | IA sugere itens baseado no setor informado |
| FR-0.5 | AI: Provocateur | P1 | IA questiona inconsistências entre quadrantes |
| FR-0.6 | AI: Synthesize Challenges | P0 | Botão que gera 3-5 Desafios Estratégicos a partir do SWOT |
| FR-0.7 | Voting | P2 | Múltiplos usuários podem votar em itens para priorização |
| FR-0.8 | Navigation Block | P0 | "Próximo" bloqueado até ter pelo menos 1 item por quadrante |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  THE FORGE: Step 0 - Diagnóstico SWOT                          [Próximo →] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────┬───────────────────────────────┐         │
│  │ FORÇAS (Interno +)            │ FRAQUEZAS (Interno -)         │         │
│  │ ┌───────────────────────────┐ │ ┌───────────────────────────┐ │         │
│  │ │ [Item 1]              [×] │ │ │ [Item A]              [×] │ │         │
│  │ └───────────────────────────┘ │ └───────────────────────────┘ │         │
│  │ [+ Adicionar]                 │ [+ Adicionar]                 │         │
│  ├───────────────────────────────┼───────────────────────────────┤         │
│  │ OPORTUNIDADES (Externo +)     │ AMEAÇAS (Externo -)           │         │
│  │ ┌───────────────────────────┐ │ ┌───────────────────────────┐ │         │
│  │ │ [Item X]              [×] │ │ │ [Item Z]              [×] │ │         │
│  │ └───────────────────────────┘ │ └───────────────────────────┘ │         │
│  │ [+ Adicionar]                 │ [+ Adicionar]                 │         │
│  └───────────────────────────────┴───────────────────────────────┘         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 StratOS AI                                                       │   │
│  │ [🔍 Sugerir Itens]  [🎯 Provocar]  [📊 Sintetizar Desafios]         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DESAFIOS ESTRATÉGICOS (gerados):                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. [Desafio gerado pela IA]                              [Editar]   │   │
│  │ 2. [Desafio gerado pela IA]                              [Editar]   │   │
│  │ 3. [Desafio gerado pela IA]                              [Editar]   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.1.1 Step 1: North Star

**Objetivo:** Definir Visão, Propósito e Valores da organização.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-1.1 | Vision Input | P0 | Campo de texto para Visão (máx 200 caracteres) |
| FR-1.2 | Purpose Input | P0 | Campo de texto para Propósito (máx 200 caracteres) |
| FR-1.3 | Values List | P0 | Lista de valores (mín 3, máx 7) |
| FR-1.4 | AI: Clarity Score | P1 | Score em tempo real (Especificidade, Memorabilidade, Diferenciação, Inspiração) |
| FR-1.5 | AI: Refine Suggestions | P1 | Gerar 3 versões alternativas quando score < 70% |
| FR-1.6 | AI: Values Conflict Check | P2 | Alertar se valores podem conflitar |
| FR-1.7 | Templates | P2 | Biblioteca de exemplos de empresas similares |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [← Voltar]    THE FORGE: Step 1 - North Star                  [Próximo →] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ⭐ VISÃO (Onde queremos chegar em 5-10 anos)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [_______________________________________________________________]   │   │
│  │                                                                      │   │
│  │ 🤖 Clareza: ████████░░ 80%                                          │   │
│  │    ⚠️ "Considere ser mais específico sobre o mercado-alvo"          │   │
│  │    [💡 Ver 3 Sugestões]                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎯 PROPÓSITO (Por que existimos)                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [_______________________________________________________________]   │   │
│  │                                                                      │   │
│  │ 🤖 Clareza: ██████████ 95%  ✓ Excelente!                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💎 VALORES (Como nos comportamos - 3 a 7)                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │ │ Valor 1  │ │ Valor 2  │ │ Valor 3  │ │ [+]      │                │   │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘                │   │
│  │                                                                      │   │
│  │ 🤖 ⚠️ "Valor 1 e Valor 3 podem conflitar em situações de pressão"   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.1.2 Step 2: Dimensões BSC

**Objetivo:** Mapear desafios do SWOT para as 4 dimensões do Balanced Scorecard.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-2.1 | BSC Grid | P0 | 4 cards representando as dimensões (não editáveis) |
| FR-2.2 | Challenge Mapping | P0 | Drag & Drop de desafios SWOT para dimensões |
| FR-2.3 | AI: Auto-mapping Suggestion | P1 | IA sugere mapeamento inicial |
| FR-2.4 | Balance Warning | P1 | Alerta se uma dimensão tem muitos/poucos desafios |
| FR-2.5 | Cascade Visualization | P2 | Mostrar relação causa-efeito entre dimensões |

#### 5.1.3 Step 3: Drivers Estratégicos

**Objetivo:** Definir as alavancas estratégicas que atacam os desafios.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-3.1 | Driver List | P0 | Lista de drivers por dimensão |
| FR-3.2 | Driver Form | P0 | Formulário com: Nome, Intenção, Escopo, Conexão com North Star |
| FR-3.3 | SWOT Link | P0 | Dropdown para vincular driver a desafio SWOT |
| FR-3.4 | Limit Enforcement | P0 | Máximo 5 drivers (UI bloqueia após) |
| FR-3.5 | AI: Driver Suggestions | P0 | IA gera drivers a partir dos desafios |
| FR-3.6 | AI: Logic Validation | P1 | IA valida se driver está conectado logicamente ao desafio |
| FR-3.7 | BSC Coverage Check | P1 | Alerta se alguma dimensão está sem driver |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [← Voltar]    THE FORGE: Step 3 - Drivers Estratégicos        [Próximo →] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DESAFIOS DO SWOT: [Desafio 1] [Desafio 2] [Desafio 3]          (contexto) │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 SUGESTÕES DE IA                                    [Gerar Mais]  │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │                                                                      │   │
│  │ ┌─────────────────────────────────────────────────────────────┐     │   │
│  │ │ 💡 Driver: "Arquitetura AI-First"            Confiança: 92% │     │   │
│  │ │ Dimensão: ⚙️ Processos  │  Deriva de: Desafio #1            │     │   │
│  │ │ [✓ Aceitar]  [✏️ Editar]  [✗ Rejeitar]                      │     │   │
│  │ └─────────────────────────────────────────────────────────────┘     │   │
│  │                                                                      │   │
│  │ ┌─────────────────────────────────────────────────────────────┐     │   │
│  │ │ 💡 Driver: "Diversificação de Portfólio"     Confiança: 87% │     │   │
│  │ │ Dimensão: 👤 Cliente  │  Deriva de: Desafio #3              │     │   │
│  │ │ [✓ Aceitar]  [✏️ Editar]  [✗ Rejeitar]                      │     │   │
│  │ └─────────────────────────────────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  DRIVERS ACEITOS (3/5):                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 💰 Financeira: (nenhum)                                             │   │
│  │ 👤 Cliente: Diversificação de Portfólio                             │   │
│  │ ⚙️ Processos: Arquitetura AI-First                                  │   │
│  │ 🌱 Aprendizado: Talent Density                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  [+ Criar Driver Manual]                                                    │
│                                                                             │
│  🤖 ⚠️ Dimensão Financeira sem driver. Considere adicionar um.             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.1.4 Step 4: Iniciativas Táticas e Operacionais

**Objetivo:** Decompor drivers em projetos (táticas) e fases (operacionais).

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-4.1 | Driver Selector | P0 | Dropdown para selecionar driver a detalhar |
| FR-4.2 | Tactical Initiative Form | P0 | Nome, Descrição, Owner, Data Início, Data Fim |
| FR-4.3 | Operational Initiative List | P0 | Lista de fases dentro da tática |
| FR-4.4 | Operational Initiative Form | P0 | Nome, Descrição, Owner, Período, % Progresso |
| FR-4.5 | Auto-code Generation | P0 | Código XX.YY para táticas, XX.YY.ZZ para operacionais |
| FR-4.6 | Minimum Validation | P0 | Pelo menos 1 operacional por tática |
| FR-4.7 | AI: Tactical Suggestions | P0 | IA sugere táticas para cada driver |
| FR-4.8 | AI: Phase Decomposition | P0 | IA sugere fases operacionais para cada tática |
| FR-4.9 | AI: Dependency Detection | P1 | IA identifica dependências entre iniciativas |
| FR-4.10 | AI: Timeline Estimation | P2 | IA sugere duração baseada em complexidade |
| FR-4.11 | AI: Risk Identification | P2 | IA identifica riscos comuns para tipo de projeto |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [← Voltar]    THE FORGE: Step 4 - Iniciativas                 [Próximo →] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Driver: [Arquitetura AI-First ▼]                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 SUGESTÃO DE INICIATIVA TÁTICA                                    │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ 💡 "Projeto Strangler Fig"                          Impacto: ALTO   │   │
│  │                                                                      │   │
│  │ Descrição: Migração incremental do monolito para microservices      │   │
│  │ Duração sugerida: 6 meses                                           │   │
│  │                                                                      │   │
│  │ 📋 FASES OPERACIONAIS SUGERIDAS:                                    │   │
│  │ ┌─────────────────────────────────────────────────────────────┐    │   │
│  │ │ 01. Assessment e Mapeamento de Dependências      (Mês 1)    │    │   │
│  │ │ 02. Setup de Infraestrutura Cloud-Native         (Mês 1-2)  │    │   │
│  │ │ 03. Migração de Serviços Periféricos             (Mês 2-3)  │    │   │
│  │ │ 04. Migração do Core (API Principal)             (Mês 3-5)  │    │   │
│  │ │ 05. Decomissão do Monolito                       (Mês 5-6)  │    │   │
│  │ └─────────────────────────────────────────────────────────────┘    │   │
│  │                                                                      │   │
│  │ [✓ Aceitar Completo]  [✏️ Editar Fases]  [✗ Rejeitar]               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  INICIATIVAS TÁTICAS ACEITAS:                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔷 01.01 Projeto Strangler Fig                                      │   │
│  │    ├── 01.01.01 Assessment e Mapeamento           @Hugo    Jan     │   │
│  │    ├── 01.01.02 Setup Infraestrutura              @CTO     Jan-Fev │   │
│  │    ├── 01.01.03 Migração Periféricos              @Hugo    Fev-Mar │   │
│  │    ├── 01.01.04 Migração Core                     @Hugo    Mar-Mai │   │
│  │    └── 01.01.05 Decomissão Monolito               @CTO     Mai-Jun │   │
│  │    [Expandir] [Editar] [Excluir]                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  [+ Nova Iniciativa Tática Manual]                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.1.5 Step 5: Metas e KPIs

**Objetivo:** Criar indicadores de resultado para medir sucesso.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-5.1 | Meta Form | P0 | Nome, Tipo (Resultado/Processo), Fórmula, Baseline, Target, Frequência |
| FR-5.2 | Link to Initiative | P0 | Vincular meta a Driver ou Tática |
| FR-5.3 | Stretch Goal | P2 | Campo opcional para meta stretch |
| FR-5.4 | AI: KPI Suggestions | P0 | IA sugere KPIs por tipo de iniciativa |
| FR-5.5 | AI: Benchmark Data | P1 | IA informa benchmarks de mercado para targets |
| FR-5.6 | AI: Coverage Check | P1 | Validar se há mix de leading/lagging indicators |
| FR-5.7 | Dashboard Preview | P1 | Preview de como KPIs aparecerão no War Room |
| FR-5.8 | Data Source Config | P2 | Configurar fonte de dados para atualização automática |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [← Voltar]    THE FORGE: Step 5 - Metas & KPIs              [Finalizar →] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Vinculado a: [01.01 Projeto Strangler Fig ▼]                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 SUGESTÕES DE KPIs                                                │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │                                                                      │   │
│  │ 📊 KPI DE RESULTADO (Lagging)                      Relevância: 95% │   │
│  │ Nome: % de Código Migrado                                           │   │
│  │ Fórmula: (LOC em microservices / LOC total) × 100                   │   │
│  │ Baseline: 0%  →  Target: 100%                                       │   │
│  │ Frequência: Mensal                                                  │   │
│  │ 💡 Benchmark: Meta alinhada com migrações similares                 │   │
│  │ [✓ Aceitar]  [✏️ Editar]  [✗ Rejeitar]                              │   │
│  │                                                                      │   │
│  │ 📊 KPI DE PROCESSO (Leading)                       Relevância: 88% │   │
│  │ Nome: Latência P95 da API                                           │   │
│  │ Baseline: 500ms  →  Target: 100ms  →  Stretch: 50ms                 │   │
│  │ 💡 "Benchmark: APIs elite têm P95 < 100ms. Target adequado."        │   │
│  │ [✓ Aceitar]  [✏️ Editar]  [✗ Rejeitar]                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  METAS ACEITAS:                                                             │
│  ┌──────────────────────┬─────────────────┬───────────┬──────────────┐     │
│  │ INICIATIVA           │ META            │ BASELINE  │ TARGET       │     │
│  ├──────────────────────┼─────────────────┼───────────┼──────────────┤     │
│  │ 01.01 Strangler Fig  │ % Código Migr.  │ 0%        │ 100%         │     │
│  │ 01.01 Strangler Fig  │ Latência P95    │ 500ms     │ 100ms        │     │
│  │ 01.01 Strangler Fig  │ Deploy Freq.    │ 1/sem     │ 5/sem        │     │
│  └──────────────────────┴─────────────────┴───────────┴──────────────┘     │
│                                                                             │
│  🤖 ✓ Cobertura: 1 Resultado + 2 Processo (mix adequado)                   │
│                                                                             │
│  PREVIEW DO DASHBOARD:                                                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │   ████░░ 45%    │ │   ████████░░    │ │   ██████████    │               │
│  │  % Migrado      │ │  120ms P95      │ │  6/sem deploys  │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 5.1.6 Step 6: Consolidação e Finalização

**Objetivo:** Revisar estratégia completa e publicar.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-6.1 | Strategy Overview | P0 | Visão consolidada de toda a estratégia |
| FR-6.2 | Validation Checklist | P0 | Lista de validações (todas verdes para publicar) |
| FR-6.3 | Publish Button | P0 | Muda status do ciclo para "Ativo" |
| FR-6.4 | AI: Final Review | P1 | IA faz revisão final e sugere melhorias |
| FR-6.5 | Export to PDF | P1 | Gerar documento executivo |
| FR-6.6 | Export to Markdown | P2 | Gerar para documentação |
| FR-6.7 | Share Link | P2 | Link público read-only para stakeholders |

---

### 5.2 MODULE 2: WAR ROOM (Dashboard Executivo)

**Objetivo:** Fornecer visão em tempo real da saúde estratégica.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-7.1 | North Star Banner | P0 | Visão e Propósito sempre visíveis no topo |
| FR-7.2 | BSC Health Cards | P0 | 4 cards com status agregado por dimensão |
| FR-7.3 | Status Calculation | P0 | Status calculado das metas/iniciativas |
| FR-7.4 | Critical Alerts | P0 | Lista de itens Off Track ou At Risk |
| FR-7.5 | Initiative Timeline | P1 | Gantt simplificado das táticas do quarter |
| FR-7.6 | AI: Daily Briefing | P1 | Resumo automático gerado pela IA |
| FR-7.7 | AI: Predictive Alerts | P1 | Alertas de risco baseados em tendências |
| FR-7.8 | AI: Weekly Insights | P2 | Análise de padrões e correlações |
| FR-7.9 | Drill-down | P1 | Click no card abre detalhes da dimensão |
| FR-7.10 | Time Filter | P1 | Filtrar por quarter/mês |
| FR-7.11 | Export | P2 | Exportar snapshot para PDF |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [StratOS]   War Room  │  The Forge  │  Execution  │  Governance   [@User]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⭐ VISÃO: "Ser o sistema operacional da empresa autônoma"          │   │
│  │  🎯 PROPÓSITO: "Empoderar humanos a orquestrar, não operar"         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SAÚDE ESTRATÉGICA                                    Ciclo: Hoshin 2026   │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │💰 FINANCEIRA  │ │👤 CLIENTE     │ │⚙️ PROCESSOS   │ │🌱 APRENDIZADO │   │
│  │───────────────│ │───────────────│ │───────────────│ │───────────────│   │
│  │    🟢 92%     │ │    🟡 78%     │ │    🟡 65%     │ │    🟢 88%     │   │
│  │               │ │               │ │               │ │               │   │
│  │ Drivers: 1    │ │ Drivers: 2    │ │ Drivers: 2    │ │ Drivers: 1    │   │
│  │ Táticas: 3    │ │ Táticas: 4    │ │ Táticas: 5    │ │ Táticas: 2    │   │
│  │ [Detalhar]    │ │ [Detalhar]    │ │ [Detalhar]    │ │ [Detalhar]    │   │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 BRIEFING DO DIA (13 Jan 2026)                         [Expandir] │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ ✅ Deploy Frequency atingiu 6/semana (acima do target)              │   │
│  │ ⚠️ Latência P95 subiu 25% - correlação: novo serviço de auth        │   │
│  │ 🔮 Previsão: Fase 03.01.03 tem 78% chance de atrasar                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🚨 ALERTAS CRÍTICOS                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [!] 01.01.03 Piloto Ampliado - 2 semanas atrasado       @Hugo       │   │
│  │ [!] Meta "Latência P95" trending down (-15%)            @CTO        │   │
│  │ [?] Driver "Customer Success" sem update há 30 dias     @CSO        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  TIMELINE Q1 2026                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Jan       Fev       Mar       Abr       Mai       Jun               │   │
│  │ ────────────────────────────────────────────────────────────────    │   │
│  │ ████████████████████░░░░░░░░░░░░  01.01 Strangler Fig (45%)        │   │
│  │ ░░░░░░░░████████████████████████████████  01.02 API Gateway (0%)   │   │
│  │ ████████████████  02.01 Hiring Sprint (60%)                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [📄 Exportar PDF]  [📧 Enviar Briefing]  [🔄 Atualizar]                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 MODULE 3: EXECUTION HUB (Gestão de Iniciativas)

**Objetivo:** Gerenciar execução das iniciativas no dia-a-dia.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-8.1 | Tree View | P0 | Visualização hierárquica: Driver > Tática > Operacionais |
| FR-8.2 | Kanban View | P1 | Visualização por status (Backlog, Em Progresso, Concluído) |
| FR-8.3 | Gantt View | P1 | Visualização de timeline com dependências |
| FR-8.4 | Filter by Driver | P0 | Filtrar iniciativas por driver |
| FR-8.5 | Filter by Owner | P0 | Filtrar iniciativas por responsável |
| FR-8.6 | Filter by Status | P0 | Filtrar por status (On Track, At Risk, Off Track) |
| FR-8.7 | Progress Update | P0 | Atualizar % de progresso de operacionais |
| FR-8.8 | Status Update | P0 | Atualizar status manual (override do calculado) |
| FR-8.9 | Checklist | P2 | Checklist de tarefas dentro de operacional |
| FR-8.10 | AI: Progress Suggestions | P2 | IA sugere % baseado em checklist |
| FR-8.11 | AI: Blocker Detection | P2 | IA detecta iniciativas paradas |
| FR-8.12 | Quick Actions | P1 | Ações rápidas: Marcar concluído, Escalar, Pedir update |

**Wireframe - Tree View:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXECUTION HUB                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Visualização: [● Árvore] [○ Kanban] [○ Gantt]                              │
│  Filtros: [Driver ▼] [Owner ▼] [Status ▼]                    [🔍 Buscar]   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚙️ PROCESSOS                                                        │   │
│  │ └── Driver: Arquitetura AI-First                                    │   │
│  │     │                                                                │   │
│  │     ├── 🔷 01.01 Projeto Strangler Fig                              │   │
│  │     │   │   Owner: @Hugo  │  Jan-Jun 2026  │  Status: 🟡 45%        │   │
│  │     │   │                                                            │   │
│  │     │   ├── 01.01.01 Assessment e Mapeamento                        │   │
│  │     │   │   Jan  │  @Hugo  │  🟢 100%  │  ✓ Concluído               │   │
│  │     │   │                                                            │   │
│  │     │   ├── 01.01.02 Setup Infraestrutura                           │   │
│  │     │   │   Jan-Fev  │  @CTO  │  🟢 100%  │  ✓ Concluído            │   │
│  │     │   │                                                            │   │
│  │     │   ├── 01.01.03 Migração Periféricos              ← EM FOCO    │   │
│  │     │   │   Fev-Mar  │  @Hugo  │  🟡 45%  │  Em Progresso           │   │
│  │     │   │   [Atualizar Progresso]  [Escalar]  [Ver Detalhes]        │   │
│  │     │   │                                                            │   │
│  │     │   ├── 01.01.04 Migração Core                                  │   │
│  │     │   │   Mar-Mai  │  @Hugo  │  ⚪ 0%  │  Não Iniciado            │   │
│  │     │   │                                                            │   │
│  │     │   └── 01.01.05 Decomissão Monolito                            │   │
│  │     │       Mai-Jun  │  @CTO  │  ⚪ 0%  │  Não Iniciado             │   │
│  │     │                                                                │   │
│  │     └── 🔷 01.02 AI Agent Framework                                 │   │
│  │         Owner: @CTO  │  Jul-Set 2026  │  Status: ⚪ 0%              │   │
│  │         [Expandir]                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 IA: "01.01.03 está em 45% com 70% do tempo consumido.            │   │
│  │ Risco de atraso. Sugestão: Revisar escopo ou adicionar recurso."    │   │
│  │                                              [Ver Opções]           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Wireframe - Kanban View:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXECUTION HUB                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Visualização: [○ Árvore] [● Kanban] [○ Gantt]     Filtro: Driver 01      │
│                                                                             │
│  ⚪ BACKLOG          🔵 EM PROGRESSO       🟢 CONCLUÍDO                     │
│  ─────────────       ─────────────────     ──────────────                   │
│                                                                             │
│  ┌─────────────┐     ┌─────────────────┐   ┌──────────────┐                │
│  │ 01.01.04    │     │ 01.01.03        │   │ 01.01.01     │                │
│  │ Migração    │     │ Migração        │   │ Assessment   │                │
│  │ Core        │     │ Periféricos     │   │              │                │
│  │             │     │ ████████░░ 45%  │   │ ✓ 100%       │                │
│  │ @Hugo       │     │ @Hugo           │   │ @Hugo        │                │
│  │ Mar-Mai     │     │ Fev-Mar         │   │ Jan          │                │
│  └─────────────┘     └─────────────────┘   └──────────────┘                │
│                                                                             │
│  ┌─────────────┐                           ┌──────────────┐                │
│  │ 01.01.05    │                           │ 01.01.02     │                │
│  │ Decomissão  │                           │ Setup Infra  │                │
│  │ Monolito    │                           │              │                │
│  │             │                           │ ✓ 100%       │                │
│  │ @CTO        │                           │ @CTO         │                │
│  │ Mai-Jun     │                           │ Jan-Fev      │                │
│  └─────────────┘                           └──────────────┘                │
│                                                                             │
│  [Arrastar cards para mover entre colunas]                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Wireframe - Gantt View:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  EXECUTION HUB                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Visualização: [○ Árvore] [○ Kanban] [● Gantt]     Filtro: Todos Drivers   │
│                                                                             │
│                          Jan    Fev    Mar    Abr    Mai    Jun            │
│  ────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚙️ Arquitetura AI-First                                                   │
│  │                                                                          │
│  ├─ 01.01 Strangler Fig   ████████████████████████████████████████████     │
│  │  ├─ 01.01.01 Assess.   ████ ✓                                           │
│  │  ├─ 01.01.02 Setup     ░░░░████ ✓                                       │
│  │  ├─ 01.01.03 Periféri.      ░░░░████████ ← HOJE                         │
│  │  ├─ 01.01.04 Core                ░░░░░░░░████████████                   │
│  │  └─ 01.01.05 Decomiss.                        ░░░░░░░░████              │
│  │                                                                          │
│  └─ 01.02 AI Framework                               ░░░░░░░░░░░░░░░░     │
│                                                                             │
│  🌱 Talent Density                                                         │
│  │                                                                          │
│  └─ 02.01 Hiring Sprint   ████████████████ (60%)                           │
│                                                                             │
│  ────────────────────────────────────────────────────────────────────────  │
│  LEGENDA:  ████ Concluído   ████ Em Progresso   ░░░░ Pendente   │ Hoje    │
│                                                                             │
│  🤖 Dependência detectada: 01.02 depende de 01.01.03 (em atraso)           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 MODULE 4: GOVERNANCE (Revisão e Catchball)

**Objetivo:** Facilitar rituais de governança estratégica.

| ID | Requisito | Prioridade | Descrição |
|----|-----------|------------|-----------|
| FR-9.1 | Review Dashboard | P0 | Visão de todas iniciativas com filtros |
| FR-9.2 | Off Track Filter | P0 | Filtro rápido para itens problemáticos |
| FR-9.3 | Catchball Threads | P1 | Discussões vinculadas a iniciativas |
| FR-9.4 | @Mentions | P1 | Mencionar usuários em comentários |
| FR-9.5 | Action Items | P2 | Extrair ações de discussões |
| FR-9.6 | History Log | P1 | Histórico de alterações |
| FR-9.7 | AI: Review Summary | P2 | IA resume discussões longas |
| FR-9.8 | AI: Action Extractor | P2 | IA identifica action items em texto |
| FR-9.9 | Scheduled Reviews | P2 | Agendamento de revisões periódicas |
| FR-9.10 | Export Review | P2 | Exportar ata de revisão |

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GOVERNANCE - Revisão Q1 2026                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Filtros: [× Off Track apenas]  [Owner ▼]  [Driver ▼]       [🔍 Buscar]    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ INICIATIVA            │ META (KPI)        │ TARGET   │ ATUAL │ ST  │   │
│  ├───────────────────────┼───────────────────┼──────────┼───────┼─────┤   │
│  │ 01.01 Strangler Fig   │ % Código Migrado  │ 100%     │ 45%   │ 🔴  │   │
│  │ 01.01 Strangler Fig   │ Latência P95      │ 100ms    │ 120ms │ 🟡  │   │
│  │ 02.01 Hiring Sprint   │ Time-to-Hire      │ 30 dias  │ 45d   │ 🟡  │   │
│  └───────────────────────┴───────────────────┴──────────┴───────┴─────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  CATCHBALL: 01.01 Strangler Fig                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ @Hugo (10 Jan, 14:30):                                              │   │
│  │ "Estamos bloqueados na migração do serviço de Auth. Dependência     │   │
│  │  do time de Infra para configurar o novo cluster Kubernetes."       │   │
│  │                                                                      │   │
│  │ @CEO (10 Jan, 15:45):                                               │   │
│  │ "Precisamos de mais recursos ou podemos simplificar o escopo?"      │   │
│  │                                                                      │   │
│  │ @Hugo (11 Jan, 09:00):                                              │   │
│  │ "Precisamos de 1 DevOps senior por 2 semanas. Sem isso, vamos       │   │
│  │  atrasar pelo menos 3 semanas."                                     │   │
│  │                                                                      │   │
│  │ @CEO (11 Jan, 10:30):                                               │   │
│  │ "Aprovado. @CTO, aloca o recurso até sexta."                        │   │
│  │                                                                      │   │
│  │ 🤖 ACTION ITEMS DETECTADOS:                                         │   │
│  │ ☐ @CTO: Alocar DevOps senior para 01.01  │  Deadline: Sexta         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Responder...]                                          [📤 Enviar]       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Inteligência Artificial: Especificação Detalhada

### 6.1 Arquitetura de IA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARQUITETURA DE IA - STRATOS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────────┐ │
│  │  FRONTEND   │    │   BACKEND   │    │         AI ORCHESTRATOR         │ │
│  │  (Next.js)  │◄──►│  (Supabase) │◄──►│                                 │ │
│  └─────────────┘    └─────────────┘    │  ┌───────────────────────────┐  │ │
│                                         │  │    CONTEXT BUILDER        │  │ │
│                                         │  │    - User context         │  │ │
│                                         │  │    - Cycle context        │  │ │
│                                         │  │    - Step context         │  │ │
│                                         │  └─────────────┬─────────────┘  │ │
│                                         │                │                 │ │
│                                         │                ▼                 │ │
│                                         │  ┌───────────────────────────┐  │ │
│                                         │  │    MODE SELECTOR          │  │ │
│                                         │  │    - Researcher           │  │ │
│                                         │  │    - Refiner              │  │ │
│                                         │  │    - Suggester            │  │ │
│                                         │  │    - Decomposer           │  │ │
│                                         │  │    - Validator            │  │ │
│                                         │  │    - Analyst              │  │ │
│                                         │  └─────────────┬─────────────┘  │ │
│                                         │                │                 │ │
│                                         │                ▼                 │ │
│                                         │  ┌───────────────────────────┐  │ │
│                                         │  │    PROMPT COMPOSER        │  │ │
│                                         │  │    (Jinja2 templates)     │  │ │
│                                         │  └─────────────┬─────────────┘  │ │
│                                         │                │                 │ │
│                                         │                ▼                 │ │
│                                         │  ┌───────────────────────────┐  │ │
│                                         │  │    LLM GATEWAY            │  │ │
│                                         │  │    - Claude (primary)     │  │ │
│                                         │  │    - GPT-4 (fallback)     │  │ │
│                                         │  └─────────────┬─────────────┘  │ │
│                                         │                │                 │ │
│                                         │                ▼                 │ │
│                                         │  ┌───────────────────────────┐  │ │
│                                         │  │    RESPONSE PARSER        │  │ │
│                                         │  │    - JSON extraction      │  │ │
│                                         │  │    - Validation           │  │ │
│                                         │  │    - UI mapping           │  │ │
│                                         │  └───────────────────────────┘  │ │
│                                         └─────────────────────────────────┘ │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      KNOWLEDGE BASES (RAG)                          │   │
│  ├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┤   │
│  │ Hoshin      │ Industry    │ KPI         │ Company     │ Best        │   │
│  │ Methodology │ Benchmarks  │ Library     │ History     │ Practices   │   │
│  │             │             │             │             │             │   │
│  │ KB_01.md    │ Web Search  │ Static DB   │ Past Cycles │ Templates   │   │
│  │ KB_02.md    │ Scrapers    │ DORA/OKR    │ Initiatives │ Patterns    │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Modos de IA por Etapa

| Etapa | Modo Primário | Modo Secundário | Trigger |
|-------|---------------|-----------------|---------|
| SWOT | 🔍 Researcher | 🎯 Provocateur | Auto + Botão |
| North Star | ✍️ Refiner | 🛡️ Clarity Guard | Tempo real |
| Dimensões | 🔗 Mapper | ⚖️ Balance Checker | Auto |
| Drivers | 💡 Suggester | 🔗 Logic Validator | Botão |
| Táticas | 📋 Decomposer | ⏱️ Timeline Advisor | Botão |
| Operacionais | 🎯 Task Generator | 🔄 Dependency Finder | Botão |
| Metas | 📊 KPI Architect | 🎯 Benchmark Finder | Botão |
| War Room | 🚨 Alert Analyst | 💬 Insight Generator | Scheduled + Auto |
| Governance | 📝 Review Summarizer | ✅ Action Extractor | Botão |

### 6.3 Especificação de Prompts (Exemplos)

#### 6.3.1 SWOT Researcher

```markdown
## System Prompt
Você é um analista estratégico especializado em diagnóstico SWOT para
empresas de tecnologia. Seu papel é sugerir itens relevantes para cada
quadrante baseado no contexto fornecido.

## User Prompt Template
Contexto da empresa:
- Setor: {{industry}}
- Tamanho: {{company_size}}
- Estágio: {{stage}}
- Descrição: {{description}}

SWOT atual:
- Forças: {{strengths}}
- Fraquezas: {{weaknesses}}
- Oportunidades: {{opportunities}}
- Ameaças: {{threats}}

Tarefa: Sugira 3 itens adicionais para cada quadrante que o usuário
pode não ter considerado. Para cada item:
1. Seja específico ao setor
2. Explique brevemente por que é relevante
3. Indique nível de confiança (alto/médio/baixo)

## Output Format (JSON)
{
  "strengths": [
    {"item": "...", "rationale": "...", "confidence": "high"}
  ],
  "weaknesses": [...],
  "opportunities": [...],
  "threats": [...]
}
```

#### 6.3.2 Driver Suggester

```markdown
## System Prompt
Você é um estrategista sênior que ajuda a traduzir desafios estratégicos
em drivers acionáveis. Siga rigorosamente a metodologia Hoshin Kanri:
- Driver deve atacar um desafio específico
- Driver deve ter Intenção (o que), Escopo (como), Conexão (por que)
- Máximo 5 drivers por ciclo
- Distribuir entre as 4 dimensões BSC

## User Prompt Template
North Star:
- Visão: {{vision}}
- Propósito: {{purpose}}

Desafios identificados no SWOT:
{{challenges}}

Drivers já definidos:
{{existing_drivers}}

Tarefa: Sugira até {{max_suggestions}} drivers estratégicos que:
1. Ataquem desafios não cobertos
2. Equilibrem as dimensões BSC
3. Estejam alinhados com o North Star

## Output Format (JSON)
{
  "suggestions": [
    {
      "name": "...",
      "dimension": "financial|customer|process|learning",
      "intention": "...",
      "scope": "...",
      "north_star_connection": "...",
      "source_challenge": "...",
      "confidence": 0.92
    }
  ],
  "coverage_analysis": {
    "financial": 1,
    "customer": 2,
    "process": 1,
    "learning": 0
  },
  "recommendations": ["..."]
}
```

#### 6.3.3 War Room Analyst

```markdown
## System Prompt
Você é um analista de gestão estratégica que gera briefings executivos
diários. Seu papel é:
1. Identificar vitórias e celebrar progresso
2. Alertar sobre riscos e tendências negativas
3. Fazer previsões baseadas em padrões
4. Sugerir ações concretas

Seja direto, use dados, evite jargões.

## User Prompt Template
Data atual: {{today}}

Snapshot da estratégia:
{{strategy_snapshot}}

Histórico de métricas (últimos 30 dias):
{{metrics_history}}

Iniciativas e status:
{{initiatives_status}}

Últimas atualizações:
{{recent_updates}}

Tarefa: Gere um briefing executivo com:
1. Vitórias (máx 3)
2. Alertas (máx 3)
3. Previsões (máx 2)
4. Ações sugeridas (máx 2)

## Output Format (JSON)
{
  "briefing_date": "2026-01-13",
  "wins": [
    {"metric": "...", "achievement": "...", "impact": "..."}
  ],
  "alerts": [
    {"severity": "high|medium", "issue": "...", "correlation": "...", "suggestion": "..."}
  ],
  "predictions": [
    {"initiative": "...", "probability": 0.78, "outcome": "...", "timeframe": "..."}
  ],
  "suggested_actions": [
    {"action": "...", "owner": "...", "rationale": "..."}
  ]
}
```

### 6.4 Métricas de IA

| Métrica | Descrição | Target |
|---------|-----------|--------|
| Acceptance Rate | % de sugestões aceitas pelo usuário | > 60% |
| Edit Rate | % de sugestões aceitas com edição | < 30% |
| Latency P95 | Tempo de resposta da IA | < 3s |
| Hallucination Rate | % de sugestões factualmente incorretas | < 5% |
| User Satisfaction | NPS das funcionalidades de IA | > 40 |

---

## 7. Requisitos Não-Funcionais

### 7.1 Performance

| Requisito | Especificação |
|-----------|---------------|
| Page Load | < 2s (LCP) |
| Time to Interactive | < 3s (TTI) |
| API Response | < 500ms (P95) |
| AI Response | < 5s (P95) |
| Concurrent Users | 100+ simultâneos |
| Data Freshness | Real-time (WebSocket) |

### 7.2 Segurança

| Requisito | Especificação |
|-----------|---------------|
| Autenticação | OAuth 2.0 (Google, Microsoft, Email) |
| Autorização | RBAC (Admin, Editor, Viewer) |
| Dados em Trânsito | TLS 1.3 |
| Dados em Repouso | AES-256 |
| Compliance | SOC 2 Type II (roadmap) |
| Backup | Diário, retenção 30 dias |
| Audit Log | Todas ações críticas |

### 7.3 Disponibilidade

| Requisito | Especificação |
|-----------|---------------|
| Uptime SLA | 99.9% |
| RTO | < 4 horas |
| RPO | < 1 hora |
| Região | Multi-região (US, BR) |

### 7.4 Acessibilidade

| Requisito | Especificação |
|-----------|---------------|
| WCAG | Nível AA |
| Keyboard Navigation | 100% funcionalidades |
| Screen Reader | Compatível |
| Color Contrast | 4.5:1 mínimo |

### 7.5 Internacionalização

| Requisito | Especificação |
|-----------|---------------|
| Idiomas MVP | Português (BR), English |
| Date Format | Locale-aware |
| Number Format | Locale-aware |
| Currency | Multi-currency |

---

## 8. Design System e UX Guidelines

### 8.1 Identidade Visual

| Elemento | Especificação |
|----------|---------------|
| **Primary Color** | Deep Navy #0A1628 |
| **Secondary Color** | Gold Accent #D4AF37 |
| **Accent Color** | Signal Blue #3B82F6 |
| **Success** | Emerald #10B981 |
| **Warning** | Amber #F59E0B |
| **Error** | Rose #EF4444 |
| **Background** | Dark Grey #111827 |
| **Text Primary** | White #FFFFFF |
| **Text Secondary** | Grey #9CA3AF |

### 8.2 Tipografia

| Uso | Font | Weight | Size |
|-----|------|--------|------|
| Headings | Inter | 700 | 24-32px |
| Subheadings | Inter | 600 | 18-20px |
| Body | Inter | 400 | 14-16px |
| Mono (codes) | JetBrains Mono | 400 | 13px |
| Labels | Inter | 500 | 12px |

### 8.3 Componentes Principais

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPONENT LIBRARY                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CARDS                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ BSC Card        │  │ Initiative Card │  │ AI Suggestion   │             │
│  │ ─────────────── │  │ ─────────────── │  │ ─────────────── │             │
│  │ Status: 🟢      │  │ Code: 01.01     │  │ Confidence: 92% │             │
│  │ Progress: 85%   │  │ Owner: @Hugo    │  │ [Accept] [Edit] │             │
│  │ [Detalhar]      │  │ Status: 🟡 45%  │  │ [Reject]        │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  INPUTS                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Label                                                                │   │
│  │ [Input field with placeholder_________________________________]     │   │
│  │ Helper text or validation message                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  BUTTONS                                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Primary     │  │ Secondary   │  │ Ghost       │  │ Destructive │       │
│  │ [Action]    │  │ [Action]    │  │ [Action]    │  │ [Delete]    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  STATUS BADGES                                                              │
│  [🟢 On Track]  [🟡 At Risk]  [🔴 Off Track]  [🔵 Concluído]  [⚪ Pending] │
│                                                                             │
│  PROGRESS                                                                   │
│  ████████████████████░░░░░░░░░░ 65%                                        │
│                                                                             │
│  AI PANEL                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🤖 StratOS AI                                                  [×]  │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ "Análise ou sugestão da IA aparece aqui..."                        │   │
│  │                                                                      │   │
│  │ [Ação 1]  [Ação 2]                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Princípios de Interação

| Princípio | Descrição |
|-----------|-----------|
| **Progressive Disclosure** | Mostrar informação em camadas, não tudo de uma vez |
| **Inline Editing** | Editar no lugar, sem modais desnecessários |
| **Contextual AI** | IA aparece onde é relevante, não em sidebar fixa |
| **Keyboard First** | Todas ações acessíveis via teclado |
| **Autosave** | Salvar automaticamente, sem botão "Salvar" |
| **Undo/Redo** | Ctrl+Z/Y para todas ações |
| **Feedback Imediato** | Toasts, spinners, estados de loading |

---

## 9. Arquitetura Técnica

### 9.1 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | Next.js 14+ (App Router) | SSR, RSC, Performance |
| **Styling** | Tailwind CSS | Utility-first, Dark mode |
| **State** | Zustand + React Query | Simplicidade + Cache |
| **Backend** | Supabase | Auth, DB, Realtime, Storage |
| **Database** | PostgreSQL | Relacional, JSONB, Full-text |
| **AI Gateway** | Vercel AI SDK | Streaming, Multi-provider |
| **LLM Primary** | Claude (Anthropic) | Qualidade, Context window |
| **LLM Fallback** | GPT-4 (OpenAI) | Redundância |
| **Hosting** | Vercel | Edge, Preview deployments |
| **Monitoring** | Vercel Analytics + Sentry | Performance + Errors |
| **CI/CD** | GitHub Actions | Automação |

### 9.2 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ARQUITETURA STRATOS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌─────────────┐                                │
│                              │   USERS     │                                │
│                              │  (Browser)  │                                │
│                              └──────┬──────┘                                │
│                                     │                                       │
│                                     ▼                                       │
│                         ┌─────────────────────┐                             │
│                         │    VERCEL EDGE      │                             │
│                         │    (CDN + WAF)      │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                        │
│           ┌────────────────────────┼────────────────────────┐               │
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   NEXT.JS APP   │    │   API ROUTES    │    │   AI ROUTES     │         │
│  │   (RSC + SSR)   │    │   (/api/*)      │    │   (/api/ai/*)   │         │
│  │                 │    │                 │    │                 │         │
│  │  - Pages        │    │  - CRUD ops     │    │  - Suggestions  │         │
│  │  - Components   │    │  - Auth         │    │  - Analysis     │         │
│  │  - Hooks        │    │  - Webhooks     │    │  - Briefings    │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                   │
│           │                      ▼                      │                   │
│           │           ┌─────────────────┐               │                   │
│           │           │    SUPABASE     │               │                   │
│           │           │                 │               │                   │
│           │           │  ┌───────────┐  │               │                   │
│           │           │  │ PostgreSQL│  │               │                   │
│           │           │  │ + RLS     │  │               │                   │
│           │           │  └───────────┘  │               │                   │
│           │           │                 │               │                   │
│           │           │  ┌───────────┐  │               │                   │
│           │           │  │  Auth     │  │               │                   │
│           │           │  │ (OAuth)   │  │               │                   │
│           │           │  └───────────┘  │               │                   │
│           │           │                 │               │                   │
│           │           │  ┌───────────┐  │               │                   │
│           │           │  │ Realtime  │  │               │                   │
│           │           │  │(WebSocket)│  │               │                   │
│           │           │  └───────────┘  │               │                   │
│           │           │                 │               │                   │
│           │           │  ┌───────────┐  │               │                   │
│           │           │  │ Storage   │  │               │                   │
│           │           │  │ (Files)   │  │               │                   │
│           │           │  └───────────┘  │               │                   │
│           │           └─────────────────┘               │                   │
│           │                                             │                   │
│           │                                             ▼                   │
│           │                                  ┌─────────────────┐            │
│           │                                  │  AI PROVIDERS   │            │
│           │                                  │                 │            │
│           │                                  │  ┌───────────┐  │            │
│           │                                  │  │ Anthropic │  │            │
│           │                                  │  │ (Claude)  │  │            │
│           │                                  │  └───────────┘  │            │
│           │                                  │                 │            │
│           │                                  │  ┌───────────┐  │            │
│           │                                  │  │  OpenAI   │  │            │
│           │                                  │  │ (GPT-4)   │  │            │
│           │                                  │  └───────────┘  │            │
│           │                                  └─────────────────┘            │
│           │                                                                 │
│           └─────────────────────────────────────────────────────────────────│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Schema do Banco de Dados (Simplificado)

```sql
-- Core Tables
CREATE TABLE cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  horizon TEXT NOT NULL, -- 'annual' | 'quarterly' | 'custom'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'active' | 'archived'
  start_date DATE,
  end_date DATE,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE north_stars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  vision TEXT,
  purpose TEXT,
  values JSONB DEFAULT '[]', -- [{name, description}]
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE swot_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  quadrant TEXT NOT NULL, -- 'strength' | 'weakness' | 'opportunity' | 'threat'
  content TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source_swot_items UUID[] DEFAULT '{}',
  bsc_dimension TEXT, -- 'financial' | 'customer' | 'process' | 'learning'
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- '01', '02', etc.
  name TEXT NOT NULL,
  intention TEXT,
  scope TEXT,
  north_star_connection TEXT,
  bsc_dimension TEXT NOT NULL,
  source_challenge_id UUID REFERENCES challenges(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tactical_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- '01.01', '01.02', etc.
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  start_date DATE,
  end_date DATE,
  status INTEGER DEFAULT 0, -- 0-5 status codes
  calculated_progress DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE operational_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tactical_id UUID REFERENCES tactical_initiatives(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- '01.01.01', '01.01.02', etc.
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id),
  start_date DATE,
  end_date DATE,
  progress DECIMAL(5,2) DEFAULT 0,
  status INTEGER DEFAULT 0,
  checklist JSONB DEFAULT '[]', -- [{task, done}]
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES cycles(id) ON DELETE CASCADE,
  linked_to_type TEXT NOT NULL, -- 'driver' | 'tactical'
  linked_to_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'result' | 'process'
  formula TEXT,
  baseline DECIMAL,
  target DECIMAL,
  stretch DECIMAL,
  frequency TEXT, -- 'daily' | 'weekly' | 'monthly' | 'quarterly'
  responsible_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE kpi_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  value DECIMAL NOT NULL,
  measured_at DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catchball_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  linked_to_type TEXT NOT NULL, -- 'tactical' | 'operational' | 'driver'
  linked_to_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catchball_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES catchball_threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  action_items JSONB DEFAULT '[]', -- [{task, assignee, deadline, done}]
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_drivers_cycle ON drivers(cycle_id);
CREATE INDEX idx_tactical_driver ON tactical_initiatives(driver_id);
CREATE INDEX idx_operational_tactical ON operational_initiatives(tactical_id);
CREATE INDEX idx_kpis_linked ON kpis(linked_to_type, linked_to_id);
CREATE INDEX idx_kpi_values_kpi ON kpi_values(kpi_id, measured_at DESC);
```

---

## 10. Roadmap de Implementação

### 10.1 Fases de Desenvolvimento

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROADMAP - STRATOS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PHASE 1: FOUNDATION (MVP)                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Objetivo: Permitir criação e visualização básica de estratégia             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ✓ Setup do projeto (Next.js, Supabase, Tailwind)                    │   │
│  │ ✓ Autenticação (Email + Google OAuth)                               │   │
│  │ ✓ The Forge: Steps 0-5 (formulários básicos)                        │   │
│  │ ✓ Hierarquia completa (Driver > Tática > Operacional)               │   │
│  │ ✓ CRUD de todas entidades                                           │   │
│  │ ✓ War Room básico (cards estáticos)                                 │   │
│  │ ✓ Export para Markdown                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Entregáveis: MVP funcional para dogfooding interno                         │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  PHASE 2: AI AUGMENTATION                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Objetivo: Adicionar inteligência artificial como co-piloto                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ □ AI Orchestrator (arquitetura de prompts)                          │   │
│  │ □ SWOT: Researcher + Provocateur                                    │   │
│  │ □ North Star: Refiner + Clarity Score                               │   │
│  │ □ Drivers: Suggester + Validator                                    │   │
│  │ □ Iniciativas: Decomposer + Timeline Advisor                        │   │
│  │ □ KPIs: KPI Architect + Benchmark Finder                            │   │
│  │ □ Knowledge Base (RAG) com metodologia Hoshin                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Entregáveis: Sugestões de IA em todas etapas do Forge                      │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  PHASE 3: EXECUTION & MONITORING                                            │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Objetivo: Transformar em ferramenta de gestão contínua                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ □ Execution Hub: Tree View                                          │   │
│  │ □ Execution Hub: Kanban View                                        │   │
│  │ □ Execution Hub: Gantt View                                         │   │
│  │ □ War Room: Real-time updates (WebSocket)                           │   │
│  │ □ War Room: AI Daily Briefing                                       │   │
│  │ □ War Room: Predictive Alerts                                       │   │
│  │ □ Governance: Catchball Threads                                     │   │
│  │ □ Governance: Review Dashboard                                      │   │
│  │ □ Notifications (Email + In-app)                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Entregáveis: Plataforma completa de gestão estratégica                     │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  PHASE 4: SCALE & POLISH                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Objetivo: Preparar para escala e clientes externos                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ □ Multi-tenancy (organizações)                                      │   │
│  │ □ RBAC (Admin, Editor, Viewer)                                      │   │
│  │ □ Export para PDF (design executivo)                                │   │
│  │ □ Integrações (Slack, Jira, Notion)                                 │   │
│  │ □ API pública                                                       │   │
│  │ □ Mobile responsive                                                 │   │
│  │ □ Onboarding wizard                                                 │   │
│  │ □ Templates de estratégia                                           │   │
│  │ □ Billing & Subscriptions                                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Entregáveis: Produto pronto para beta público                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Critérios de Aceitação por Fase

#### Phase 1: Foundation (MVP)
- [ ] Usuário consegue criar ciclo estratégico do zero
- [ ] Hierarquia Driver > Tática > Operacional funciona
- [ ] War Room mostra status agregado correto
- [ ] Export para Markdown gera documento legível
- [ ] Zero erros críticos em fluxo principal

#### Phase 2: AI Augmentation
- [ ] IA sugere itens em todas etapas do Forge
- [ ] Taxa de aceitação de sugestões > 50%
- [ ] Latência de IA < 5s (P95)
- [ ] Sugestões são contextualmente relevantes
- [ ] Usuário pode editar/rejeitar qualquer sugestão

#### Phase 3: Execution & Monitoring
- [ ] Três visualizações funcionam (Tree, Kanban, Gantt)
- [ ] Updates em tempo real no War Room
- [ ] AI Briefing gerado automaticamente
- [ ] Alertas disparam para itens Off Track
- [ ] Catchball permite discussões assíncronas

#### Phase 4: Scale & Polish
- [ ] Multi-tenant com isolamento de dados
- [ ] RBAC funcionando corretamente
- [ ] PDF exportado com qualidade profissional
- [ ] Integração com pelo menos 1 ferramenta externa
- [ ] < 3s para qualquer página carregar

---

## 11. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| IA gera sugestões irrelevantes | Média | Alto | Testes extensivos, feedback loop, prompts refinados |
| Complexidade do Hoshin afasta usuários | Média | Alto | Onboarding guiado, templates, ajuda contextual |
| Performance com muitos dados | Baixa | Médio | Paginação, virtualização, índices otimizados |
| Dependência de APIs de LLM | Média | Alto | Multi-provider (Claude + GPT), fallback, cache |
| Adoção lenta por resistência cultural | Alta | Alto | ROI claro, caso de uso piloto, executive sponsor |
| Escopo creep durante desenvolvimento | Alta | Médio | PRD rigoroso, sprints focados, MVP first |

---

## 12. Métricas de Sucesso do Produto

### 12.1 Métricas de Adoção

| Métrica | Definição | Target M1 | Target M6 |
|---------|-----------|-----------|-----------|
| WAU | Weekly Active Users | 10 | 100 |
| Strategies Created | Ciclos criados | 5 | 50 |
| Completion Rate | % de ciclos com todas etapas | 60% | 80% |

### 12.2 Métricas de Engajamento

| Métrica | Definição | Target |
|---------|-----------|--------|
| Weekly Check-ins | Usuários que abrem War Room/semana | > 70% |
| Update Frequency | Iniciativas atualizadas/semana | > 3 |
| AI Acceptance Rate | Sugestões aceitas / sugestões geradas | > 60% |

### 12.3 Métricas de Valor

| Métrica | Definição | Target |
|---------|-----------|--------|
| Time to Strategy | Tempo para criar estratégia completa | < 4h |
| Strategy Execution Rate | % iniciativas concluídas no prazo | > 70% |
| NPS | Net Promoter Score | > 50 |

---

## 13. Glossário

| Termo | Definição |
|-------|-----------|
| **BSC** | Balanced Scorecard - Framework de 4 dimensões (Financeira, Cliente, Processos, Aprendizado) |
| **Catchball** | Processo de negociação iterativa entre níveis hierárquicos |
| **Ciclo** | Período de planejamento estratégico (geralmente anual) |
| **Driver** | Alavanca estratégica que move a organização em direção aos objetivos |
| **Hoshin Kanri** | Metodologia japonesa de desdobramento de estratégia ("Policy Deployment") |
| **Iniciativa Operacional** | Fase ou ação dentro de uma iniciativa tática |
| **Iniciativa Tática** | Projeto com início e fim que implementa um driver |
| **KPI** | Key Performance Indicator - Indicador de desempenho |
| **Leading Indicator** | Indicador preditivo (antecede resultado) |
| **Lagging Indicator** | Indicador de resultado (confirma resultado) |
| **Meta** | Objetivo quantificável com baseline e target |
| **North Star** | Direção imutável (Visão + Propósito + Valores) |
| **SWOT** | Strengths, Weaknesses, Opportunities, Threats - Análise de contexto |

---

## 14. Histórico de Versões

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0.0 | 2026-01-12 | Product Team | Versão inicial |
| 2.0.0 | 2026-01-13 | Product Team + AI | Hierarquia corrigida (Tática > Operacional), AI detalhada, UX expandida |

---

## 15. Aprovações

| Papel | Nome | Data | Status |
|-------|------|------|--------|
| Product Owner | | | Pendente |
| Tech Lead | | | Pendente |
| CEO | | | Pendente |

---

*Este documento é vivo e será atualizado conforme o produto evolui.*
