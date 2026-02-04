---
title: "CLI Design Patterns"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-cli-design-patterns"
  - "cli design patterns"
  - "princípios de design"
  - "1. comandos intuitivos"
  - "2. feedback claro"
  - "3. confirmações para ações des"
  - "estrutura de comandos"
  - "padrão base"
  - "subcomandos vs flags"
  - "output formatting"
tags:
  - "galaxy-codex"
  - "knowledge-base"
---

# CLI Design Patterns

## Princípios de Design

### 1. Comandos Intuitivos
- Nomes verbos claros: `add`, `list`, `search`, `delete`
- Flags descritivas: `--type`, `--author`, `--status`
- Help sempre disponível: `-h`, `--help`

### 2. Feedback Claro
```
✅ Success messages (verde)
❌ Error messages (vermelho)
⚠️  Warning messages (amarelo)
🔍 Info messages (azul)
```

### 3. Confirmações para Ações Destrutivas
```python
response = input("⚠️  Deletar 'article.md'? (s/N): ")
if response.lower() != 's':
    print("❌ Operação cancelada")
    return
```

## Estrutura de Comandos

### Padrão Base
```
comando [subcomando] <argumentos> [--flags]
```

**Exemplos:**
```bash
codex add https://url.com
codex list --type article
codex search "query" --limit 10
```

### Subcomandos vs Flags
- Subcomandos para ações: `add`, `list`, `search`
- Flags para opções: `--type`, `--author`, `--limit`

## Output Formatting

### Tabelas
```python
print(f"{'ID':<15} {'Título':<40} {'Tipo':<15}")
print("-" * 70)
for item in items:
    print(f"{item.id:<15} {item.title:<40} {item.type:<15}")
```

### Progress Indicators
```python
import sys

for i, url in enumerate(urls, 1):
    print(f"\r🔍 Processing {i}/{len(urls)}...", end='', flush=True)
    process(url)
print("\n✅ Done!")
```

### Colors (opcional)
```python
from colorama import Fore, Style

print(f"{Fore.GREEN}✅ Success{Style.RESET_ALL}")
print(f"{Fore.RED}❌ Error{Style.RESET_ALL}")
```

## Error Handling

### Exit Codes
```python
# 0 = Success
# 1 = General error
# 2 = Invalid arguments
# 3 = Not found

sys.exit(0)  # success
sys.exit(1)  # error
```

### Error Messages
```python
try:
    process()
except FileNotFoundError:
    print("❌ Erro: Arquivo não encontrado")
    sys.exit(1)
except Exception as e:
    print(f"❌ Erro inesperado: {e}")
    sys.exit(1)
```

## Argparse Best Practices

```python
import argparse

parser = argparse.ArgumentParser(
    description="Codex CLI",
    epilog="Use 'codex COMMAND --help' para mais info"
)

subparsers = parser.add_subparsers(dest='command')

# add
add_parser = subparsers.add_parser('add', help='Adicionar conteúdo')
add_parser.add_argument('url', help='URL para adicionar')
add_parser.add_argument('--auto', action='store_true', help='Pular review')

# list
list_parser = subparsers.add_parser('list', help='Listar conteúdos')
list_parser.add_argument('--type', help='Filtrar por tipo')
list_parser.add_argument('--limit', type=int, default=100)
```

## Interactive Mode

```python
def interactive_review(content):
    print("\n📋 Preview:")
    print(f"   Título: {content.title}")
    print(f"   Autor: {content.author}")
    print(f"   Tags: {', '.join(content.tags)}")
    
    while True:
        choice = input("\n[a]provar, [e]ditar, [c]ancelar: ").lower()
        if choice == 'a':
            return 'approve'
        elif choice == 'e':
            return 'edit'
        elif choice == 'c':
            return 'cancel'
        else:
            print("❌ Opção inválida")
```

## Referências

- [Click Documentation](https://click.palletsprojects.com/)
- [Argparse Tutorial](https://docs.python.org/3/howto/argparse.html)
- [Rich CLI Library](https://rich.readthedocs.io/)

#galaxy-codex