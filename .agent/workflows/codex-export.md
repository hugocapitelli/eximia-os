---
description: Exportar pacote temático de conteúdos
---

# Workflow: Exportar Pacote Temático

Cria pacote com todos os conteúdos relacionados a um tema específico.

## Passos

1. Buscar todos os conteúdos com tag/tema
2. Criar pasta em `03_EXPORTS/`
3. Copiar arquivos markdown
4. Gerar índice (README.md)
5. Criar ZIP (opcional)

## Exemplo de Uso

```
/codex-export "startups"
```

## Output Esperado

```
📦 Criando pacote: startups

🔍 Encontrados 18 conteúdos:
   - 15 articles
   - 2 books
   - 1 research_paper

📁 Criando estrutura em 03_EXPORTS/startups_2026-01-09/
   ├── README.md
   ├── articles/
   │   ├── art_2026_001.md
   │   ├── art_2026_002.md
   │   └── ...
   ├── books/
   └── research_papers/

✅ Pacote criado com sucesso!
   Localização: 00_Codex/eximia_data/03_EXPORTS/startups_2026-01-09/
   
💡 Deseja criar ZIP? (s/N): s
📦 ZIP criado: startups_2026-01-09.zip
```

## Estrutura do README.md

```markdown
# Pacote Codex: Startups

**Criado em:** 2026-01-09  
**Total de itens:** 18

## Conteúdo

### Articles (15)
- [How to Make Wealth](articles/art_2026_001.md) - Paul Graham
- [Beating the Averages](articles/art_2026_002.md) - Paul Graham
...

### Books (2)
- [The Lean Startup](books/book_2026_001.md) - Eric Ries
...

## Tags
startups, entrepreneurship, fundraising, pmf, growth, business
```

## Implementação Futura

```python
def cmd_export(self, theme: str, create_zip: bool = False):
    # Buscar conteúdos
    contents = db.search(theme)
    
    # Criar estrutura
    export_dir = f"03_EXPORTS/{theme}_{date.today()}"
    os.makedirs(export_dir)
    
    # Copiar arquivos
    for content in contents:
        shutil.copy(content.file_path, export_dir)
    
    # Gerar README
    create_export_readme(contents, export_dir)
    
    # ZIP opcional
    if create_zip:
        shutil.make_archive(export_dir, 'zip', export_dir)
```
