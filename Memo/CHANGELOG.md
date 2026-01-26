# Changelog - Memo

## [2.1.0] - 2026-01-19
### Changed
- **Production Deployment:**
    - Migrated from `Z_Squad/outputs/Memo` to root directory
    - Added `meta/registry.yaml` for automatic discovery by eximia_runtime
    - Registered in `eximia_runtime/core/config.py` agents directory list
    - Status: Fully production-deployed alongside core agents (The_CEO, The_Planner, etc.)
- **Deployment Method:** Direct implementation (Antigravity-assisted)

## [2.0.0] - 2026-01-18
### Changed
- **Production Level Release:**
    - Rebranded from "Zettelkasten Librarian" to "Memo" for better accessibility
    - Updated all command references from `/zettel` to `/memo` throughout documentation
    - Confirmed integration with Codex system for dual storage (database + files)
    - Verified semantic search capabilities using embeddings
- **Status:** Promoted to production-level agent (Tier 2)

## [1.0.0] - 2026-01-14
### Added
- **Core Features:**
    - Atomic idea capture with approval workflow
    - Semantic connection detection (threshold: 0.7 cosine similarity)
    - Cluster formation from related ideas
    - Insight generation from clusters
    - Knowledge graph visualization with Mermaid diagrams
    - Conflict detection for contradicting ideas
- **Commands:**
    - `/memo "text"` - Add new atomic idea
    - `/memo recall [query]` - Search existing ideas semantically
    - `/memo list [page]` - Browse all ideas with pagination
    - `/memo cluster` - Group related ideas
    - `/memo insights` - Generate meta-insights
    - `/memo graph` - Analyze and visualize knowledge network
- **Integration:**
    - Dual storage: SQLite database (`eximia_data.db`) + markdown files (`04_IDEAS/`)
    - Codex integration via `codex_integration.py`
    - Semantic search using vector embeddings
- **Documentation:**
    - Complete command reference (COMMANDS.md)
    - Operational prompt with detailed workflows
    - Knowledge bases covering Zettelkasten Method, Graph Theory, and Codex Integration

---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
