---
description: Buscar conteúdos no Codex usando busca semântica (significado)
---

1. **Validar Query**
   - Se não houver query, mostrar ajuda

2. **Executar Busca Semântica**
   - Chamar script Python de busca:
```python
python -c "
import sys
sys.path.insert(0, '00_Codex/scripts')
from codex_embeddings import codex_embedder

query = '{{QUERY}}'
limit = {{LIMIT}}

# Busca híbrida (keyword + semantic)
results = codex_embedder.hybrid_search(query, limit=limit)

print(f'🔍 Encontrados {len(results)} resultados para: {query}\n')

for i, r in enumerate(results, 1):
    print(f'{i}. [{r[\"id\"]}] {r[\"title\"]}')
    print(f'   Tipo: {r[\"type\"]} | Autor: {r.get(\"author\", \"N/A\")}')
    print(f'   Score: {r[\"rrf_score\"]:.3f}')
    if r.get('source_agent'):
        print(f'   Origem: {r[\"source_agent\"]}')
    print()
"
```

3. **Opções de Busca**
   - **Híbrida** (padrão): Combina keyword + semântica
   - **Apenas semântica**: `--semantic-only`
   - **Ajustar limite**: `--limit N`

**Exemplos de Uso:**
```bash
# Busca híbrida (recomendado)
/codex-search-semantic "como aumentar receita"

# Apenas semântica
/codex-search-semantic "modelos de negócio" --semantic-only

# Mais resultados
/codex-search-semantic "product market fit" --limit 20
```

**Diferença vs `/codex-search`:**
- `/codex-search`: Busca por palavras exatas (FTS)
- `/codex-search-semantic`: Busca por significado (embeddings)
  - Encontra sinônimos: "receita" → "revenue", "faturamento"
  - Encontra conceitos relacionados: "SaaS" → "subscription", "MRR"
