---
title: "eximIA.OS — Slash Commands Quick Guide"
galaxy: "OPERATIONAL"
galaxy-color: "#FF69B4"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "slash-commands-guide"
  - "eximia.os — slash commands qui"
  - "o que são slash commands?"
  - "como funciona"
  - "comandos principais"
  - "📅 /schedule — the scheduler ("
  - "adicionar agente ao backlog"
  - "adicionar clone ao backlog"
  - "listar backlog"
  - "calcular rice scores e prioriz"
tags:
  - "galaxy-operational"
  - "document"
---

# eximIA.OS — Slash Commands Quick Guide

**Version:** 1.0.0
**Last Updated:** 2026-01-24

---

## O QUE SÃO SLASH COMMANDS?

Slash commands são atalhos para invocar agentes específicos do eximIA.OS no Claude Code. Em vez de digitar prompts longos, você usa comandos diretos como `/schedule next` ou `/copy vsl`.

### Como Funciona

```
Você digita: /schedule next

Claude Code:
  1. Detecta o comando "/schedule"
  2. Carrega The_Scheduler agent
  3. Executa subcomando "next"
  4. Retorna recomendação de próximo build
```

---

## COMANDOS PRINCIPAIS

### 📅 /schedule — The Scheduler (Roadmap Manager)

Gerencia backlog e roadmap de agentes/clones.

```bash
# Adicionar agente ao backlog
/schedule agent "The_Negotiator" --tier=2 --domain="Contract Negotiation"

# Adicionar clone ao backlog
/schedule clone "Naval Ravikant" --domain="Startup Philosophy"

# Listar backlog
/schedule list
/schedule list --filter=clones

# Calcular RICE scores e priorizar
/schedule prioritize

# Ver próximo recomendado
/schedule next

# Atualizar status
/schedule update jacob_petry --status=in_progress

# Ver roadmap
/schedule roadmap --timeframe=quarter

# 🆕 NOVO v1.1: Auto-executar pipeline completo
/schedule auto-execute jacob_petry --overnight=true
```

**Aliases:** `/sched`, `/s`

---

### 💡 /memo — Memo (Idea Bank)

Banco de ideias com conexões semânticas (Zettelkasten).

```bash
# Adicionar ideia
/memo "Use RICE framework for prioritization"

# Buscar ideias similares
/memo recall "agent architecture"

# Formar clusters
/memo cluster

# Gerar insights
/memo insights

# Ver grafo de conexões
/memo graph

# Listar todas
/memo list
```

**Aliases:** `/m`, `/idea`

---

### 🧬 /clone — Clone Factory Pipeline

Criação de clones digitais de personalidades.

```bash
# Iniciar novo clone
/clone start "Jacob Petry" --domain="Comportamento Humano"

# Executar fase de research (C1)
/clone research jacob_petry

# Executar análise cognitiva (C2)
/clone extract jacob_petry

# Criar KBs e prompt (C3)
/clone create jacob_petry

# Validar clone (C4)
/clone validate jacob_petry

# Ver status
/clone status jacob_petry
```

**Aliases:** `/cloner`

---

### 🏗️ /zsquad — Z Squad Pipeline

Criação de agentes via Z Squad.

```bash
# Iniciar novo agente
/zsquad start "The_Negotiator" --tier=2 --domain="Contract Negotiation"

# Criar spec (Z1)
/zsquad spec the_negotiator

# Criar profile e KBs (Z2)
/zsquad profile the_negotiator

# Engenharia de prompt (Z3)
/zsquad engineer the_negotiator

# Auditar e validar (Z4)
/zsquad audit the_negotiator

# Ver status
/zsquad status the_negotiator
```

**Aliases:** `/z`, `/agent-build`

---

### ✍️ /copy — Copy Squad (Elite Copywriting)

Copywriting com legendários copywriters.

```bash
# Diagnosticar awareness/sophistication (Tier 0)
/copy diagnose

# Receber recomendação de copywriter
/copy recommend

# Criar sales page (Gary Halbert)
/copy sales-page

# Criar VSL (Jon Benson)
/copy vsl

# Criar sequência de emails
/copy email-sequence dan-kennedy

# Gerar headlines (David Ogilvy)
/copy headlines

# Auditar copy existente (Claude Hopkins)
/copy audit

# Validar com 30 triggers psicológicos
/copy sugarman-check
```

