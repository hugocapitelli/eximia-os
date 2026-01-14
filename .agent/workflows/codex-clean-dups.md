---
description: Remover duplicatas do database do Codex
---

# /codex-clean-dups

Remove automaticamente entradas duplicadas do database baseado no título.

## Passos

1. Executar o comando:
```bash
py 00_Codex/Agentes/codex_cli/cli.py clean-dups
```

2. O sistema irá:
   - Identificar conteúdos com títulos idênticos
   - Manter a primeira entrada
   - Remover as duplicatas
   - Exibir relatório de remoções

## Saída esperada

```
🔍 Buscando duplicatas...

📄 'Como a IA Generativa...' - 3 cópias
   🗑️  Removido: art_2026_002
   🗑️  Removido: art_2026_003

✅ 2 duplicatas removidas!
```

## Quando usar

- Após múltiplas tentativas de add que geraram duplicatas
- Para limpar a biblioteca periodicamente
- Antes de exportar pacotes temáticos
