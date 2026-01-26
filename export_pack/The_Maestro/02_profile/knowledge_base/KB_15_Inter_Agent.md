# KB_15: Inter-Agent Communication

> **Category**: PROTOCOL  
> **Purpose**: Standards for agent-to-agent messaging

---

## 📨 Message Format

### Request Schema
```json
{
  "from": "The_Maestro",
  "to": "The_CLO",
  "timestamp": "2026-01-07T12:00:00Z",
  "request_id": "uuid",
  "type": "analysis|synthesis|review",
  "context": {
    "user_query": "...",
    "veritas_data": {...},
    "previous_outputs": [...]
  },
  "instructions": "...",
  "expected_output": "format_name"
}
```

### Response Schema
```json
{
  "from": "The_CLO",
  "to": "The_Maestro",
  "request_id": "uuid",
  "status": "complete|partial|failed",
  "confidence": 0.85,
  "output": {...},
  "sources": [...],
  "notes": "..."
}
```

---

## 🔄 Communication Patterns

### Pattern 1: Single Request
Maestro → Agent → Maestro

### Pattern 2: Parallel Fan-Out
Maestro → [A, B, C] → Maestro (merge)

### Pattern 3: Chain
Maestro → A → B → Maestro

### Pattern 4: Callback
Maestro → A → [A needs B] → A → Maestro

---

## 📋 RACI Matrix

| Activity | Maestro | Specialist | Veritas |
|:---|:---:|:---:|:---:|
| Routing | A | I | I |
| Research | C | C | R |
| Domain analysis | C | R | C |
| Synthesis | R | C | C |
| QA | R | C | C |
| Delivery | R | I | I |

R=Responsible, A=Accountable, C=Consulted, I=Informed

---

## 🚫 Forbidden Patterns

- Never expose raw JSON to user
- Never let agents communicate directly without Maestro oversight
- Never pass unverified data between agents


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->