---
description: Executar pipeline completo (Z Squad ou Clone Factory) automaticamente
---

## WORKFLOW: Auto-Execute Pipeline

**Command:** `/schedule auto-execute <item_id> [--overnight=true]`
**Agent:** The Scheduler v1.1+
**New in:** v1.1.0

---

## EXECUTION PROTOCOL

### 1. **Parse Command**

```markdown
Input: /schedule auto-execute jacob_petry --overnight=true

Parse:
  - item_id: jacob_petry
  - overnight: true (optional, default: false)
```

---

### 2. **Validate Item**

```markdown
1. Load BACKLOG.yaml
2. Check item exists:
   - Search in agents_backlog
   - Search in clones_backlog
3. Validate status:
   - status == "planned" ✅
   - blocked == false ✅
4. If invalid:
   - Return error message
   - Suggest /schedule list
```

---

### 3. **Identify Pipeline Type**

```markdown
IF item in agents_backlog:
  pipeline = "Z_Squad"
  phases = [Z1_Architect, Z2_Profiler, Z3_Engineer, Z4_Auditor]

IF item in clones_backlog:
  pipeline = "Clone_Factory"
  phases = [C1_Hunter, C2_Extractor, C3_Creator, C4_Auditor]
```

---

### 4. **Request User Approval**

```markdown
Present summary:

🚀 AUTO-EXECUTE: [Item Name]

**Type:** [Agent/Clone]
**Pipeline:** [Z Squad / Clone Factory]
**Phases:** [Number] phases
**Estimated time:** [Hours]h
**Mode:** [Standard / Overnight]

**Pipeline steps:**
  1. Phase 1: [Name] - [Description]
  2. Phase 2: [Name] - [Description]
  ...

**Outputs will be saved to:**
  - [Output directory path]
  - Progress log: auto_builds/[item_id]/progress.log
  - Checkpoints: auto_builds/[item_id]/checkpoints/

**Approve auto-execute?**
[Yes] [No] [Preview Phase 1 only]
```

---

### 5. **Execute Pipeline**

#### Create Auto-Build Directory

```bash
mkdir -p X_Agents/The_Scheduler/auto_builds/[item_id]/checkpoints
touch X_Agents/The_Scheduler/auto_builds/[item_id]/progress.log
```

#### Initialize Progress Log

```markdown
=== AUTO-EXECUTE LOG ===
Item: [item_id]
Type: [agent/clone]
Pipeline: [Z_Squad/Clone_Factory]
Mode: [standard/overnight]
Started: [timestamp]

---
```

---

### 6. **Execute Each Phase Sequentially**

#### For Clone Factory Pipeline

**PHASE 1: C1_Hunter (Research)**

```markdown
1. Load prompt:
   El_Clonador/C1_Hunter/agente_core.md

2. Prepare context:
   {
     "name": "[person_name]",
     "domain": "[domain]",
     "priority": "[priority]",
     "sources_available": [true/false]
   }

3. Execute C1_Hunter with context

4. C1_Hunter will:
   - Research available sources
   - Create SOURCES_LIVE.md
   - Collect raw data
   - Output to: Clones/[person_name]/1_raw_data/

5. Save checkpoint:
   auto_builds/[item_id]/checkpoints/phase1_c1_hunter.json

6. Update BACKLOG.yaml:
   status: "planned" → "research"

7. Log to progress.log:
   [timestamp] ✅ Phase 1 (C1_Hunter) completed
```

**PHASE 2: C2_Extractor (Analysis)**

```markdown
1. Load prompt:
   El_Clonador/C2_Extractor/agente_core.md

2. Prepare context:
   {
     "raw_data_path": "Clones/[person_name]/1_raw_data/",
     "sources": [from C1]
   }

3. Execute C2_Extractor

4. C2_Extractor will:
   - Run sub-agents (C2A, C2B, C2C, C2D)
   - Extract cognitive patterns
   - Create structured data
   - Output to: Clones/[person_name]/2_structured_data/

5. Save checkpoint: phase2_c2_extractor.json

6. Update BACKLOG.yaml:
   status: "research" → "extraction"

7. Log progress
```

**PHASE 3: C3_Creator (Build)**

```markdown
1. Load prompt:
   El_Clonador/C3_Creator/agente_core.md

2. Execute C3_Creator

3. C3_Creator will:
   - Create 9 Knowledge Bases
   - Generate system prompt
   - Build voice profile
   - Output to: Clones/[person_name]/3_clone_output/

4. Save checkpoint: phase3_c3_creator.json

5. Update BACKLOG.yaml:
   status: "extraction" → "creation"

6. Log progress
```

