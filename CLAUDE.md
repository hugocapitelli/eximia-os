# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Overview

**eximIA.OS** is a multi-agent AI operating system built on a meta-framework that orchestrates specialized AI agents for different business domains. The system uses a protocol-driven architecture with knowledge bases, agent definitions, and execution pipelines.

### Core Stack

| Component | Technology | Location |
|-----------|-----------|----------|
| Frontend | Next.js 16 + React 19 + TypeScript | `apps/web/` |
| Backend Runtime | Python 3.10+ | `eximia_runtime/` |
| Agent Framework | Node.js (AIOS-FullStack v4.31) | `.aios-core/` |
| Knowledge Base | ChromaDB + Redis | `eximia_runtime/memory/` |
| Database | Supabase (PostgreSQL) | Configured in `apps/web/.env` |

---

## Architecture at a Glance

### Agent Hierarchy (Registry: `agent_registry.yaml`)

**Executive Tier (Tier 3)** — 25-40h creation, 12-20 knowledge bases:
- `The_Maestro` — Supreme orchestrator & task decomposition
- `The_Veritas` — Deep research & fact verification
- `Intellex` — Intellectual production & framework creation

**Specialist Tier (Tier 2)** — 6-12h creation, 5-8 knowledge bases:
- `The_CEO` — Chief of staff & execution
- `The_CFO` — Corporate finance & valuation
- `The_CLO` — Legal compliance & risk
- `The_CMO` — Marketing & growth
- `Copy_Chief` — Elite copywriting (with sub-agents: Gary Halbert, David Ogilvy, etc.)

**Tactical Tier (Tier 1)** — 4-8h creation, 3-5 knowledge bases:
- `X_Agents` — Specialists (Prototyper, Strategist, LXD Architect)
- `Z_Squad` — Agent creation pipeline
- `El_Clonador` — Personality cloning factory

Each agent has:
- **Profile**: Personality, voice, identity in `{agent}/02_profile/`
- **Knowledge Bases**: Domain expertise in `{agent}/02_profile/knowledge_base/`
- **Prompt**: Operating instructions in `{agent}/03_prompt/prompt_operacional.md`
- **Validation**: Quality metrics in `{agent}/04_validation/`

### Directory Structure

```
eximIA.OS/
├── agent_registry.yaml          ← SOURCE OF TRUTH: All agents & capabilities
├── CLAUDE.md                    ← This file
├── The_Maestro/                 ← Supreme orchestrator
├── The_Veritas/                 ← Research engine
├── The_CEO/                     ← Executive coordination
├── The_CFO/                     ← Finance specialist
├── The_CLO/                     ← Legal specialist
├── The_CMO/                     ← Marketing specialist
├── X_Agents/                    ← Specialist agents (Prototyper, Strategist, LXD)
├── Z_Squad/                     ← Agent creation pipeline
├── El_Clonador/                 ← Personality cloning (agents + clones)
├── Clones/                      ← Validated personality clones (David Goggins, Elon Musk, etc.)
├── 00_Codex/                    ← Knowledge vault (books, research, validated data)
├── eximia_runtime/              ← Python backend runtime
│   ├── core/                    ← Runtime core (agent execution)
│   ├── memory/                  ← Vector DB + cache (ChromaDB, Redis)
│   ├── protocols/               ← Veritas First, Handoff protocols
│   ├── interfaces/              ← CLI, REST API, MCP
│   ├── agents/                  ← Agent definitions for runtime
│   └── pyproject.toml           ← Dependencies
├── .aios-core/                  ← Node.js agent framework
│   ├── cli/                     ← Command-line tools
│   ├── development/             ← Tasks, workflows, templates
│   ├── lib/                     ← Core framework libraries
│   └── package.json             ← Node dependencies
├── apps/web/                    ← Next.js frontend (Easypanel deployment)
│   ├── src/                     ← React components & pages
│   ├── public/                  ← Static assets
│   ├── Dockerfile              ← Container for production
│   └── package.json             ← Frontend dependencies
├── .eximia/                     ← Command system
│   ├── SLASH_COMMANDS.yaml      ← All available commands
│   └── SLASH_COMMANDS_GUIDE.md  ← User documentation
├── .agent/workflows/            ← Agent execution workflows
└── .aios/                       ← Project configuration (created during bootstrap)
```

