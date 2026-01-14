---
description: Upload de arquivo local para o Codex
---

# Workflow: Upload de Arquivo Local

Adiciona arquivos locais (PDFs, ePubs, .md) ao Codex.

## Passos

1. Pedir caminho do arquivo ao usuário
2. Validar que arquivo existe
3. Copiar para INBOX
4. Chamar categorizer para análise
5. Salvar no database

## Exemplo de Uso

```
/codex-upload
```

O sistema pedirá o caminho do arquivo.

## Tipos Suportados

- `.md` - Markdown
- `.pdf` - PDFs
- `.epub` - eBooks
- `.txt` - Texto plano

## Implementação Futura

Requer adicionar função `cmd_upload()` em `cli.py`:

```python
def cmd_upload(self, file_path: str) -> dict:
    # Validar arquivo
    # Copiar para INBOX
    # Categorizar
    # Salvar no DB
```
