---
description: Re-categorizar conteúdo manualmente
---

# Workflow: Re-categorizar Conteúdo

Permite editar manualmente tipo, tags e metadata de um conteúdo.

## Passos

1. Buscar conteúdo por ID
2. Mostrar categorização atual
3. Permitir edição:
   - Tipo
   - Tags
   - Autor
   - Notas
4. Salvar mudanças no database

## Exemplo de Uso

```
/codex-tag art_2026_001
```

## Fluxo Interativo

```
📝 Re-categorizando: How to Make Wealth

Tipo atual: article
Novo tipo (Enter para manter): 

Tags atuais: startups, wealth, business
Novas tags (separadas por vírgula): startups, entrepreneurship, essays

Autor atual: Paul Graham
Novo autor (Enter para manter):

Salvar mudanças? (s/N): s

✅ Conteúdo re-categorizado com sucesso!
```

## Implementação Futura

```python
def cmd_tag(self, content_id: str):
    # Buscar conteúdo
    content = db.get_content(content_id)
    
    # Editor interativo
    new_type = input(f"Tipo [{content.type}]: ") or content.type
    new_tags = input(f"Tags [{','.join(content.tags)}]: ")
    
    # Atualizar DB
    db.update_content(content_id, type=new_type, tags=new_tags.split(','))
```
