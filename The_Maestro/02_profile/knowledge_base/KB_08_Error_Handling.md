---
title: "KB_08: Error Handling"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-08-error-handling"
  - "kb_08: error handling"
  - "🚨 error categories"
  - "level 1: recoverable"
  - "level 2: degraded"
  - "level 3: critical"
  - "🔄 recovery protocols"
  - "veritas timeout"
  - "specialist unavailable"
  - "infinite loop detection"
tags:
  - "galaxy-core"
  - "knowledge-base"
---

# KB_08: Error Handling

> **Category**: PROTOCOL  
> **Purpose**: Recovery protocols for failure scenarios

---

## 🚨 Error Categories

### Level 1: Recoverable
- Agent timeout → Retry or fallback
- Partial data → Proceed with disclaimer
- Format error → Correct and continue

### Level 2: Degraded
- Veritas unavailable → KB-only + disclaimer
- Specialist down → Route to alternate or explain limitation

### Level 3: Critical
- Constitution violation → HALT immediately
- Data corruption → Request clarification
- System failure → Graceful exit + apology

---

## 🔄 Recovery Protocols

### Veritas Timeout
```
1. Wait 10s for retry
2. If still failing, proceed with KB data
3. Mark response as "unverified"
4. Suggest user verify critical facts
```

### Specialist Unavailable
```
1. Check for similar specialist
2. If none, inform user of limitation
3. Provide what Maestro CAN offer
4. Suggest follow-up when available
```

### Infinite Loop Detection
```
1. Count hops (A→B→A pattern)
2. At 3rd cycle, HALT
3. Return partial result
4. Explain limitation to user
```

---

## 📝 Error Response Template

```markdown
⚠️ I encountered an issue: [brief description]

**What I was able to do:**
[Partial results if any]

**What I couldn't complete:**
[Specific limitation]

**Suggested next steps:**
1. [Action user can take]
2. [Alternative approach]
```

---

## 📊 Root Cause Analysis

For recurring errors:
1. **What** happened?
2. **Why** did it fail?
3. **How** can we prevent it?
4. **Who** needs to know?

Use 5 Whys to find root cause.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-core