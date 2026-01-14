---
description: Processar conteúdo com Intellex
---

# Workflow: Processar com Intellex

Envia conteúdo para o Intellex processar (resumos, frameworks, etc).

## Passos

1. Buscar conteúdo por ID
2. Chamar Intellex via MCP:
```
eximia.run_agent(
    agent_name="intellex",
    query="Processar conteúdo: {content}"
)
```
3. Salvar output em `02_PROCESSED/`
4. Registrar no processing_history

## Exemplo de Uso

```
/codex-process art_2026_001
```

## Output Esperado

```
🧠 Processando com Intellex: How to Make Wealth

📊 Opções de processamento:
   1. Resumo LX (2-3 páginas)
   2. Framework conceitual
   3. Mind map
   4. Flashcards

Escolha: 1

⏳ Processando com Intellex...
✅ Processamento concluído!

Salvo em: 02_PROCESSED/art_2026_001_summary_lx.md
```

## Integração MCP (Futuro)

Requer servidor `eximia_runtime` configurado e funcional.

```python
def cmd_process(self, content_id: str, mode: str = 'summary'):
    content = db.get_content(content_id)
    
    # Chamar Intellex via MCP
    result = mcp.run_agent(
        agent_name="intellex",  
        query=f"Processar: {content.title}",
        mode=mode
    )
    
    # Salvar output
    output_path = f"02_PROCESSED/{content_id}_{mode}.md"
    save(result, output_path)
    
    # Registrar
    db.add_processing(content_id, "intellex", mode, output_path)
```
