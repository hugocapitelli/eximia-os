# Memo - Command Reference

## All Available Commands

### 1. `/memo "your idea text"`
**Add a new atomic idea**

**What it does:**
- Analyzes your idea and extracts key concepts
- Searches Codex for similar existing ideas (semantic search)
- Proposes connections with similarity scores
- Requests approval before saving

**Example:**
```bash
/memo "LLMs hallucinate when context is insufficient"
```

**Output:**
```
📝 New Idea: "LLMs hallucinate when context is insufficient"

🔍 Found 2 related ideas:
- [#42] "RAG reduces hallucinations" (82% similar)
- [#67] "Context window limitations" (76% similar)

💡 Suggested tags: LLMs, hallucinations, context

❓ Save atom with connections to #42 and #67?
[Approve] [Edit] [Cancel]
```

**Where it saves:**
- Database: `eximia_data.db` → `category: "ideas"`
- File: `eximia_data/ideas/0042_llms_hallucinate.md`

---

### 2. `/memo cluster`
**Form clusters from related ideas**

**What it does:**
- Finds all "orphan" atoms (not yet in a cluster)
- Groups them by semantic similarity (>70%)
- Suggests cluster names and descriptions
- Requests approval before creating

**Example:**
```bash
/memo cluster
```

**Output:**
```
🔬 Detected Cluster: "LLM Limitations"

📦 Contains 5 atoms:
1. "LLMs hallucinate..."
2. "Context windows are limited"
3. "Fine-tuning is expensive"
4. "Prompt engineering has limits"
5. "Token costs add up"

📝 Synthesized description:
"Fundamental constraints and challenges when working with large language models..."

❓ Create this cluster?
[Approve] [Rename] [Cancel]
```

---

### 3. `/memo insights`
**Generate high-level insights from clusters**

**What it does:**
- Analyzes all existing clusters
- Synthesizes them into meta-insights
- Detects conflicts with old ideas
- Requests approval before saving

**Example:**
```bash
/memo insights
```

**Output:**
```
✨ Insight Generated: "The Centaur Model"

🧠 Synthesis:
"The optimal AI system combines LLM reasoning with human judgment—
neither pure AI nor pure human achieves peak performance alone."

🔗 Derives from clusters:
- "LLM Limitations" (5 atoms)
- "Human-AI Collaboration" (4 atoms)

⚠️ Conflicts detected:
- [#89] "AI will replace all human work" (2023)
  → This insight suggests complementarity, not replacement.

❓ Save this insight? Mark #89 as superseded?
[Approve] [Edit] [Cancel]
```

---

### 4. `/memo graph`
**Visualize your knowledge network**

**What it does:**
- Builds a graph from all your ideas
- Calculates metrics (degree, betweenness, clustering)
- Generates visual diagram (Mermaid)
- Provides actionable recommendations

**Example:**
```bash
/memo graph
```

**Output:**
```
📊 Knowledge Graph Analysis

📈 Stats:
- 47 total ideas (32 atoms, 12 clusters, 3 insights)
- Average degree: 2.3 connections/idea
- Network density: 34%

⚡ Top hubs (most connected):
1. Cluster "AI Systems" (12 connections)
2. Cluster "Product Strategy" (8 connections)

⚠️ Action items:
- 8 orphan atoms need connections
- Cluster "Blockchain Ideas" is fragmented
- Consider merging "UI Design" + "UX Patterns" (87% similar)

[Mermaid diagram displayed here]
```

---

### 5. `/memo recall [query]`
**Remember ideas similar to a query**

**What it does:**
- Searches your idea bank semantically
- Returns top 5 most relevant ideas
- Shows connection paths
- Does NOT create new ideas (read-only)

**Example:**
```bash
/memo recall "agent memory strategies"
```

**Output:**
```
🔍 Recalling ideas similar to: "agent memory strategies"

📚 Top 5 matches:
1. [#103] "Agents need persistent memory" (91% match)
   → Connected to: Cluster "AI Systems"
   
2. [#67] "Context window limitations" (84% match)
   → Connected to: #103, Cluster "LLM Limitations"
   
3. [#42] "Vector DBs for long-term memory" (78% match)
   → Connected to: #103
   
4. [#156] "RAG for agent knowledge" (72% match)
   → Connected to: #42, #67
   
5. [#201] "Fine-tuning vs retrieval tradeoff" (69% match)
   → Connected to: Cluster "LLM Limitations"

💡 Connection path: #103 → Cluster "AI Systems" → Insight "Centaur Model"
```

---

### 6. `/memo list [page]`
**List all ideas with pagination**

**What it does:**
- Shows ALL your ideas in batches of 25
- Sorted by creation date (newest first)
- Grouped by type (Atoms → Clusters → Insights)
- Read-only (doesn't create or modify)

**Example:**
```bash
/memo list      # Page 1 (ideas 1-25)
/memo list 2    # Page 2 (ideas 26-50)
```

**Output:**
```
📚 Your Idea Bank (Page 1 of 4)

Showing 1-25 of 87 total ideas

## Atoms (18)
1. [#103] "Agents need persistent memory" (2026-01-14)
   🔗 → #67, Cluster "AI Systems"
   🏷️ agents, memory, architecture

2. [#102] "LLMs hallucinate..." (2026-01-14)
   🔗 → #42, #67
   🏷️ LLMs, hallucinations

[... more atoms ...]

## Clusters (5)
19. [Cluster-12] "AI Agentic Systems"
    📦 5 atoms
    
## Insights (2)
24. [Insight-3] "The Centaur Model"
    ✨ From 2 clusters

---
📄 Page 1 of 4
➡️ Next: `/memo list 2`
```

**Where it saves:**
- Nowhere (read-only command)

---

## Quick Reference Table

| Command | Purpose | Creates Data? |
|---------|---------|---------------|
| `/memo "text"` | Add new idea | Yes (with approval) |
| `/memo recall [query]` | Search existing ideas | No (read-only) |
| `/memo list [page]` | Browse all ideas | No (read-only) |
| `/memo cluster` | Group related ideas | Yes (with approval) |
| `/memo insights` | Generate meta-insights | Yes (with approval) |
| `/memo graph` | Analyze network | No (read-only) |

---

## File Structure

### Database
```
eximia_data/eximia_data.db
└── content table
    └── category: "ideas"
        ├── idea_type: "atom" | "cluster" | "insight"
        ├── connections: JSON array
        └── tags: comma-separated
```

### Files
```
00_Codex/eximia_data/04_IDEAS/
├── 0001_agents_need_memory.md
├── 0002_llms_hallucinate.md
├── cluster_0012_ai_systems.md
└── insight_0023_centaur_model.md
```

---

## Usage Tips

1. **Start small:** Capture 10-15 atomic ideas first
2. **Let connections emerge:** Don't force structure early
3. **Run cluster monthly:** Once you have 20+ atoms
4. **Generate insights quarterly:** When you have 3+ clusters
5. **Use recall daily:** To find existing knowledge before adding duplicates
