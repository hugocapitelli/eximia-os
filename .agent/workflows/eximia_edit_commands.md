---
description: Cria ou exclui comandos Slash do Eximia Runtime
---
1. Identifique a ação solicitada: CRIAR ou EXCLUIR.

## Para CRIAR um novo comando:
2. Pergunte ao usuário:
   - Nome do comando (ex: "business")
   - Descrição curta
   - Qual agente chamar (ou fluxo)
3. Crie um arquivo `.agent/workflows/[nome].md` com o template:
```markdown
---
description: [descrição do usuário]
---
1. Analise o pedido do usuário.
2. Chame `eximia_runtime.run_agent` com agent_name="[agente]" e a query.
3. Execute seguindo as instruções do agente.
4. Chame `eximia_runtime.save_output` ao finalizar.
```
4. Confirme: "Comando /[nome] criado com sucesso!"

## Para EXCLUIR um comando:
2. Liste os comandos existentes.
3. Confirme com o usuário qual excluir.
4. Delete o arquivo `.agent/workflows/[nome].md`.
5. Confirme: "Comando /[nome] removido."
