---
title: "Changelog — The Scheduler"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "document"
status: "production"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "changelog"
  - "changelog — the scheduler"
  - "[1.2.0] - 2026-01-25"
  - "added"
  - "changed"
  - "documentation"
  - "[1.1.0] - 2026-01-24"
  - "[1.0.0] - 2026-01-24"
  - "validated"
  - "[planned for 1.1.0]"
tags:
  - "galaxy-specialist"
  - "document"
---

# Changelog — The Scheduler

All notable changes to The Scheduler will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-01-25

### Added
- **`/schedule auto-execute-batch` command** — Execute multiple clones/agents sequentially
  - Two modes: `--top=N` (by RICE score) or `--items=id1,id2,id3` (explicit list)
  - User-initiated queue management (NEVER automatic)
  - Sequential execution with checkpoints between items
  - Batch progress tracking and logging
  - Resume capability for interrupted batches

- **Queue Management System**
  - `queue.yaml` — Queue definition and real-time progress
  - `batch_progress.log` — Complete execution log
  - Item-level checkpoints (after each item completes)
  - Emergency checkpoints on failures
  - Batch summary report on completion

- **Batch Workspace Structure**
  - `auto_builds/batch_[timestamp]/` — Batch-specific directory
  - `queue.yaml` — Queue state and progress
  - `batch_progress.log` — Detailed execution log
  - `checkpoints/` — Per-item checkpoints
  - `final_summary.md` — Human-readable completion report

- **Enhanced User Control**
  - Queue preview before execution
  - Explicit approval required to start batch
  - Options to modify queue before execution
  - Progress visible during execution
  - Pause/resume capability
  - Per-item approval still required for production

- **Error Recovery**
  - Batch pause on item failure
  - Options: Retry from failed phase, Skip item, or Abort batch
  - Progress preserved across interruptions
  - Resume from last checkpoint with `--resume=batch_id`

- **Batch Execution Flow**
  - Item 1: C1→C2→C3→C4 → Checkpoint → Item 2: C1→C2→C3→C4 → Checkpoint → ...
  - Real-time BACKLOG.yaml updates
  - Status tracking for each item in queue
  - Duration and score tracking per item
  - Estimated vs. actual time comparison

### Changed
- Version bumped to 1.2.0
- Spec técnico updated with batch execution competency
- Prompt operacional expanded with Protocolo 6 (Batch Auto-Execute)
- README updated with batch execution examples
- Token budget increased to 8000 tokens (from 6000)

### Documentation
- New workflow file: `.agent/workflows/schedule_auto_execute_batch.md`
- Detailed batch execution protocol
- Queue YAML schema specification
- Resume workflow documentation
- Error handling procedures for batch mode

---

## [1.1.0] - 2026-01-24

### Added
- **`/schedule auto-execute` command** — Automatically execute complete pipeline (Z Squad or Clone Factory)
  - Execute all 4 phases sequentially without manual intervention
  - Support for both agents (Z Squad) and clones (Clone Factory)
  - Automatic checkpoint system for each phase
  - Progress logging to `auto_builds/[item_id]/progress.log`
  - Error handling with retry/skip/abort options

- **Overnight Mode (`--overnight=true`)**
  - Continuous execution without pauses between phases
  - Enhanced checkpoint system (every 30min + per phase)
  - Detailed progress logging
  - User wakes up with completed item ready for approval
  - Emergency checkpoints on errors

- **Auto-Build Directory Structure**
  - `auto_builds/[item_id]/progress.log` — Execution log
  - `auto_builds/[item_id]/checkpoints/` — Phase checkpoints
  - `auto_builds/[item_id]/final_summary.md` — Completion report

- **Pipeline Integration**
  - Clone Factory: C1_Hunter → C2_Extractor → C3_Creator → C4_Auditor
  - Z Squad: Z1_Architect → Z2_Profiler → Z3_Engineer → Z4_Auditor
  - Automatic status updates in BACKLOG.yaml after each phase
  - Handoff context between phases

- **Checkpoint System**
  - JSON checkpoint files per phase
  - Resume capability from last checkpoint
  - Emergency checkpoints on failures
  - Includes: timestamp, duration, outputs, errors

- **Enhanced User Approval Flow**
  - Detailed pre-execution summary
  - Option to preview first phase only
  - Post-completion review and approval gate
  - Request modifications or archive

