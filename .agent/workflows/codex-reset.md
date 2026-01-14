---
description: 🗑️ Resetar database do Codex (APAGA TUDO)
---

# /codex-reset

⚠️ **ATENÇÃO**: Este comando APAGA TODO O DATABASE do Codex!

## Passos

1. Executar o comando:
```bash
py 00_Codex/Agentes/codex_cli/cli.py reset
```

2. Confirmar digitando `SIM` quando solicitado

3. O database será limpo de todas as tabelas:
   - `contents` - todos os conteúdos
   - `content_tags` - todas as tags
   - `relationships` - todos os relacionamentos
   - `processing_history` - todo o histórico

## Uso

Use apenas quando quiser começar do zero com a biblioteca.

💡 Para recriar completamente o database (incluindo schema), use:
```bash
Remove-Item "00_Codex/eximia_data/vault.db" -Force
py 00_Codex/scripts/init_db.py
```
