---
description: Atualiza um agente existente com novas informações ou melhorias
---
1. Identifique o nome do agente a atualizar e a melhoria desejada.
2. **Fase 1: Pesquisa (The_Veritas)**
   - Se a atualização requer novos conhecimentos, chame `eximia_runtime.run_agent` com agent_name="the_veritas" para pesquisar as novas informações.
3. **Fase 2: Atualização**
   - Para adicionar Knowledge Base: crie novo arquivo em `[agente]/02_profile/knowledge_base/`
   - Para ajustar prompt: edite `[agente]/03_prompt/prompt_operacional.md`
   - Para adicionar schema: atualize `input_schema.json` ou `output_schema.json`
4. Atualize o `CHANGELOG.md` do agente com a data e descrição da mudança.
5. Confirme ao usuário: "Agente [nome] atualizado com sucesso!"
