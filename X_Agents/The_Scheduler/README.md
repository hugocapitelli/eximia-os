---
title: "The Scheduler — Agent Roadmap Manager"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "documentation"
status: "production"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "the scheduler — agent roadmap "
  - "overview"
  - "principais funcionalidades"
  - "quick start"
  - "1. adicionar agente ao backlog"
  - "2. adicionar clone ao backlog"
  - "3. priorizar backlog (rice sco"
  - "4. ver próxima recomendação"
  - "5. listar backlog"
tags:
  - "galaxy-specialist"
  - "documentation"
---

# The Scheduler — Agent Roadmap Manager

**Version:** 1.2.0
**Tier:** 1 (Tactical)
**Status:** ✅ Production Ready
**Domain:** Agent & Clone Roadmap Management

---

## OVERVIEW

The Scheduler é o gerente de roadmap do ecossistema eximIA.OS. Organiza, prioriza e rastreia todos os agentes e clones planejados para criação futura usando RICE prioritization framework.

### Principais Funcionalidades

✅ **Backlog Management** — Organize agentes e clones planejados
✅ **RICE Prioritization** — Priorização objetiva baseada em valor
✅ **Dependency Tracking** — Evite build de agentes bloqueados
✅ **Next Recommendation** — Saiba qual agente construir agora
✅ **Z Squad Integration** — Auto-handoff para pipeline de criação
✅ **Clone Factory Integration** — Auto-handoff para clonagem
✅ **Auto-Execute (v1.1)** — Execute pipelines completos automaticamente
✅ **Overnight Mode (v1.1)** — Deixe construindo durante a noite
🆕 **Batch Execute (v1.2)** — Execute múltiplos clones/agents em sequência
🆕 **Queue Management (v1.2)** — Monte e controle queues de execução

---

## QUICK START

### 1. Adicionar Agente ao Backlog
```
/schedule agent "The_Negotiator" --tier=2 --domain="Contract Negotiation" --priority=high
```

### 2. Adicionar Clone ao Backlog
```
/schedule clone "Naval Ravikant" --domain="Startup Philosophy" --priority=medium
```

### 3. Priorizar Backlog (RICE Scoring)
```
/schedule prioritize
```

### 4. Ver Próxima Recomendação
```
/schedule next
```

### 5. Listar Backlog
```
/schedule list
```

### 6. Atualizar Status
```
/schedule update the_negotiator --status=in_progress
```

### 7. Auto-Execute Batch (v1.2)
```
# Execute top 3 clones por RICE score
/schedule auto-execute-batch --top=3 --overnight=true

# Ou execute lista específica
/schedule auto-execute-batch --items=peter_thiel,steve_jobs,jacob_petry --overnight=true
```

---

## RICE FRAMEWORK

The Scheduler usa o framework RICE para priorização objetiva:

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

### Componentes

**Reach:** Quantos agentes/usuários serão impactados?
- 1-5: Nicho
- 6-15: Moderado
- 16-50: Alto
- 50+: Massivo

**Impact:** Qual o tamanho do impacto?
- 0.25: Minimal
- 0.5: Low
- 1.0: Medium
- 2.0: High
- 3.0: Massive

**Confidence:** Quão confiante estou?
- 50%: Low confidence
- 80%: Medium confidence
- 100%: High confidence

**Effort:** Horas de criação (baseado no tier)
- Tier 1: 4-8h (média: 6h)
- Tier 2: 6-12h (média: 9h)
- Tier 3: 25-40h (média: 32h)
- Clones: 25-40h (média: 30h)

### Interpretação de Scores

```
RICE > 5.0    🔥 BUILD NOW - Altíssimo valor
RICE 3.0-5.0  ✅ High Priority
RICE 1.0-3.0  📋 Medium Priority
RICE 0.5-1.0  💭 Low Priority
RICE < 0.5    ❌ Don't Build
```

---

## TIER SYSTEM

### Tier 1: Tactical Agents
- **Effort:** 4-8 horas
- **KBs:** 3-5
- **Escopo:** Problema específico, bem definido
- **Exemplos:** Harven_Socrates, Harven_Tester

