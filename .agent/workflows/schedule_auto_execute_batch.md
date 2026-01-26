---
description: Executar múltiplos pipelines sequencialmente (user-initiated batch queue)
---

## WORKFLOW: Batch Auto-Execute Pipeline

**Command:** `/schedule auto-execute-batch --top=N [--overnight=true]` OR `--items=id1,id2,id3`
**Agent:** The Scheduler v1.2+
**New in:** v1.2.0

---

## KEY PRINCIPLE

🔑 **Batch execution is ALWAYS user-initiated, NEVER automatic**

- User builds the queue (selects items)
- User reviews the queue
- User explicitly approves execution
- System executes only when user gives command

**This is NOT autopilot** - it's a tool the user controls.

---

## EXECUTION PROTOCOL

### 1. **Parse Command**

```markdown
Input: /schedule auto-execute-batch --top=3 --overnight=true

Parse:
  - mode: "top_n" (or "explicit_list")
  - count: 3 (if top_n)
  - items: null (if top_n) or [id1, id2, id3] (if explicit_list)
  - overnight: true
```

**Two modes:**

**Mode A: Top N by RICE**
```bash
/schedule auto-execute-batch --top=3 --overnight=true
→ Selects top 3 items by RICE score
```

**Mode B: Explicit List**
```bash
/schedule auto-execute-batch --items=peter_thiel,steve_jobs,jacob_petry --overnight=true
→ Uses specified items in that order
```

---

### 2. **Select Items for Queue**

#### Mode A: Top N by RICE

```markdown
1. Load BACKLOG.yaml
2. Filter items:
   - status == "planned" ✅
   - blocked == false ✅
   - rice_score != null ✅
3. Sort by RICE score (descending)
4. Take top N items
5. If fewer than N available:
   - Show warning
   - Use all available items
```

#### Mode B: Explicit List

```markdown
1. Parse comma-separated IDs
2. For each ID:
   - Validate exists in BACKLOG.yaml
   - Validate status == "planned"
   - Validate blocked == false
3. If any validation fails:
   - Show error
   - List which IDs are invalid
   - STOP (don't proceed)
4. Use items in order specified by user
```

---

### 3. **Build Queue Preview**

Show user what will be executed:

```markdown
🚀 BATCH AUTO-EXECUTE QUEUE

Mode: [Top 3 by RICE | User-specified list]
Overnight: [Yes | No]
Execution: Sequential (one at a time)

Queue (3 items):

┌────┬───────────────────┬─────────┬──────┬──────────┬────────────┐
│ #  │ Name              │ Type    │ RICE │ Effort   │ Est. Time  │
├────┼───────────────────┼─────────┼──────┼──────────┼────────────┤
│ 1  │ Peter Thiel       │ Clone   │ 8.5  │ 30h      │ ~7h        │
│ 2  │ Steve Jobs        │ Clone   │ 8.2  │ 30h      │ ~7h        │
│ 3  │ Jacob Petry       │ Clone   │ 7.8  │ 30h      │ ~7h        │
└────┴───────────────────┴─────────┴──────┴──────────┴────────────┘

📊 Total Estimates:
  - Items: 3 clones
  - Combined effort: 90h (real-world)
  - Estimated execution time: ~21h (overnight compression)
  - Start: When you approve
  - Est. completion: ~21h after start

🌙 Overnight Mode Details:
  - Continuous execution (no pauses between items)
  - Checkpoints saved after each item completes
  - Progress log updated in real-time
  - Each clone: C1_Hunter → C2_Extractor → C3_Creator → C4_Auditor
  - Can pause/resume if needed

📁 Outputs:
  - Clones/peter_thiel/     (1_raw_data, 2_structured_data, 3_clone_output)
  - Clones/steve_jobs/      (1_raw_data, 2_structured_data, 3_clone_output)
  - Clones/jacob_petry/     (1_raw_data, 2_structured_data, 3_clone_output)
  - Batch logs: auto_builds/batch_[timestamp]/

⚠️ Important Notes:
  - This will run continuously for ~21 hours
  - Each item must complete fully before next starts
  - You can check progress anytime during execution
  - Each item requires final approval before production
  - You can stop/resume the batch if needed

**Approve batch execution?**
[1] Yes - Start now
[2] No - Cancel
[3] Modify queue (change order or remove items)
[4] Preview first item only (don't execute)
```

---

### 4. **Wait for User Approval**

⚠️ **CRITICAL: NEVER proceed without explicit user approval**