**Aliases:** `/copywrite`

---

### 🎯 EXECUTIVE AGENTS

#### /maestro — The Maestro
Orquestrador supremo para tarefas multi-agente.
```bash
/maestro "Analyze this market and create a go-to-market strategy"
```

#### /veritas — The Veritas
Research profunda com anti-hallucination.
```bash
/veritas "What is the current market size for AI agents?"
```
**Aliases:** `/research`, `/fact-check`

#### /ceo — The CEO
Chief of Staff para tarefas executivas.
```bash
/ceo "Summarize this week's priorities"
```
**Aliases:** `/chief-of-staff`

#### /cfo — The CFO
Finanças corporativas (valuation, M&A, modeling).
```bash
/cfo "Value this SaaS company with $2M ARR, 120% NRR"
```
**Aliases:** `/finance`

#### /clo — The CLO
Legal & compliance.
```bash
/clo "Review this NDA for red flags"
```
**Aliases:** `/legal`

#### /cmo — The CMO
Marketing & growth.
```bash
/cmo "Create a growth strategy for B2B SaaS"
```
**Aliases:** `/marketing`

---

### 🔧 X AGENTS (Tactical Specialists)

#### /prototyper — The Prototyper
PRDs, RFCs, wireframes.
```bash
/prototyper "Create a PRD for a clone marketplace feature"
```
**Aliases:** `/prd`, `/rfc`

#### /strategist — StratOS
Planejamento estratégico (Hoshin Kanri).
```bash
/strategist "Create strategic plan for 2026"
```
**Aliases:** `/stratos`, `/hoshin`

#### /lxd — LXD Architect
Learning Experience Design.
```bash
/lxd "Design a course on agent creation"
```
**Aliases:** `/learning-design`

---

## WORKFLOW EXAMPLES

### Exemplo 1: Criar Novo Clone (Overnight)

```bash
# 22h (antes de dormir)
/schedule clone "Jacob Petry" --domain="Comportamento Humano" --priority=high
# → Adiciona ao backlog

/schedule prioritize jacob_petry
# → Calcula RICE (solicita Reach, Impact, Confidence)

/schedule auto-execute jacob_petry --overnight=true
# → Aprova execução

# Sistema executa durante a noite:
# C1_Hunter (Research) → C2_Extractor (Analysis) →
# C3_Creator (Build) → C4_Auditor (Validation)

# 08h (manhã seguinte)
# Clone completo, Turing Score: 9.2/10
# Review e aprovar → production
```

---

### Exemplo 2: Workflow de Copywriting

```bash
# Passo 1: Diagnosticar mercado
/copy diagnose
# → Retorna: "Problem Aware, Stage 3 sophistication"

# Passo 2: Receber recomendação
/copy recommend
# → Sugere: Gary Halbert (storytelling para Problem Aware)

# Passo 3: Criar sales page
/copy sales-page gary-halbert
# → Gary Halbert cria sales page

# Passo 4: Validar com triggers psicológicos
/copy sugarman-check
# → Aplica 30 triggers de Joe Sugarman
```

---

### Exemplo 3: Research + Strategy

```bash
# Passo 1: Research de mercado
/veritas "Market size for AI personality clones in 2026"
# → Retorna dados verificados com fontes

# Passo 2: Análise financeira
/cfo "What valuation multiple for AI agent marketplace?"
# → DCF, comparables, valuation range

# Passo 3: Estratégia
/strategist "Create 3-year strategic plan for eximIA.OS"
# → Hoshin Kanri deployment, KPIs, strategic themes

# Passo 4: Prototipar feature
/prototyper "PRD for clone marketplace MVP"
# → PRD completo com wireframes
```

---

## ALIASES RÁPIDOS

| Alias | Comando Completo | Descrição |
|:------|:----------------|:----------|
| `/s` | `/schedule` | Scheduler |
| `/m` | `/memo` | Memo |
| `/z` | `/zsquad` | Z Squad |
| `/research` | `/veritas` | Research |
| `/legal` | `/clo` | Legal |
| `/finance` | `/cfo` | Finance |
| `/marketing` | `/cmo` | Marketing |
| `/prd` | `/prototyper` | PRDs |