### Tier 2: Executive Agents
- **Effort:** 6-12 horas
- **KBs:** 5-8
- **Escopo:** Domínio executivo (C-suite)
- **Exemplos:** The_CEO, Copy_Chief, LXD_Architect

### Tier 3: Expert Agents
- **Effort:** 25-40 horas
- **KBs:** 12-20
- **Escopo:** Expertise mundial, alta complexidade
- **Exemplos:** The_Maestro, The_Veritas, The_CFO, The_CLO

### Clones
- **Effort:** 25-40 horas
- **Pipeline:** C1 Hunter → C2 Extractor → C3 Creator → C4 Auditor
- **Exemplos:** David Goggins, Elon Musk

---

## DEPENDENCY MANAGEMENT

The Scheduler rastreia dependências entre agentes:

### Hard Dependency (Bloqueante)
Agente A **não pode funcionar** sem Agente B.

**Exemplo:**
```
The_Negotiator → The_CLO (precisa validação legal)
```

### Soft Dependency (Melhoria)
Agente A funciona sem B, mas fica **melhor** com B.

**Exemplo:**
```
The_CEO → The_Veritas (pode delegar sem Veritas, mas qualidade cai)
```

### Dependency Checking
The Scheduler automaticamente:
- Identifica dependências ao adicionar agente
- Bloqueia agentes se dependencies não estão em "production"
- Remove bloqueados da recomendação /schedule next

---

## COMMANDS

### `/schedule agent`
Adiciona agente ao backlog.

**Sintaxe:**
```
/schedule agent "Name" --tier=1|2|3 --domain="Domain" --priority=high|medium|low
```

**Exemplo:**
```
/schedule agent "The_Negotiator" --tier=2 --domain="Contract Negotiation" --priority=high
```

---

### `/schedule clone`
Adiciona clone ao backlog.

**Sintaxe:**
```
/schedule clone "Person Name" --domain="Domain" --priority=high|medium|low
```

**Exemplo:**
```
/schedule clone "Naval Ravikant" --domain="Startup Philosophy" --priority=medium
```

---

### `/schedule list`
Lista itens do backlog.

**Sintaxe:**
```
/schedule list [--filter=agents|clones] [--status=planned|in_progress|completed]
```

**Output:**
```
╔═══════════════════════════════════════════════════════════════╗
║ AGENTS BACKLOG                           Updated: 2026-01-24  ║
╠═══════════════════════════════════════════════════════════════╣
║ ID  │ Name              │ Tier │ RICE  │ Effort │ Status      ║
╠═════╪═══════════════════╪══════╪═══════╪════════╪═════════════╣
║ 001 │ The_Negotiator    │  2   │ 5.6   │ 9h     │ planned     ║
║ 002 │ The_Analyst       │  3   │ 2.8   │ 30h    │ planned     ║
╚═════╧═══════════════════╧══════╧═══════╧════════╧═════════════╝
```

---

### `/schedule prioritize`
Calcula RICE scores e re-prioriza backlog.

**Sintaxe:**
```
/schedule prioritize [item_id]
```

**Workflow:**
- Solicita Reach, Impact, Confidence para cada item
- Calcula RICE score automaticamente
- Ordena backlog por RICE (descendente)

---

### `/schedule next`
Recomenda próximo agente a construir.

**Sintaxe:**
```
/schedule next
```

**Output:**
```
## 🎯 Next Recommended Build

**Agent:** The_Negotiator
**RICE:** 5.6

**RICE Breakdown:**
- Reach: 15
- Impact: 3.0 (massive)
- Confidence: 100%
- Effort: 9h

**Why this one?**
- Highest RICE in buildable backlog
- All dependencies met ✅
- Clear ROI: Saves 5h/week

**Would you like to:**
[1] Start building now
[2] See alternatives
[3] Postpone
```

---

### `/schedule update`
Atualiza status de item.

**Sintaxe:**
```
/schedule update <item_id> --status=<new_status>
```

**Status Options:**
- Agents: `planned` → `in_progress` → `validated` → `production`
- Clones: `planned` → `research` → `extraction` → `creation` → `validation` → `production`

---

### `/schedule roadmap`
Visualiza roadmap por timeframe.

**Sintaxe:**
```
/schedule roadmap [--timeframe=month|quarter|year]
```