---

## Development Workflow

### 1. Frontend Development (`apps/web/`)

**Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase

```bash
# Install dependencies
cd apps/web
npm install

# Run dev server
npm run dev                      # → http://localhost:3000

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

**Key Files**:
- `src/pages/` — Page routes
- `src/components/` — React components
- `next.config.ts` — Next.js configuration
- `.env.example` — Required environment variables

### 2. Backend Runtime (`eximia_runtime/`)

**Tech Stack**: Python 3.10+, FastAPI (optional), ChromaDB, Redis

```bash
# Install dependencies
cd eximia_runtime
pip install -e .

# CLI commands
eximia list                     # List all agents
eximia run veritas --query "..." # Execute agent
eximia serve                    # Start REST API (localhost:8000)
eximia benchmark cfo --scenario dcf_valuation

# Python directly
python run.py                   # Execute via Python
```

**Key Files**:
- `core/` — Runtime execution engine
- `memory/` — Vector DB integration (ChromaDB)
- `protocols/` — Agent communication protocols
- `interfaces/` — CLI, API, MCP servers
- `pyproject.toml` — Dependencies

**Environment Variables** (`.env`):
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
REDIS_URL=redis://localhost:6379
SUPABASE_URL=https://...
SUPABASE_KEY=...
```

### 3. Agent Framework (`.aios-core/`)

**Tech Stack**: Node.js, AIOS-FullStack v4.31, TypeScript

```bash
# Build framework
cd .aios-core
npm run build

# Test
npm run test                    # Run all tests
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests

# Lint & typecheck
npm run lint
npm run typecheck

# Create new agent (via CLI)
node bin/aios-core.js create-agent --name="New_Agent" --tier=2
```

**Key Directories**:
- `cli/` — Command-line interface
- `lib/` — Core framework (task runners, template engines)
- `templates/` — Agent, story, and component templates
- `development/tasks/` — Reusable task definitions
- `development/workflows/` — Multi-step workflows

---

## Routing & Agent Invocation

### Agent-First Protocol

Before responding to ANY request:

1. **Classify** the request domain (legal, finance, marketing, research, copywriting)
2. **Consult** `agent_registry.yaml` for relevant agents
3. **Route** to appropriate agent(s) based on routing rules
4. **Execute** using agent's prompt + knowledge bases
5. **Synthesize** results with proper attribution

### Priority Hierarchy (from `CLAUDE.md`)

| Priority | Domain | Agent | Trigger Keywords |
|----------|--------|-------|------------------|
| 1 (Max) | Legal | The_CLO | contrato, compliance, LGPD, risco legal |
| 2 | Finance | The_CFO | valuation, M&A, investimento, DCF |
| 3 | Copywriting | Copy_Chief | sales page, VSL, email sequence, headline |
| 4 | Marketing | The_CMO | brand, growth, GTM, campanha |
| 5 | Research | The_Veritas | pesquise, dado, estatística, recente |
| 6 | Executive | The_CEO | fallback geral |

### Veritas First Protocol

For ANY request involving:
- Current prices/rates
- Legal/regulatory status
- Statistics or market data
- Recent events (< 6 months ago)

**Action**: Flag as `[REQUIRES_VERIFICATION]` → Invoke The_Veritas → Cite sources

---

## Command System (`.eximia/` & Slash Commands)

### Slash Command Pattern

Users can invoke agents via `/command subcommand`:

```
/maestro "task description"      # Route to The Maestro
/veritas "research query"        # Route to The Veritas
/cfo "financial analysis"        # Route to The CFO
/copy vsl                        # Route to Copy Squad

/schedule next                   # Scheduler (roadmap)
/memo capture "idea"             # Memo (Zettelkasten)
/clone create --tier=2           # Clone Factory pipeline
/zsquad agent "Agent_Name"       # Z Squad agent creation
```

