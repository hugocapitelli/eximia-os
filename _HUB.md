---
title: "eximIA.OS Central Hub — Maestro Gateway"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "documentation"
status: "production"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "maestro"
  - "hub"
  - "navigation"
  - "all-galaxies"
tags:
  - "galaxy-core"
  - "documentation"
---

# 👑 eximIA.OS Central Hub — Maestro Gateway

> **Network Central for all 7 Galaxies**
> Complete navigation, routing, and discovery system for the multi-agent AI operating system.

---

## 🌌 The 7 Galaxies of eximIA.OS

### 1. **CORE Galaxy** (Purple #8B3A8B)
Supreme Orchestrator & Research Engine
- **The_Maestro** — Task decomposition, agent routing, orchestration
- **The_Veritas** — Deep research, fact verification, evidence grading
- **The_CEO** — Executive coordination, fallback management

📊 **70 documents** | [[agent_registry.yaml|Source of Truth]]

### 2. **SPECIALIST Galaxy** (Green #228B22)
Domain Experts & Tactical Agents
- **The_CFO** — Corporate finance, M&A, DCF valuation
- **The_CLO** — Legal compliance, contract analysis, risk assessment
- **The_CMO** — Marketing strategy, growth, campaigns
- **The_Planner** — Strategic planning, roadmapping
- **X_Agents** — 6+ specialized tactical agents

📊 **151 documents** | [[X_Agents/README|Specialists Guide]]