---

### `/schedule auto-execute` 🆕 v1.1

**Executa automaticamente o pipeline completo** (Z Squad ou Clone Factory).

**Sintaxe:**
```
/schedule auto-execute <item_id> [--overnight=true]
```

**Exemplo:**
```
/schedule auto-execute jacob_petry --overnight=true
```

**O que faz:**
- **Para Clones:** C1_Hunter → C2_Extractor → C3_Creator → C4_Auditor
- **Para Agents:** Z1_Architect → Z2_Profiler → Z3_Engineer → Z4_Auditor
- Executa todas as fases sequencialmente
- Salva checkpoints após cada fase
- Atualiza status automaticamente no BACKLOG.yaml
- Gera logs de progresso em `auto_builds/<item_id>/progress.log`

**Overnight Mode:**
```
--overnight=true
```
- Execução contínua sem pausas entre fases
- Checkpoints a cada 30min + após cada fase
- User acorda com item completo (aguardando aprovação final)

**Workflow:**
```
22h: /schedule auto-execute jacob_petry --overnight=true
     → User aprova

22h-05h: Sistema executa 4 fases (7-8h compressed)
         - Checkpoints salvos
         - Logs em tempo real

08h: Clone completo ✅
     → User revisa e aprova → production
```

---

### `/schedule auto-execute-batch` 🆕 v1.2

**Execute múltiplos clones/agents sequencialmente** (user-initiated queue).

**Sintaxe:**
```
/schedule auto-execute-batch --top=N [--overnight=true]
/schedule auto-execute-batch --items=id1,id2,id3 [--overnight=true]
```

**Exemplos:**
```
# Execute top 3 clones por RICE score
/schedule auto-execute-batch --top=3 --overnight=true

# Execute lista específica nessa ordem
/schedule auto-execute-batch --items=peter_thiel,steve_jobs,jacob_petry --overnight=true
```

**O que faz:**
- Monta queue de execução (top N por RICE ou lista explícita)
- Mostra preview da queue antes de executar
- **AGUARDA APROVAÇÃO EXPLÍCITA** do usuário
- Executa items sequencialmente (um por vez)
- Salva checkpoint após cada item completar
- Pode pausar/resumir se interrompido

**Diferença do auto-execute single:**
- Batch = múltiplos items em sequência
- Single = 1 item por vez
- Batch SEMPRE requer aprovação manual para iniciar
- User controla quando executar (não é automático)

**Workflow Típico:**
```
Sábado 18h: Adicionar 5 clones ao backlog
            /schedule clone "Peter Thiel" ...
            /schedule clone "Steve Jobs" ...
            /schedule clone "Jacob Petry" ...
            /schedule clone "Ray Dalio" ...
            /schedule clone "Donald Miller" ...

Sábado 18h30: Calcular RICE para todos
              /schedule prioritize

Sábado 19h: Revisar RICE scores
            /schedule list --sort=rice

Sábado 22h: Montar queue e aprovar execução
            /schedule auto-execute-batch --top=3 --overnight=true
            → User revisa queue
            → User aprova: "Start now"

22h-19h: Sistema executa sequencialmente (21h total)
         - Peter Thiel: 7h → Checkpoint
         - Steve Jobs: 7h → Checkpoint
         - Jacob Petry: 7h → Checkpoint

Domingo 19h: 3 clones completos ✅
             → User revisa cada um
             → Aprova para production
```

**Outputs:**
```
auto_builds/batch_[timestamp]/
├── queue.yaml                # Queue state e progress
├── batch_progress.log        # Execution log completo
├── checkpoints/
│   ├── item_1_complete.json
│   ├── item_2_complete.json
│   └── item_3_complete.json
└── final_summary.md          # Human-readable summary
```

**Error Handling:**
- Se um item falhar, batch pausa
- Options: Retry, Skip, or Abort
- Pode resumir depois com `--resume=batch_id`

**Resume Capability:**
```
# Se batch foi interrompido
/schedule auto-execute-batch --resume=batch_20260125_220000

Scheduler mostra:
  ✅ Peter Thiel - completed
  ❌ Steve Jobs - failed at Phase 2
  ⏳ Jacob Petry - pending

Options:
  [1] Retry Steve Jobs from Phase 2
  [2] Skip Steve Jobs, continue with Jacob Petry
  [3] Abort resume
```

