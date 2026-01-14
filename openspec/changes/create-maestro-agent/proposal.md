# Change: Create Maestro Agent (Supreme Orchestrator)

## Why
The ExímIA.AI ecosystem contains multiple specialized AI agents (The_CLO, The_CFO, The_Veritas, etc.), but users currently must manually coordinate them. This fragmentation creates cognitive load and inconsistent outputs. The Maestro agent solves this by acting as the **Central Brain**—a single entry point that decomposes complex requests, enforces the "Veritas First" protocol, and synthesizes unified responses.

## What Changes

### New Agent: `The_Maestro`
- **Role**: Supreme Orchestrator, equivalent to a COO + Senior TPM + Solutions Architect
- **Core Protocol**: "Veritas First" – Always consult research before rendering opinions or advice
- **Capabilities**:
  - Task decomposition (Chain of Thought)
  - Dynamic routing to specialist agents (Justitia, Fiscus, Technicus, Mercator)
  - Conflict resolution between sub-agents
  - Information synthesis into executive-level responses
  - Context memory across multi-turn conversations

### New Capabilities
1. **maestro-orchestration**: Core routing, decomposition, and synthesis logic
2. **veritas-integration**: Hard-coded "research first" protocol enforcement

### Development Phases (Tier 3 - Expert)
| Phase | Deliverables | Effort |
|-------|--------------|--------|
| **01_spec** | `spec_tecnica_maestro.json`, `META_ANALYSIS.md`, handoff | ~8h |
| **02_profile** | `dna_mental.md`, `FRAMEWORK_INDEX.md` (51+), `VOICE_PROFILES.md`, `BIBLIOGRAPHY.md` (30+), 20 KBs | ~20h |
| **03_prompt** | `prompt_operacional.md` (15-25k tokens), schemas (input, routing) | ~12h |
| **04_validation** | 15 validation cases, comparative analysis, handover doc | ~10h |

## Impact

### Affected Specs
- `maestro-orchestration` (NEW)
- `veritas-integration` (NEW)

### Affected Code
- `Agents/The_Maestro/` directory (NEW)
- Integration with existing agents (`The_Veritas`, `The_CLO`, `The_CFO`, etc.)

### **CRITICAL** Architectural Decisions
- **Veritas First Protocol**: The Maestro SHALL NOT respond to factual queries without first consulting The_Veritas
- **No Direct Execution**: The Maestro delegates specialized work (coding, legal, finance) to sub-agents
- **Circuit Breakers**: Max 10 hops, 80% token limit, KB_01 ethics enforcement

### Dependencies
- Requires `The_Veritas` agent to be operational
- Requires `KB_03_Agent_Roster` with complete registry of all agents and clones