Valid approvals:
- User types "1" or "Yes"
- User types "Start" or "Execute"

If user selects anything else:
- [2] Cancel → Stop, don't execute
- [3] Modify → Let user modify queue, then re-preview
- [4] Preview → Show details of first item, don't execute

---

### 5. **Create Batch Workspace**

Once approved:

```bash
# Generate batch ID
batch_id="batch_$(date +%Y%m%d_%H%M%S)"

# Create directories
mkdir -p X_Agents/The_Scheduler/auto_builds/$batch_id/
mkdir -p X_Agents/The_Scheduler/auto_builds/$batch_id/checkpoints/

# Create files
touch X_Agents/The_Scheduler/auto_builds/$batch_id/batch_progress.log
```

---

### 6. **Initialize Queue File**

Create `queue.yaml`:

```yaml
batch_id: batch_20260125_220000
created_at: "2026-01-25T22:00:00Z"
mode: top_n  # or explicit_list
overnight: true
status: running

queue:
  - item_id: peter_thiel
    position: 1
    type: clone
    rice_score: 8.5
    status: pending
    estimated_hours: 30
    estimated_execution: "7h"

  - item_id: steve_jobs
    position: 2
    type: clone
    rice_score: 8.2
    status: pending
    estimated_hours: 30
    estimated_execution: "7h"

  - item_id: jacob_petry
    position: 3
    type: clone
    rice_score: 7.8
    status: pending
    estimated_hours: 30
    estimated_execution: "7h"

progress:
  total_items: 3
  completed: 0
  failed: 0
  current: null
  started_at: null
  estimated_completion: null
  actual_completion: null

metadata:
  user_approved_at: "2026-01-25T22:00:00Z"
  execution_mode: overnight
```

---

### 7. **Start Batch Execution Log**

Initialize `batch_progress.log`:

```
================================================================================
BATCH AUTO-EXECUTE LOG
================================================================================
Batch ID: batch_20260125_220000
Mode: Top 3 by RICE
Overnight: Yes
Created: 2026-01-25 22:00:00
User: [User ID]

Queue Summary:
  1. Peter Thiel (Clone, RICE 8.5)
  2. Steve Jobs (Clone, RICE 8.2)
  3. Jacob Petry (Clone, RICE 7.8)

Total items: 3
Estimated total time: ~21h
================================================================================

[22:00:05] 🚀 BATCH EXECUTION STARTED
[22:00:06] 📋 Queue loaded: 3 items
[22:00:07] 🌙 Overnight mode: Active
[22:00:08] 📁 Batch workspace: auto_builds/batch_20260125_220000/
[22:00:09]

```

---

### 8. **Execute Queue Sequentially**

For each item in queue:

```markdown
STEP 1: Update queue status
  - queue[N].status = "in_progress"
  - progress.current = item_id
  - progress.started_at = timestamp (if first item)

STEP 2: Log start
  [HH:MM:SS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [HH:MM:SS] 📦 ITEM N/Total: [Item Name]
  [HH:MM:SS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [HH:MM:SS]
  [HH:MM:SS] Item: [item_id]
  [HH:MM:SS] Type: [agent|clone]
  [HH:MM:SS] RICE: [score]
  [HH:MM:SS] Pipeline: [Clone Factory | Z Squad]
  [HH:MM:SS]

STEP 3: Execute auto-execute protocol (Protocolo 5)
  - Use same workflow as single auto-execute
  - Pass overnight=true to pipeline
  - Execute all 4 phases sequentially
  - Save phase checkpoints in item's directory
  - Update BACKLOG.yaml status after each phase

STEP 4: On completion
  - Update queue[N].status = "completed"
  - Update queue[N].completed_at = timestamp
  - Update queue[N].turing_score = score (if clone)
  - Update queue[N].validation_score = score (if agent)
  - progress.completed += 1

STEP 5: Save checkpoint
  - Save queue.yaml (updated)
  - Create checkpoint file:
    auto_builds/batch_[id]/checkpoints/item_N_complete.json

STEP 6: Log completion
  [HH:MM:SS] ✅ ITEM N/Total COMPLETE: [Item Name]
  [HH:MM:SS] 📊 Results:
  [HH:MM:SS]   - Duration: Xh Ymin
  [HH:MM:SS]   - Turing Score: X.X/10 (if clone)
  [HH:MM:SS]   - Validation Score: X.X/10 (if agent)
  [HH:MM:SS]   - Location: [path]
  [HH:MM:SS]   - Status: validation (awaiting final approval)
  [HH:MM:SS]
  [HH:MM:SS] 💾 Checkpoint saved
  [HH:MM:SS] 🔄 Queue progress: N/Total complete
  [HH:MM:SS]

STEP 7: If more items in queue
  - Proceed to next item (no pause if overnight mode)
  - Continue from STEP 1

STEP 8: If all items complete
  - Proceed to Final Summary (Section 9)
```

