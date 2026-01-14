---
description: Ver estatísticas do Codex
---

# Workflow: Estatísticas do Codex

Exibe estatísticas completas do repositório de conhecimento.

## Passos

// turbo
1. Executar comando Python:
```bash
py X_Agents/codex_cli/cli.py stats
```
2. Retornar estatísticas formatadas ao usuário

## Exemplo de Uso

```
/codex-stats
```

## Output Esperado

```
📊 Estatísticas do Codex

📚 Total: 42 itens

Por Tipo:
   article: 30
   book: 5
   research_paper: 7

Por Status:
   library: 38
   inbox: 4

🏷️  Top Tags:
   startups: 15
   programming: 12
   business: 10
   technology: 8
   ...

✍️  Top Autores:
   Paul Graham: 12
   Eric Ries: 5
   ...
```

## Informações Exibidas

- Total de itens
- Distribuição por tipo
- Distribuição por status
- Top 10 tags mais usadas
- Top 10 autores mais frequentes
