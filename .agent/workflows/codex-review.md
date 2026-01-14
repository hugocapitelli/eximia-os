---
description: Revisar conteúdos pendentes no INBOX
---

# Workflow: Revisar Pendentes

Lista e permite revisar conteúdos que estão no INBOX aguardando aprovação.

## Passos

// turbo
1. Executar comando Python:
```bash
py 00_Codex/Agentes/codex_cli/cli.py list --status inbox
```

2. Para cada item, mostrar preview e opções:
   - Aprovar → mover para LIBRARY
   - Editar tags → re-categorizar
   - Deletar → remover

## Exemplo de Uso

```
/codex-review
```

## Output Esperado

```
📋 Conteúdos pendentes no INBOX:

1. [art_2026_005] Example Article
   Tags: example, demo
   [a]provar, [e]ditar, [d]eletar, [p]ular
   
Escolha: 
```

## Implementação Futura

Requer função `cmd_review()` no cli.py.