---

## TIPS & TRICKS

### 1. Chain Commands

Alguns comandos funcionam bem em sequência:

```bash
/schedule clone "Naval Ravikant"
# → Adiciona ao backlog

/schedule prioritize naval_ravikant
# → Calcula RICE

/schedule next
# → Verifica se é o próximo recomendado

/schedule auto-execute naval_ravikant --overnight=true
# → Executa pipeline
```

---

### 2. Use Aliases para Velocidade

```bash
# Longo
/schedule list --filter=clones

# Curto
/s list --filter=clones
```

---

### 3. Overnight Mode para Clones/Agents Complexos

```bash
# Clone Factory leva ~30h (compressed to 6-8h overnight)
/schedule auto-execute person_name --overnight=true

# Acorde com clone pronto para review
```

---

### 4. Memo para Capturar Ideias Durante Workflow

```bash
# Durante research
/veritas "AI agent market trends"

# Captura insight
/memo "AI agent market growing 45% YoY, focus on B2B SaaS"

# Continua workflow
/cfo "Value AI agent SaaS at $500k ARR"
```

---

### 5. Copy Squad para Todas as Peças de Marketing

```bash
/copy diagnose           # Diagnóstico
/copy sales-page         # Sales page
/copy email-sequence     # Email nurture
/copy headlines          # Headlines A/B test
/copy sugarman-check     # Valida tudo
```

---

## TROUBLESHOOTING

### Comando Não Reconhecido

```bash
❌ /unknown-command

Solução:
  - Verifique spelling
  - Use /help para ver comandos disponíveis
  - Verifique .eximia/SLASH_COMMANDS.yaml
```

---

### Subcomando Inválido

```bash
❌ /schedule invalid-subcommand

Solução:
  - Subcomandos válidos:
    agent, clone, list, prioritize, next, update, roadmap, auto-execute
```

---

### Item Não Encontrado no Backlog

```bash
❌ /schedule auto-execute unknown_item

Solução:
  - Use /schedule list para ver todos os items
  - Verifique o item_id (lowercase slug)
  - Adicione ao backlog primeiro: /schedule agent "Name"
```

---

## ARQUITETURA INTERNA

### Como os Slash Commands Funcionam

```
User: /schedule next

1. Claude Code detecta "/schedule"
2. Lookup em .eximia/SLASH_COMMANDS.yaml
3. Encontra agent: "the_scheduler"
4. Carrega workflow: .agent/workflows/schedule.md
5. Workflow instrui carregar:
   - Prompt: X_Agents/The_Scheduler/03_prompt/prompt_operacional.md
   - KBs: KB_01, KB_02, KB_03
6. Executa "Protocolo 3: Next Recommendation"
7. Retorna resultado ao user
```

---

### Registry Structure

```yaml
# .eximia/SLASH_COMMANDS.yaml
commands:
  - command: "/schedule"
    agent: "the_scheduler"
    workflow: ".agent/workflows/schedule.md"
    subcommands:
      - name: "next"
        syntax: "/schedule next"
        description: "Get next recommended build"
```

---

## ADICIONAR NOVOS COMANDOS

Para adicionar um novo comando:

1. Criar workflow em `.agent/workflows/[command].md`
2. Adicionar entry em `.eximia/SLASH_COMMANDS.yaml`
3. Testar: `/<novo-comando>`

Exemplo:

```yaml
- command: "/deploy"
  agent: "deployment_manager"
  description: "Deploy agent to production"
  workflow: ".agent/workflows/deploy.md"
```

---

## FUTURE COMMANDS (Planejados)

```bash
/deploy <agent_id>           # Deploy to production
/monitor <agent_id>          # Monitor performance
/rollback <agent_id>         # Rollback to previous version
/analytics                   # Usage analytics dashboard
```

---

## SUPPORT

- **Documentation:** Este guia + .eximia/SLASH_COMMANDS.yaml
- **Registry:** agent_registry.yaml
- **Workflows:** .agent/workflows/
- **Issues:** Report via GitHub issues

---

**Created:** 2026-01-24
**Version:** 1.0.0
**Maintainer:** eximIA.OS Core Team

#galaxy-operational