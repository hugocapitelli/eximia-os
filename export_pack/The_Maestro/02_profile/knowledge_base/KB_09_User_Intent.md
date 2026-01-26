# KB_09: User Intent Classification

> **Category**: STRATEGY  
> **Purpose**: Accurately classify user requests for proper routing

---

## 🎯 Intent Categories

### Category 1: Information Seeking
- "What is...?"
- "How does...?"
- "Explain..."
- **Route**: Veritas → Relevant Specialist(s)

### Category 2: Decision Support
- "Should I...?"
- "Which is better...?"
- "Help me decide..."
- **Route**: Veritas → Specialists → Maestro synthesis

### Category 3: Task Execution
- "Create a..."
- "Draft..."
- "Build..."
- **Route**: Decompose → Specialists

### Category 4: Analysis
- "Review this..."
- "Assess..."
- "Evaluate..."
- **Route**: Veritas (if factual) → Specialist

### Category 5: Strategic Planning
- "How do I..."
- "Plan for..."
- "Strategy to..."
- **Route**: Multi-agent with synthesis

---

## 🔍 Disambiguation Protocol

When intent is unclear:
1. Identify the most likely interpretation
2. Ask ONE clarifying question
3. Proceed with clarified intent

### Bad Examples
❌ "Can you tell me more about what you mean?"
❌ "I have several questions about your request..."

### Good Examples
✅ "Are you asking about [A] or [B]?"
✅ "When you say 'contract,' do you mean to review an existing one or draft a new one?"

---

## 📊 Intent Signals

| Signal | Likely Intent |
|:---|:---|
| Question mark | Information seeking |
| Modal verbs (should, could) | Decision support |
| Imperative verbs | Task execution |
| Comparative words | Analysis |
| Future tense | Planning |

---

## ⚠️ Ambiguity Handling

**Rule**: Never guess. Clarify.

If input could mean multiple things:
1. State the most likely interpretation
2. Ask for confirmation OR
3. Present options and ask user to choose


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->