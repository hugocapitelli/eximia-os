---
description: Adicionar conteúdo ao Codex com review manual
---

# Workflow: Adicionar Conteúdo com Review

Este comando extrai conteúdo de uma URL, categoriza automaticamente e salva no Codex após aprovação do usuário.

## Funcionalidades

- **Extração inteligente** do conteúdo principal
- **Limpeza automática** de elementos de UI (login walls, cookies, navegação)
- **Reconstrução de parágrafos** fragmentados
- **Detecção de estrutura** (títulos e subtítulos)
- **Nome de arquivo** baseado no título do conteúdo

## Passos

1. Pedir a URL ao usuário se não foi fornecida
2. Executar o comando Python:
```bash
py 00_Codex/Agentes/codex_cli/cli.py add {url}
```
3. O script irá:
   - Extrair o conteúdo da URL
   - Limpar elementos de UI automaticamente
   - Categorizar com IA (Gemini)
   - Mostrar preview
   - Aguardar aprovação do usuário
   - Salvar no database se aprovado
4. Retornar status ao usuário

## Exemplo de Uso

```
/codex-add https://paulgraham.com/wealth.html
```

## Output Esperado

```
🔍 Extraindo conteúdo de: https://paulgraham.com/wealth.html
✅ Conteúdo extraído: how_to_make_wealth
   Título: How to Make Wealth
   Palavras: 3500

🤖 Categorizando com IA...
✅ Categorização completa:
   Tipo: article
   Tags: startups, wealth, business
   Confiança: 0.92

📋 Preview:
   ID: how_to_make_wealth
   ...

✅ Aprovar e adicionar à biblioteca? (s/N):
```
