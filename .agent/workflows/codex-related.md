---
description: Encontrar conteúdos relacionados
---

# Workflow: Conteúdos Relacionados

Encontra conteúdos similares baseado em tags, autor ou tópicos.

## Passos

1. Pegar ID do conteúdo base
2. Buscar conteúdos com:
   - Tags em comum
   - Mesmo autor
   - Tópicos similares
3. Rankear por relevância
4. Retornar top 10

## Exemplo de Uso

```
/codex-related art_2026_001
```

## Output Esperado

```
🔗 Conteúdos relacionados a "How to Make Wealth":

1. [art_2026_015] Y Combinator Startup Guide
   Relevância: 85% (tags: startups, business, entrepreneurship)
   
2. [art_2026_003] Product Market Fit
   Relevância: 72% (tags: startups, pmf)
   
3. [book_2026_001] The Lean Startup
   Relevância: 68% (tags: startups, business)
```

## Algoritmo de Similaridade

```python
def calculate_similarity(content1, content2):
    # Jaccard similarity em tags
    tag_similarity = len(set(c1.tags) & set(c2.tags)) / len(set(c1.tags) | set(c2.tags))
    
    # Mesmo autor = boost
    author_boost = 0.2 if c1.author == c2.author else 0
    
    return tag_similarity + author_boost
```

## Implementação Futura

Requer função `cmd_related()` no cli.py.
