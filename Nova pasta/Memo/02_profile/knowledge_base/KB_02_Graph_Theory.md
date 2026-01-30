# KB_02: Graph Theory for Knowledge Networks

## What is a Knowledge Graph?
A **directed graph** where:
- **Nodes** = Ideas (Atoms, Clusters, Insights)
- **Edges** = Connections (relationships between ideas)

## Node Types in Zettelkasten

### Atom (Degree 0-2)
- Small, isolated idea
- Few connections
- Example: "Qwen 2.5 is a good local LLM"

### Cluster (Degree 3+)
- Hub node
- Many incoming connections from atoms
- Example: "Local LLM Strategies" connects to 5 atom notes

### Insight (High Betweenness)
- Bridge between clusters
- Connects disparate domains
- Example: "The Centaur Model" bridges "AI Systems" and "Human Collaboration"

## Graph Metrics to Track

### 1. Degree Centrality
Number of connections a node has.
- **High degree** = Important hub (Cluster or Insight)
- **Low degree** = Orphan atom (needs connection)

### 2. Clustering Coefficient
How densely connected a node's neighbors are.
- **High clustering** = Well-formed cluster
- **Low clustering** = Weak, scattered ideas

### 3. Betweenness Centrality
How often a node appears in shortest paths between other nodes.
- **High betweenness** = Bridge Insight (connects different topics)

## Detecting Clusters: Algorithm

```python
def detect_clusters(atoms, threshold=0.7):
    """Group atoms by semantic similarity"""
    for atom_a in atoms:
        for atom_b in atoms:
            similarity = cosine_similarity(atom_a.embedding, atom_b.embedding)
            if similarity > threshold:
                create_edge(atom_a, atom_b)
    
    # Use connected components to find clusters
    clusters = find_connected_components(graph)
    return clusters
```

## Conflict Detection
**Red Edge** = Contradiction between notes.

Detect via:
1. **Embedding distance** (opposite vectors)
2. **Keyword negation** ("Agents need memory" vs "Agents should be stateless")
3. **User manual flagging**

## Practical Application
When the Zettelkasten Librarian processes ideas:
1. Calculate embedding for new atom
2. Find k-nearest neighbors (k=5)
3. If similarity > 0.7, suggest connection
4. If 3+ atoms form a clique, suggest cluster
5. If cluster spans multiple domains, elevate to insight