**PHASE 4: C4_Auditor (Validation)**

```markdown
1. Load prompt:
   El_Clonador/C4_Auditor/agente_core.md

2. Execute C4_Auditor

3. C4_Auditor will:
   - Run Turing tests
   - Validate consistency
   - Generate VALIDATION_REPORT.md
   - Calculate Turing score

4. Save checkpoint: phase4_c4_auditor.json

5. Update BACKLOG.yaml:
   status: "creation" → "validation"

6. Log progress
```

---

#### For Z Squad Pipeline

**PHASE 1: Z1_Architect**

```markdown
1. Load: Z_Squad/Z1_Architect/agente_core.md
2. Context: {name, tier, domain, competencies, dependencies}
3. Output: Z_Squad/outputs/[agent_name]/01_spec/
4. Update status: "planned" → "in_progress"
```

**PHASE 2: Z2_Profiler**

```markdown
1. Load: Z_Squad/Z2_Profiler/agente_core.md
2. Input: 01_spec/ from Z1
3. Output: 02_profile/ (DNA + KBs)
```

**PHASE 3: Z3_Engineer**

```markdown
1. Load: Z_Squad/Z3_Engineer/agente_core.md
2. Input: 02_profile/ from Z2
3. Output: 03_prompt/
```

**PHASE 4: Z4_Auditor**

```markdown
1. Load: Z_Squad/Z4_Auditor/agente_core.md
2. Input: All previous outputs
3. Output: 04_validation/
4. Update status: "in_progress" → "validated"
```

---

### 7. **Checkpoint Format**

Each phase saves a checkpoint:

```json
{
  "item_id": "jacob_petry",
  "item_type": "clone",
  "pipeline": "Clone_Factory",
  "phase": "C2_Extractor",
  "phase_number": 2,
  "status": "completed",
  "started_at": "2026-01-24T22:00:00Z",
  "completed_at": "2026-01-24T23:45:00Z",
  "duration_minutes": 105,
  "outputs": [
    "Clones/jacob_petry/2_structured_data/cognitive_profile/C2A_junguian_analysis.md",
    "Clones/jacob_petry/2_structured_data/cognitive_profile/C2B_psychometric_analysis.md"
  ],
  "next_phase": "C3_Creator",
  "errors": []
}
```

---

### 8. **Overnight Mode Specifics**

```markdown
If --overnight=true:
  1. Do NOT pause between phases
  2. Log every action to progress.log
  3. Save checkpoints every 30min (in addition to phase checkpoints)
  4. If error occurs:
     - Save emergency checkpoint
     - Pause execution
     - Log error
     - Wait for user intervention

  5. Run phases continuously:
     Phase1 → Phase2 → Phase3 → Phase4 → Complete
     (no user approval between phases)
```

---

### 9. **Completion Summary**

When all phases complete:

```markdown
✅ AUTO-EXECUTE COMPLETE: [Item Name]

📊 **Summary:**
  - Total time: [X]h [Y]min
  - Phases completed: [N]/[N]
  - Final status: [validation/validated]

📁 **Outputs:**
  [For Clone]
  - 1_raw_data: [N] sources, [X]k tokens
  - 2_structured_data: Cognitive profile complete
  - 3_clone_output: [N] KBs, system prompt ready
  - VALIDATION_REPORT.md (Turing Score: [X.X]/10)

  [For Agent]
  - 01_spec: Technical specification
  - 02_profile: DNA Mental + [N] KBs
  - 03_prompt: Operational prompt
  - 04_validation: Validation report (Score: [X.X]/10)

📂 **Location:**
  - Main: [Clones/|Z_Squad/outputs/][item_name]/
  - Logs: auto_builds/[item_id]/progress.log
  - Checkpoints: auto_builds/[item_id]/checkpoints/

⚠️ **Requires final approval before production**

**Actions:**
[1] Review and approve → production
[2] Request modifications
[3] Archive (not approved)
```

---

### 10. **Final Approval**

```markdown
User selects [1] Review and approve:

1. Update BACKLOG.yaml:
   status: "validation"/"validated" → "production"

2. If Clone:
   - Suggest adding to Clones catalog
   - Update agent_registry.yaml (clones section)

3. If Agent:
   - Suggest adding to agent_registry.yaml
   - Provide registry entry template

4. Mark as completed:
   Move from backlog to completed archive
```

---

### 11. **Error Handling**

