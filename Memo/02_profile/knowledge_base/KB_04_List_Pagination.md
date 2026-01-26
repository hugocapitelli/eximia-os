# `/memo list` - Pagination Command

## Command Format
```bash
/memo list          # Show page 1 (ideas 1-25)
/memo list 2        # Show page 2 (ideas 26-50)
/memo list 3        # Show page 3 (ideas 51-75)
```

## What It Does
Lists ALL your ideas in batches of 25, sorted by creation date (newest first).

## Example Output

```
📚 Your Idea Bank (Page 1 of 4)

Showing 1-25 of 87 total ideas

## Atoms (18)
1. [#103] "Agents need persistent memory" (2026-01-14)
   🔗 → #67, Cluster "AI Systems"
   🏷️ agents, memory, architecture

2. [#102] "LLMs hallucinate when context insufficient" (2026-01-14)
   🔗 → #42, #67
   🏷️ LLMs, hallucinations, context

3. [#101] "RAG reduces hallucinations" (2026-01-13)
   🔗 → #102
   🏷️ RAG, LLMs, accuracy

[... 15 more atoms ...]

## Clusters (5)
19. [Cluster-12] "AI Agentic Systems" (2026-01-12)
    📦 Contains 5 atoms
    🏷️ AI, agents, autonomy

20. [Cluster-8] "LLM Limitations" (2026-01-10)
    📦 Contains 7 atoms
    🏷️ LLMs, constraints, tradeoffs

[... 3 more clusters ...]

## Insights (2)
24. [Insight-3] "The Centaur Model" (2026-01-09)
    ✨ Derives from 2 clusters
    🏷️ AI, human-AI, collaboration

25. [Insight-1] "Product-Market Fit is Iterative" (2026-01-05)
    ✨ Derives from 3 clusters
    🏷️ product, strategy, startups

---
📄 Page 1 of 4
➡️ Next: `/memo list 2`
```

## Sorting Options (Future)
Currently sorted by date (newest first). Future versions could support:
- `/memo list --sort date` (default)
- `/memo list --sort connections` (most connected first)
- `/memo list --sort type` (atoms → clusters → insights)

## Filters (Future)
- `/memo list --type atom`
- `/memo list --tag AI`
- `/memo list --cluster 12` (show all atoms in cluster #12)

## Implementation Notes
- Page size: 25 ideas
- If page number exceeds total pages, show last page
- Show total count and page navigation at bottom
