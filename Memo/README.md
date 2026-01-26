# Memo - Smart Idea Bank

## Overview
**Memo** is your intelligent idea bank that transforms raw thoughts into an organized knowledge network.

## Quick Start

### Add a new idea
```bash
/memo "Agents need persistent memory beyond context windows"
```

### Recall similar ideas
```bash
/memo recall "memory strategies"
```

### Form clusters
```bash
/memo cluster
```

### Generate insights
```bash
/memo insights
```

### Visualize network
```bash
/memo graph
```

## How It Works

### Dual Storage
Ideas are saved in TWO places:
1. **Database:** `eximia_data.db` (fast search, metadata)
2. **Files:** `eximia_data/ideas/*.md` (backup, portability)

### Intelligence Layer
Memo automatically:
- Uses semantic search to find connections
- Detects clusters via graph algorithms
- Generates insights by synthesizing clusters
- **Always requests approval before saving**

## All Commands
See [COMMANDS.md](./COMMANDS.md) for complete reference.

## Architecture
```
Memo/
├── 01_architecture/
│   └── agent_spec.md
├── 02_profile/
│   └── knowledge_base/
│       ├── KB_01_Zettelkasten_Method.md
│       ├── KB_02_Graph_Theory.md
│       └── KB_03_Codex_Integration.md
├── 03_prompt/
│   └── prompt_operacional.md
└── COMMANDS.md  ← Full command reference
```

## Key Features
- ✅ Approval-based workflow (no auto-saves)
- ✅ Semantic similarity detection (cosine > 0.7)
- ✅ Graph metrics (degree, betweenness, clustering)
- ✅ Conflict detection (contradicting ideas flagged)
- ✅ Visual graph generation (Mermaid diagrams)

## Integration
Uses `eximia_runtime.utils.codex_integration` for:
- `save_to_codex()` - Persist ideas
- `semantic_search()` - Find similar content
- `update_connections()` - Manage graph edges

## Production Status

✅ **Production Ready** - Fully validated Tier 2 operational agent  
📅 **Last Validated:** 2026-01-18  
🎯 **Tier:** 2 (Executive)  
📊 **Version:** 2.0.0  
💾 **Storage:** Dual (Database + Files)

## Created By

Direct Implementation | exímIA.AI © 2026


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