### Changed
- Version bumped to 1.1.0
- Spec técnico updated with auto-execute competency
- Prompt operacional expanded with Protocolo 5 (Auto-Execute)
- README and workflow files updated

### Documentation
- New workflow file: `.agent/workflows/schedule_auto_execute.md`
- Detailed execution log example
- Checkpoint format specification
- Error handling procedures

---

## [1.0.0] - 2026-01-24

### Added
- **RICE Prioritization Framework**
  - Full implementation of Reach × Impact × Confidence / Effort
  - KB_01_RICE_Prioritization.md with examples from eximIA.OS
  - Automatic RICE calculation for all backlog items

- **Backlog Management**
  - `/schedule agent` command to add agents
  - `/schedule clone` command to add clones
  - `/schedule list` command to view backlog
  - BACKLOG.yaml as primary storage

- **Dependency Tracking**
  - Hard dependencies (blocking)
  - Soft dependencies (enhancement)
  - Automatic blocking when dependencies not in production
  - KB_03_Dependency_Management.md with patterns

- **Agent Tier System**
  - Tier 1 (Tactical): 4-8h effort
  - Tier 2 (Executive): 6-12h effort
  - Tier 3 (Expert): 25-40h effort
  - Clones: 25-40h effort
  - KB_02_Agent_Tiers.md with historical data

- **Smart Recommendations**
  - `/schedule next` command
  - Filters blocked items
  - Returns highest RICE buildable item
  - Detailed rationale for recommendation

- **Integration Points**
  - Z Squad Pipeline integration (auto-create spec)
  - Clone Factory integration (auto-create research template)
  - Agent Registry sync (on status→production)

- **Status Workflow**
  - Agents: planned → in_progress → validated → production
  - Clones: planned → research → extraction → creation → validation → production
  - `/schedule update` command for status changes

- **Commands**
  - `/schedule agent` - Add agent to backlog
  - `/schedule clone` - Add clone to backlog
  - `/schedule list` - List backlog items
  - `/schedule prioritize` - Calculate RICE scores
  - `/schedule next` - Get next recommendation
  - `/schedule update` - Update item status
  - `/schedule roadmap` - View roadmap (planned)

- **Documentation**
  - spec_tecnica.json (technical specification)
  - dna_mental.md (agent DNA)
  - prompt_operacional.md (operational prompt)
  - validation_report.md (9.65/10 score)
  - README.md (user guide)
  - 3 Knowledge Bases (RICE, Tiers, Dependencies)

- **Guardrails**
  - User approval required before saving to backlog
  - Validation of required fields (name, domain, tier)
  - Duplicate detection alert
  - Dependency blocking enforcement

### Validated
- ✅ Spec completeness: 10/10
- ✅ Knowledge bases: 10/10
- ✅ Prompt engineering: 9.5/10
- ✅ Integration points: 9/10
- ✅ Overall score: 9.65/10
- ✅ **Status: PRODUCTION READY**

---

## [Planned for 1.1.0]

### To Add
- [ ] Tie-breaker logic for equal RICE scores
- [ ] Automated duplicate detection (fuzzy name matching)
- [ ] Codex DB sync (optional backup to vault.db)
- [ ] Enhanced roadmap visualization (timeline view)
- [ ] Export backlog to Markdown/CSV

### To Improve
- [ ] More edge case handling in prompt
- [ ] Better circular dependency detection
- [ ] Historical tracking (estimate vs. actual effort)

---

## [Planned for 1.2.0]

### To Add
- [ ] Auto-learning effort estimates (based on history)
- [ ] Slack/Discord notifications for status changes
- [ ] Bulk operations (add multiple agents at once)
- [ ] Templates for common agent patterns
- [ ] Analytics dashboard (backlog health metrics)

---

## [Future Considerations]

### Ideas Under Consideration
- Integration with external project management tools (Jira, Linear)
- AI-powered dependency suggestion (ML-based)
- Auto-generation of Z Squad specs from backlog items
- Gamification (points for completing backlog items)
- Multi-user collaboration (shared backlog)

---

**Maintainer:** eximIA.OS Core Team
**Created:** 2026-01-24
**Last Updated:** 2026-01-25

#galaxy-specialist