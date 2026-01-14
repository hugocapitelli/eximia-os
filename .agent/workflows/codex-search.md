---
description: Buscar conteúdos no Codex usando FTS5
---

# Workflow: Buscar Conteúdos

Busca full-text no Codex usando SQLite FTS5.

## Passos

// turbo
1. Pegar query do usuário
2. Executar comando Python:
```bash
py X_Agents/codex_cli/cli.py search "{query}"
```
3. Retornar resultados ranqueados ao usuário

## Exemplo de Uso

```
/codex-search "product market fit"
/codex-search "paul graham startups"
```

## Output Esperado

```
🔍 Encontrados 5 resultados para 'product market fit':

1. [art_2026_003] How to Get Startup Ideas
   Autor: Paul Graham
   Tags: startups, ideas, pmf

2. [art_2026_015] The Lean Startup Methodology
   Autor: Eric Ries
   Tags: lean, mvp, pmf
...
```

## Dicas de Busca

- Busca é case-insensitive
- Suporta múltiplas palavras
- Ranqueamento automático por relevância via FTS5