---

### 9. **Final Summary**

When all items complete:

```markdown
[HH:MM:SS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[HH:MM:SS] 🎉 BATCH EXECUTION COMPLETE
[HH:MM:SS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[HH:MM:SS]
[HH:MM:SS] Batch ID: batch_20260125_220000
[HH:MM:SS] Started: 2026-01-25 22:00:00
[HH:MM:SS] Completed: 2026-01-26 19:45:00
[HH:MM:SS] Total Duration: 21h 45min
[HH:MM:SS]
[HH:MM:SS] ✅ COMPLETED ITEMS (3/3):
[HH:MM:SS]
[HH:MM:SS] ┌────┬───────────────┬──────────┬──────────┬─────────────┐
[HH:MM:SS] │ #  │ Name          │ Duration │ Score    │ Status      │
[HH:MM:SS] ├────┼───────────────┼──────────┼──────────┼─────────────┤
[HH:MM:SS] │ 1  │ Peter Thiel   │ 7h 15m   │ 9.3/10   │ validation  │
[HH:MM:SS] │ 2  │ Steve Jobs    │ 7h 10m   │ 9.1/10   │ validation  │
[HH:MM:SS] │ 3  │ Jacob Petry   │ 7h 20m   │ 9.2/10   │ validation  │
[HH:MM:SS] └────┴───────────────┴──────────┴──────────┴─────────────┘
[HH:MM:SS]
[HH:MM:SS] 📁 OUTPUTS:
[HH:MM:SS]   - Clones/peter_thiel/ (9 KBs, system prompt, validation report)
[HH:MM:SS]   - Clones/steve_jobs/ (9 KBs, system prompt, validation report)
[HH:MM:SS]   - Clones/jacob_petry/ (9 KBs, system prompt, validation report)
[HH:MM:SS]
[HH:MM:SS] 📋 BATCH LOGS:
[HH:MM:SS]   - auto_builds/batch_20260125_220000/batch_progress.log
[HH:MM:SS]   - auto_builds/batch_20260125_220000/queue.yaml
[HH:MM:SS]   - auto_builds/batch_20260125_220000/checkpoints/
[HH:MM:SS]
[HH:MM:SS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[HH:MM:SS] ⚠️ NEXT STEPS
[HH:MM:SS] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[HH:MM:SS]
[HH:MM:SS] All 3 clones require final approval before production.
[HH:MM:SS]
[HH:MM:SS] For each clone, you should:
[HH:MM:SS]   1. Review VALIDATION_REPORT.md
[HH:MM:SS]   2. Test clone responses
[HH:MM:SS]   3. Approve or request modifications
[HH:MM:SS]
[HH:MM:SS] **Review clones now?**
[HH:MM:SS] [1] Review all 3 sequentially
[HH:MM:SS] [2] Review Peter Thiel first
[HH:MM:SS] [3] Review later (progress saved)
[HH:MM:SS] [4] Batch approve all (⚠️ risky, not recommended)

================================================================================
END OF BATCH EXECUTION
================================================================================
```

Update `queue.yaml`:

```yaml
status: completed
progress:
  total_items: 3
  completed: 3
  failed: 0
  current: null
  started_at: "2026-01-25T22:00:00Z"
  actual_completion: "2026-01-26T19:45:00Z"
  total_duration: "21h 45min"
```

---

### 10. **Error Handling**

If an item fails during execution:

```markdown
[HH:MM:SS] ❌ ITEM N/Total FAILED: [Item Name]
[HH:MM:SS] Phase: [Phase Name]
[HH:MM:SS] Error: [Error message]
[HH:MM:SS]
[HH:MM:SS] 💾 Emergency checkpoint saved
[HH:MM:SS] ⏸️ BATCH EXECUTION PAUSED
[HH:MM:SS]
[HH:MM:SS] Progress:
[HH:MM:SS]   Completed: M items ✅
[HH:MM:SS]   Failed: [Item Name] at Phase N
[HH:MM:SS]   Remaining: K items (not started)
[HH:MM:SS]
[HH:MM:SS] Batch ID: batch_[id]
[HH:MM:SS] Checkpoint: auto_builds/batch_[id]/checkpoints/emergency.json
[HH:MM:SS]
[HH:MM:SS] **Options:**
[HH:MM:SS] [1] Retry [item_id] from Phase N
[HH:MM:SS] [2] Skip [item_id], continue with remaining items
[HH:MM:SS] [3] Abort batch (save progress)
[HH:MM:SS] [4] Debug [item_id] manually

⚠️ WAIT FOR USER DECISION - Do not proceed automatically
```

