---
description: Listar conteúdos do Codex
---

# Workflow: Listar Conteúdos

Lista todos os conteúdos salvos no Codex com opções de filtros.

## Passos

// turbo
1. Executar comando Python:
```bash
py X_Agents/codex_cli/cli.py list
```

2. Retornar tabela formatada ao usuário

## Filtros Opcionais

```bash
# Por tipo
py X_Agents/codex_cli/cli.py list --type article

# Por autor
py X_Agents/codex_cli/cli.py list --author "Paul Graham"

# Por status
py X_Agents/codex_cli/cli.py list --status library
```

## Exemplo de Uso

```
/codex-list
/codex-list --type article
```

## Output Esperado

```
📚 Encontrados 15 itens:

ID              Título                                   Tipo            Tags
----------------------------------------------------------------------------------------------------
art_2026_001    How to Make Wealth                       article         startups, wealth, business
art_2026_002    Beating the Averages                     article         programming, lisp
...
```