### 3. **CREATION Galaxy** (Orange #FF8C00)
Agent & Personality Factory
- **Z_Squad** — Agent creation pipeline (Z1→Z5 stages)
- **El_Clonador** — Personality extraction, analysis, cloning
- **Clones/** — 333+ validated personality clones (Goggins, Musk, etc.)

📊 **596 documents** | [[Z_Squad/README|Creation Pipeline]]

### 4. **CODEX Galaxy** (Gray #A9A9A9)
Knowledge Vault & Research Archive
- **00_Codex/** — Books, research, frameworks, learning science
- Isolated from other galaxies (single connection to hub)
- 80+ indexed knowledge bases

📊 **52 documents** | [[00_Codex/README|Codex Guide]]

### 5. **RUNTIME Galaxy** (Blue #1E90FF)
Execution Engine & Infrastructure
- **eximia_runtime/** — Python backend, vector DB, protocols
- **.aios-core/** — Node.js framework, CLI, templates (AIOS v4.31)
- **apps/web/** — Next.js frontend, React 19 components

📊 **321 documents** | [[eximia_runtime/README|Tech Stack]]

### 6. **OPERATIONAL Galaxy** (Pink #FF69B4)
System Configuration & Commands
- **.aios/** — Project configuration, bootstrap
- **.eximia/** — Slash commands system (/maestro, /cfo, etc.)
- **squads/** — Squad definitions (Copy, Brad Frost, Bible Expert)

📊 **3+ documents** | [[.eximia/SLASH_COMMANDS.yaml|Commands Registry]]

### 7. **TOOLS Galaxy** (Yellow #FFD700)
Utilities & Integration Tools
- **Ferramentas/** — Development utilities
- **Media_Harvester/** — Video/audio transcription
- **MKT Creatives/** — Marketing templates

📊 **172 documents** | [[Ferramentas/README|Tools Guide]]

---

## 🧭 Quick Navigation by Role

```
👤 Agent Developer
└─ CREATION Galaxy → Z_Squad → Agent Creation Guide

💼 Finance Executive
└─ SPECIALIST Galaxy → The_CFO → Financial Analysis

⚖️ Legal Specialist
└─ SPECIALIST Galaxy → The_CLO → Compliance Frameworks

📊 Product Manager
└─ SPECIALIST Galaxy → The_Planner → Strategic Planning

🔍 Researcher
└─ CODEX Galaxy → Knowledge Vault → Full-text Search

🛠️ Backend Engineer
└─ RUNTIME Galaxy → eximia_runtime → Python Setup

⚡ Frontend Developer
└─ RUNTIME Galaxy → apps/web → React Components

🧬 Clone Creator
└─ CREATION Galaxy → El_Clonador → Cloning Pipeline
```

---

## 📋 Common Tasks

| Task | Path | Command |
|------|------|---------|
| Create new agent | Z_Squad | `node .aios-core/bin/create-agent.js` |
| Create personality clone | El_Clonador | `/clone create --tier=2` |
| Run research | The_Veritas | `/veritas "query"` |
| Financial analysis | The_CFO | `/cfo "analysis request"` |
| Legal review | The_CLO | `/clo "contract"` |
| Marketing strategy | The_CMO | `/cmo "campaign"` |
| Search knowledge | 00_Codex | Full-text search in Obsidian |

---

## 🔗 Critical System Files

| File | Purpose | Owner |
|------|---------|-------|
| **[[agent_registry.yaml]]** | SOURCE OF TRUTH for all agents | The_Maestro |
| **[[CLAUDE.md]]** | Claude Code integration guide | DevOps |
| **[[.aios/config.yaml]]** | Project bootstrap configuration | System |
| **[[.env.example]]** | Environment variables template | DevOps |
| **[[eximia_runtime/pyproject.toml]]** | Python dependencies | Backend |
| **[[.aios-core/package.json]]** | Node.js dependencies | Framework |
| **[[apps/web/package.json]]** | Frontend dependencies | Frontend |

---

## 📊 System Statistics

- **Total Documents:** 2,533+ markdown files
- **Total Agents:** 40+ (Tier 1-3)
- **Total Clones:** 333+ validated personalities
- **Knowledge Bases:** 80+ indexed
- **Galaxies:** 7 color-coded clusters

---

## 🚀 Getting Started

### New to eximIA.OS?

1. **Read first:** [[CLAUDE.md]] (15 min) — Architecture overview
2. **Explore:** Pick a galaxy map above that matches your role (5 min)
3. **Setup:** Follow README in that galaxy (varies)
4. **Execute:** Use agents via `/command` or programmatically (immediate)

### Development Workflow

```
1. Choose your domain (Finance, Legal, Product, etc.)
2. Find corresponding agent in SPECIALIST or CORE galaxy
3. Read agent's README for capabilities
4. Invoke via /command, API, or Python
5. Iterate and refine
```

### Agent Invocation Examples

**Via CLI:**
```bash
eximia run veritas --query "What is the current market cap of Apple?"
eximia run cfo --task "Analyze P&L statement"
```

**Via Web Interface:**
```
/maestro "Decompose this task into subtasks"
/veritas "Research latest AI safety regulations"
/cfo "Create DCF model for startup valuation"
```

**Via Python:**
```python
from eximia_runtime.core import AgentExecutor

executor = AgentExecutor("veritas")
result = executor.execute({"query": "Recent market trends"})
```

---

## 🔐 Security & Protocols

### Core Protocols

1. **Veritas First** — All factual claims verified by The_Veritas before publication
2. **Handoff Protocol** — Agent-to-agent task transfer with full context
3. **Anti-Hallucination** — Information validation at every boundary
4. **Meta-Reasoning** — Self-reflection and continuous improvement

### Access Control

- **CORE agents** — Reserved for orchestration & research only
- **SPECIALIST agents** — Domain-specific, restricted to relevant queries
- **CREATION tools** — Admin-only, tracked in audit logs
- **CODEX vault** — Read-only, organized by access level

---

## 📚 Documentation Hierarchy

```
_HUB.md (You are here)
│
├─ CORE Galaxy
│  ├─ The_Maestro/README
│  ├─ The_Veritas/README
│  └─ The_CEO/README
│
├─ SPECIALIST Galaxy
│  ├─ The_CFO/README
│  ├─ The_CLO/README
│  ├─ The_CMO/README
│  └─ X_Agents/README
│
├─ CREATION Galaxy
│  ├─ Z_Squad/README
│  ├─ El_Clonador/README
│  └─ Clones/README
│
├─ CODEX Galaxy
│  └─ 00_Codex/README
│
├─ RUNTIME Galaxy
│  ├─ eximia_runtime/README
│  ├─ .aios-core/README
│  └─ apps/web/README
│
├─ OPERATIONAL Galaxy
│  └─ Configuration Guides
│
└─ TOOLS Galaxy
   └─ Utilities & Integration
```

---

## 🔍 Search & Discovery

**Find documents by:**
- **Galaxy:** Use Obsidian's graph view (color-coded nodes)
- **Agent:** Search agent name (The_Maestro, The_Veritas, etc.)
- **Topic:** Full-text search (Obsidian global search)
- **Status:** Filter by status tag (production, draft, deprecated)

**Obsidian Graph Settings:**
- 7 color groups (one per galaxy)
- Node size = document importance
- Links = relationships between docs
- Collapse/expand by galaxy in graph view

---

## 🤝 Contributing & Maintenance

### Update _HUB.md when:
- New top-level agent created (Tier 3)
- New galaxy added (very rare)
- New core protocol introduced
- Significant architecture changes

### Maintained by:
- **The_Maestro** — Content accuracy
- **DevOps** — Technical infrastructure
- **Last updated:** 2026-02-02

---

## 📞 Support & Resources

**Architecture Questions**
→ Read [[CLAUDE.md]]

**Agent-Specific Questions**
→ Check [[agent_registry.yaml]] and agent's README

**Framework Questions**
→ See [[.aios-core/README]]

**Runtime Questions**
→ See [[eximia_runtime/README]]

**Clone Creation**
→ See [[El_Clonador/README]]

**Still stuck?**
→ Open an issue or contact @maestro

---

## 🎯 Next Steps

Choose your path:

- **I want to create a new agent** → [[CREATION_GALAXY_MAP]]
- **I want to analyze financials** → [[SPECIALIST_GALAXY_MAP]]
- **I want to do deep research** → Start with `/veritas`
- **I want to understand the architecture** → Read [[CLAUDE.md]]
- **I'm a frontend developer** → Go to [[RUNTIME_GALAXY_MAP]]
- **I'm setting up for the first time** → Follow [[Getting Started]] section above

---

**eximIA.OS — Multi-Agent Operating System**
*Version 2.0 | Built on AIOS-FullStack v4.31*
*Last Updated: 2026-02-02*
