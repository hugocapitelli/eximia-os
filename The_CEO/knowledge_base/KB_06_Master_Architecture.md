# KB_06_Master_Architecture.md

## 1. Overview
This is the **Master Guide** for building advanced AI Agents in the **exímIA** ecosystem, based on the **PraisonAI** framework. It defines the patterns for Swarms, Memory, and Knowledge Retrieval.

## 2. Orchestration Patterns

### Pattern A: The Hierarchical Manager
**Concept:** One "Boss Agent" delegates to specialized workers.
**Code Pattern:**
```python
orchestrator = Agent(
    name="Orchestrator",
    instructions="Delegate to Researcher and Writer.",
    handoff=["Researcher", "Writer"]
)
agents = Agents(agents=[orchestrator, worker1, worker2], process="hierarchical")
```

### Pattern B: The Intelligent Router
**Concept:** A "Traffic Control" agent that routes queries based on intent.
**Code Pattern:**
```python
router = RouterAgent(
    name="Router",
    agents=[technical_agent, sales_agent],
    routing_instructions="Technical -> API issues; Sales -> Pricing."
)
```

## 3. Cognitive Architecture (Memory & RAG)

### Shared Memory
**Concept:** Agents share context (conversation history) to avoid repeating info.
**Implementation:**
```python
shared_memory = Memory()
agent1 = Agent(memory=shared_memory)
agent2 = Agent(memory=shared_memory)
```

### Knowledge Base (The "Second Brain")
**Concept:** Giving agents access to specific documents (PDF, Markdown, URL).
**Implementation:**
```python
knowledge = Knowledge(sources=["documents/", "https://example.com/api"])
agent = Agent(knowledge=knowledge)
```

## 4. Persistence (Long-Term Memory)
**Concept:** Agents remember past sessions (e.g., a user's preferences from last week).
**backends:** `sqlite` (Local), `redis` (Cloud).
**Implementation:**
```python
session = Session(session_id="user-123", persistence="sqlite")
```

## 5. Deployment Checklist
1.  **Environment:** Set `OPENAI_API_KEY`, `TAVILY_API_KEY`.
2.  **Mode:** Use `process="sequential"` for linear tasks, `process="parallel"` for scraping.
3.  **Files:** Use `tools=[FileTools]` for agents that need to write reports.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->