Update `queue.yaml`:

```yaml
status: paused
queue:
  - item_id: [failed_item]
    status: failed
    failed_at: timestamp
    failed_phase: phase_name
    error: "error message"

progress:
  current: null
  last_error: "Item [name] failed at Phase N"
```

---

### 11. **Resume from Interruption**

If batch was paused or failed, user can resume:

```bash
/schedule auto-execute-batch --resume=batch_20260125_220000
```

**Workflow:**

```markdown
1. Load batch_[id]/queue.yaml
2. Check status:
   - If "completed": Show summary, nothing to resume
   - If "paused" or "failed": Show resume options

3. Identify state:
   - Completed items: [list]
   - Failed item: [name] at Phase N (if any)
   - Remaining items: [list]

4. Show resume preview:
   ```
   📋 RESUME BATCH: batch_20260125_220000

   Batch Status: Paused
   Original queue: 3 items

   Progress:
     ✅ Peter Thiel - completed (Turing 9.3/10)
     ❌ Steve Jobs - failed at Phase 2 (C2_Extractor)
     ⏳ Jacob Petry - pending (not started)

   **Resume options:**
   [1] Retry Steve Jobs from Phase 2, then continue
   [2] Skip Steve Jobs, continue with Jacob Petry
   [3] Restart Steve Jobs from beginning, then continue
   [4] Abort resume
   ```

5. Wait for user selection

6. If user approves:
   - Resume from selected point
   - Continue batch execution protocol
   - Update queue.yaml status to "running"
```

---

## FILES & PATHS

### Batch Workspace Structure

```
X_Agents/The_Scheduler/auto_builds/batch_[timestamp]/
├── queue.yaml                    # Queue definition and progress
├── batch_progress.log            # Complete execution log
├── checkpoints/
│   ├── item_1_complete.json     # After item 1 completes
│   ├── item_2_complete.json     # After item 2 completes
│   ├── item_N_complete.json     # After item N completes
│   └── emergency.json           # If batch pauses/fails
└── final_summary.md             # Human-readable summary
```

### Queue YAML Schema

```yaml
batch_id: string              # Unique batch identifier
created_at: timestamp         # When batch was created
mode: top_n | explicit_list   # How items were selected
overnight: boolean            # Overnight mode flag
status: running | paused | completed | failed

queue:                        # Array of items
  - item_id: string
    position: number          # 1-indexed position in queue
    type: agent | clone
    rice_score: number
    status: pending | in_progress | completed | failed
    estimated_hours: number
    estimated_execution: string
    started_at: timestamp (optional)
    completed_at: timestamp (optional)
    failed_at: timestamp (optional)
    failed_phase: string (optional)
    error: string (optional)
    turing_score: number (optional, for clones)
    validation_score: number (optional, for agents)

progress:
  total_items: number
  completed: number
  failed: number
  current: string (item_id currently executing, null if none)
  started_at: timestamp (when batch execution started)
  estimated_completion: timestamp (calculated)
  actual_completion: timestamp (when batch completed)
  total_duration: string (HH:MM:SS format)

metadata:
  user_approved_at: timestamp
  execution_mode: overnight | standard
```

---

## VALIDATION RULES

Before starting batch:

1. ✅ All items exist in BACKLOG.yaml
2. ✅ All items have status = "planned"
3. ✅ No items are blocked (blocked = false)
4. ✅ If using --top=N, all items have rice_score calculated
5. ✅ User has explicitly approved execution

During batch:

1. ✅ Update BACKLOG.yaml after each phase of each item
2. ✅ Save checkpoint after each item completes
3. ✅ Log all actions to batch_progress.log
4. ✅ Update queue.yaml in real-time

On completion:

1. ✅ All items in validation status (not production yet)
2. ✅ User approval required for production
3. ✅ Batch summary saved

---

## EXAMPLE FULL EXECUTION

See `Protocolo 6` in `prompt_operacional.md` for complete example with timestamps and full log output.

---

**Created:** 2026-01-25
**Version:** 1.2.0
**Workflow Type:** Batch Automated Pipeline Execution (User-Initiated)
