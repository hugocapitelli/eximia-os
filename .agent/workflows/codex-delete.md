---
description: Deletar conteúdo específico do Codex
---

# /codex-delete

Remove um conteúdo específico do database por ID.

## Passos

1. Identificar o ID do conteúdo a deletar
   - Use `/codex-list` para ver todos os IDs

2. Executar o comando:
```bash
py 00_Codex/Agentes/codex_cli/cli.py delete {content_id}
```

## Exemplo

```bash
# Deletar artigo pelo ID
py 00_Codex/Agentes/codex_cli/cli.py delete como_a_ia_generativa_na_aws
```

## O que é removido

- Entrada na tabela `contents`
- Tags associadas em `content_tags`
- Relacionamentos em `relationships`

⚠️ O arquivo `.md` no INBOX/LIBRARY **não é removido** automaticamente.