```markdown
If any phase fails:

1. Save emergency checkpoint:
   auto_builds/[item_id]/checkpoints/emergency_phase[N].json

2. Log error to progress.log:
   [timestamp] ❌ Phase [N] ([Name]) FAILED
   Error: [error message]
   Stack: [if available]

3. Pause execution

4. Notify user:
   ⚠️ AUTO-EXECUTE FAILED

   Phase: [N] - [Name]
   Error: [message]

   Checkpoint saved to: auto_builds/[item_id]/checkpoints/

   **Options:**
   [1] Retry phase [N]
   [2] Skip phase [N] and continue (risky)
   [3] Abort auto-execute
   [4] Debug manually

5. Await user decision
```

---

### 12. **Resume from Checkpoint**

```markdown
If auto-execute was interrupted, can resume:

Command: /schedule auto-execute jacob_petry --resume

1. Load latest checkpoint
2. Identify last completed phase
3. Resume from next phase
4. Continue pipeline
```

---

## EXAMPLE EXECUTION LOG

```
=== AUTO-EXECUTE LOG ===
Item: jacob_petry
Type: clone
Pipeline: Clone_Factory
Mode: overnight
Started: 2026-01-24T22:00:00Z

---

[22:00:15] 🚀 Starting auto-execute for jacob_petry
[22:00:16] ✅ Validations passed
[22:00:17] 📋 Pipeline: Clone_Factory (4 phases)
[22:00:18] 👤 User approved execution

[22:00:20] ⏳ Phase 1/4: C1_Hunter (Research)
[22:00:21] 📂 Created: Clones/jacob_petry/1_raw_data/
[22:15:43] 📥 Collected 12 sources (YouTube, books, articles)
[23:30:12] ✅ Phase 1 completed (1h 30min)
[23:30:13] 💾 Checkpoint saved: phase1_c1_hunter.json
[23:30:14] 🔄 Status updated: planned → research

[23:30:15] ⏳ Phase 2/4: C2_Extractor (Analysis)
[23:30:16] 🧠 Running cognitive analysis...
[00:15:22] ✅ C2A_Junguian: Complete
[00:45:10] ✅ C2B_Psychometric: Complete
[01:20:05] ✅ C2C_Heuristic: Complete
[01:50:33] ✅ C2D_Biographic: Complete
[01:50:34] ✅ Phase 2 completed (2h 20min)
[01:50:35] 💾 Checkpoint saved: phase2_c2_extractor.json
[01:50:36] 🔄 Status updated: research → extraction

[01:50:37] ⏳ Phase 3/4: C3_Creator (Build)
[01:50:38] 📝 Creating Knowledge Bases...
[03:45:12] ✅ 9 KBs created
[04:10:05] ✅ System prompt generated
[04:25:18] ✅ Voice profile complete
[04:25:19] ✅ Phase 3 completed (2h 35min)
[04:25:20] 💾 Checkpoint saved: phase3_c3_creator.json
[04:25:21] 🔄 Status updated: extraction → creation

[04:25:22] ⏳ Phase 4/4: C4_Auditor (Validation)
[04:25:23] 🔍 Running Turing tests...
[05:10:45] ✅ Turing Score: 9.2/10
[05:15:30] ✅ Validation report generated
[05:15:31] ✅ Phase 4 completed (50min)
[05:15:32] 💾 Checkpoint saved: phase4_c4_auditor.json
[05:15:33] 🔄 Status updated: creation → validation

[05:15:34] 🎉 AUTO-EXECUTE COMPLETE
[05:15:35] ⏱️ Total time: 7h 15min
[05:15:36] 📊 All 4 phases completed successfully
[05:15:37] 📁 Output: Clones/jacob_petry/
[05:15:38] ⚠️ Awaiting final user approval

---
END OF LOG
```

---

## FILES & PATHS

**Auto-build directory:**
```
X_Agents/The_Scheduler/auto_builds/[item_id]/
├── progress.log                    # Execution log
├── checkpoints/
│   ├── phase1_[name].json
│   ├── phase2_[name].json
│   ├── phase3_[name].json
│   └── phase4_[name].json
└── final_summary.md                # Completion report
```

**Output directories:**

For Clones:
```
Clones/[person_name]/
├── 1_raw_data/
├── 2_structured_data/
├── 3_clone_output/
└── VALIDATION_REPORT.md
```

For Agents:
```
Z_Squad/outputs/[agent_name]/
├── 01_spec/
├── 02_profile/
├── 03_prompt/
└── 04_validation/
```

---

**Created:** 2026-01-24
**Version:** 1.1.0
**Workflow Type:** Automated Pipeline Execution
