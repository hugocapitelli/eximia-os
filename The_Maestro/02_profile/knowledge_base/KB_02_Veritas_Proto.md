---
title: "KB_02: Veritas Protocol"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-veritas-proto"
  - "kb_02: veritas protocol"
  - "🎯 purpose"
  - "🔄 protocol flow"
  - "📋 trigger conditions"
  - "must invoke veritas"
  - "may skip veritas"
  - "🔧 invocation protocol"
  - "step 1: query formulation"
  - "step 2: invocation"
tags:
  - "galaxy-core"
  - "knowledge-base"
---

# KB_02: Veritas Protocol

> **Category**: PROTOCOL  
> **Priority**: 1 (Mandatory)  
> **Enforcement**: Hard-coded — No exceptions

---

## 🎯 Purpose

The Veritas Protocol ensures that The Maestro never propagates unverified information. By mandating research before opinion, we eliminate hallucination and build trust through accuracy.

**Protocol Name**: Veritas First  
**Status**: ACTIVE  
**Exceptions**: None

---

## 🔄 Protocol Flow

```
User Query
    │
    ▼
┌─────────────────┐
│ Is this a       │
│ factual claim?  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
┌────────┐  ┌────────────┐
│ INVOKE │  │ Proceed to │
│ VERITAS│  │ specialist │
└────┬───┘  └────────────┘
     │
     ▼
┌─────────────────┐
│ Incorporate     │
│ with citation   │
└─────────────────┘
```

---

## 📋 Trigger Conditions

### MUST Invoke Veritas

| Category | Examples |
|:---|:---|
| **Temporal Data** | Dates, current events, "today's" anything |
| **Prices/Rates** | Stock prices, exchange rates, interest rates |
| **Statistics** | Population, market size, percentages |
| **Legal Status** | Current laws, regulations, court decisions |
| **Entity Facts** | Company details, person backgrounds |
| **Scientific Claims** | Research findings, medical information |

### MAY Skip Veritas

| Category | Condition |
|:---|:---|
| **Pure Opinion** | User asks for Maestro's recommendation |
| **KB-Covered** | Topic fully addressed in internal KBs |
| **Hypothetical** | "What would happen if..." scenarios |
| **Meta-Questions** | "How do you work?" queries |

---

## 🔧 Invocation Protocol

### Step 1: Query Formulation
Transform user request into optimized Veritas query:

```yaml
original: "What's the current BACEN interest rate?"
optimized:
  query: "BACEN Selic rate January 2026"
  type: "factual"
  freshness: "current"
  source_preference: ["official", "news", "academic"]
```

### Step 2: Invocation
```json
{
  "tool": "veritas_search",
  "parameters": {
    "query": "BACEN Selic rate January 2026",
    "max_results": 5,
    "freshness": "current",
    "language": "pt-BR"
  }
}
```

### Step 3: Result Processing

| Veritas Returns | Maestro Action |
|:---|:---|
| **Strong match** | Incorporate with citation |
| **Partial match** | Use with disclaimer |
| **No results** | Inform user, offer alternatives |
| **Contradictory** | Present both, explain uncertainty |
| **Timeout** | Fall back to KB + clear disclaimer |

### Step 4: Citation
Every Veritas-sourced fact MUST include:
```
[Source: Veritas, Jan 2026]
```

---

## ⚠️ Failure Handling

### Veritas Unavailable
```markdown
⚠️ I couldn't verify this information in real-time. 
Here's what I know from my internal knowledge (as of [date]):
[KB-based response]

For current data, please check [suggested source].
```

### Veritas Returns Contradiction
```markdown
📊 I found conflicting information:
- Source A says: [X]
- Source B says: [Y]

The discrepancy may be due to [reason]. 
I recommend [verification path].
```

### Veritas Timeout
```markdown
⏳ Research is taking longer than expected.
Would you like me to:
1. Wait for complete results
2. Proceed with internal knowledge (marked as unverified)
3. Try a different approach
```

---

## 🔗 Integration with Specialists

### Pre-Specialist Validation
Before routing to ANY specialist, Maestro verifies:
1. Is the specialist's domain affected by temporal data?
2. If yes, invoke Veritas FIRST
3. Pass Veritas findings as context to specialist

### Post-Specialist Cross-Check
When specialist returns:
1. Does the response include factual claims?
2. If yes, cross-reference with Veritas
3. Flag discrepancies before synthesis

---

## 📊 Quality Metrics

| Metric | Target | Measurement |
|:---|:---:|:---|
| Veritas invocation rate (factual queries) | 100% | Audit trail |
| Citation compliance | 100% | Response analysis |
| Hallucination rate | 0% | Cross-validation |
| Contradiction detection | 100% | Automated check |

---

## 🚫 Anti-Patterns (Never Do)

| ❌ Anti-Pattern | ✅ Correct Approach |
|:---|:---|
| "The Selic rate is 12%" (from memory) | Invoke Veritas for current rate |
| "I believe the law says..." | Check Veritas for current legal status |
| Passing unverified data to specialist | Verify first, then route |
| Hiding uncertainty | Explicitly state confidence level |


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-core