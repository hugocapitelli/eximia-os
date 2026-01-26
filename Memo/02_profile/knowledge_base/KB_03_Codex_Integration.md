# KB_03: Codex Integration Guide

## Codex Database Structure

### Table: `content`
Primary storage for all Codex items.

**Standard Columns:**
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT)
- `content_text` (TEXT)
- `category` (TEXT) - e.g., "inbox", "processed", "ideas"
- `tags` (TEXT) - Comma-separated
- `created_at` (TIMESTAMP)

**Zettelkasten-Specific Extensions:**
- `idea_type` (TEXT) - "atom" | "cluster" | "insight"
- `connections` (TEXT) - JSON array of connected IDs: `["id_123", "id_456"]`
- `cluster_name` (TEXT) - Name of cluster (if type=cluster)
- `embedding_id` (INTEGER) - FK to `vector_embeddings.id`

### Table: `vector_embeddings`
Semantic search support.

**Columns:**
- `id` (INTEGER PRIMARY KEY)
- `content_id` (INTEGER) - FK to `content.id`
- `embedding` (BLOB) - Vector representation
- `model` (TEXT) - "text-embedding-3-small" or similar

## Integration Pattern

### 1. Saving an Atom
```python
from eximia_runtime.utils.codex_integration import save_to_codex

save_to_codex(
    title="Agents need persistent memory",
    content_text="LLMs have context limits. For long-running agents...",
    category="ideas",
    idea_type="atom",
    tags=["agents", "memory", "architecture"],
    connections=[]  # Empty initially
)
```

### 2. Finding Similar Ideas
```python
from eximia_runtime.utils.codex_integration import semantic_search

similar = semantic_search(
    query="agent memory strategies",
    category="ideas",
    top_k=5
)
# Returns: [(id, title, similarity_score), ...]
```

### 3. Creating a Cluster
```python
# Step 1: Create cluster node
cluster_id = save_to_codex(
    title="AI Agentic Systems",
    content_text="Synthesis of ideas about autonomous agents...",
    category="ideas",
    idea_type="cluster",
    connections=["atom_1", "atom_2", "atom_3"]
)

# Step 2: Update atoms to point to cluster
for atom_id in ["atom_1", "atom_2", "atom_3"]:
    update_connections(atom_id, add=[cluster_id])
```

## Workflow Commands

### `/codex-add`
Standard Codex ingestion (manual).
```bash
/codex-add --category ideas --title "My Idea" --content "..."
```

### `/zettel` (New)
Intelligent ingestion via Zettelkasten Librarian.
```bash
/zettel "Agents should have personality"
# Agent analyzes, finds connections, asks for approval
```

## Query Patterns

### List All Atoms
```sql
SELECT id, title FROM content 
WHERE category = 'ideas' AND idea_type = 'atom';
```

### Find Orphan Atoms (No Connections)
```sql
SELECT id, title FROM content 
WHERE category = 'ideas' 
  AND idea_type = 'atom'
  AND (connections IS NULL OR connections = '[]');
```

### Get Cluster with Children
```sql
-- Step 1: Find cluster
SELECT * FROM content WHERE id = 'cluster_123';

-- Step 2: Find connected atoms
SELECT * FROM content 
WHERE category = 'ideas' 
  AND connections LIKE '%cluster_123%';
```

## Best Practices
1. **Always generate embeddings** when saving to enable semantic search
2. **Update connections bidirectionally** (if A→B, then B→A)
3. **Use transactions** when creating clusters (atomic operation)
4. **Validate JSON** in `connections` field before saving