**Files**:
- `.eximia/SLASH_COMMANDS.yaml` — Command registry
- `.eximia/SLASH_COMMANDS_GUIDE.md` — User documentation
- `.agent/workflows/` — Execution workflows for each command

---

## Knowledge System

### Codex (Knowledge Vault)

Location: `00_Codex/`

- Books and validated research
- Transcribed interviews and videos
- Framework indexes and compilations
- Access pattern: `[CODEX_SEARCH: <query>]`

### Agent Knowledge Bases

Each agent has dedicated knowledge bases in:
```
{agent}/02_profile/knowledge_base/
├── KB_01_Domain_Expertise.md
├── KB_02_Frameworks.md
├── ...
└── KB_N_Specialization.md
```

Load relevant KBs before responding. Cross-reference with Codex for validation.

---

## Clone Factory Pipeline (`El_Clonador/` → `Clones/`)

### Three-Stage Process

1. **El_Clonador** — Source extraction & personality analysis
2. **Clone Central** — DNA mental model & prompt engineering
3. **Clones/** — Validated & production-ready personality clones

### Validated Clones Available

- `Clones/david_goggins/` — Motivational/discipline expert
- `Clones/elon_musk/` — Visionary/technical founder
- Custom clones can be created via `/clone` command

Each clone has:
```
{clone}/
├── 1_raw_data/           # Source materials (videos, interviews, etc.)
├── 2_structured_data/    # Cognitive profiles (Jungian, psychometric, etc.)
├── 3_clone_output/       # Final system prompt + KBs
└── CLONE_PROFILE.md      # Reference card
```

---

## DevOps & Deployment

### Git Workflow

The `@devops` agent (Gage) handles all remote operations:

```bash
# Quality gate before push
*pre-push                  # Run lint, tests, typecheck, CodeRabbit

# Push to remote
*push                      # Execute git push (after gates pass)

# PR creation
*create-pr                 # Create pull request from current branch

# Versioning
*version-check             # Analyze changes for semantic version bump
*release                   # Create tagged release with changelog
```

**Pre-Push Quality Gates**:
- ✅ No uncommitted changes
- ✅ No merge conflicts
- ✅ `npm run lint` (if present)
- ✅ `npm test` (if present)
- ✅ `npm run typecheck` (if present)
- ✅ `npm run build` (if present)
- ✅ CodeRabbit code review (automated, HIGH/CRITICAL blocks push)
- ✅ No exposed secrets

### Deployment Targets

**Frontend** (`apps/web/`):
- Deployed via Easypanel
- Docker image: `Dockerfile` in `apps/web/`
- Environment: `.env` (Supabase credentials)

**Backend** (`eximia_runtime/`):
- REST API: `eximia serve` (localhost:8000)
- Can be containerized or run as service

### Environment Configuration

```bash
# Root .env template
.env.example              # Copy to .env and fill in credentials

# Frontend
apps/web/.env.example    # Supabase + Next.js vars

# Backend
eximia_runtime/.env      # API keys + Redis + Supabase
```

---

## Testing & Validation

### Framework Tests (`.aios-core/`)

```bash
cd .aios-core
npm run test:unit          # Jest unit tests
npm run test:integration   # Integration tests
```

### Agent Validation

Each agent in registry has validation metrics:
- Last score
- Last validated date
- Performance benchmarks (in `{agent}/04_validation/`)

### Testing Stories (AIOS Pattern)

Development follows story-driven workflow:
```
docs/stories/{story_id}.md    # User story with acceptance criteria
```

Mark progress via checkboxes as tasks complete.

---

## Common Development Tasks

### Add a New Agent

```bash
# Use AIOS framework
node .aios-core/bin/aios-core.js create-agent \
  --name="New_Agent" \
  --tier=2 \
  --domain="Your Domain"

# Then populate:
# - 02_profile/ (biography, voice, KBs)
# - 03_prompt/prompt_operacional.md (system prompt)
# - 04_validation/ (test cases, benchmarks)

# Register in agent_registry.yaml
```

### Create a New Clone

```bash
# Via CLI
/clone create --name="Clone_Name" --source_type="video"

# Then run El_Clonador pipeline:
# 1. Raw data collection (YouTube, interviews, etc.)
# 2. Cognitive analysis (Jungian, psychometric, etc.)
# 3. Prompt engineering + KB creation
```

### Modify Frontend

```bash
cd apps/web

# Add component
touch src/components/NewComponent.tsx

# Add page
touch src/pages/new-page.tsx

# Run locally
npm run dev

# Test
npm test (if configured)
```

### Run Agent Programmatically

```bash
# Via CLI
eximia run veritas --query "Your research question"

# Via Python
from eximia_runtime.core import AgentExecutor
executor = AgentExecutor("veritas")
result = executor.execute({"query": "..."})
```

---

## Critical Files & Concepts

### Configuration

| File | Purpose |
|------|---------|
| `agent_registry.yaml` | Central registry of all agents, their tiers, paths, KBs |
| `.aios/config.yaml` | Project configuration (bootstrap status, workflow, settings) |
| `.env` | Environment variables (API keys, database credentials) |
| `CLAUDE.md` | This file — Claude Code instructions |

### Protocols

| Protocol | Location | Use Case |
|----------|----------|----------|
| Veritas First | `The_Veritas/02_profile/KB_01_metodologia_pesquisa.md` | Fact verification before claims |
| Handoff | `Z_Squad/shared_protocols/handoff_protocol.md` | Agent-to-agent task transfer |
| Anti-Hallucination | `Z_Squad/shared_protocols/anti_hallucination.md` | Prevent false information |
| Meta-Reasoning | `Z_Squad/shared_protocols/meta_reasoning_process.md` | Self-reflection & improvement |

### Key Directories

| Directory | Owner | Purpose |
|-----------|-------|---------|
| `00_Codex/` | N/A | Knowledge vault (books, research, transcripts) |
| `.aios-core/` | Framework | Node.js agent framework & CLI |
| `eximia_runtime/` | Backend | Python runtime for agent execution |
| `apps/web/` | Frontend | Next.js application |
| `El_Clonador/` | Factory | Personality cloning pipeline |
| `Clones/` | Production | Validated personality clones |
| `.aios/` | Project | Configuration & reports (created at bootstrap) |

---

## Important Notes

### Cascade Effect of Agent Updates

When modifying an agent (especially Tier 3):
1. Update agent definition in `agent_registry.yaml`
2. Update agent's prompt in `{agent}/03_prompt/prompt_operacional.md`
3. Update relevant knowledge bases in `{agent}/02_profile/knowledge_base/`
4. Run validation in `{agent}/04_validation/`
5. Commit and push via `@devops`

### Security & Secrets

- **NEVER** commit API keys, tokens, or credentials to git
- Use `.env` files (gitignored by default)
- Use `.env.example` as template with placeholder values
- If a secret is accidentally committed, notify immediately — GitHub has push protection enabled

### Large Files

- Media files (audio, video) are gitignored (`*.mp3`, `*.mp4`, etc.)
- Use external storage or cloud for large assets
- Keep repository <100MB for optimal performance

### Performance

- Vector DB (ChromaDB) runs locally in `eximia_runtime/memory/`
- Redis cache at `redis://localhost:6379` (optional, can disable)
- Frontend builds with Next.js — check build size if adding large deps

---

## Getting Help

1. **Framework questions**: Check `.aios-core/README.md` and `package.json` scripts
2. **Agent questions**: Consult `agent_registry.yaml` and specific agent's README
3. **Backend questions**: See `eximia_runtime/README.md` and `COMMANDS.md`
4. **Frontend questions**: See `apps/web/README.md` and Next.js docs
5. **Agent creation**: See `Z_Squad/README.md` for guidelines
6. **Clone creation**: See `El_Clonador/PIPELINE_GUIDE.md`

---

**Last Updated**: 2026-01-26
**Version**: 2.0.0
**Maintained By**: Claude Code Integration
