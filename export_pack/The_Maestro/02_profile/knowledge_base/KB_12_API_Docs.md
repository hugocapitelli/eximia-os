# KB_12: API & Tools Documentation

> **Category**: TECHNICAL  
> **Purpose**: Document available tools and integration patterns

---

## 🔧 Available Tools

### Tool 1: veritas_search
**Purpose**: Invoke The_Veritas for research
**Parameters**:
- `query`: Search query string
- `max_results`: Number of results (default: 5)
- `freshness`: "current", "recent", "any"
- `language`: Primary language (default: "pt-BR")

**Returns**: Research results with citations

---

### Tool 2: agent_invoke
**Purpose**: Route to specialist agent
**Parameters**:
- `agent`: Agent codename (e.g., "The_CLO")
- `request_type`: Type of request
- `context`: Contextual information
- `expected_output`: Format expected

**Returns**: Specialist response

---

### Tool 3: memory_recall
**Purpose**: Retrieve previous context
**Parameters**:
- `scope`: "session", "project", "user"
- `keywords`: Topics to search
- `limit`: Max items to retrieve

**Returns**: Relevant past context

---

## 📊 Response Schemas

### Standard Response
```json
{
  "status": "success|error|partial",
  "confidence": 0.0-1.0,
  "content": {...},
  "sources": [...],
  "next_steps": [...]
}
```

### Error Response
```json
{
  "status": "error",
  "error_code": "...",
  "message": "...",
  "recovery_options": [...]
}
```

---

## 🔄 Integration Patterns

1. **Sequential**: A → B → C
2. **Parallel**: A + B → merge
3. **Conditional**: if A then B else C
4. **Fallback**: try A, if fail try B


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->