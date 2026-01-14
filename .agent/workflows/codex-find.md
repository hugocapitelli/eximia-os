---
description: Busca avançada com múltiplos filtros
---

# Workflow: Busca Avançada

Busca conteúdos usando combinação de filtros.

## Passos

// turbo
1. Montar query com filtros
2. Executar busca no database
3. Retornar resultados

## Filtros Disponíveis

```bash
# Por tipo
--type article

# Por autor
--author "Paul Graham"

# Por tags
--tags startup,business

# Por data
--after 2024-01-01
--before 2024-12-31

# Por score de credibilidade
--min-credibility 0.8

# Combinar filtros
py 00_Codex/Agentes/codex_cli/cli.py find --type article --author "Paul Graham" --tags startup
```

## Exemplo de Uso

```
/codex-find --type article --tags startup
```

## Implementação Futura

Requer função `cmd_find()` com suporte a queries complexas.
