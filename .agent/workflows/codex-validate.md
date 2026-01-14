---
description: Validar conteúdo com Veritas
---

# Workflow: Validar com Veritas

Valida fatos e credibilidade do conteúdo usando Veritas.

## Passos

1. Buscar conteúdo por ID
2. Chamar Veritas via MCP:
```
eximia.run_agent(
    agent_name="the_veritas",
    query="Validar: {content}"
)
```
3. Atualizar credibility_score no database
4. Adicionar notas de validação

## Exemplo de Uso

```
/codex-validate art_2026_001
```

## Output Esperado

```
🔍 Validando com Veritas: How to Make Wealth

⏳ Analisando credibilidade...

✅ Validação concluída:

📊 Credibility Score: 0.92

✅ Pontos fortes:
   - Autor reconhecido (Paul Graham, fundador YC)
   - Claims verificáveis
   - Lógica consistente

⚠️  Considerações:
   - Alguns exemplos são anedóticos
   - Contexto: escrito em 2004

💾 Salvando score no database...
✅ Score atualizado: art_2026_001.credibility_score = 0.92
```

## Integração MCP (Futuro)

Requer servidor `eximia_runtime` configurado e funcional.

```python
def cmd_validate(self, content_id: str):
    content = db.get_content(content_id)
    
    # Chamar Veritas via MCP
    result = mcp.run_agent(
        agent_name="the_veritas",
        query=f"Validar credibilidade: {content.title}\n\n{content.text}"
    )
    
    # Extrair score
    score = extract_credibility_score(result)
    
    # Atualizar DB
    db.update_content(
        content_id,
        credibility_score=score,
        notes=result.summary
    )
```
