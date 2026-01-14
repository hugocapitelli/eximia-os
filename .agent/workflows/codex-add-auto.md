---
description: Adicionar conteúdo ao Codex automaticamente (sem review)
---

# Workflow: Adicionar Conteúdo Automático

Adiciona conteúdo ao Codex sem solicitar aprovação do usuário.

## Passos

// turbo
1. Pegar URL do usuário
2. Executar comando Python:
```bash
py X_Agents/codex_cli/cli.py add-auto {url}
```
3. O script irá:
   - Extrair o conteúdo
   - Categorizar com IA
   - Salvar direto no database (pula review)
4. Retornar confirmação ao usuário

## Exemplo de Uso

```
/codex-add-auto https://example.com/article
```

## Output Esperado

```
🔍 Extraindo conteúdo de: https://example.com/article
✅ Conteúdo extraído: art_2026_005
   Título: Example Article Title
   
🤖 Categorizando com IA...
✅ Categorização completa:
   Tipo: article
   Tags: example, demo, test

💾 Salvando no database...
✅ Conteúdo adicionado com sucesso!
   ID: art_2026_005
   Status: inbox
```

## Quando Usar

- Para adicionar múltiplos artigos rapidamente
- Quando você confia na categorização automática
- Para fontes conhecidas e confiáveis

## Nota

Conteúdos adicionados via `add-auto` ficam no status `inbox` e podem ser revisados depois com `/codex-review` (quando implementado).
