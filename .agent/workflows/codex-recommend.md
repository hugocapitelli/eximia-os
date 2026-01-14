---
description: Recomendar conteúdos por gaps de conhecimento
---

# Workflow: Recomendações por Gaps

Analisa sua biblioteca e recomenda conteúdos para preencher lacunas de conhecimento.

## Passos

1. Analisar todos os conteúdos salvos
2. Identificar padrões:
   - Tags mais comuns
   - Autores frequentes  
   - Tópicos cobertos
3. Detectar gaps:
   - Tags relacionadas ausentes
   - Tópicos complementares
4. Sugerir conteúdos para adicionar

## Exemplo de Uso

```
/codex-recommend "startups"
```

## Output Esperado

```
🎯 Recomendações baseadas em "startups":

📊 Sua biblioteca:
   - 15 artigos sobre startups
   - Tags principais: fundraising, pmf, growth
   - Autores: Paul Graham (8), Eric Ries (3)

🔍 Gaps identificados:
   - Marketing para startups (0 artigos)
   - Legal/compliance (1 artigo)
   - Team building (2 artigos)

💡 Conteúdos sugeridos:
   1. "Zero to One" - Peter Thiel
   2. "Traction" - Gabriel Weinberg (marketing)
   3. "The Hard Thing About Hard Things" - Ben Horowitz (team)
```

## Algoritmo

```python
def recommend(theme):
    # Contar tags relacionadas
    related_tags = get_related_tags(theme)
    tag_counts = count_tags_in_library()
    
    # Detectar underrepresented
    gaps = [tag for tag in related_tags if tag_counts.get(tag, 0) < 3]
    
    # Sugerir conteúdos conhecidos para esses gaps
    return suggest_content(gaps)
```

## Implementação Futura

Requer função `cmd_recommend()` + database de conteúdos sugeridos.