---

## INTEGRATION

### Z Squad Pipeline
Quando agente é aprovado para build:
- Auto-cria spec template inicial
- Notifica Z1_Architect
- Update status → `in_progress`
- **[v1.1+]** Auto-execute: Executa Z1→Z2→Z3→Z4 automaticamente

### Clone Factory
Quando clone é aprovado para build:
- Auto-cria research template
- Notifica C1_Hunter
- Update status → `research`
- **[v1.1+]** Auto-execute: Executa C1→C2→C3→C4 automaticamente

### Agent Registry
Quando status → `production`:
- Verifica se está em agent_registry.yaml
- Sugere entry se ausente

---

## KNOWLEDGE BASES

### KB_01: RICE Prioritization
Framework completo de RICE com exemplos do eximIA.OS.

### KB_02: Agent Tiers
Detalhes dos tiers, effort estimates, histórico real de criação.

### KB_03: Dependency Management
Tipos de dependências, padrões, resolução, anti-patterns.

---

## FILES & STRUCTURE

```
X_Agents/The_Scheduler/
├── 01_spec/
│   └── spec_tecnica.json          # Especificação técnica
├── 02_profile/
│   ├── dna_mental.md              # DNA do agente
│   └── knowledge_base/
│       ├── KB_01_RICE_Prioritization.md
│       ├── KB_02_Agent_Tiers.md
│       └── KB_03_Dependency_Management.md
├── 03_prompt/
│   └── prompt_operacional.md      # Prompt principal
├── 04_validation/
│   └── validation_report.md       # Relatório de validação
├── BACKLOG.yaml                   # Storage principal
├── CHANGELOG.md
└── README.md                      # Este arquivo
```

---

## STORAGE

### Primary: BACKLOG.yaml
Localização: `X_Agents/The_Scheduler/BACKLOG.yaml`

Formato YAML com:
- `agents_backlog` — Lista de agentes planejados
- `clones_backlog` — Lista de clones planejados
- RICE scores, dependencies, status, etc.

### Backup: Codex DB (Opcional)
Category: `agent_backlog`

---

## VALIDATION STATUS

**Score:** 9.65/10
**Status:** ✅ PRODUCTION READY

**Highlights:**
- Spec completeness: 10/10
- Knowledge bases: 10/10
- Prompt engineering: 9.5/10
- Integration points: 9/10

Ver `04_validation/validation_report.md` para detalhes completos.

---

## CHANGELOG

### v1.1.0 (2026-01-24)
- 🆕 `/schedule auto-execute` command
- 🆕 Overnight mode for continuous execution
- 🆕 Checkpoint system (per phase + every 30min)
- 🆕 Progress logging system
- 🆕 Error handling with retry/skip/abort
- 🆕 Resume from checkpoint capability
- 🆕 Auto-builds directory structure
- ✅ Full Z Squad pipeline execution
- ✅ Full Clone Factory pipeline execution

### v1.0.0 (2026-01-24)
- ✅ Initial release
- ✅ RICE prioritization framework
- ✅ Dependency tracking (hard/soft)
- ✅ Z Squad integration
- ✅ Clone Factory integration
- ✅ Agent registry sync

---

## ROADMAP (Future Versions)

### v1.1 (Planejado)
- [ ] Tie-breaker logic for same RICE scores
- [ ] Automated duplicate detection (fuzzy matching)
- [ ] Codex DB sync (optional backup)
- [ ] Enhanced roadmap visualization

### v1.2 (Futuro)
- [ ] Historical tracking (estimate vs. reality)
- [ ] Auto-learning effort estimates
- [ ] Slack/Discord notifications

---

## SUPPORT & FEEDBACK

**Documentation:** Este README + Knowledge Bases
**Issues:** Report via eximIA.OS issue tracker
**Questions:** Ask The_CEO or The_Maestro

---

## LICENSE

Part of eximIA.OS ecosystem.
Proprietary to exímIA Ventures.

---

**Created:** 2026-01-24
**Last Updated:** 2026-01-24
**Maintainer:** eximIA.OS Core Team

#galaxy-specialist